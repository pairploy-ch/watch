'use client'

import React from "react"
import { ColumnDef, FilterFn } from "@tanstack/react-table"
import { Watch, Supplier } from "@/lib/types"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ArrowUpDown, MoreHorizontal, Image as ImageIcon, Search, ChevronLeft, ChevronRight, Pencil, Trash2, Package, FileText, Award, CreditCard, Briefcase, Link } from "lucide-react"
import { Button } from "@/components/ui/button"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import WatchFormDialog from "./watch-form-dialog"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ImageViewerDialog from "./image-viewer-dialog"
import { deleteWatch, toggleWatchPublicStatus } from "./actions"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { cn, formatSetType, getSetTypeItems } from "@/lib/utils"
import Image from "next/image"
import { formatCurrency } from "@/lib/utils"

interface GetColumnsProps {
  userRole: 'admin' | 'marketing' | 'viewer' | null;
  suppliers: Supplier[];
  onEdit?: (watch: Watch) => void;
  onViewMedia?: (watch: Watch) => void;
}

export const PublicToggle = ({ watch, userRole }: { watch: Watch, userRole: GetColumnsProps['userRole'] }) => {
  const [isPublic, setIsPublic] = React.useState(watch.is_public);
  const canToggle = (userRole === 'admin' || userRole === 'marketing') && watch.status !== 'Sold';

  const handleToggle = async (checked: boolean) => {
    setIsPublic(checked);
    const result = await toggleWatchPublicStatus(watch.id, checked);
    if (result.success) {
      toast.success(`'${watch.ref}' is now ${checked ? 'public' : 'hidden'}.`);
    } else {
      toast.error("Update failed", { description: result.error });
      setIsPublic(!checked);
    }
  };

  return <Switch checked={isPublic} onCheckedChange={handleToggle} disabled={!canToggle} />;
}

const priceInRange: FilterFn<Watch> = (row, columnId, value) => {
  const [min, max] = value as [number | undefined, number | undefined];
  const price = row.original.selling_price;
  if (price === null || typeof price === 'undefined') return false;
  const meetsMin = typeof min === 'undefined' || price >= min;
  const meetsMax = typeof max === 'undefined' || price <= max;
  return meetsMin && meetsMax;
};

// Add custom filter function for brand_ref
const brandRefFilter: FilterFn<Watch> = (row, columnId, value) => {
  const searchValue = value.toLowerCase();
  const brand = row.original.brand?.toLowerCase() || '';
  const ref = row.original.ref?.toLowerCase() || '';
  return brand.includes(searchValue) || ref.includes(searchValue);
};

