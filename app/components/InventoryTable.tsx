"use client";

import React from 'react';

export type InventoryItem = {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  location: string;
  minStock: number;
};

export function InventoryTable({ items }: { items: InventoryItem[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-700/40 bg-[--card]">
      <table className="min-w-full divide-y divide-slate-700/40">
        <thead>
          <tr className="bg-slate-800/40">
            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-200">Item</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-200">SKU</th>
            <th className="px-4 py-3 text-right text-sm font-semibold text-slate-200">Quantity</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-200">Location</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-200">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/40">
          {items.map((item) => {
            const low = item.quantity <= item.minStock;
            return (
              <tr key={item.id} className="hover:bg-slate-800/30">
                <td className="px-4 py-3 text-sm text-slate-100">{item.name}</td>
                <td className="px-4 py-3 text-sm text-slate-400">{item.sku}</td>
                <td className="px-4 py-3 text-right text-sm font-mono text-slate-100">{item.quantity}</td>
                <td className="px-4 py-3 text-sm text-slate-300">{item.location}</td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={
                      "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs " +
                      (low
                        ? "bg-red-500/10 text-red-300 ring-1 ring-inset ring-red-500/30"
                        : "bg-emerald-500/10 text-emerald-300 ring-1 ring-inset ring-emerald-500/30")
                    }
                  >
                    <span className={"h-2 w-2 rounded-full " + (low ? "bg-red-400" : "bg-emerald-400")} />
                    {low ? "Low Stock" : "OK"}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
