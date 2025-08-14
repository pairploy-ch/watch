'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Only run this on the client
    const consent = localStorage.getItem('cookie_consent');
    if (consent === null) {
      // If no consent has been given, show the banner
      setShowBanner(true);
    }
  }, []);

  const handleConsent = (consent: boolean) => {
    localStorage.setItem('cookie_consent', consent.toString());
    setShowBanner(false);
    // Here you could initialize analytics scripts if consent is true
    // For example: if (consent) { window.gtag(...) }
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: '0%' }}
          exit={{ y: '100%' }}
          transition={{ type: 'tween', duration: 0.5 }}
          className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md border-t border-gray-800 p-5 z-50"
        >
          <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-300 text-center sm:text-left">
              เราใช้คุกกี้เพื่อปรับปรุงประสบการณ์การใช้งานของคุณบนเว็บไซต์นี้ 
              โดยการใช้งานเว็บไซต์นี้ต่อ ถือว่าคุณได้ยอมรับการใช้คุกกี้ของเรา 
              <Link href="/privacy" className="underline hover:text-white ml-1">อ่านนโยบายความเป็นส่วนตัว</Link>
            </p>
            <div className="flex-shrink-0 flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => handleConsent(false)} className="border-gray-600 hover:bg-gray-800">ปฏิเสธ</Button>
              <Button size="sm" onClick={() => handleConsent(true)} className="gold-bg text-black font-bold">ยอมรับ</Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}