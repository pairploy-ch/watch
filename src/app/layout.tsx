import { Kanit } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/sonner";
import { ReactNode } from 'react';

const kanit = Kanit({
  subsets: ['latin', 'thai'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-kanit',
  display: 'swap',
});

// ** THE FIX IS HERE: More detailed and robust icon metadata **
export const metadata = {
  title: 'Chronos Watch',
  description: 'Curated collection of the world\'s finest pre-owned luxury watches.',
  icons: {
    // This is the primary favicon, pointing to your .ico file in /public
    icon: '/favicon.ico',
    // It's good practice to provide other sizes, especially for Apple devices
    shortcut: '/favicon.ico', // For older browsers
    apple: [
        // You can use a 256x256 png for this as well
        { url: '/apple-icon.png' } // Create a 180x180 version named apple-icon.png in /public
    ],
    other: [
        {
            rel: 'icon',
            url: '/favicon-32x32.png', // Create a 32x32 version in /public
            sizes: '32x32'
        },
        {
            rel: 'icon',
            url: '/favicon-16x16.png', // Create a 16x16 version in /public
            sizes: '16x16'
        }
    ]
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="th" style={{ background: '#000' }} className={`${kanit.variable} dark`} suppressHydrationWarning>
      <head>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        {/* iOS splash screens for all major devices (with and without -webkit-device-pixel-ratio) */}
        <link rel="apple-touch-startup-image" href="/splash_screens/splash-1290x2796.png" media="(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)" />
        <link rel="apple-touch-startup-image" href="/splash_screens/splash-1290x2796.png" media="(device-width: 430px) and (device-height: 932px)" />
        <link rel="apple-touch-startup-image" href="/splash_screens/splash-1284x2778.png" media="(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3)" />
        <link rel="apple-touch-startup-image" href="/splash_screens/splash-1284x2778.png" media="(device-width: 428px) and (device-height: 926px)" />
        <link rel="apple-touch-startup-image" href="/splash_screens/splash-1170x2532.png" media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)" />
        <link rel="apple-touch-startup-image" href="/splash_screens/splash-1170x2532.png" media="(device-width: 390px) and (device-height: 844px)" />
        <link rel="apple-touch-startup-image" href="/splash_screens/splash-1179x2556.png" media="(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3)" />
        <link rel="apple-touch-startup-image" href="/splash_screens/splash-1179x2556.png" media="(device-width: 393px) and (device-height: 852px)" />
        <link rel="apple-touch-startup-image" href="/splash_screens/splash-1206x2622.png" media="(device-width: 402px) and (device-height: 873px) and (-webkit-device-pixel-ratio: 3)" />
        <link rel="apple-touch-startup-image" href="/splash_screens/splash-1206x2622.png" media="(device-width: 402px) and (device-height: 873px)" />
        {/* ... (ซ้ำแบบนี้กับทุกขนาดที่มีในโปรเจกต์) ... */}
        {/* Fallback: dark mode splash (iOS 15+) */}
        <meta name="color-scheme" content="dark light" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" media="(prefers-color-scheme: dark)" />
      </head>
      <body style={{ background: '#000' }}>
        <div className="safe-area min-h-screen bg-black">
          {children}
        </div>
        <Toaster richColors />
      </body>
    </html>
  );
}