'use client'
import React from 'react';
import { TrendingUp, Package, ShoppingCart, DollarSign } from 'lucide-react';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const StatCard = ({ 
  title, 
  value, 
  subtext, 
  icon: Icon 
}: { 
  title: string, 
  value: string | number, 
  subtext?: string,
  icon: React.ElementType
}) => ( 
  <div className="group relative bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:shadow-lg hover:shadow-black/20">
    {/* Subtle gold accent line */}
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
          <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
          {subtext && (
            <p className="text-xs text-gray-400 bg-gray-800/50 px-2 py-1 rounded-md inline-block">
              {subtext}
            </p>
          )}
        </div>
      </div>
    </div>
    
    {/* Hover effect overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-[#E6C36A]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"></div>
  </div>
);

interface Stats {
  totalListings: number | null;
  soldThisPeriod: number | null;
  newThisPeriod: number | null;
  totalListingsValue: number;
}

export default function OverviewTab({ stats, rangeLabel }: { stats: Stats | null, rangeLabel: string }) {
    if (!stats) {
        return (
            <div className="flex items-center justify-center min-h-[200px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#E6C36A] border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-400 font-medium">Loading analytics...</p>
                </div>
            </div>
        );
    }
    
    return ( 
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
                    <p className="text-gray-400 mt-1">Monitor your business performance</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <StatCard 
                    title="Total Listings" 
                    value={stats.totalListings?.toLocaleString() ?? '0'} 
                    subtext="All Time" 
                    icon={Package}
                />
                <StatCard 
                    title={`Sold (${rangeLabel})`} 
                    value={stats.soldThisPeriod?.toLocaleString() ?? '0'} 
                    icon={ShoppingCart}
                />
                <StatCard 
                    title={`New (${rangeLabel})`} 
                    value={stats.newThisPeriod?.toLocaleString() ?? '0'} 
                    icon={TrendingUp}
                />
                <StatCard 
                    title="Current Value" 
                    value={formatCurrency(stats.totalListingsValue)} 
                    subtext="Available & Reserved"
                    icon={DollarSign}
                />
            </div>
        </div> 
    );
}