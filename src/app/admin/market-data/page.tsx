import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Calendar, DollarSign, Filter, Award } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

interface MarketPrice {
  id: number;
  brand: string;
  ref: string;
  model: string | null;
  watch_year: number | null;
  product_type: string | null;
  set_type: string | null;
  selling_price: number;
  currency: string;
  notes: string | null;
  source_text: string | null;
  user_email: string | null;
  created_at: string;
}

async function getMarketData() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('market_prices')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching market data:', error);
    return [];
  }

  return (data as unknown as MarketPrice[]) || [];
}

function formatPrice(price: number, currency: string) {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: currency || 'THB',
    minimumFractionDigits: 0
  }).format(price);
}

function getStatusColor(productType: string | null) {
  switch (productType) {
    case 'New': return 'bg-green-800/50 border-green-600 text-green-300';
    case 'Used': return 'bg-blue-800/50 border-blue-600 text-blue-300';
    case 'Vintage': return 'bg-purple-800/50 border-purple-600 text-purple-300';
    case 'NOS': return 'bg-orange-800/50 border-orange-600 text-orange-300';
    default: return 'bg-gray-700/50 border-gray-600 text-gray-400';
  }
}

// StatCard component matching PerformanceTab
const StatCard = ({
  title,
  value,
  subtext,
  icon: Icon,
  className = '',
}: {
  title: string;
  value: string | number;
  subtext?: string;
  icon: React.ElementType;
  className?: string;
}) => (
  <div className="group relative bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:shadow-lg hover:shadow-black/20">
    {/* Gold accent line */}
    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#E6C36A] to-transparent opacity-60"></div>
    <div className="flex items-start gap-3 mb-3">
      <div className="p-2 bg-gray-800 rounded-lg border border-gray-700 group-hover:border-[#E6C36A]/30 transition-colors">
        <Icon className="w-4 h-4 text-[#E6C36A]" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-300">{title}</p>
        <p className={cn('text-2xl font-bold tracking-tight', className || 'text-white')}>{value}</p>
        {subtext && (
          <p className="text-xs text-gray-400 bg-gray-800/50 px-2 py-1 rounded-md inline-block mt-1">{subtext}</p>
        )}
      </div>
    </div>
    {/* Hover effect overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-[#E6C36A]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"></div>
  </div>
);

const InsightCard = ({
  title,
  icon: Icon,
  children,
  className = '',
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn('relative bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-300', className)}>
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

export default async function MarketDataPage() {
  const marketData = await getMarketData();

  if (!marketData || marketData.length === 0) {
    return (
      <div className="container mx-auto py-10 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="h-8 w-8 text-green-500" />
            <h1 className="text-3xl font-bold">Market Price Data</h1>
          </div>
          <Card className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-700 shadow-lg">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#E6C36A] to-transparent opacity-60 rounded-t-xl" />
            <CardContent className="p-8 text-center">
              <TrendingUp className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Market Data Found</h3>
              <p className="text-gray-400 mb-4">
                Start collecting market price data using the parser to analyze market trends.
              </p>
              <Link 
                href="/admin/parser" 
                className="gold-bg text-black font-bold rounded-lg px-4 py-2 inline-flex items-center gap-2 hover:shadow-lg transition-all"
              >
                <TrendingUp className="h-4 w-4" />
                Go to Parser
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalEntries = marketData.length;
  const totalValue = marketData.reduce((sum, item) => sum + (item.selling_price || 0), 0);
  const avgPrice = totalValue / totalEntries;
  const brands = [...new Set(marketData.map(item => item.brand).filter(Boolean))];

  // Group by brand for analysis
  const brandStats = brands.map(brand => {
    const brandData = marketData.filter(item => item.brand === brand);
    const brandTotal = brandData.reduce((sum, item) => sum + (item.selling_price || 0), 0);
    const brandAvg = brandTotal / brandData.length;
    return { brand, count: brandData.length, avgPrice: brandAvg, totalValue: brandTotal };
  }).sort((a, b) => b.count - a.count);

  return (
    <div className="container mx-auto py-10 text-white">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <TrendingUp className="h-8 w-8 text-green-500" />
          <h1 className="text-3xl font-bold">Market Price Data</h1>
        </div>
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard title="Total Entries" value={totalEntries.toLocaleString()} icon={TrendingUp} />
          <StatCard title="Total Value" value={formatPrice(totalValue, 'THB')} icon={DollarSign} />
          <StatCard title="Average Price" value={formatPrice(avgPrice, 'THB')} icon={DollarSign} className="text-blue-400" />
          <StatCard title="Unique Brands" value={brands.length} icon={Filter} className="text-purple-400" />
        </div>
        {/* Brand Analysis */}
        <InsightCard title="Brand Analysis" icon={Award}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {brandStats.slice(0, 9).map((stat) => (
              <div key={stat.brand} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 hover:border-[#E6C36A]/30 transition-all">
                <h4 className="font-semibold text-amber-400 mb-2">{stat.brand}</h4>
                <div className="space-y-1 text-sm">
                  <p>Entries: <span className="text-gray-300">{stat.count}</span></p>
                  <p>Avg Price: <span className="text-gray-300">{formatPrice(stat.avgPrice, 'THB')}</span></p>
                  <p>Total Value: <span className="text-gray-300">{formatPrice(stat.totalValue, 'THB')}</span></p>
                </div>
              </div>
            ))}
          </div>
        </InsightCard>
        {/* Market Data List */}
        <Card className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-700 shadow-lg">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#E6C36A] to-transparent opacity-60 rounded-t-xl" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              Recent Market Data ({marketData.length} entries)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {marketData.map((item) => (
                <div key={item.id} className="relative bg-gray-800/50 p-4 rounded-lg border border-gray-700 hover:border-[#E6C36A]/30 group transition-all">
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#E6C36A] to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300 rounded-t-lg" />
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-amber-400">
                        {item.brand} {item.model || item.ref}
                      </h4>
                      <p className="text-sm text-gray-400">Ref: {item.ref}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-400">
                        {formatPrice(item.selling_price, item.currency)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(item.created_at).toLocaleDateString('th-TH')}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 text-sm">
                    {item.watch_year && (
                      <Badge variant="outline" className="bg-gray-700 border-gray-600 text-gray-300 rounded-lg">
                        {item.watch_year}
                      </Badge>
                    )}
                    {item.product_type && (
                      <Badge variant="outline" className={cn(getStatusColor(item.product_type), 'rounded-lg')}>
                        {item.product_type}
                      </Badge>
                    )}
                    {item.set_type && (
                      <Badge variant="outline" className="bg-blue-800/50 border-blue-600 text-blue-300 rounded-lg">
                        {item.set_type}
                      </Badge>
                    )}
                  </div>
                  {item.notes && (
                    <p className="text-sm text-gray-400 mt-2">{item.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 