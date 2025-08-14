import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Inter } from 'next/font/google';
import '../globals.css';
import { Toaster } from '@/components/ui/sonner';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import CookieBanner from '@/components/public/CookieBanner';

const inter = Inter({ subsets: ['latin'] });

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <link rel="apple-touch-icon" href="/apple-icon.png" />
      </head>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <div className="min-h-screen bg-black text-white antialiased flex flex-col">
            <Header watches={[]} />
            <main className="flex-grow">{children}</main>
            <Footer />
            <CookieBanner />
          </div>
          <Toaster richColors />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}