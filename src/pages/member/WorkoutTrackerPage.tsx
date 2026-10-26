import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { workoutService } from '../../services/workoutService';
import { WorkoutSession, WorkoutExerciseLog, ExerciseSetLog } from '../../types';
import { useToast } from '../../context/ToastContext';
import { Card, CardHeader } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import {
  Flame,
  Check,
  CheckCircle2,
  Clock,
  RotateCcw,
  Play,
  Pause,
  Plus,
  Trophy,
  Dumbbell,
  Sparkles,
} from 'lucide-react';

export const WorkoutTrackerPage: React.FC = () => {
  const [session, setSession] = useState<WorkoutSession | null>(null);
  const [loading, setLoading] = useState(true);

  // Rest Timer State
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [timerInitial, setTimerInitial] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Completion modal
  const [completionModalOpen, setCompletionModalOpen] = useState(false);

  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadSession = async () => {
      try {
        const data = await workoutService.getTodayWorkout();
        setSession(data);
      } catch {
        showToast('Failed to load workout session', 'error');
      } finally {
        setLoading(false);
      }
    };
    loadSession();
  }, []);

  // Timer Tick
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      showToast('Rest timer finished! Time for the next set.', 'success', 'Rest Complete');
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const handleStartTimer = (seconds: number) => {
    setTimerInitial(seconds);
    setTimerSeconds(seconds);
    setIsTimerRunning(true);
  };

  const handleToggleSet = (exerciseIndex: number, setIndex: number) => {
    if (!session) return;
    const updatedExercises = [...session.exercises];
    const exercise = { ...updatedExercises[exerciseIndex] };
    const sets = [...exercise.completedSets];

    const currentCompleted = sets[setIndex].completed;
    sets[setIndex] = { ...sets[setIndex], completed: !currentCompleted };
    exercise.completedSets = sets;

    // Check if all sets for this exercise are completed
    exercise.isCompleted = sets.every((s) => s.completed);
    updatedExercises[exerciseIndex] = exercise;

    const updatedSession: WorkoutSession = {
      ...session,
      exercises: updatedExercises,
    };

    setSession(updatedSession);
    workoutService.saveTodayWorkout(updatedSession);

    // If just marked completed, trigger rest timer
    if (!currentCompleted) {
      handleStartTimer(60);
      showToast(`Set #${setIndex + 1} logged! 60s rest started.`, 'success');
    }
  };

  const handleUpdateSetValue = (
    exerciseIndex: number,
    setIndex: number,
    field: 'reps' | 'weightKg',
    value: number
  ) => {
    if (!session) return;
    const updatedExercises = [...session.exercises];
    const exercise = { ...updatedExercises[exerciseIndex] };
    const sets = [...exercise.completedSets];

    sets[setIndex] = { ...sets[setIndex], [field]: value };
    exercise.completedSets = sets;
    updatedExercises[exerciseIndex] = exercise;

    const updatedSession: WorkoutSession = {
      ...session,
      exercises: updatedExercises,
    };

    setSession(updatedSession);
    workoutService.saveTodayWorkout(updatedSession);
  };

  const handleAddSet = (exerciseIndex: number) => {
    if (!session) return;
    const updatedExercises = [...session.exercises];
    const exercise = { ...updatedExercises[exerciseIndex] };
    const sets = [...exercise.completedSets];

    const lastSet = sets[sets.length - 1] || { reps: 10, weightKg: 50 };
    sets.push({
      setNumber: sets.length + 1,
      reps: lastSet.reps,
      weightKg: lastSet.weightKg,
      completed: false,
    });

    exercise.completedSets = sets;
    exercise.targetSets = sets.length;
    exercise.isCompleted = false;
    updatedExercises[exerciseIndex] = exercise;

    const updatedSession: WorkoutSession = {
      ...session,
      exercises: updatedExercises,
    };

    setSession(updatedSession);
    workoutService.saveTodayWorkout(updatedSession);
  };

  const handleFinishWorkout = async () => {
    if (!session) return;
    try {
      await workoutService.completeWorkout(session);
      setCompletionModalOpen(true);
    } catch {
      showToast('Failed to save workout', 'error');
    }
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <Dumbbell className="w-8 h-8 text-[#10E567] animate-bounce mx-auto mb-2" />
          <p className="text-zinc-400 text-sm">Loading daily workout tracker...</p>
        </div>
      </div>
    );
  }

  const allCompleted = session.exercises.every((ex) => ex.isCompleted);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-[#10E567] uppercase tracking-wider">
              Live Session Logging
            </span>
            <span className="text-zinc-600">•</span>
            <Badge variant="in_progress">Active Session</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {session.title}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Target: 4-5 sets per movement. Record reps and barbell / dumbbell weights accurately.
          </p>
        </div>

        <Button
          variant="brand"
          size="lg"
          leftIcon={<CheckCircle2 className="w-5 h-5" />}
          onClick={handleFinishWorkout}
        >
          Finish Workout & Save
        </Button>
      </div>

      {/* Interactive Rest Timer Floating Bar */}
      <div className="sticky top-20 z-20 bg-[#161920]/95 backdrop-blur-md border border-[#242936] rounded-2xl p-4 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#10E567]/15 border border-[#10E567]/30 flex items-center justify-center text-[#10E567]">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider">
              Rest Interval Timer
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white font-mono">
                {Math.floor(timerSeconds / 60)}:
                {(timerSeconds % 60).toString().padStart(2, '0')}
              </span>
              <span className="text-xs text-zinc-400">
                {isTimerRunning ? 'Resting...' : 'Paused'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {[30, 60, 90].map((sec) => (
            <button
              key={sec}
              onClick={() => handleStartTimer(sec)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                timerInitial === sec && isTimerRunning
                  ? 'bg-[#10E567] text-black shadow-lime-sm'
                  : 'bg-[#111318] text-zinc-300 hover:bg-white/5 border border-[#242936]'
              }`}
            >
              {sec}s
            </button>
          ))}

          <button
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className="p-2 rounded-xl bg-[#1D212B] hover:bg-[#252A37] text-white border border-[#2B3140] transition-colors"
          >
            {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={() => {
              setIsTimerRunning(false);
              setTimerSeconds(timerInitial);
            }}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
            title="Reset Timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Exercise Logs Grid */}
      <div className="space-y-6">
        {session.exercises.map((ex, exIndex) => (
          <Card key={ex.id || exIndex} className={ex.isCompleted ? 'border-[#10E567]/40 shadow-lime-sm' : ''}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#10E567] bg-[#10E567]/10 px-2 py-0.5 rounded-md">
                    Exercise #{exIndex + 1}
                  </span>
                  <span className="text-xs text-zinc-400">{ex.muscleGroup}</span>
                </div>
                <h3 className="text-lg font-extrabold text-white mt-1">{ex.exerciseName}</h3>
                <p className="text-xs text-zinc-400">
                  Target: {ex.targetSets} sets × {ex.targetReps} reps @ {ex.targetWeightKg} kg
                </p>
              </div>

              {ex.isCompleted ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10E567]/15 border border-[#10E567]/30 text-xs font-bold text-[#10E567]">
                  <CheckCircle2 className="w-4 h-4" /> Movement Completed
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                  onClick={() => handleAddSet(exIndex)}
                >
                  Add Set
                </Button>
              )}
            </div>

            {/* Set Table */}
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#202530] text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                    <th className="py-2 px-3">Set</th>
                    <th className="py-2 px-3">Previous / Target</th>
                    <th className="py-2 px-3">Weight (kg)</th>
                    <th className="py-2 px-3">Reps Logged</th>
                    <th className="py-2 px-3 text-center">Complete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1D212B]">
                  {ex.completedSets.map((s, sIndex) => (
                    <tr
                      key={sIndex}
                      className={`transition-colors ${
                        s.completed ? 'bg-[#10E567]/5' : 'hover:bg-white/5'
                      }`}
                    >
                      <td className="py-3 px-3 font-bold text-white">#{s.setNumber}</td>
                      <td className="py-3 px-3 text-zinc-400">
                        {ex.targetWeightKg} kg × {ex.targetReps}
                      </td>
                      <td className="py-3 px-3">
                        <input
                          type="number"
                          step="0.5"
                          value={s.weightKg}
                          onChange={(e) =>
                            handleUpdateSetValue(
                              exIndex,
                              sIndex,
                              'weightKg',
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-20 rounded-lg bg-[#161920] border border-[#262B37] text-white font-bold text-xs px-2.5 py-1.5 focus:border-[#10E567] focus:outline-none"
                        />
                      </td>
                      <td className="py-3 px-3">
                        <input
                          type="number"
                          value={s.reps}
                          onChange={(e) =>
                            handleUpdateSetValue(
                              exIndex,
                              sIndex,
                              'reps',
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="w-16 rounded-lg bg-[#161920] border border-[#262B37] text-white font-bold text-xs px-2.5 py-1.5 focus:border-[#10E567] focus:outline-none"
                        />
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleSet(exIndex, sIndex)}
                          className={`w-8 h-8 rounded-xl inline-flex items-center justify-center transition-all ${
                            s.completed
                              ? 'bg-[#10E567] text-black shadow-lime-sm scale-105'
                              : 'bg-[#161920] border border-[#2B3140] text-zinc-500 hover:text-white hover:border-[#10E567]'
                          }`}
                        >
                          <Check className="w-4 h-4 stroke-[3]" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ))}
      </div>

      {/* Completion Modal */}
      <Modal
        isOpen={completionModalOpen}
        onClose={() => {
          setCompletionModalOpen(false);
          navigate('/member/history');
        }}
        title="Workout Conquered! 🏆"
        subtitle="Outstanding intensity and discipline."
        maxWidth="sm"
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 rounded-3xl bg-[#10E567]/15 border border-[#10E567]/30 flex items-center justify-center text-[#10E567] mx-auto mb-4 shadow-lime-md">
            <Trophy className="w-8 h-8" />
          </div>

          <h3 className="text-xl font-black text-white mb-1">Session Complete</h3>
          <p className="text-xs text-zinc-400 mb-6">
            Your progressive overload metrics have been archived to your training history.
          </p>

          <div className="grid grid-cols-2 gap-3 bg-[#161920] p-4 rounded-xl border border-[#242936] text-center mb-6">
            <div>
              <span className="text-[10px] uppercase font-bold text-zinc-500 block">Duration</span>
              <span className="text-base font-bold text-white">52 Mins</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-zinc-500 block">Est. Burn</span>
              <span className="text-base font-bold text-[#10E567]">430 kcal</span>
            </div>
          </div>

          <Button
            variant="brand"
            className="w-full"
            onClick={() => {
              setCompletionModalOpen(false);
              navigate('/member/history');
            }}
          >
            View Workout History &rarr;
          </Button>
        </div>
      </Modal>
    </div>
  );
};
