import React, { useState, useEffect } from 'react';
import { workoutService } from '../../services/workoutService';
import { WorkoutPlan, Exercise } from '../../types';
import { useToast } from '../../context/ToastContext';
import { Card, CardHeader } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input, Select } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { EmptyState } from '../../components/common/EmptyState';
import {
  Plus,
  Dumbbell,
  Clock,
  Calendar,
  Trash2,
  Edit2,
  ChevronRight,
  Layers,
} from 'lucide-react';

export const WorkoutPlansPage: React.FC = () => {
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [planToEdit, setPlanToEdit] = useState<WorkoutPlan | null>(null);
  const [planToDelete, setPlanToDelete] = useState<WorkoutPlan | null>(null);
  const [viewingPlan, setViewingPlan] = useState<WorkoutPlan | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    trainerId: 't-1',
    trainerName: 'Marcus Hayes',
    targetLevel: 'intermediate' as 'beginner' | 'intermediate' | 'advanced',
    durationWeeks: 8,
    daysPerWeek: 4,
    exercises: [
      { id: 'ex-1', name: 'Barbell Bench Press', muscleGroup: 'Chest', equipment: 'Barbell', sets: 4, reps: 10, targetWeightKg: 60, restSeconds: 90, notes: 'Full depth' },
      { id: 'ex-2', name: 'Incline Dumbbell Fly', muscleGroup: 'Chest', equipment: 'Dumbbells', sets: 3, reps: 12, targetWeightKg: 14, restSeconds: 60, notes: 'Stretch focus' },
    ] as Exercise[],
  });

  const { showToast } = useToast();

  const loadPlans = async () => {
    try {
      const data = await workoutService.getWorkoutPlans();
      setPlans(data);
    } catch {
      showToast('Failed to load workout plans', 'error');
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
      title: '',
      description: 'Progressive overload focused hypertrophy program.',
      trainerId: 't-1',
      trainerName: 'Marcus Hayes',
      targetLevel: 'intermediate',
      durationWeeks: 8,
      daysPerWeek: 4,
      exercises: [
        { id: `ex-${Date.now()}`, name: 'Barbell Squat', muscleGroup: 'Quadriceps', equipment: 'Squat Rack', sets: 4, reps: 8, targetWeightKg: 80, restSeconds: 120, notes: 'Parallel depth' },
      ],
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (plan: WorkoutPlan) => {
    setPlanToEdit(plan);
    setFormData({
      title: plan.title,
      description: plan.description,
      trainerId: plan.trainerId,
      trainerName: plan.trainerName,
      targetLevel: plan.targetLevel,
      durationWeeks: plan.durationWeeks,
      daysPerWeek: plan.daysPerWeek,
      exercises: plan.exercises,
    });
    setIsModalOpen(true);
  };

  const handleAddExerciseRow = () => {
    setFormData((prev) => ({
      ...prev,
      exercises: [
        ...prev.exercises,
        {
          id: `ex-${Date.now()}-${Math.random()}`,
          name: '',
          muscleGroup: 'Full Body',
          equipment: 'Free Weights',
          sets: 3,
          reps: 10,
          targetWeightKg: 20,
          restSeconds: 60,
          notes: '',
        },
      ],
    }));
  };

  const handleRemoveExerciseRow = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index),
    }));
  };

  const handleUpdateExerciseRow = (index: number, field: keyof Exercise, value: any) => {
    setFormData((prev) => {
      const updated = [...prev.exercises];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, exercises: updated };
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Program title is required', 'warning');
      return;
    }

    try {
      if (planToEdit) {
        await workoutService.updateWorkoutPlan(planToEdit.id, formData);
        showToast('Workout plan updated successfully!', 'success');
      } else {
        await workoutService.createWorkoutPlan(formData);
        showToast('New workout routine published!', 'success');
      }
      setIsModalOpen(false);
      loadPlans();
    } catch {
      showToast('Failed to save workout plan', 'error');
    }
  };

  const handleDelete = async () => {
    if (!planToDelete) return;
    try {
      await workoutService.deleteWorkoutPlan(planToDelete.id);
      showToast(`Removed plan ${planToDelete.title}`, 'info');
      setPlanToDelete(null);
      loadPlans();
    } catch {
      showToast('Failed to delete workout plan', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Workout Plan Management
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Author and assign structured split routines, target weights, sets, and rep ranges.
          </p>
        </div>

        <Button
          variant="brand"
          size="md"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={handleOpenAdd}
        >
          Create Workout Plan
        </Button>
      </div>

      {/* Grid of Plans */}
      {plans.length === 0 ? (
        <EmptyState
          title="No workout plans created yet"
          description="Create your first training template for your athletes."
          actionLabel="Create Plan"
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card key={plan.id} className="flex flex-col justify-between hover:border-[#10E567]/30 transition-all">
              <div>
                <div className="flex items-start justify-between mb-3">
                  <Badge variant="brand">{plan.targetLevel}</Badge>
                  <span className="text-xs text-zinc-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {plan.durationWeeks} Weeks
                  </span>
                </div>

                <h3 className="font-extrabold text-white text-lg mb-1 leading-snug">{plan.title}</h3>
                <p className="text-xs text-zinc-400 mb-4 line-clamp-2">{plan.description}</p>

                <div className="bg-[#161920] p-3 rounded-xl border border-[#242936] space-y-2 mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-500">Frequency:</span>
                    <span className="text-white font-semibold">{plan.daysPerWeek} days / week</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-500">Exercises:</span>
                    <span className="text-[#10E567] font-semibold">{plan.exercises.length} prescribed movements</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-500">Coach:</span>
                    <span className="text-zinc-300 font-semibold">{plan.trainerName}</span>
                  </div>
                </div>

                {/* Exercise preview pills */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {plan.exercises.slice(0, 3).map((ex, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-medium bg-white/5 border border-white/5 px-2 py-0.5 rounded-lg text-zinc-300"
                    >
                      {ex.name} ({ex.sets}x{ex.reps})
                    </span>
                  ))}
                  {plan.exercises.length > 3 && (
                    <span className="text-[11px] text-zinc-500 py-0.5">
                      +{plan.exercises.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#202530]">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewingPlan(plan)}
                  className="flex-1 mr-2"
                >
                  View Details
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleOpenEdit(plan)}
                  className="mr-2"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </Button>
                <button
                  onClick={() => setPlanToDelete(plan)}
                  className="p-2 text-zinc-500 hover:text-red-400 hover:bg-white/5 rounded-xl transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Plan Details Modal */}
      <Modal
        isOpen={!!viewingPlan}
        onClose={() => setViewingPlan(null)}
        title={viewingPlan?.title || 'Workout Plan'}
        subtitle={`${viewingPlan?.targetLevel.toUpperCase()} • ${viewingPlan?.durationWeeks} Weeks • ${viewingPlan?.daysPerWeek} Days/Week`}
        maxWidth="lg"
      >
        <div className="space-y-4">
          <p className="text-xs text-zinc-400">{viewingPlan?.description}</p>

          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Prescribed Exercises</h4>
            {viewingPlan?.exercises.map((ex, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-[#161920] border border-[#242936] flex items-center justify-between"
              >
                <div>
                  <h5 className="font-bold text-white text-sm">{ex.name}</h5>
                  <p className="text-xs text-zinc-400">
                    {ex.muscleGroup} • {ex.equipment}
                  </p>
                  {ex.notes && <p className="text-[11px] text-zinc-500 italic mt-0.5">&ldquo;{ex.notes}&rdquo;</p>}
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-[#10E567]">
                    {ex.sets} sets × {ex.reps} reps
                  </span>
                  <span className="block text-[11px] text-zinc-400">
                    Target: {ex.targetWeightKg} kg • Rest: {ex.restSeconds}s
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-3 border-t border-[#202530]">
            <Button variant="brand" size="sm" onClick={() => setViewingPlan(null)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add / Edit Workout Plan Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={planToEdit ? 'Edit Workout Plan' : 'Create New Workout Plan'}
        subtitle="Define exercises, volume specifications, and training targets."
        maxWidth="2xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Plan Title"
            placeholder="e.g. Upper Body Hypertrophy & Delts"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">
              Program Goal & Description
            </label>
            <textarea
              rows={2}
              className="w-full rounded-xl bg-[#161920] border border-[#242936] text-white text-sm p-3 focus:outline-none focus:border-[#10E567]"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Difficulty Level"
              value={formData.targetLevel}
              onChange={(e) => setFormData({ ...formData, targetLevel: e.target.value as any })}
              options={[
                { label: 'Beginner', value: 'beginner' },
                { label: 'Intermediate', value: 'intermediate' },
                { label: 'Advanced', value: 'advanced' },
              ]}
            />
            <Input
              label="Cycle Duration (Weeks)"
              type="number"
              value={formData.durationWeeks}
              onChange={(e) => setFormData({ ...formData, durationWeeks: parseInt(e.target.value) || 1 })}
            />
            <Input
              label="Days Per Week"
              type="number"
              value={formData.daysPerWeek}
              onChange={(e) => setFormData({ ...formData, daysPerWeek: parseInt(e.target.value) || 1 })}
            />
          </div>

          {/* Dynamic Exercise Rows */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-white uppercase tracking-wider">
                Prescribed Exercises ({formData.exercises.length})
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddExerciseRow}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
              >
                Add Exercise
              </Button>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar p-1">
              {formData.exercises.map((ex, index) => (
                <div
                  key={ex.id || index}
                  className="p-3 rounded-xl bg-[#161920] border border-[#242936] space-y-2 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#10E567]">Exercise #{index + 1}</span>
                    {formData.exercises.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveExerciseRow(index)}
                        className="text-zinc-500 hover:text-red-400 text-xs"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Movement Name (e.g. Incline Bench)"
                      className="rounded-lg bg-[#111318] border border-[#242936] text-white text-xs px-3 py-2"
                      value={ex.name}
                      onChange={(e) => handleUpdateExerciseRow(index, 'name', e.target.value)}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Muscle Group (e.g. Chest)"
                      className="rounded-lg bg-[#111318] border border-[#242936] text-white text-xs px-3 py-2"
                      value={ex.muscleGroup}
                      onChange={(e) => handleUpdateExerciseRow(index, 'muscleGroup', e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    <div>
                      <span className="text-[10px] text-zinc-500 block uppercase">Sets</span>
                      <input
                        type="number"
                        className="w-full rounded-lg bg-[#111318] border border-[#242936] text-white text-xs px-2 py-1.5"
                        value={ex.sets}
                        onChange={(e) => handleUpdateExerciseRow(index, 'sets', parseInt(e.target.value) || 1)}
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 block uppercase">Reps</span>
                      <input
                        type="number"
                        className="w-full rounded-lg bg-[#111318] border border-[#242936] text-white text-xs px-2 py-1.5"
                        value={ex.reps}
                        onChange={(e) => handleUpdateExerciseRow(index, 'reps', parseInt(e.target.value) || 1)}
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 block uppercase">Target kg</span>
                      <input
                        type="number"
                        className="w-full rounded-lg bg-[#111318] border border-[#242936] text-white text-xs px-2 py-1.5"
                        value={ex.targetWeightKg}
                        onChange={(e) => handleUpdateExerciseRow(index, 'targetWeightKg', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 block uppercase">Rest (s)</span>
                      <input
                        type="number"
                        className="w-full rounded-lg bg-[#111318] border border-[#242936] text-white text-xs px-2 py-1.5"
                        value={ex.restSeconds}
                        onChange={(e) => handleUpdateExerciseRow(index, 'restSeconds', parseInt(e.target.value) || 30)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#202530]">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="brand" type="submit">
              {planToEdit ? 'Save Routine' : 'Create Routine'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!planToDelete}
        onClose={() => setPlanToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Workout Program"
        message={`Are you sure you want to delete ${planToDelete?.title}?`}
        confirmLabel="Delete Program"
      />
    </div>
  );
};
