import type React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Script from 'next/script';
import { ThemeProvider } from '@/components/theme-provider';
import { AppProvider } from '@/contexts/app-context';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NeuroReset - Addiction Recovery Platform',
  description: 'A personalized platform for addiction recovery and support',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <link rel='icon' href='/images/favicon.png' type='image/png' />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute='class'
          defaultTheme='light'
          enableSystem
          disableTransitionOnChange
        >
          <AppProvider>
            {children}
            <Toaster />
          </AppProvider>
        </ThemeProvider>
        <Script id='taki-settings' strategy='beforeInteractive'>
          {`
            window.TakiPopupsSettings = {
              memberId: '817889341',
              name: 'ahmed',
              appId: '67ffaeade783d3021f53c288',
              lang: 'en',
              meta_data: {
                age: 18,
                state: 'Manouba',
                phoneNumber: '5289452343',
              }
            };
          `}
        </Script>

        {/* Load the Taki popups script AFTER the DOM is interactive */}
        <Script
          id='taki-popups'
          src='https://popups-dev-integration.lissene.dev/taki-popups.umd.js'
          strategy='afterInteractive'
        />

        <Script id='feeduser-script' strategy='afterInteractive'>
          {`
            window.Fu = window.Fu || {};
            Fu.access_token = "c73c052759e3602ca716ff469cde44";
            (function (d) {
              var s = d.createElement("script");
              s.async = true;
              s.src = "https://widget.feeduser.me/widget/v1.js";
              (d.head || d.body).appendChild(s);
            })(document);
          `}
        </Script>
      </body>
    </html>
  );
}
import './globals.css';