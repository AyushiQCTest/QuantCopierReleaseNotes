import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'QuantCopier - Release Notes',
  description: 'Release notes and changelog for QuantCopier MT5 Signal Copier',
  openGraph: {
    title: 'QuantCopier Release Notes',
    description: 'Latest updates and features for QuantCopier',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-slate-950">
      <body className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50 font-sans min-h-screen">
        {children}
      </body>
    </html>
  );
}
