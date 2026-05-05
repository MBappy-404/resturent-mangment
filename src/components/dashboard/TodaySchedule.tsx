import React from 'react';
import { Clock, BookOpen, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const todayClasses = [
  { id: 1, subject: 'Mathematics', class: 'Class 10-A', time: '8:00 AM', teacher: 'Md. Rafiq', status: 'ongoing' },
  { id: 2, subject: 'English', class: 'Class 9-B', time: '9:00 AM', teacher: 'Fatima Akter', status: 'upcoming' },
  { id: 3, subject: 'Physics', class: 'Class 10-B', time: '10:00 AM', teacher: 'Tanvir Ahmed', status: 'upcoming' },
  { id: 4, subject: 'Chemistry', class: 'Class 9-A', time: '11:00 AM', teacher: 'Nusrat Jahan', status: 'upcoming' },
  { id: 5, subject: 'Bangla', class: 'Class 8-A', time: '12:00 PM', teacher: 'Abdul Karim', status: 'upcoming' },
];

export const TodaySchedule: React.FC = () => {
  return (
    <div className="bg-card rounded-2xl p-6 border border-border/50 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Today's Classes</h3>
          <p className="text-sm text-muted-foreground">42 classes scheduled</p>
        </div>
        <button className="text-sm text-primary hover:text-primary/80 font-medium transition-colors">
          View Schedule
        </button>
      </div>
      <div className="space-y-3">
        {todayClasses.map((classItem, index) => (
          <div
            key={classItem.id}
            className={cn(
              'flex items-center gap-4 p-3 rounded-xl transition-all duration-200 hover:bg-muted/50',
              classItem.status === 'ongoing' && 'bg-primary/5 border border-primary/20'
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center',
              classItem.status === 'ongoing' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            )}>
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-foreground">{classItem.subject}</h4>
                {classItem.status === 'ongoing' && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full animate-pulse">
                    Live
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-sm text-muted-foreground">{classItem.class}</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">{classItem.teacher}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">{classItem.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
