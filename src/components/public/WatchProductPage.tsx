"use client";

import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Search, Filter, Play, Pause } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "../../../context/LanguageContext";
import { Watch } from "@/lib/types";

// Props interface for the component
interface WatchProductPageProps {
  watches?: Watch[];
}

const WatchCard: React.FC<{ watch: Watch }> = ({ watch }) => {
  const router = useRouter();
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);

  // Get all media (images and videos)
  const media = watch.media || [];
  
  // Use placeholder if no media available
  const displayMedia = media.length > 0 ? media : [{ type: "image", url: "/placeholder-watch.png" }];

  const handlePrevMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef && !videoRef.paused) {
      videoRef.pause();
      setIsVideoPlaying(false);
    }
    setCurrentMediaIndex((prev) =>
      prev === 0 ? displayMedia.length - 1 : prev - 1
    );
  };

  const handleNextMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef && !videoRef.paused) {
      videoRef.pause();
      setIsVideoPlaying(false);
    }
    setCurrentMediaIndex((prev) =>
      prev === displayMedia.length - 1 ? 0 : prev + 1
    );
  };

  const handleDotClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    if (videoRef && !videoRef.paused) {
      videoRef.pause();
      setIsVideoPlaying(false);
    }
    setCurrentMediaIndex(index);
  };

  const handleVideoPlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef) {
      if (videoRef.paused) {
        videoRef.play();
        setIsVideoPlaying(true);
      } else {
        videoRef.pause();
        setIsVideoPlaying(false);
      }
    }
  };

  const handleVideoRef = (el: HTMLVideoElement | null) => {
    setVideoRef(el);
    if (el) {
      el.addEventListener('ended', () => {
        setIsVideoPlaying(false);
      });
    }
  };

  const handleClick = () => {
    router.push(`/watch/${watch.id}`);
  };

  // Check if it's a new arrival (within last 30 days)
  const isNewArrival = () => {
    const createdDate = new Date(watch.created_at);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return createdDate > thirtyDaysAgo;
  };

  // Determine if premium based on price
  const isPremium = () => {
    return watch.selling_price && watch.selling_price > 500000;
  };

  const currentMedia = displayMedia[currentMediaIndex];

  return (
    <div
      className="bg-gradient p-2 sm:p-4 hover:bg-gray-750 transition-colors cursor-pointer group"
      onClick={handleClick}
    >
      <div className="relative aspect-square mb-2 sm:mb-4 flex items-center justify-center overflow-hidden">
        {/* Premium Badge */}
        {isPremium() && (
          <div className="absolute top-1 left-1 sm:top-2 sm:left-2 z-10">
            <span className="badge-gradient text-black text-xs font-medium px-2 py-1 sm:px-3 sm:py-1 truncate">
              Premium
            </span>
          </div>
        )}

        {/* New Arrival Badge */}
        {isNewArrival() && (
          <div className="absolute top-1 right-1 sm:top-2 sm:right-2 z-10">
            <span className="text-white text-sm sm:text-lg font-medium px-2 py-1 sm:px-3 sm:py-1 font-olds truncate">
              New
            </span>
          </div>
        )}

        {/* Media Carousel */}
        <div className="relative w-full h-full flex items-center justify-center">
          {currentMedia.type === "video" ? (
            <div className="relative w-full h-full">
              <video
                ref={handleVideoRef}
                src={currentMedia.url}
                className="max-w-full max-h-full object-contain"
                muted
                loop
                playsInline
                onError={(e) => {
                  // Fallback to placeholder if video fails to load
                  console.error("Video failed to load:", currentMedia.url);
                }}
              />
              
              {/* Video Play/Pause Button */}
              <button
                onClick={handleVideoPlayPause}
                className="absolute inset-0 flex items-center justify-center 
                         bg-black bg-opacity-30 hover:bg-opacity-50 
                         text-white transition-all duration-200 z-10"
              >
                <div className="bg-black bg-opacity-70 p-3 rounded-full">
                  {isVideoPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6 ml-1" />
                  )}
                </div>
              </button>
            </div>
          ) : (
            <img
              src={currentMedia.url}
              alt={`${watch.ref} - ${currentMediaIndex + 1}`}
              className="max-w-full max-h-full object-contain transition-opacity duration-300"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder-watch.png";
              }}
            />
          )}

          {/* Navigation Arrows - Only show if multiple media */}
          {displayMedia.length > 1 && (
            <>
              <button
                onClick={handlePrevMedia}
                className="absolute left-1 sm:left-2 top-1/2 transform -translate-y-1/2 
                         bg-black bg-opacity-70 hover:bg-opacity-90 
                         text-white p-1.5 sm:p-2 rounded-full transition-all duration-200
                         z-20 shadow-lg"
                style={{
                  minWidth: "28px",
                  minHeight: "28px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <button
                onClick={handleNextMedia}
                className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 
                         bg-black bg-opacity-70 hover:bg-opacity-90 
                         text-white p-1.5 sm:p-2 rounded-full transition-all duration-200
                         z-20 shadow-lg"
                style={{
                  minWidth: "28px",
                  minHeight: "28px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </>
          )}
        </div>

        {/* Media Indicators/Dots - Only show if multiple media and ≤5 items */}
        {displayMedia.length > 1 && displayMedia.length <= 5 && (
          <div className="absolute bottom-2 sm:bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1.5 sm:space-x-2 z-20">
            {displayMedia.map((mediaItem, index) => (
              <button
                key={index}
                onClick={(e) => handleDotClick(e, index)}
                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-200 border-2 ${
                  index === currentMediaIndex
                    ? "bg-white border-white"
                    : "bg-transparent border-white border-opacity-60 hover:border-opacity-100"
                }`}
                style={{
                  minWidth: "10px",
                  minHeight: "10px",
                }}
              >
                {/* Add a small indicator for video type */}
                {mediaItem.type === "video" && (
                  <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full border border-white opacity-80" />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Media Counter - For many media items */}
        {displayMedia.length > 5 && (
          <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 bg-black bg-opacity-80 text-white text-xs sm:text-sm font-medium px-2 py-1 sm:px-3 sm:py-1 rounded-full z-20 flex items-center space-x-1">
            <span>{currentMediaIndex + 1}/{displayMedia.length}</span>
            {currentMedia.type === "video" && (
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full" />
            )}
          </div>
        )}

        {/* Media Type Indicator */}
        {currentMedia.type === "video" && (
          <div className="absolute top-1 sm:top-2 left-1/2 transform -translate-x-1/2 z-10">
            <div className="bg-red-600 text-white text-xs font-medium px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full flex items-center space-x-1">
              <Play className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              <span>VIDEO</span>
            </div>
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="space-y-1 sm:space-y-2">
        <h3 className="text-[#B79B76] font-semibold text-lg sm:text-xl font-olds truncate">
          {watch.brand}
        </h3>
        <p className="text-[#6E6E6E] text-xs sm:text-sm leading-relaxed line-clamp-3">
          {watch.model || watch.notes || "Luxury timepiece"}
        </p>

        <div className="grid grid-cols-2 gap-2 sm:gap-4 text-xs text-gray-400" style={{ marginTop: "16px" }}>
          <div>
            <span className="text-[#BFBFBF] block truncate" style={{ fontWeight: 500, fontSize: "12px" }}>
              Ref No.
            </span>
            <div className="text-[#BFBFBF] mt-1 sm:mt-2 truncate" style={{ fontWeight: 500, fontSize: "12px" }}>
              Year
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <span className="text-[#BFBFBF] block truncate" style={{ fontWeight: 500, fontSize: "12px" }}>
              {watch.ref}
            </span>
            <div className="text-[#BFBFBF] mt-1 sm:mt-2 truncate" style={{ fontWeight: 500, fontSize: "12px" }}>
              {watch.watch_year || "N/A"}
            </div>
          </div>
        </div>

        <div className="pt-2 sm:pt-3 pb-1 sm:pb-2">
          <span className="text-white text-lg sm:text-xl md:text-xl lg:text-2xl xl:text-3xl block truncate">
            {watch.currency === "THB" ? "฿" : watch.currency === "USD" ? "$" : "€"}
            {watch.selling_price?.toLocaleString() || "Contact for price"}
          </span>
        </div>
      </div>
    </div>
  );
};

const FilterSidebar: React.FC<{
  selectedBrands: string[];
  setSelectedBrands: (brands: string[]) => void;
  selectedModels: string[];
  setSelectedModels: (models: string[]) => void;
  selectedYears: string[];
  setSelectedYears: (years: string[]) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  isNewArrivalOnly: boolean;
  setIsNewArrivalOnly: (value: boolean) => void;
  isOpen: boolean;
  onClose: () => void;
  watches: Watch[];
}> = ({
  selectedBrands,
  setSelectedBrands,
  selectedModels,
  setSelectedModels,
  selectedYears,
  setSelectedYears,
  priceRange,
  setPriceRange,
  isNewArrivalOnly,
  setIsNewArrivalOnly,
  isOpen,
  onClose,
  watches,
}) => {
  // Extract unique brands, models, and years from actual data
  const brands = useMemo(() => 
    [...new Set(watches.map(w => w.brand))].sort(), 
    [watches]
  );
  
  const models = useMemo(() => 
    [...new Set(watches.map(w => w.model).filter((model): model is string => Boolean(model)))].sort(), 
    [watches]
  );
  
  const years = useMemo(() => 
    [...new Set(watches.map(w => w.watch_year).filter((year): year is number => Boolean(year)))].sort((a, b) => b - a), 
    [watches]
  );

  // Get max price from actual data
  const maxPrice = useMemo(() => {
    const prices = watches.map(w => w.selling_price).filter(Boolean);
    return prices.length > 0 ? Math.max(...prices as number[]) : 3500000;
  }, [watches]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands(
      selectedBrands.includes(brand)
        ? selectedBrands.filter((b) => b !== brand)
        : [...selectedBrands, brand]
    );
  };

  const toggleModel = (model: string) => {
    setSelectedModels(
      selectedModels.includes(model)
        ? selectedModels.filter((m) => m !== model)
        : [...selectedModels, model]
    );
  };

  const toggleYear = (year: number) => {
    const yearString = year.toString();
    setSelectedYears(
      selectedYears.includes(yearString)
        ? selectedYears.filter((y) => y !== yearString)
        : [...selectedYears, yearString]
    );
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden"
          onClick={onClose}
        />
      )}
      <h2 className="text-white text-xl mb-4 hidden sm:block font-olds" style={{ fontWeight: "400" }}>
        Search Filters
      </h2>
      {/* Sidebar */}
      <div
        className={`
        fixed sm:sticky top-0 left-0 h-full sm:h-fit z-50 sm:z-auto
        w-80 sm:w-72 bg-[#141519] p-6 
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        sm:translate-x-0 sm:block
        overflow-y-auto
      `}
      >
        <div className="flex justify-between items-center sm:hidden mb-4">
          <h2 className="text-white text-xl font-medium font-olds">Search Filters</h2>
          <button onClick={onClose} className="text-white text-2xl">
            ×
          </button>
        </div>

        {/* Brand Filter */}
        {brands.length > 0 && (
          <div className="mb-6">
            <h3 className="text-[#E0D0B9] font-medium mb-3 font-olds text-left">
              Brand
            </h3>
            <div className="space-y-3">
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
        )}

        {/* Price Filter */}
        <div className="mb-6">
          <h3 className="text-[#E0D0B9] font-medium mb-3 font-olds text-left">
            Max Price
          </h3>
          <div className="px-2">
            <div className="mb-3">
              <input
                type="range"
                min="50000"
                max={maxPrice}
                step="10000"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], parseInt(e.target.value)])
                }
                className="w-full h-2 bg-white rounded-lg appearance-none cursor-pointer slider"
                style={{ height: "1px" }}
              />
            </div>
            <div className="flex justify-between text-xs text-white mt-2">
              <span>฿{(priceRange[1] / 1000).toLocaleString()}K</span>
            </div>
          </div>
        </div>

        {/* Model Filter */}
        {models.length > 0 && (
          <div className="mb-6">
            <h3 className="text-[#E0D0B9] font-medium mb-3 font-olds text-left">
              Model
            </h3>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {models.map((model) => (
                <label
                  key={model}
                  className="flex items-center space-x-3 cursor-pointer hover:bg-gray-800 p-2 rounded"
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-amber-500 bg-gray-800 border-gray-600 rounded focus:ring-amber-500 focus:ring-2"
                    checked={selectedModels.includes(model)}
                    onChange={() => toggleModel(model)}
                  />
                  <span className="text-gray-300 text-sm">{model}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Year Filter */}
        {years.length > 0 && (
          <div className="mb-6">
            <h3 className="text-[#E0D0B9] font-medium mb-3 font-olds text-left">
              Year
            </h3>
            <div className="space-y-2">
              {years.map((year) => (
                <label
                  key={year}
                  className="flex items-center space-x-3 cursor-pointer hover:bg-gray-800 p-2 rounded"
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-amber-500 bg-gray-800 border-gray-600 rounded focus:ring-amber-500 focus:ring-2"
                    checked={selectedYears.includes(year.toString())}
                    onChange={() => toggleYear(year)}
                  />
                  <span className="text-gray-300 text-sm">{year}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* New Arrival Filter */}
        <div className="mb-6">
          <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-800 p-2 rounded">
            <input
              type="checkbox"
              className="w-4 h-4 text-amber-500 bg-gray-800 border-gray-600 rounded focus:ring-amber-500 focus:ring-2"
              checked={isNewArrivalOnly}
              onChange={(e) => setIsNewArrivalOnly(e.target.checked)}
            />
            <span className="text-[#E0D0B9] font-medium font-olds">
              New Arrivals Only
            </span>
          </label>
        </div>

        <button className="w-full primary-btn-md mt-7">APPLY FILTER</button>
      </div>
    </>
  );
};

const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex items-center justify-center space-x-2 mt-12 mb-8">
      <button
        style={{ border: "1px solid #fff" }}
        className="p-3 rounded-full text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        disabled={currentPage === 1}
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          className={`w-12 h-12 rounded-full font-medium transition-colors ${
            currentPage === page
              ? "text-white"
              : "text-[#686868] hover:bg-gray-700"
          }`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      <button
        style={{ border: "1px solid #fff" }}
        className="p-3 rounded-full text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

const WatchProductPage: React.FC<WatchProductPageProps> = ({ watches = [] }) => {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([50000, 3500000]);
  const [isNewArrivalOnly, setIsNewArrivalOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Initialize price range based on actual data
  React.useEffect(() => {
    if (watches.length > 0) {
      const prices = watches.map(w => w.selling_price).filter(Boolean) as number[];
      if (prices.length > 0) {
        const maxPrice = Math.max(...prices);
        setPriceRange([50000, maxPrice]);
      }
    }
  }, [watches]);

  // Initialize search term from URL parameters
  React.useEffect(() => {
    const urlSearchQuery = searchParams.get("q");
    if (urlSearchQuery && urlSearchQuery !== searchTerm) {
      setSearchTerm(urlSearchQuery);
      setCurrentPage(1);
    }
  }, [searchParams, searchTerm]);

  // Handle search term changes and update URL
  const handleSearchTermChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);

    const params = new URLSearchParams(searchParams);
    if (value.trim()) {
      params.set("q", value.trim());
    } else {
      params.delete("q");
    }

    const newURL = params.toString()
      ? `/?${params.toString()}#product`
      : "/#product";
    router.push(newURL, { scroll: false });
  };

  // Check URL parameters for filters
  React.useEffect(() => {
    const checkUrlParams = () => {
      if (typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search);

        // Check for newArrivals parameter
        if (urlParams.get("newArrivals") === "true") {
          setIsNewArrivalOnly(true);
          setCurrentPage(1);
        }

        // Check for brand parameter
        const brandParam = urlParams.get("brand");
        if (brandParam && watches.length > 0) {
          const availableBrands = [...new Set(watches.map(w => w.brand))];
          const matchingBrand = availableBrands.find(
            (brand) => brand.toLowerCase() === brandParam.toLowerCase()
          );

          if (matchingBrand && !selectedBrands.includes(matchingBrand)) {
            setSelectedBrands([matchingBrand]);
            setCurrentPage(1);
          }
        }
      }
    };

    checkUrlParams();
  }, [selectedBrands, watches]);

  // Helper function to check if watch is new arrival
  const isNewArrival = (watch: Watch) => {
    const createdDate = new Date(watch.created_at);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return createdDate > thirtyDaysAgo;
  };

  const filteredWatches = useMemo(() => {
    return watches.filter((watch) => {
      // Only show public watches that are available (not sold or hidden)
      if (!watch.is_public || watch.status === "Sold" || watch.status === "Hidden") {
        return false;
      }

      // Search term filter
      if (searchTerm.trim()) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
          watch.brand.toLowerCase().includes(searchLower) ||
          (watch.model && watch.model.toLowerCase().includes(searchLower)) ||
          watch.ref.toLowerCase().includes(searchLower) ||
          (watch.notes && watch.notes.toLowerCase().includes(searchLower));

        if (!matchesSearch) return false;
      }

      // Brand filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(watch.brand)) {
        return false;
      }

      // Model filter
      if (selectedModels.length > 0 && (!watch.model || !selectedModels.includes(watch.model))) {
        return false;
      }

      // Year filter
      if (selectedYears.length > 0 && (!watch.watch_year || !selectedYears.includes(watch.watch_year.toString()))) {
        return false;
      }

      // Price filter
      if (watch.selling_price && watch.selling_price > priceRange[1]) {
        return false;
      }

      // New arrival filter
      if (isNewArrivalOnly && !isNewArrival(watch)) {
        return false;
      }

      return true;
    });
  }, [
    watches,
    selectedBrands,
    selectedModels,
    selectedYears,
    priceRange,
    isNewArrivalOnly,
    searchTerm,
  ]);

  const totalPages = Math.ceil(filteredWatches.length / 12);
  const startIndex = (currentPage - 1) * 12;
  const displayedWatches = filteredWatches.slice(startIndex, startIndex + 12);

  return (
    <div className="min-h-screen bg-black text-white mt-12" id="product">
      <div className="max-w-[90%] mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-5xl font-light text-[#B79B76] mb-6 font-olds">
            {t("CollectionSection.title")}
          </h1>

          {/* Search Results Indicator */}
          {searchTerm && (
            <div className="mb-4 text-gray-300">
              <p className="text-lg">
                Search results for:{" "}
                <span className="text-[#B79B76] font-medium">
                  &quot;{searchTerm}&quot;
                </span>
              </p>
              <p className="text-sm text-gray-400">
                {filteredWatches.length}{" "}
                {filteredWatches.length === 1 ? "watch" : "watches"} found
              </p>
            </div>
          )}

          {/* Mobile Search Bar */}
          <div className="sm:hidden mb-6 flex justify-between">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => handleSearchTermChange(e.target.value)}
                className="w-full bg-black border border-white rounded-sm py-3 pl-12 pr-4 text-white placeholder-white focus:outline-none"
              />
            </div>

            {/* Mobile Filter Button */}
            <button onClick={() => setIsFilterOpen(true)} className="ml-3">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex sm:gap-0 md:gap-8">
          {/* Left Sidebar - Filters */}
          <div className="hidden sm:block">
            <FilterSidebar
              selectedBrands={selectedBrands}
              setSelectedBrands={setSelectedBrands}
              selectedModels={selectedModels}
              setSelectedModels={setSelectedModels}
              selectedYears={selectedYears}
              setSelectedYears={setSelectedYears}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              isNewArrivalOnly={isNewArrivalOnly}
              setIsNewArrivalOnly={setIsNewArrivalOnly}
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
              watches={watches}
            />
          </div>

          {/* Mobile Filter Sidebar */}
          <div className="sm:hidden">
            <FilterSidebar
              selectedBrands={selectedBrands}
              setSelectedBrands={setSelectedBrands}
              selectedModels={selectedModels}
              setSelectedModels={setSelectedModels}
              selectedYears={selectedYears}
              setSelectedYears={setSelectedYears}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              isNewArrivalOnly={isNewArrivalOnly}
              setIsNewArrivalOnly={setIsNewArrivalOnly}
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
              watches={watches}
            />
          </div>

          {/* Right Content - Products */}
          <div className="flex-1 sm:mt-11">
            {/* Clear Search Button */}
            {searchTerm && (
              <div className="mb-4 flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  Showing {filteredWatches.length} results
                </div>
                <button
                  onClick={() => handleSearchTermChange("")}
                  className="text-sm text-[#B79B76] hover:text-[#D4B896] transition-colors"
                >
                  Clear search
                </button>
              </div>
            )}

            {/* Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mb-8">
              {displayedWatches.map((watch) => (
                <WatchCard key={watch.id} watch={watch} />
              ))}
            </div>

            {/* No results message */}
            {displayedWatches.length === 0 && (
              <div className="text-center py-12">
                <div className="mb-4">
                  <Search className="mx-auto h-16 w-16 text-gray-600 mb-4" />
                  {searchTerm ? (
                    <>
                      <p className="text-gray-400 text-lg mb-2">
                        No watches found for &quot;{searchTerm}&quot;
                      </p>
                      <p className="text-gray-500 text-sm mb-4">
                        Try adjusting your search or filters to find what you&apos;re
                        looking for.
                      </p>
                      <button
                        onClick={() => {
                          handleSearchTermChange("");
                          setSelectedBrands([]);
                          setSelectedModels([]);
                          setSelectedYears([]);
                          setPriceRange([50000, Math.max(...watches.map(w => w.selling_price).filter(Boolean) as number[]) || 3500000]);
                          setIsNewArrivalOnly(false);
                        }}
                        className="text-[#B79B76] hover:text-[#D4B896] transition-colors underline"
                      >
                        Clear all filters
                      </button>
                    </>
                  ) : (
                    <p className="text-gray-400 text-lg">
                      No watches found matching your filters.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
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