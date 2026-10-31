const fs = require('fs');
const path = require('path');
const { getClient } = require('./research_utils');

async function main() {
  const client = await getClient();

  const cameraAndModelState = await client.eval(`
    (() => {
      const mod = window.Module || {};
      
      const safeCall = (fnName, ...args) => {
        try {
          if (typeof mod[fnName] === 'function') {
            const res = mod[fnName](...args);
            // Handle emscripten vector or array if any
            return res;
          }
          return '<not a function>';
        } catch (e) {
          return '<error: ' + e.message + '>';
        }
      };

      let viewMatrix = null;
      try {
        if (typeof mod.getViewMatrix === 'function') {
          const m = mod.getViewMatrix();
          viewMatrix = m;
        }
      } catch (e) {
        viewMatrix = e.message;
      }

      let lengthUnits = null;
      try {
        if (typeof mod.getModelLengthUnits === 'function') {
          lengthUnits = mod.getModelLengthUnits();
        }
      } catch (e) {
        lengthUnits = e.message;
      }

      let fov = null;
      try {
        if (typeof mod.getFieldOfView === 'function') {
          fov = mod.getFieldOfView();
        }
      } catch (e) {
        fov = e.message;
      }

      let vpDims = null;
      try {
        if (typeof mod.getViewportDimensions === 'function') {
          vpDims = mod.getViewportDimensions();
        }
      } catch (e) {
        vpDims = e.message;
      }

      let camHeight = null;
      try {
        if (typeof mod.getCameraHeight === 'function') {
          camHeight = mod.getCameraHeight();
        }
      } catch (e) {
        camHeight = e.message;
      }

      let modelInfo = null;
      try {
        if (typeof mod.getModelInfo === 'function') {
          modelInfo = mod.getModelInfo();
        }
      } catch (e) {
        modelInfo = e.message;
      }

      let modelExtents = null;
      try {
        if (typeof mod.getModelExtents === 'function') {
          modelExtents = mod.getModelExtents();
        }
      } catch (e) {
        modelExtents = e.message;
      }

      return {
        fieldOfView: fov,
        viewMatrix: viewMatrix,
        viewportDimensions: vpDims,
        cameraHeight: camHeight,
        modelLengthUnits: lengthUnits,
        modelInfo: modelInfo,
        modelExtents: modelExtents
      };
    })()
  `);

  console.log('Camera and Model State:', JSON.stringify(cameraAndModelState, null, 2));
  fs.writeFileSync(
    path.join(__dirname, '08_RENDERING_VIEWPORT', 'camera_and_model_state.json'),
    JSON.stringify(cameraAndModelState, null, 2)
  );

  client.close();
}

main().catch(console.error);
