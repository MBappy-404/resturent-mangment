import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MoreHorizontal, Eye, Edit, Phone } from 'lucide-react';
import api from '@/services/api';
import { cn } from '@/lib/utils';

interface Student {
  id: string;
  name: string;
  class: string;
  section: string;
  guardianName: string;
  guardianPhone: string;
  status: string;
}

export const RecentStudents: React.FC = () => {
  const [recentStudents, setRecentStudents] = useState<Student[]>([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.getStudents();
        const data = Array.isArray(res.data) ? res.data : [];
        const mapped = data.slice(0, 5).map((s: Record<string, unknown>) => ({
          id: (s._id || s.studentId || '') as string,
          name: (s.name || '') as string,
          class: (s.className || '') as string,
          section: (s.section || '') as string,
          guardianName: (s.fatherName || '') as string,
          guardianPhone: (s.guardianPhone || '') as string,
          status: (s.status || 'active') as string,
        }));
        setRecentStudents(mapped);
      } catch {
        // fallback empty
      }
    };
    fetchStudents();
  }, []);

  return (
    <div className="bg-card rounded-2xl p-6 border border-border/50 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Recent Students</h3>
          <p className="text-sm text-muted-foreground">Newly admitted students</p>
        </div>
        <Link 
          to="/students" 
          className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
        >
          View All
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Student</th>
              <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground hidden sm:table-cell">Class</th>
              <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground hidden md:table-cell">Guardian</th>
              <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Status</th>
              <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Action</th>
            </tr>
          </thead>
          <tbody>
            {recentStudents.map((student, index) => (
              <tr 
                key={student.id} 
                className="table-row"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="py-3 px-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">
                        {student.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{student.name}</p>
                      <p className="text-xs text-muted-foreground">{student.id}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-2 hidden sm:table-cell">
                  <span className="text-sm text-foreground">{student.class}</span>
                  <span className="text-muted-foreground"> - {student.section}</span>
                </td>
                <td className="py-3 px-2 hidden md:table-cell">
                  <div>
                    <p className="text-sm text-foreground">{student.guardianName}</p>
                    <p className="text-xs text-muted-foreground">{student.guardianPhone}</p>
                  </div>
                </td>
                <td className="py-3 px-2">
                  <span className={cn(
                    'inline-flex px-2.5 py-1 rounded-full text-xs font-medium',
                    student.status === 'active' 
                      ? 'bg-success/10 text-success' 
                      : 'bg-muted text-muted-foreground'
                  )}>
                    {student.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="py-3 px-2 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                      <Edit className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
