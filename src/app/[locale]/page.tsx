import { FC, ReactNode, Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { Watch, WatchMedia } from '@/lib/types';
import dynamic from 'next/dynamic';
import { Phone, MessageCircle, MapPin } from 'lucide-react';
import Header from '@/components/public/Header';
import { getTranslations } from 'next-intl/server';

// Dynamically import InventorySection as a Client Component
const InventorySection = dynamic(() => import('@/components/public/InventorySection'), {
  loading: () => <div className="text-center py-20">Loading Inventory...</div>,
});

// Helper components
const Section: FC<{ id: string; title: string; children: ReactNode; className?: string }> = ({
  id,
  title,
  children,
  className = '',
}) => (
  <div id={id} className={className}>
    <div className="container mx-auto px-4 md:px-6 py-10 md:py-20">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 md:mb-12">{title}</h2>
      {children}
    </div>
  </div>
);

const TestimonialCard: FC<{ name: string; text: string; watch: string }> = ({ name, text, watch }) => (
  <div className="bg-[#121212] p-4 md:p-6 rounded-lg border border-gray-800 h-full">
    <p className="text-gray-300 italic text-sm md:text-base">&quot;{text}&quot;</p>
    <p className="text-right mt-2 md:mt-4 font-bold gold-text">{name}</p>
    <p className="text-right text-xs md:text-sm text-gray-500">{watch}</p>
  </div>
);

// Sections
const HeroSection = async ({ locale }: { locale: string }) => {
  const t = await getTranslations({ locale, namespace: 'HeroSection' });
  return (
    <section className="section-bg flex flex-col justify-center items-center text-center h-[60vh] md:h-[70vh] lux-spacing relative overflow-hidden">
      <h1 className="section-title">{t('title')}</h1>
      <p className="section-subtitle">{t('subtitle')}</p>
      <a href="#inventory" className="gold-btn mt-4 md:mt-8">{t('cta')}</a>
    </section>
  );
};

const AboutSection = async ({ locale }: { locale: string }) => {
  const t = await getTranslations({ locale, namespace: 'AboutSection' });
  return (
    <Section id="about" title={t('title')}>
      <div className="card mx-auto text-center text-gray-300 text-base md:text-lg leading-relaxed max-w-2xl md:max-w-3xl">
        <p>{t('description')}</p>
        <p className="mt-3 md:mt-4">{t('mission')}</p>
      </div>
    </Section>
  );
};

const TestimonialsSection = async ({ locale }: { locale: string }) => {
  const t = await getTranslations({ locale, namespace: 'TestimonialsSection' });
  return (
    <Section id="testimonials" title={t('title')} className="section-bg">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
        <TestimonialCard
          name={t('testimonial1.name')}
          text={t('testimonial1.text')}
          watch={t('testimonial1.watch')}
        />
        <TestimonialCard
          name={t('testimonial2.name')}
          text={t('testimonial2.text')}
          watch={t('testimonial2.watch')}
        />
        <TestimonialCard
          name={t('testimonial3.name')}
          text={t('testimonial3.text')}
          watch={t('testimonial3.watch')}
        />
      </div>
    </Section>
  );
};

const ContactSection = async ({ locale }: { locale: string }) => {
  const t = await getTranslations({ locale, namespace: 'ContactSection' });
  return (
    <Section id="contact" title={t('title')}>
      <div className="max-w-3xl md:max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 text-center">
        <div className="card space-y-2 flex flex-col items-center">
          <Phone className="h-10 w-10 gold-text mb-2" />
          <h3 className="text-lg md:text-xl font-semibold">{t('phone.title')}</h3>
          <p className="text-gray-400 text-sm md:text-base">{t('phone.description')}</p>
          <a href="tel:+668xxxxxxxx" className="gold-btn mt-2">{t('phone.number')}</a>
        </div>
        <div className="card space-y-2 flex flex-col items-center">
          <MessageCircle className="h-10 w-10 gold-text mb-2" />
          <h3 className="text-lg md:text-xl font-semibold">{t('social.title')}</h3>
          <p className="text-gray-400 text-sm md:text-base">{t('social.description')}</p>
          <p className="gold-btn mt-2 cursor-default select-text">{t('social.handle')}</p>
        </div>
        <div className="card space-y-2 flex flex-col items-center">
          <MapPin className="h-10 w-10 gold-text mb-2" />
          <h3 className="text-lg md:text-xl font-semibold">{t('location.title')}</h3>
          <p className="text-gray-400 text-sm md:text-base">{t('location.description')}</p>
          <p className="gold-btn mt-2 cursor-default select-text">{t('location.address')}</p>
        </div>
      </div>
    </Section>
  );
};

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const supabase = await createClient();
  
  const query = supabase
    .from('watches')
    .select('id, ref, brand, model, watch_year, product_type, set_type, selling_price, currency, status, watch_media(*), images_url, video_url, is_public, created_at')
    .neq('status', 'Sold' as string)
    .order('created_at', { ascending: false })
    .limit(50);
    
  // เพิ่ม condition แยกเพื่อหลีกเลี่ยง type error
  (query as unknown as { eq: (col: string, val: boolean) => void }).eq('is_public', true);
  
  const { data, error } = await query;

  if (error) {
    return (
      <div>
        <HeroSection locale={locale} />
        <div className="text-center py-20 text-gray-500">Failed to load inventory. Please try again later.</div>
        <AboutSection locale={locale} />
        <TestimonialsSection locale={locale} />
        <ContactSection locale={locale} />
      </div>
    );
  }

  // Map media ให้เหมาะสม โดยรวมข้อมูลจากทั้ง watch_media และ fields เก่า
  const watches: Watch[] = Array.isArray(data) ? data.map((watch: Record<string, unknown>) => {
    const w = watch as Record<string, unknown>;
    
    // ดึงข้อมูลจาก watch_media table ใหม่
    const newMedia = Array.isArray(w?.watch_media) ? [...(w.watch_media as WatchMedia[])].sort((a, b) => (a.position ?? 0) - (b.position ?? 0)) : [];
    
    // ดึงข้อมูลจาก fields เก่า (images_url, video_url)
    const legacyMedia: WatchMedia[] = [];
    
    // เพิ่ม images จาก images_url (ถ้ามี)
    if (w.images_url && Array.isArray(w.images_url)) {
      (w.images_url as string[]).forEach((url: string, index: number) => {
        legacyMedia.push({
          id: index,
          watch_id: typeof w.id === 'number' ? w.id : 0,
          url: url,
          type: 'image',
          position: index,
          created_at: typeof w.created_at === 'string' ? w.created_at : '',
        });
      });
    }
    
    // เพิ่ม video จาก video_url (ถ้ามี)
    if (w.video_url && typeof w.video_url === 'string') {
      legacyMedia.push({
        id: (Array.isArray(w.images_url) ? w.images_url.length : 0),
        watch_id: typeof w.id === 'number' ? w.id : 0,
        url: w.video_url,
        type: 'video',
        position: legacyMedia.length,
        created_at: typeof w.created_at === 'string' ? w.created_at : '',
      });
    }
    
    // รวมข้อมูลใหม่และเก่า โดยให้ข้อมูลใหม่มาก่อน
    const combinedMedia = [...newMedia, ...legacyMedia];
    
    return {
      ...(w as Watch),
      media: combinedMedia,
    };
  }) : [];

  return (
    <div>
      <Header watches={watches} />
      <HeroSection locale={locale} />
      <Suspense fallback={<div className="text-center py-20">Loading Inventory...</div>}>
        <InventorySection initialWatches={watches} />
      </Suspense>
      <AboutSection locale={locale} />
      <TestimonialsSection locale={locale} />
      <ContactSection locale={locale} />
    </div>
  );
}