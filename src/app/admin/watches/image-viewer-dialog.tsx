'use client'

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import Image from 'next/image';

interface ImageViewerDialogProps {
  mediaUrls: string[];
  watchRef: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

export default function ImageViewerDialog({ mediaUrls, watchRef, open, onOpenChange, children }: ImageViewerDialogProps) {
  if (!mediaUrls || mediaUrls.length === 0) {
    return <>{children}</>; // Return the trigger element as is if there are no images
  }

  // helper
  const isVideo = (url: string) => /\.(mp4|mov|webm)$/i.test(url) || url.includes('video');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-4xl bg-[#121212] border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="gold-text">Media for: {watchRef}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-4 max-h-[70vh] overflow-y-auto">
          {mediaUrls.map((url, index) => (
            <div key={index} className="rounded-lg overflow-hidden group relative">
              <a href={url} target="_blank" rel="noopener noreferrer">
                {isVideo(url) ? (
                  <video 
                    src={url}
                    controls
                    className="w-full h-full object-cover aspect-square transition-transform group-hover:scale-105 bg-black"
                  />
                ) : (
                  <Image 
                    src={url} 
                    alt={`Watch ${watchRef} - Media ${index + 1}`} 
                    width={400}
                    height={400}
                    className="w-full h-full object-cover aspect-square transition-transform group-hover:scale-105"
                  />
                )}
              </a>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}