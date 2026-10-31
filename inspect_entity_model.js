const fs = require('fs');
const path = require('path');
const { getClient } = require('./research_utils');

async function main() {
  const client = await getClient();

  const entityModelData = await client.eval(`
    (() => {
      const mod = window.Module || {};
      
      // 1. Check Component Definitions
      let compList = [];
      try {
        if (typeof mod.WebComponentBrowser === 'function') {
          // check browser
        }
      } catch (e) {}

      // 2. Check Layers / Tags
      let layers = [];
      try {
        if (typeof mod.TagTreeBrowser === 'function') {
          const ttb = new mod.TagTreeBrowser();
          // check methods
        }
      } catch (e) {}

      // 3. Check Materials
      let materials = [];
      try {
        if (typeof mod.GetInModelMaterialName === 'function') {
          for (let i = 0; i < 20; i++) {
            const name = mod.GetInModelMaterialName(i);
            if (name) materials.push({ index: i, name: name });
          }
        }
      } catch (e) {}

      // 4. Check Styles
      let styles = [];
      try {
        if (typeof mod.WebStylesBrowserData === 'function') {
          // styles browser
        }
      } catch (e) {}

      return {
        materials: materials,
        hasTagTreeBrowser: typeof mod.TagTreeBrowser === 'function',
        hasWebEntityInfo: typeof mod.WebEntityInfo === 'function',
        hasWebMaterialBrowser: typeof mod.WebMaterialBrowser === 'function',
        hasWebStylesBrowser: typeof mod.WebStylesBrowser === 'function',
        hasWebScenesBrowser: typeof mod.WebScenesBrowser === 'function'
      };
    })()
  `);

  console.log('Entity & Model Data:', JSON.stringify(entityModelData, null, 2));
  fs.writeFileSync(
    path.join(__dirname, '06_ENTITY_MODEL', 'entity_model_architecture.json'),
    JSON.stringify(entityModelData, null, 2)
  );

  client.close();
}

main().catch(console.error);
