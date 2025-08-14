'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

interface CustomerFormData {
  full_name: string;
  phone: string | null;
  social_contact: string | null;
  address: string | null;
  watch_id?: number;
  sale_price?: number;
  sale_date?: string;
}

export async function createOrUpdateCustomer(formData: CustomerFormData, customerId?: number) {
  const supabase = await createClient();
  try {
    const customerData = {
      full_name: formData.full_name,
      phone: formData.phone,
      social_contact: formData.social_contact,
      address: formData.address,
    };
    let newCustomerId = customerId;

    if (customerId) {
      const { error } = await supabase.from('customers').update(customerData).eq('id', customerId);
      if (error) throw error;
    } else {
      const { data: newCustomer, error } = await supabase.from('customers').insert(customerData).select('id').single();
      if (error || !newCustomer) throw new Error(error?.message || "Failed to create customer");
      newCustomerId = newCustomer.id;
    }

    if (newCustomerId && formData.watch_id && formData.sale_price && formData.sale_date) {
        const { error: invoiceError } = await supabase.from('invoices').insert({
            customer_id: newCustomerId,
            watch_id: formData.watch_id,
            sale_price: formData.sale_price,
            sale_date: formData.sale_date,
        });
        if (invoiceError) throw invoiceError;
        const { error: watchError } = await supabase.from('watches').update({ status: 'Sold' }).eq('id', formData.watch_id);
        if (watchError) throw watchError;
    }
    
    revalidatePath('/admin/customers');
    revalidatePath(`/admin/customers/details/${newCustomerId}`);
    if (formData.watch_id) {
        revalidatePath('/admin/watches');
        revalidatePath(`/watch/${formData.watch_id}`);
    }
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return { success: false, error: errorMessage };
  }
}

export async function addHistoricalPurchase(data: {
  customer_id: number;
  watch_id: number;
  sale_price: number;
  sale_date: string;
}) {
  const supabase = await createClient();
  try {
    const { error: invoiceError } = await supabase.from('invoices').insert({
        customer_id: data.customer_id,
        watch_id: data.watch_id,
        sale_price: data.sale_price,
        sale_date: data.sale_date,
    });
    if (invoiceError) throw invoiceError;

    const { error: watchError } = await supabase.from('watches').update({ status: 'Sold' }).eq('id', data.watch_id);
    if (watchError) throw watchError;

    revalidatePath(`/admin/customers/details/${data.customer_id}`);
    revalidatePath('/admin/watches');
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return { success: false, error: errorMessage };
  }
}

export async function getReceiptData(invoiceId: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { data: invoiceData, error } = await supabase
        .from('invoices')
        .select(`*, customers(*), watches(*)`)
        .eq('id', invoiceId)
        .single();
    
    if (error || !invoiceData) {
        return { success: false, error: "Invoice not found." };
    }
    return { success: true, data: { ...invoiceData, seller_email: user?.email } };
}