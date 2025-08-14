import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

interface WatchData {
  id: number;
  ref: string;
  brand: string;
  model?: string;
  watch_year?: number;
  product_type?: string;
  set_type?: unknown;
  selling_price?: number;
  currency?: string;
  status: string;
  watch_media?: Array<{
    id: number;
    watch_id: number;
    url: string;
    type: 'image' | 'video';
    position: number;
    created_at: string;
  }>;
  images_url?: string[];
  video_url?: string;
  created_at?: string;
}

export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('watches')
      .select('id, ref, brand, model, watch_year, product_type, set_type, selling_price, currency, status, watch_media(*), images_url, video_url')
      .eq('is_public', true)
      .neq('status', 'Sold')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("API Fetch Error:", error);
      throw new Error(error.message);
    }

    const watches = Array.isArray(data) ? data.map((watch: WatchData) => {
      const newMedia = Array.isArray(watch?.watch_media) ? [...watch.watch_media].sort((a, b) => (a.position ?? 0) - (b.position ?? 0)) : [];
      
      const legacyMedia: Array<{
        id: string;
        watch_id: number;
        url: string;
        type: 'image' | 'video';
        position: number;
        created_at: string;
      }> = [];
      
      if (watch.images_url && Array.isArray(watch.images_url)) {
        watch.images_url.forEach((url: string, index: number) => {
          legacyMedia.push({
            id: `legacy-image-${index}`,
            watch_id: watch.id,
            url: url,
            type: 'image' as const,
            position: index,
            created_at: watch.created_at || new Date().toISOString()
          });
        });
      }
      
      if (watch.video_url) {
        legacyMedia.push({
          id: `legacy-video-0`,
          watch_id: watch.id,
          url: watch.video_url,
          type: 'video' as const,
          position: legacyMedia.length,
          created_at: watch.created_at || new Date().toISOString()
        });
      }
      
      const combinedMedia = [...newMedia, ...legacyMedia];
      
      return {
        ...watch,
        media: combinedMedia,
      };
    }) : [];

    return NextResponse.json(watches);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Error in /api/public/watches:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}