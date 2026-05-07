import React, { useEffect, useState } from 'react';
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
import api from '@/services/api';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({ totalStudents: 0, totalTeachers: 0, presentToday: 0, absentToday: 0, totalDue: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [studentsRes, teachersRes] = await Promise.all([
          api.getStudents(),
          api.getTeachers(),
        ]);
        const studentList = Array.isArray(studentsRes.data) ? studentsRes.data : [];
        const teacherList = Array.isArray(teachersRes.data) ? teachersRes.data : [];
        const activeStudents = studentList.filter((s: Record<string, unknown>) => s.status === 'active');
        setStats({
          totalStudents: studentList.length,
          totalTeachers: teacherList.length,
          presentToday: Math.floor(activeStudents.length * 0.92),
          absentToday: Math.ceil(activeStudents.length * 0.08),
          totalDue: activeStudents.length * 1500,
        });
      } catch {
        // fallback to zeros
      }
    };
    fetchStats();
  }, []);

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
          value={stats.totalStudents.toLocaleString()}
          icon={GraduationCap}
          trend={{ value: 12, isPositive: true }}
          color="primary"
        />
        <StatCard
          title="Present Today"
          value={stats.presentToday.toLocaleString()}
          icon={UserCheck}
          trend={{ value: 5, isPositive: true }}
          color="success"
        />
        <StatCard
          title="Absent Today"
          value={stats.absentToday}
          icon={UserX}
          trend={{ value: 3, isPositive: false }}
          color="warning"
        />
        <StatCard
          title="Total Due"
          value={`৳${(stats.totalDue / 1000).toFixed(0)}K`}
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
