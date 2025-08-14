'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import LogoutButton from './_components/LogoutButton';
import { Menu, X, Home, Watch, Users, Bot, TrendingUp, User } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';

type UserRole = 'admin' | 'marketing' | 'viewer' | null;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    setHasMounted(true);
    const supabase = createClient();
    
    const getRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        setUserRole(profile?.role as UserRole);
      }
    };
    
    getRole();
  }, []);

  const canSeeDashboard = userRole === 'admin' || userRole === 'marketing';
  const canSeeCustomers = userRole === 'admin' || userRole === 'marketing';
  const canSeeParser = userRole === 'admin' || userRole === 'marketing';
  const canSeeMarketData = userRole === 'admin' || userRole === 'marketing';

  const menuItems = [
    { href: '/admin', label: 'Dashboard', icon: Home, show: canSeeDashboard },
    { href: '/admin/watches', label: 'Watches', icon: Watch, show: true },
    { href: '/admin/customers', label: 'Customers', icon: Users, show: canSeeCustomers },
    { href: '/admin/parser', label: 'AI Parser', icon: Bot, show: canSeeParser },
    { href: '/admin/market-data', label: 'Market Data', icon: TrendingUp, show: canSeeMarketData },
  ];

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'marketing': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'viewer': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex">
      {/* Mobile Overlay */}
      {hasMounted && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`
        flex-shrink-0 fixed lg:relative inset-y-0 left-0 w-72 bg-gradient-to-b from-gray-900 via-black to-gray-900 border-r border-gray-700/50 flex flex-col justify-between transform transition-all duration-300 z-40 shadow-2xl
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Sidebar Header */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#E6C36A] to-[#B8860B] bg-clip-text text-transparent">
              CHRONOS-DB
            </h2>
            <div className="lg:hidden">
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* User Profile Section */}
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl p-4 mb-6 border border-gray-700/30">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E6C36A] to-[#B8860B] flex items-center justify-center">
                <User size={18} className="text-black" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.email?.split('@')[0] || 'User'}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getRoleBadge(userRole)}`}>
                    {userRole?.toUpperCase() || 'LOADING...'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {menuItems.map((item) => {
              if (!item.show) return null;
              
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-[#E6C36A]/10 hover:to-[#B8860B]/10 transition-all duration-200 border border-transparent hover:border-[#E6C36A]/20"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Icon size={20} className="text-gray-400 group-hover:text-[#E6C36A] transition-colors" />
                  <span className="text-gray-300 group-hover:text-white font-medium transition-colors">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-6">
          <div className="border-t border-gray-700/50 pt-6">
            <LogoutButton />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="flex-shrink-0 flex items-center justify-between lg:justify-end h-16 px-4 sm:px-8 border-b border-gray-700/50 bg-black/40 backdrop-blur-sm sticky top-0 z-20">
          <div className="lg:hidden">
            {hasMounted && (
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800/50"
              >
                {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            )}
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}