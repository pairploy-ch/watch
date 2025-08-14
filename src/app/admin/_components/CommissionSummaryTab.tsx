'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Download, TrendingUp, DollarSign, ShoppingBag, Percent, Award, BarChart3 } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

interface CommissionSummary {
  commission_watches_count: number;
  stock_watches_count: number;
  total_commission_revenue: number;
  total_stock_revenue: number;
  total_commission_amount: number;
  total_stock_profit: number;
}

interface CommissionSummaryTabProps {
  startDate: string;
  endDate: string;
}

// StatCard component matching the design from PerformanceTab and OverviewTab
const StatCard = ({
  title,
  value,
  subtext,
  className = '',
  icon: Icon,
  trend,
}: {
  title: string;
  value: string | number;
  subtext?: string;
  className?: string;
  icon: React.ElementType;
  trend?: 'up' | 'down' | 'neutral';
}) => (
  <div className="group relative bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:shadow-lg hover:shadow-black/20">
    {/* Gold accent line */}
    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#E6C36A] to-transparent opacity-60"></div>
    
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-gray-800 rounded-lg border border-gray-700 group-hover:border-[#E6C36A]/30 transition-colors">
            <Icon className="w-4 h-4 text-[#E6C36A]" />
          </div>
          <p className="text-sm font-medium text-gray-300">{title}</p>
        </div>
        
        <div className="space-y-2">
          <p className={`text-2xl font-bold tracking-tight ${className || 'text-white'}`}>
            {value}
          </p>
          {subtext && (
            <p className="text-xs text-gray-400 bg-gray-800/50 px-2 py-1 rounded-md inline-block">
              {subtext}
            </p>
          )}
        </div>
      </div>
      
      {trend && (
        <div className={`p-1 rounded-full ${
          trend === 'up' ? 'bg-green-500/20 text-green-400' : 
          trend === 'down' ? 'bg-red-500/20 text-red-400' : 
          'bg-gray-500/20 text-gray-400'
        }`}>
          <TrendingUp className={`w-3 h-3 ${trend === 'down' ? 'rotate-180' : ''}`} />
        </div>
      )}
    </div>
    
    {/* Hover effect overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-[#E6C36A]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"></div>
  </div>
);

// InsightCard component matching the design from PerformanceTab
const InsightCard = ({ 
  title, 
  icon: Icon, 
  children, 
  className = '' 
}: { 
  title: string; 
  icon: React.ElementType; 
  children: React.ReactNode; 
  className?: string; 
}) => (
  <div className={`relative bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-300 ${className}`}>
    {/* Gold accent line at the top */}
    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#E6C36A] to-transparent opacity-60 rounded-t-xl"></div>
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-gray-800 rounded-lg border border-gray-700">
        <Icon className="w-5 h-5 text-[#E6C36A]" />
      </div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
    </div>
    {children}
  </div>
);

export default function CommissionSummaryTab({ startDate, endDate }: CommissionSummaryTabProps) {
  const [summary, setSummary] = useState<CommissionSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCommissionSummary = async () => {
      try {
        setLoading(true);
        setError(null);
        const supabase = createClient();
        
        console.log('Fetching commission summary for date range:', { startDate, endDate });
        
        // Try RPC function first
        // Convert ISO strings to date strings for SQL function
        const startDateStr = new Date(startDate).toISOString().split('T')[0];
        const endDateStr = new Date(endDate).toISOString().split('T')[0];
        
        console.log('Calling RPC with date strings:', { startDateStr, endDateStr });
        
        const { data, error } = await supabase.rpc('get_commission_summary', {
          start_date: startDateStr,
          end_date: endDateStr
        });
        
        console.log('RPC response:', { data, error });

        // If RPC fails, use direct query as fallback
        if (error) {
          console.log('RPC failed, trying direct query:', error);
          
          const { data: queryData, error: queryError } = await supabase
            .from('watches_with_calculations')
            .select('ownership_type, status, selling_price, profit_calculated, created_at')
            .gte('created_at', `${startDate}T00:00:00`)
            .lte('created_at', `${endDate}T23:59:59`);

          if (queryError) {
            console.error('Direct query also failed:', queryError);
            setError('Failed to load commission summary');
            return;
          }

          // Process the data manually
          const soldWatches = queryData?.filter(watch => watch.status === 'Sold') || [];
          
          const commissionWatches = soldWatches.filter(watch => watch.ownership_type === 'commission');
          const stockWatches = soldWatches.filter(watch => watch.ownership_type === 'stock');
          
          const summaryData = {
            commission_watches_count: commissionWatches.length,
            stock_watches_count: stockWatches.length,
            total_commission_revenue: commissionWatches.reduce((sum, watch) => sum + (watch.selling_price || 0), 0),
            total_stock_revenue: stockWatches.reduce((sum, watch) => sum + (watch.selling_price || 0), 0),
            total_commission_amount: commissionWatches.reduce((sum, watch) => sum + (watch.profit_calculated || 0), 0),
            total_stock_profit: stockWatches.reduce((sum, watch) => sum + (watch.profit_calculated || 0), 0)
          };
          
          console.log('Processed summary data:', summaryData);
          setSummary(summaryData);
        } else {
          // RPC succeeded
          if (data && data.length > 0) {
            console.log('RPC data received:', data[0]);
            setSummary(data[0]);
          } else {
            console.log('No RPC data, setting default values');
            setSummary({
              commission_watches_count: 0,
              stock_watches_count: 0,
              total_commission_revenue: 0,
              total_stock_revenue: 0,
              total_commission_amount: 0,
              total_stock_profit: 0
            });
          }
        }
      } catch (err) {
        console.error('Commission summary error:', err);
        setError('Failed to load commission summary');
      } finally {
        setLoading(false);
      }
    };

    fetchCommissionSummary();
  }, [startDate, endDate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#E6C36A] border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-400 font-medium">Loading commission data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <BarChart3 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-red-400 text-lg font-medium">{error}</p>
          <p className="text-gray-500 text-sm mt-2">Please check the browser console for more details</p>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <BarChart3 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg font-medium">No commission data available</p>
          <p className="text-gray-500 text-sm">Data will appear here once you have sales for the selected period</p>
        </div>
      </div>
    );
  }

  // Calculate percentages
  const commissionRate = summary.total_commission_revenue > 0 
    ? ((summary.total_commission_amount / summary.total_commission_revenue) * 100).toFixed(1)
    : '0';
  
  const stockMargin = summary.total_stock_revenue > 0 
    ? ((summary.total_stock_profit / summary.total_stock_revenue) * 100).toFixed(1)
    : '0';
  
  const totalRevenue = summary.total_commission_revenue + summary.total_stock_revenue;
  const totalProfit = summary.total_commission_amount + summary.total_stock_profit;
  const overallMargin = totalRevenue > 0 
    ? ((totalProfit / totalRevenue) * 100).toFixed(1)
    : '0';

  // Export PDF
  const handleExportPDF = async () => {
    const doc = new jsPDF();
    try {
      const fontResponse = await fetch('/Kanit-Regular.ttf');
      if (!fontResponse.ok) throw new Error('Font not found');
      const font = await fontResponse.arrayBuffer();
      const fontBase64 = btoa(new Uint8Array(font).reduce((data, byte) => data + String.fromCharCode(byte), ''));
      doc.addFileToVFS('Kanit-Regular.ttf', fontBase64);
      doc.addFont('Kanit-Regular.ttf', 'Kanit', 'normal');
      doc.setFont('Kanit');
    } catch (error) {
      console.error('Failed to load font:', error);
    }
    doc.setFontSize(18);
    doc.text('Commission & Stock Summary', 14, 22);
    autoTable(doc, {
      startY: 30,
      head: [[
        'Type',
        'Sales Count',
        'Revenue',
        'Commission/Profit',
        'Avg Rate/Margin'
      ]],
      body: [
        [
          'Commission',
          summary.commission_watches_count,
          formatCurrency(summary.total_commission_revenue),
          formatCurrency(summary.total_commission_amount),
          commissionRate + '%'
        ],
        [
          'Stock',
          summary.stock_watches_count,
          formatCurrency(summary.total_stock_revenue),
          formatCurrency(summary.total_stock_profit),
          stockMargin + '%'
        ]
      ],
      styles: { font: 'Kanit', fontStyle: 'normal' },
      headStyles: { fillColor: [20, 20, 20] },
      footStyles: { fillColor: [20, 20, 20] },
    });
    doc.save('Commission_Stock_Summary.pdf');
  };

  // Export Excel
  const handleExportExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Commission & Stock Summary');
    worksheet.columns = [
      { header: 'Type', key: 'type', width: 16 },
      { header: 'Sales Count', key: 'count', width: 14 },
      { header: 'Revenue', key: 'revenue', width: 18 },
      { header: 'Commission/Profit', key: 'profit', width: 18 },
      { header: 'Avg Rate/Margin', key: 'avg', width: 16 },
    ];
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1A1A1A' } };
    worksheet.addRow({
      type: 'Commission',
      count: summary.commission_watches_count,
      revenue: summary.total_commission_revenue,
      profit: summary.total_commission_amount,
      avg: commissionRate + '%'
    });
    worksheet.addRow({
      type: 'Stock',
      count: summary.stock_watches_count,
      revenue: summary.total_stock_revenue,
      profit: summary.total_stock_profit,
      avg: stockMargin + '%'
    });
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), 'Commission_Stock_Summary.xlsx');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Commission & Stock Analytics</h2>
          <p className="text-gray-400 mt-1">Track commission sales and stock performance</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleExportPDF}
            disabled={!summary}
            variant="outline"
            className="border-gray-700 hover:border-[#E6C36A] hover:bg-[#E6C36A]/10"
          >
            <Download className="mr-2 h-4 w-4" /> PDF
          </Button>
          <Button
            onClick={handleExportExcel}
            disabled={!summary}
            variant="outline"
            className="border-gray-700 hover:border-[#E6C36A] hover:bg-[#E6C36A]/10"
          >
            <Download className="mr-2 h-4 w-4" /> Excel
          </Button>
        </div>
      </div>

      {/* Commission Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard 
          title="Commission Sales" 
          value={summary.commission_watches_count.toLocaleString()} 
          subtext="Units Sold"
          icon={ShoppingBag}
          trend="up"
        />
        <StatCard 
          title="Commission Revenue" 
          value={formatCurrency(summary.total_commission_revenue)} 
          subtext="Total Sales"
          icon={DollarSign}
          trend="up"
        />
        <StatCard 
          title="Commission Earned" 
          value={formatCurrency(summary.total_commission_amount)} 
          subtext="Net Earnings"
          className="text-green-400"
          icon={TrendingUp}
          trend="up"
        />
        <StatCard 
          title="Commission Rate" 
          value={`${commissionRate}%`} 
          subtext="Average"
          className="text-cyan-400"
          icon={Percent}
          trend="up"
        />
      </div>

      {/* Stock Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard 
          title="Stock Sales" 
          value={summary.stock_watches_count.toLocaleString()} 
          subtext="Units Sold"
          icon={ShoppingBag}
          trend="up"
        />
        <StatCard 
          title="Stock Revenue" 
          value={formatCurrency(summary.total_stock_revenue)} 
          subtext="Total Sales"
          icon={DollarSign}
          trend="up"
        />
        <StatCard 
          title="Stock Profit" 
          value={formatCurrency(summary.total_stock_profit)} 
          subtext="Net Earnings"
          className="text-green-400"
          icon={TrendingUp}
          trend="up"
        />
        <StatCard 
          title="Profit Margin" 
          value={`${stockMargin}%`} 
          subtext="Average"
          className="text-cyan-400"
          icon={Percent}
          trend="up"
        />
      </div>

      {/* Combined Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InsightCard title="Combined Performance" icon={Award}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                <p className="text-sm text-gray-400">Total Sales</p>
                <p className="text-2xl font-bold text-white">
                  {(summary.commission_watches_count + summary.stock_watches_count).toLocaleString()}
                </p>
              </div>
              <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                <p className="text-sm text-gray-400">Total Revenue</p>
                <p className="text-2xl font-bold text-white">
                  {formatCurrency(totalRevenue)}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                <p className="text-sm text-gray-400">Total Profit</p>
                <p className="text-2xl font-bold text-green-400">
                  {formatCurrency(totalProfit)}
                </p>
              </div>
              <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                <p className="text-sm text-gray-400">Overall Margin</p>
                <p className="text-2xl font-bold text-cyan-400">
                  {overallMargin}%
                </p>
              </div>
            </div>
          </div>
        </InsightCard>

        <InsightCard title="Performance Breakdown" icon={BarChart3}>
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="font-medium text-white">Commission</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-purple-400">
                    {summary.commission_watches_count}
                  </span>
                  <span className="text-sm text-gray-400 ml-1">units</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="font-medium text-white">Stock</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-blue-400">
                    {summary.stock_watches_count}
                  </span>
                  <span className="text-sm text-gray-400 ml-1">units</span>
                </div>
              </div>
            </div>
            <div className="pt-2 border-t border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Commission vs Stock Ratio</span>
                <span className="text-sm font-medium text-[#E6C36A]">
                  {summary.commission_watches_count + summary.stock_watches_count > 0 
                    ? `${((summary.commission_watches_count / (summary.commission_watches_count + summary.stock_watches_count)) * 100).toFixed(1)}%`
                    : '0%'
                  } Commission
                </span>
              </div>
            </div>
          </div>
        </InsightCard>
      </div>
    </div>
  );
}