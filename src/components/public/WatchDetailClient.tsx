'use client'

import { useState } from 'react';
import { Watch } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, ChevronLeft, ChevronRight } from "lucide-react"; // Import Chevrons
import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from 'framer-motion';
import { formatSetType } from '@/lib/utils';

interface WatchDetailClientProps {
    watch: Watch;
}

const galleryVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 500 : -500,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 500 : -500,
    opacity: 0
  })
};

const gallerySwipeConfidenceThreshold = 10000;
const gallerySwipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

export default function WatchDetailClient({ watch }: WatchDetailClientProps) {
    // รวมรูปและวิดีโอเข้าด้วยกัน
    const mediaItems = Array.isArray(watch.media) ? [...watch.media].sort((a, b) => (a.position ?? 0) - (b.position ?? 0)) : [];
    const images = mediaItems.filter(m => m.type === 'image');
    const videos = mediaItems.filter(m => m.type === 'video');
    const allMedia = [...images.map(m => m.url), ...videos.map(m => m.url)];
    const [[page, direction], setPage] = useState([0, 0]);

    // index wrap
    const mediaIndex = allMedia.length > 0 ? (page % allMedia.length + allMedia.length) % allMedia.length : 0;

    const paginate = (newDirection: number) => {
        setPage([page + newDirection, newDirection]);
    };
    
    const setSelectedMedia = (index: number) => {
        const currentIndex = mediaIndex;
        const newDirection = index > currentIndex ? 1 : -1;
        setPage([index, newDirection]);
    }

    const whatsappNumber = "668xxxxxxxx";
    const inquiryMessage = `สวัสดีครับ สนใจนาฬิกา ${watch.brand} Ref. ${watch.ref} ครับ`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(inquiryMessage)}`;

    return (
        <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-4">
                <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-900 flex items-center justify-center group">
                    <AnimatePresence initial={false} custom={direction}>
                        <motion.div
                            key={page}
                            className="absolute w-full h-full"
                            custom={direction}
                            variants={galleryVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 }
                            }}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={1}
                            onDragEnd={(e, { offset, velocity }) => {
                                const swipe = gallerySwipePower(offset.x, velocity.x);
                                if (swipe < -gallerySwipeConfidenceThreshold) {
                                    paginate(1); // Next
                                } else if (swipe > gallerySwipeConfidenceThreshold) {
                                    paginate(-1); // Previous
                                }
                            }}
                        >
                            {allMedia[mediaIndex] ? (
                                allMedia[mediaIndex].match(/\.(mp4|mov|webm)$/i) || allMedia[mediaIndex].includes('video') ? (
                                    <video
                                        src={allMedia[mediaIndex]}
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <Image
                                        src={allMedia[mediaIndex]}
                                        alt={`${watch.brand} ${watch.ref} main image`}
                                        fill
                                        priority
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        className="object-cover"
                                    />
                                )
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <ImageIcon className="w-24 h-24 text-gray-700" />
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {allMedia.length > 1 && (
                        <>
                            <Button onClick={() => paginate(-1)} size="icon" variant="ghost" className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/30 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-black/50">
                                <ChevronLeft className="h-6 w-6"/>
                            </Button>
                            <Button onClick={() => paginate(1)} size="icon" variant="ghost" className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/30 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-black/50">
                                <ChevronRight className="h-6 w-6"/>
                            </Button>
                        </>
                    )}
                </div>

                {allMedia.length > 1 && (
                    <div className="grid grid-cols-5 gap-2">
                        {allMedia.map((url, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedMedia(index)}
                                className={cn(
                                    "relative w-full aspect-square rounded-md overflow-hidden transition-all",
                                    mediaIndex === index ? "ring-2 ring-offset-2 ring-offset-black ring-amber-400" : "opacity-60 hover:opacity-100"
                                )}
                            >
                                {url.match(/\.(mp4|mov|webm)$/i) || url.includes('video') ? (
                                    <video src={url} className="object-cover w-full h-full" />
                                ) : (
                                    <Image
                                        src={url}
                                        alt={`Thumbnail ${index + 1}`}
                                        fill
                                        sizes="20vw"
                                        className="object-cover"
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="sticky top-24 self-start">
                <p className="text-lg uppercase tracking-widest gold-text">{watch.brand}</p>
                <h1 className="text-4xl md:text-5xl font-bold text-white mt-2">{watch.ref}</h1>
                
                {watch.selling_price ? (
                    <p className="text-3xl text-gray-200 mt-6">{new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 }).format(watch.selling_price)}</p>
                ) : ( <p className="text-2xl text-gray-400 mt-6">สอบถามราคา</p> )}

                <div className="mt-8 border-t border-gray-800 pt-8">
                    <h3 className="text-xl font-semibold mb-4">รายละเอียดนาฬิกา</h3>
                    <ul className="space-y-3 text-gray-300">
                        <li className="flex justify-between"><span>ยี่ห้อ:</span> <span className="font-medium text-white">{watch.brand}</span></li>
                        <li className="flex justify-between"><span>Ref. No.:</span> <span className="font-medium text-white">{watch.ref}</span></li>
                        <li className="flex justify-between"><span>ปีผลิต:</span> <span className="font-medium text-white">{watch.watch_year || '-'}</span></li>
                        <li className="flex justify-between"><span>ประเภท:</span> <span className="font-medium text-white">{watch.product_type || '-'}</span></li>
                        <li className="flex justify-between"><span>อุปกรณ์:</span> <span className="font-medium text-white">{formatSetType(watch.set_type)}</span></li>
                        <li className="flex justify-between"><span>สถานะ:</span> <span className="font-medium text-white">{watch.status}</span></li>
                    </ul>
                </div>
                
                {watch.notes && (
                    <div className="mt-8 border-t border-gray-800 pt-8">
                        <h3 className="text-xl font-semibold mb-4">หมายเหตุ</h3>
                        <p className="text-gray-400 whitespace-pre-wrap">{watch.notes}</p>
                    </div>
                )}

                <div className="mt-10">
                    <Button asChild size="lg" className="w-full gold-bg text-black font-bold text-lg">
                        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">สอบถามรายละเอียด</a>
                    </Button>
                </div>
            </div>
        </div>
    );
}