import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../../components/common/StatCard';
import { Card, CardHeader } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ResponsiveTable, TableHead, TableRow, TableHeaderCell, TableCell } from '../../components/common/ResponsiveTable';
import {
  Users,
  Dumbbell,
  DollarSign,
  TrendingUp,
  UserPlus,
  CalendarCheck,
  PlusCircle,
  ArrowUpRight,
  AlertCircle,
  Calendar,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { memberService } from '../../services/memberService';
import { trainerService } from '../../services/trainerService';
import { paymentService } from '../../services/paymentService';
import { Member, Trainer, PaymentRecord } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { MOCK_REVENUE_CHART, MOCK_GROWTH_CHART } from '../../data/mockData';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [members, setMembers] = useState<Member[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [m, t, p] = await Promise.all([
          memberService.getMembers(),
          trainerService.getTrainers(),
          paymentService.getPayments(),
        ]);
        setMembers(m);
        setTrainers(t);
        setPayments(p);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const activeMembers = members.filter((m) => m.status === 'active');
  const expiringSoon = members.filter((m) => m.status === 'active' && m.expiryDate.startsWith('2026-10') || m.expiryDate.startsWith('2026-11')).slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Welcome Banner & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-[#121E16] via-[#111318] to-[#121824] border border-[#202530] p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-[#10E567] uppercase tracking-wider">
              Gym Executive Center
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-xs text-zinc-400">Real-time Metrics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {user?.name || 'Administrator'}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Here is your gym performance, member growth, and financial summary for today.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="brand"
            size="sm"
            leftIcon={<UserPlus className="w-4 h-4" />}
            onClick={() => navigate('/admin/members')}
          >
            Add Member
          </Button>
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<CalendarCheck className="w-4 h-4" />}
            onClick={() => navigate('/admin/attendance')}
          >
            Check In
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<PlusCircle className="w-4 h-4" />}
            onClick={() => navigate('/admin/plans')}
          >
            New Plan
          </Button>
        </div>
      </div>

      {/* Summary Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Members"
          value={members.length}
          change="+14.2% MoM"
          isPositive={true}
          icon={<Users className="w-5 h-5" />}
          subtitle="494 registered"
        />
        <StatCard
          title="Active Trainers"
          value={trainers.length}
          change="100% capacity"
          isPositive={true}
          icon={<Dumbbell className="w-5 h-5 text-blue-400" />}
          subtitle="All coaches certified"
        />
        <StatCard
          title="Monthly Revenue"
          value={formatCurrency(27850)}
          change="+18.5% this month"
          isPositive={true}
          icon={<DollarSign className="w-5 h-5 text-[#10E567]" />}
          highlight={true}
          subtitle="Net profit: $18,450"
        />
        <StatCard
          title="Active Memberships"
          value={activeMembers.length}
          change={`${Math.round((activeMembers.length / (members.length || 1)) * 100)}% active rate`}
          isPositive={true}
          icon={<TrendingUp className="w-5 h-5 text-purple-400" />}
          subtitle="8 pending renewals"
        />
      </div>

      {/* Interactive Charts: Revenue & Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Chart */}
        <Card>
          <CardHeader
            title="Monthly Revenue & Profit"
            subtitle="Trailing 6-month gross billings vs expenses"
            action={
              <Link
                to="/admin/payments"
                className="text-xs font-semibold text-[#10E567] hover:underline flex items-center gap-1"
              >
                View Payments <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            }
          />
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_REVENUE_CHART} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10E567" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10E567" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#202530" vertical={false} />
                <XAxis dataKey="month" stroke="#6B7280" fontSize={11} tickLine={false} />
                <YAxis stroke="#6B7280" fontSize={11} tickLine={false} tickFormatter={(val) => `$${val / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#161920', borderColor: '#242936', borderRadius: 12 }}
                  itemStyle={{ color: '#10E567', fontSize: 12 }}
                  formatter={(val: any) => [`$${val.toLocaleString()}`, 'Revenue']}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10E567"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#revenueGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Membership Growth Chart */}
        <Card>
          <CardHeader
            title="Membership Growth & Signups"
            subtitle="New member acquisition vs churn rates"
            action={
              <Link
                to="/admin/members"
                className="text-xs font-semibold text-[#10E567] hover:underline flex items-center gap-1"
              >
                Manage Members <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            }
          />
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_GROWTH_CHART} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#202530" vertical={false} />
                <XAxis dataKey="month" stroke="#6B7280" fontSize={11} tickLine={false} />
                <YAxis stroke="#6B7280" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#161920', borderColor: '#242936', borderRadius: 12 }}
                  itemStyle={{ fontSize: 12 }}
                />
                <Bar dataKey="newSignups" name="New Signups" fill="#10E567" radius={[4, 4, 0, 0]} />
                <Bar dataKey="churn" name="Cancellations" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Expirations Alert & Recent Registrations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Member Registrations (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader
              title="Recent Member Registrations"
              subtitle="Latest athletes registered at the gym"
              action={
                <Link
                  to="/admin/members"
                  className="text-xs text-zinc-400 hover:text-white transition-colors"
                >
                  View all ({members.length})
                </Link>
              }
            />

            <div className="space-y-3">
              {members.slice(0, 4).map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-[#161920] border border-[#242936] hover:border-[#10E567]/30 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-10 h-10 rounded-xl object-cover ring-1 ring-[#202530]"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white truncate">{member.name}</p>
                      <p className="text-xs text-zinc-400 truncate">{member.membershipPlanName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant={member.status === 'active' ? 'active' : member.status === 'pending' ? 'pending' : 'expired'}>
                      {member.status}
                    </Badge>
                    <span className="text-xs text-zinc-400 hidden sm:inline">
                      {formatDate(member.startDate)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Upcoming Expirations (1 col) */}
        <div>
          <Card className="h-full flex flex-col justify-between">
            <div>
              <CardHeader
                title="Expiring Memberships"
                subtitle="Action required for renewal retention"
              />

              <div className="space-y-3 mt-2">
                {expiringSoon.map((m) => (
                  <div
                    key={m.id}
                    className="p-3 rounded-xl bg-[#161920] border border-amber-500/20 flex items-start gap-3"
                  >
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white truncate">{m.name}</p>
                      <p className="text-[11px] text-zinc-400 truncate">{m.membershipPlanName}</p>
                      <p className="text-[10px] text-amber-400 font-medium mt-1">
                        Expires: {formatDate(m.expiryDate)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full mt-4"
              onClick={() => navigate('/admin/members')}
            >
              Send Renewal Reminders
            </Button>
          </Card>
        </div>
      </div>

      {/* Recent Payments Table */}
      <Card>
        <CardHeader
          title="Recent Transactions"
          subtitle="Real-time membership payments received"
          action={
            <Link
              to="/admin/payments"
              className="text-xs font-semibold text-[#10E567] hover:underline flex items-center gap-1"
            >
              Complete Ledger <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          }
        />

        <ResponsiveTable>
          <TableHead>
            <tr>
              <TableHeaderCell>Invoice</TableHeaderCell>
              <TableHeaderCell>Member</TableHeaderCell>
              <TableHeaderCell>Plan</TableHeaderCell>
              <TableHeaderCell>Amount</TableHeaderCell>
              <TableHeaderCell>Method</TableHeaderCell>
              <TableHeaderCell>Date</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
            </tr>
          </TableHead>
          <tbody>
            {payments.slice(0, 5).map((pay) => (
              <TableRow key={pay.id}>
                <TableCell className="font-mono text-xs text-zinc-400">{pay.invoiceNumber}</TableCell>
                <TableCell className="font-bold text-white">{pay.memberName}</TableCell>
                <TableCell className="text-zinc-300">{pay.planName}</TableCell>
                <TableCell className="font-extrabold text-[#10E567]">{formatCurrency(pay.amount)}</TableCell>
                <TableCell className="uppercase text-xs text-zinc-400">{pay.method}</TableCell>
                <TableCell className="text-zinc-400">{formatDate(pay.date)}</TableCell>
                <TableCell>
                  <Badge variant={pay.status === 'completed' ? 'completed' : pay.status === 'pending' ? 'pending' : 'expired'}>
                    {pay.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </ResponsiveTable>
      </Card>
    </div>
  );
};
