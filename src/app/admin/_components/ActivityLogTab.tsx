'use client'
import React from 'react';
import { Activity, Clock, User, FileText, AlertCircle } from 'lucide-react';

interface ActivityLog {
  id: string;
  user_email: string | null;
  action_type?: string;
  action?: string;
  details: { ref?: string } | null;
  created_at: string;
}

interface Stats {
  activityLogs: ActivityLog[] | null;
}

// ActivityCard component matching the design from other tabs
const ActivityCard = ({ 
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

export default function ActivityLogTab({ stats, userRole }: { stats: Stats | null, userRole: string | null | undefined }) {
    if (userRole !== 'admin') {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg font-medium">Access Restricted</p>
                    <p className="text-gray-500 text-sm">You do not have permission to view this section</p>
                </div>
            </div>
        );
    }
    
    if (!stats) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#E6C36A] border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-400 font-medium">Loading activity logs...</p>
                </div>
            </div>
        );
    }

    const formatActionText = (actionType?: string, action?: string) => {
        const actionText = (actionType || action || '').toLowerCase().replace(/_/g, ' ');
        return actionText.charAt(0).toUpperCase() + actionText.slice(1);
    };

    const formatTimeAgo = (dateString: string) => {
        const now = new Date();
        const logDate = new Date(dateString);
        const diffInMinutes = Math.floor((now.getTime() - logDate.getTime()) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        return `${Math.floor(diffInMinutes / 1440)}d ago`;
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white">Activity Log</h2>
                    <p className="text-gray-400 mt-1">Monitor team activities and system events</p>
                </div>
                <div className="bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
                    <span className="text-sm text-gray-300">Total Activities: </span>
                    <span className="text-sm font-semibold text-[#E6C36A]">
                        {stats.activityLogs?.length || 0}
                    </span>
                </div>
            </div>

            {/* Activity Log */}
            <ActivityCard title="Recent Team Activity" icon={Activity}>
                <div className="space-y-3">
                    {stats.activityLogs && stats.activityLogs.length > 0 ? (
                        stats.activityLogs.map((log: ActivityLog) => (
                            <div 
                                key={log.id} 
                                className="group relative p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:bg-gray-800/70"
                            >
                                {/* Gold accent line on hover */}
                                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#E6C36A] to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
                                
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4 text-[#E6C36A]" />
                                                <span className="text-cyan-400 font-medium truncate">
                                                    {log.user_email || 'Unknown User'}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-2 mb-2">
                                            <FileText className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-300">
                                                {formatActionText(log.action_type, log.action)}
                                            </span>
                                            {log.details?.ref && (
                                                <span className="text-amber-400 font-medium bg-amber-400/10 px-2 py-1 rounded text-sm">
                                                    {log.details.ref}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 text-xs text-gray-500 flex-shrink-0">
                                        <Clock className="w-3 h-3" />
                                        <span>{formatTimeAgo(log.created_at)}</span>
                                    </div>
                                </div>
                                
                                {/* Hover effect overlay */}
                                <div className="absolute inset-0 bg-gradient-to-br from-[#E6C36A]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none"></div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12">
                            <Activity className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400 text-lg font-medium">No Recent Activity</p>
                            <p className="text-gray-500 text-sm">Activity logs will appear here once team members perform actions</p>
                        </div>
                    )}
                </div>
            </ActivityCard>

            {/* Activity Summary */}
            {stats.activityLogs && stats.activityLogs.length > 0 && (
                <ActivityCard title="Activity Summary" icon={FileText}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                            <p className="text-sm text-gray-400">Total Activities</p>
                            <p className="text-2xl font-bold text-white">
                                {stats.activityLogs.length}
                            </p>
                        </div>
                        <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                            <p className="text-sm text-gray-400">Unique Users</p>
                            <p className="text-2xl font-bold text-cyan-400">
                                {new Set(stats.activityLogs.map(log => log.user_email)).size}
                            </p>
                        </div>
                        <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                            <p className="text-sm text-gray-400">Latest Activity</p>
                            <p className="text-lg font-bold text-[#E6C36A]">
                                {stats.activityLogs.length > 0 
                                    ? formatTimeAgo(stats.activityLogs[0].created_at)
                                    : 'N/A'
                                }
                            </p>
                        </div>
                    </div>
                </ActivityCard>
            )}
        </div>
    );
}