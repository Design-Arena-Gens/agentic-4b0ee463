import { InventoryTable } from './components/InventoryTable';
import { LiveFeed } from './components/LiveFeed';

async function fetchInventory(): Promise<import('./components/InventoryTable').InventoryItem[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/inventory`, { cache: 'no-store' });
  if (!res.ok) {
    return [];
  }
  return res.json();
}

export default async function Page() {
  const items = await fetchInventory();
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Warehouse Inventory</h1>
        <p className="text-slate-300">Realtime morning and night updates. Review stock levels and recent activity.</p>
      </header>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-100">Current Inventory</h2>
        <InventoryTable items={items} />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-100">Live Activity Feed</h2>
        <LiveFeed />
      </section>
    </div>
  );
}
