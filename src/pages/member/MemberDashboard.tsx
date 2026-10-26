import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../../components/common/StatCard';
import { Card, CardHeader } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { workoutService } from '../../services/workoutService';
import { progressService } from '../../services/progressService';
import { memberService } from '../../services/memberService';
import { WorkoutSession, WeightLog, Member } from '../../types';
import { formatDate } from '../../utils/formatters';
import {
  Flame,
  Scale,
  Calendar,
  CheckCircle2,
  Clock,
  Dumbbell,
  ArrowRight,
  TrendingDown,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export const MemberDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [todayWorkout, setTodayWorkout] = useState<WorkoutSession | null>(null);
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([]);
  const [memberProfile, setMemberProfile] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [w, logs, members] = await Promise.all([
          workoutService.getTodayWorkout(),
          progressService.getWeightLogs('u-member-1'),
          memberService.getMembers(),
        ]);
        setTodayWorkout(w);
        setWeightLogs(logs);
        const current = members.find((m) => m.id === 'm-1') || members[0];
        setMemberProfile(current);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const totalSets = todayWorkout?.exercises.reduce((sum, ex) => sum + ex.targetSets, 0) || 15;
  const completedSets = todayWorkout?.exercises.reduce(
    (sum, ex) => sum + ex.completedSets.filter((s) => s.completed).length,
    0
  ) || 9;
  const progressPercent = Math.round((completedSets / (totalSets || 1)) * 100);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-[#121E16] via-[#111318] to-[#161922] border border-[#202530] p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-[#10E567] uppercase tracking-wider">
              Member Fitness Hub
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-xs text-zinc-400">Day 4 of Split Cycle</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Ready to train, {user?.name?.split(' ')[0] || 'Sarah'}?
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Today is focused on Upper Body Hypertrophy & Delts with Coach Marcus Hayes.
          </p>
        </div>

        <Button
          variant="brand"
          size="md"
          leftIcon={<Flame className="w-5 h-5" />}
          onClick={() => navigate('/member/workout-tracker')}
        >
          Resume Today&apos;s Workout
        </Button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Current Weight"
          value={`${memberProfile?.currentWeight || 63.5} kg`}
          change="-3.7 kg total loss"
          isPositive={true}
          icon={<Scale className="w-5 h-5 text-[#10E567]" />}
          subtitle={`Goal: ${memberProfile?.targetWeight || 60} kg`}
        />
        <StatCard
          title="Weekly Completion"
          value="4 / 5 Days"
          change="80% Target Met"
          isPositive={true}
          icon={<CheckCircle2 className="w-5 h-5 text-blue-400" />}
          subtitle="1 day remaining"
        />
        <StatCard
          title="Gym Check-ins"
          value={`${memberProfile?.attendanceCount || 42} Visits`}
          change="Top 10% Consistency"
          isPositive={true}
          icon={<Calendar className="w-5 h-5 text-purple-400" />}
          subtitle="Streak: 12 days"
        />
        <StatCard
          title="Membership Tier"
          value={memberProfile?.membershipPlanName || 'Pro'}
          subtitle="Expires Dec 31, 2026"
          highlight={true}
          icon={<Sparkles className="w-5 h-5 text-[#10E567]" />}
        />
      </div>

      {/* Today's Workout Focus & Upcoming Session */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Workout Card (2 cols) */}
        <div className="lg:col-span-2">
          <Card className="h-full flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-xs font-semibold text-[#10E567] uppercase tracking-wider block mb-1">
                    Scheduled Routine
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    {todayWorkout?.title || 'Upper Body Hypertrophy & Delts'}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    {todayWorkout?.notes || 'Focus on controlled eccentric contractions.'}
                  </p>
                </div>
                <Badge variant="in_progress">In Progress</Badge>
              </div>

              {/* Progress Bar */}
              <div className="bg-[#161920] p-4 rounded-xl border border-[#242936] mb-6">
                <div className="flex items-center justify-between text-xs font-bold mb-2">
                  <span className="text-zinc-300">Workout Progress:</span>
                  <span className="text-[#10E567]">{completedSets} of {totalSets} Sets Completed ({progressPercent}%)</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-[#111318] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-[#10E567] rounded-full transition-all duration-500 shadow-lime-sm"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Exercise Preview List */}
              <div className="space-y-2.5">
                {todayWorkout?.exercises.map((ex, i) => (
                  <div
                    key={ex.id || i}
                    className="p-3 rounded-xl bg-[#161920] border border-[#242936] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                        ex.isCompleted ? 'bg-[#10E567]/20 text-[#10E567]' : 'bg-white/5 text-zinc-400'
                      }`}>
                        {i + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-xs sm:text-sm">{ex.exerciseName}</h4>
                        <p className="text-[11px] text-zinc-400">{ex.muscleGroup} • {ex.targetWeightKg} kg</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-300 font-semibold">
                        {ex.completedSets.filter((s) => s.completed).length} / {ex.targetSets} sets
                      </span>
                      {ex.isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-[#10E567]" />
                      ) : (
                        <Clock className="w-4 h-4 text-zinc-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-[#202530] flex items-center justify-between">
              <span className="text-xs text-zinc-400 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#10E567]" /> Est. Duration: 52 mins
              </span>
              <Button
                variant="brand"
                size="md"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={() => navigate('/member/workout-tracker')}
              >
                Log Sets Now
              </Button>
            </div>
          </Card>
        </div>

        {/* Assigned Trainer & Weight Preview (1 col) */}
        <div className="space-y-6">
          {/* Trainer Card */}
          <Card>
            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block mb-2">
              Assigned Coach
            </span>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&q=80&w=200"
                alt="Trainer"
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-[#10E567]/30"
              />
              <div>
                <h4 className="font-bold text-white text-base">Marcus Hayes</h4>
                <p className="text-xs text-[#10E567] font-medium">Strength & Conditioning</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#161920] border border-[#242936] text-xs space-y-1 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Next 1-on-1:</span>
                <span className="text-white font-semibold">Today, 10:00 AM</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Focus:</span>
                <span className="text-zinc-300">Shoulder Biomechanics</span>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => navigate('/notifications')}
            >
              Session Reminders
            </Button>
          </Card>

          {/* Quick Weight Progress */}
          <Card>
            <CardHeader
              title="Weight Trend"
              subtitle="Progressive trajectory to 60 kg"
              className="mb-2"
              action={
                <Link
                  to="/member/progress"
                  className="text-xs text-[#10E567] hover:underline"
                >
                  Analytics &rarr;
                </Link>
              }
            />
            <div className="h-36 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weightLogs} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#202530" vertical={false} />
                  <XAxis dataKey="date" stroke="#6B7280" fontSize={10} tickFormatter={(d) => d.split('-').slice(1).join('/')} />
                  <YAxis domain={['dataMin - 1', 'dataMax + 1']} stroke="#6B7280" fontSize={10} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#161920', borderColor: '#242936', borderRadius: 10 }}
                    itemStyle={{ color: '#10E567', fontSize: 11 }}
                    formatter={(val: any) => [`${val} kg`, 'Weight']}
                  />
                  <Line type="monotone" dataKey="weightKg" stroke="#10E567" strokeWidth={2.5} dot={{ fill: '#10E567', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
