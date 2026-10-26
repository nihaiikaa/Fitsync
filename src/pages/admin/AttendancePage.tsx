import React, { useState, useEffect } from 'react';
import { attendanceService } from '../../services/attendanceService';
import { memberService } from '../../services/memberService';
import { AttendanceRecord, Member } from '../../types';
import { useToast } from '../../context/ToastContext';
import { Card, CardHeader } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input, Select } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { StatCard } from '../../components/common/StatCard';
import { Modal } from '../../components/common/Modal';
import { ResponsiveTable, TableHead, TableRow, TableHeaderCell, TableCell } from '../../components/common/ResponsiveTable';
import { EmptyState } from '../../components/common/EmptyState';
import { formatDate } from '../../utils/formatters';
import {
  CalendarCheck,
  UserCheck,
  Clock,
  Plus,
  Search,
  LogOut,
  Users,
  Activity,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { MOCK_WEEKLY_ATTENDANCE } from '../../data/mockData';

export const AttendancePage: React.FC = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState('');

  const { showToast } = useToast();

  const loadData = async () => {
    try {
      const [att, mem] = await Promise.all([
        attendanceService.getAttendance(),
        memberService.getMembers(),
      ]);
      setRecords(att);
      setMembers(mem);
      if (mem.length > 0 && !selectedMemberId) {
        setSelectedMemberId(mem[0].id);
      }
    } catch {
      showToast('Failed to load attendance logs', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const currentlyInside = records.filter((r) => r.status === 'checked_in');

  const filteredRecords = records.filter((r) =>
    r.memberName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const mem = members.find((m) => m.id === selectedMemberId);
    if (!mem) return;

    try {
      await attendanceService.checkIn(mem.id, mem.name);
      showToast(`Checked in ${mem.name}`, 'success');
      setIsCheckInModalOpen(false);
      loadData();
    } catch {
      showToast('Failed to check in', 'error');
    }
  };

  const handleCheckOut = async (id: string, name: string) => {
    try {
      await attendanceService.checkOut(id);
      showToast(`Checked out ${name}`, 'info');
      loadData();
    } catch {
      showToast('Failed to check out', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Gym Attendance & Access Control
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Monitor real-time floor occupancy, verify entrance timestamps, and track visit duration.
          </p>
        </div>

        <Button
          variant="brand"
          size="md"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsCheckInModalOpen(true)}
        >
          Check In Member
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Currently Inside Floor"
          value={currentlyInside.length}
          subtitle="Live capacity count"
          highlight={true}
          icon={<Activity className="w-5 h-5 text-[#10E567]" />}
        />
        <StatCard
          title="Today Total Visits"
          value={records.filter((r) => r.date === '2026-10-26').length || 18}
          change="+8% vs last Monday"
          isPositive={true}
          icon={<CalendarCheck className="w-5 h-5 text-blue-400" />}
        />
        <StatCard
          title="Average Visit Duration"
          value="74 mins"
          subtitle="Peak traffic: 6 PM - 8 PM"
          icon={<Clock className="w-5 h-5 text-purple-400" />}
        />
      </div>

      {/* Weekly Traffic Heatmap */}
      <Card>
        <CardHeader
          title="Weekly Gym Footfall"
          subtitle="Daily check-in volume throughout the current week"
        />
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MOCK_WEEKLY_ATTENDANCE} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#202530" vertical={false} />
              <XAxis dataKey="day" stroke="#6B7280" fontSize={11} tickLine={false} />
              <YAxis stroke="#6B7280" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#161920', borderColor: '#242936', borderRadius: 12 }}
                itemStyle={{ color: '#10E567', fontSize: 12 }}
                formatter={(val: any) => [`${val} athletes`, 'Attendance']}
              />
              <Bar dataKey="count" fill="#10E567" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Attendance Records */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <CardHeader
            title="Recent Check-ins"
            subtitle="Today's access scans and completed workout sessions"
            className="mb-0"
          />
          <div className="w-full sm:w-72">
            <Input
              placeholder="Search by member name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
        </div>

        {filteredRecords.length === 0 ? (
          <EmptyState
            title="No check-ins found"
            description="No members match your search criteria."
          />
        ) : (
          <ResponsiveTable>
            <TableHead>
              <tr>
                <TableHeaderCell>Member</TableHeaderCell>
                <TableHeaderCell>Date</TableHeaderCell>
                <TableHeaderCell>Check In</TableHeaderCell>
                <TableHeaderCell>Check Out</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell className="text-right">Action</TableHeaderCell>
              </tr>
            </TableHead>
            <tbody>
              {filteredRecords.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-bold text-white">{item.memberName}</TableCell>
                  <TableCell className="text-zinc-400 text-xs">{formatDate(item.date)}</TableCell>
                  <TableCell className="font-mono text-xs text-[#10E567]">{item.checkInTime}</TableCell>
                  <TableCell className="font-mono text-xs text-zinc-400">
                    {item.checkOutTime || '—'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.status === 'checked_in' ? 'active' : 'completed'}>
                      {item.status === 'checked_in' ? 'On Floor' : 'Completed'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {item.status === 'checked_in' ? (
                      <Button
                        variant="secondary"
                        size="sm"
                        leftIcon={<LogOut className="w-3.5 h-3.5 text-amber-400" />}
                        onClick={() => handleCheckOut(item.id, item.memberName)}
                      >
                        Check Out
                      </Button>
                    ) : (
                      <span className="text-xs text-zinc-500">Session Ended</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </ResponsiveTable>
        )}
      </Card>

      {/* Check In Modal */}
      <Modal
        isOpen={isCheckInModalOpen}
        onClose={() => setIsCheckInModalOpen(false)}
        title="Check In Member"
        subtitle="Log an athlete entering the facility."
        maxWidth="sm"
      >
        <form onSubmit={handleCheckIn} className="space-y-4">
          <Select
            label="Select Athlete"
            value={selectedMemberId}
            onChange={(e) => setSelectedMemberId(e.target.value)}
            options={members.map((m) => ({ label: `${m.name} (${m.membershipPlanName})`, value: m.id }))}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#202530]">
            <Button variant="outline" type="button" onClick={() => setIsCheckInModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="brand" type="submit">
              Confirm Check-in
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
