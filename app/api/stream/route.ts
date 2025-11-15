import { NextRequest } from 'next/server';

function isInWindow(date: Date) {
  const hour = date.getHours();
  return (hour >= 6 && hour < 9) || (hour >= 18 && hour < 21);
}

function getSeededItems() {
  return [
    { sku: 'BX-S-100', base: 520 },
    { sku: 'BX-M-200', base: 310 },
    { sku: 'TP-CLR-50', base: 145 },
    { sku: 'BW-500', base: 72 },
    { sku: 'PW-STD', base: 29 },
    { sku: 'LB-ZPL-4x6', base: 900 },
    { sku: 'GL-XL', base: 180 },
    { sku: 'SC-HH-2', base: 12 },
  ];
}

export const runtime = 'edge';

export async function GET(_req: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      let quantities = Object.fromEntries(getSeededItems().map((i) => [i.sku, i.base] as const));

      function send(event: unknown) {
        const data = `data: ${JSON.stringify(event)}\n\n`;
        controller.enqueue(encoder.encode(data));
      }

      function tick() {
        const now = new Date();
        if (!isInWindow(now)) {
          send({ timestamp: Date.now(), message: 'Outside update window. Waiting?' });
          return; // keep connection, but do not schedule spam
        }
        const items = getSeededItems();
        const pick = items[Math.floor(Math.random() * items.length)];
        const change = Math.floor(Math.random() * 11) - 5; // -5..+5
        const next = Math.max(0, quantities[pick.sku] + change);
        quantities[pick.sku] = next;
        const ev = {
          timestamp: Date.now(),
          message: change >= 0 ? `Restocked ${pick.sku}` : `Picked ${pick.sku}`,
          delta: { sku: pick.sku, change, newQuantity: next },
        };
        send(ev);
      }

      const interval = setInterval(tick, 1000);
      // Send initial hello
      send({ timestamp: Date.now(), message: 'Connected to live inventory feed' });

      const keepalive = setInterval(() => {
        controller.enqueue(encoder.encode(': keep-alive\n\n'));
      }, 15000);

      return () => {
        clearInterval(interval);
        clearInterval(keepalive);
      };
    },
    cancel() {},
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
