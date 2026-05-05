import React, { useState } from 'react';
import { 
  Calendar, 
  Check, 
  X, 
  Clock, 
  Download,
  UserCheck,
  UserX,
  Users,
  GraduationCap,
  Save
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { students, teachers, classes, sections } from '@/data/demoData';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type AttendanceStatus = 'present' | 'absent' | 'late' | null;

const Attendance: React.FC = () => {
  const [activeTab, setActiveTab] = useState('students');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('Class 10');
  const [selectedSection, setSelectedSection] = useState('A');
  const [studentAttendance, setStudentAttendance] = useState<Record<string, AttendanceStatus>>({});
  const [teacherAttendance, setTeacherAttendance] = useState<Record<string, AttendanceStatus>>({});
  const { toast } = useToast();

  const filteredStudents = students.filter(
    s => s.class === selectedClass && s.section === selectedSection && s.status === 'active'
  );

  const activeTeachers = teachers.filter(t => t.status === 'active');

  // Student attendance counts
  const studentPresentCount = Object.values(studentAttendance).filter(s => s === 'present').length;
  const studentAbsentCount = Object.values(studentAttendance).filter(s => s === 'absent').length;
  const studentLateCount = Object.values(studentAttendance).filter(s => s === 'late').length;

  // Teacher attendance counts
  const teacherPresentCount = Object.values(teacherAttendance).filter(s => s === 'present').length;
  const teacherAbsentCount = Object.values(teacherAttendance).filter(s => s === 'absent').length;
  const teacherLateCount = Object.values(teacherAttendance).filter(s => s === 'late').length;

  const toggleStudentAttendance = (studentId: string, status: AttendanceStatus) => {
    setStudentAttendance(prev => ({
      ...prev,
      [studentId]: prev[studentId] === status ? null : status
    }));
  };

  const toggleTeacherAttendance = (teacherId: string, status: AttendanceStatus) => {
    setTeacherAttendance(prev => ({
      ...prev,
      [teacherId]: prev[teacherId] === status ? null : status
    }));
  };

  const markAllStudents = (status: AttendanceStatus) => {
    const newAttendance: Record<string, AttendanceStatus> = {};
    filteredStudents.forEach(s => {
      newAttendance[s.id] = status;
    });
    setStudentAttendance(newAttendance);
  };

  const markAllTeachers = (status: AttendanceStatus) => {
    const newAttendance: Record<string, AttendanceStatus> = {};
    activeTeachers.forEach(t => {
      newAttendance[t.id] = status;
    });
    setTeacherAttendance(newAttendance);
  };

  const handleSaveStudentAttendance = () => {
    const markedCount = Object.keys(studentAttendance).length;
    if (markedCount === 0) {
      toast({ title: 'Warning', description: 'Please mark attendance for at least one student', variant: 'destructive' });
      return;
    }
    toast({ 
      title: 'Attendance Saved', 
      description: `Student attendance saved for ${selectedDate} - ${selectedClass} (${selectedSection})` 
    });
  };

  const handleSaveTeacherAttendance = () => {
    const markedCount = Object.keys(teacherAttendance).length;
    if (markedCount === 0) {
      toast({ title: 'Warning', description: 'Please mark attendance for at least one teacher', variant: 'destructive' });
      return;
    }
    toast({ 
      title: 'Attendance Saved', 
      description: `Teacher attendance saved for ${selectedDate}` 
    });
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="page-header">Attendance</h1>
          <p className="page-subtitle">Mark and manage attendance manually</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-muted text-foreground rounded-xl hover:bg-muted/80 transition-colors">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Tabs for Student/Teacher */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
          <TabsTrigger value="students" className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            Students
          </TabsTrigger>
          <TabsTrigger value="teachers" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Teachers
          </TabsTrigger>
        </TabsList>

        {/* Student Attendance Tab */}
        <TabsContent value="students">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="stat-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                  <p className="text-2xl font-bold text-foreground">{filteredStudents.length}</p>
                </div>
                <div className="p-3 rounded-xl bg-primary/10">
                  <Users className="w-6 h-6 text-primary" />
                </div>
              </div>
            </div>
            <div className="stat-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Present</p>
                  <p className="text-2xl font-bold text-success">{studentPresentCount}</p>
                </div>
                <div className="p-3 rounded-xl bg-success/10">
                  <UserCheck className="w-6 h-6 text-success" />
                </div>
              </div>
            </div>
            <div className="stat-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Absent</p>
                  <p className="text-2xl font-bold text-destructive">{studentAbsentCount}</p>
                </div>
                <div className="p-3 rounded-xl bg-destructive/10">
                  <UserX className="w-6 h-6 text-destructive" />
                </div>
              </div>
            </div>
            <div className="stat-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Late</p>
                  <p className="text-2xl font-bold text-warning">{studentLateCount}</p>
                </div>
                <div className="p-3 rounded-xl bg-warning/10">
                  <Clock className="w-6 h-6 text-warning" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-card rounded-2xl p-4 md:p-6 border border-border/50 mb-6 animate-fade-in">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                />
              </div>
              
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              >
                {classes.map(cls => (
                  <option key={cls.id} value={cls.name}>{cls.name}</option>
                ))}
              </select>

              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              >
                {sections.map(sec => (
                  <option key={sec} value={sec}>Section {sec}</option>
                ))}
              </select>

              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={() => markAllStudents('present')}
                  className="px-4 py-2.5 bg-success/10 text-success rounded-xl text-sm font-medium hover:bg-success/20 transition-colors"
                >
                  Mark All Present
                </button>
                <button
                  onClick={() => markAllStudents('absent')}
                  className="px-4 py-2.5 bg-destructive/10 text-destructive rounded-xl text-sm font-medium hover:bg-destructive/20 transition-colors"
                >
                  Mark All Absent
                </button>
              </div>
            </div>
          </div>

          {/* Attendance List */}
          <div className="bg-card rounded-2xl border border-border/50 overflow-hidden animate-fade-in">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Roll</th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Student</th>
                    <th className="text-center py-4 px-4 text-sm font-medium text-muted-foreground">Present</th>
                    <th className="text-center py-4 px-4 text-sm font-medium text-muted-foreground">Absent</th>
                    <th className="text-center py-4 px-4 text-sm font-medium text-muted-foreground">Late</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.sort((a, b) => a.roll - b.roll).map((student, index) => (
                    <tr 
                      key={student.id} 
                      className="table-row animate-fade-in"
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      <td className="py-4 px-4">
                        <span className="text-sm font-medium text-foreground">{student.roll}</span>
                      </td>
                      <td className="py-4 px-4">
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
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => toggleStudentAttendance(student.id, 'present')}
                          className={cn(
                            'w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200',
                            studentAttendance[student.id] === 'present'
                              ? 'bg-success text-success-foreground'
                              : 'bg-muted hover:bg-success/20 text-muted-foreground'
                          )}
                        >
                          <Check className="w-5 h-5" />
                        </button>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => toggleStudentAttendance(student.id, 'absent')}
                          className={cn(
                            'w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200',
                            studentAttendance[student.id] === 'absent'
                              ? 'bg-destructive text-destructive-foreground'
                              : 'bg-muted hover:bg-destructive/20 text-muted-foreground'
                          )}
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => toggleStudentAttendance(student.id, 'late')}
                          className={cn(
                            'w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200',
                            studentAttendance[student.id] === 'late'
                              ? 'bg-warning text-warning-foreground'
                              : 'bg-muted hover:bg-warning/20 text-muted-foreground'
                          )}
                        >
                          <Clock className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Save Button */}
            <div className="p-4 border-t border-border flex justify-end">
              <Button onClick={handleSaveStudentAttendance} className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Student Attendance
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Teacher Attendance Tab */}
        <TabsContent value="teachers">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="stat-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Teachers</p>
                  <p className="text-2xl font-bold text-foreground">{activeTeachers.length}</p>
                </div>
                <div className="p-3 rounded-xl bg-primary/10">
                  <Users className="w-6 h-6 text-primary" />
                </div>
              </div>
            </div>
            <div className="stat-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Present</p>
                  <p className="text-2xl font-bold text-success">{teacherPresentCount}</p>
                </div>
                <div className="p-3 rounded-xl bg-success/10">
                  <UserCheck className="w-6 h-6 text-success" />
                </div>
              </div>
            </div>
            <div className="stat-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Absent</p>
                  <p className="text-2xl font-bold text-destructive">{teacherAbsentCount}</p>
                </div>
                <div className="p-3 rounded-xl bg-destructive/10">
                  <UserX className="w-6 h-6 text-destructive" />
                </div>
              </div>
            </div>
            <div className="stat-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Late</p>
                  <p className="text-2xl font-bold text-warning">{teacherLateCount}</p>
                </div>
                <div className="p-3 rounded-xl bg-warning/10">
                  <Clock className="w-6 h-6 text-warning" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-card rounded-2xl p-4 md:p-6 border border-border/50 mb-6 animate-fade-in">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                />
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={() => markAllTeachers('present')}
                  className="px-4 py-2.5 bg-success/10 text-success rounded-xl text-sm font-medium hover:bg-success/20 transition-colors"
                >
                  Mark All Present
                </button>
                <button
                  onClick={() => markAllTeachers('absent')}
                  className="px-4 py-2.5 bg-destructive/10 text-destructive rounded-xl text-sm font-medium hover:bg-destructive/20 transition-colors"
                >
                  Mark All Absent
                </button>
              </div>
            </div>
          </div>

          {/* Teacher Attendance List */}
          <div className="bg-card rounded-2xl border border-border/50 overflow-hidden animate-fade-in">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">ID</th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Teacher</th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Department</th>
                    <th className="text-center py-4 px-4 text-sm font-medium text-muted-foreground">Present</th>
                    <th className="text-center py-4 px-4 text-sm font-medium text-muted-foreground">Absent</th>
                    <th className="text-center py-4 px-4 text-sm font-medium text-muted-foreground">Late</th>
                  </tr>
                </thead>
                <tbody>
                  {activeTeachers.map((teacher, index) => (
                    <tr 
                      key={teacher.id} 
                      className="table-row animate-fade-in"
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      <td className="py-4 px-4">
                        <span className="text-sm font-medium text-foreground">{teacher.id}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                            <span className="text-sm font-semibold text-secondary">
                              {teacher.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{teacher.name}</p>
                            <p className="text-xs text-muted-foreground">{teacher.designation}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 hidden md:table-cell">
                        <span className="text-sm text-foreground">{teacher.department}</span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => toggleTeacherAttendance(teacher.id, 'present')}
                          className={cn(
                            'w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200',
                            teacherAttendance[teacher.id] === 'present'
                              ? 'bg-success text-success-foreground'
                              : 'bg-muted hover:bg-success/20 text-muted-foreground'
                          )}
                        >
                          <Check className="w-5 h-5" />
                        </button>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => toggleTeacherAttendance(teacher.id, 'absent')}
                          className={cn(
                            'w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200',
                            teacherAttendance[teacher.id] === 'absent'
                              ? 'bg-destructive text-destructive-foreground'
                              : 'bg-muted hover:bg-destructive/20 text-muted-foreground'
                          )}
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => toggleTeacherAttendance(teacher.id, 'late')}
                          className={cn(
                            'w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200',
                            teacherAttendance[teacher.id] === 'late'
                              ? 'bg-warning text-warning-foreground'
                              : 'bg-muted hover:bg-warning/20 text-muted-foreground'
                          )}
                        >
                          <Clock className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Save Button */}
            <div className="p-4 border-t border-border flex justify-end">
              <Button onClick={handleSaveTeacherAttendance} className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Teacher Attendance
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Attendance;
