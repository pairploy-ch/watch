'use client'

import { Table, Column } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X as ResetIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Settings } from "lucide-react"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  columnList: Column<TData, unknown>[]
  allVisible: boolean
  handleSelectAllColumns: () => void
}

export function DataTableToolbar<TData>({ table, columnList, allVisible, handleSelectAllColumns }: DataTableToolbarProps<TData>) {

  const handlePriceFilterChange = (e: React.ChangeEvent<HTMLInputElement>, boundary: 'min' | 'max') => {
    const value = e.target.value;
    const priceColumn = table.getColumn("selling_price");
    const currentFilter = priceColumn?.getFilterValue() as [number, number] | [undefined, undefined] || [undefined, undefined];
    
    if (boundary === 'min') {
        priceColumn?.setFilterValue([value ? Number(value) : undefined, currentFilter[1]]);
    } else {
        priceColumn?.setFilterValue([currentFilter[0], value ? Number(value) : undefined]);
    }
  };

  const productTypes = ['New', 'Used', 'Vintage', 'NOS'];
  const setTypes = ['Full Set', 'Watch only'];

  return (
    <div className="w-full flex flex-row flex-wrap items-center gap-2">
      <Input
        placeholder="Filter brand or ref..."
        value={(table.getColumn("media_brand")?.getFilterValue() as string) ?? ""}
        onChange={(event) => {
          table.getColumn("media_brand")?.setFilterValue(event.target.value)
        }}
        className="h-9 bg-gray-800 border-gray-700 w-full sm:w-auto sm:flex-grow"
      />
      
      <Select
          value={(table.getColumn("product_type")?.getFilterValue() as string) ?? ""}
          onValueChange={(value) =>
              table.getColumn("product_type")?.setFilterValue(value === "all" ? "" : value)
          }
      >
          <SelectTrigger className="h-9 bg-gray-800 border-gray-700 w-full sm:w-[180px]">
              <SelectValue placeholder="All Product Types" />
          </SelectTrigger>
          <SelectContent>
              <SelectItem value="all">All Product Types</SelectItem>
              {productTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
          </SelectContent>
      </Select>

      {/* Set Type Filter */}
      <Select
          value={(table.getColumn("set_type")?.getFilterValue() as string) ?? ""}
          onValueChange={(value) =>
              table.getColumn("set_type")?.setFilterValue(value === "all" ? "" : value)
          }
      >
          <SelectTrigger className="h-9 bg-gray-800 border-gray-700 w-full sm:w-[160px]">
              <SelectValue placeholder="All Sets" />
          </SelectTrigger>
          <SelectContent>
              <SelectItem value="all">All Sets</SelectItem>
              {setTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
          </SelectContent>
      </Select>

      {/* Price Range Group */}
      <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-900/50 border border-gray-800">
          <Input
              type="number"
              placeholder="Min price"
              value={(table.getColumn("selling_price")?.getFilterValue() as [number, number])?.[0] ?? ""}
              onChange={(e) => handlePriceFilterChange(e, 'min')}
              className="h-7 bg-gray-800 border-gray-700"
          />
          <span className="text-gray-500">-</span>
          <Input
              type="number"
              placeholder="Max price"
              value={(table.getColumn("selling_price")?.getFilterValue() as [number, number])?.[1] ?? ""}
              onChange={(e) => handlePriceFilterChange(e, 'max')}
              className="h-7 bg-gray-800 border-gray-700"
          />
      </div>

      {/* Reset Filters Button */}
      <Button
        variant="ghost"
        onClick={() => table.resetColumnFilters()}
        className={cn(
          "h-9 px-4 w-full md:w-auto transition-opacity",
          table.getState().columnFilters.length > 0 ? "opacity-100" : "opacity-50 pointer-events-none"
        )}
      >
        Reset Filters
        <ResetIcon className="ml-2 h-4 w-4" />
      </Button>

      {/* Column customization */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="outline" className="gap-1"><Settings className="w-4 h-4" />เลือกคอลัมน์</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>แสดง/ซ่อนคอลัมน์</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <label className="flex items-center gap-2 cursor-pointer font-semibold">
              <input
                type="checkbox"
                checked={allVisible}
                onChange={handleSelectAllColumns}
                className="accent-amber-400"
              />
              เลือกทั้งหมด
            </label>
          </DropdownMenuItem>
          {columnList.map(col => (
            <DropdownMenuItem key={col.id} asChild>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={col.getIsVisible()}
                  onChange={() => col.toggleVisibility()}
                  className="accent-amber-400"
                />
                {typeof col.columnDef.header === 'string' ? col.columnDef.header : col.id}
              </label>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}