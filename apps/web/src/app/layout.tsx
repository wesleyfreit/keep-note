import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import { Toaster } from 'sonner';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Keep Note',
  description: 'An application to keep notes',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-slate-900 text-slate-50 antialiased`}>
        <Toaster
          richColors
          expand
          closeButton
          theme="dark"
          toastOptions={{
            style: {
              filter: 'blur(0)',
              backdropFilter: 'none',
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
