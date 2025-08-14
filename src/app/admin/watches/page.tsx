import { createClient } from '@/lib/supabase/server';
import { Watch, Supplier } from '@/lib/types';
import WatchesClientPage from './watches-client-page';

async function getUserRole() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
    
  return (profile as { role?: string } | null)?.role || null;
}

export default async function WatchesPage() {
  const supabase = await createClient();
  
  const [watchesResult, suppliersResult, userRole] = await Promise.all([
    supabase.from('watches_with_calculations').select('*, watch_media(*), images_url, video_url').order('created_at', { ascending: false }),
    supabase.from('suppliers').select('*').order('name', { ascending: true }),
    getUserRole()
  ]);

  // Map media ให้เหมาะสม โดยรวมข้อมูลจากทั้ง watch_media และ fields เก่า
  const watches: Watch[] = Array.isArray(watchesResult.data) ? watchesResult.data.map((watch: Record<string, unknown>) => {
    // ดึงข้อมูลจาก watch_media table ใหม่
    const newMedia = Array.isArray(watch?.watch_media) ? [...watch.watch_media].sort((a: { position?: number }, b: { position?: number }) => (a.position ?? 0) - (b.position ?? 0)) : [];
    
    // ดึงข้อมูลจาก fields เก่า (images_url, video_url)
    const legacyMedia: Array<{
      id: string;
      watch_id: number;
      url: string;
      type: 'image' | 'video';
      position: number;
      created_at: string;
    }> = [];
    
    // เพิ่ม images จาก images_url (ถ้ามี)
    if (watch.images_url && Array.isArray(watch.images_url)) {
      (watch.images_url as string[]).forEach((url: string, index: number) => {
        legacyMedia.push({
          id: `legacy-image-${index}`,
          watch_id: watch.id as number,
          url: url,
          type: 'image' as const,
          position: index,
          created_at: watch.created_at as string
        });
      });
    }
    
    // เพิ่ม video จาก video_url (ถ้ามี)
    if (watch.video_url) {
      legacyMedia.push({
        id: `legacy-video-0`,
        watch_id: watch.id as number,
        url: watch.video_url as string,
        type: 'video' as const,
        position: legacyMedia.length,
        created_at: watch.created_at as string
      });
    }
    
    // รวมข้อมูลใหม่และเก่า โดยให้ข้อมูลใหม่มาก่อน
    const combinedMedia = [...newMedia, ...legacyMedia];
    
    return {
      ...watch,
      media: combinedMedia,
      profit: watch.profit as number | undefined,
      margin_percent: watch.margin_percent as number | undefined,
      profit_status: watch.profit_status as string | undefined,
    } as Watch;
  }) : [];

  const suppliers: Supplier[] = (suppliersResult.data as Supplier[]) ?? [];

  return (
    <div className="max-w-[1800px] mx-auto py-10 text-white">
      <WatchesClientPage 
        initialWatches={watches} 
        initialSuppliers={suppliers} 
        userRole={userRole as 'admin' | 'marketing' | null} 
      />
    </div>
  );
}