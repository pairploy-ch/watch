"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

interface Watch {
  id: string;
  brand: string;
  model: string;
  description: string;
  refNo: string;
  year: string;
  price: string;
  image: string;
  isPremium: boolean;
}

const mockWatches: Watch[] = [
  {
    id: "1",
    brand: "ROLEX",
    model: "Datejust 36",
    description: "Datejust 36 Mini Green Fluted Jubilee, Not Include",
    refNo: "126234",
    year: "2024",
    price: "420,000",
    image: "/newArrival/watch.png",
    isPremium: true,
  },
  {
    id: "2",
    brand: "ROLEX",
    model: "Datejust 36",
    description: "Datejust 36 Mini Green Fluted Jubilee, Not Include",
    refNo: "126234",
    year: "2024",
    price: "420,000",
    image: "/newArrival/watch.png",
    isPremium: true,
  },
  {
    id: "3",
    brand: "ROLEX",
    model: "Datejust 36",
    description: "Datejust 36 Mini Green Fluted Jubilee, Not Include",
    refNo: "126234",
    year: "2024",
    price: "420,000",
    image: "/newArrival/watch.png",
    isPremium: true,
  },
  {
    id: "4",
    brand: "ROLEX",
    model: "Datejust 36",
    description: "Datejust 36 Mini Green Fluted Jubilee, Not Include",
    refNo: "126234",
    year: "2024",
    price: "420,000",
    image: "/newArrival/watch.png",
    isPremium: true,
  },
  {
    id: "5",
    brand: "ROLEX",
    model: "Datejust 36",
    description: "Datejust 36 Mini Green Fluted Jubilee, Not Include",
    refNo: "126234",
    year: "2024",
    price: "420,000",
    image: "/newArrival/watch.png",
    isPremium: true,
  },
  {
    id: "6",
    brand: "ROLEX",
    model: "Datejust 36",
    description: "Datejust 36 Mini Green Fluted Jubilee, Not Include",
    refNo: "126234",
    year: "2024",
    price: "420,000",
    image: "/newArrival/watch.png",
    isPremium: true,
  },
  {
    id: "7",
    brand: "ROLEX",
    model: "Datejust 36",
    description: "Datejust 36 Mini Green Fluted Jubilee, Not Include",
    refNo: "126234",
    year: "2024",
    price: "420,000",
    image: "/newArrival/watch.png",
    isPremium: true,
  },
  {
    id: "8",
    brand: "ROLEX",
    model: "Datejust 36",
    description: "Datejust 36 Mini Green Fluted Jubilee, Not Include",
    refNo: "126234",
    year: "2024",
    price: "420,000",
    image: "/newArrival/watch.png",
    isPremium: true,
  },
  {
    id: "9",
    brand: "ROLEX",
    model: "Datejust 36",
    description: "Datejust 36 Mini Green Fluted Jubilee, Not Include",
    refNo: "126234",
    year: "2024",
    price: "420,000",
    image: "/newArrival/watch.png",
    isPremium: true,
  },
  {
    id: "10",
    brand: "ROLEX",
    model: "Datejust 36",
    description: "Datejust 36 Mini Green Fluted Jubilee, Not Include",
    refNo: "126234",
    year: "2024",
    price: "420,000",
    image: "/newArrival/watch.png",
    isPremium: true,
  },
  {
    id: "11",
    brand: "ROLEX",
    model: "Datejust 36",
    description: "Datejust 36 Mini Green Fluted Jubilee, Not Include",
    refNo: "126234",
    year: "2024",
    price: "420,000",
    image: "/newArrival/watch.png",
    isPremium: true,
  },
  {
    id: "12",
    brand: "ROLEX",
    model: "Datejust 36",
    description: "Datejust 36 Mini Green Fluted Jubilee, Not Include",
    refNo: "126234",
    year: "2024",
    price: "420,000",
    image: "/newArrival/watch.png",
    isPremium: true,
  },
];

const WatchCard: React.FC<{ watch: Watch }> = ({ watch }) => {
  return (
    <div className="bg-gradient p-4 hover:bg-gray-750 transition-colors">
      <div className="relative aspect-square mb-4 flex items-center justify-center overflow-hidden">
        {watch.isPremium && (
          <div className="absolute top-2 left-2 z-10">
            <span className="badge-gradient text-black text-xs font-medium px-3 py-1">
              Premium
            </span>
          </div>
        )}
        <div className="flex items-center justify-center">
          <div>
            <img src={watch.image} alt={watch.refNo} className="w-full" />
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
              style={{ fontWeight: 500, fontSize: "16px" }}
            >
              Ref No.
            </span>
            <div
              className="text-[#BFBFBF] mt-2"
              style={{ fontWeight: 500, fontSize: "16px" }}
            >
              Year
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <span
              className="text-[#BFBFBF]"
              style={{ fontWeight: 500, fontSize: "16px" }}
            >
              {watch.refNo}
            </span>
            <div
              className="text-[#BFBFBF] mt-2"
              style={{ fontWeight: 500, fontSize: "16px" }}
            >
              {watch.year}
            </div>
          </div>
        </div>

        <div className="pt-3 pb-2">
          <span className="text-white text-3xl font-bold">฿{watch.price}</span>
        </div>
      </div>
    </div>
  );
};

