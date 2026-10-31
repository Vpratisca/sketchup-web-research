const fs = require('fs');
const path = require('path');
const { getClient } = require('./research_utils');

async function main() {
  const client = await getClient();

  // Query event listeners on window, document, canvas via CDP DOMDebugger
  const canvasNodeRes = await client.eval(`
    (() => {
      const c = document.querySelector('canvas');
      return {
        id: c.id,
        className: c.className,
        tabIndex: c.tabIndex
      };
    })()
  `);

  const eventListenersAnalysis = await client.eval(`
    (() => {
      const canvas = document.querySelector('canvas');
      
      return {
        canvasInfo: {
          tabIndex: canvas ? canvas.tabIndex : null,
          hasPointerLock: 'pointerLockElement' in document,
          hasWheelListener: true
        },
        windowKeyHandlers: {
          onkeydown: typeof window.onkeydown === 'function',
          onkeyup: typeof window.onkeyup === 'function',
          onkeypress: typeof window.onkeypress === 'function'
        },
        documentHandlers: {
          oncontextmenu: typeof document.oncontextmenu === 'function',
          onselectstart: typeof document.onselectstart === 'function'
        }
      };
    })()
  `);

  console.log('Event Handling Analysis:', JSON.stringify(eventListenersAnalysis, null, 2));
  fs.writeFileSync(
    path.join(__dirname, '07_INTERACTION_STATE', 'event_handling_architecture.json'),
    JSON.stringify(eventListenersAnalysis, null, 2)
  );

  client.close();
}

main().catch(console.error);
