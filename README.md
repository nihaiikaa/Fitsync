# FitSync — Gym Tracker & Trainer Management System

**FitSync** is an enterprise-grade Gym Tracker & Trainer Management SaaS frontend built with **React 18**, **TypeScript**, **Tailwind CSS**, and **Vite**. It features a modern dark aesthetic with electric lime green accents, touch-optimized mobile responsiveness, interactive workout logging, and an Axios service layer engineered for immediate integration with a **Java Spring Boot & MySQL** backend.

---

## ⚡ Tech Stack

- **Framework**: React 18 + Vite (TypeScript `strict: true`)
- **Styling**: Tailwind CSS (Custom dark theme `#0A0B0E`, `#111318`, `#161920` with Electric Lime `#10E567`)
- **Navigation**: React Router DOM v6
- **Icons**: Lucide React
- **Data Visualizations & Analytics**: Recharts
- **API Service Layer**: Axios with environment-configured base URLs and mock fallback
- **State & Storage**: React Context + LocalStorage persistent state engine

---

## 🚀 Quick Start (Run Locally)

### 1. Prerequisites
Ensure you have Node.js (v18+) and npm installed.

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
The application will launch at `http://localhost:3000` (or `http://localhost:5173`).

### 4. Build for Production
```bash
npm run build
```

---

## 🔐 Demo Credentials & Instant Role Switcher

FitSync includes **1-Click Quick Demo Login** buttons on the Login page and a live **Role Switcher Dropdown** in the top navigation bar.

| Role | Email | Password | Access & Capabilities |
| :--- | :--- | :--- | :--- |
| **Admin / Gym Owner** | `admin@fitsync.com` | `admin123` | Member roster, trainers, plan pricing, revenue analytics, payments, live gym attendance |
| **Certified Trainer** | `trainer@fitsync.com` | `trainer123` | Assigned athletes, workout routine creation, 1-on-1 calendar scheduling, coaching logs |
| **Gym Member** | `member@fitsync.com` | `member123` | Interactive workout logging, rest timers, weigh-in curves, history, trainer sessions |

> **Note**: Demo authentication operates in a self-contained mock engine with persistent localStorage state when a backend is not connected.

---

## 📂 Project Architecture

