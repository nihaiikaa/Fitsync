import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import {
  Flame,
  Users,
  LineChart,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Smartphone,
  Server,
  ArrowRight,
  Sparkles,
  Zap,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0A0B0E] text-slate-100 flex flex-col selection:bg-[#10E567] selection:text-black">
      {/* Glow decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-gradient-to-b from-[#10E567]/10 via-[#10E567]/3 to-transparent blur-[120px] pointer-events-none" />

      {/* Public Header */}
      <header className="sticky top-0 z-40 bg-[#0A0B0E]/85 backdrop-blur-md border-b border-[#202530]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#10E567] flex items-center justify-center font-black text-black text-xl shadow-lime-sm">
              F
            </div>
            <div>
              <span className="font-extrabold text-white text-xl tracking-tight">
                Fit<span className="text-[#10E567]">Sync</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                v2.0
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-300">
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-white transition-colors">
              How It Works
            </a>
            <a href="#roles" className="hover:text-white transition-colors">
              Roles & Dashboards
            </a>
            <a href="#architecture" className="hover:text-white transition-colors">
              Tech Stack
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="brand" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-32 px-4 sm:px-6 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#161920] border border-[#242936] text-xs font-semibold text-zinc-300 mb-8 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#10E567] animate-pulse" />
          <span className="text-white">Next-Gen SaaS</span>
          <span className="text-zinc-500">•</span>
          <span className="text-zinc-400">Gym Tracker & Trainer Management</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] max-w-5xl mx-auto">
          Your Fitness. Your Progress.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10E567] via-emerald-400 to-[#1bf873]">
            Your Control.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-xl text-zinc-400 max-w-3xl mx-auto font-normal leading-relaxed">
          FitSync bridges gym owners, certified personal trainers, and members into one seamless ecosystem.
          Log real-time sets, track body recomposition, manage revenue subscriptions, and automate attendance.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/login" className="w-full sm:w-auto">
            <Button
              variant="brand"
              size="lg"
              className="w-full sm:w-auto px-8"
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Explore Live Demo
            </Button>
          </Link>
          <Link to="/register" className="w-full sm:w-auto">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto px-8">
              Register Gym
            </Button>
          </Link>
        </div>

        {/* Feature Highlights Grid Preview */}
        <div className="mt-16 sm:mt-20 relative rounded-3xl border border-[#202530] bg-[#111318]/90 p-4 sm:p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-[#202530] pb-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-xs font-mono text-zinc-500">fitsync-platform.v2</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#10E567] font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> High Performance
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-5 rounded-2xl bg-[#161920] border border-[#242936]">
              <div className="w-10 h-10 rounded-xl bg-[#10E567]/10 border border-[#10E567]/20 flex items-center justify-center text-[#10E567] mb-4">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">Live Workout Logging</h3>
              <p className="text-xs sm:text-sm text-zinc-400">
                Log target weight, sets, reps, and RPE with integrated rest timers and instant completion tracking.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#161920] border border-[#242936]">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">Trainer Client Rosters</h3>
              <p className="text-xs sm:text-sm text-zinc-400">
                Assign workout routines, manage member weight progress, and schedule 1-on-1 personal training slots.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#161920] border border-[#242936]">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
                <LineChart className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">Revenue & Growth Analytics</h3>
              <p className="text-xs sm:text-sm text-zinc-400">
                Track monthly recurring revenue, expiring memberships, and daily footfall attendance with interactive charts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Detailed Section */}
      <section id="features" className="py-20 bg-[#0E1015] border-y border-[#202530] px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-[#10E567] uppercase tracking-widest mb-3">
              Comprehensive Platform Capabilities
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Built for Modern Gyms, Coaches, and High Achievers
            </h3>
            <p className="text-sm sm:text-base text-zinc-400 mt-4">
              Everything required to operate an elite gym franchise or achieve personal fitness transformation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-[#12141A] border border-[#202530] hover:border-[#10E567]/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#10E567]/10 flex items-center justify-center text-[#10E567] mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Member & Tier Management</h4>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Add, search, filter, and renew memberships. Manage plans with automatic expiry tracking and status indicators.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#12141A] border border-[#202530] hover:border-[#10E567]/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-5">
                <Calendar className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Smart Attendance & Check-Ins</h4>
              <p className="text-sm text-zinc-400 leading-relaxed">
                One-tap member check-ins and check-outs with daily timestamps and historical gym traffic analytics.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#12141A] border border-[#202530] hover:border-[#10E567]/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-5">
                <LineChart className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Body Metric Tracking</h4>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Monitor body weight curves, body fat percentages, and weekly progressive overload over time with Recharts.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#12141A] border border-[#202530] hover:border-[#10E567]/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-5">
                <Zap className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Automated Billing & Invoices</h4>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Keep complete audit trails of memberships paid via Credit Card, UPI, Cash, and Bank Transfer with invoice IDs.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#12141A] border border-[#202530] hover:border-[#10E567]/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-5">
                <Smartphone className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Mobile-First Touch Ergonomics</h4>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Optimized bottom navigation for iPhones & Android phones. Responsive cards replace wide tables on small viewports.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#12141A] border border-[#202530] hover:border-[#10E567]/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-5">
                <Server className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Spring Boot Integration Ready</h4>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Axios API service layer with configurable `VITE_API_BASE_URL` and automatic fallback to persistent local storage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-[#10E567] uppercase tracking-widest mb-3">
            Workflow Architecture
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How FitSync Powers Your Gym Operations
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="p-6 rounded-2xl bg-[#111318] border border-[#202530] flex flex-col justify-between">
            <div>
              <div className="text-3xl font-black text-[#10E567]/30 mb-4">01</div>
              <h4 className="text-lg font-bold text-white mb-2">Owner Configures Gym</h4>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Admin defines membership tiers (Standard Flex, Pro Performance, Elite Annual) and invites certified trainers.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#202530] text-xs text-zinc-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#10E567]" /> Admin Dashboard
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#111318] border border-[#202530] flex flex-col justify-between">
            <div>
              <div className="text-3xl font-black text-blue-400/30 mb-4">02</div>
              <h4 className="text-lg font-bold text-white mb-2">Trainer Assigns Workouts</h4>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Trainers design tailored routines with muscle groups, target weights, and schedule 1-on-1 technique checkups.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#202530] text-xs text-zinc-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-400" /> Trainer Portal
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#111318] border border-[#202530] flex flex-col justify-between">
            <div>
              <div className="text-3xl font-black text-amber-400/30 mb-4">03</div>
              <h4 className="text-lg font-bold text-white mb-2">Member Logs & Levels Up</h4>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Gym members open the daily tracker on their phone, check off sets, log current weights, and view progress graphs.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#202530] text-xs text-zinc-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-amber-400" /> Member Experience
            </div>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="rounded-3xl bg-gradient-to-r from-[#121E16] via-[#111318] to-[#121824] border border-[#10E567]/30 p-8 sm:p-14 text-center shadow-lime-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#10E567]/10 rounded-full blur-3xl pointer-events-none" />
          <h3 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Ready to upgrade your gym management?
          </h3>
          <p className="text-sm sm:text-lg text-zinc-400 max-w-2xl mx-auto mb-8">
            Experience the live interactive application with full mock state persistence and role switching.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/login" className="w-full sm:w-auto">
              <Button variant="brand" size="lg" className="w-full sm:w-auto px-8">
                Launch Live Portal
              </Button>
            </Link>
            <Link to="/register" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto px-8">
                Create Free Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="mt-auto bg-[#08090C] border-t border-[#202530] py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#10E567] flex items-center justify-center font-black text-black text-base shadow-lime-sm">
              F
            </div>
            <div>
              <span className="font-extrabold text-white text-base tracking-tight">
                Fit<span className="text-[#10E567]">Sync</span>
              </span>
              <p className="text-xs text-zinc-400">Gym Tracker & Trainer Management System</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-zinc-400">
            <Link to="/login" className="hover:text-white transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="hover:text-white transition-colors">
              Register
            </Link>
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-white transition-colors">
              Workflow
            </a>
          </div>

          <div className="text-xs text-zinc-400 text-center md:text-right">
            &copy; {new Date().getFullYear()} FitSync Inc. Designed with React, TypeScript & Tailwind CSS.
          </div>
        </div>
      </footer>
    </div>
  );
};
