import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Watch, WatchMedia } from "@/lib/types";
import { Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

async function getWatchDetails(id: string): Promise<Watch | null> {
  const supabase = await createClient();

  const watchId = parseInt(id, 10);
  if (isNaN(watchId)) return null;

  // เรียก RPC เพิ่ม view count แบบ async (ไม่ต้องรอผล)
  supabase.rpc("increment_view_count", { watch_id_to_inc: watchId }).then(({ error }) => {
    if (error) {
      // Silently handle error without console.log
    }
  });

  const { data, error } = await supabase
    .from("watches")
    .select("*, watch_media(*), images_url, video_url")
    .eq("id", watchId)
    .eq("is_public", true)
    .single();

  if (error || !data) {
    return null;
  }

  const watchData = data as Record<string, unknown>;
  
  // Map media ให้เหมาะสม โดยรวมข้อมูลจากทั้ง watch_media และ fields เก่า
  const newMedia = Array.isArray(watchData?.watch_media) ? [...(watchData.watch_media as WatchMedia[])].sort((a, b) => (a.position ?? 0) - (b.position ?? 0)) : [];
  
  // ดึงข้อมูลจาก fields เก่า (images_url, video_url)
  const legacyMedia: WatchMedia[] = [];
  
  // เพิ่ม images จาก images_url (ถ้ามี)
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
  
  // เพิ่ม video จาก video_url (ถ้ามี)
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
  
  // รวมข้อมูลใหม่และเก่า โดยให้ข้อมูลใหม่มาก่อน
  const combinedMedia = [...newMedia, ...legacyMedia];
  
  return {
    ...(watchData as Watch),
    media: combinedMedia,
  };
}

// รับ params เป็น Promise แล้ว await ด้านใน
type Props = {
  params: Promise<{ id: string; locale: string }>;
};

export default async function WatchDetailPage({ params }: Props) {
  const { id } = await params;
  const watch = await getWatchDetails(id);

  if (!watch) {
    notFound();
  }

  const whatsappNumber = "668xxxxxxxx"; // **สำคัญ:** แก้เป็นเบอร์ WhatsApp ของคุณ
  const inquiryMessage = `สวัสดีครับ สนใจนาฬิกา ${watch.brand} Ref. ${watch.ref} ครับ`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    inquiryMessage
  )}`;

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="mb-8">
        <Link href="/#inventory" className="text-gray-400 hover:text-white">
          ← กลับไปที่คอลเลกชัน
        </Link>
      </div>
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          {watch.media && watch.media.length > 0 ? (
            <div className="space-y-4">
              {watch.media.map((media, index) => (
                <div key={media.id}>
                  {media.type === 'image' ? (
                    <Image
                      src={media.url}
                      alt={`${watch.brand} ${watch.ref} image ${index + 1}`}
                      width={800}
                      height={600}
                      className="w-full rounded-lg shadow-lg"
                    />
                  ) : (
                    <video
                      src={media.url}
                      controls
                      className="w-full rounded-lg shadow-lg"
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full aspect-square bg-gray-900 flex items-center justify-center rounded-lg">
              <ImageIcon className="w-24 h-24 text-gray-700" />
            </div>
          )}
        </div>
        <div className="sticky top-24 self-start">
          <p className="text-lg uppercase tracking-widest gold-text">{watch.brand}</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mt-2">{watch.ref}</h1>

          {watch.selling_price ? (
            <p className="text-3xl text-gray-200 mt-6">
              {new Intl.NumberFormat("th-TH", {
                style: "currency",
                currency: "THB",
                minimumFractionDigits: 0,
              }).format(watch.selling_price)}
            </p>
          ) : (
            <p className="text-2xl text-gray-400 mt-6">Price upon request</p>
          )}

          <div className="mt-8 border-t border-gray-800 pt-8">
            <h3 className="text-xl font-semibold mb-4">Watch Details</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex justify-between">
                <span>Reference</span>{" "}
                <span className="font-medium text-white">{watch.ref}</span>
              </li>
              <li className="flex justify-between">
                <span>Brand</span>{" "}
                <span className="font-medium text-white">{watch.brand}</span>
              </li>
              <li className="flex justify-between">
                <span>Year</span>{" "}
                <span className="font-medium text-white">{watch.watch_year || "N/A"}</span>
              </li>
              <li className="flex justify-between">
                <span>Product Type</span>{" "}
                <span className="font-medium text-white">{watch.product_type || "N/A"}</span>
              </li>
              <li className="flex justify-between">
                <span>Set</span>{" "}
                <span className="font-medium text-white">
                  {watch.set_type ? JSON.stringify(watch.set_type) : "N/A"}
                </span>
              </li>
              <li className="flex justify-between">
                <span>Status</span>{" "}
                <span className="font-medium text-white">{watch.status}</span>
              </li>
            </ul>
          </div>

          {watch.notes && (
            <div className="mt-8 border-t border-gray-800 pt-8">
              <h3 className="text-xl font-semibold mb-4">Notes</h3>
              <p className="text-gray-400 whitespace-pre-wrap">{watch.notes}</p>
            </div>
          )}

          <div className="mt-10">
            <Button
              asChild
              size="lg"
              className="w-full gold-bg text-black font-bold text-lg"
            >
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                สอบถามรายละเอียด
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
