'use client'

import { Table } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X as ResetIcon } from "lucide-react"

interface CustomerDataTableToolbarProps<TData> {
  table: Table<TData>
}

export function CustomerDataTableToolbar<TData>({ table }: CustomerDataTableToolbarProps<TData>) {
  const isFiltered = (table.getColumn("full_name")?.getFilterValue() as string)?.length > 0

  return (
    <div className="flex items-center justify-between p-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-t-xl border-b border-gray-800 relative">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#E6C36A] to-transparent opacity-60"></div>
      
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter by customer name..."
          value={(table.getColumn("full_name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("full_name")?.setFilterValue(event.target.value)
          }
          className="h-9 w-full md:w-[350px] lg:w-[400px] bg-gray-800 border border-gray-700 focus:border-[#E6C36A] text-white placeholder-gray-400 rounded-lg"
        />
      </div>
      {isFiltered && (
        <Button
          variant="ghost"
          onClick={() => table.getColumn("full_name")?.setFilterValue("")}
          className="h-9 px-2 lg:px-3 text-gray-300 hover:text-[#E6C36A]"
        >
          Reset
          <ResetIcon className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  )
}