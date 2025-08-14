'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { Watch } from '@/lib/types';
import type { Database } from '@/lib/supabase/database.types';

type ActionResult = { success: true; data?: unknown } | { success: false; error: string };

type WatchMediaUpdate = Database['public']['Tables']['watch_media']['Update'];
type ActivityLogInsert = Database['public']['Tables']['activity_logs']['Insert'];
type WatchUpdate = Database['public']['Tables']['watches']['Update'];
type InvoiceInsert = Database['public']['Tables']['invoices']['Insert'];

type WatchRow = Database['public']['Tables']['watches']['Row'];

type WatchFormData = Partial<Omit<Watch, 'id' | 'created_at' | 'updated_at' | 'view_count'>>;

// Helper function to log activities
async function logActivity(action_type: string, details: object) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const log: ActivityLogInsert = {
        user_id: user.id,
        user_email: user.email,
        action_type,
        details: JSON.stringify(details),
      };
      await supabase.from('activity_logs').insert([log]);
    }
  } catch (error) {
     
    console.error('Failed to log activity:', error);
  }
}

export async function createOrUpdateWatch(
  formData: WatchFormData,
  watchId?: number,
  media?: { url: string, type: 'image' | 'video', position: number, id?: number }[]
): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const dataToUpsert: Partial<WatchRow> = {
      brand: formData.brand,
      ref: formData.ref,
      model: formData.model || null,
      watch_year: formData.watch_year ? Number(formData.watch_year) : null,
      serial_no: formData.serial_no || null,
      product_type: formData.product_type || null,
      set_type: formData.set_type || null,
      size_mm: formData.size_mm ? Number(formData.size_mm) : null,
      material: formData.material || null,
      cost_price: formData.cost_price ? Number(formData.cost_price) : null,
      selling_price: formData.selling_price ? Number(formData.selling_price) : null,
      currency: formData.currency || 'THB',
      status: formData.status || 'Available',
      is_public: formData.is_public ?? false,
      notes: formData.notes || null,
      supplier_id: formData.supplier_id ? Number(formData.supplier_id) : null,
      // Commission fields
      ownership_type: formData.ownership_type || 'stock',
      commission_rate: formData.commission_rate ? Number(formData.commission_rate) : null,
      commission_amount: formData.commission_amount ? Number(formData.commission_amount) : null,
      owner_name: formData.owner_name || null,
      owner_contact: formData.owner_contact || null,
      updated_at: new Date().toISOString(),
    };

    let originalStatus: string | null = null;
    if (watchId) {
      const { data: current, error: selectError } = await supabase.from('watches').select('*').eq('id', watchId).single<WatchRow>();
      if (!selectError && current) {
        originalStatus = current.status;
      }
    }

    let data: WatchRow | null = null;
    let error: { message?: string } | null = null;
    if (watchId) {
      const result = await supabase.from('watches').update(dataToUpsert).eq('id', watchId).select().single<WatchRow>();
      data = result.data;
      error = result.error;
    } else {
      const result = await supabase.from('watches').insert(dataToUpsert).select().single<WatchRow>();
      data = result.data;
      error = result.error;
    }

    if (error || !data || typeof data !== 'object' || !('id' in data)) {
       
      console.error('Error saving watch:', error);
      return { success: false, error: error?.message || 'Unknown error' };
    }

    // --- SYNC watch_media ---
    if (media && Array.isArray(media)) {
      const watch_id = data.id;
      // 1. ดึง media เดิมทั้งหมด (select * เพื่อเปรียบเทียบ)
      const { data: oldMedia } = await supabase.from('watch_media').select('*').eq('watch_id', watch_id);
      const oldMediaArr = Array.isArray(oldMedia) ? oldMedia : [];
      const oldMediaById = new Map<number, typeof oldMediaArr[number]>(oldMediaArr.map((m) => [m.id, m]));
      const newIds = media.filter((m) => m.id).map((m) => m.id);

      // 2. ลบ media ที่ไม่มีใน newMedia
      const toDelete = oldMediaArr.filter((m) => !newIds.includes(m.id));
      if (toDelete.length > 0) {
        await supabase.from('watch_media').delete().in('id', toDelete.map((m) => m.id));
      }

      // 3. เพิ่ม media ใหม่ (ไม่มี id)
      const toInsert = media.filter((m) => !m.id);
      if (toInsert.length > 0) {
        await supabase.from('watch_media').insert(
          toInsert.map((m, idx) => ({
            watch_id,
            url: m.url,
            type: m.type,
            position: m.position ?? idx,
          }))
        );
      }

      // 4. อัปเดต media ที่มี id ตรงกัน ถ้าข้อมูลเปลี่ยน (url/type/position)
      const updatePromises: Promise<unknown>[] = [];
      for (const m of media) {
        if (m.id && oldMediaById.has(m.id)) {
          const old = oldMediaById.get(m.id);
          if (old.url !== m.url || old.type !== m.type || old.position !== m.position) {
            const updateObj: WatchMediaUpdate = { url: m.url, type: m.type, position: m.position };
            updatePromises.push(
              (async () => await supabase.from('watch_media').update(updateObj).eq('id', m.id).select())()
            );
          }
        }
      }
      if (updatePromises.length > 0) {
        await Promise.all(updatePromises);
      }
    }
    // --- END SYNC ---

    let actionType = watchId ? 'EDIT_WATCH' : 'CREATE_WATCH';
    const details = { watchId: data.id, ref: data.ref };

    if (watchId && originalStatus === 'Sold' && data.status !== 'Sold') {
      actionType = 'REVERT_SOLD_STATUS';
      (details as Record<string, unknown>).from = 'Sold';
      (details as Record<string, unknown>).to = data.status;
    }

    await logActivity(actionType, details);

    revalidatePath('/admin/watches');
    revalidatePath('/admin');
    return { success: true, data };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
     
    console.error('createOrUpdateWatch error:', errorMessage);
    return { success: false, error: errorMessage };
  }
}

