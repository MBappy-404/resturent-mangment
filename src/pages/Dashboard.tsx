import React from 'react';
import { 
  GraduationCap, 
  Users, 
  UserCheck, 
  UserX, 
  Wallet, 
  AlertCircle,
  Calendar,
  BookOpen
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { AttendanceChart } from '@/components/dashboard/AttendanceChart';
import { FeeCollectionChart } from '@/components/dashboard/FeeCollectionChart';
import { NoticeBoard } from '@/components/dashboard/NoticeBoard';
import { TodaySchedule } from '@/components/dashboard/TodaySchedule';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecentStudents } from '@/components/dashboard/RecentStudents';
import { dashboardStats } from '@/data/demoData';

const Dashboard: React.FC = () => {
  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="page-header">Dashboard</h1>
        <p className="page-subtitle">Welcome back! Here's what's happening at your institute today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Students"
          value={dashboardStats.totalStudents.toLocaleString()}
          icon={GraduationCap}
          trend={{ value: 12, isPositive: true }}
          color="primary"
        />
        <StatCard
          title="Present Today"
          value={dashboardStats.presentToday.toLocaleString()}
          icon={UserCheck}
          trend={{ value: 5, isPositive: true }}
          color="success"
        />
        <StatCard
          title="Absent Today"
          value={dashboardStats.absentToday}
          icon={UserX}
          trend={{ value: 3, isPositive: false }}
          color="warning"
        />
        <StatCard
          title="Total Due"
          value={`৳${(dashboardStats.totalDue / 1000).toFixed(0)}K`}
          icon={AlertCircle}
          color="accent"
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <QuickActions />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <AttendanceChart />
        <FeeCollectionChart />
      </div>

      {/* Bottom Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <TodaySchedule />
        </div>
        <div>
          <NoticeBoard />
        </div>
      </div>

      {/* Recent Students */}
      <RecentStudents />
    </DashboardLayout>
  );
};

export default Dashboard;
