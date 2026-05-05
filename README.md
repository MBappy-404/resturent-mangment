# EduManage — School Management System

A comprehensive, production-ready School Management System tailored for Bangladeshi educational institutions. Built with React, TypeScript, Tailwind CSS, and shadcn/ui.

## Features

### Core Modules
- **Dashboard** — Real-time statistics, attendance charts, fee collection, notice board, today's schedule
- **Student Management** — Student profiles, class/section assignment, guardian info, blood group, fee tracking
- **Teacher Management** — Teacher profiles, department, designation, salary, status tracking
- **Attendance** — Daily attendance marking by class/section, reports and charts
- **Subjects** — Subject management with class-wise assignment
- **Exams** — Exam schedule, result entry, grade sheet generation
- **Fees** — Monthly fee collection, due tracking, payment history
- **Library** — Book catalog, issue/return tracking
- **Accounts** — Income/expense tracking, financial reports

### New Modules (Enhanced)

#### Class Routine Management
- Visual timetable grid with day/period layout
- Color-coded subjects for easy identification
- Add, edit, delete routine entries per class/section
- Filter by class, section, and specific day
- Tiffin and lunch break indicators
- Export routine as CSV
- 8 periods per day with break slots

#### School Staff Management
- Complete staff directory (teaching + non-teaching)
- 14 role types: Head Teacher, Assistant Teacher, Librarian, Lab Assistant, Accountant, Guard, etc.
- Staff categories: Teaching, Administrative, Support
- Detailed profiles with NID, qualifications, responsibilities
- Salary tracking and monthly salary overview
- Status management: Active, Inactive, On Leave
- Filter by category, department, status
- CSV export functionality

#### School Administration Management
- **Directors**: Chairman, Vice Chairman, Head Teacher profiles
- **Governing Body**: President, Secretary, Treasurer, Members
  - Parent Representative, Teacher Representative, Community Member
  - Education Expert, Infrastructure Committee
- **Committees**: Exam Committee, Discipline Committee
- Expandable profile cards with bio, qualifications, achievements
- Appointment date and tenure tracking
- Responsibilities listing per member
- Tab-based navigation between Director/Governing Body/Committee views

### Additional Modules
- **ID Cards** — Digital ID card generation
- **Guardian Portal** — Guardian profiles and contact info
- **Diary** — Daily diary entries
- **Notices** — School notice board with priority levels
- **SMS** — SMS notification system
- **Transport** — School transport management
- **Certificates** — Certificate generation
- **Calendar** — Academic calendar
- **Alumni** — Alumni tracking
- **Medical** — Student health records
- **Scholarship** — Scholarship management
- **Hostel** — Hostel management

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 18 + TypeScript |
| **Build Tool** | Vite |
| **Styling** | Tailwind CSS 3 |
| **UI Components** | shadcn/ui (Radix UI) |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Forms** | React Hook Form + Zod |
| **Routing** | React Router DOM v6 |
| **State** | TanStack Query |

## Bangladesh Context

- Bangladeshi school class structure (Play, Nursery, KG, Class 1-10)
- Bengali language labels throughout (বাংলা)
- Bangladeshi names and addresses in demo data
- Currency in BDT (৳)
- School week: Sunday-Thursday + Saturday
- Period structure matching BD school timing (8:00 AM - 2:20 PM)
- Governing body structure per BD education regulations
- NID-based staff identification

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/MBappy-404/resturent-mangment.git
cd resturent-mangment

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Open in browser
- http://localhost:5173

## Project Structure

```
src/
├── components/
│   ├── dashboard/        # Dashboard widgets (charts, stats, schedule)
│   ├── layout/           # DashboardLayout, Sidebar, Header, MobileNav
│   └── ui/               # shadcn/ui components (40+ components)
├── contexts/             # ThemeContext
├── data/                 # Demo data
│   ├── demoData.ts       # Students, teachers, notices, stats
│   ├── routineData.ts    # Class routine periods and entries
│   ├── staffData.ts      # Staff members and roles
│   └── administrationData.ts  # Directors, governing body, committees
├── hooks/                # Custom hooks
├── pages/                # 25 page components
│   ├── Dashboard.tsx
│   ├── Students.tsx
│   ├── Teachers.tsx
│   ├── ClassRoutine.tsx      # NEW
│   ├── SchoolStaff.tsx       # NEW
│   ├── Administration.tsx    # NEW
│   └── ... (20 more pages)
├── App.tsx               # Main routing
└── main.tsx              # Entry point
```

## License

MIT