function MediaCarousel({ mediaItems, index, setIndex }: { mediaItems: string[], index: number, setIndex: (i: number) => void }) {
  const isVideo = (url: string) => /\.(mp4|mov|webm)$/i.test(url) || url.includes('video');
  const [activeIndex, setActiveIndex] = React.useState(index ?? 0);
  React.useEffect(() => { setActiveIndex(index ?? 0); }, [index]);
  const paginate = (newDirection: number) => {
    setActiveIndex((activeIndex + newDirection + mediaItems.length) % mediaItems.length);
    setIndex((activeIndex + newDirection + mediaItems.length) % mediaItems.length);
  };
  const handleNext = (e?: React.MouseEvent) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    paginate(1);
  };
  const handlePrev = (e?: React.MouseEvent) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    paginate(-1);
  };
  if (mediaItems.length === 0) {
    return (
      <div className="w-32 h-24 bg-gray-800 rounded-lg flex items-center justify-center">
        <span className="text-gray-500 text-xs">No Media</span>
      </div>
    );
  }
  return (
    <div className="relative w-32 h-24 rounded-lg overflow-hidden group">
      {isVideo(mediaItems[activeIndex]) ? (
        <video 
          src={mediaItems[activeIndex]} 
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover rounded-lg" 
        />
      ) : (
        <Image 
          src={mediaItems[activeIndex]} 
          alt="media" 
          fill
          sizes="128px"
          className="object-cover rounded-lg"
          quality={85}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
      )}
      {mediaItems.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-1 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-black/60 text-white opacity-80 hover:opacity-100 transition-opacity z-10 flex items-center justify-center shadow"
            aria-label="Previous image"
            tabIndex={-1}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-black/60 text-white opacity-80 hover:opacity-100 transition-opacity z-10 flex items-center justify-center shadow"
            aria-label="Next image"
            tabIndex={-1}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex space-x-1 z-10">
            {mediaItems.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 w-1.5 rounded-full border border-white transition-colors ${i === activeIndex ? 'bg-amber-400' : 'bg-white/40'}`}
              ></div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export const getColumns = ({ userRole, suppliers, onEdit, onViewMedia }: GetColumnsProps): ColumnDef<Watch>[] => {
  const baseColumns: ColumnDef<Watch>[] = [
    {
      id: "media_brand",
      header: "Media / Brand",
      cell: ({ row }) => {
        const watch = row.original;
        const mediaItems = Array.isArray(watch.media) ? [...watch.media].sort((a, b) => (a.position ?? 0) - (b.position ?? 0)) : [];
        const images = mediaItems.filter(m => m.type === 'image');
        const videos = mediaItems.filter(m => m.type === 'video');
        const allMedia = [...images.map(m => m.url), ...videos.map(m => m.url)];
        return (
          <div className="flex flex-col items-center min-w-[180px] max-w-[220px] pr-4 mr-2 text-center">
            <MediaCarousel mediaItems={allMedia} index={0} setIndex={() => {}} />
            <div className="mt-3 mb-1 w-32 flex flex-col items-center text-center">
              <span className="font-semibold text-amber-300 text-base truncate" title={watch.brand}>{watch.brand}</span>
              <span className="text-xs text-gray-400 truncate mt-1" title={watch.ref}>{watch.ref}</span>
            </div>
          </div>
        );
      },
      enableColumnFilter: true,
      filterFn: brandRefFilter,
      meta: { className: "px-4 py-2 align-middle text-center" },
    },
    {
      accessorKey: "ownership_type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.original.ownership_type;
        const badgeClass = type === 'stock' 
          ? "bg-blue-800/50 border-blue-600 text-blue-300"
          : "bg-purple-800/50 border-purple-600 text-purple-300";
        return (
          <div className="flex flex-row items-center gap-x-4 justify-center text-center w-full">
            <Badge variant="outline" className={cn("py-1 text-xs px-3 min-w-[60px] text-center", badgeClass)}>
              {type === 'stock' ? 'Stock' : 'Comm'}
            </Badge>
          </div>
        );
      },
      meta: { className: "min-w-[100px] w-[110px] text-center px-5" },
    },
    {
      accessorKey: "product_type",
      header: "Condition",
      cell: ({ row }) => (
        <div className="flex flex-row items-center gap-x-4 justify-center text-center w-full">
          <span className="inline-block bg-gray-800/60 rounded px-3 py-1 text-xs text-gray-200 min-w-[60px] w-[70px] text-center">
            {row.original.product_type || "-"}
          </span>
        </div>
      ),
      meta: { className: "min-w-[100px] w-[110px] text-center px-5" },
    },
    // Hidden column for set_type filtering
    {
      accessorKey: "set_type",
      header: "Set Type",
      enableHiding: true,
      meta: { className: "hidden" },
    },
    // Hidden column for selling_price filtering
    {
      accessorKey: "selling_price",
      header: "Selling Price",
      enableHiding: true,
      enableColumnFilter: true,
      filterFn: priceInRange,
      meta: { className: "hidden" },
    },
    // ราคา (Price) - ปรับปรุงให้ชัดเจน
    {
      id: "price_display",
      accessorFn: (row) => row.selling_price,
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold text-amber-200 hover:text-amber-300 hover:bg-transparent"
          >
            ราคา
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const price = row.original.selling_price;
        const cost = row.original.cost_price;
        return (
          <div className="flex flex-col items-center min-w-[130px] space-y-1 text-center">
            <div className="flex items-center gap-2 justify-center">
              <span className="text-xs text-gray-400 font-medium">ขาย:</span>
              <span className="text-base font-bold text-emerald-400">{price ? formatCurrency(price) : '-'}</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <span className="text-xs text-gray-400 font-medium">ต้นทุน:</span>
              <span className="text-sm text-gray-300">{cost ? formatCurrency(cost) : '-'}</span>
            </div>
          </div>
        );
      },
      enableSorting: true,
      meta: { className: "min-w-[130px] px-2 text-center" },
    },
    // กำไร (Profit) - ปรับปรุงให้ชัดเจน
    {
      accessorKey: "profit",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold text-amber-200 hover:text-amber-300 hover:bg-transparent"
          >
            กำไร/มาร์จิ้น
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const profit = row.original.profit ?? 0;
        const margin = row.original.margin_percent ?? 0;
        const type = row.original.ownership_type;
        const profitStatus = row.original.profit_status;
        
        let profitColor = 'text-gray-400';
        if (profitStatus === 'commission') {
          profitColor = 'text-purple-400';
        } else if (profitStatus === 'positive') {
          profitColor = 'text-green-400';
        } else if (profitStatus === 'negative') {
          profitColor = 'text-red-400';
        }
        
        const label = type === 'commission' ? 'ค่าคอม' : 'กำไร';
        
        return (
          <div className="flex flex-col items-center space-y-1 min-w-[110px] text-center">
            <div className="flex items-center gap-2 justify-center">
              <span className="text-xs text-gray-400 font-medium">{label}:</span>
              <span className={`font-bold text-sm ${profitColor}`}>{formatCurrency(profit)}</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <span className="text-xs text-gray-400 font-medium">มาร์จิ้น:</span>
              <span className="text-xs text-gray-300 font-medium">{margin.toFixed(1)}%</span>
            </div>
          </div>
        );
      },
      enableSorting: true,
      meta: { className: "min-w-[110px] px-3 text-center" },
    },
    // อุปกรณ์ (Set/Accessories) - ปรับปรุงให้ชัดเจน
    {
      id: "accessories",
      header: "อุปกรณ์",
      cell: ({ row }) => {
        const setType = row.original.set_type;
        const items = getSetTypeItems(setType);
        
        // ใช้ไอคอนและข้อความที่ชัดเจน
        const iconMap: Record<string, { icon: React.ReactNode; label: string }> = {
          box: { icon: <Package className="w-4 h-4" />, label: "กล่อง" },
          card: { icon: <CreditCard className="w-4 h-4" />, label: "การ์ด" },
          manual: { icon: <FileText className="w-4 h-4" />, label: "คู่มือ" },
          warranty: { icon: <Award className="w-4 h-4" />, label: "ประกัน" },
          papers: { icon: <FileText className="w-4 h-4" />, label: "เอกสาร" },
          extra_links: { icon: <Link className="w-4 h-4" />, label: "สายพิเศษ" },
          travel_case: { icon: <Briefcase className="w-4 h-4" />, label: "กระเป๋า" },
        };
        
        return (
          <div className="flex flex-col gap-1 min-w-[100px]">
            {items.length === 0 ? (
              <span className="text-xs text-gray-500 text-center py-2">-</span>
            ) : (
              items.map((item) => {
                const itemData = iconMap[item];
                return (
                  <div key={item} className="flex items-center gap-2 px-2 py-1 bg-gray-800/30 rounded text-xs">
                    <span className="text-gray-400">
                      {itemData?.icon || <Package className="w-3 h-3" />}
                    </span>
                    <span className="text-gray-300 font-medium">
                      {itemData?.label || item}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        );
      },
      meta: { className: "min-w-[100px] px-2" },
    },
    // สถานะ (Status)
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        if (!status) return null;
        const statusStyles: { [key: string]: string } = {
          Available: "bg-green-800/50 border-green-600 text-green-300",
          Reserved: "bg-orange-800/50 border-orange-600 text-orange-300",
          Hidden: "bg-gray-700/50 border-gray-600 text-gray-400",
          Sold: "bg-red-800/50 border-red-600 text-red-300",
        };
        const style = statusStyles[status] ?? "bg-secondary";
        return <Badge variant="outline" className={cn("py-1 text-xs px-2 ml-2", style)}>{status}</Badge>;
      },
      meta: { className: "min-w-[90px] w-[90px] text-center px-3" },
    },
    {
      accessorKey: "is_public",
      header: "Public",
      cell: ({ row }) => <PublicToggle watch={row.original} userRole={userRole} />,
      meta: { className: "min-w-[80px] w-[80px] text-center px-3" },
    },
    {
      id: "actions",
      header: () => <div className="text-center">Actions</div>,
      cell: ({ row }) => {
        const watch = row.original;
        const canEdit = userRole === 'admin' || userRole === 'marketing';
        const canDelete = userRole === 'admin';

        if (userRole === 'viewer') {
          return <div className="text-center">-</div>;
        }

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="mx-auto">
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {canEdit && suppliers && (
                <DropdownMenuItem onClick={() => onEdit?.(watch)}>
                  <span className="flex items-center gap-2 cursor-pointer">
                    <Pencil className="w-4 h-4 mr-1" />
                    Edit
                  </span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => onViewMedia?.(watch)}>
                <span className="flex items-center gap-2 cursor-pointer">
                  <ImageIcon className="w-4 h-4 mr-1" />
                  View Media
                </span>
              </DropdownMenuItem>
              {canDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={async () => {
                      if (confirm("Are you sure?")) {
                        const result = await deleteWatch(watch.id);
                        if (result.success) toast.success("Watch deleted.");
                        else toast.error("Deletion failed", { description: result.error });
                      }
                    }}
                    className="text-red-500 focus:bg-red-100"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      enableSorting: false,
      meta: { className: "min-w-[90px] w-[90px] text-center px-3" },
    },
  ];
  return baseColumns;
};