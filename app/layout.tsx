import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Warehouse Inventory Updates',
  description: 'Realtime morning and night inventory updates',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <div className="container mx-auto px-4 py-8">{children}</div>
      </body>
    </html>
  );
}
