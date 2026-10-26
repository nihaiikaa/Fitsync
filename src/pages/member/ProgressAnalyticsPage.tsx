import React, { useState, useEffect } from 'react';
import { progressService } from '../../services/progressService';
import { memberService } from '../../services/memberService';
import { WeightLog, Member } from '../../types';
import { useToast } from '../../context/ToastContext';
import { Card, CardHeader } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { StatCard } from '../../components/common/StatCard';
import { Modal } from '../../components/common/Modal';
import { formatDate } from '../../utils/formatters';
import {
  Scale,
  TrendingDown,
  Plus,
  Flame,
  Activity,
  Award,
  Calendar,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export const ProgressAnalyticsPage: React.FC = () => {
  const [logs, setLogs] = useState<WeightLog[]>([]);
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWeight, setNewWeight] = useState(63.2);
  const [newBodyFat, setNewBodyFat] = useState(20.4);
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);

  const { showToast } = useToast();

  const loadData = async () => {
    try {
      const [l, members] = await Promise.all([
        progressService.getWeightLogs('u-member-1'),
        memberService.getMembers(),
      ]);
      setLogs(l);
      const current = members.find((m) => m.id === 'm-1') || members[0];
      setMember(current);
    } catch {
      showToast('Failed to load fitness progress', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddLog = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await progressService.addWeightLog({
        memberId: 'u-member-1',
        date: logDate,
        weightKg: Number(newWeight),
        bodyFatPercentage: Number(newBodyFat),
      });

      // Also update member's currentWeight
      if (member) {
        await memberService.updateMember(member.id, { currentWeight: Number(newWeight) });
      }

      showToast('Weight log saved!', 'success');
      setIsModalOpen(false);
      loadData();
    } catch {
      showToast('Failed to save weight entry', 'error');
    }
  };

  const volumeDistribution = [
    { muscle: 'Chest', volume: 18 },
    { muscle: 'Back', volume: 22 },
    { muscle: 'Shoulders', volume: 16 },
    { muscle: 'Quads', volume: 24 },
    { muscle: 'Hamstrings', volume: 14 },
    { muscle: 'Arms', volume: 12 },
  ];

  const firstWeight = logs[0]?.weightKg || 67.2;
  const currentWeight = logs[logs.length - 1]?.weightKg || 63.5;
  const targetWeight = member?.targetWeight || 60.0;
  const totalLost = (firstWeight - currentWeight).toFixed(1);
  const toGoal = (currentWeight - targetWeight).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Fitness Analytics & Body Metric Tracking
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Analyze weight curves, estimated body fat, and weekly training volume distribution.
          </p>
        </div>

        <Button
          variant="brand"
          size="md"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsModalOpen(true)}
        >
          Log Today&apos;s Weight
        </Button>
      </div>

      {/* Progress Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Current Weight"
          value={`${currentWeight} kg`}
          change={`-${totalLost} kg since baseline`}
          isPositive={true}
          highlight={true}
          icon={<Scale className="w-5 h-5 text-[#10E567]" />}
          subtitle="Weighed today"
        />
        <StatCard
          title="Target Goal"
          value={`${targetWeight} kg`}
          subtitle={`${toGoal} kg remaining to reach target`}
          icon={<Award className="w-5 h-5 text-amber-400" />}
        />
        <StatCard
          title="Estimated Body Fat"
          value={`${logs[logs.length - 1]?.bodyFatPercentage || 20.6}%`}
          change="-3.6% fat reduction"
          isPositive={true}
          icon={<Activity className="w-5 h-5 text-blue-400" />}
        />
        <StatCard
          title="Consistency Score"
          value="98.2%"
          subtitle="42 check-ins logged"
          icon={<Flame className="w-5 h-5 text-purple-400" />}
        />
      </div>

      {/* Weight History Chart */}
      <Card>
        <CardHeader
          title="Body Weight Progression Curve (kg)"
          subtitle="Bi-weekly weigh-in points showcasing continuous progress"
        />
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={logs} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#202530" vertical={false} />
              <XAxis dataKey="date" stroke="#6B7280" fontSize={11} tickFormatter={(d) => formatDate(d)} />
              <YAxis domain={['dataMin - 1', 'dataMax + 1']} stroke="#6B7280" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#161920', borderColor: '#242936', borderRadius: 12 }}
                itemStyle={{ color: '#10E567', fontSize: 12 }}
                formatter={(val: any) => [`${val} kg`, 'Body Weight']}
              />
              <Line
                type="monotone"
                dataKey="weightKg"
                stroke="#10E567"
                strokeWidth={3}
                dot={{ fill: '#10E567', r: 4, strokeWidth: 2, stroke: '#0A0B0E' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Volume Distribution & Body Fat Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Volume by Muscle Group */}
        <Card>
          <CardHeader
            title="Weekly Muscle Group Volume (Sets)"
            subtitle="Distribution of working sets performed this week"
          />
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volumeDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#202530" vertical={false} />
                <XAxis dataKey="muscle" stroke="#6B7280" fontSize={11} tickLine={false} />
                <YAxis stroke="#6B7280" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#161920', borderColor: '#242936', borderRadius: 12 }}
                  itemStyle={{ color: '#10E567', fontSize: 12 }}
                  formatter={(val: any) => [`${val} sets`, 'Volume']}
                />
                <Bar dataKey="volume" fill="#10E567" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Body Fat Percentage Trend */}
        <Card>
          <CardHeader
            title="Body Fat Percentage (%)"
            subtitle="Skinfold and impedance biometric analysis"
          />
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={logs} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#202530" vertical={false} />
                <XAxis dataKey="date" stroke="#6B7280" fontSize={11} tickFormatter={(d) => formatDate(d)} />
                <YAxis domain={['dataMin - 1', 'dataMax + 1']} stroke="#6B7280" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#161920', borderColor: '#242936', borderRadius: 12 }}
                  itemStyle={{ color: '#60A5FA', fontSize: 12 }}
                  formatter={(val: any) => [`${val}%`, 'Body Fat']}
                />
                <Line
                  type="monotone"
                  dataKey="bodyFatPercentage"
                  stroke="#60A5FA"
                  strokeWidth={2.5}
                  dot={{ fill: '#60A5FA', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Log Weight Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Log Morning Weight"
        subtitle="Record your weigh-in to track progress toward your goal."
        maxWidth="sm"
      >
        <form onSubmit={handleAddLog} className="space-y-4">
          <Input
            label="Date"
            type="date"
            value={logDate}
            onChange={(e) => setLogDate(e.target.value)}
            required
          />

          <Input
            label="Body Weight (kg)"
            type="number"
            step="0.1"
            value={newWeight}
            onChange={(e) => setNewWeight(parseFloat(e.target.value) || 0)}
            required
          />

          <Input
            label="Body Fat % (Optional)"
            type="number"
            step="0.1"
            value={newBodyFat}
            onChange={(e) => setNewBodyFat(parseFloat(e.target.value) || 0)}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#202530]">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="brand" type="submit">
              Save Weigh-in
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