export async function finalizeSaleAction(
  formData: WatchFormData & { final_sale_price: number; customer_id: number },
  watchId: number
): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const { final_sale_price, customer_id, ...watchData } = formData;
    // กรอง margin_percent, media, images_url, video_url, profit, profit_status, watch_media ออก (ถ้ามี)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { margin_percent, media, images_url, video_url, profit, profit_status, watch_media, ...safeWatchData } = watchData as Record<string, unknown>;
    const dataToUpdate: Partial<WatchUpdate> = {
      ...safeWatchData,
      status: 'Sold',
      is_public: false,
      updated_at: new Date().toISOString(),
    };

    const { data: updatedWatch, error: watchError } = await supabase
      .from('watches')
      .update(dataToUpdate)
      .eq('id', watchId)
      .select('ref')
      .single<{ ref: string }>();
    if (watchError || !updatedWatch) {
      throw new Error(`Failed to update watch status: ${watchError?.message}`);
    }

    const invoiceData: InvoiceInsert = { 
      watch_id: watchId, 
      customer_id, 
      sale_price: final_sale_price, 
      sale_date: new Date().toISOString() 
    };
    const { error: invoiceError } = await supabase.from('invoices').insert([invoiceData]);
    if (invoiceError) {
      throw new Error(`Failed to create invoice: ${invoiceError.message}`);
    }

    await logActivity('FINALIZE_SALE', { watchId, ref: updatedWatch.ref, customerId: customer_id, salePrice: final_sale_price });

    revalidatePath('/admin/watches', 'layout');
    revalidatePath(`/admin/customers/details/${customer_id}`);
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
     
    console.error('finalizeSaleAction error:', errorMessage);
    return { success: false, error: errorMessage };
  }
}

export async function deleteWatch(watchId: number): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const { data: watch } = await supabase.from('watches').select('ref').eq('id', watchId).single<{ ref: string }>();
    if (!watch) {
      throw new Error('Watch not found');
    }

    const { error: invoiceError } = await supabase.from('invoices').delete().eq('watch_id', watchId);
    if (invoiceError) {
      throw new Error(`Failed to delete sales records: ${invoiceError.message}`);
    }

    const { error: watchError } = await supabase.from('watches').delete().eq('id', watchId);
    if (watchError) {
      throw new Error(`Sales records deleted, but failed to delete watch: ${watchError.message}`);
    }

    await logActivity('DELETE_WATCH', { watchId, ref: watch.ref });

    revalidatePath('/admin/watches');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
     
    console.error('Error deleting watch:', errorMessage);
    return { success: false, error: errorMessage };
  }
}

export async function toggleWatchPublicStatus(watchId: number, isPublic: boolean): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const { data: watch } = await supabase.from('watches').select('ref').eq('id', watchId).single<{ ref: string }>();
    if (!watch) {
      return { success: false, error: 'Watch not found' };
    }

    const { error } = await supabase.from('watches').update({ is_public: isPublic }).eq('id', watchId);
    if (error) {
      return { success: false, error: error.message };
    }

    await logActivity('TOGGLE_PUBLIC', { watchId, ref: watch.ref, is_public: isPublic });

    revalidatePath('/admin/watches');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
     
    console.error('toggleWatchPublicStatus error:', errorMessage);
    return { success: false, error: errorMessage };
  }
}