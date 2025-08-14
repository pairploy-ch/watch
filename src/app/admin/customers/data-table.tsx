"use client"

import * as React from "react"
import { ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, getFilteredRowModel, useReactTable, SortingState, ColumnFiltersState } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CustomerDataTableToolbar } from "./customer-data-table-toolbar"
import Link from 'next/link';
import CustomerFormDialog from './customer-form-dialog';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting, columnFilters },
  })

  // Mobile card view
  const filteredRows = table.getRowModel().rows.map(row => row.original as import('@/lib/types').Customer);

  return (
    <div className="space-y-4">
      <CustomerDataTableToolbar table={table} />
      
      {/* Mobile: Enhanced Card/List */}
      <div className="block lg:hidden">
        {filteredRows.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <div className="text-4xl mb-4">👥</div>
            <div className="text-lg font-medium">No customers found</div>
            <div className="text-sm text-gray-500 mt-2">Try adjusting your search filters</div>
          </div>
        ) : (
          <div className="space-y-3 px-1">
            {filteredRows.map((customer, idx) => (
              <div key={customer.id || idx} className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl border border-gray-700/50 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:border-[#E6C36A]/30">
                
                {/* Header Section */}
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-3 border-b border-gray-700/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E6C36A] to-[#B8860B] flex items-center justify-center">
                        <span className="text-black font-bold text-lg">
                          {customer.full_name?.charAt(0)?.toUpperCase() || '?'}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-bold text-[#E6C36A] text-lg leading-tight">{customer.full_name}</h3>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Added: {new Date(customer.created_at).toLocaleDateString('th-TH')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-4 space-y-3">
                  
                  {/* Contact Info Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/30">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="w-4 h-4 bg-[#C0C0C0] rounded-full flex items-center justify-center">
                          <span className="text-xs text-black">📞</span>
                        </div>
                        <span className="text-xs text-gray-400 font-medium">Phone</span>
                      </div>
                      <p className="text-sm text-white font-medium truncate">
                        {customer.phone || 'Not provided'}
                      </p>
                    </div>
                    
                    <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/30">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="w-4 h-4 bg-[#C0C0C0] rounded-full flex items-center justify-center">
                          <span className="text-xs text-black">💬</span>
                        </div>
                        <span className="text-xs text-gray-400 font-medium">LINE / WhatsApp</span>
                      </div>
                      <p className="text-sm text-white font-medium truncate">
                        {customer.social_contact || 'Not provided'}
                      </p>
                    </div>
                  </div>

                  {/* Address Section */}
                  {customer.address && (
                    <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/30">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-4 h-4 bg-[#C0C0C0] rounded-full flex items-center justify-center">
                          <span className="text-xs text-black">📍</span>
                        </div>
                        <span className="text-xs text-gray-400 font-medium">Address</span>
                      </div>
                      <p className="text-sm text-white leading-relaxed">
                        {customer.address.length > 80 
                          ? `${customer.address.slice(0, 80)}...` 
                          : customer.address
                        }
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-3 pt-2">
                    <Link 
                      href={`/admin/customers/details/${customer.id}`} 
                      className="flex-1 bg-gradient-to-r from-[#E6C36A] to-[#B8860B] hover:from-[#B8860B] hover:to-[#E6C36A] text-black font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 text-center text-sm shadow-lg hover:shadow-xl"
                    >
                      View Details
                    </Link>
                    <CustomerFormDialog 
                      customer={customer} 
                      trigger={
                        <button className="flex-1 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 text-sm border border-gray-600 hover:border-gray-500 shadow-lg">
                          Edit
                        </button>
                      } 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Desktop: Enhanced Table */}
      <div className="hidden lg:block">
        <div className="rounded-2xl border border-gray-700/50 bg-gradient-to-br from-gray-900 via-gray-800 to-black shadow-2xl overflow-hidden">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700/50 hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-800">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className={
                        header.column.id === 'actions'
                          ? 'text-[#E6C36A] font-bold text-sm px-6 py-4 text-center'
                          : 'text-[#E6C36A] font-bold text-sm px-6 py-4'
                      }
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, index) => (
                  <TableRow 
                    key={row.id} 
                    className={`border-b border-gray-700/30 hover:bg-gradient-to-r hover:from-gray-800/50 hover:to-gray-700/50 transition-all duration-200 group ${
                      index % 2 === 0 ? 'bg-gray-900/30' : 'bg-gray-800/30'
                    }`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={
                          cell.column.id === 'full_name'
                            ? 'py-4 px-6 font-bold text-[#E6C36A] text-base'
                            : cell.column.id === 'actions'
                              ? 'py-4 px-6 text-center'
                              : 'py-4 px-6 text-white text-sm'
                        }
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-32 text-center">
                    <div className="text-gray-400 py-8">
                      <div className="text-4xl mb-4">👥</div>
                      <div className="text-lg font-medium">No customers found</div>
                      <div className="text-sm text-gray-500 mt-2">Try adjusting your search filters</div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}