import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  GraduationCap,
  UserCheck,
  CreditCard,
  Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const mobileNavItems = [
  { icon: LayoutDashboard, label: 'Home', path: '/' },
  { icon: GraduationCap, label: 'Students', path: '/students' },
  { icon: UserCheck, label: 'Attendance', path: '/attendance' },
  { icon: CreditCard, label: 'Fees', path: '/fees' },
  { icon: Menu, label: 'More', path: '/menu' },
];

export const MobileNav: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="mobile-nav md:hidden">
      <div className="flex items-center justify-around">
        {mobileNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all duration-200',
                isActive 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
