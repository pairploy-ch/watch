import { Kanit } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/sonner";
import { ReactNode } from 'react';
import { LanguageProvider } from "../../context/LanguageContext" // 👈 เพิ่มเข้ามา

const kanit = Kanit({
  subsets: ['latin', 'thai'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-kanit',
  display: 'swap',
});

export const metadata = {
  title: 'Chronos Watch',
  description: 'Curated collection of the world\'s finest pre-owned luxury watches.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: [{ url: '/apple-icon.png' }],
    other: [
      { rel: 'icon', url: '/favicon-32x32.png', sizes: '32x32' },
      { rel: 'icon', url: '/favicon-16x16.png', sizes: '16x16' },
    ],
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
        {/* ✅ meta + icons เดิมของคุณ */}
        <meta name="robots" content="noindex, nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="color-scheme" content="dark light" />
      </head>
      <body style={{ background: '#000' }}>
        <LanguageProvider>   {/* 👈 ครอบ children ด้วย LanguageProvider */}
          <div className="safe-area min-h-screen bg-black">
            {children}
          </div>
          <Toaster richColors />
        </LanguageProvider>
      </body>
    </html>
  );
}
