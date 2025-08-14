'use client'

import { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getDashboardStats } from "./actions";
import OverviewTab from "./_components/OverviewTab";
import PerformanceTab from "./_components/PerformanceTab";
import ActivityLogTab from "./_components/ActivityLogTab";
import CommissionSummaryTab from "./_components/CommissionSummaryTab";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { createClient } from "@/lib/supabase/client";
import { Calendar, Settings, TrendingUp, Activity, Eye, Lock } from 'lucide-react';

// Type Definitions
interface IWatchData {
  id?: string;
  ref?: string;
  brand?: string;
  cost_price?: number | null;
}

interface ISaleDataItem {
  sale_price: number | null;
  sale_date: string | null;
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

interface IMostViewedItem {
  id: string;
  ref: string;
  brand: string;
  view_count: number;
}

interface IStats {
  totalListings: number | null;
  soldThisPeriod: number | null;
  newThisPeriod: number | null;
  totalListingsValue: number;
  totalSalesRevenue: number;
  totalCostOfGoods: number;
  topSelling: ITopSellingItem[] | null;
  mostViewed: IMostViewedItem[] | null;
  activityLogs: {
    id: string;
    created_at: string;
    user_email: string | null;
    action: string;
    details: { ref?: string } | null;
  }[] | null;
  salesData: ISaleDataItem[];
}

// Type guards for data validation
function isSaleDataItem(obj: unknown): obj is ISaleDataItem {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    'sale_price' in obj &&
    'sale_date' in obj &&
    'watches' in obj
  );
}

function isWatchDataArray(arr: unknown): arr is IWatchData[] {
  return Array.isArray(arr) && arr.every(item => 
    item !== null && 
    typeof item === 'object' && 
    'brand' in item && 
    'ref' in item
  );
}

function isTopSellingItem(obj: unknown): obj is { total_sold: number; watches: IWatchData[] } {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    'total_sold' in obj &&
    'watches' in obj &&
    isWatchDataArray((obj as { watches: unknown }).watches)
  );
}

function isMostViewedItem(obj: unknown): obj is { view_count: number; watches: IWatchData[] } {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    'view_count' in obj &&
    'watches' in obj &&
    isWatchDataArray((obj as { watches: unknown }).watches)
  );
}

type DateRangeOption = 'daily' | 'weekly' | 'monthly' | 'all';
type UserRole = 'admin' | 'marketing' | 'viewer' | null;

const LoadingSkeleton = () => (
  <div className="space-y-8">
    {/* Header Skeleton */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="h-8 w-48 bg-gray-800 rounded animate-pulse"></div>
      <div className="h-10 w-[200px] bg-gray-800 rounded animate-pulse"></div>
    </div>
    
    {/* Enhanced Tabs Skeleton */}
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-2 rounded-2xl border border-gray-700/50 shadow-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-14 bg-gray-700/70 rounded-xl animate-pulse"></div>
        ))}
      </div>
    </div>
    
    {/* Content Skeleton */}
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-[120px] bg-gray-800 rounded-xl animate-pulse"></div>
        ))}
      </div>
    </div>
  </div>
);

// Enhanced Tab Component
const EnhancedTabTrigger = ({ 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  value: _value, 
  children, 
  icon: Icon, 
  isActive, 
  isDisabled, 
  onClick,
  badge 
}: {
  value: string;
  children: React.ReactNode;
  icon: React.ComponentType<{ className?: string }>;
  isActive: boolean;
  isDisabled: boolean;
  onClick: () => void;
  badge?: number;
}) => (
  <button
    onClick={onClick}
    disabled={isDisabled}
    className={`
      group relative flex items-center justify-center gap-2 px-4 py-3 rounded-xl
      transition-all duration-300 ease-in-out transform
      ${isActive 
        ? 'bg-gradient-to-r from-[#E6C36A] to-[#F0D16B] text-gray-900 shadow-lg shadow-[#E6C36A]/20 scale-105' 
        : isDisabled 
          ? 'bg-gray-800/50 text-gray-500 cursor-not-allowed' 
          : 'bg-gray-800/70 text-gray-300 hover:bg-gray-700/80 hover:text-white hover:shadow-md hover:shadow-gray-700/20'
      }
      border border-gray-700/50 backdrop-blur-sm
      ${!isDisabled && 'hover:scale-102 active:scale-95'}
      font-medium text-sm sm:text-base
      min-h-[52px] sm:min-h-[56px]
    `}
  >
    {/* Background glow effect for active tab */}
    {isActive && (
      <div className="absolute inset-0 bg-gradient-to-r from-[#E6C36A]/20 to-[#F0D16B]/20 rounded-xl blur-xl -z-10 animate-pulse" />
    )}
    
    {/* Icon */}
    <Icon className={`
      w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300
      ${isActive ? 'text-gray-900' : isDisabled ? 'text-gray-500' : 'text-gray-400 group-hover:text-[#E6C36A]'}
    `} />
    
    {/* Text */}
    <span className={`
      hidden sm:inline-block transition-all duration-300
      ${isActive ? 'text-gray-900 font-semibold' : isDisabled ? 'text-gray-500' : 'text-gray-300 group-hover:text-white'}
    `}>
      {children}
    </span>
    
    {/* Mobile text (shortened) */}
    <span className={`
      sm:hidden transition-all duration-300 text-xs
      ${isActive ? 'text-gray-900 font-semibold' : isDisabled ? 'text-gray-500' : 'text-gray-300 group-hover:text-white'}
    `}>
      {typeof children === 'string' ? children.split(' ')[0] : children}
    </span>
    
    {/* Badge */}
    {badge && badge > 0 && (
      <div className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg">
        {badge > 99 ? '99+' : badge}
      </div>
    )}
    
    {/* Disabled lock icon */}
    {isDisabled && (
      <Lock className="w-3 h-3 text-gray-500 ml-1" />
    )}
  </button>
);

