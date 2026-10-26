export type UserRole = 'admin' | 'trainer' | 'member';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  joinedDate: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  membershipPlanId: string;
  membershipPlanName: string;
  startDate: string;
  expiryDate: string;
  status: 'active' | 'expired' | 'pending';
  trainerId?: string;
  trainerName?: string;
  currentWeight: number; // in kg
  targetWeight: number; // in kg
  height: number; // in cm
  emergencyContact: string;
  attendanceCount: number;
}

export interface Trainer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  specialty: string;
  experienceYears: number;
  assignedMemberCount: number;
  rating: number;
  bio: string;
  status: 'active' | 'inactive';
}

export interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  durationMonths: number;
  features: string[];
  popular?: boolean;
  description: string;
  activeMembersCount: number;
}

export interface PaymentRecord {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  method: 'card' | 'upi' | 'cash' | 'bank_transfer';
  invoiceNumber: string;
  planName: string;
}

export interface AttendanceRecord {
  id: string;
  memberId: string;
  memberName: string;
  checkInTime: string;
  checkOutTime?: string;
  date: string;
  status: 'checked_in' | 'completed';
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  equipment: string;
  sets: number;
  reps: number;
  targetWeightKg: number;
  restSeconds: number;
  notes?: string;
}

export interface ExerciseSetLog {
  setNumber: number;
  reps: number;
  weightKg: number;
  completed: boolean;
}

export interface WorkoutExerciseLog {
  id: string;
  exerciseId: string;
  exerciseName: string;
  muscleGroup: string;
  targetSets: number;
  targetReps: number;
  targetWeightKg: number;
  completedSets: ExerciseSetLog[];
  isCompleted: boolean;
}

export interface WorkoutPlan {
  id: string;
  title: string;
  description: string;
  trainerId: string;
  trainerName: string;
  targetLevel: 'beginner' | 'intermediate' | 'advanced';
  durationWeeks: number;
  daysPerWeek: number;
  exercises: Exercise[];
}

export interface WorkoutSession {
  id: string;
  memberId: string;
  workoutPlanId?: string;
  title: string;
  date: string;
  durationMinutes: number;
  caloriesBurned: number;
  exercises: WorkoutExerciseLog[];
  status: 'completed' | 'in_progress' | 'scheduled';
  notes?: string;
}

export interface TrainingScheduleItem {
  id: string;
  trainerId: string;
  trainerName: string;
  memberId: string;
  memberName: string;
  title: string;
  sessionType: 'personal_training' | 'assessment' | 'nutrition_consult';
  startTime: string;
  endTime: string;
  date: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

export interface WeightLog {
  id: string;
  memberId: string;
  date: string;
  weightKg: number;
  bodyFatPercentage?: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'alert';
  link?: string;
}
