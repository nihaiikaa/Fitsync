import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Card, CardHeader } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input, Select } from '../components/common/Input';
import { Badge } from '../components/common/Badge';
import {
  User as UserIcon,
  Mail,
  Phone,
  Shield,
  Server,
  Save,
  CheckCircle2,
  Key,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateCurrentUser } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '+1 (555) 019-2834');
  const [backendUrl, setBackendUrl] = useState(
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'
  );

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUser({ name, email, phone });
    showToast('Profile information updated successfully!', 'success');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Profile & System Settings
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Manage your personal account credentials, role details, and backend server endpoints.
        </p>
      </div>

      {/* Profile Overview Card */}
      <Card>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-[#202530]">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
            alt={user?.name || 'User'}
            className="w-20 h-20 rounded-2xl object-cover ring-2 ring-[#10E567]/50 shadow-lime-sm"
          />
          <div className="text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
              <h2 className="text-xl font-bold text-white">{user?.name}</h2>
              <Badge variant="brand">{user?.role?.toUpperCase()}</Badge>
            </div>
            <p className="text-xs text-zinc-400">{user?.email}</p>
            <p className="text-xs text-zinc-500 mt-1">
              Member since {user?.joinedDate || 'Jan 2024'}
            </p>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSaveProfile} className="space-y-4 pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={<UserIcon className="w-4 h-4" />}
              required
            />
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              leftIcon={<Phone className="w-4 h-4" />}
            />
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">
                Assigned Role
              </label>
              <div className="px-3.5 py-2.5 rounded-xl bg-[#161920] border border-[#242936] text-xs font-semibold text-zinc-400 flex items-center justify-between">
                <span className="capitalize">{user?.role}</span>
                <span className="text-[10px] text-[#10E567]">Configured by Admin</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="brand" type="submit" leftIcon={<Save className="w-4 h-4" />}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      </Card>

      {/* Backend API Configuration Card */}
      <Card>
        <CardHeader
          title="Java Spring Boot Backend Architecture"
          subtitle="Axios API Service Configuration"
        />

        <div className="space-y-4 text-xs text-zinc-400 leading-relaxed">
          <p>
            FitSync utilizes an enterprise-grade API client configured with Axios. When your
            Spring Boot microservice runs locally or in cloud production, provide the base API URL below.
          </p>

          <div className="p-4 rounded-xl bg-[#161920] border border-[#242936] space-y-3">
            <Input
              label="Backend REST API Base URL"
              value={backendUrl}
              onChange={(e) => setBackendUrl(e.target.value)}
              leftIcon={<Server className="w-4 h-4 text-[#10E567]" />}
              helperText="Default fallback: http://localhost:8080/api. When offline, automatic local state persistence takes over."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-[#161920] border border-[#242936]">
              <span className="font-bold text-white block mb-1">Local Mock Engine:</span>
              <span className="text-emerald-400">● Active</span> with persistent localStorage data.
            </div>
            <div className="p-3 rounded-xl bg-[#161920] border border-[#242936]">
              <span className="font-bold text-white block mb-1">Spring Boot Controller:</span>
              <span className="text-blue-400">Ready</span> for REST endpoints.
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
