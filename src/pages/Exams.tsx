import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Download, 
  Eye, 
  Edit, 
  Trash2,
  ClipboardList,
  Calendar,
  BookOpen,
  Users,
  FileText
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Exam {
  id: string;
  name: string;
  type: 'midterm' | 'final' | 'quiz' | 'class_test';
  class: string;
  subject: string;
  date: string;
  duration: string;
  totalMarks: number;
  status: 'upcoming' | 'ongoing' | 'completed';
}

const initialExams: Exam[] = [
  { id: 'EXM-001', name: 'Half Yearly Exam 2024', type: 'midterm', class: 'Class 10', subject: 'Mathematics', date: '2024-12-15', duration: '3 hours', totalMarks: 100, status: 'upcoming' },
  { id: 'EXM-002', name: 'Class Test - Physics', type: 'class_test', class: 'Class 9', subject: 'Physics', date: '2024-12-10', duration: '1 hour', totalMarks: 50, status: 'upcoming' },
  { id: 'EXM-003', name: 'Weekly Quiz - English', type: 'quiz', class: 'Class 8', subject: 'English', date: '2024-12-05', duration: '30 mins', totalMarks: 25, status: 'completed' },
  { id: 'EXM-004', name: 'Final Term - Bangla', type: 'final', class: 'Class 7', subject: 'Bangla', date: '2024-12-20', duration: '3 hours', totalMarks: 100, status: 'upcoming' },
  { id: 'EXM-005', name: 'Science Test', type: 'class_test', class: 'Class 6', subject: 'Science', date: '2024-12-08', duration: '1.5 hours', totalMarks: 50, status: 'ongoing' },
];

