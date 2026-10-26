import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Layouts
import { DashboardLayout } from './layouts/DashboardLayout';
import { AuthLayout } from './layouts/AuthLayout';

// Public Pages
import { LandingPage } from './pages/LandingPage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { MemberManagementPage } from './pages/admin/MemberManagementPage';
import { TrainerManagementPage } from './pages/admin/TrainerManagementPage';
import { MembershipPlansPage } from './pages/admin/MembershipPlansPage';
import { PaymentsPage } from './pages/admin/PaymentsPage';
import { AttendancePage } from './pages/admin/AttendancePage';

// Trainer Pages
import { TrainerDashboard } from './pages/trainer/TrainerDashboard';
import { AssignedMembersPage } from './pages/trainer/AssignedMembersPage';
import { WorkoutPlansPage } from './pages/trainer/WorkoutPlansPage';
import { TrainingSchedulePage } from './pages/trainer/TrainingSchedulePage';

// Member Pages
import { MemberDashboard } from './pages/member/MemberDashboard';
import { WorkoutTrackerPage } from './pages/member/WorkoutTrackerPage';
import { ProgressAnalyticsPage } from './pages/member/ProgressAnalyticsPage';
import { WorkoutHistoryPage } from './pages/member/WorkoutHistoryPage';

// Common Pages
import { ProfilePage } from './pages/ProfilePage';
import { NotificationsPage } from './pages/NotificationsPage';

export const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            </Route>

            {/* Main Dashboard Layout (Admin, Trainer, Member) */}
            <Route element={<DashboardLayout />}>
              {/* Admin Portal */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/members" element={<MemberManagementPage />} />
              <Route path="/admin/trainers" element={<TrainerManagementPage />} />
              <Route path="/admin/plans" element={<MembershipPlansPage />} />
              <Route path="/admin/payments" element={<PaymentsPage />} />
              <Route path="/admin/attendance" element={<AttendancePage />} />

              {/* Trainer Portal */}
              <Route path="/trainer" element={<TrainerDashboard />} />
              <Route path="/trainer/members" element={<AssignedMembersPage />} />
              <Route path="/trainer/workout-plans" element={<WorkoutPlansPage />} />
              <Route path="/trainer/schedule" element={<TrainingSchedulePage />} />

              {/* Gym Member Portal */}
              <Route path="/member" element={<MemberDashboard />} />
              <Route path="/member/workout-tracker" element={<WorkoutTrackerPage />} />
              <Route path="/member/progress" element={<ProgressAnalyticsPage />} />
              <Route path="/member/history" element={<WorkoutHistoryPage />} />

              {/* Shared Profile & Notifications */}
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
