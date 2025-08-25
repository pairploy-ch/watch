"use client";
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import Header from "@/components/public/Header";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "../../../../../context/LanguageContext";
import { createClient } from "@/lib/supabase/client";
import { Watch, WatchMedia } from "@/lib/types";

// Add the missing WatchRaw interface
interface WatchRaw {
  id: number;
  ref: string | null;
  brand: string | null;
  model: string | null;
  watch_year: number | null;
  serial_no: string | null;
  product_type: string | null;
  set_type: {
    box?: boolean;
    papers?: boolean;
    accessories?: boolean;
  } | null;
  size_mm: number | null;
  material: string | null;
  cost_price: number | null;
  selling_price: number | null;
  currency: string | null;
  status: string | null;
  is_public: boolean | null;
  notes: string | null;
  supplier_id: number | null;
  created_at: string | null;
  updated_at: string | null;
  view_count: number | null;
  ownership_type: string | null;
  commission_rate: number | null;
  commission_amount: number | null;
  owner_name: string | null;
  owner_contact: string | null;
  profit: number | null;
  margin_percent: number | null;
  profit_status: string | null;
  watch_media: WatchMedia[];
  images_url?: string[];
  video_url?: string;
}

// Type guard functions
const isValidProductType = (type: string | null): type is "New" | "Used" | "Vintage" | "NOS" | null => {
  return type === null || ["New", "Used", "Vintage", "NOS"].includes(type);
};

const isValidCurrency = (currency: string | null): currency is "THB" | "USD" | "EUR" => {
  return currency === "THB" || currency === "USD" || currency === "EUR";
};

const isValidStatus = (status: string | null): status is "Available" | "Reserved" | "Sold" | "Hidden" => {
  return status === "Available" || status === "Reserved" || status === "Sold" || status === "Hidden";
};

const isValidOwnershipType = (type: string | null): type is "stock" | "commission" => {
  return type === "stock" || type === "commission";
};

const isValidProfitStatus = (status: string | null): status is "commission" | "positive" | "negative" | "break_even" | "unknown" | null => {
  return status === null || ["commission", "positive", "negative", "break_even", "unknown"].includes(status);
};

interface WatchCardProps {
  watch: Watch;
}

const WatchCard: React.FC<WatchCardProps> = ({ watch }) => {
  const router = useRouter();

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

  // Get first image from media
  const firstImage = watch.media?.find(m => m.type === "image")?.url || "/placeholder-watch.png";

  return (
    <div
      className="p-4 hover:bg-gray-750 transition-colors cursor-pointer"
      onClick={handleClick}
    >
      <div className="bg-gradient relative aspect-square mb-4 flex items-center justify-center overflow-hidden p-2">
        {isPremium() && (
          <div className="absolute top-2 left-2 z-10">
            <span className="badge-gradient text-black text-xs font-medium px-3 py-1">
              Premium
            </span>
          </div>
        )}
        {isNewArrival() && (
          <div className="absolute top-2 right-2 z-10">
            <span className="text-white text-lg font-medium px-3 py-1 font-olds">
              New
            </span>
          </div>
        )}
        <div className="flex items-center justify-center">
          <div>
            <img 
              src={firstImage} 
              alt={watch.ref} 
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder-watch.png";
              }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-[#B79B76] font-semibold text-xl font-olds">
          {watch.brand}
        </h3>
        <p className="text-[#6E6E6E] text-sm leading-relaxed">
          {watch.model || watch.notes || "Luxury timepiece"}
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
              {watch.ref}
            </span>
            <div
              className="text-[#BFBFBF] mt-2"
              style={{ fontWeight: 500, fontSize: "14px" }}
            >
              {watch.watch_year || "N/A"}
            </div>
          </div>
        </div>

        <div className="pt-3 pb-2">
          <span className="text-white text-3xl font-bold">
            {watch.currency === "THB" ? "฿" : watch.currency === "USD" ? "$" : "€"}
            {watch.selling_price?.toLocaleString() || "Contact for price"}
          </span>
        </div>
      </div>
    </div>
  );
};

