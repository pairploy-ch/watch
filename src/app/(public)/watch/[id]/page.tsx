"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Header from "@/components/public/Header";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Watch {
  id: string;
  brand: string;
  model: string;
  description: string;
  refNo: string;
  year: string;
  price: number;
  image: string;
  isPremium: boolean;
  caseSize: string;
  isNewArrival: boolean;
}

const mockRelatedWatches: Watch[] = [
  {
    id: "1",
    brand: "ROLEX",
    model: "Datejust 36",
    description: "Datejust 36 Mini Green Fluted Jubilee, Not Include",
    refNo: "126234",
    year: "2024",
    price: 420000,
    image: "/newArrival/watch.png",
    isPremium: true,
    caseSize: "36mm",
    isNewArrival: true,
  },
  {
    id: "2",
    brand: "OMEGA",
    model: "Speedmaster",
    description: "Speedmaster Professional Moonwatch Co-Axial Master",
    refNo: "310.30.42.50.01.001",
    year: "2023",
    price: 285000,
    image: "/newArrival/watch.png",
    isPremium: false,
    caseSize: "42mm",
    isNewArrival: false,
  },
  {
    id: "3",
    brand: "CARTIER",
    model: "Tank Must",
    description: "Tank Must Large Model Steel Case Solar Blue",
    refNo: "WSTA0041",
    year: "2022",
    price: 178000,
    image: "/newArrival/watch.png",
    isPremium: true,
    caseSize: "35mm",
    isNewArrival: false,
  },
  {
    id: "4",
    brand: "RICHARD MILLE",
    model: "RM 35-02",
    description: "RM 35-02 Rafael Nadal NTPT Carbon Limited",
    refNo: "RM35-02",
    year: "2024",
    price: 1850000,
    image: "/newArrival/watch.png",
    isPremium: true,
    caseSize: "49mm",
    isNewArrival: true,
  },
];

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
    "/product/product.png",
    "/product/product1.webp",
    "/product/product2.jpeg",
    "/product/product3.webp",
  ],
};

const WatchCard: React.FC<{ watch: Watch }> = ({ watch }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/watch/1`);
  };
  return (
    <div
      className=" p-4 hover:bg-gray-750 transition-colors cursor-pointer"
      onClick={handleClick}
    >
      <div className=" bg-gradient relative aspect-square mb-4 flex items-center justify-center overflow-hidden p-2">
        {watch.isPremium && (
          <div className="absolute top-2 left-2 z-10">
            <span className="badge-gradient text-black text-xs font-medium px-3 py-1">
              Premium
            </span>
          </div>
        )}
        {watch.isNewArrival && (
          <div className="absolute top-2 right-2 z-10">
            <span className="text-white text-lg font-medium px-3 py-1 font-olds">
              New
            </span>
          </div>
        )}
        <div className="flex items-center justify-center">
          <div>
            <img src={watch.image} alt={watch.refNo} />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-[#B79B76] font-semibold text-xl font-olds">
          {watch.brand}
        </h3>
        <p className="text-[#6E6E6E] text-sm leading-relaxed">
          {watch.description}
        </p>

        <div
          className="grid grid-cols-2 gap-4 text-xs text-gray-400"
          style={{ marginTop: "20px" }}
        >
          <div>
            <span
              className="text-[#BFBFBF]"
              style={{ fontWeight: 500, fontSize: "14px" }}
            >
              Ref No.
            </span>
            <div
              className="text-[#BFBFBF] mt-2"
              style={{ fontWeight: 500, fontSize: "14px" }}
            >
              Year
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <span
              className="text-[#BFBFBF]"
              style={{ fontWeight: 500, fontSize: "14px" }}
            >
              {watch.refNo}
            </span>
            <div
              className="text-[#BFBFBF] mt-2"
              style={{ fontWeight: 500, fontSize: "14px" }}
            >
              {watch.year}
            </div>
          </div>
        </div>

        <div className="pt-3 pb-2">
          <span className="text-white text-3xl font-bold">
            ฿{watch.price.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
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
    <div className="bg-black text-white mx-auto pb-3">
      {/* Back to Collection */}
      <Header watches={[]} />
      <div
        className="px-6 py-4 w-full bg-[#141519]"
        style={{ marginTop: "140px" }}
      >
        <div className="max-w-[90%] mx-auto">
          <Link
            href="/#product"
            className="text-white hover:text-white flex items-center gap-2 transition-colors text-sm"
          >
            ← BACK TO COLLECTION
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-[60%_40%] gap-0  max-w-[90%] mx-auto py-5">
        {/* Left Side - Image Gallery */}
        <div className="bg-black flex items-center justify-center relative h-full">
          {/* Main Image */}
          <div className="relative mx-auto max-w-[70%]">
            <img
              style={{ aspectRatio: "1/1" }}
              src={mockWatch.images[currentImageIndex]}
              alt={`${mockWatch.brand} ${mockWatch.ref}`}
              className="w-full h-auto object-cover"
              onError={(e) => {
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
                    ? "border-[#B79B76]"
                    : "border-gray-600 hover:border-gray-400"
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
            <h2 className="text-[#B79B76] text-lg font-medium tracking-wider mb-2 font-olds">
              {mockWatch.brand}
            </h2>

            {/* Model */}
            <h1 className="text-white text-4xl font-bold mb-6">
              {mockWatch.ref}
            </h1>

            {/* Price */}
            <div className="text-white text-2xl mb-8 border-b pb-5 border-[#808080]">
              ฿{mockWatch.price.toLocaleString()}
            </div>

            {/* Details Section */}
            <div className="mb-8 border-b pb-5 border-[#808080]">
              <h3 className="text-white text-lg font-medium mb-4">Detail</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#BFBFBF] font-bold">Brand</span>
                  <span className="text-white">{mockWatch.brand}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#BFBFBF]  font-bold">Ref No.</span>
                  <span className="text-white">{mockWatch.ref}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#BFBFBF]  font-bold">Year</span>
                  <span className="text-white">{mockWatch.watch_year}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#BFBFBF]  font-bold">Type</span>
                  <span className="text-white">{mockWatch.product_type}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#BFBFBF]  font-bold">Equipment</span>
                  <span className="text-white">{mockWatch.equipment}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#BFBFBF]  font-bold">Status</span>
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
            <a href="https://line.me/R/ti/p/@939hmulm?ts=05061404&oat_content=url">
              <button className="w-full primary-btn text-black font-medium py-3 px-6 transition-colors">
                GET MORE DETAILS
              </button>
            </a>
          </div>
        </div>
      </div>

      {/* Related Product */}
      <div className="max-w-[90%] mx-auto">
        <div className="text-left mb-12">
          <h1 className="text-5xl font-light text-[#B79B76] mb-4 font-olds">
            Related Product
          </h1>
        </div>
        <div className="grid grid-cols-4 gap-6 mb-8">
          {mockRelatedWatches.map((watch, index) => (
            <WatchCard key={`${watch.id}-${index}`} watch={watch} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MockWatchDetailPage;
