import React, { useState, useEffect } from 'react';
import { memberService } from '../../services/memberService';
import { trainerService } from '../../services/trainerService';
import { planService } from '../../services/planService';
import { Member, Trainer, MembershipPlan } from '../../types';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input, Select } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { ResponsiveTable, TableHead, TableRow, TableHeaderCell, TableCell } from '../../components/common/ResponsiveTable';
import { EmptyState } from '../../components/common/EmptyState';
import { formatDate } from '../../utils/formatters';
import {
  Search,
  UserPlus,
  Filter,
  Edit2,
  Trash2,
  UserCheck,
  Phone,
  Mail,
  Shield,
  Dumbbell,
  Calendar,
} from 'lucide-react';

export const MemberManagementPage: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [assigningMember, setAssigningMember] = useState<Member | null>(null);
  const [selectedTrainerId, setSelectedTrainerId] = useState('');
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    membershipPlanId: '',
    startDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    status: 'active' as 'active' | 'expired' | 'pending',
    trainerId: '',
    currentWeight: 70,
    targetWeight: 65,
    height: 175,
    emergencyContact: '',
  });

  const { showToast } = useToast();

  const loadData = async () => {
    try {
      const [m, t, p] = await Promise.all([
        memberService.getMembers(),
        trainerService.getTrainers(),
        planService.getPlans(),
      ]);
      setMembers(m);
      setTrainers(t);
      setPlans(p);
      if (p.length > 0 && !formData.membershipPlanId) {
        setFormData((prev) => ({ ...prev, membershipPlanId: p[0].id }));
      }
    } catch (err) {
      showToast('Failed to load members', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.phone.includes(searchQuery);

    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
    const matchesPlan = planFilter === 'all' || m.membershipPlanId === planFilter;

    return matchesSearch && matchesStatus && matchesPlan;
  });

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      membershipPlanId: plans[0]?.id || '',
      startDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      status: 'active',
      trainerId: '',
      currentWeight: 70,
      targetWeight: 65,
      height: 175,
      emergencyContact: '',
    });
    setEditingMember(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (member: Member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone,
      membershipPlanId: member.membershipPlanId,
      startDate: member.startDate,
      expiryDate: member.expiryDate,
      status: member.status,
      trainerId: member.trainerId || '',
      currentWeight: member.currentWeight,
      targetWeight: member.targetWeight,
      height: member.height,
      emergencyContact: member.emergencyContact,
    });
    setIsAddModalOpen(true);
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      showToast('Name and email are mandatory.', 'warning');
      return;
    }

    const planName = plans.find((p) => p.id === formData.membershipPlanId)?.name || 'Standard Flex';
    const trainerName = trainers.find((t) => t.id === formData.trainerId)?.name;

    try {
      if (editingMember) {
        await memberService.updateMember(editingMember.id, {
          ...formData,
          membershipPlanName: planName,
          trainerName: trainerName,
        });
        showToast('Member details updated successfully!', 'success');
      } else {
        await memberService.addMember({
          ...formData,
          membershipPlanName: planName,
          trainerName: trainerName,
          attendanceCount: 0,
        });
        showToast('New member registered successfully!', 'success');
      }
      setIsAddModalOpen(false);
      loadData();
    } catch {
      showToast('Failed to save member', 'error');
    }
  };

  const handleDeleteMember = async () => {
    if (!memberToDelete) return;
    try {
      await memberService.deleteMember(memberToDelete.id);
      showToast(`Removed member ${memberToDelete.name}`, 'info');
      setMemberToDelete(null);
      loadData();
    } catch {
      showToast('Failed to delete member', 'error');
    }
  };

  const handleAssignTrainer = async () => {
    if (!assigningMember || !selectedTrainerId) return;
    const trainer = trainers.find((t) => t.id === selectedTrainerId);
    if (!trainer) return;

    try {
      await memberService.assignTrainer(assigningMember.id, trainer.id, trainer.name);
      showToast(`Assigned ${trainer.name} to ${assigningMember.name}`, 'success');
      setAssigningMember(null);
      loadData();
    } catch {
      showToast('Failed to assign trainer', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Member Management
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Manage gym roster, active subscriptions, trainer pairings, and renewals.
          </p>
        </div>

        <Button
          variant="brand"
          size="md"
          leftIcon={<UserPlus className="w-4 h-4" />}
          onClick={handleOpenAdd}
        >
          Register New Member
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <div className="sm:col-span-2">
            <Input
              placeholder="Search member by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { label: 'All Statuses', value: 'all' },
              { label: 'Active Members', value: 'active' },
              { label: 'Pending Payment', value: 'pending' },
              { label: 'Expired Plan', value: 'expired' },
            ]}
          />

          <Select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            options={[
              { label: 'All Membership Plans', value: 'all' },
              ...plans.map((p) => ({ label: p.name, value: p.id })),
            ]}
          />
        </div>
      </Card>

      {/* Responsive View: Cards for Mobile, Full Table for Desktop */}
      {filteredMembers.length === 0 ? (
        <EmptyState
          title="No members match your criteria"
          description="Try clearing search filters or register a new gym athlete."
          actionLabel="Register Member"
          onAction={handleOpenAdd}
        />
      ) : (
        <>
          {/* Mobile Card List (Hidden on desktop) */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className="bg-[#111318] border border-[#202530] rounded-2xl p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-12 h-12 rounded-xl object-cover ring-1 ring-[#202530]"
                    />
                    <div>
                      <h3 className="font-bold text-white text-base leading-tight">{member.name}</h3>
                      <p className="text-xs text-zinc-400 mt-0.5">{member.email}</p>
                    </div>
                  </div>
                  <Badge variant={member.status}>{member.status}</Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-[#161920] p-3 rounded-xl border border-[#242936]">
                  <div>
                    <span className="text-zinc-500 block">Plan:</span>
                    <span className="font-semibold text-zinc-200">{member.membershipPlanName}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Trainer:</span>
                    <span className="font-semibold text-zinc-200">{member.trainerName || 'None'}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Current Weight:</span>
                    <span className="font-semibold text-zinc-200">{member.currentWeight} kg</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Expires:</span>
                    <span className="font-semibold text-zinc-200">{formatDate(member.expiryDate)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1 border-t border-[#202530]">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setAssigningMember(member);
                      setSelectedTrainerId(member.trainerId || (trainers[0]?.id || ''));
                    }}
                  >
                    Assign Trainer
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleOpenEdit(member)}
                  >
                    Edit
                  </Button>
                  <button
                    onClick={() => setMemberToDelete(member)}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block">
            <ResponsiveTable>
              <TableHead>
                <tr>
                  <TableHeaderCell>Member</TableHeaderCell>
                  <TableHeaderCell>Plan</TableHeaderCell>
                  <TableHeaderCell>Assigned Coach</TableHeaderCell>
                  <TableHeaderCell>Weight Progress</TableHeaderCell>
                  <TableHeaderCell>Expiry Date</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell className="text-right">Actions</TableHeaderCell>
                </tr>
              </TableHead>
              <tbody>
                {filteredMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-10 h-10 rounded-xl object-cover ring-1 ring-[#202530]"
                        />
                        <div>
                          <p className="font-bold text-white">{member.name}</p>
                          <div className="flex items-center gap-2 text-xs text-zinc-400">
                            <span>{member.email}</span>
                            <span>•</span>
                            <span>{member.phone}</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="font-semibold text-zinc-200">{member.membershipPlanName}</span>
                    </TableCell>

                    <TableCell>
                      {member.trainerName ? (
                        <div className="flex items-center gap-1.5 text-xs text-zinc-300">
                          <Dumbbell className="w-3.5 h-3.5 text-blue-400" />
                          <span>{member.trainerName}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-zinc-500 italic">Unassigned</span>
                      )}
                    </TableCell>

                    <TableCell>
                      <span className="font-bold text-white">{member.currentWeight} kg</span>
                      <span className="text-xs text-zinc-400 ml-1">/ {member.targetWeight} kg</span>
                    </TableCell>

                    <TableCell className="text-xs text-zinc-300">
                      {formatDate(member.expiryDate)}
                    </TableCell>

                    <TableCell>
                      <Badge variant={member.status}>{member.status}</Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setAssigningMember(member);
                            setSelectedTrainerId(member.trainerId || (trainers[0]?.id || ''));
                          }}
                          title="Assign Trainer"
                        >
                          <UserCheck className="w-4 h-4 text-blue-400" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEdit(member)}
                          title="Edit Member"
                        >
                          <Edit2 className="w-4 h-4 text-zinc-300" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setMemberToDelete(member)}
                          title="Delete Member"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </ResponsiveTable>
          </div>
        </>
      )}

      {/* Add / Edit Member Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={editingMember ? 'Edit Gym Member' : 'Register New Gym Member'}
        subtitle="Manage athlete profile, membership expiration, and initial weight."
        maxWidth="lg"
      >
        <form onSubmit={handleSaveMember} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              placeholder="e.g. Sarah Connor"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="sarah@fitsync.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Phone Number"
              placeholder="+1 555-0192"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
            <Input
              label="Emergency Contact"
              placeholder="Name & Contact number"
              value={formData.emergencyContact}
              onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Membership Plan"
              value={formData.membershipPlanId}
              onChange={(e) => setFormData({ ...formData, membershipPlanId: e.target.value })}
              options={plans.map((p) => ({ label: `${p.name} ($${p.price})`, value: p.id }))}
            />
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              options={[
                { label: 'Active', value: 'active' },
                { label: 'Pending', value: 'pending' },
                { label: 'Expired', value: 'expired' },
              ]}
            />
            <Select
              label="Assign Trainer"
              value={formData.trainerId}
              onChange={(e) => setFormData({ ...formData, trainerId: e.target.value })}
              options={[
                { label: 'None (Self-directed)', value: '' },
                ...trainers.map((t) => ({ label: `${t.name} (${t.specialty})`, value: t.id })),
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Current Weight (kg)"
              type="number"
              step="0.1"
              value={formData.currentWeight}
              onChange={(e) => setFormData({ ...formData, currentWeight: parseFloat(e.target.value) || 0 })}
            />
            <Input
              label="Target Goal (kg)"
              type="number"
              step="0.1"
              value={formData.targetWeight}
              onChange={(e) => setFormData({ ...formData, targetWeight: parseFloat(e.target.value) || 0 })}
            />
            <Input
              label="Height (cm)"
              type="number"
              value={formData.height}
              onChange={(e) => setFormData({ ...formData, height: parseInt(e.target.value) || 0 })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Membership Start"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />
            <Input
              label="Membership Expiry"
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#202530]">
            <Button variant="outline" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="brand" type="submit">
              {editingMember ? 'Save Changes' : 'Create Member'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Assign Trainer Modal */}
      <Modal
        isOpen={!!assigningMember}
        onClose={() => setAssigningMember(null)}
        title="Assign Certified Trainer"
        subtitle={`Select a trainer to supervise ${assigningMember?.name}'s workout routines.`}
        maxWidth="sm"
      >
        <div className="space-y-4">
          <Select
            label="Select Trainer"
            value={selectedTrainerId}
            onChange={(e) => setSelectedTrainerId(e.target.value)}
            options={trainers.map((t) => ({
              label: `${t.name} — ${t.specialty} (${t.assignedMemberCount} clients)`,
              value: t.id,
            }))}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#202530]">
            <Button variant="outline" onClick={() => setAssigningMember(null)}>
              Cancel
            </Button>
            <Button variant="brand" onClick={handleAssignTrainer}>
              Confirm Assignment
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!memberToDelete}
        onClose={() => setMemberToDelete(null)}
        onConfirm={handleDeleteMember}
        title="Remove Member Record"
        message={`Are you sure you want to remove ${memberToDelete?.name}? This action cannot be undone.`}
        confirmLabel="Remove Member"
      />
    </div>
  );
};