```
src/
├── components/
│   └── common/
│       ├── Badge.tsx           # Status indicators (active, expired, scheduled, etc.)
│       ├── BottomNav.tsx       # Ergonomic phone bottom navigation (< 768px)
│       ├── Button.tsx          # Accessible buttons (brand, secondary, outline, danger)
│       ├── Card.tsx            # Dark surface containers with subtle borders & glow
│       ├── ConfirmDialog.tsx   # Destruction confirmation modals
│       ├── EmptyState.tsx      # Empty dataset presentation
│       ├── Input.tsx           # Form inputs, textareas, and select components
│       ├── Modal.tsx           # Accessible modal dialogs with backdrop blur
│       ├── Navbar.tsx          # Header with 1-click role switcher, alerts, user menu
│       ├── ResponsiveTable.tsx # Tables that dynamically collapse to cards on mobile
│       ├── Sidebar.tsx         # Collapsible desktop sidebar and mobile sliding drawer
│       └── StatCard.tsx        # KPI metrics with trend badges and icons
├── context/
│   ├── AuthContext.tsx         # User authentication, session persistence, role previews
│   └── ToastContext.tsx        # Toast notification system
├── data/
│   └── mockData.ts             # Realistic dataset for members, trainers, workouts, payments
├── layouts/
│   ├── AuthLayout.tsx          # Focused authentication layout
│   └── DashboardLayout.tsx     # Role-based dashboard shell with responsive navigation
├── pages/
│   ├── LandingPage.tsx         # Public marketing landing page with hero, features & CTA
│   ├── ProfilePage.tsx         # User profile, account settings & Spring Boot endpoint config
│   ├── NotificationsPage.tsx   # Notification center with read/unread filtering
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   └── ForgotPasswordPage.tsx
│   ├── admin/
│   │   ├── AdminDashboard.tsx       # KPIs, revenue charts, member growth, expirations
│   │   ├── MemberManagementPage.tsx # Search, filter, add, edit, assign coach, delete
│   │   ├── TrainerManagementPage.tsx# Trainer credentials, ratings, assigned clients
│   │   ├── MembershipPlansPage.tsx  # Tier pricing, duration, amenities, edit
│   │   ├── PaymentsPage.tsx         # Invoices, transaction records, cash receipts
│   │   └── AttendancePage.tsx       # Live floor occupancy, check-in, check-out
│   ├── trainer/
│   │   ├── TrainerDashboard.tsx     # Roster summary, upcoming sessions, quick plan authoring
│   │   ├── AssignedMembersPage.tsx  # Client goals, weight logs, coaching feedback notes
│   │   ├── WorkoutPlansPage.tsx     # Routine builder (exercises, sets, reps, target weights)
│   │   └── TrainingSchedulePage.tsx # 1-on-1 appointment booking & status updates
│   └── member/
│       ├── MemberDashboard.tsx      # Daily workout preview, weekly completion, coach details
│       ├── WorkoutTrackerPage.tsx   # Real-time workout tracker with rest timer & set logging
│       ├── ProgressAnalyticsPage.tsx# Body weight curve, body fat %, muscle volume distribution
│       └── WorkoutHistoryPage.tsx   # Completed workout archives & caloric burn logs
├── services/
│   ├── api.ts                  # Axios client with fallback engine
│   ├── authService.ts          # Auth API requests
│   ├── memberService.ts        # Member endpoints
│   ├── trainerService.ts       # Trainer endpoints
│   ├── workoutService.ts       # Workout plans & session logs
│   ├── planService.ts          # Membership plan endpoints
│   ├── paymentService.ts       # Billing endpoints
│   ├── attendanceService.ts    # Entrance scan endpoints
│   ├── scheduleService.ts      # Training calendar endpoints
│   └── progressService.ts      # Weight & body composition endpoints
├── types/
│   └── index.ts                # TypeScript interfaces and domain models
└── utils/
    ├── formatters.ts           # Currency, date, and relative time utilities
    └── storage.ts              # LocalStorage read/write wrappers
```

---

## ☕ Connecting to Java Spring Boot Backend

The frontend is built to communicate with standard Spring Boot REST controllers. All API calls are decoupled inside `src/services/`.

### 1. Set Environment Variable
Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### 2. Suggested Spring Boot Controller Endpoints
FitSync will automatically route requests to these endpoints when your backend is active:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Returns JWT and User profile |
| `POST` | `/api/auth/register` | Registers new user |
| `GET / POST` | `/api/members` | Retrieve or create gym members |
| `PUT / DELETE` | `/api/members/{id}` | Update or delete member |
| `GET / POST` | `/api/trainers` | Retrieve or create trainers |
| `GET / POST` | `/api/workout-plans` | Retrieve or create structured workout routines |
| `GET / PUT` | `/api/workouts/today` | Fetch or update active daily workout session |
| `POST` | `/api/workouts/complete`| Finalize workout session and save to history |
| `GET / POST` | `/api/attendance` | Fetch attendance or scan check-in |
| `POST` | `/api/attendance/{id}/check-out` | Log member check-out |
| `GET / POST` | `/api/payments` | Retrieve or record payment transactions |

### 3. Spring Boot CORS Configuration
Ensure your Spring Boot backend allows cross-origin requests from the Vite frontend:

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000", "http://localhost:5173")
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

---

## 📱 Mobile Responsiveness Highlights

- **Ultra-Narrow Screen Support**: Tested down to 320px viewport widths with zero horizontal page overflow.
- **Adaptive Tables**: Tables automatically display as compact cards on smartphones and expand to dense data grids on desktops.
- **Ergonomic Bottom Bar**: Mobile navigation placed at the base of the viewport within thumb reach for iOS and Android phones.
- **Touch-Friendly Controls**: Minimum 44px tap targets for buttons, set completion toggles, and modals.

---

## 📄 License
MIT © FitSync Inc.
