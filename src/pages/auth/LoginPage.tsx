import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Mail, Lock, Shield, Dumbbell, UserCheck, Sparkles } from 'lucide-react';
import { UserRole } from '../../types';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const { login, quickLoginAs } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const validate = () => {
    const errs: { email?: string; password?: string } = {};
    if (!email) errs.email = 'Email address is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Please enter a valid email address';
    if (!password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await login({ email, password });
      showToast('Logged in successfully!', 'success');
      navigate('/admin');
    } catch (err) {
      showToast('Authentication failed. Check credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (role: UserRole) => {
    quickLoginAs(role);
    showToast(`Logged in as demo ${role.toUpperCase()}`, 'success');
    if (role === 'admin') navigate('/admin');
    else if (role === 'trainer') navigate('/trainer');
    else navigate('/member');
  };

  return (
    <div className="bg-[#111318] border border-[#202530] rounded-2xl p-6 sm:p-8 shadow-2xl">
      {/* Title */}
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-white tracking-tight">Welcome Back</h2>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Access your FitSync gym portal and training dashboard.
        </p>
      </div>

      {/* Quick Demo Login Switcher */}
      <div className="p-3.5 mb-6 rounded-xl bg-[#161920] border border-[#262B37]">
        <div className="flex items-center gap-2 mb-2.5">
          <Sparkles className="w-4 h-4 text-[#10E567]" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            1-Click Demo Login
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleQuickDemo('admin')}
            className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-[#111318] hover:bg-[#1D212B] border border-[#262B37] hover:border-[#10E567]/40 text-xs font-semibold text-zinc-200 transition-all group"
          >
            <Shield className="w-4 h-4 text-[#10E567] mb-1 group-hover:scale-110 transition-transform" />
            <span>Admin</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemo('trainer')}
            className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-[#111318] hover:bg-[#1D212B] border border-[#262B37] hover:border-blue-400/40 text-xs font-semibold text-zinc-200 transition-all group"
          >
            <Dumbbell className="w-4 h-4 text-blue-400 mb-1 group-hover:scale-110 transition-transform" />
            <span>Trainer</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemo('member')}
            className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-[#111318] hover:bg-[#1D212B] border border-[#262B37] hover:border-amber-400/40 text-xs font-semibold text-zinc-200 transition-all group"
          >
            <UserCheck className="w-4 h-4 text-amber-400 mb-1 group-hover:scale-110 transition-transform" />
            <span>Member</span>
          </button>
        </div>
      </div>

      {/* Standard Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="admin@fitsync.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          leftIcon={<Mail className="w-4 h-4" />}
        />

        <div>
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            leftIcon={<Lock className="w-4 h-4" />}
          />
          <div className="flex justify-end mt-1.5">
            <Link
              to="/forgot-password"
              className="text-xs text-[#10E567] hover:underline font-medium"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          variant="brand"
          className="w-full mt-2"
          isLoading={loading}
        >
          Sign In to Account
        </Button>
      </form>

      {/* Bottom link */}
      <div className="mt-6 pt-5 border-t border-[#202530] text-center text-xs text-zinc-400">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="text-[#10E567] font-semibold hover:underline">
          Create Account
        </Link>
      </div>
    </div>
  );
};
