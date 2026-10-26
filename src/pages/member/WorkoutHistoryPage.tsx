import React, { useState, useEffect } from 'react';
import { workoutService } from '../../services/workoutService';
import { Card, CardHeader } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { formatDate } from '../../utils/formatters';
import {
  History,
  Clock,
  Flame,
  Star,
  Calendar,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';

export const WorkoutHistoryPage: React.FC = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await workoutService.getWorkoutHistory();
        setHistory(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Workout History & Logbook
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Review past training sessions, total caloric burn, duration, and exercise completions.
        </p>
      </div>

      {/* History Items */}
      <div className="space-y-3">
        {history.map((item) => (
          <Card
            key={item.id}
            className="hover:border-[#10E567]/30 transition-all p-4 sm:p-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#161920] border border-[#242936] flex flex-col items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-[#10E567]" />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-zinc-400">
                      {formatDate(item.date)}
                    </span>
                    <span className="text-zinc-600">•</span>
                    <Badge variant="completed">Completed</Badge>
                  </div>

                  <h3 className="text-base font-bold text-white">{item.title}</h3>

                  <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-blue-400" />
                      {item.duration}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-amber-400" />
                      {item.calories} kcal
                    </span>
                    <span className="flex items-center gap-1 text-amber-400">
                      {Array.from({ length: item.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <span className="text-xs font-semibold text-[#10E567] bg-[#10E567]/10 px-3 py-1.5 rounded-xl border border-[#10E567]/20 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
