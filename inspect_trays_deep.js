const fs = require('fs');
const path = require('path');
const { getClient } = require('./research_utils');

async function main() {
  const client = await getClient();

  const trayDetails = await client.eval(`
    (() => {
      const texts = [
        'Entity Info', 'Components', 'Instructor', '3D Warehouse',
        'Materials', 'Styles', 'Tags', 'Shadows', 'Scenes', 'Display',
        'Soften / Smooth', 'Model Info'
      ];
      const results = [];
      for (const t of texts) {
        const el = Array.from(document.querySelectorAll('*')).find(e => e.children.length === 0 && e.innerText?.trim() === t);
        if (el) {
          const btn = el.closest('button, [role="button"], [role="tab"], div');
          results.push({
            name: t,
            elementTag: el.tagName,
            elementClass: el.className,
            containerTag: btn?.tagName,
            containerClass: btn?.className,
            rect: btn?.getBoundingClientRect(),
            parentChain: [
              btn?.tagName + '.' + (btn?.className || ''),
              btn?.parentElement?.tagName + '.' + (btn?.parentElement?.className || ''),
              btn?.parentElement?.parentElement?.tagName + '.' + (btn?.parentElement?.parentElement?.className || '')
            ]
          });
        }
      }
      return results;
    })()
  `);

  console.log('Tray Details:', JSON.stringify(trayDetails, null, 2));
  fs.writeFileSync(
    path.join(__dirname, '02_UI_STRUCTURE', 'right_trays_detailed.json'),
    JSON.stringify(trayDetails, null, 2)
  );

  client.close();
}

main().catch(console.error);
