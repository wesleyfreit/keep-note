import { AuthProvider } from '@/providers/auth-provider';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import { Toaster } from 'sonner';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'KeepNote',
  description: 'An application to keep notes',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <AuthProvider>
        <body
          className={`${inter.className} bg-slate-900 text-slate-50 antialiased`}
          suppressHydrationWarning
        >
          <Toaster
            richColors
            expand
            closeButton
            theme="dark"
            toastOptions={{
              style: {
                willChange: 'unset',
              },
            }}
          />
          {children}
        </body>
      </AuthProvider>
    </html>
  );
}
