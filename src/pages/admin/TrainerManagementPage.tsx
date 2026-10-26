import React, { useState, useEffect } from 'react';
import { trainerService } from '../../services/trainerService';
import { Trainer } from '../../types';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input, Select } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { ResponsiveTable, TableHead, TableRow, TableHeaderCell, TableCell } from '../../components/common/ResponsiveTable';
import { EmptyState } from '../../components/common/EmptyState';
import {
  Search,
  Plus,
  Star,
  Users,
  Edit2,
  Trash2,
  Award,
  Phone,
  Mail,
} from 'lucide-react';

export const TrainerManagementPage: React.FC = () => {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState<Trainer | null>(null);
  const [trainerToDelete, setTrainerToDelete] = useState<Trainer | null>(null);

  // Form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialty: '',
    experienceYears: 3,
    bio: '',
    status: 'active' as 'active' | 'inactive',
    rating: 5.0,
  });

  const { showToast } = useToast();

  const loadTrainers = async () => {
    try {
      const data = await trainerService.getTrainers();
      setTrainers(data);
    } catch {
      showToast('Failed to load trainers', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrainers();
  }, []);

  const filteredTrainers = trainers.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      specialty: 'Hypertrophy & Strength',
      experienceYears: 4,
      bio: '',
      status: 'active',
      rating: 5.0,
    });
    setEditingTrainer(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (trainer: Trainer) => {
    setEditingTrainer(trainer);
    setFormData({
      name: trainer.name,
      email: trainer.email,
      phone: trainer.phone,
      specialty: trainer.specialty,
      experienceYears: trainer.experienceYears,
      bio: trainer.bio,
      status: trainer.status,
      rating: trainer.rating,
    });
    setIsAddModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      showToast('Name and email are required', 'warning');
      return;
    }

    try {
      if (editingTrainer) {
        await trainerService.updateTrainer(editingTrainer.id, formData);
        showToast('Trainer profile updated!', 'success');
      } else {
        await trainerService.addTrainer({
          ...formData,
          assignedMemberCount: 0,
        });
        showToast('New trainer hired and added!', 'success');
      }
      setIsAddModalOpen(false);
      loadTrainers();
    } catch {
      showToast('Failed to save trainer', 'error');
    }
  };

  const handleDelete = async () => {
    if (!trainerToDelete) return;
    try {
      await trainerService.deleteTrainer(trainerToDelete.id);
      showToast(`Trainer ${trainerToDelete.name} removed.`, 'info');
      setTrainerToDelete(null);
      loadTrainers();
    } catch {
      showToast('Failed to delete trainer', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Trainer Management
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Supervise coaching staff, certifications, assigned clients, and performance ratings.
          </p>
        </div>

        <Button
          variant="brand"
          size="md"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={handleOpenAdd}
        >
          Add Certified Trainer
        </Button>
      </div>

      {/* Search */}
      <Card className="p-4">
        <Input
          placeholder="Search by trainer name, specialty, or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
        />
      </Card>

      {/* Grid of Trainers */}
      {filteredTrainers.length === 0 ? (
        <EmptyState
          title="No trainers found"
          description="Add a trainer or refine your search parameters."
          actionLabel="Add Trainer"
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrainers.map((trainer) => (
            <Card key={trainer.id} className="flex flex-col justify-between hover:border-[#10E567]/30 transition-all">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={trainer.avatar}
                      alt={trainer.name}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-[#242936]"
                    />
                    <div>
                      <h3 className="font-bold text-white text-base leading-tight">{trainer.name}</h3>
                      <span className="inline-block text-xs font-semibold text-[#10E567] mt-0.5">
                        {trainer.specialty}
                      </span>
                    </div>
                  </div>
                  <Badge variant={trainer.status}>{trainer.status}</Badge>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed mb-4 line-clamp-2">
                  {trainer.bio || 'Experienced personal trainer dedicated to form optimization and athletic longevity.'}
                </p>

                <div className="grid grid-cols-3 gap-2 bg-[#161920] p-3 rounded-xl border border-[#242936] text-center mb-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-500 block">Experience</span>
                    <span className="text-sm font-bold text-white">{trainer.experienceYears} yrs</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-500 block">Clients</span>
                    <span className="text-sm font-bold text-[#10E567]">{trainer.assignedMemberCount}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-500 block">Rating</span>
                    <span className="text-sm font-bold text-amber-400 flex items-center justify-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-current" /> {trainer.rating}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-zinc-400 mb-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{trainer.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{trainer.phone}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#202530]">
                <Button variant="secondary" size="sm" onClick={() => handleOpenEdit(trainer)}>
                  Edit Profile
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setTrainerToDelete(trainer)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={editingTrainer ? 'Edit Trainer Details' : 'Hire / Add New Trainer'}
        subtitle="Manage personal trainer credentials, specialty focus, and contact info."
        maxWidth="md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Coach Name"
            placeholder="e.g. Marcus Hayes"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="coach@fitsync.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Input
              label="Phone Number"
              placeholder="+1 555-0199"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Specialization"
              placeholder="e.g. Strength & Conditioning"
              value={formData.specialty}
              onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
              required
            />
            <Input
              label="Years of Experience"
              type="number"
              value={formData.experienceYears}
              onChange={(e) => setFormData({ ...formData, experienceYears: parseInt(e.target.value) || 0 })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">
              Coach Bio & Certifications
            </label>
            <textarea
              rows={3}
              className="w-full rounded-xl bg-[#161920] border border-[#242936] text-white text-sm p-3 focus:outline-none focus:border-[#10E567]"
              placeholder="CSCS certified, specialized in athletic biomechanics..."
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
          </div>

          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            options={[
              { label: 'Active Coach', value: 'active' },
              { label: 'Inactive / On Leave', value: 'inactive' },
            ]}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#202530]">
            <Button variant="outline" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="brand" type="submit">
              {editingTrainer ? 'Update Coach' : 'Confirm Hiring'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!trainerToDelete}
        onClose={() => setTrainerToDelete(null)}
        onConfirm={handleDelete}
        title="Remove Trainer"
        message={`Are you sure you want to remove ${trainerToDelete?.name}? Assigned members will become unassigned.`}
        confirmLabel="Remove Trainer"
      />
    </div>
  );
};
