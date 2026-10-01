import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Manulife Benefits Assistant',
  description: 'AI-powered assistant for understanding your benefits',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
