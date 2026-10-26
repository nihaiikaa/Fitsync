import React, { useState, useEffect } from 'react';
import { paymentService } from '../../services/paymentService';
import { memberService } from '../../services/memberService';
import { PaymentRecord, Member } from '../../types';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input, Select } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { StatCard } from '../../components/common/StatCard';
import { Modal } from '../../components/common/Modal';
import { ResponsiveTable, TableHead, TableRow, TableHeaderCell, TableCell } from '../../components/common/ResponsiveTable';
import { EmptyState } from '../../components/common/EmptyState';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  CreditCard,
  DollarSign,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Receipt,
  Download,
} from 'lucide-react';

export const PaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');

  // New Payment Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    memberId: '',
    amount: 89,
    method: 'card' as 'card' | 'upi' | 'cash' | 'bank_transfer',
    status: 'completed' as 'completed' | 'pending' | 'failed',
    planName: 'Pro Performance',
  });

  const { showToast } = useToast();

  const loadData = async () => {
    try {
      const [p, m] = await Promise.all([
        paymentService.getPayments(),
        memberService.getMembers(),
      ]);
      setPayments(p);
      setMembers(m);
      if (m.length > 0 && !formData.memberId) {
        setFormData((prev) => ({ ...prev, memberId: m[0].id }));
      }
    } catch {
      showToast('Failed to load payments', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalCollected = payments
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingAmount = payments
    .filter((p) => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || p.method === methodFilter;
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const member = members.find((m) => m.id === formData.memberId);
    if (!member) {
      showToast('Select a valid member', 'warning');
      return;
    }

    try {
      await paymentService.recordPayment({
        memberId: member.id,
        memberName: member.name,
        amount: Number(formData.amount),
        date: new Date().toISOString().split('T')[0],
        status: formData.status,
        method: formData.method,
        planName: member.membershipPlanName || formData.planName,
      });
      showToast('Payment transaction recorded successfully!', 'success');
      setIsModalOpen(false);
      loadData();
    } catch {
      showToast('Failed to record transaction', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Payments & Billing
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Transaction history, invoice tracking, cash receipts, and digital gateway settlements.
          </p>
        </div>

        <Button
          variant="brand"
          size="md"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsModalOpen(true)}
        >
          Record Manual Payment
        </Button>
      </div>

      {/* Financial Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Paid Volume"
          value={formatCurrency(totalCollected)}
          change="Realized revenue"
          isPositive={true}
          highlight={true}
          icon={<DollarSign className="w-5 h-5 text-[#10E567]" />}
        />
        <StatCard
          title="Pending Invoices"
          value={formatCurrency(pendingAmount)}
          change={`${payments.filter((p) => p.status === 'pending').length} open items`}
          isPositive={false}
          icon={<Clock className="w-5 h-5 text-amber-400" />}
        />
        <StatCard
          title="Completed Transactions"
          value={payments.filter((p) => p.status === 'completed').length}
          subtitle={`Across ${payments.length} total entries`}
          icon={<Receipt className="w-5 h-5 text-blue-400" />}
        />
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            placeholder="Search by invoice number or member..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { label: 'All Payment Statuses', value: 'all' },
              { label: 'Completed', value: 'completed' },
              { label: 'Pending', value: 'pending' },
              { label: 'Failed', value: 'failed' },
            ]}
          />
          <Select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            options={[
              { label: 'All Payment Methods', value: 'all' },
              { label: 'Credit / Debit Card', value: 'card' },
              { label: 'UPI / QR', value: 'upi' },
              { label: 'Cash at Counter', value: 'cash' },
              { label: 'Bank Transfer', value: 'bank_transfer' },
            ]}
          />
        </div>
      </Card>

      {/* Transactions List */}
      {filteredPayments.length === 0 ? (
        <EmptyState
          title="No transactions found"
          description="Adjust your search filters or record an offline payment."
          actionLabel="Record Payment"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <>
          {/* Mobile Cards */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {filteredPayments.map((pay) => (
              <div
                key={pay.id}
                className="bg-[#111318] border border-[#202530] rounded-2xl p-4 space-y-2.5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-[10px] text-zinc-500 uppercase">{pay.invoiceNumber}</span>
                    <h3 className="font-bold text-white text-base">{pay.memberName}</h3>
                  </div>
                  <Badge variant={pay.status === 'completed' ? 'completed' : pay.status === 'pending' ? 'pending' : 'expired'}>
                    {pay.status}
                  </Badge>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#202530]">
                  <div>
                    <span className="text-[10px] text-zinc-500 block uppercase">Plan & Method</span>
                    <span className="text-xs text-zinc-300 font-medium">
                      {pay.planName} • <span className="uppercase">{pay.method}</span>
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-500 block uppercase">Amount</span>
                    <span className="text-base font-black text-[#10E567]">{formatCurrency(pay.amount)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block">
            <ResponsiveTable>
              <TableHead>
                <tr>
                  <TableHeaderCell>Invoice ID</TableHeaderCell>
                  <TableHeaderCell>Member Name</TableHeaderCell>
                  <TableHeaderCell>Plan</TableHeaderCell>
                  <TableHeaderCell>Method</TableHeaderCell>
                  <TableHeaderCell>Date</TableHeaderCell>
                  <TableHeaderCell>Amount</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                </tr>
              </TableHead>
              <tbody>
                {filteredPayments.map((pay) => (
                  <TableRow key={pay.id}>
                    <TableCell className="font-mono text-xs text-zinc-400">{pay.invoiceNumber}</TableCell>
                    <TableCell className="font-bold text-white">{pay.memberName}</TableCell>
                    <TableCell className="text-zinc-300 text-xs">{pay.planName}</TableCell>
                    <TableCell className="uppercase text-xs font-semibold text-zinc-400">
                      {pay.method}
                    </TableCell>
                    <TableCell className="text-xs text-zinc-400">{formatDate(pay.date)}</TableCell>
                    <TableCell className="font-black text-white text-sm">
                      {formatCurrency(pay.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={pay.status === 'completed' ? 'completed' : pay.status === 'pending' ? 'pending' : 'expired'}>
                        {pay.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </ResponsiveTable>
          </div>
        </>
      )}

      {/* Record Payment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Record Payment Entry"
        subtitle="Log an over-the-counter or verified transaction."
        maxWidth="md"
      >
        <form onSubmit={handleRecordPayment} className="space-y-4">
          <Select
            label="Select Member"
            value={formData.memberId}
            onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
            options={members.map((m) => ({ label: `${m.name} (${m.membershipPlanName})`, value: m.id }))}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Amount Paid ($)"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
              required
            />
            <Select
              label="Payment Method"
              value={formData.method}
              onChange={(e) => setFormData({ ...formData, method: e.target.value as any })}
              options={[
                { label: 'Credit / Debit Card', value: 'card' },
                { label: 'UPI / Mobile QR', value: 'upi' },
                { label: 'Cash in Hand', value: 'cash' },
                { label: 'Direct Bank Wire', value: 'bank_transfer' },
              ]}
            />
          </div>

          <Select
            label="Payment Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            options={[
              { label: 'Completed (Settled)', value: 'completed' },
              { label: 'Pending Verification', value: 'pending' },
              { label: 'Failed / Declined', value: 'failed' },
            ]}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#202530]">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="brand" type="submit">
              Save Payment
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
