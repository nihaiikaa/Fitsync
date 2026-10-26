import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  CreditCard,
  CalendarCheck,
  CalendarDays,
  Flame,
  LineChart,
  History,
  ShieldCheck,
  Settings,
  Bell,
  LogOut,
  X,
  ExternalLink,
  Layers,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { role, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Nav items per role
  const adminLinks = [
    { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/admin/members', label: 'Members', icon: Users },
    { to: '/admin/trainers', label: 'Trainers', icon: Dumbbell },
    { to: '/admin/plans', label: 'Membership Plans', icon: Layers },
    { to: '/admin/payments', label: 'Payments & Billing', icon: CreditCard },
    { to: '/admin/attendance', label: 'Gym Attendance', icon: CalendarCheck },
  ];

  const trainerLinks = [
    { to: '/trainer', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/trainer/members', label: 'Assigned Members', icon: Users },
    { to: '/trainer/workout-plans', label: 'Workout Plans', icon: Dumbbell },
    { to: '/trainer/schedule', label: 'Training Schedule', icon: CalendarDays },
  ];

  const memberLinks = [
    { to: '/member', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/member/workout-tracker', label: 'Daily Workout', icon: Flame },
    { to: '/member/progress', label: 'Fitness Analytics', icon: LineChart },
    { to: '/member/history', label: 'Workout History', icon: History },
  ];

  const currentLinks =
    role === 'admin' ? adminLinks : role === 'trainer' ? trainerLinks : memberLinks;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#0A0B0E] border-r border-[#202530] flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-[#202530]">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#10E567] flex items-center justify-center font-black text-black text-lg shadow-lime-sm">
              F
            </div>
            <div>
              <span className="font-extrabold text-white text-lg tracking-tight">
                Fit<span className="text-[#10E567]">Sync</span>
              </span>
              <span className="block text-[10px] font-semibold text-zinc-400 tracking-widest uppercase">
                Enterprise SaaS
              </span>
            </div>
          </Link>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 md:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Role Badge */}
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#12141A] border border-[#202530]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#10E567]" />
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                {role} portal
              </span>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#10E567]/10 text-[#10E567] border border-[#10E567]/20">
              Live
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="px-3 pb-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            Main Menu
          </div>
          {currentLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => onClose()}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#10E567] text-black font-semibold shadow-lime-sm'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}

          <div className="pt-6 px-3 pb-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            Account & System
          </div>

          <NavLink
            to="/notifications"
            onClick={() => onClose()}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[#10E567] text-black font-semibold shadow-lime-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <Bell className="w-4 h-4 shrink-0" />
            <span>Notifications</span>
          </NavLink>

          <NavLink
            to="/profile"
            onClick={() => onClose()}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[#10E567] text-black font-semibold shadow-lime-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <Settings className="w-4 h-4 shrink-0" />
            <span>Profile & Settings</span>
          </NavLink>

          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <div className="flex items-center gap-3">
              <ExternalLink className="w-4 h-4 shrink-0" />
              <span>Public Landing Page</span>
            </div>
            <span className="text-[10px] text-zinc-400 bg-white/5 px-1.5 py-0.5 rounded">New</span>
          </Link>
        </div>

        {/* User Card in Sidebar Footer */}
        <div className="p-3 border-t border-[#202530] bg-[#0E1015]">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-[#14161E] border border-[#242936]">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
              alt={user?.name || 'User'}
              className="w-9 h-9 rounded-lg object-cover ring-1 ring-[#10E567]/40"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{user?.name}</p>
              <p className="text-[11px] text-zinc-400 truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-white/5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
