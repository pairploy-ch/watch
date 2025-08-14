'use client';

import React, { useState } from 'react';
import { Watch } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Package, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface WatchCardProps {
  watch: Watch;
}

export default function WatchCard({ watch }: WatchCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // เปลี่ยนจุดที่ใช้ images_url/video_url เป็น media
  const mediaItems = Array.isArray(watch.media) ? [...watch.media].sort((a, b) => (a.position ?? 0) - (b.position ?? 0)) : [];
  const images = mediaItems.filter(m => m.type === 'image');
  const videos = mediaItems.filter(m => m.type === 'video');
  const allMedia = [...images.map(m => m.url), ...videos.map(m => m.url)];

  const paginate = (newDirection: number) => {
    setCurrentImageIndex((currentImageIndex + newDirection + allMedia.length) % allMedia.length);
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    paginate(1);
  };
  
  const handlePrev = (e?: React.MouseEvent) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    paginate(-1);
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => Math.abs(offset) * velocity;

  // Animation variants
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  const isVideo = (url: string) => /\.(mp4|mov|webm)$/i.test(url) || url.includes('video');

  // Function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', { 
      style: 'currency', 
      currency: 'THB',
      minimumFractionDigits: 0 
    }).format(amount);
  };

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    const statusMap = {
      'Available': { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' },
      'Reserved': { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' },
      'Sold': { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
      'Hidden': { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/30' },
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.Available;
  };

  const statusStyle = getStatusBadge(watch.status || 'Available');

  return (
    <motion.div 
      className="group relative bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl overflow-hidden border border-gray-700/50 hover:border-amber-500/50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-amber-500/10"
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Status Badge */}
      <div className="absolute top-4 right-4 z-20">
        <div className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border} border`}>
          {watch.status || 'Available'}
        </div>
      </div>

      {/* Premium Badge for High Value Items */}
      {watch.selling_price && watch.selling_price > 500000 && (
        <div className="absolute top-4 left-4 z-20">
          <div className="px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm bg-gradient-to-r from-amber-600 to-yellow-500 text-black border border-amber-500/50 flex items-center gap-1">
            <Star className="w-3 h-3" />
            Premium
          </div>
        </div>
      )}

      {/* Media Section */}
      <div className="relative aspect-square overflow-hidden">
        {allMedia.length === 0 ? (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <div className="text-center">
              <Package className="w-12 h-12 text-gray-600 mx-auto mb-2" />
              <span className="text-gray-500 text-sm">No Image</span>
            </div>
          </div>
        ) : (
          <>
            <AnimatePresence initial={false} custom={currentImageIndex}>
              <motion.div
                key={currentImageIndex}
                className="absolute w-full h-full"
                custom={currentImageIndex}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ x: { type: 'spring', stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = swipePower(offset.x, velocity.x);
                  if (swipe < -swipeConfidenceThreshold) {
                    paginate(1);
                  } else if (swipe > swipeConfidenceThreshold) {
                    paginate(-1);
                  }
                }}
              >
                {isVideo(allMedia[currentImageIndex]) ? (
                  <video 
                    src={allMedia[currentImageIndex]} 
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <Image 
                    src={allMedia[currentImageIndex]} 
                    alt={`${watch.brand} ${watch.ref}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={currentImageIndex === 0}
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    quality={85}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                  />
                )}
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            </AnimatePresence>
            
            {allMedia.length > 1 && (
              <>
                <motion.button
                  onClick={handlePrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/60 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 hover:bg-black/80 transition-all duration-300 z-10 flex items-center justify-center border border-white/20"
                  aria-label="Previous image"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronLeft className="h-5 w-5" />
                </motion.button>
                <motion.button
                  onClick={handleNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/60 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 hover:bg-black/80 transition-all duration-300 z-10 flex items-center justify-center border border-white/20"
                  aria-label="Next image"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronRight className="h-5 w-5" />
                </motion.button>
                
                {/* Dots Indicator */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                  {allMedia.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImageIndex(i)}
                      className={`h-2 w-2 rounded-full border border-white/50 transition-all duration-300 ${i === currentImageIndex ? 'bg-amber-400 scale-125' : 'bg-white/30 hover:bg-white/50'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
      
      {/* Content Section */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <h3 className="font-bold text-xl text-transparent bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text mb-1 truncate">
            {watch.brand}
          </h3>
          <p className="text-sm text-gray-300 font-medium truncate">{watch.ref}</p>
          {watch.model && (
            <p className="text-xs text-gray-500 truncate mt-1">{watch.model}</p>
          )}
        </div>

        {/* Price */}
        {watch.selling_price && (
          <div className="mb-4">
            <p className="text-2xl font-bold text-amber-400">
              {formatCurrency(watch.selling_price)}
            </p>
          </div>
        )}

        {/* Details */}
        <div className="space-y-2 text-sm text-gray-400">
          {watch.watch_year && (
            <div className="flex justify-between">
              <span>Year:</span>
              <span className="text-gray-300">{watch.watch_year}</span>
            </div>
          )}
          {watch.product_type && (
            <div className="flex justify-between">
              <span>Condition:</span>
              <span className="text-gray-300">{watch.product_type}</span>
            </div>
          )}
          {watch.set_type && (
            <div className="flex justify-between">
              <span>Set Type:</span>
              <span className="text-gray-300">{String(watch.set_type)}</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-6">
          <Link
            href={`/watch/${watch.id}`}
            className="block w-full text-center py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-amber-500/25"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
}