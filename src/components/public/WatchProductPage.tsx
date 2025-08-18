"use client";

import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Search, Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../../context/LanguageContext";

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

const mockWatches: Watch[] = [
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
  {
    id: "5",
    brand: "FRANCK MULLER",
    model: "Black Bay 58",
    description: "Black Bay 58 Bronze Brown Dial Fabric Strap",
    refNo: "79012M",
    year: "2023",
    price: 145000,
    image: "/newArrival/watch.png",
    isPremium: false,
    caseSize: "39mm",
    isNewArrival: false,
  },
  {
    id: "6",
    brand: "PATEK",
    model: "Nautilus",
    description: "Nautilus Blue Dial Steel Bracelet Annual Calendar",
    refNo: "5711/1A-010",
    year: "2024",
    price: 3200000,
    image: "/newArrival/watch.png",
    isPremium: true,
    caseSize: "40mm",
    isNewArrival: true,
  },
  {
    id: "7",
    brand: "ROLEX",
    model: "Submariner",
    description: "Submariner Date Black Dial Ceramic Bezel Steel",
    refNo: "126610LN",
    year: "2023",
    price: 485000,
    image: "/newArrival/watch.png",
    isPremium: true,
    caseSize: "41mm",
    isNewArrival: false,
  },
  {
    id: "8",
    brand: "OMEGA",
    model: "Seamaster",
    description: "Seamaster Planet Ocean 600M Co-Axial Master",
    refNo: "215.30.44.21.01.001",
    year: "2022",
    price: 198000,
    image: "/newArrival/watch.png",
    isPremium: false,
    caseSize: "43mm",
    isNewArrival: false,
  },
  {
    id: "9",
    brand: "CARTIER",
    model: "Santos",
    description: "Santos de Cartier Large Model Steel Gold Bezel",
    refNo: "WSSA0009",
    year: "2021",
    price: 325000,
    image: "/newArrival/watch.png",
    isPremium: true,
    caseSize: "39mm",
    isNewArrival: false,
  },
  {
    id: "10",
    brand: "FRANCK MULLER",
    model: "Pelagos 39",
    description: "Pelagos 39 Titanium Blue Dial Rubber Strap",
    refNo: "25407N",
    year: "2023",
    price: 168000,
    image: "/newArrival/watch.png",
    isPremium: false,
    caseSize: "39mm",
    isNewArrival: true,
  },
  {
    id: "11",
    brand: "PATEK",
    model: "Calatrava",
    description: "Calatrava White Gold Silver Dial Leather Strap",
    refNo: "5196G-001",
    year: "2022",
    price: 890000,
    image: "/newArrival/watch.png",
    isPremium: true,
    caseSize: "37mm",
    isNewArrival: false,
  },
  {
    id: "12",
    brand: "RICHARD MILLE",
    model: "RM 11-03",
    description: "RM 11-03 Titanium Flyback Chrono McLaren Edition",
    refNo: "RM11-03",
    year: "2021",
    price: 2100000,
    image: "/newArrival/watch.png",
    isPremium: true,
    caseSize: "50mm",
    isNewArrival: true,
  },
];

