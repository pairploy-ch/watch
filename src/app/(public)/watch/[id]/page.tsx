import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Watch, WatchMedia } from "@/lib/types";
import Link from 'next/link';
import WatchDetailClient from "@/components/public/WatchDetailClient";
export const dynamic = 'force-dynamic';

async function getWatchDetails(id: string): Promise<Watch | null> {
    const supabase = await createClient();
    const watchId = parseInt(id, 10);
    if (isNaN(watchId)) return null;
    supabase.rpc('increment_view_count', { watch_id_to_inc: watchId }).then(({ error }) => {
        if (error) {
            // Silently handle error without console.log
        }
    });
    const { data, error } = await supabase
        .from('watches')
        .select('*, watch_media(*), images_url, video_url')
        .eq('id', watchId)
        .eq('is_public', true)
        .single();
    if (error || !data) {
        return null;
    }
    const watchData = data as Record<string, unknown>;
    const newMedia = Array.isArray(watchData?.watch_media) ? [...(watchData.watch_media as WatchMedia[])].sort((a, b) => (a.position ?? 0) - (b.position ?? 0)) : [];
    
    const legacyMedia: WatchMedia[] = [];
    
    if (watchData.images_url && Array.isArray(watchData.images_url)) {
        (watchData.images_url as string[]).forEach((url: string, index: number) => {
            legacyMedia.push({
                id: index,
                watch_id: typeof watchData.id === 'number' ? watchData.id : 0,
                url: url,
                type: 'image',
                position: index,
                created_at: typeof watchData.created_at === 'string' ? watchData.created_at : '',
            });
        });
    }
    
    if (watchData.video_url && typeof watchData.video_url === 'string') {
        legacyMedia.push({
            id: (Array.isArray(watchData.images_url) ? watchData.images_url.length : 0),
            watch_id: typeof watchData.id === 'number' ? watchData.id : 0,
            url: watchData.video_url,
            type: 'video',
            position: legacyMedia.length,
            created_at: typeof watchData.created_at === 'string' ? watchData.created_at : '',
        });
    }
    
    const combinedMedia = [...newMedia, ...legacyMedia];
    
    return {
        ...(watchData as Watch),
        media: combinedMedia,
    };
}

type Props = {
  params: Promise<{ id: string }>;
};

export default async function WatchDetailPage({ params }: Props) {
    const { id } = await params;
    const watch = await getWatchDetails(id);
    if (!watch) {
        notFound();
    }
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        {/* Navigation Header */}
        <div className="sticky top-0 z-40 bg-black/95 backdrop-blur-sm border-b border-gray-800/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 lg:h-20">
              <Link 
                href="/#inventory" 
                className="group flex items-center space-x-2 sm:space-x-3 text-gray-300 hover:text-[#E6C36A] transition-all duration-300"
              >
                <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-800/50 group-hover:bg-[#E6C36A]/10 transition-all duration-300">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </div>
                <span className="font-medium text-sm sm:text-base">กลับไปที่คอลเลกชัน</span>
              </Link>
              
              {/* Premium Badge */}
              <div className="hidden sm:flex items-center space-x-2 text-[#E6C36A]">
                <div className="w-2 h-2 bg-[#E6C36A] rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Premium Collection</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {/* Luxury Frame */}
          <div className="relative">
            {/* Decorative Border */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#E6C36A]/20 via-gray-500/20 to-[#E6C36A]/20 rounded-3xl blur-sm"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-transparent rounded-3xl"></div>
            
            {/* Content Container */}
            <div className="relative bg-black/80 backdrop-blur-xl rounded-3xl border border-gray-800/50 overflow-hidden">
              {/* Golden Accent Line */}
              <div className="h-1 bg-gradient-to-r from-transparent via-[#E6C36A] to-transparent"></div>
              
              {/* Watch Detail Component */}
              <div className="p-6 sm:p-8 lg:p-12">
                <WatchDetailClient watch={watch} />
              </div>
            </div>
          </div>

          {/* Bottom Decorative Elements */}
          <div className="mt-12 flex justify-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#E6C36A]"></div>
              <div className="w-3 h-3 border-2 border-[#E6C36A] rounded-full bg-black"></div>
              <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#E6C36A]"></div>
            </div>
          </div>
        </div>

        {/* Background Pattern */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#E6C36A]/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gray-500/5 rounded-full blur-3xl"></div>
        </div>


      </div>
    );
}