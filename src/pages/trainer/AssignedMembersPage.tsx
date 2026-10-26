import React, { useState, useEffect } from 'react';
import { trainerService } from '../../services/trainerService';
import { Member } from '../../types';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { ResponsiveTable, TableHead, TableRow, TableHeaderCell, TableCell } from '../../components/common/ResponsiveTable';
import { EmptyState } from '../../components/common/EmptyState';
import { formatDate } from '../../utils/formatters';
import {
  Search,
  Dumbbell,
  FileText,
  Phone,
  Mail,
  UserCheck,
  TrendingDown,
  Calendar,
} from 'lucide-react';

export const AssignedMembersPage: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [sessionNote, setSessionNote] = useState('');
  const [loading, setLoading] = useState(true);

  const { showToast } = useToast();

  const loadMembers = async () => {
    try {
      const data = await trainerService.getAssignedMembers('t-1');
      setMembers(data);
    } catch {
      showToast('Failed to load assigned members', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenNotes = (member: Member) => {
    setSelectedMember(member);
    setSessionNote(`Athlete ${member.name} demonstrated solid progressive overload. Form on squat checked.`);
    setNotesModalOpen(true);
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`Coaching feedback saved for ${selectedMember?.name}`, 'success');
    setNotesModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Assigned Athletes & Clients
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Athletes currently enrolled under your personal training supervision.
          </p>
        </div>
      </div>

      {/* Search */}
      <Card className="p-4">
        <Input
          placeholder="Search assigned athlete by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
        />
      </Card>

      {/* Roster Display */}
      {filteredMembers.length === 0 ? (
        <EmptyState
          title="No assigned athletes found"
          description="Athletes assigned to you by admin will appear here."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <Card key={member.id} className="flex flex-col justify-between hover:border-[#10E567]/30 transition-all">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-[#242936]"
                    />
                    <div>
                      <h3 className="font-bold text-white text-base leading-tight">{member.name}</h3>
                      <p className="text-xs text-zinc-400">{member.membershipPlanName}</p>
                    </div>
                  </div>
                  <Badge variant={member.status}>{member.status}</Badge>
                </div>

                {/* Body Metrics Summary */}
                <div className="grid grid-cols-3 gap-2 bg-[#161920] p-3 rounded-xl border border-[#242936] text-center mb-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-500 block">Current</span>
                    <span className="text-sm font-bold text-white">{member.currentWeight} kg</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-500 block">Target</span>
                    <span className="text-sm font-bold text-[#10E567]">{member.targetWeight} kg</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-500 block">Height</span>
                    <span className="text-sm font-bold text-zinc-200">{member.height} cm</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-zinc-400 mb-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{member.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{member.phone}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-[#202530]">
                <Button
                  variant="brand"
                  size="sm"
                  className="flex-1"
                  leftIcon={<FileText className="w-3.5 h-3.5" />}
                  onClick={() => handleOpenNotes(member)}
                >
                  Record Coaching Note
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Record Note Modal */}
      <Modal
        isOpen={notesModalOpen}
        onClose={() => setNotesModalOpen(false)}
        title={`Coaching Session Notes: ${selectedMember?.name}`}
        subtitle="Log athlete form adjustments, dietary feedback, or weight observations."
        maxWidth="md"
      >
        <form onSubmit={handleSaveNote} className="space-y-4">
          <div className="p-3 rounded-xl bg-[#161920] border border-[#242936] text-xs space-y-1">
            <p className="text-zinc-400">
              Target Goal: <span className="text-white font-bold">{selectedMember?.targetWeight} kg</span>
            </p>
            <p className="text-zinc-400">
              Current Weight: <span className="text-white font-bold">{selectedMember?.currentWeight} kg</span>
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">
              Training Session Log & Observations
            </label>
            <textarea
              rows={4}
              className="w-full rounded-xl bg-[#161920] border border-[#242936] text-white text-sm p-3 focus:outline-none focus:border-[#10E567]"
              value={sessionNote}
              onChange={(e) => setSessionNote(e.target.value)}
              placeholder="E.g., Client struggled with RDL balance on last set. Advised lower dumbbell load next week..."
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#202530]">
            <Button variant="outline" type="button" onClick={() => setNotesModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="brand" type="submit">
              Save Coaching Log
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