const WatchCard: React.FC<{ watch: Watch }> = ({ watch }) => {
  const router = useRouter();
  
  const handleClick = () => {
    router.push(`/watch/1`);
  };

  return (
    <div
      className="bg-gradient p-4 hover:bg-gray-750 transition-colors cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative aspect-square mb-4 flex items-center justify-center overflow-hidden">
        {watch.isPremium && (
          <div className="absolute top-2 left-2 z-10">
            <span className="badge-gradient text-black text-xs font-medium px-3 py-1 truncate">
              Premium
            </span>
          </div>
        )}
        {watch.isNewArrival && (
          <div className="absolute top-2 right-2 z-10">
            <span className="text-white text-lg font-medium px-3 py-1 font-olds truncate">
              New
            </span>
          </div>
        )}
        <div className="flex items-center justify-center">
          <div>
            <img src={watch.image} alt={watch.refNo} className="max-w-full max-h-full object-contain" />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-[#B79B76] font-semibold text-xl font-olds truncate">
          {watch.brand}
        </h3>
        <p className="text-[#6E6E6E] text-sm leading-relaxed line-clamp-3">
          {watch.description}
        </p>

        <div
          className="grid grid-cols-2 gap-4 text-xs text-gray-400"
          style={{ marginTop: "20px" }}
        >
          <div>
            <span
              className="text-[#BFBFBF] block truncate"
              style={{ fontWeight: 500, fontSize: "14px" }}
            >
              Ref No.
            </span>
            <div
              className="text-[#BFBFBF] mt-2 truncate"
              style={{ fontWeight: 500, fontSize: "14px" }}
            >
              Year
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <span
              className="text-[#BFBFBF] block truncate"
              style={{ fontWeight: 500, fontSize: "14px" }}
            >
              {watch.refNo}
            </span>
            <div
              className="text-[#BFBFBF] mt-2 truncate"
              style={{ fontWeight: 500, fontSize: "14px" }}
            >
              {watch.year}
            </div>
          </div>
        </div>

        <div className="pt-3 pb-2">
          <span className="text-white md:text-xl lg:text-2xl xl:text-3xl font-bold block truncate">
            ฿{watch.price.toLocaleString()}
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
  selectedCaseSizes: string[];
  setSelectedCaseSizes: (sizes: string[]) => void;
  selectedYears: string[];
  setSelectedYears: (years: string[]) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  isNewArrivalOnly: boolean;
  setIsNewArrivalOnly: (value: boolean) => void;
  isOpen: boolean;
  onClose: () => void;
}> = ({
  selectedBrands,
  setSelectedBrands,
  selectedModels,
  setSelectedModels,
  selectedCaseSizes,
  setSelectedCaseSizes,
  selectedYears,
  setSelectedYears,
  priceRange,
  setPriceRange,
  isNewArrivalOnly,
  setIsNewArrivalOnly,
  isOpen,
  onClose,
}) => {
  const brands = [
    "Rolex",
    "Omega",
    "Cartier",
    "Richard Mille",
    "franck muller",
    "Patek",
    "Audemars Piguet",
  ];
  const models = [
    "Datejust 36",
    "Speedmaster",
    "Tank Must",
    "RM 35-02",
    "Black Bay 58",
    "Nautilus",
    "Submariner",
    "Seamaster",
    "Santos",
    "Pelagos 39",
    "Calatrava",
    "RM 11-03",
  ];
  const caseSizes = [
    "35mm",
    "36mm",
    "37mm",
    "39mm",
    "40mm",
    "41mm",
    "42mm",
    "43mm",
    "49mm",
    "50mm",
  ];
  const years = ["2021", "2022", "2023", "2024"];

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

  const toggleCaseSize = (size: string) => {
    setSelectedCaseSizes(
      selectedCaseSizes.includes(size)
        ? selectedCaseSizes.filter((s) => s !== size)
        : [...selectedCaseSizes, size]
    );
  };

  const toggleYear = (year: string) => {
    setSelectedYears(
      selectedYears.includes(year)
        ? selectedYears.filter((y) => y !== year)
        : [...selectedYears, year]
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
         <h2 className="text-white text-xl mb-4 hidden md:block" style={{ fontWeight: "400" }}>
          Search Filters
        </h2>
      {/* Sidebar */}
      <div className={`
        fixed sm:sticky top-0 left-0 h-full sm:h-fit z-50 sm:z-auto
        w-80 sm:w-72 bg-[#141519] p-6 
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        sm:translate-x-0 sm:block
        overflow-y-auto
      `}>
        <div className="flex justify-between items-center sm:hidden mb-4">
          <h2 className="text-white text-xl font-medium">Search Filters</h2>
          <button 
            onClick={onClose}
            className="text-white text-2xl"
          >
            ×
          </button>
        </div>
        
        {/* <h2 className="text-white text-xl mb-4 hidden sm:block" style={{ fontWeight: "400" }}>
          Search Filters
        </h2> */}

        {/* Brand Filter */}
        <div className="mb-6">
          <h3 className="text-[#E0D0B9] font-medium mb-3 font-olds text-left">Brand</h3>
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

        {/* Price Filter */}
        <div className="mb-6">
          <h3 className="text-[#E0D0B9] font-medium mb-3 font-olds text-left">Max Price</h3>
          <div className="px-2">
            <div className="mb-3">
              <input
                type="range"
                min="50000"
                max="3500000"
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
        <div className="mb-6">
          <h3 className="text-[#E0D0B9] font-medium mb-3 font-olds text-left">Model</h3>
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

        {/* Case Size Filter */}
        <div className="mb-6">
          <h3 className="text-[#E0D0B9] font-medium mb-3 font-olds text-left">
            Case Size
          </h3>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {caseSizes.map((size) => (
              <label
                key={size}
                className="flex items-center space-x-3 cursor-pointer hover:bg-gray-800 p-2 rounded"
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 text-amber-500 bg-gray-800 border-gray-600 rounded focus:ring-amber-500 focus:ring-2"
                  checked={selectedCaseSizes.includes(size)}
                  onChange={() => toggleCaseSize(size)}
                />
                <span className="text-gray-300 text-sm">{size}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Year Filter */}
        <div className="mb-6">
          <h3 className="text-[#E0D0B9] font-medium mb-3 font-olds text-left">Year</h3>
          <div className="space-y-2">
            {years.map((year) => (
              <label
                key={year}
                className="flex items-center space-x-3 cursor-pointer hover:bg-gray-800 p-2 rounded"
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 text-amber-500 bg-gray-800 border-gray-600 rounded focus:ring-amber-500 focus:ring-2"
                  checked={selectedYears.includes(year)}
                  onChange={() => toggleYear(year)}
                />
                <span className="text-gray-300 text-sm">{year}</span>
              </label>
            ))}
          </div>
        </div>

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

const WatchProductPage: React.FC = () => {
  const { t } = useLanguage();
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [selectedCaseSizes, setSelectedCaseSizes] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    50000, 3500000,
  ]);
  const [isNewArrivalOnly, setIsNewArrivalOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Check URL parameters for new arrival filter
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
        if (brandParam) {
          // Find matching brand (case insensitive)
          const brands = [
            "Rolex",
            "Omega",
            "Cartier",
            "Richard Mille",
            "franck muller",
            "Patek",
            "Audemars Piguet",
          ];
          const matchingBrand = brands.find(
            (brand) => brand.toLowerCase() === brandParam.toLowerCase()
          );

          if (matchingBrand && !selectedBrands.includes(matchingBrand)) {
            setSelectedBrands([matchingBrand]);
            setCurrentPage(1);
          }
        }
      }
    };

    // Check immediately
    checkUrlParams();

    // Check when page becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkUrlParams();
      }
    };

    // Check when user focuses on window
    const handleFocus = () => {
      checkUrlParams();
    };

    // Check when scrolling to this section
    const handleScroll = () => {
      const productSection = document.getElementById("product");
      if (productSection) {
        const rect = productSection.getBoundingClientRect();
        const isVisible = rect.top >= 0 && rect.top <= window.innerHeight;
        if (isVisible) {
          checkUrlParams();
        }
      }
    };

    // Set up Intersection Observer for when section becomes visible
    const productSection = document.getElementById("product");
    let observer: IntersectionObserver | null = null;

    if (productSection) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              checkUrlParams();
            }
          });
        },
        { threshold: 0.1 }
      );

      observer.observe(productSection);
    }

    // Add event listeners
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("scroll", handleScroll);

    // Check with delays to ensure URL is updated
    const timeoutId1 = setTimeout(checkUrlParams, 100);
    const timeoutId2 = setTimeout(checkUrlParams, 500);
    const timeoutId3 = setTimeout(checkUrlParams, 1000);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("scroll", handleScroll);
      if (observer) observer.disconnect();
      clearTimeout(timeoutId1);
      clearTimeout(timeoutId2);
      clearTimeout(timeoutId3);
    };
  }, [selectedBrands]);

  // Update URL when isNewArrivalOnly changes
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);

      if (isNewArrivalOnly) {
        // Add parameter if not already present
        if (urlParams.get("newArrivals") !== "true") {
          urlParams.set("newArrivals", "true");
          const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
          window.history.pushState({}, "", newUrl);
        }
      } else {
        // Remove parameter if present
        if (urlParams.has("newArrivals")) {
          urlParams.delete("newArrivals");
          const newUrl = urlParams.toString()
            ? `${window.location.pathname}?${urlParams.toString()}`
            : window.location.pathname;
          window.history.pushState({}, "", newUrl);
        }
      }
    }
  }, [isNewArrivalOnly]);

  // Update URL when selectedBrands changes
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);

      if (selectedBrands.length > 0) {
        // Add brand parameter
        urlParams.set("brand", selectedBrands[0].toLowerCase());
        const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
        window.history.pushState({}, "", newUrl);
      } else {
        // Remove brand parameter if present
        if (urlParams.has("brand")) {
          urlParams.delete("brand");
          const newUrl = urlParams.toString()
            ? `${window.location.pathname}?${urlParams.toString()}`
            : window.location.pathname;
          window.history.pushState({}, "", newUrl);
        }
      }
    }
  }, [selectedBrands]);

  const filteredWatches = useMemo(() => {
    return mockWatches.filter((watch) => {
      // Search term filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          watch.brand.toLowerCase().includes(searchLower) ||
          watch.model.toLowerCase().includes(searchLower) ||
          watch.description.toLowerCase().includes(searchLower) ||
          watch.refNo.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }

      // Brand filter - case insensitive comparison
      if (
        selectedBrands.length > 0 &&
        !selectedBrands.some(
          (brand) => brand.toUpperCase() === watch.brand.toUpperCase()
        )
      ) {
        return false;
      }

      // Model filter
      if (selectedModels.length > 0 && !selectedModels.includes(watch.model)) {
        return false;
      }

      // Case size filter
      if (
        selectedCaseSizes.length > 0 &&
        !selectedCaseSizes.includes(watch.caseSize)
      ) {
        return false;
      }

      // Year filter
      if (selectedYears.length > 0 && !selectedYears.includes(watch.year)) {
        return false;
      }

      // Price filter
      if (watch.price > priceRange[1]) {
        return false;
      }

      // New arrival filter
      if (isNewArrivalOnly && !watch.isNewArrival) {
        return false;
      }

      return true;
    });
  }, [
    selectedBrands,
    selectedModels,
    selectedCaseSizes,
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
          
          {/* Mobile Search Bar */}
          <div className="sm:hidden mb-6 flex justify-between">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black border border-white rounded-sm py-3 pl-12 pr-4 text-white placeholder-white focus:outline-none "
              />
            </div>
            
            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsFilterOpen(true)}
              className="ml-3"
            >
              <Filter className="w-5 h-5" />
              {/* <span>Filters</span> */}
            </button>
          </div>
        </div>

        <div className="flex sm:gap-0 md:gap-8">
          {/* Left Sidebar - Filters (Hidden on mobile) */}
          <div className="hidden sm:block">
            <FilterSidebar
              selectedBrands={selectedBrands}
              setSelectedBrands={setSelectedBrands}
              selectedModels={selectedModels}
              setSelectedModels={setSelectedModels}
              selectedCaseSizes={selectedCaseSizes}
              setSelectedCaseSizes={setSelectedCaseSizes}
              selectedYears={selectedYears}
              setSelectedYears={setSelectedYears}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              isNewArrivalOnly={isNewArrivalOnly}
              setIsNewArrivalOnly={setIsNewArrivalOnly}
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
            />
          </div>

          {/* Mobile Filter Sidebar */}
          <div className="sm:hidden">
            <FilterSidebar
              selectedBrands={selectedBrands}
              setSelectedBrands={setSelectedBrands}
              selectedModels={selectedModels}
              setSelectedModels={setSelectedModels}
              selectedCaseSizes={selectedCaseSizes}
              setSelectedCaseSizes={setSelectedCaseSizes}
              selectedYears={selectedYears}
              setSelectedYears={setSelectedYears}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              isNewArrivalOnly={isNewArrivalOnly}
              setIsNewArrivalOnly={setIsNewArrivalOnly}
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
            />
          </div>

          {/* Right Content - Products */}
          <div className="flex-1 sm:mt-11">
            {/* Product Grid - Mobile: 1 column on sm, 2 columns on md+, 3 columns on xl+ */}
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mb-8">
              {displayedWatches.map((watch, index) => (
                <WatchCard key={`${watch.id}-${index}`} watch={watch} />
              ))}
            </div>

            {/* No results message */}
            {displayedWatches.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">
                  No watches found matching your filters.
                </p>
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