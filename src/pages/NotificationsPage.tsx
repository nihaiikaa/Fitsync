import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { INITIAL_NOTIFICATIONS } from '../data/mockData';
import { NotificationItem } from '../types';
import { Card, CardHeader } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';
import { formatRelativeTime } from '../utils/formatters';
import {
  Bell,
  CheckCircle2,
  Info,
  AlertTriangle,
  Flame,
  Check,
  Trash2,
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleToggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const handleClear = () => {
    setNotifications([]);
  };

  const filtered = notifications.filter((n) => (filter === 'all' ? true : !n.read));
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Notifications & Alerts
            </h1>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#10E567] text-black">
                {unreadCount} new
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-zinc-400">
            System announcements, upcoming training slots, and membership status alerts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Check className="w-3.5 h-3.5" />}
              onClick={handleMarkAllRead}
            >
              Mark all as read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Trash2 className="w-3.5 h-3.5 text-zinc-400" />}
              onClick={handleClear}
            >
              Clear all
            </Button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#202530] pb-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            filter === 'all'
              ? 'bg-[#10E567] text-black shadow-lime-sm'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          All Notifications ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            filter === 'unread'
              ? 'bg-[#10E567] text-black shadow-lime-sm'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Unread Only ({unreadCount})
        </button>
      </div>

      {/* Notification Items List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Bell className="w-6 h-6 text-zinc-500" />}
          title="All caught up!"
          description="You don't have any unread notifications at the moment."
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            let icon = <Info className="w-5 h-5 text-blue-400" />;
            if (item.type === 'success') {
              icon = <CheckCircle2 className="w-5 h-5 text-[#10E567]" />;
            } else if (item.type === 'warning') {
              icon = <AlertTriangle className="w-5 h-5 text-amber-400" />;
            }

            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all flex items-start gap-4 ${
                  item.read
                    ? 'bg-[#111318]/60 border-[#202530] opacity-80'
                    : 'bg-[#161920] border-[#2E3648] shadow-sm'
                }`}
              >
                <div className="mt-0.5 shrink-0">{icon}</div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="text-sm font-bold text-white leading-tight">{item.title}</h4>
                    <span className="text-[10px] text-zinc-400 shrink-0">
                      {formatRelativeTime(item.timestamp)}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed mb-2">{item.message}</p>

                  <div className="flex items-center gap-3">
                    {item.link && (
                      <Link
                        to={item.link}
                        className="text-xs font-semibold text-[#10E567] hover:underline"
                      >
                        View Details &rarr;
                      </Link>
                    )}
                    <button
                      onClick={() => handleToggleRead(item.id)}
                      className="text-[11px] text-zinc-400 hover:text-white transition-colors"
                    >
                      {item.read ? 'Mark as unread' : 'Mark as read'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
