const fs = require('fs');
const path = require('path');
const { getClient } = require('./research_utils');

async function main() {
  const client = await getClient();

  const classData = await client.eval(`
    (() => {
      const mod = window.Module || {};
      const keys = Object.keys(mod);
      const classes = {};

      for (const k of keys) {
        try {
          const val = mod[k];
          if (typeof val === 'function' && val.prototype && typeof val.prototype === 'object') {
            const protoKeys = Object.getOwnPropertyNames(val.prototype);
            if (protoKeys.length > 1 || Object.keys(val).length > 0) {
              const staticKeys = Object.getOwnPropertyNames(val).filter(p => !['length', 'name', 'prototype', 'arguments', 'caller'].includes(p));
              classes[k] = {
                methods: protoKeys.filter(p => p !== 'constructor'),
                staticProps: staticKeys
              };
            }
          }
        } catch (e) {
          // ignore restricted getters
        }
      }

      return {
        totalClasses: Object.keys(classes).length,
        classes: classes
      };
    })()
  `);

  const outPath = path.join(__dirname, '04_GEOMETRY_TOPOLOGY', 'engine_classes_and_methods.json');
  fs.writeFileSync(outPath, JSON.stringify(classData, null, 2), 'utf8');
  console.log(`Saved ${classData.totalClasses} engine classes to ${outPath}`);
  client.close();
}

main().catch(console.error);
