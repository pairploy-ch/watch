"use client";
import React, { useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';

// Mock data
const mockWatch = {
  id: "1",
  brand: "ROLEX",
  ref: "126234",
  price: 420000,
  watch_year: "2024",
  product_type: "Datejust",
  equipment: "Watch only",
  status: "Available",
  remark: "Perpetual 36 Mint Green Fluted Jubilee, hot model.",
  images: [
    // ใช้ placeholder images แทน
    "/newArrival/watch.png",
    "/newArrival/watch.png",
    "/newArrival/watch.png",
    "/newArrival/watch.png",
  ]
};

const MockWatchDetailPage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === mockWatch.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? mockWatch.images.length - 1 : prev - 1
    );
  };

  const selectImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="min-h-screen bg-black text-white mx-auto max-w-[90%]">
      {/* Back to Collection */}
      <div className="px-6 py-4">
        <button 
          onClick={() => window.history.back()}
          className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors text-sm"
        >
          ← BACK TO COLLECTION
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-[60%_40%] gap-0 h-screen">
        {/* Left Side - Image Gallery */}
        <div className="bg-black flex items-center justify-center relative h-full">
          {/* Main Image */}
          <div className="relative mx-auto">
            <img
              src={mockWatch.images[currentImageIndex]}
              alt={`${mockWatch.brand} ${mockWatch.ref}`}
              className="w-full h-auto max-h-96 object-contain"
              onError={(e) => {
                // แทนที่ด้วย fallback placeholder ที่ง่ายกว่า
                const target = e.target as HTMLImageElement;
                target.src = `https://via.placeholder.com/400x300/1a1a1a/666666?text=Watch+Image`;
              }}
            />
            
            
            {/* Navigation Arrows */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Thumbnail Gallery */}
          <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col space-y-3">
            {mockWatch.images.map((image, index) => (
              <button
                key={index}
                onClick={() => selectImage(index)}
                className={`w-16 h-16 border-2 rounded overflow-hidden transition-all ${
                  index === currentImageIndex 
                    ? 'border-[#B79B76]' 
                    : 'border-gray-600 hover:border-gray-400'
                }`}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right Side - Details */}
        <div className="bg-black px-8 py-12 flex flex-col justify-center h-full">
          <div className="max-w-md">
            {/* Brand */}
            <h2 className="text-[#B79B76] text-lg font-medium tracking-wider mb-2">
              {mockWatch.brand}
            </h2>

            {/* Model */}
            <h1 className="text-white text-5xl font-bold mb-6">
              {mockWatch.ref}
            </h1>

            {/* Price */}
            <div className="text-white text-3xl font-bold mb-8">
              ฿{mockWatch.price.toLocaleString()}
            </div>

            {/* Details Section */}
            <div className="mb-8">
              <h3 className="text-white text-lg font-medium mb-4">Detail</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Brand</span>
                  <span className="text-white">{mockWatch.brand}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Ref No.</span>
                  <span className="text-white">{mockWatch.ref}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Year</span>
                  <span className="text-white">{mockWatch.watch_year}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Type</span>
                  <span className="text-white">{mockWatch.product_type}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Equipment</span>
                  <span className="text-white">{mockWatch.equipment}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Status</span>
                  <span className="text-white">{mockWatch.status}</span>
                </div>
              </div>
            </div>

            {/* Remark */}
            <div className="mb-8">
              <h3 className="text-white text-lg font-medium mb-3">Remark</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {mockWatch.remark}
              </p>
            </div>

            {/* Get More Details Button */}
            <button className="w-full bg-[#B79B76] hover:bg-[#D4AF37] text-black font-medium py-3 px-6 transition-colors">
              GET MORE DETAILS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockWatchDetailPage;