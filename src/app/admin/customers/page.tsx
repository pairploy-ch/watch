import { createClient } from "@/lib/supabase/server";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import CustomerFormDialog from "./customer-form-dialog";
import { Plus } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getCustomers() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('customers').select('*').order('created_at', { ascending: false });
  if (error) return [];
  return data || [];
}

export default async function CustomersPage() {
  const customers = await getCustomers();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Customer Management</h2>
          <p className="text-gray-400 mt-1">Manage your customer database and purchase history</p>
        </div>
        <CustomerFormDialog trigger={
          <div className="flex items-center gap-2 bg-gradient-to-r from-[#E6C36A] to-[#D4AF37] hover:from-[#D4AF37] hover:to-[#E6C36A] text-black font-bold px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
            <Plus className="w-4 h-4" />
            Add Customer
          </div>
        } />
      </div>

      {/* Customer Data Table */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-700 shadow-lg overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#E6C36A] to-transparent opacity-60"></div>
        <DataTable columns={columns} data={customers} />
      </div>
    </div>
  );
}