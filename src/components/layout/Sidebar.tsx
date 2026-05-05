import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  UserCheck,
  ClipboardList,
  CreditCard,
  BookOpen,
  Calculator,
  IdCard,
  UserCircle,
  BookMarked,
  Settings,
  ChevronLeft,
  ChevronRight,
  School,
  Bell,
  LogOut,
  Moon,
  Sun,
  MessageSquare,
  Bus,
  Award,
  CalendarDays,
  Heart,
  Building,
  Clock,
  Briefcase,
  Crown,
  Shield,
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

interface NavItem {
  icon: React.ElementType;
  label: string;
  labelBn: string;
  path: string;
  badge?: number;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', labelBn: 'ড্যাশবোর্ড', path: '/' },
  { icon: GraduationCap, label: 'Students', labelBn: 'শিক্ষার্থী', path: '/students', badge: 1250 },
  { icon: Users, label: 'Teachers', labelBn: 'শিক্ষক', path: '/teachers' },
  { icon: UserCheck, label: 'Attendance', labelBn: 'উপস্থিতি', path: '/attendance' },
  { icon: BookOpen, label: 'Subjects', labelBn: 'বিষয়সমূহ', path: '/subjects' },
  { icon: Clock, label: 'Class Routine', labelBn: 'ক্লাস রুটিন', path: '/class-routine' },
  { icon: ClipboardList, label: 'Exams', labelBn: 'পরীক্ষা', path: '/exams' },
  { icon: CreditCard, label: 'Fees', labelBn: 'ফি', path: '/fees', badge: 45 },
  { icon: BookOpen, label: 'Library', labelBn: 'লাইব্রেরি', path: '/library' },
  { icon: Calculator, label: 'Accounts', labelBn: 'হিসাব', path: '/accounts' },
  { icon: IdCard, label: 'ID Cards', labelBn: 'আইডি কার্ড', path: '/id-cards' },
  { icon: UserCircle, label: 'Guardian', labelBn: 'অভিভাবক', path: '/guardian' },
  { icon: BookMarked, label: 'Diary', labelBn: 'ডায়েরি', path: '/diary' },
  { icon: Bell, label: 'Notices', labelBn: 'নোটিশ', path: '/notices' },
  { icon: MessageSquare, label: 'SMS', labelBn: 'এসএমএস', path: '/sms' },
  { icon: Bus, label: 'Transport', labelBn: 'পরিবহন', path: '/transport' },
  { icon: Award, label: 'Certificates', labelBn: 'সার্টিফিকেট', path: '/certificates' },
  { icon: CalendarDays, label: 'Calendar', labelBn: 'ক্যালেন্ডার', path: '/calendar' },
  { icon: Users, label: 'Alumni', labelBn: 'প্রাক্তন ছাত্র', path: '/alumni' },
  { icon: Heart, label: 'Medical', labelBn: 'স্বাস্থ্য', path: '/medical' },
  { icon: Award, label: 'Scholarship', labelBn: 'বৃত্তি', path: '/scholarship' },
  { icon: Building, label: 'Hostel', labelBn: 'হোস্টেল', path: '/hostel' },
  { icon: Briefcase, label: 'School Staff', labelBn: 'স্কুল স্টাফ', path: '/school-staff' },
  { icon: Crown, label: 'Administration', labelBn: 'প্রশাসন', path: '/administration' },
  { icon: Settings, label: 'Settings', labelBn: 'সেটিংস', path: '/settings' },
];

export const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-sidebar transition-all duration-300 ease-in-out hidden md:flex flex-col',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary">
            <School className="w-6 h-6 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-bold text-sidebar-foreground">EduManage</span>
              <span className="text-xs text-sidebar-foreground/60">Institute System</span>
            </div>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg bg-sidebar-accent hover:bg-sidebar-accent/80 text-sidebar-foreground transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    'sidebar-link group',
                    isActive && 'active'
                  )}
                >
                  <item.icon className={cn(
                    'w-5 h-5 flex-shrink-0 transition-colors',
                    isActive ? 'text-primary-foreground' : 'text-sidebar-foreground/70 group-hover:text-sidebar-foreground'
                  )} />
                  {!collapsed && (
                    <>
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.badge && (
                        <span className={cn(
                          'px-2 py-0.5 text-xs rounded-full',
                          isActive ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-primary/10 text-primary'
                        )}>
                          {item.badge > 999 ? '999+' : item.badge}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer Actions */}
      <div className="p-3 border-t border-sidebar-border space-y-2">
        <button
          onClick={toggleTheme}
          className="sidebar-link w-full justify-center"
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5" />
          ) : (
            <Sun className="w-5 h-5" />
          )}
          {!collapsed && (
            <span className="flex-1">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
          )}
        </button>
        <button className="sidebar-link w-full justify-center text-destructive hover:bg-destructive/10">
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="flex-1">Logout</span>}
        </button>
      </div>
    </aside>
  );
};
