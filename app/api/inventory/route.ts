import { NextResponse } from 'next/server';

export type InventoryItem = {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  location: string;
  minStock: number;
};

const BASE: InventoryItem[] = [
  { id: '1', name: 'Cardboard Boxes (S)', sku: 'BX-S-100', quantity: 520, location: 'A1', minStock: 200 },
  { id: '2', name: 'Cardboard Boxes (M)', sku: 'BX-M-200', quantity: 310, location: 'A2', minStock: 200 },
  { id: '3', name: 'Packing Tape', sku: 'TP-CLR-50', quantity: 145, location: 'B1', minStock: 100 },
  { id: '4', name: 'Bubble Wrap', sku: 'BW-500', quantity: 72, location: 'B3', minStock: 60 },
  { id: '5', name: 'Pallet Wrap', sku: 'PW-STD', quantity: 29, location: 'C2', minStock: 40 },
  { id: '6', name: 'Shipping Labels', sku: 'LB-ZPL-4x6', quantity: 900, location: 'D4', minStock: 300 },
  { id: '7', name: 'Gloves', sku: 'GL-XL', quantity: 180, location: 'E1', minStock: 120 },
  { id: '8', name: 'Handheld Scanner', sku: 'SC-HH-2', quantity: 12, location: 'F2', minStock: 10 },
];

export function GET() {
  // In a real app, fetch from DB. Here we serve a static baseline that the SSE mutates virtually on the client feed.
  return NextResponse.json(BASE);
}
