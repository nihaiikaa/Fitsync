import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import {
  Menu,
  Bell,
  LogOut,
  User as UserIcon,
  Shield,
  Dumbbell,
  UserCheck,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { user, role, quickLoginAs, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);

  const handleRoleChange = (newRole: UserRole) => {
    quickLoginAs(newRole);
    setRoleSwitcherOpen(false);
    if (newRole === 'admin') navigate('/admin');
    else if (newRole === 'trainer') navigate('/trainer');
    else navigate('/member');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-[#0E1015]/90 backdrop-blur-md border-b border-[#202530]">
      {/* Left side: Hamburger on mobile + Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 md:hidden transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* FitSync Mobile Brand */}
        <Link to="/" className="flex items-center gap-2.5 md:hidden">
          <div className="w-8 h-8 rounded-lg bg-[#10E567] flex items-center justify-center font-black text-black text-base shadow-lime-sm">
            F
          </div>
          <span className="font-extrabold text-white text-base tracking-tight">
            Fit<span className="text-[#10E567]">Sync</span>
          </span>
        </Link>

        {/* Desktop Quick Role Indicator & Switcher */}
        <div className="relative hidden sm:block">
          <button
            onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#161920] border border-[#242936] hover:border-[#10E567]/50 text-xs font-medium text-zinc-200 transition-all"
          >
            <span className="text-zinc-500 text-[11px] uppercase tracking-wider">Role Preview:</span>
            <span className="flex items-center gap-1.5 font-bold text-white capitalize">
              {role === 'admin' && <Shield className="w-3.5 h-3.5 text-[#10E567]" />}
              {role === 'trainer' && <Dumbbell className="w-3.5 h-3.5 text-blue-400" />}
              {role === 'member' && <UserCheck className="w-3.5 h-3.5 text-amber-400" />}
              {role}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
          </button>

          {roleSwitcherOpen && (
            <div className="absolute left-0 mt-2 w-56 rounded-xl bg-[#161920] border border-[#262B37] shadow-2xl p-1.5 z-40">
              <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                Switch Role Preview
              </div>
              <button
                onClick={() => handleRoleChange('admin')}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-left transition-colors ${
                  role === 'admin' ? 'bg-[#10E567]/15 text-[#10E567]' : 'text-zinc-300 hover:bg-white/5'
                }`}
              >
                <Shield className="w-4 h-4 text-[#10E567]" />
                <div>
                  <p>Admin / Gym Owner</p>
                  <span className="text-[10px] text-zinc-400 font-normal">Full gym operations</span>
                </div>
              </button>
              <button
                onClick={() => handleRoleChange('trainer')}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-left transition-colors ${
                  role === 'trainer' ? 'bg-blue-500/15 text-blue-400' : 'text-zinc-300 hover:bg-white/5'
                }`}
              >
                <Dumbbell className="w-4 h-4 text-blue-400" />
                <div>
                  <p>Trainer Dashboard</p>
                  <span className="text-[10px] text-zinc-400 font-normal">Clients & workouts</span>
                </div>
              </button>
              <button
                onClick={() => handleRoleChange('member')}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-left transition-colors ${
                  role === 'member' ? 'bg-amber-500/15 text-amber-400' : 'text-zinc-300 hover:bg-white/5'
                }`}
              >
                <UserCheck className="w-4 h-4 text-amber-400" />
                <div>
                  <p>Gym Member</p>
                  <span className="text-[10px] text-zinc-400 font-normal">Personal workout tracker</span>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right side: Backend Pill, Notifications, User Menu */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Spring Boot API Ready Indicator */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#161920] border border-[#242936] text-[11px] text-zinc-400">
          <span className="w-2 h-2 rounded-full bg-[#10E567] animate-pulse" />
          <span>Spring Boot API Ready</span>
        </div>

        {/* Notifications */}
        <Link
          to="/notifications"
          className="relative p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#10E567] ring-2 ring-[#0E1015]" />
        </Link>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-white/5 transition-all text-left"
          >
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
              alt={user?.name || 'User'}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-[#10E567]/30"
            />
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-white leading-tight">{user?.name || 'User'}</p>
              <p className="text-[10px] text-zinc-400 capitalize">{user?.role || 'Guest'}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 hidden sm:block" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#161920] border border-[#262B37] shadow-2xl p-2 z-40">
              <div className="px-3 py-2 border-b border-[#242936] mb-1">
                <p className="text-xs font-bold text-white">{user?.name}</p>
                <p className="text-[11px] text-zinc-400 truncate">{user?.email}</p>
              </div>

              {/* Mobile Role Switcher */}
              <div className="sm:hidden px-3 py-2 border-b border-[#242936] mb-1">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                  Switch Preview Role:
                </p>
                <div className="flex gap-1">
                  {(['admin', 'trainer', 'member'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => handleRoleChange(r)}
                      className={`flex-1 py-1 text-[10px] font-semibold rounded-lg capitalize ${
                        role === r ? 'bg-[#10E567] text-black font-bold' : 'bg-white/5 text-zinc-300'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <Link
                to="/profile"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                <UserIcon className="w-4 h-4 text-zinc-400" />
                Profile & Settings
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-red-400 hover:bg-red-500/10 transition-colors mt-1"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
