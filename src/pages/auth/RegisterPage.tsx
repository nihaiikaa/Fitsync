import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Input, Select } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Mail, Lock, User as UserIcon, Phone } from 'lucide-react';
import { UserRole } from '../../types';
import { authService } from '../../services/authService';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('member');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { quickLoginAs } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Full name is required';
    if (!email.trim()) errs.email = 'Email address is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Enter a valid email address';
    if (!phone.trim()) errs.phone = 'Phone number is required';
    if (!password) errs.password = 'Password is required';
    else if (password.length < 6) errs.password = 'Must be at least 6 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await authService.register({ name, email, phone, role, password });
      quickLoginAs(role);
      showToast('Registration complete! Welcome to FitSync.', 'success');
      if (role === 'admin') navigate('/admin');
      else if (role === 'trainer') navigate('/trainer');
      else navigate('/member');
    } catch (err) {
      showToast('Registration failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#111318] border border-[#202530] rounded-2xl p-6 sm:p-8 shadow-2xl">
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-white tracking-tight">Create an Account</h2>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Join the next-generation fitness management platform.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          placeholder="e.g. Jordan Miller"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          leftIcon={<UserIcon className="w-4 h-4" />}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="jordan@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          leftIcon={<Mail className="w-4 h-4" />}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Phone Number"
            type="tel"
            placeholder="+1 555-0123"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={errors.phone}
            leftIcon={<Phone className="w-4 h-4" />}
          />

          <Select
            label="Account Role"
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            options={[
              { label: 'Gym Member', value: 'member' },
              { label: 'Certified Trainer', value: 'trainer' },
              { label: 'Gym Owner / Admin', value: 'admin' },
            ]}
          />
        </div>

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          leftIcon={<Lock className="w-4 h-4" />}
        />

        <Button
          type="submit"
          variant="brand"
          className="w-full mt-2"
          isLoading={loading}
        >
          Complete Registration
        </Button>
      </form>

      <div className="mt-6 pt-5 border-t border-[#202530] text-center text-xs text-zinc-400">
        Already registered?{' '}
        <Link to="/login" className="text-[#10E567] font-semibold hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
};
