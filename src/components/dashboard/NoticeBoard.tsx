import React from 'react';
import { Bell, Calendar, AlertCircle, Info, Gift } from 'lucide-react';
import { notices } from '@/data/demoData';
import { cn } from '@/lib/utils';

const priorityStyles = {
  high: 'bg-destructive/10 text-destructive border-destructive/20',
  medium: 'bg-warning/10 text-warning border-warning/20',
  low: 'bg-info/10 text-info border-info/20',
};

const typeIcons = {
  general: Bell,
  exam: AlertCircle,
  holiday: Gift,
  event: Calendar,
};

export const NoticeBoard: React.FC = () => {
  return (
    <div className="bg-card rounded-2xl p-6 border border-border/50 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Notice Board</h3>
          <p className="text-sm text-muted-foreground">Latest announcements</p>
        </div>
        <button className="text-sm text-primary hover:text-primary/80 font-medium transition-colors">
          View All
        </button>
      </div>
      <div className="space-y-4">
        {notices.slice(0, 4).map((notice, index) => {
          const Icon = typeIcons[notice.type];
          return (
            <div
              key={notice.id}
              className={cn(
                'p-4 rounded-xl border transition-all duration-200 hover:shadow-md cursor-pointer',
                priorityStyles[notice.priority]
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-background/50">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground truncate">{notice.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{notice.content}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Calendar className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{notice.date}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
