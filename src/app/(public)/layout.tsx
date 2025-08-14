import '../globals.css';
import CookieBanner from '@/components/public/CookieBanner';
import Footer from '@/components/public/Footer';
import { ReactNode } from 'react';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <main className="flex-grow">{children}</main>
      <Footer />
      <CookieBanner />
    </>
  );
}