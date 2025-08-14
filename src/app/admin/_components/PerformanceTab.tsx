'use client'

import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, TrendingUp, DollarSign, ShoppingBag, Percent, Eye, Award, BarChart3 } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

// Mock formatCurrency function
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Type Definitions
interface IWatchData {
  id?: string;
  brand?: string | null;
  ref?: string | null;
  cost_price?: number | null;
}

interface ISaleDataItem {
  sale_price: number | null;
  sale_date?: string | null;
  brand: string | null;
  ref: string | null;
  cost_price: number | null;
  watches: IWatchData[] | null;
}

interface ITopSellingItem {
  id: string;
  ref: string;
  brand: string;
  total_sold: number;
}

interface IMostViewedWatch {
  id: string;
  ref: string;
  brand: string;
  view_count: number;
}

interface IStats {
  totalSalesRevenue: number;
  totalCostOfGoods: number;
  salesData: ISaleDataItem[];
  topSelling: ITopSellingItem[] | null;
  mostViewed: IMostViewedWatch[] | null;
}

// Components
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

export default function PerformanceTab({
  salesStats,
  rangeLabel,
}: {
  salesStats: IStats | null;
  rangeLabel: string;
}) {
  const [isExporting, setIsExporting] = useState(false);
  const profit = salesStats?.totalSalesRevenue ? salesStats.totalSalesRevenue - salesStats.totalCostOfGoods : 0;
  const margin = salesStats?.totalSalesRevenue && salesStats.totalSalesRevenue > 0 ? (profit / salesStats.totalSalesRevenue) * 100 : 0;

  const topSellingBrands = useMemo(() => {
    if (!salesStats?.topSelling) return [];
    const brandCounts = salesStats.topSelling.reduce(
      (acc: { [key: string]: number }, { brand, total_sold }) => {
        if (brand) {
          acc[brand] = (acc[brand] || 0) + total_sold;
        }
        return acc;
      },
      {},
    );
    return Object.entries(brandCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  }, [salesStats?.topSelling]);

  if (!salesStats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <BarChart3 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg font-medium">No performance data available</p>
          <p className="text-gray-500 text-sm">Data will appear here once you have sales for the selected period</p>
        </div>
      </div>
    );
  }

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const doc = new jsPDF();
      
      // Try to load custom font, but don't fail if it's not available
      try {
        const fontResponse = await fetch('/Kanit-Regular.ttf');
        if (fontResponse.ok) {
          const font = await fontResponse.arrayBuffer();
          const fontBase64 = btoa(new Uint8Array(font).reduce((data, byte) => data + String.fromCharCode(byte), ''));
          doc.addFileToVFS('Kanit-Regular.ttf', fontBase64);
          doc.addFont('Kanit-Regular.ttf', 'Kanit', 'normal');
          doc.setFont('Kanit');
        }
      } catch (error) {
        console.warn('Failed to load custom font, using default:', error);
        doc.setFont('helvetica');
      }

      doc.setFontSize(18);
      doc.text(`Sales Performance Report - ${rangeLabel}`, 14, 22);

      // Check if we have sales data
      if (!salesStats.salesData || salesStats.salesData.length === 0) {
        doc.setFontSize(12);
        doc.text('No sales data available for this period', 14, 40);
        doc.save(`Performance_Report_${rangeLabel}.pdf`);
        return;
      }

      const tableBody = salesStats.salesData.map((item) => {
        const watch = item.watches?.[0];
        return [
          watch?.brand ?? 'N/A',
          watch?.ref ?? 'N/A',
          item.sale_price ?? 0,
          watch?.cost_price ?? 0,
          (item.sale_price ?? 0) - (watch?.cost_price ?? 0),
        ];
      });

      autoTable(doc, {
        startY: 30,
        head: [['Brand', 'Ref', 'Sale Price', 'Cost', 'Profit']],
        body: tableBody,
        foot: [['Total', '', salesStats.totalSalesRevenue, salesStats.totalCostOfGoods, profit]],
        showFoot: 'lastPage',
        styles: { font: doc.getFont().fontName, fontStyle: 'normal' },
        headStyles: { fillColor: [20, 20, 20] },
        footStyles: { fillColor: [20, 20, 20] },
        didParseCell: (data) => {
          if (typeof data.cell.raw === 'number' && data.column.index > 1) {
            data.cell.text = [formatCurrency(data.cell.raw)];
          }
        },
      });

      const finalY = ((doc as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? 0) + 10;
      doc.setFontSize(12);
      doc.text('Performance Summary:', 14, finalY);
      autoTable(doc, {
        startY: finalY + 4,
        theme: 'plain',
        body: [
          ['Total Sales Revenue:', formatCurrency(salesStats.totalSalesRevenue)],
          ['Total Cost of Goods:', formatCurrency(salesStats.totalCostOfGoods)],
          ['Total Profit:', formatCurrency(profit)],
          ['Average Margin:', `${margin.toFixed(2)}%`],
        ],
        styles: { font: doc.getFont().fontName, fontStyle: 'normal' },
      });

      doc.save(`Performance_Report_${rangeLabel}.pdf`);
    } catch (error) {
      console.error('Failed to export PDF:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Performance Report');
      worksheet.columns = [
        { header: 'Brand', key: 'brand', width: 20 },
        { header: 'Reference', key: 'ref', width: 20 },
        { header: 'Sale Price', key: 'sale_price', width: 15, style: { numFmt: '"$"#,##0.00' } },
        { header: 'Cost Price', key: 'cost_price', width: 15, style: { numFmt: '"$"#,##0.00' } },
        { header: 'Profit', key: 'profit', width: 15, style: { numFmt: '"$"#,##0.00' } },
      ];

      worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
      worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1A1A1A' } };

      // Check if we have sales data
      if (!salesStats.salesData || salesStats.salesData.length === 0) {
        worksheet.addRow(['No sales data available for this period']);
        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), `Performance_Report_${rangeLabel}.xlsx`);
        return;
      }

      salesStats.salesData.forEach((item) => {
        const watch = item.watches?.[0];
        worksheet.addRow({
          brand: watch?.brand ?? 'N/A',
          ref: watch?.ref ?? 'N/A',
          sale_price: item.sale_price ?? 0,
          cost_price: watch?.cost_price ?? 0,
          profit: (item.sale_price ?? 0) - (watch?.cost_price ?? 0),
        });
      });

      worksheet.addRow({});
      const footerRow = worksheet.addRow(['Total', '', salesStats.totalSalesRevenue, salesStats.totalCostOfGoods, profit]);
      footerRow.font = { bold: true };

      worksheet.addRow(['', '', '', 'Average Margin', `${margin.toFixed(2)}%`]).font = { bold: true };

      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([buffer]), `Performance_Report_${rangeLabel}.xlsx`);
    } catch (error) {
      console.error('Failed to export Excel:', error);
      alert('Failed to export Excel. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Performance Analytics</h2>
          <p className="text-gray-400 mt-1">Track sales performance and profitability</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleExportPDF}
            disabled={!salesStats || !salesStats.salesData || salesStats.salesData.length === 0 || isExporting}
            variant="outline"
            className="border-gray-700 hover:border-[#E6C36A] hover:bg-[#E6C36A]/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="mr-2 h-4 w-4" /> 
            {isExporting ? 'Exporting...' : 'PDF'}
          </Button>
          <Button
            onClick={handleExportExcel}
            disabled={!salesStats || !salesStats.salesData || salesStats.salesData.length === 0 || isExporting}
            variant="outline"
            className="border-gray-700 hover:border-[#E6C36A] hover:bg-[#E6C36A]/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="mr-2 h-4 w-4" /> 
            {isExporting ? 'Exporting...' : 'Excel'}
          </Button>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard 
          title="Sales Revenue" 
          value={formatCurrency(salesStats.totalSalesRevenue)} 
          subtext={rangeLabel}
          icon={DollarSign}
          trend="up"
        />
        <StatCard 
          title="Cost of Goods" 
          value={formatCurrency(salesStats.totalCostOfGoods)} 
          subtext="Total Investment"
          icon={ShoppingBag}
          trend="neutral"
        />
        <StatCard 
          title="Total Profit" 
          value={formatCurrency(profit)} 
          subtext="Net Earnings"
          className="text-green-400"
          icon={TrendingUp}
          trend="up"
        />
        <StatCard 
          title="Profit Margin" 
          value={`${margin.toFixed(1)}%`} 
          subtext="Average"
          className="text-cyan-400"
          icon={Percent}
          trend="up"
        />
      </div>

      {/* Insights Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InsightCard title="Top Performing Brands" icon={Award}>
          <div className="space-y-3">
            {topSellingBrands.map(([brand, count], index) => (
              <div key={brand} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-[#E6C36A] text-gray-900 rounded-full text-sm font-bold">
                    {index + 1}
                  </div>
                  <span className="font-medium text-white">{brand}</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-[#E6C36A]">{count}</span>
                  <span className="text-sm text-gray-400 ml-1">units</span>
                </div>
              </div>
            ))}
            {topSellingBrands.length === 0 && (
              <div className="text-center py-8">
                <Award className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">No sales data for this period</p>
              </div>
            )}
          </div>
        </InsightCard>

        <InsightCard title="Most Viewed Watches" icon={Eye}>
          <div className="space-y-3">
            {salesStats.mostViewed?.slice(0, 5).map((watch, index) => (
              <div key={watch.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-gray-700 text-gray-300 rounded-full text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-white">{watch.brand ?? 'N/A'}</p>
                    <p className="text-sm text-gray-400">{watch.ref ?? 'N/A'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-blue-400">{watch.view_count}</span>
                  <span className="text-sm text-gray-400 ml-1">views</span>
                </div>
              </div>
            ))}
            {!salesStats.mostViewed?.length && (
              <div className="text-center py-8">
                <Eye className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">No view data available yet</p>
              </div>
            )}
          </div>
        </InsightCard>
      </div>
    </div>
  );
}