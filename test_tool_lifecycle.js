const fs = require('fs');
const path = require('path');
const { getClient } = require('./research_utils');

async function main() {
  const client = await getClient();
  console.log('Connected to SketchUp Web via CDP!');

  const toolsToInvestigate = [
    { name: 'Select', cmd: 'SelectionCommandId', shortcut: 'Space' },
    { name: 'Lasso Select', cmd: 'LassoCommandId', shortcut: 'None' },
    { name: 'Eraser', cmd: 'EraseCommandId', shortcut: 'E' },
    { name: 'Line (Pencil)', cmd: 'PencilCommandId', shortcut: 'L' },
    { name: 'Freehand', cmd: 'FreehandCommandId', shortcut: 'None' },
    { name: 'Arc (2-Point)', cmd: 'ArcCommandId', shortcut: 'A' },
    { name: 'Rectangle', cmd: 'RectangleCommandId', shortcut: 'R' },
    { name: 'Rotated Rectangle', cmd: 'RotatedRectangleCommandId', shortcut: 'None' },
    { name: 'Circle', cmd: 'CircleCommandId', shortcut: 'C' },
    { name: 'Polygon', cmd: 'PolygonCommandId', shortcut: 'None' },
    { name: 'Push/Pull', cmd: 'PushPullCommandId', shortcut: 'P' },
    { name: 'Follow Me', cmd: 'FollowMeCommandId', shortcut: 'None' },
    { name: 'Offset', cmd: 'OffsetCommandId', shortcut: 'F' },
    { name: 'Move', cmd: 'MoveCommandId', shortcut: 'M' },
    { name: 'Rotate', cmd: 'RotateCommandId', shortcut: 'Q' },
    { name: 'Scale', cmd: 'ScaleCommandId', shortcut: 'S' },
    { name: 'Tape Measure', cmd: 'TapeMeasureCommandId', shortcut: 'T' },
    { name: 'Protractor', cmd: 'ProtractorCommandId', shortcut: 'None' },
    { name: 'Paint Bucket', cmd: 'PaintBucketCommandId', shortcut: 'B' },
    { name: 'Sample Material (Eye Dropper)', cmd: 'PaintMatchCommandId', shortcut: 'Alt + B' },
    { name: 'Dimension', cmd: 'DimensionCommandId', shortcut: 'D' },
    { name: 'Section Plane', cmd: 'SectionCommandId', shortcut: 'None' },
    { name: 'Axes', cmd: 'AxesCommandId', shortcut: 'None' },
    { name: 'Orbit', cmd: 'OrbitCommandId', shortcut: 'O / Middle Mouse' },
    { name: 'Pan', cmd: 'PanCommandId', shortcut: 'H / Shift + Middle Mouse' },
    { name: 'Zoom', cmd: 'ZoomCommandId', shortcut: 'Z / Scroll' },
    { name: 'Zoom Window', cmd: 'ZoomWindowCommandId', shortcut: 'Ctrl + Shift + W' },
    { name: 'Zoom Extents', cmd: 'ZoomExtentsId', shortcut: 'Shift + Z' },
    { name: 'Position Camera', cmd: 'PositionCameraCommandId', shortcut: 'None' },
    { name: 'Walk', cmd: 'WalkCommandId', shortcut: 'None' },
    { name: 'Look Around', cmd: 'LookAroundCommandId', shortcut: 'None' },
    { name: 'Draw 3D Text', cmd: '3DTextCommandId', shortcut: 'None' }
  ];

  const results = [];

  for (const tool of toolsToInvestigate) {
    console.log(`Investigating tool: ${tool.name} (${tool.cmd})...`);

    const toolData = await client.eval(`
      (() => {
        const mod = window.Module;
        const cmdId = mod['${tool.cmd}'];
        if (cmdId === undefined) {
          return { error: 'Command ID not found on Module: ${tool.cmd}' };
        }

        const prevToolId = mod.GetActiveToolId();
        
        // Execute tool activation command
        mod.RunCommand(cmdId);
        
        const activeToolId = mod.GetActiveToolId();
        const canvas = document.querySelector('canvas');
        const canvasCursor = canvas ? canvas.style.cursor : null;
        
        // Measurements box info
        const measurementsInput = document.querySelector('#measurements-box, [class*="measurement"] input, input[name*="measurement"]');
        const measurementsContainer = measurementsInput?.closest('[class*="measurement"]') || measurementsInput?.parentElement;
        const measurementsLabel = measurementsContainer ? (measurementsContainer.querySelector('label, [class*="title"], [class*="label"]')?.innerText || null) : null;
        
        // Status bar info
        const statusBar = document.querySelector('footer, [class*="status-bar"], [class*="statusbar"]');
        const statusBarText = statusBar ? statusBar.innerText : null;

        // Modifier keys & hint icons in footer
        const modifierBadges = Array.from(document.querySelectorAll('footer [class*="badge"], footer [class*="key"], footer [class*="hint"], footer button, footer span')).map(el => el.innerText?.trim()).filter(Boolean);

        return {
          cmdId: cmdId,
          prevToolId: prevToolId,
          activeToolId: activeToolId,
          isNowActive: activeToolId === cmdId,
          canvasCursor: canvasCursor,
          measurements: {
            label: measurementsLabel,
            placeholder: measurementsInput?.placeholder || null,
            value: measurementsInput?.value || null,
            readOnly: measurementsInput?.readOnly || false
          },
          statusBarText: statusBarText,
          modifierBadges: Array.from(new Set(modifierBadges))
        };
      })()
    `);

    results.push({
      tool: tool.name,
      commandKey: tool.cmd,
      defaultShortcut: tool.shortcut,
      data: toolData
    });
  }

  // Restore back to Selection Tool
  await client.eval(`
    (() => {
      const mod = window.Module;
      mod.RunCommand(mod.SelectionCommandId);
    })()
  `);
  console.log('Restored tool back to SelectionCommandId (Select Tool)');

  const outPath = path.join(__dirname, '03_TOOL_BEHAVIOR', 'tools_investigation_matrix.json');
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2), 'utf8');
  console.log(`Saved tool investigation matrix to ${outPath}`);

  client.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