// Separate component that uses useSearchParams
function AdminDashboardContent() {
  const [stats, setStats] = useState<IStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRangeOption>('monthly');
  const [userRole, setUserRole] = useState<UserRole>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Tab state synced with URL
  const tabFromUrl = searchParams.get('tab') || 'overview';
  const [tab, setTab] = useState(tabFromUrl);

  // Keep tab in sync with URL
  useEffect(() => {
    setTab(tabFromUrl);
  }, [tabFromUrl]);

  const handleTabChange = (value: string) => {
    setTab(value);
    const params = new URLSearchParams(window.location.search);
    params.set('tab', value);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const dateRangeLabel = useMemo(() => {
    const labels = {
      daily: 'Today',
      weekly: 'This Week',
      monthly: 'This Month',
      all: 'All Time',
    };
    return labels[dateRange];
  }, [dateRange]);

  // Calculate date range based on current selection
  const { startDate, endDate } = useMemo(() => {
    const now = new Date();
    let start: Date;
    let end: Date;

    switch (dateRange) {
      case 'daily':
        start = startOfDay(now);
        end = endOfDay(now);
        break;
      case 'weekly':
        start = startOfWeek(now, { weekStartsOn: 1 });
        end = endOfWeek(now, { weekStartsOn: 1 });
        break;
      case 'monthly':
        start = startOfMonth(now);
        end = endOfMonth(now);
        break;
      case 'all':
        start = new Date('2020-01-01'); // Start from 2020
        end = now;
        break;
      default:
        start = startOfMonth(now);
        end = endOfMonth(now);
        break;
    }

    return { startDate: start, endDate: end };
  }, [dateRange]);

  useEffect(() => {
    const supabase = createClient();
    
    const fetchData = async () => {
      setIsLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      let role: UserRole = null;
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        role = profile?.role as UserRole;
        setUserRole(role);
      }

      if (role === 'viewer') {
        router.replace('/admin/watches');
        return;
      }

      try {
        const result = await getDashboardStats(startDate.toISOString(), endDate.toISOString());

        if (result) {
          // Transform salesData
          const transformedSalesData = result.salesData?.flatMap(sale => {
            if (isSaleDataItem(sale) && isWatchDataArray(sale.watches)) {
              return sale.watches.map((watch: IWatchData) => ({
                sale_price: sale.sale_price ?? null,
                sale_date: sale.sale_date ?? null,
                brand: watch.brand ?? null,
                ref: watch.ref ?? null,
                cost_price: watch.cost_price ?? null,
                watches: sale.watches
              }));
            }
            return [];
          }) || [];

          // Transform topSelling
          const transformedTopSelling = (result.topSelling?.map((item: unknown, index: number) => {
            if (isTopSellingItem(item) && item.watches.length > 0) {
              const watchData: IWatchData = item.watches[0];
              const timestamp = Date.now();
              const randomStr = Math.random().toString(36).substr(2, 9);
              const uniqueId = watchData.id && typeof watchData.id === 'string' && watchData.id.trim() !== '' 
                ? `${watchData.id}-${timestamp}` 
                : `topselling-${index}-${timestamp}-${randomStr}`;
              return {
                id: uniqueId,
                ref: watchData.ref ?? '',
                brand: watchData.brand ?? '',
                total_sold: item.total_sold ?? 0,
              };
            }
            return null;
          }).filter(Boolean) as ITopSellingItem[]) || null;

          // Transform mostViewed
          const transformedMostViewed = (result.mostViewed?.map((item: unknown, index: number) => {
            if (isMostViewedItem(item) && item.watches.length > 0) {
              const watchData: IWatchData = item.watches[0];
              const timestamp = Date.now();
              const randomStr = Math.random().toString(36).substr(2, 9);
              const uniqueId = watchData.id && typeof watchData.id === 'string' && watchData.id.trim() !== '' 
                ? `${watchData.id}-${timestamp}` 
                : `mostviewed-${index}-${timestamp}-${randomStr}`;
              return {
                id: uniqueId,
                ref: watchData.ref ?? '',
                brand: watchData.brand ?? '',
                view_count: item.view_count ?? 0,
              };
            }
            return null;
          }).filter(Boolean) as IMostViewedItem[]) || null;

          // Transform activityLogs
          const transformedActivityLogs = Array.isArray(result.activityLogs)
            ? (result.activityLogs
                .filter((log) => log && typeof log === 'object' && 'id' in log && 'created_at' in log && 'action_type' in log)
                .map((log) => ({
                  id: log.id,
                  created_at: log.created_at,
                  user_email: log.user_email ?? null,
                  action: log.action_type ?? '',
                  details: typeof log.details === 'object' && log.details !== null && 'ref' in log.details 
                    ? { ref: (log.details as { ref?: string }).ref } 
                    : null,
                })))
            : null;

          const transformedStats: IStats = {
            ...result,
            salesData: transformedSalesData,
            topSelling: transformedTopSelling,
            mostViewed: transformedMostViewed,
            activityLogs: transformedActivityLogs,
          };

          setStats(transformedStats);
        } else {
          setStats(null);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        setStats(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dateRange, router, startDate, endDate]);

  if (isLoading || !userRole) {
    return <LoadingSkeleton />;
  }

  if (userRole === 'viewer') {
    return null;
  }

  // Tab configurations
  const tabConfigs = [
    {
      value: 'overview',
      label: 'Overview',
      icon: Eye,
      disabled: false
    },
    {
      value: 'performance',
      label: 'Sales & Performance',
      icon: TrendingUp,
      disabled: userRole !== 'admin'
    },
    {
      value: 'commission',
      label: 'Commission',
      icon: Settings,
      disabled: userRole !== 'admin'
    },
    {
      value: 'activity',
      label: 'Activity Log',
      icon: Activity,
      disabled: userRole !== 'admin'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Monitor your business performance and analytics</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-gray-800 to-gray-700 px-4 py-2 rounded-lg border border-gray-600 shadow-lg">
            <span className="text-sm text-gray-300">Period: </span>
            <span className="text-sm font-semibold text-[#E6C36A]">{dateRangeLabel}</span>
          </div>
          <Select value={dateRange} onValueChange={(value) => setDateRange(value as DateRangeOption)}>
            <SelectTrigger className="w-[200px] border-gray-700 bg-gradient-to-r from-gray-800 to-gray-700 hover:border-gray-600 focus:border-[#E6C36A] shadow-lg">
              <Calendar className="w-4 h-4 mr-2 text-[#E6C36A]" />
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="daily" className="hover:bg-gray-700">รายวัน (Today)</SelectItem>
              <SelectItem value="weekly" className="hover:bg-gray-700">รายสัปดาห์ (This Week)</SelectItem>
              <SelectItem value="monthly" className="hover:bg-gray-700">รายเดือน (This Month)</SelectItem>
              <SelectItem value="all" className="hover:bg-gray-700">ทั้งหมด (All Time)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Enhanced Tabs */}
      <div className="w-full">
        {/* Premium Tab Container */}
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-3 rounded-2xl border border-gray-700/50 shadow-2xl backdrop-blur-sm">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            {tabConfigs.map((tabConfig) => (
              <EnhancedTabTrigger
                key={tabConfig.value}
                value={tabConfig.value}
                icon={tabConfig.icon}
                isActive={tab === tabConfig.value}
                isDisabled={tabConfig.disabled}
                onClick={() => !tabConfig.disabled && handleTabChange(tabConfig.value)}
              >
                {tabConfig.label}
              </EnhancedTabTrigger>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {!stats ? (
            <LoadingSkeleton />
          ) : (
            <div className="animate-fadeIn">
              {tab === 'overview' && (
                <OverviewTab stats={stats} rangeLabel={dateRangeLabel} />
              )}
              {tab === 'performance' && (
                <PerformanceTab salesStats={stats} rangeLabel={dateRangeLabel} />
              )}
              {tab === 'commission' && (
                <CommissionSummaryTab startDate={startDate.toISOString()} endDate={endDate.toISOString()} />
              )}
              {tab === 'activity' && (
                <ActivityLogTab stats={{ activityLogs: stats.activityLogs }} userRole={userRole} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <AdminDashboardContent />
    </Suspense>
  );
}