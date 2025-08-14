import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Customer, Invoice, Watch } from "@/lib/types";
import AddPurchaseDialog from "./add-purchase-dialog";
import ReceiptGeneratorButton from "./ReceiptGeneratorButton";
import EditNoteDialog from "./EditNoteDialog";

export const dynamic = 'force-dynamic';

async function getCustomerData(id: string) {
  const supabase = await createClient();
  const customerId = parseInt(id, 10);
  if (isNaN(customerId)) {
    // console.error(`Invalid customerId: ${id}`); // Removed for production
    return null;
  }

  const customerReq = supabase.from('customers').select('*').eq('id', customerId).single();
  const invoicesReq = supabase.from('invoices').select('*, watches(*)').eq('customer_id', customerId).order('sale_date', { ascending: false });
  const watchesReq = supabase.from('watches').select('id, ref, brand').neq('status', 'Sold').order('brand');

  try {
    const [{ data: customer, error: customerError }, { data: invoices }, { data: watches }] = await Promise.all([customerReq, invoicesReq, watchesReq]);
    
    if (customerError || !customer) {
      // console.error(`Customer not found: ${customerError?.message}`); // Removed for production
      return null;
    }
    // if (invoicesError) {
    //   console.error(`Error fetching invoices: ${invoicesError.message}`);
    // }
    // if (watchesError) {
    //   console.error(`Error fetching watches: ${watchesError.message}`);
    // }

    return { 
      customer: customer ?? null,
      invoices: Array.isArray(invoices) ? invoices : [],
      allWatches: Array.isArray(watches) ? watches : []
    };
  } catch {
    // console.error(`Error in getCustomerData: ${error instanceof Error ? error.message : 'Unknown error'}`); // Removed for production
    return null;
  }
}

function isInvoiceWithWatch(obj: unknown): obj is Invoice & { watches: Partial<Watch> } {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    'id' in obj &&
    'sale_date' in obj &&
    'watches' in obj &&
    typeof (obj as { id: unknown }).id === 'number'
  );
}

function isPartialWatch(obj: unknown): obj is Partial<Watch> {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    'id' in obj &&
    'brand' in obj &&
    'ref' in obj
  );
}

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getCustomerData(id);
  if (!data) notFound();

  const { customer, invoices, allWatches } = data;

  if (!customer || typeof customer !== 'object' || !('full_name' in customer) || !('id' in customer)) {
    notFound();
  }

  const customerData = customer as Customer;

  const filteredInvoices = Array.isArray(invoices)
    ? (invoices.filter(isInvoiceWithWatch) as unknown as (Invoice & { watches: Partial<Watch> })[])
    : [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">{customerData.full_name}</h1>
          <p className="text-gray-400 mt-1">Customer ID: {customerData.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Contact Info Card */}
        <div className="md:col-span-1">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl border border-gray-800 shadow-lg relative">
            {/* Gold accent line at the top */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#E6C36A] to-transparent opacity-60 rounded-t-xl"></div>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gray-800 rounded-lg border border-gray-700">
                <svg className="w-5 h-5 text-[#E6C36A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">Contact Info</h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Phone</p>
                <p className="text-gray-200 font-medium">{customerData.phone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">LINE/WhatsApp</p>
                <p className="text-gray-200 font-medium">{customerData.social_contact || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Address</p>
                <p className="text-gray-200 font-medium whitespace-pre-wrap">{customerData.address || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Purchase History Card */}
        <div className="md:col-span-2">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl border border-gray-800 shadow-lg relative">
            {/* Gold accent line at the top */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#E6C36A] to-transparent opacity-60 rounded-t-xl"></div>
            
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-800 rounded-lg border border-gray-700">
                  <svg className="w-5 h-5 text-[#E6C36A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">Purchase History</h3>
              </div>
              <AddPurchaseDialog customer={customerData} allWatches={Array.isArray(allWatches) ? (allWatches.filter(isPartialWatch) as Partial<Watch>[]) : []} />
            </div>
            
            <div className="rounded-xl border border-gray-800 bg-gray-800/50 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-900 border-b border-gray-800">
                    <TableHead className="text-gray-200 font-semibold text-sm px-4 py-3">Date</TableHead>
                    <TableHead className="text-gray-200 font-semibold text-sm px-4 py-3">Watch</TableHead>
                    <TableHead className="text-gray-200 font-semibold text-sm px-4 py-3 text-right">Sale Price</TableHead>
                    <TableHead className="text-gray-200 font-semibold text-sm px-4 py-3">Note</TableHead>
                    <TableHead className="text-gray-200 font-semibold text-sm px-4 py-3 text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map(invoice => (
                    <TableRow key={invoice.id} className="border-b border-gray-800 hover:bg-gray-800/70 transition-all">
                      <TableCell className="py-3 px-4 text-gray-200">{new Date(invoice.sale_date).toLocaleDateString('th-TH')}</TableCell>
                      <TableCell className="py-3 px-4">
                        <span className="font-medium text-amber-300">{invoice.watches?.brand || 'N/A'}</span>
                        <span className="text-gray-400 ml-2">{invoice.watches?.ref || ''}</span>
                      </TableCell>
                      <TableCell className="py-3 px-4 text-right text-gray-200 font-medium">
                        {new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(invoice.sale_price)}
                      </TableCell>
                      <TableCell className="py-3 px-4">
                        {invoice.watches?.status === 'Sold' ? (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-200">{invoice.watches?.notes || '-'}</span>
                            <EditNoteDialog watchId={invoice.watches.id!} initialNote={invoice.watches.notes ?? null} />
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="py-3 px-4 text-center">
                        <ReceiptGeneratorButton invoiceId={invoice.id} />
                      </TableCell>
                    </TableRow>
                  ))}
                  {invoices.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12 text-gray-400">
                        <div className="flex flex-col items-center gap-3">
                          <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          <p className="text-lg font-medium">No purchase history found.</p>
                          <p className="text-sm text-gray-500">Add a purchase record to get started</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}