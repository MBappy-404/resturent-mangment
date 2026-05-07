import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Plus,
  Download,
  Eye,
  Edit,
  Trash2,
  Clock,
  Calendar,
  BookOpen,
  Users,
  Printer,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { classes, sections } from '@/data/demoData';
import api from '@/services/api';
import {
  routineEntries as initialRoutineEntries,
  periods,
  weekDays,
  type RoutineEntry,
} from '@/data/routineData';

const ClassRoutine: React.FC = () => {
  const { toast } = useToast();
  const [routines, setRoutines] = useState<RoutineEntry[]>(initialRoutineEntries);
  const [selectedClass, setSelectedClass] = useState('Class 6');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedDay, setSelectedDay] = useState('all');

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<RoutineEntry | null>(null);

  const [formData, setFormData] = useState({
    day: 'Sunday',
    periodId: '1',
    subject: '',
    teacher: '',
    room: '',
    className: 'Class 6',
    section: 'A',
  });

  const resetForm = () => {
    setFormData({
      day: 'Sunday',
      periodId: '1',
      subject: '',
      teacher: '',
      room: '',
      className: selectedClass,
      section: selectedSection,
    });
  };

  const filteredRoutines = useMemo(() => {
    return routines.filter((r) => {
      const matchesClass = r.className === selectedClass;
      const matchesSection = r.section === selectedSection;
      const matchesDay = selectedDay === 'all' || r.day === selectedDay;
      return matchesClass && matchesSection && matchesDay;
    });
  }, [routines, selectedClass, selectedSection, selectedDay]);

  const getRoutineForSlot = (day: string, periodId: string) => {
    return filteredRoutines.find(
      (r) => r.day === day && r.periodId === periodId
    );
  };

  const handleAdd = async () => {
    if (!formData.subject || !formData.teacher) {
      toast({ title: 'Error', description: 'Please fill required fields', variant: 'destructive' });
      return;
    }
    const existing = routines.find(
      (r) => r.day === formData.day && r.periodId === formData.periodId && r.className === formData.className && r.section === formData.section
    );
    if (existing) {
      toast({ title: 'Error', description: 'This time slot is already assigned', variant: 'destructive' });
      return;
    }
    try {
      const res = await api.createClassRoutine(formData);
      const d = res.success ? res.data as Record<string, unknown> : null;
      const newEntry: RoutineEntry = {
        id: d ? (d._id as string) : `RT${Date.now()}`,
        ...formData,
      };
      setRoutines([...routines, newEntry]);
    } catch {
      const newEntry: RoutineEntry = { id: `RT${Date.now()}`, ...formData };
      setRoutines([...routines, newEntry]);
    }
    toast({ title: 'Success', description: `Class routine entry added for ${formData.day}` });
    resetForm();
    setAddDialogOpen(false);
  };

  const handleEdit = async () => {
    if (!selectedEntry || !formData.subject || !formData.teacher) {
      toast({ title: 'Error', description: 'Please fill required fields', variant: 'destructive' });
      return;
    }
    setRoutines(routines.map((r) => r.id === selectedEntry.id ? { ...r, ...formData } : r));
    toast({ title: 'Success', description: 'Routine entry updated successfully!' });
    resetForm();
    setEditDialogOpen(false);
    setSelectedEntry(null);
  };

  const handleDelete = async () => {
    if (!selectedEntry) return;
    setRoutines(routines.filter((r) => r.id !== selectedEntry.id));
    toast({ title: 'Deleted', description: 'Routine entry deleted successfully!' });
    setDeleteDialogOpen(false);
    setSelectedEntry(null);
  };

  const openEditDialog = (entry: RoutineEntry) => {
    setSelectedEntry(entry);
    setFormData({
      day: entry.day,
      periodId: entry.periodId,
      subject: entry.subject,
      teacher: entry.teacher,
      room: entry.room,
      className: entry.className,
      section: entry.section,
    });
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (entry: RoutineEntry) => {
    setSelectedEntry(entry);
    setDeleteDialogOpen(true);
  };

  const handleExport = () => {
    const csvContent = [
      ['Day', 'Period', 'Time', 'Subject', 'Teacher', 'Room'].join(','),
      ...filteredRoutines.map((r) => {
        const period = periods.find((p) => p.id === r.periodId);
        return [
          r.day,
          period?.name || '',
          period?.time || '',
          r.subject,
          r.teacher,
          r.room,
        ].join(',');
      }),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `routine-${selectedClass}-${selectedSection}.csv`;
    a.click();
    toast({
      title: 'Exported',
      description: 'Routine exported as CSV',
    });
  };

  const subjectColors: Record<string, string> = {
    Bangla: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    English:
      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    Mathematics:
      'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    Science:
      'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    'Social Science':
      'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
    'Bangladesh & Global Studies':
      'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
    Religion:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    ICT: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300',
    'Physical Education':
      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    'Arts & Crafts':
      'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
    Music:
      'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300',
    'Agriculture Studies':
      'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
    'Home Economics':
      'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  };

  const subjectsList = [
    'Bangla',
    'English',
    'Mathematics',
    'Science',
    'Social Science',
    'Bangladesh & Global Studies',
    'Religion',
    'ICT',
    'Physical Education',
    'Arts & Crafts',
    'Music',
    'Agriculture Studies',
    'Home Economics',
  ];

  const RoutineFormFields = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Class *</label>
          <select
            className="w-full p-2 border rounded-lg bg-background"
            value={formData.className}
            onChange={(e) =>
              setFormData({ ...formData, className: e.target.value })
            }
          >
            {classes.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Section *</label>
          <select
            className="w-full p-2 border rounded-lg bg-background"
            value={formData.section}
            onChange={(e) =>
              setFormData({ ...formData, section: e.target.value })
            }
          >
            {sections.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Day *</label>
          <select
            className="w-full p-2 border rounded-lg bg-background"
            value={formData.day}
            onChange={(e) =>
              setFormData({ ...formData, day: e.target.value })
            }
          >
            {weekDays.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Period *</label>
          <select
            className="w-full p-2 border rounded-lg bg-background"
            value={formData.periodId}
            onChange={(e) =>
              setFormData({ ...formData, periodId: e.target.value })
            }
          >
            {periods
              .filter((p) => p.type === 'class')
              .map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.time})
                </option>
              ))}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Subject *</label>
        <select
          className="w-full p-2 border rounded-lg bg-background"
          value={formData.subject}
          onChange={(e) =>
            setFormData({ ...formData, subject: e.target.value })
          }
        >
          <option value="">Select Subject</option>
          {subjectsList.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Teacher *</label>
        <input
          type="text"
          className="w-full p-2 border rounded-lg bg-background"
          placeholder="Teacher name"
          value={formData.teacher}
          onChange={(e) =>
            setFormData({ ...formData, teacher: e.target.value })
          }
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Room</label>
        <input
          type="text"
          className="w-full p-2 border rounded-lg bg-background"
          placeholder="e.g. Room 301"
          value={formData.room}
          onChange={(e) =>
            setFormData({ ...formData, room: e.target.value })
          }
        />
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="page-header">Class Routine</h1>
        <p className="page-subtitle">
          Manage class schedules, periods, and teacher assignments
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">6</p>
              <p className="text-sm text-muted-foreground">Working Days</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary/10">
              <Clock className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{periods.filter(p => p.type === 'class').length}</p>
              <p className="text-sm text-muted-foreground">Periods/Day</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <BookOpen className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">{filteredRoutines.length}</p>
              <p className="text-sm text-muted-foreground">Assigned Slots</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-info/10">
              <Users className="w-5 h-5 text-info" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {new Set(filteredRoutines.map((r) => r.teacher)).size}
              </p>
              <p className="text-sm text-muted-foreground">Teachers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="glass-card p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-wrap gap-3">
            <select
              className="px-3 py-2 border rounded-lg bg-background text-sm"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              {classes.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
            <select
              className="px-3 py-2 border rounded-lg bg-background text-sm"
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
            >
              {sections.map((s) => (
                <option key={s} value={s}>
                  Section {s}
                </option>
              ))}
            </select>
            <select
              className="px-3 py-2 border rounded-lg bg-background text-sm"
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
            >
              <option value="all">All Days</option>
              {weekDays.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-muted transition-colors text-sm"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={() => {
                resetForm();
                setAddDialogOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Entry
            </button>
          </div>
        </div>
      </div>

      {/* Routine Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground w-28">
                  Day / Period
                </th>
                {periods.map((p) => (
                  <th
                    key={p.id}
                    className={cn(
                      'px-3 py-3 text-center text-xs font-semibold min-w-[130px]',
                      p.type === 'break'
                        ? 'bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-400'
                        : 'text-muted-foreground'
                    )}
                  >
                    <div>{p.name}</div>
                    <div className="text-[10px] font-normal mt-0.5">
                      {p.time}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(selectedDay === 'all' ? weekDays : [selectedDay]).map(
                (day) => (
                  <tr
                    key={day}
                    className="border-t border-border hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-sm">{day}</td>
                    {periods.map((period) => {
                      if (period.type === 'break') {
                        return (
                          <td
                            key={period.id}
                            className="px-3 py-3 text-center bg-amber-50/50 dark:bg-amber-900/5"
                          >
                            <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                              {period.name}
                            </span>
                          </td>
                        );
                      }
                      const entry = getRoutineForSlot(day, period.id);
                      return (
                        <td
                          key={period.id}
                          className="px-2 py-2 text-center"
                        >
                          {entry ? (
                            <div
                              className={cn(
                                'rounded-lg p-2 cursor-pointer transition-all hover:shadow-md group relative',
                                subjectColors[entry.subject] ||
                                  'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                              )}
                            >
                              <div className="font-medium text-xs">
                                {entry.subject}
                              </div>
                              <div className="text-[10px] mt-0.5 opacity-75">
                                {entry.teacher}
                              </div>
                              {entry.room && (
                                <div className="text-[10px] opacity-60">
                                  {entry.room}
                                </div>
                              )}
                              <div className="absolute top-1 right-1 hidden group-hover:flex gap-1">
                                <button
                                  onClick={() => openEditDialog(entry)}
                                  className="p-1 rounded bg-white/80 dark:bg-black/40 hover:bg-white dark:hover:bg-black/60"
                                >
                                  <Edit className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => openDeleteDialog(entry)}
                                  className="p-1 rounded bg-white/80 dark:bg-black/40 hover:bg-white dark:hover:bg-black/60 text-red-500"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  day,
                                  periodId: period.id,
                                  className: selectedClass,
                                  section: selectedSection,
                                });
                                setAddDialogOpen(true);
                              }}
                              className="w-full h-full min-h-[50px] border-2 border-dashed border-muted-foreground/20 rounded-lg hover:border-primary/40 hover:bg-primary/5 transition-all flex items-center justify-center"
                            >
                              <Plus className="w-4 h-4 text-muted-foreground/30" />
                            </button>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Routine Entry</DialogTitle>
          </DialogHeader>
          <RoutineFormFields />
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setAddDialogOpen(false)}
              className="px-4 py-2 border rounded-lg hover:bg-muted"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              Add Entry
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Routine Entry</DialogTitle>
          </DialogHeader>
          <RoutineFormFields />
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setEditDialogOpen(false)}
              className="px-4 py-2 border rounded-lg hover:bg-muted"
            >
              Cancel
            </button>
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              Update Entry
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Routine Entry?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the{' '}
              <strong>{selectedEntry?.subject}</strong> class on{' '}
              <strong>{selectedEntry?.day}</strong>. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default ClassRoutine;