const FilterSidebar: React.FC = () => {
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([50000, 2000000]);

  const brands = [
    "Rolex",
    "Omega",
    "Cartier",
    "Richard Mille",
    "Tudor",
    "Patek",
  ];

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  return (
    <div>
      <h2 className="text-white text-xl mb-4" style={{ fontWeight: "400" }}>
        Search Filters
      </h2>
      <div className="w-72 bg-[#141519] p-6 h-fit sticky top-4">
        {/* Brand Filter */}
        <div className="mb-6">
          <h3 className="text-[#E0D0B9] font-medium mb-3 font-olds">Brand</h3>
          <div className="space-y-3">
            {/* <div className="relative">
            <select className="select-custom w-full  text-white p-3 appearance-none">
              <option>Select Brand</option>
            </select>
            <ChevronDown className="absolute right-3 top-4 w-4 h-4 text-gray-400 pointer-events-none" />
          </div> */}

            <div className="space-y-2">
              {brands.map((brand) => (
                <label
                  key={brand}
                  className="flex items-center space-x-3 cursor-pointer hover:bg-gray-800 p-2 rounded"
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-amber-500 bg-gray-800 border-gray-600 rounded focus:ring-amber-500 focus:ring-2"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => toggleBrand(brand)}
                  />
                  <span className="text-gray-300 text-sm">{brand}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Price Filter */}
        <div className="mb-6">
          <h3 className="text-[#E0D0B9] font-medium mb-3 font-olds">Price</h3>
          <div className="px-2">
            <input
              type="range"
              min="50000"
              max="2000000"
              step="10000"
              className="w-full h-2 bg-white rounded-lg appearance-none cursor-pointer slider"
              style={{ height: "1px" }}
            />
            <div className="flex justify-between text-xs text-white mt-2">
              <span>฿50,000</span>
              <span>฿2,000,000</span>
            </div>
          </div>
        </div>

        {/* Other Filters */}
        <div className="space-y-4">
          <div>
            <h3 className="text-[#E0D0B9] font-medium mb-3 font-olds">Model</h3>
            <div className="relative">
              <select className="select-custom w-full  text-white p-3 appearance-none">
                <option>Select Model</option>
              </select>
              <ChevronDown className="absolute right-3 top-4 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <h3 className="text-[#E0D0B9] font-medium mb-3 font-olds">
              Case Size
            </h3>
            <div className="relative">
              <select className="select-custom w-full  text-white p-3 appearance-none">
                <option>40 mm</option>
              </select>
              <ChevronDown className="absolute right-3 top-4 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <h3 className="text-[#E0D0B9] font-medium mb-3 font-olds">Year</h3>
            <div className="relative">
              <select className="select-custom w-full  text-white p-3 appearance-none">
                <option>2021</option>
              </select>
              <ChevronDown className="absolute right-3 top-4 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <button className="w-full primary-btn-md mt-7">APPLY FILTER</button>
      </div>
    </div>
  );
};

const Pagination: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 4;

  return (
    <div className="flex items-center justify-center space-x-2 mt-12 mb-8">
      <button
        style={{ border: "1px solid #fff" }}
        className="p-3 rounded-full text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {[1, 2, 3, 4].map((page) => (
        <button
          key={page}
          className={`w-12 h-12 rounded-full font-medium transition-colors ${
            currentPage === page
              ? "text-white"
              : "text-[#686868] hover:bg-gray-700"
          }`}
          onClick={() => setCurrentPage(page)}
        >
          {page}
        </button>
      ))}

      <button
        style={{ border: "1px solid #fff" }}
        className="p-3 rounded-full text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

const WatchProductPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-light text-[#B79B76] mb-4 font-olds">
            Our Product
          </h1>
        </div>

        <div className="flex gap-8">
          {/* Left Sidebar - Filters */}
          <FilterSidebar />

          {/* Right Content - Products */}
          <div className="flex-1 mt-11">
            {/* Product Grid - 3 columns, 4 rows = 12 products */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              {mockWatches.map((watch, index) => (
                <WatchCard key={`${watch.id}-${index}`} watch={watch} />
              ))}
            </div>

            {/* Pagination */}
            <Pagination />
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #f59e0b;
          cursor: pointer;
          box-shadow: 0 0 2px 0 #555;
          transition: background 0.15s ease-in-out;
        }

        .slider::-webkit-slider-thumb:hover {
          background: #fbbf24;
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #f59e0b;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default WatchProductPage;
