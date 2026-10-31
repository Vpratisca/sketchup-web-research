const fs = require('fs');
const path = require('path');
const { getClient } = require('./research_utils');

const BASE_DIR = path.join(__dirname);

async function main() {
  const client = await getClient();
  console.log('Connected to SketchUp Web via CDP!');

  // 1. Inspect WebGL2 Context and Rendering Architecture
  console.log('--- Inspecting WebGL2 Context ---');
  const webglInfo = await client.eval(`
    (() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return { error: 'No canvas found' };
      
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (!gl) return { error: 'No WebGL context found' };

      const ext = gl.getSupportedExtensions();
      const params = {};
      const queryParams = [
        'VENDOR', 'RENDERER', 'VERSION', 'SHADING_LANGUAGE_VERSION',
        'MAX_TEXTURE_SIZE', 'MAX_VIEWPORT_DIMS', 'MAX_VERTEX_ATTRIBS',
        'MAX_VERTEX_UNIFORM_VECTORS', 'MAX_FRAGMENT_UNIFORM_VECTORS',
        'MAX_RENDERBUFFER_SIZE', 'MAX_COLOR_ATTACHMENTS', 'MAX_DRAW_BUFFERS',
        'DEPTH_BITS', 'STENCIL_BITS', 'SAMPLES', 'SAMPLE_BUFFERS'
      ];

      for (const p of queryParams) {
        try {
          params[p] = gl.getParameter(gl[p]);
        } catch (e) {
          params[p] = '<error: ' + e.message + '>';
        }
      }

      const dbg = gl.getExtension('WEBGL_debug_renderer_info');
      let unmaskedVendor = null;
      let unmaskedRenderer = null;
      if (dbg) {
        unmaskedVendor = gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL);
        unmaskedRenderer = gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL);
      }

      return {
        canvas: {
          width: canvas.width,
          height: canvas.height,
          clientWidth: canvas.clientWidth,
          clientHeight: canvas.clientHeight,
          style: canvas.getAttribute('style')
        },
        contextType: gl instanceof WebGL2RenderingContext ? 'WebGL2' : 'WebGL',
        contextAttributes: gl.getContextAttributes(),
        parameters: params,
        unmaskedVendor: unmaskedVendor,
        unmaskedRenderer: unmaskedRenderer,
        extensionsCount: ext.length,
        extensions: ext
      };
    })()
  `);

  fs.writeFileSync(
    path.join(BASE_DIR, '08_RENDERING_VIEWPORT', 'webgl_architecture.json'),
    JSON.stringify(webglInfo, null, 2)
  );
  console.log('Saved WebGL architecture report.');

  // 2. Extract SVG Symbols (Tool Icons)
  console.log('--- Inspecting SVG Symbols & Icons ---');
  const svgSymbols = await client.eval(`
    (() => {
      const symbols = Array.from(document.querySelectorAll('svg symbol')).map(s => ({
        id: s.id,
        viewBox: s.getAttribute('viewBox'),
        childrenCount: s.children.length
      }));
      return symbols;
    })()
  `);
  fs.writeFileSync(
    path.join(BASE_DIR, '02_UI_STRUCTURE', 'svg_symbols.json'),
    JSON.stringify(svgSymbols, null, 2)
  );
  console.log(`Saved ${svgSymbols.length} SVG symbols.`);

  // 3. Inspect Right Tray Panels (Side Panels)
  console.log('--- Inspecting Right-hand Trays / Panels ---');
  const trayPanels = await client.eval(`
    (() => {
      // Find all right sidebar buttons
      const buttons = Array.from(document.querySelectorAll('aside button, [class*="tray"] button, [class*="side-panel"] button, [class*="tray-panel"] button, [class*="dock"] button')).map(b => ({
        text: b.innerText?.trim(),
        ariaLabel: b.getAttribute('aria-label'),
        title: b.getAttribute('title'),
        className: b.className,
        rect: b.getBoundingClientRect()
      }));

      // Find all side panel contents/containers
      const panels = Array.from(document.querySelectorAll('[class*="side-panel"], [class*="tray"], [class*="inspector"], [role="tabpanel"]')).map(p => ({
        id: p.id,
        className: p.className,
        role: p.getAttribute('role'),
        ariaLabel: p.getAttribute('aria-label'),
        rect: p.getBoundingClientRect()
      }));

      return {
        buttons: buttons,
        panels: panels
      };
    })()
  `);
  fs.writeFileSync(
    path.join(BASE_DIR, '02_UI_STRUCTURE', 'right_trays.json'),
    JSON.stringify(trayPanels, null, 2)
  );

  // 4. Extract WebAssembly Module Detailed Symbols & Memory
  console.log('--- Inspecting WebAssembly Module Detailed Topology & Exports ---');
  const wasmDetails = await client.eval(`
    (() => {
      const mod = window.Module || {};
      const wasmExports = window.wasmExports || mod.wasmExports || mod.asm || {};
      const exportKeys = Object.keys(wasmExports);
      
      let memInfo = null;
      try {
        const mem = window.wasmMemory || mod.wasmMemory;
        if (mem && mem.buffer) {
          memInfo = {
            bufferByteLength: mem.buffer.byteLength,
            pages: mem.buffer.byteLength / 65536
          };
        }
      } catch (e) {
        memInfo = { error: e.message };
      }

      // Filter export keys by category
      const mathExports = exportKeys.filter(k => /vec|mat|geom|poly|point|plane|ray|intersect/i.test(k));
      const modelExports = exportKeys.filter(k => /model|entity|face|edge|vertex|loop|mesh|comp|group/i.test(k));
      const toolExports = exportKeys.filter(k => /tool|select|line|push|move|rotate|scale|arc/i.test(k));
      const renderExports = exportKeys.filter(k => /render|draw|gl|shader|camera|view/i.test(k));

      return {
        hasWasmExports: exportKeys.length > 0,
        totalWasmExports: exportKeys.length,
        exportKeysSample: exportKeys.slice(0, 100),
        mathExportsCount: mathExports.length,
        mathExportsSample: mathExports.slice(0, 50),
        modelExportsCount: modelExports.length,
        modelExportsSample: modelExports.slice(0, 50),
        toolExportsCount: toolExports.length,
        toolExportsSample: toolExports.slice(0, 50),
        renderExportsCount: renderExports.length,
        renderExportsSample: renderExports.slice(0, 50),
        memory: memInfo
      };
    })()
  `);
  fs.writeFileSync(
    path.join(BASE_DIR, '04_GEOMETRY_TOPOLOGY', 'wasm_exports_and_memory.json'),
    JSON.stringify(wasmDetails, null, 2)
  );
  console.log('Saved WebAssembly exports and memory report.');

  // 5. Inspect Tool Options and Context
  console.log('--- Inspecting Tool State Transitions & Callbacks ---');
  const toolState = await client.eval(`
    (() => {
      const mod = window.Module || {};
      const activeToolId = typeof mod.GetActiveToolId === 'function' ? mod.GetActiveToolId() : null;
      
      // Test querying tool commands
      const toolCommands = [
        'SelectionCommandId', 'PencilCommandId', 'FreehandCommandId', 'EraseCommandId',
        'OffsetCommandId', 'MoveCommandId', 'RotateCommandId', 'ScaleCommandId',
        'PaintBucketCommandId', 'TapeMeasureCommandId', 'OrbitCommandId', 'PanCommandId',
        'ZoomCommandId', 'ZoomExtentsId', 'FollowMeCommandId', 'ProtractorCommandId',
        'DimensionCommandId', 'SectionCommandId', 'AxesCommandId', 'TagCommandId',
        'OuterShellCommandId', 'IntersectCommandId', 'UnionCommandId', 'DifferenceCommandId',
        'TrimCommandId', 'SplitCommandId', 'DrawTextCommandId', 'SolidInspectorCommandId',
        'LassoCommandId', '3DTextCommandId', 'FlipCommandId', 'SnapsCommandId',
        'SoftenEdgesCommandId', 'WeldEdgesCommandId', 'ReverseFacesCommandId', 'OrientFacesCommandId'
      ];

      const commandStatus = {};
      for (const cmd of toolCommands) {
        const id = mod[cmd];
        if (id !== undefined) {
          commandStatus[cmd] = {
            id: id,
            isEnabled: typeof mod.IsCommandEnabled === 'function' ? mod.IsCommandEnabled(id) : null,
            isChecked: typeof mod.IsCommandChecked === 'function' ? mod.IsCommandChecked(id) : null
          };
        }
      }

      return {
        activeToolId: activeToolId,
        commandStatus: commandStatus
      };
    })()
  `);
  fs.writeFileSync(
    path.join(BASE_DIR, '03_TOOL_BEHAVIOR', 'tool_command_status.json'),
    JSON.stringify(toolState, null, 2)
  );
  console.log('Saved tool command status report.');

  client.close();
  console.log('Deep dive collection complete!');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
