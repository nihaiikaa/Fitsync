import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0A0B0E] flex flex-col justify-between relative overflow-hidden">
      {/* Background glowing ambient effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#10E567]/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-600/10 blur-[140px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="px-6 py-6 flex items-center justify-between relative z-10">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#10E567] flex items-center justify-center font-black text-black text-xl shadow-lime-sm">
            F
          </div>
          <div>
            <span className="font-extrabold text-white text-xl tracking-tight">
              Fit<span className="text-[#10E567]">Sync</span>
            </span>
          </div>
        </Link>

        <Link
          to="/"
          className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
        >
          Back to Home &rarr;
        </Link>
      </header>

      {/* Auth Box Container */}
      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>

      {/* Footer Notice */}
      <footer className="py-6 text-center text-xs text-zinc-500 relative z-10">
        <p>FitSync Gym Management & Fitness Tracker &copy; {new Date().getFullYear()}</p>
        <p className="text-[11px] text-zinc-600 mt-1">
          Demo authentication operates in standalone sandbox mode or connects to Java Spring Boot.
        </p>
      </footer>
    </div>
  );
};
