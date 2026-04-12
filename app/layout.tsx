import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mr.Bull',
  description: 'Mexican food, sandwich and hot dog',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
