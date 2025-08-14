'use client'

import { ColumnDef } from "@tanstack/react-table"
import { Customer } from "@/lib/types"
import { Button } from "@/components/ui/button"
import CustomerFormDialog from "./customer-form-dialog"
import Link from "next/link"

export const columns: ColumnDef<Customer>[] = [
  { 
    accessorKey: "full_name", 
    header: "Full Name",
    cell: ({ row }) => (
      <Link
        href={`/admin/customers/details/${row.original.id}`}
        className="text-amber-400 font-semibold hover:underline cursor-pointer"
      >
        {row.original.full_name}
      </Link>
    )
  },
  { accessorKey: "phone", header: "Phone" },
  { accessorKey: "social_contact", header: "LINE / WhatsApp" },
  { 
    accessorKey: "created_at", 
    header: "Date Added",
    cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString('th-TH'),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const customer = row.original;
      return (
        <div className="flex gap-2 justify-center">
          <Link href={`/admin/customers/details/${customer.id}`}>
            <Button size="sm" variant="outline" className="border-[#E6C36A] text-[#E6C36A] hover:bg-[#E6C36A]/10 hover:border-[#E6C36A] transition-all">View</Button>
          </Link>
          <CustomerFormDialog customer={customer} trigger={
            <span className="inline-flex items-center gap-1 border border-gray-700 text-gray-200 rounded px-3 py-1 text-xs font-semibold hover:bg-gray-800 hover:text-[#E6C36A] transition cursor-pointer">
              Edit
            </span>
          } />
        </div>
      );
    }
  },
];