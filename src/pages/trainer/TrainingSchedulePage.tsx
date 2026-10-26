import React, { useState, useEffect } from 'react';
import { scheduleService } from '../../services/scheduleService';
import { trainerService } from '../../services/trainerService';
import { TrainingScheduleItem, Member } from '../../types';
import { useToast } from '../../context/ToastContext';
import { Card, CardHeader } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input, Select } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { EmptyState } from '../../components/common/EmptyState';
import { formatDate } from '../../utils/formatters';
import {
  CalendarDays,
  Clock,
  Plus,
  CheckCircle,
  XCircle,
  User,
  Filter,
} from 'lucide-react';

export const TrainingSchedulePage: React.FC = () => {
  const [schedule, setSchedule] = useState<TrainingScheduleItem[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals & State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    memberId: '',
    title: 'Personal Training Session',
    sessionType: 'personal_training' as 'personal_training' | 'assessment' | 'nutrition_consult',
    date: new Date().toISOString().split('T')[0],
    startTime: '10:00 AM',
    endTime: '11:00 AM',
    notes: 'Warm-up with dynamic stretches and core activation.',
  });

  const { showToast } = useToast();

  const loadData = async () => {
    try {
      const [sch, mem] = await Promise.all([
        scheduleService.getSchedule(),
        trainerService.getAssignedMembers('t-1'),
      ]);
      setSchedule(sch);
      setMembers(mem);
      if (mem.length > 0 && !formData.memberId) {
        setFormData((prev) => ({ ...prev, memberId: mem[0].id }));
      }
    } catch {
      showToast('Failed to load training schedule', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    const mem = members.find((m) => m.id === formData.memberId);
    if (!mem) {
      showToast('Please select a client', 'warning');
      return;
    }

    try {
      await scheduleService.addScheduleItem({
        trainerId: 't-1',
        trainerName: 'Marcus Hayes',
        memberId: mem.id,
        memberName: mem.name,
        title: formData.title,
        sessionType: formData.sessionType,
        startTime: formData.startTime,
        endTime: formData.endTime,
        date: formData.date,
        status: 'scheduled',
        notes: formData.notes,
      });
      showToast('Training session booked on calendar!', 'success');
      setIsModalOpen(false);
      loadData();
    } catch {
      showToast('Failed to schedule session', 'error');
    }
  };

  const handleStatusChange = async (id: string, status: 'completed' | 'cancelled') => {
    try {
      await scheduleService.updateScheduleStatus(id, status);
      showToast(`Session marked as ${status}`, 'info');
      loadData();
    } catch {
      showToast('Failed to update status', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Training Schedule & Calendar
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Book 1-on-1 physical coaching slots, form assessments, and checkups.
          </p>
        </div>

        <Button
          variant="brand"
          size="md"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsModalOpen(true)}
        >
          Book 1-on-1 Session
        </Button>
      </div>

      {/* Schedule Items */}
      {schedule.length === 0 ? (
        <EmptyState
          title="No upcoming training sessions"
          description="Book appointments with your athletes to populate the agenda."
          actionLabel="Book Session"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="space-y-3">
          {schedule.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all ${
                item.status === 'completed'
                  ? 'bg-[#111318]/50 border-[#202530] opacity-75'
                  : item.status === 'cancelled'
                  ? 'bg-[#150F11]/60 border-red-500/20 opacity-70'
                  : 'bg-[#111318] border-[#202530] hover:border-[#10E567]/30'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#161920] border border-[#242936] flex flex-col items-center justify-center shrink-0">
                    <span className="text-[10px] uppercase font-bold text-zinc-400">
                      {new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                    <span className="text-base font-black text-white">
                      {new Date(item.date).getDate()}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={item.status}>{item.status}</Badge>
                      <span className="text-xs font-semibold text-zinc-400 capitalize">
                        {item.sessionType.replace('_', ' ')}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white">{item.title}</h4>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Athlete: <span className="text-white font-semibold">{item.memberName}</span> • Time:{' '}
                      <span className="text-[#10E567] font-semibold">{item.startTime} - {item.endTime}</span>
                    </p>

                    {item.notes && (
                      <p className="text-xs text-zinc-400 mt-2 bg-[#161920] px-3 py-1.5 rounded-lg border border-[#242936]">
                        {item.notes}
                      </p>
                    )}
                  </div>
                </div>

                {item.status === 'scheduled' && (
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <Button
                      variant="brand"
                      size="sm"
                      leftIcon={<CheckCircle className="w-3.5 h-3.5" />}
                      onClick={() => handleStatusChange(item.id, 'completed')}
                    >
                      Complete
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<XCircle className="w-3.5 h-3.5 text-red-400" />}
                      onClick={() => handleStatusChange(item.id, 'cancelled')}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Book Session Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule Coaching Session"
        subtitle="Reserve training calendar slot with an athlete."
        maxWidth="md"
      >
        <form onSubmit={handleCreateSession} className="space-y-4">
          <Select
            label="Athlete"
            value={formData.memberId}
            onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
            options={members.map((m) => ({ label: `${m.name} (${m.membershipPlanName})`, value: m.id }))}
          />

          <Input
            label="Session Focus Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Session Type"
              value={formData.sessionType}
              onChange={(e) => setFormData({ ...formData, sessionType: e.target.value as any })}
              options={[
                { label: 'Personal Training', value: 'personal_training' },
                { label: 'Form & Body Assessment', value: 'assessment' },
                { label: 'Nutrition & Macro Consult', value: 'nutrition_consult' },
              ]}
            />
            <Input
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Time"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              placeholder="e.g. 10:00 AM"
              required
            />
            <Input
              label="End Time"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              placeholder="e.g. 11:00 AM"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">
              Session Agenda Notes
            </label>
            <textarea
              rows={3}
              className="w-full rounded-xl bg-[#161920] border border-[#242936] text-white text-sm p-3 focus:outline-none focus:border-[#10E567]"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#202530]">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="brand" type="submit">
              Confirm Booking
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
