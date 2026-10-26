import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../../components/common/StatCard';
import { Card, CardHeader } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ResponsiveTable, TableHead, TableRow, TableHeaderCell, TableCell } from '../../components/common/ResponsiveTable';
import { trainerService } from '../../services/trainerService';
import { workoutService } from '../../services/workoutService';
import { scheduleService } from '../../services/scheduleService';
import { Member, WorkoutPlan, TrainingScheduleItem } from '../../types';
import { formatDate } from '../../utils/formatters';
import {
  Users,
  CalendarCheck,
  Dumbbell,
  Clock,
  Plus,
  ArrowUpRight,
  TrendingDown,
  Sparkles,
} from 'lucide-react';

export const TrainerDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [assignedMembers, setAssignedMembers] = useState<Member[]>([]);
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [schedule, setSchedule] = useState<TrainingScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [mem, pl, sc] = await Promise.all([
          trainerService.getAssignedMembers('t-1'),
          workoutService.getWorkoutPlans(),
          scheduleService.getSchedule(),
        ]);
        setAssignedMembers(mem);
        setPlans(pl);
        setSchedule(sc);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const todaySessions = schedule.filter((s) => s.status === 'scheduled');

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-[#121A24] via-[#111318] to-[#121E16] border border-[#202530] p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
              Trainer Command Center
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-xs text-zinc-400">Athletic Performance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Coach {user?.name || 'Marcus Hayes'}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            You have {todaySessions.length} active personal training appointments lined up today.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="brand"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => navigate('/trainer/workout-plans')}
          >
            Create Workout Plan
          </Button>
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<CalendarCheck className="w-4 h-4" />}
            onClick={() => navigate('/trainer/schedule')}
          >
            Book Session
          </Button>
        </div>
      </div>

      {/* Trainer Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Assigned Athletes"
          value={assignedMembers.length}
          subtitle="Active roster clients"
          highlight={true}
          icon={<Users className="w-5 h-5 text-[#10E567]" />}
        />
        <StatCard
          title="Today Sessions"
          value={todaySessions.length}
          subtitle="Next: 10:00 AM"
          icon={<Clock className="w-5 h-5 text-blue-400" />}
        />
        <StatCard
          title="Workout Templates"
          value={plans.length}
          subtitle="PPL, Hypertrophy, HIIT"
          icon={<Dumbbell className="w-5 h-5 text-purple-400" />}
        />
        <StatCard
          title="Client Rating"
          value="4.9 / 5.0"
          change="Top 5% coach"
          isPositive={true}
          icon={<Sparkles className="w-5 h-5 text-amber-400" />}
        />
      </div>

      {/* Today's Schedule & Quick Plan Access */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scheduled Appointments (2 cols) */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader
              title="Today's Training Schedule"
              subtitle="Confirmed 1-on-1 client appointments"
              action={
                <Link
                  to="/trainer/schedule"
                  className="text-xs font-semibold text-[#10E567] hover:underline flex items-center gap-1"
                >
                  Full Agenda <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              }
            />

            <div className="space-y-3">
              {todaySessions.map((session) => (
                <div
                  key={session.id}
                  className="p-4 rounded-xl bg-[#161920] border border-[#242936] hover:border-[#10E567]/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex flex-col items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-blue-400 leading-none">
                        {session.startTime.split(' ')[0]}
                      </span>
                      <span className="text-[10px] text-zinc-400">
                        {session.startTime.split(' ')[1]}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white">{session.title}</h4>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Client: <span className="text-white font-semibold">{session.memberName}</span> • {session.sessionType.replace('_', ' ')}
                      </p>
                      {session.notes && (
                        <p className="text-[11px] text-zinc-500 mt-1 italic">
                          &ldquo;{session.notes}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <Badge variant="scheduled">Scheduled</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Workout Plan Quick Actions (1 col) */}
        <div>
          <Card className="h-full flex flex-col justify-between">
            <div>
              <CardHeader
                title="Active Workout Routines"
                subtitle="Assigned to your athletes"
              />

              <div className="space-y-3 mt-2">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className="p-3 rounded-xl bg-[#161920] border border-[#242936] hover:border-[#10E567]/30 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-bold text-white">{plan.title}</h5>
                      <span className="text-[10px] font-semibold text-[#10E567] bg-[#10E567]/10 px-2 py-0.5 rounded-full capitalize">
                        {plan.targetLevel}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-1">
                      {plan.exercises.length} Exercises • {plan.durationWeeks} Weeks
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full mt-4"
              onClick={() => navigate('/trainer/workout-plans')}
            >
              Manage All Routines
            </Button>
          </Card>
        </div>
      </div>

      {/* Assigned Member Summaries */}
      <Card>
        <CardHeader
          title="Assigned Athlete Progress"
          subtitle="Weight changes and consistency tracking for your roster"
          action={
            <Link
              to="/trainer/members"
              className="text-xs font-semibold text-[#10E567] hover:underline flex items-center gap-1"
            >
              Client Directory <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          }
        />

        <ResponsiveTable>
          <TableHead>
            <tr>
              <TableHeaderCell>Athlete</TableHeaderCell>
              <TableHeaderCell>Current Weight</TableHeaderCell>
              <TableHeaderCell>Target Goal</TableHeaderCell>
              <TableHeaderCell>Check-in Consistency</TableHeaderCell>
              <TableHeaderCell>Membership Tier</TableHeaderCell>
              <TableHeaderCell className="text-right">Action</TableHeaderCell>
            </tr>
          </TableHead>
          <tbody>
            {assignedMembers.map((m) => (
              <TableRow key={m.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={m.avatar}
                      alt={m.name}
                      className="w-9 h-9 rounded-xl object-cover ring-1 ring-[#202530]"
                    />
                    <div>
                      <p className="font-bold text-white text-sm">{m.name}</p>
                      <p className="text-xs text-zinc-400">{m.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-bold text-white">{m.currentWeight} kg</TableCell>
                <TableCell className="text-zinc-400 text-xs font-semibold">{m.targetWeight} kg</TableCell>
                <TableCell>
                  <span className="text-xs font-bold text-[#10E567] bg-[#10E567]/10 px-2.5 py-1 rounded-full">
                    {m.attendanceCount} Sessions Logged
                  </span>
                </TableCell>
                <TableCell className="text-xs text-zinc-300">{m.membershipPlanName}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate('/trainer/workout-plans')}
                  >
                    Assign Routine
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </ResponsiveTable>
      </Card>
    </div>
  );
};
