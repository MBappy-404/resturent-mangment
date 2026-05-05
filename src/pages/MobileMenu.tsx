import React from 'react';
import { Link } from 'react-router-dom';
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
  Bell,
  LogOut,
  Moon,
  Sun,
  ChevronRight,
  School
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', labelBn: 'ড্যাশবোর্ড', path: '/' },
  { icon: GraduationCap, label: 'Students', labelBn: 'শিক্ষার্থী', path: '/students' },
  { icon: Users, label: 'Teachers', labelBn: 'শিক্ষক', path: '/teachers' },
  { icon: UserCheck, label: 'Attendance', labelBn: 'উপস্থিতি', path: '/attendance' },
  { icon: ClipboardList, label: 'Exams', labelBn: 'পরীক্ষা', path: '/exams' },
  { icon: CreditCard, label: 'Fees', labelBn: 'ফি', path: '/fees' },
  { icon: BookOpen, label: 'Library', labelBn: 'লাইব্রেরি', path: '/library' },
  { icon: Calculator, label: 'Accounts', labelBn: 'হিসাব', path: '/accounts' },
  { icon: IdCard, label: 'ID Cards', labelBn: 'আইডি কার্ড', path: '/id-cards' },
  { icon: UserCircle, label: 'Guardian', labelBn: 'অভিভাবক', path: '/guardian' },
  { icon: BookMarked, label: 'Diary', labelBn: 'ডায়েরি', path: '/diary' },
  { icon: Bell, label: 'Notices', labelBn: 'নোটিশ', path: '/notices' },
  { icon: Settings, label: 'Settings', labelBn: 'সেটিংস', path: '/settings' },
];

const MobileMenu: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-card border-b border-border p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center">
            <School className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">EduManage</h1>
            <p className="text-sm text-muted-foreground">Institute Management System</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-4 space-y-2">
        {menuItems.map((item, index) => (
          <Link
            key={item.path}
            to={item.path}
            className="flex items-center justify-between p-4 bg-card rounded-2xl border border-border/50 hover:bg-muted/50 transition-all duration-200 animate-fade-in"
            style={{ animationDelay: `${index * 30}ms` }}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground font-bengali">{item.labelBn}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </Link>
        ))}
      </div>

      {/* Actions */}
      <div className="p-4 space-y-2">
        <button
          onClick={toggleTheme}
          className="flex items-center justify-between w-full p-4 bg-card rounded-2xl border border-border/50 hover:bg-muted/50 transition-all duration-200"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-accent" />
              ) : (
                <Sun className="w-5 h-5 text-accent" />
              )}
            </div>
            <div>
              <p className="font-medium text-foreground">
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </p>
              <p className="text-xs text-muted-foreground">Toggle theme</p>
            </div>
          </div>
        </button>

        <button className="flex items-center justify-between w-full p-4 bg-destructive/5 rounded-2xl border border-destructive/20 hover:bg-destructive/10 transition-all duration-200">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
              <LogOut className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="font-medium text-destructive">Logout</p>
              <p className="text-xs text-destructive/70">Sign out of your account</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default MobileMenu;
