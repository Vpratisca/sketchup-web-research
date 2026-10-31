const fs = require('fs');
const path = require('path');
const { getClient } = require('./research_utils');

async function main() {
  const client = await getClient();

  const unitsAndSnapping = await client.eval(`
    (() => {
      const mod = window.Module || {};
      const units = {};
      
      try {
        if (typeof mod.WebUnitsOptions === 'function') {
          const uo = new mod.WebUnitsOptions();
          const methods = [
            'getLengthFormat', 'getLengthPrecision', 'getLengthUnit',
            'getLengthSnapEnabled', 'getSnapLength',
            'getAngleSnapEnabled', 'getSnapAngle',
            'getAreaPrecision', 'getAreaUnit',
            'getVolumePrecision', 'getVolumeUnit'
          ];
          for (const m of methods) {
            try {
              if (typeof uo[m] === 'function') {
                units[m] = uo[m]();
              }
            } catch (e) {
              units[m] = e.message;
            }
          }
        }
      } catch (e) {
        units.error = e.message;
      }

      const styleEdges = {};
      try {
        if (typeof mod.CStyleEditorHelper === 'function') {
          const seh = new mod.CStyleEditorHelper();
          const methods = [
            'getDisplayEdges', 'getDisplayBackEdges', 'getDisplayProfileEdges',
            'getProfileEdgeThickness', 'getDisplayDepthCue', 'getDepthCueThickness',
            'getDisplayExtensionEdges', 'getExtensionThickness', 'getDisplayJitter',
            'getDisplayEndPoints', 'getEndPointsSize'
          ];
          for (const m of methods) {
            try {
              if (typeof seh[m] === 'function') {
                styleEdges[m] = seh[m]();
              }
            } catch (e) {
              styleEdges[m] = e.message;
            }
          }
        }
      } catch (e) {
        styleEdges.error = e.message;
      }

      return {
        unitsAndSnapping: units,
        styleEdges: styleEdges
      };
    })()
  `);

  console.log('Units & Snapping:', JSON.stringify(unitsAndSnapping, null, 2));
  fs.writeFileSync(
    path.join(__dirname, '05_INFERENCE_SYSTEM', 'snapping_and_style_options.json'),
    JSON.stringify(unitsAndSnapping, null, 2)
  );

  client.close();
}

main().catch(console.error);
