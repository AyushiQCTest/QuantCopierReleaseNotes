import './globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from './providers/ThemeProvider';

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
    <html lang="en">
      <body className="bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-50 font-sans min-h-screen transition-colors">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
