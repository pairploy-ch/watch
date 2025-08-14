"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  Column,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DataTableToolbar } from "./data-table-toolbar"
import { Badge } from "@/components/ui/badge";
import { cn, formatSetType } from "@/lib/utils";
import { PublicToggle } from "./columns";
import { Button } from "@/components/ui/button";
import WatchFormDialog from "./watch-form-dialog";
import ImageViewerDialog from "./image-viewer-dialog";
import { deleteWatch } from "./actions";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  userRole?: 'admin' | 'marketing' | 'viewer' | null;
  suppliers?: import('@/lib/types').Supplier[];
}

// MediaCarousel component (desktop: square, overlay nav, modern look)
function MediaCarousel({ mediaItems, index, setIndex }: { mediaItems: string[], index: number, setIndex: (i: number) => void }) {
  const isVideo = (url: string) => /\.(mp4|mov|webm)$/i.test(url) || url.includes('video');
  const paginate = (newDirection: number) => {
    setIndex((index + newDirection + mediaItems.length) % mediaItems.length);
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
      {isVideo(mediaItems[index]) ? (
        <video 
          src={mediaItems[index]} 
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover rounded-lg" 
        />
      ) : (
        <Image 
          src={mediaItems[index]} 
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
                className={`h-1.5 w-1.5 rounded-full border border-white transition-colors ${i === index ? 'bg-amber-400' : 'bg-white/40'}`}
              ></div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}



export function DataTable<TData, TValue>({
  columns,
  data,
  userRole,
  suppliers
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
  });

  // สำหรับ mobile card: ใช้ข้อมูล filtered/sorted
  const filteredRows = table.getRowModel().rows.map(row => row.original as import('@/lib/types').Watch);

  // State สำหรับ media index ของแต่ละ watch
  const [mediaIndexes, setMediaIndexes] = React.useState<{ [id: string]: number }>({});
  const getMediaIndex = (id: number|string) => mediaIndexes[id] || 0;
  const setMediaIndex = (id: number|string, idx: number) => setMediaIndexes(prev => ({ ...prev, [id]: idx }));

  // Column customization UI
  const columnList = table.getAllLeafColumns() as Column<TData, unknown>[];

  // Column customization: Select All logic
  const allVisible = columnList.every(col => col.getIsVisible());
  const handleSelectAllColumns = () => {
    const newState = !allVisible;
    columnList.forEach(col => {
      if (col.getCanHide()) col.toggleVisibility(newState);
    });
  };

  return (
    <div className="rounded-lg border border-gray-800 bg-[#121212] overflow-hidden">
      {/* Toolbar: filter, column customization */}
      <div className="flex flex-wrap items-center gap-2 px-4 py-3 border-b border-gray-800 bg-[#181818]">
        <DataTableToolbar 
          table={table}
          columnList={columnList}
          allVisible={allVisible}
          handleSelectAllColumns={handleSelectAllColumns}
        />
      </div>

      {/* Mobile: Card/List (เหมือนเดิม) */}
      <div className="block sm:hidden p-2">
        {/* ... existing code ... */}
        {filteredRows.length === 0 ? (
          <div className="text-center text-gray-400 py-8">No results.</div>
        ) : (
          filteredRows.map((watch, idx) => {
            // ... existing code ...
            const statusStyles: { [key: string]: string } = {
              Available: "bg-green-800/50 border-green-600 text-green-300",
              Reserved: "bg-orange-800/50 border-orange-600 text-orange-300",
              Hidden: "bg-gray-700/50 border-gray-600 text-gray-400",
              Sold: "bg-red-800/50 border-red-600 text-red-300",
            };
            const style = statusStyles[watch.status] ?? "bg-secondary";
            const canEdit = userRole === 'admin' || userRole === 'marketing';
            const canDelete = userRole === 'admin';
            const mediaItems = Array.isArray(watch.media) ? [...watch.media].sort((a, b) => (a.position ?? 0) - (b.position ?? 0)) : [];
            const images = mediaItems.filter(m => m.type === 'image');
            const videos = mediaItems.filter(m => m.type === 'video');
            const allMedia = [...images.map(m => m.url), ...videos.map(m => m.url)];
            const mediaIndex = getMediaIndex(watch.id);
            const setIndex = (i: number) => setMediaIndex(watch.id, i);
            return (
              <div key={watch.id || idx} className="bg-gray-900 rounded-lg p-4 mb-3 border border-gray-800 shadow-sm flex flex-col items-center">
                {/* ... existing code ... */}
                <div className="w-full flex flex-col items-center">
                  <MediaCarousel mediaItems={allMedia} index={mediaIndex} setIndex={setIndex} />
                  <div className="mt-2 mb-2 text-center">
                    <div className="font-bold text-lg text-amber-300 truncate max-w-[180px]">{watch.brand}</div>
                    <div className="text-xs text-gray-400 truncate max-w-[180px]">{watch.ref}</div>
                    {watch.model && <div className="text-xs text-gray-400 truncate max-w-[180px]">{watch.model}</div>}
                  </div>

                </div>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-sm mb-2">
                  {/* ... existing code ... */}
                  <div>Type: <span className="font-medium">{watch.product_type || '-'}</span></div>
                  <div>Ownership: <Badge variant="outline" className={cn("py-1", watch.ownership_type === 'stock' ? "bg-blue-800/50 border-blue-600 text-blue-300" : "bg-purple-800/50 border-purple-600 text-purple-300")}>{watch.ownership_type === 'stock' ? 'Stock' : 'Commission'}</Badge></div>
                  <div>Set: <span className="font-medium">{formatSetType(watch.set_type)}</span></div>
                  <div>Price: <span className="font-medium">{typeof watch.selling_price === 'number' ? watch.selling_price.toLocaleString('th-TH', { style: 'currency', currency: 'THB' }) : '-'}</span></div>
                  <div>Status: <Badge variant="outline" className={cn("py-1", style)}>{watch.status}</Badge></div>
                  <div>Cost: <span className="font-medium">{typeof watch.cost_price === 'number' ? watch.cost_price.toLocaleString('th-TH', { style: 'currency', currency: 'THB' }) : '-'}</span></div>
                  <div>{watch.ownership_type === 'commission' ? 'Commission' : 'Profit'}: <span className={`font-medium ${watch.profit_status === 'commission' ? 'text-purple-400' : watch.profit_status === 'positive' ? 'text-green-400' : watch.profit_status === 'negative' ? 'text-red-400' : 'text-gray-400'}`}>{typeof watch.profit === 'number' ? watch.profit.toLocaleString('th-TH', { style: 'currency', currency: 'THB' }) : '-'}</span></div>
                  <div>{watch.ownership_type === 'commission' ? 'Commission Rate' : 'Margin'}: <span className={`font-medium ${watch.profit_status === 'commission' ? 'text-purple-400' : watch.profit_status === 'positive' ? 'text-cyan-400' : watch.profit_status === 'negative' ? 'text-red-400' : 'text-gray-400'}`}>{typeof watch.margin_percent === 'number' ? `${watch.margin_percent.toFixed(2)}%` : '-'}</span></div>
                  <div className="flex items-center gap-1">Public: <PublicToggle watch={watch} userRole={userRole ?? null} /></div>
                  <div>Year: <span className="font-medium">{watch.watch_year || '-'}</span></div>
                  <div>Material: <span className="font-medium">{watch.material || '-'}</span></div>
                  <div>Supplier: <span className="font-medium">{watch.supplier_id || '-'}</span></div>
                  <div>View: <span className="font-medium">{watch.view_count}</span></div>
                </div>
                {watch.notes && <div className="text-xs text-gray-400 mt-2">Notes: {watch.notes}</div>}
                {/* Actions */}
                <div className="flex gap-2 mt-2">
                  {canEdit && suppliers && (
                    <WatchFormDialog 
                      suppliers={suppliers} 
                      watch={watch} 
                      userRole={userRole ?? null} 
                      trigger={<span className="inline-block px-3 py-1 rounded border border-gray-600 bg-gray-800 text-xs text-white hover:bg-gray-700 transition cursor-pointer">Edit</span>} 
                    />
                  )}
                  <ImageViewerDialog mediaUrls={allMedia} watchRef={watch.ref}>
                    <Button size="sm" variant="outline">View Media</Button>
                  </ImageViewerDialog>
                  {canDelete && (
                    <Button size="sm" variant="destructive" onClick={async () => {
                      if (confirm("Are you sure?")) {
                        const result = await deleteWatch(watch.id);
                        if (result.success) toast.success("Watch deleted.");
                        else toast.error("Deletion failed", { description: result.error });
                      }
                    }}>Delete</Button>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Desktop: Table */}
      <div className="hidden sm:block w-full overflow-x-auto">
        <Table className="min-w-[1200px] w-full table-fixed text-sm">
          <TableHeader>
            <TableRow className="border-gray-800 hover:bg-gray-800/50">
              {table.getHeaderGroups()[0].headers.map((header) => (
                <TableHead
                  key={header.id}
                  className={(header.column.columnDef as { meta?: { className?: string } }).meta?.className || "px-2 py-2 align-middle"}
                >
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => {
                const watch = row.original as import('@/lib/types').Watch;
                const mediaItems = Array.isArray(watch.media) ? [...watch.media].sort((a, b) => (a.position ?? 0) - (b.position ?? 0)) : [];
                const images = mediaItems.filter(m => m.type === 'image');
                const videos = mediaItems.filter(m => m.type === 'video');
                const allMedia = [...images.map(m => m.url), ...videos.map(m => m.url)];
                const mediaIndex = getMediaIndex(watch.id);
                const setIndex = (i: number) => setMediaIndex(watch.id, i);
                return (
                  <TableRow
                    key={row.id}
                    className={cn("border-gray-800 group hover:bg-gray-800/60 transition rounded-lg")}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={(cell.column.columnDef as { meta?: { className?: string } }).meta?.className || "px-2 py-3 text-sm align-middle min-h-[96px]"}
                      >
                        {/* ปรับ cell ให้รองรับ UX ใหม่ */}
                        {cell.column.id === 'image' ? (
                          <div className="flex items-center gap-3 min-w-[100px] max-w-[100px]">
                            <MediaCarousel mediaItems={allMedia} index={mediaIndex} setIndex={setIndex} />
                          </div>
                        ) : cell.column.id === 'brand_ref' ? (
                          <div className="flex flex-col min-w-[140px] max-w-[160px] pl-2 leading-tight">
                            <span className="font-semibold text-amber-300 text-base truncate" title={watch.brand}>{watch.brand}</span>
                            <span className="text-xs text-gray-400 truncate" title={watch.ref}>{watch.ref}</span>
                          </div>
                        ) : cell.column.id === 'profit_margin' ? (
                          <div className="flex flex-col items-end min-w-[120px] w-[120px] pr-2">
                            <span className={`font-medium ${watch.ownership_type === 'commission' ? 'text-purple-400' : watch.profit && watch.profit > 0 ? 'text-green-400' : watch.profit && watch.profit < 0 ? 'text-red-400' : 'text-gray-300'}`}>{(watch.profit ?? 0).toLocaleString()}฿</span>
                            <span className={`text-xs ${watch.ownership_type === 'commission' ? 'text-purple-300' : watch.profit && watch.profit > 0 ? 'text-cyan-400' : watch.profit && watch.profit < 0 ? 'text-red-400' : 'text-gray-400'}`}>{(watch.margin_percent ?? 0).toFixed(2)}%</span>
                          </div>
                        ) : cell.column.id === 'product_type' ? (
                          <span className="inline-block bg-gray-800/60 rounded px-2 py-0.5 text-xs text-gray-200 min-w-[70px] w-[70px] text-center">
                            {watch.product_type || "-"}
                          </span>
                        ) : cell.column.id === 'ownership_type' ? (
                          <span className={`inline-block rounded px-2 py-0.5 text-xs font-semibold min-w-[90px] w-[90px] text-center ${
                            watch.ownership_type === "stock"
                              ? "bg-blue-900/60 text-blue-300 border border-blue-700"
                              : "bg-purple-900/60 text-purple-300 border border-purple-700"
                          }`}>
                            {watch.ownership_type === "stock" ? "Stock" : "Commission"}
                          </span>
                        ) : cell.column.id === 'set_type' ? (
                          <span className="truncate block min-w-[120px] w-[120px] pl-2" title={formatSetType(watch.set_type)}>
                            {formatSetType(watch.set_type)}
                          </span>
                        ) : cell.column.id === 'selling_price' ? (
                          <div className="text-right font-medium pr-2 min-w-[110px] w-[110px]">{typeof watch.selling_price === 'number' ? watch.selling_price.toLocaleString('th-TH', { style: 'currency', currency: 'THB' }) : '-'}</div>
                        ) : (
                          flexRender(cell.column.columnDef.cell, cell.getContext())
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
