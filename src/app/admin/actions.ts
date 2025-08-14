'use server'
import { createClient } from '@/lib/supabase/server';

export async function getDashboardStats(startDate: string, endDate: string) {
    const supabase = await createClient();

    const totalListingsReq = supabase.from('watches').select('id', { count: 'exact', head: true });
    const soldThisPeriodReq = supabase.from('invoices').select('watch_id', { count: 'exact', head: true }).gte('sale_date', startDate).lte('sale_date', endDate);
    const newThisPeriodReq = supabase.from('watches').select('id', { count: 'exact', head: true }).gte('created_at', startDate).lte('created_at', endDate);
    const listingsValueReq = supabase.from('watches').select('selling_price').in('status', ['Available', 'Reserved']);
    const salesDataReq = supabase.from('invoices').select('sale_price, sale_date, watches(ref, brand, cost_price)').gte('sale_date', startDate).lte('sale_date', endDate);
    const topSellingReq = supabase.from('invoices').select('watches(brand)').gte('sale_date', startDate).lte('sale_date', endDate);
    const mostViewedReq = supabase.from('watches').select('ref, brand, view_count').order('view_count', { ascending: false }).limit(5);
    const activityLogsReq = supabase.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(20);

    const [
        { count: totalListings },
        { count: soldThisPeriod },
        { count: newThisPeriod },
        { data: listingsValueData },
        { data: salesData },
        { data: topSellingData },
        { data: mostViewedData },
        { data: activityLogsData },
    ] = await Promise.all([
        totalListingsReq, soldThisPeriodReq, newThisPeriodReq, listingsValueReq, salesDataReq, topSellingReq, mostViewedReq, activityLogsReq
    ]);

    const totalListingsValue = listingsValueData?.reduce((sum, item) => sum + (item.selling_price ?? 0), 0) ?? 0;
    const totalSalesRevenue = salesData?.reduce((sum, item) => sum + item.sale_price, 0) ?? 0;
    
    // --- FIX IS HERE ---
    // Access the first element of the 'watches' array before getting 'cost_price'
    const totalCostOfGoods = salesData?.reduce((sum, item) => sum + (item.watches?.[0]?.cost_price ?? 0), 0) ?? 0;

    return {
        totalListings,
        soldThisPeriod,
        newThisPeriod,
        totalListingsValue,
        totalSalesRevenue,
        totalCostOfGoods,
        topSelling: topSellingData,
        mostViewed: mostViewedData,
        activityLogs: activityLogsData,
        salesData: salesData || [],
    };
}