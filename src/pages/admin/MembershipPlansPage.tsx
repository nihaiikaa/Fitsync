import React, { useState, useEffect } from 'react';
import { planService } from '../../services/planService';
import { MembershipPlan } from '../../types';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input, Select } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { formatCurrency } from '../../utils/formatters';
import {
  Plus,
  Check,
  Zap,
  Edit2,
  Trash2,
  Users,
  Clock,
  Sparkles,
} from 'lucide-react';

export const MembershipPlansPage: React.FC = () => {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MembershipPlan[] | null>(null);
  const [planToEdit, setPlanToEdit] = useState<MembershipPlan | null>(null);
  const [planToDelete, setPlanToDelete] = useState<MembershipPlan | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    price: 49,
    durationMonths: 1,
    popular: false,
    description: '',
    featuresText: 'Access to Gym Floor\nLocker Room & Showers\nMobile App Access',
  });

  const { showToast } = useToast();

  const loadPlans = async () => {
    try {
      const data = await planService.getPlans();
      setPlans(data);
    } catch {
      showToast('Failed to load membership plans', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const handleOpenAdd = () => {
    setPlanToEdit(null);
    setFormData({
      name: '',
      price: 59,
      durationMonths: 1,
      popular: false,
      description: 'Full-featured gym membership package.',
      featuresText: 'Access to Gym Floor\nCardio & Free Weights\nLocker Room & Showers\nMobile Workout Tracker',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (plan: MembershipPlan) => {
    setPlanToEdit(plan);
    setFormData({
      name: plan.name,
      price: plan.price,
      durationMonths: plan.durationMonths,
      popular: !!plan.popular,
      description: plan.description,
      featuresText: plan.features.join('\n'),
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Plan title is required', 'warning');
      return;
    }

    const features = formData.featuresText
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    try {
      if (planToEdit) {
        await planService.updatePlan(planToEdit.id, {
          name: formData.name,
          price: Number(formData.price),
          durationMonths: Number(formData.durationMonths),
          popular: formData.popular,
          description: formData.description,
          features,
        });
        showToast('Membership plan updated!', 'success');
      } else {
        await planService.createPlan({
          name: formData.name,
          price: Number(formData.price),
          durationMonths: Number(formData.durationMonths),
          popular: formData.popular,
          description: formData.description,
          features,
          activeMembersCount: 0,
        });
        showToast('New membership tier created!', 'success');
      }
      setIsModalOpen(false);
      loadPlans();
    } catch {
      showToast('Failed to save plan', 'error');
    }
  };

  const handleDelete = async () => {
    if (!planToDelete) return;
    try {
      await planService.deletePlan(planToDelete.id);
      showToast(`Deleted plan ${planToDelete.name}`, 'info');
      setPlanToDelete(null);
      loadPlans();
    } catch {
      showToast('Failed to delete plan', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Membership Plans & Pricing
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Configure subscription tiers, recurring billing intervals, and included amenities.
          </p>
        </div>

        <Button
          variant="brand"
          size="md"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={handleOpenAdd}
        >
          Create New Plan
        </Button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 border ${
              plan.popular
                ? 'bg-gradient-to-b from-[#142318] to-[#111318] border-[#10E567]/50 shadow-lime-md'
                : 'bg-[#111318] border-[#202530] hover:border-[#2E3545]'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#10E567] text-black text-xs font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" /> Most Popular Tier
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-extrabold text-white text-xl">{plan.name}</h3>
                <div className="flex items-center gap-1.5 text-xs text-zinc-400 bg-white/5 px-2.5 py-1 rounded-lg">
                  <Users className="w-3.5 h-3.5 text-[#10E567]" />
                  <span>{plan.activeMembersCount} active</span>
                </div>
              </div>

              <p className="text-xs text-zinc-400 mb-6 leading-relaxed min-h-[36px]">
                {plan.description}
              </p>

              {/* Price display */}
              <div className="flex items-baseline gap-1 mb-6 pb-6 border-b border-[#202530]">
                <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                  {formatCurrency(plan.price)}
                </span>
                <span className="text-xs sm:text-sm text-zinc-400">
                  / {plan.durationMonths === 1 ? 'month' : `${plan.durationMonths} months`}
                </span>
              </div>

              {/* Features List */}
              <div className="space-y-3 mb-8">
                <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                  Included Amenities:
                </p>
                {plan.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-zinc-300">
                    <div className="w-4 h-4 rounded-full bg-[#10E567]/15 text-[#10E567] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Plan Card Footer Actions */}
            <div className="pt-4 border-t border-[#202530] flex items-center justify-between">
              <Button
                variant={plan.popular ? 'brand' : 'secondary'}
                size="sm"
                onClick={() => handleOpenEdit(plan)}
                className="flex-1 mr-2"
                leftIcon={<Edit2 className="w-3.5 h-3.5" />}
              >
                Edit Plan
              </Button>
              <button
                onClick={() => setPlanToDelete(plan)}
                className="p-2 text-zinc-500 hover:text-red-400 hover:bg-white/5 rounded-xl transition-colors"
                title="Delete Plan"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={planToEdit ? 'Modify Membership Plan' : 'Create Membership Plan'}
        subtitle="Set tier pricing, billing cadence, and promotional highlight."
        maxWidth="md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Plan Title"
            placeholder="e.g. Pro Performance"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price (USD)"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              required
            />
            <Input
              label="Duration (Months)"
              type="number"
              value={formData.durationMonths}
              onChange={(e) => setFormData({ ...formData, durationMonths: parseInt(e.target.value) || 1 })}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">
              Short Description
            </label>
            <textarea
              rows={2}
              className="w-full rounded-xl bg-[#161920] border border-[#242936] text-white text-sm p-3 focus:outline-none focus:border-[#10E567]"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">
              Plan Features (One per line)
            </label>
            <textarea
              rows={4}
              className="w-full rounded-xl bg-[#161920] border border-[#242936] text-white text-sm p-3 focus:outline-none focus:border-[#10E567] font-mono text-xs"
              value={formData.featuresText}
              onChange={(e) => setFormData({ ...formData, featuresText: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="popularCheck"
              checked={formData.popular}
              onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
              className="w-4 h-4 rounded text-[#10E567] bg-[#161920] border-[#242936] focus:ring-[#10E567]"
            />
            <label htmlFor="popularCheck" className="text-xs font-semibold text-zinc-300 cursor-pointer">
              Mark as Popular / Recommended Plan
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#202530]">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="brand" type="submit">
              {planToEdit ? 'Save Changes' : 'Create Plan'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!planToDelete}
        onClose={() => setPlanToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Membership Plan"
        message={`Are you sure you want to delete ${planToDelete?.name}? Members currently on this plan will not be deleted.`}
        confirmLabel="Delete Plan"
      />
    </div>
  );
};
