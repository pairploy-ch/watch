'use client';

import { Watch } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Image as ImageIcon, ChevronsRight } from 'lucide-react';

interface WatchListItemProps {
  watch: Watch;
}

export default function WatchListItem({ watch }: WatchListItemProps) {
  const mediaItems = Array.isArray(watch.media) ? [...watch.media].sort((a, b) => (a.position ?? 0) - (b.position ?? 0)) : [];
  const images = mediaItems.filter(m => m.type === 'image');
  const videos = mediaItems.filter(m => m.type === 'video');
  const allMedia = [...images.map(m => m.url), ...videos.map(m => m.url)];
  const firstMedia = allMedia[0];
  const price = watch.selling_price;

  return (
    <div className="card flex items-center gap-3 md:gap-4 p-2 md:p-4 transition-all duration-300 hover:border-gray-700 hover:bg-gray-900/50">
      <div className="relative w-16 h-16 md:w-24 md:h-24 flex-shrink-0 rounded-md overflow-hidden bg-gray-900">
        {firstMedia ? (
          firstMedia.match(/\.(mp4|mov|webm)$/i) || firstMedia.includes('video') ? (
            <video
              src={firstMedia}
              autoPlay
              muted
              loop
              playsInline
              className="object-cover w-full h-full"
            />
          ) : (
            <Image
              src={firstMedia}
              alt={`${watch.brand} ${watch.ref}`}
              width={96}
              height={96}
              className="object-cover w-full h-full"
              priority={false}
            />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="w-6 md:w-8 h-6 md:h-8 text-gray-700" />
          </div>
        )}
      </div>

      {/* Info section */}
      <div className="flex-grow flex flex-col gap-1 md:gap-2 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5">
          <div className="text-xs md:text-sm text-gray-400 uppercase tracking-wider truncate">{watch.brand}</div>
          <div className="text-xs md:text-sm text-gray-500 truncate hidden sm:block">{watch.ref}</div>
        </div>
        <div className="text-sm md:text-lg font-bold text-white truncate leading-tight">
          {watch.model || watch.ref}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>{watch.watch_year || 'N/A'}</span>
          <span>•</span>
          <span>{watch.product_type || 'N/A'}</span>
        </div>
        <div className="flex items-center justify-between mt-1">
          {price ? (
            <span className="gold-text text-base md:text-lg font-bold">
              {new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 }).format(price)}
            </span>
          ) : (
            <span className="text-gray-400 text-base md:text-lg">สอบถามราคา</span>
          )}
          <Button asChild className="gold-btn py-2 px-4 text-sm md:text-base">
            <Link href={`/watch/${watch.id}`}>
              View Details <ChevronsRight className="ml-1 md:ml-2 h-3 md:h-4 w-3 md:w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}