import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  CalendarCheck,
  CalendarDays,
  Flame,
  LineChart,
  User as UserIcon,
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { role } = useAuth();

  const getLinks = () => {
    switch (role) {
      case 'admin':
        return [
          { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
          { to: '/admin/members', label: 'Members', icon: Users },
          { to: '/admin/trainers', label: 'Trainers', icon: Dumbbell },
          { to: '/admin/attendance', label: 'Check-in', icon: CalendarCheck },
          { to: '/profile', label: 'Profile', icon: UserIcon },
        ];
      case 'trainer':
        return [
          { to: '/trainer', label: 'Overview', icon: LayoutDashboard, end: true },
          { to: '/trainer/members', label: 'Clients', icon: Users },
          { to: '/trainer/workout-plans', label: 'Plans', icon: Dumbbell },
          { to: '/trainer/schedule', label: 'Schedule', icon: CalendarDays },
          { to: '/profile', label: 'Profile', icon: UserIcon },
        ];
      case 'member':
      default:
        return [
          { to: '/member', label: 'Home', icon: LayoutDashboard, end: true },
          { to: '/member/workout-tracker', label: 'Workout', icon: Flame },
          { to: '/member/progress', label: 'Progress', icon: LineChart },
          { to: '/notifications', label: 'Alerts', icon: CalendarCheck },
          { to: '/profile', label: 'Profile', icon: UserIcon },
        ];
    }
  };

  const links = getLinks();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-[#0A0B0E]/95 backdrop-blur-lg border-t border-[#202530] px-2 py-1 safe-area-pb">
      <div className="flex items-center justify-around">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all ${
                  isActive
                    ? 'text-[#10E567] font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`
              }
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] tracking-tight">{link.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