const WatchDetailPage: React.FC = () => {
  const { t } = useLanguage();
  // const router = useRouter();
  const params = useParams();
  const watchId = params.id as string;
  
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);
  const [watch, setWatch] = useState<Watch | null>(null);
  const [relatedWatches, setRelatedWatches] = useState<Watch[]>([]);
  const [allWatches, setAllWatches] = useState<Watch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch watch data from database
  useEffect(() => {
    const fetchWatchData = async () => {
      if (!watchId) {
        setError("Watch ID not found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const supabase = createClient();

        // Fetch specific watch
        const { data: watchData, error: watchError } = await supabase
          .from("watches")
          .select("*, watch_media(*)")
          .eq("id", parseInt(watchId))
          .eq("is_public", true)
          .single();

        if (watchError) {
          throw new Error(watchError.message);
        }

        // Fetch related watches (same brand, different id)
        const { data: relatedData, error: relatedError } = await supabase
          .from("watches")
          .select("*, watch_media(*)")
          .eq("brand", watchData.brand)
          .neq("id", parseInt(watchId))
          .eq("is_public", true)
          .neq("status", "Sold")
          .limit(4);

        if (relatedError) {
          console.error("Error fetching related watches:", relatedError.message);
        }

        // Fetch all watches for header
        const { data: allWatchesData, error: allWatchesError } = await supabase
          .from("watches")
          .select("*, watch_media(*)")
          .eq("is_public", true)
          .neq("status", "Sold")
          .limit(50);

        if (allWatchesError) {
          console.error("Error fetching all watches:", allWatchesError.message);
        }

        // Transform data
        const transformWatchData = (watchRaw: WatchRaw): Watch => {
          // Media จากตาราง watch_media
          const newMedia = Array.isArray(watchRaw.watch_media)
            ? [...watchRaw.watch_media].sort(
                (a, b) => (a.position ?? 0) - (b.position ?? 0)
              )
            : [];

          // Media แบบ legacy (images_url, video_url)
          const legacyMedia: WatchMedia[] = [];

          if (Array.isArray(watchRaw.images_url)) {
            watchRaw.images_url.forEach((url: string, index: number) => {
              legacyMedia.push({
                id: index,
                watch_id: watchRaw.id,
                url,
                type: "image",
                position: index,
                created_at: watchRaw.created_at ?? "",
              });
            });
          }

          if (watchRaw.video_url) {
            legacyMedia.push({
              id: Array.isArray(watchRaw.images_url)
                ? watchRaw.images_url.length
                : 0,
              watch_id: watchRaw.id,
              url: watchRaw.video_url,
              type: "video",
              position: legacyMedia.length,
              created_at: watchRaw.created_at ?? "",
            });
          }

          const combinedMedia: WatchMedia[] = [...newMedia, ...legacyMedia];

          // Return ในรูปแบบ Watch ที่คุณ define ไว้ - with proper type validation
          return {
            id: watchRaw.id,
            ref: watchRaw.ref || "",
            brand: watchRaw.brand || "",
            model: watchRaw.model,
            watch_year: watchRaw.watch_year,
            serial_no: watchRaw.serial_no,
            product_type: isValidProductType(watchRaw.product_type) ? watchRaw.product_type : null,
            set_type: watchRaw.set_type,
            size_mm: watchRaw.size_mm,
            material: watchRaw.material,
            cost_price: watchRaw.cost_price,
            selling_price: watchRaw.selling_price,
            currency: isValidCurrency(watchRaw.currency) ? watchRaw.currency : "THB",
            status: isValidStatus(watchRaw.status) ? watchRaw.status : "Available",
            is_public: watchRaw.is_public || false,
            notes: watchRaw.notes,
            supplier_id: watchRaw.supplier_id,
            created_at: watchRaw.created_at || "",
            updated_at: watchRaw.updated_at || "",
            view_count: watchRaw.view_count || 0,
            media: combinedMedia,
            ownership_type: isValidOwnershipType(watchRaw.ownership_type) ? watchRaw.ownership_type : "stock",
            commission_rate: watchRaw.commission_rate,
            commission_amount: watchRaw.commission_amount,
            owner_name: watchRaw.owner_name,
            owner_contact: watchRaw.owner_contact,
            profit: watchRaw.profit || 0,
            margin_percent: watchRaw.margin_percent || 0,
            profit_status: isValidProfitStatus(watchRaw.profit_status) ? watchRaw.profit_status || "unknown" : "unknown",
          };
        };

        setWatch(transformWatchData(watchData));
        
        if (relatedData) {
          setRelatedWatches(relatedData.map(transformWatchData));
        }

        if (allWatchesData) {
          setAllWatches(allWatchesData.map(transformWatchData));
        }

        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch watch data");
      } finally {
        setLoading(false);
      }
    };

    if (watchId) {
      fetchWatchData();
    }
  }, [watchId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 mx-auto border-4 border-amber-200 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 mx-auto border-4 border-amber-500/30 rounded-full animate-pulse"></div>
          </div>
          <p className="text-amber-200 font-semibold text-xl tracking-wide">
            Loading Watch Details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !watch) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">⚠</div>
          <h3 className="text-xl text-amber-200 font-bold mb-4">
            Watch Not Found
          </h3>
          <p className="text-gray-400 mb-6">
            {error || "The watch you're looking for could not be found."}
          </p>
          <Link
            href="/#product"
            className="primary-btn inline-block text-center no-underline"
          >
            Browse Other Watches
          </Link>
        </div>
      </div>
    );
  }

  // Add safe guard for media access
  const watchMedia = watch.media || [];
  const currentMedia = watchMedia[currentMediaIndex];

  const nextMedia = () => {
    setCurrentMediaIndex((prev) =>
      prev === watchMedia.length - 1 ? 0 : prev + 1
    );
    setIsVideoPlaying(false);
  };

  const prevMedia = () => {
    setCurrentMediaIndex((prev) =>
      prev === 0 ? watchMedia.length - 1 : prev - 1
    );
    setIsVideoPlaying(false);
  };

  const selectMedia = (index: number) => {
    setCurrentMediaIndex(index);
    setIsVideoPlaying(false);
  };

  const toggleVideoPlay = () => {
    if (videoRef) {
      if (isVideoPlaying) {
        videoRef.pause();
        setIsVideoPlaying(false);
      } else {
        videoRef.play();
        setIsVideoPlaying(true);
      }
    }
  };

  const handleVideoEnded = () => {
    setIsVideoPlaying(false);
  };

  // Helper function to get equipment description
  const getEquipmentDescription = () => {
    if (watch.set_type) {
      const setTypes = [];
      if (watch.set_type.box) setTypes.push("Box");
      if (watch.set_type.papers) setTypes.push("Papers");
      if (watch.set_type.accessories) setTypes.push("Accessories");
      
      return setTypes.length > 0 ? setTypes.join(", ") : "Watch only";
    }
    return "Watch only";
  };

  return (
    <div className="bg-black text-white mx-auto pb-3">
      {/* Header */}
      <Header watches={allWatches} />
      
      {/* Back to Collection */}
      <div
        className="px-4 lg:px-6 py-4 w-full bg-[#141519]"
        style={{ marginTop: "140px" }}
      >
        <div className="max-w-[95%] lg:max-w-[90%] mx-auto">
          <Link
            href="/#product"
            className="text-white hover:text-white flex items-center gap-2 transition-colors text-sm"
          >
            ← {t("WatchDetailPage.btn-back")}
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-[60%_40%] grid-cols-1 gap-0 max-w-[95%] lg:max-w-[90%] mx-auto py-5">
        {/* Left Side - Media Gallery */}
        <div className="bg-black flex items-center justify-center relative h-full min-h-[400px] lg:min-h-[600px]">
          {/* Main Media Display */}
          <div className="relative mx-auto w-full max-w-[90%] lg:max-w-[70%]">
            {currentMedia && currentMedia.type === 'image' ? (
              <img
                style={{ aspectRatio: "1/1" }}
                src={currentMedia.url}
                alt={`${watch.brand} ${watch.ref}`}
                className="w-full h-auto object-cover rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder-watch.png";
                }}
              />
            ) : currentMedia && currentMedia.type === 'video' ? (
              <div className="relative" style={{ aspectRatio: "1/1" }}>
                <video
                  ref={setVideoRef}
                  className="w-full h-full object-cover rounded-lg"
                  poster={watchMedia.find(m => m.type === 'image')?.url}
                  onEnded={handleVideoEnded}
                  controls={false}
                  playsInline
                  muted
                  onError={(e) => {
                    console.error('Video error:', e);
                  }}
                >
                  <source src={currentMedia.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                
                {/* Video Play/Pause Overlay */}
                <div 
                  className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/20 hover:bg-black/30 transition-colors rounded-lg"
                  onClick={toggleVideoPlay}
                >
                  <div className="w-12 h-12 lg:w-16 lg:h-16 bg-black/70 rounded-full flex items-center justify-center hover:bg-black/80 transition-colors">
                    {isVideoPlaying ? (
                      <Pause className="w-6 h-6 lg:w-8 lg:h-8 text-white ml-0" />
                    ) : (
                      <Play className="w-6 h-6 lg:w-8 lg:h-8 text-white ml-1" />
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <img
                style={{ aspectRatio: "1/1" }}
                src="/placeholder-watch.png"
                alt="Watch placeholder"
                className="w-full h-auto object-cover rounded-lg"
              />
            )}

            {/* Navigation Arrows */}
            {watchMedia.length > 1 && (
              <>
                <button
                  onClick={prevMedia}
                  className="absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 w-8 h-8 lg:w-10 lg:h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
                </button>

                <button
                  onClick={nextMedia}
                  className="absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 w-8 h-8 lg:w-10 lg:h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {watchMedia.length > 1 && (
            <div className="absolute left-2 lg:left-6 top-1/2 -translate-y-1/2 flex flex-col space-y-2 lg:space-y-3">
              {watchMedia.map((media, index) => (
                <button
                  key={index}
                  onClick={() => selectMedia(index)}
                  className={`relative w-12 h-12 lg:w-16 lg:h-16 border-2 rounded overflow-hidden transition-all ${
                    index === currentMediaIndex
                      ? "border-[#B79B76]"
                      : "border-gray-600 hover:border-gray-400"
                  }`}
                >
                  {media.type === 'video' ? (
                    <>
                      <img
                        src={watchMedia.find(m => m.type === 'image')?.url || "/placeholder-watch.png"}
                        alt={`Video thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <Play className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
                      </div>
                    </>
                  ) : (
                    <img
                      src={media.url}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder-watch.png";
                      }}
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side - Details */}
        <div className="bg-black px-4 lg:px-8 py-6 lg:py-12 flex flex-col justify-center h-full">
          <div className="max-w-full lg:max-w-md">
            {/* Brand */}
            <h2 className="text-[#B79B76] text-base lg:text-lg font-medium tracking-wider mb-2 font-olds">
              {watch.brand}
            </h2>

            {/* Model */}
            <h1 className="text-white text-2xl lg:text-4xl font-bold mb-4 lg:mb-6">
              {watch.ref}
            </h1>

            {/* Price */}
            <div className="text-white text-xl lg:text-2xl mb-6 lg:mb-8 border-b pb-4 lg:pb-5 border-[#808080]">
              {watch.currency === "THB" ? "฿" : watch.currency === "USD" ? "$" : "€"}
              {watch.selling_price?.toLocaleString() || "Contact for price"}
            </div>

            {/* Details Section */}
            <div className="mb-6 lg:mb-8 border-b pb-4 lg:pb-5 border-[#808080]">
              <h3 className="text-white text-base lg:text-lg font-medium mb-3 lg:mb-4">Detail</h3>

              <div className="space-y-2 lg:space-y-3 text-xs lg:text-sm">
                <div className="flex justify-between">
                  <span className="text-[#BFBFBF] font-bold">Brand</span>
                  <span className="text-white">{watch.brand}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#BFBFBF] font-bold">Ref No.</span>
                  <span className="text-white">{watch.ref}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#BFBFBF] font-bold">Year</span>
                  <span className="text-white">{watch.watch_year || "N/A"}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#BFBFBF] font-bold">Type</span>
                  <span className="text-white">{watch.product_type || "N/A"}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#BFBFBF] font-bold">Equipment</span>
                  <span className="text-white">{getEquipmentDescription()}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#BFBFBF] font-bold">Status</span>
                  <span className="text-white">{watch.status}</span>
                </div>

                {watch.size_mm && (
                  <div className="flex justify-between">
                    <span className="text-[#BFBFBF] font-bold">Size</span>
                    <span className="text-white">{watch.size_mm}mm</span>
                  </div>
                )}

                {watch.material && (
                  <div className="flex justify-between">
                    <span className="text-[#BFBFBF] font-bold">Material</span>
                    <span className="text-white">{watch.material}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Remark */}
            {watch.notes && (
              <div className="mb-6 lg:mb-8">
                <h3 className="text-white text-base lg:text-lg font-medium mb-2 lg:mb-3">Remark</h3>
                <p className="text-gray-400 text-xs lg:text-sm leading-relaxed">
                  {watch.notes}
                </p>
              </div>
            )}

            {/* Get More Details Button */}
            <a href="https://line.me/R/ti/p/@939hmulm?ts=05061404&oat_content=url">
              <button className="w-full primary-btn text-black font-medium py-2 lg:py-3 px-4 lg:px-6 transition-colors text-sm lg:text-base">
                {t("WatchDetailPage.button")}
              </button>
            </a>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedWatches.length > 0 && (
        <div className="max-w-[95%] lg:max-w-[90%] mx-auto mt-8 lg:mt-12">
          <div className="text-left mb-8 lg:mb-12">
            <h1 className="text-3xl lg:text-5xl font-light text-[#B79B76] mb-4 font-olds">
              {t("WatchDetailPage.related-title")}
            </h1>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
            {relatedWatches.map((relatedWatch) => (
              <WatchCard key={relatedWatch.id} watch={relatedWatch} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WatchDetailPage;