const Exams: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>(initialExams);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [formData, setFormData] = useState<Partial<Exam>>({});

  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exam.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || exam.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleAdd = () => {
    const newExam: Exam = {
      id: `EXM-${String(exams.length + 1).padStart(3, '0')}`,
      name: formData.name || '',
      type: formData.type || 'class_test',
      class: formData.class || 'Class 10',
      subject: formData.subject || '',
      date: formData.date || '',
      duration: formData.duration || '',
      totalMarks: formData.totalMarks || 100,
      status: 'upcoming'
    };
    setExams([...exams, newExam]);
    setIsAddOpen(false);
    setFormData({});
    toast.success('Exam created successfully');
  };

  const handleEdit = () => {
    if (!selectedExam) return;
    setExams(exams.map(e => e.id === selectedExam.id ? { ...e, ...formData } : e));
    setIsEditOpen(false);
    setSelectedExam(null);
    setFormData({});
    toast.success('Exam updated successfully');
  };

  const handleDelete = () => {
    if (!selectedExam) return;
    setExams(exams.filter(e => e.id !== selectedExam.id));
    setIsDeleteOpen(false);
    setSelectedExam(null);
    toast.success('Exam deleted successfully');
  };

  const openView = (exam: Exam) => {
    setSelectedExam(exam);
    setIsViewOpen(true);
  };

  const openEdit = (exam: Exam) => {
    setSelectedExam(exam);
    setFormData(exam);
    setIsEditOpen(true);
  };

  const openDelete = (exam: Exam) => {
    setSelectedExam(exam);
    setIsDeleteOpen(true);
  };

  const statusStyles = {
    upcoming: 'bg-primary/10 text-primary',
    ongoing: 'bg-warning/10 text-warning',
    completed: 'bg-success/10 text-success',
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="page-header">Exam Management</h1>
          <p className="page-subtitle">Create and manage examinations</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button onClick={() => setIsAddOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            <span>Create Exam</span>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Exams</p>
              <p className="text-2xl font-bold text-foreground">{exams.length}</p>
            </div>
            <div className="p-3 rounded-xl bg-primary/10">
              <ClipboardList className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Upcoming</p>
              <p className="text-2xl font-bold text-primary">{exams.filter(e => e.status === 'upcoming').length}</p>
            </div>
            <div className="p-3 rounded-xl bg-primary/10">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Ongoing</p>
              <p className="text-2xl font-bold text-warning">{exams.filter(e => e.status === 'ongoing').length}</p>
            </div>
            <div className="p-3 rounded-xl bg-warning/10">
              <BookOpen className="w-6 h-6 text-warning" />
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold text-success">{exams.filter(e => e.status === 'completed').length}</p>
            </div>
            <div className="p-3 rounded-xl bg-success/10">
              <FileText className="w-6 h-6 text-success" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-2xl p-4 md:p-6 border border-border/50 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search exams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Types</option>
            <option value="midterm">Midterm</option>
            <option value="final">Final</option>
            <option value="quiz">Quiz</option>
            <option value="class_test">Class Test</option>
          </select>
        </div>
      </div>

      {/* Exams Table */}
      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Exam Name</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground hidden sm:table-cell">Class</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Subject</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Date</th>
                <th className="text-center py-4 px-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExams.map((exam) => (
                <tr key={exam.id} className="table-row">
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-foreground">{exam.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{exam.type.replace('_', ' ')}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 hidden sm:table-cell text-sm">{exam.class}</td>
                  <td className="py-4 px-4 hidden md:table-cell text-sm">{exam.subject}</td>
                  <td className="py-4 px-4 text-sm">{exam.date}</td>
                  <td className="py-4 px-4 text-center">
                    <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium capitalize', statusStyles[exam.status])}>
                      {exam.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openView(exam)} className="p-2 rounded-lg hover:bg-muted">
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button onClick={() => openEdit(exam)} className="p-2 rounded-lg hover:bg-muted">
                        <Edit className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button onClick={() => openDelete(exam)} className="p-2 rounded-lg hover:bg-destructive/10">
                        <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Exam</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Exam Name</Label>
              <Input value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Enter exam name" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Type</Label>
                <select className="px-3 py-2 border border-border rounded-lg" value={formData.type || 'class_test'} onChange={(e) => setFormData({...formData, type: e.target.value as Exam['type']})}>
                  <option value="midterm">Midterm</option>
                  <option value="final">Final</option>
                  <option value="quiz">Quiz</option>
                  <option value="class_test">Class Test</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label>Class</Label>
                <Input value={formData.class || ''} onChange={(e) => setFormData({...formData, class: e.target.value})} placeholder="Class 10" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Subject</Label>
                <Input value={formData.subject || ''} onChange={(e) => setFormData({...formData, subject: e.target.value})} placeholder="Mathematics" />
              </div>
              <div className="grid gap-2">
                <Label>Date</Label>
                <Input type="date" value={formData.date || ''} onChange={(e) => setFormData({...formData, date: e.target.value})} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Duration</Label>
                <Input value={formData.duration || ''} onChange={(e) => setFormData({...formData, duration: e.target.value})} placeholder="3 hours" />
              </div>
              <div className="grid gap-2">
                <Label>Total Marks</Label>
                <Input type="number" value={formData.totalMarks || ''} onChange={(e) => setFormData({...formData, totalMarks: parseInt(e.target.value)})} placeholder="100" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Create Exam</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Exam Details</DialogTitle>
          </DialogHeader>
          {selectedExam && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-sm text-muted-foreground">Exam Name</p><p className="font-medium">{selectedExam.name}</p></div>
                <div><p className="text-sm text-muted-foreground">Type</p><p className="font-medium capitalize">{selectedExam.type.replace('_', ' ')}</p></div>
                <div><p className="text-sm text-muted-foreground">Class</p><p className="font-medium">{selectedExam.class}</p></div>
                <div><p className="text-sm text-muted-foreground">Subject</p><p className="font-medium">{selectedExam.subject}</p></div>
                <div><p className="text-sm text-muted-foreground">Date</p><p className="font-medium">{selectedExam.date}</p></div>
                <div><p className="text-sm text-muted-foreground">Duration</p><p className="font-medium">{selectedExam.duration}</p></div>
                <div><p className="text-sm text-muted-foreground">Total Marks</p><p className="font-medium">{selectedExam.totalMarks}</p></div>
                <div><p className="text-sm text-muted-foreground">Status</p><p className="font-medium capitalize">{selectedExam.status}</p></div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Exam</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Exam Name</Label>
              <Input value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Subject</Label>
                <Input value={formData.subject || ''} onChange={(e) => setFormData({...formData, subject: e.target.value})} />
              </div>
              <div className="grid gap-2">
                <Label>Date</Label>
                <Input type="date" value={formData.date || ''} onChange={(e) => setFormData({...formData, date: e.target.value})} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={handleEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Exam</DialogTitle>
          </DialogHeader>
          <p className="py-4">Are you sure you want to delete "{selectedExam?.name}"? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Exams;
