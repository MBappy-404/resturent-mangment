import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Download, 
  Eye, 
  Edit, 
  Trash2,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  X
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { students as initialStudents, classes, sections } from '@/data/demoData';
import api from '@/services/api';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

const ITEMS_PER_PAGE = 10;

const Students: React.FC = () => {
  const { toast } = useToast();
  const [students, setStudents] = useState(initialStudents);
  const [apiLoaded, setApiLoaded] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.getStudents({ limit: '500' });
        const rawData = res.data as Record<string, unknown>;
        const studentList = Array.isArray(rawData) ? rawData : (rawData?.students || []) as Array<Record<string, unknown>>;
        if (res.success && Array.isArray(studentList) && studentList.length > 0) {
          const mapped = studentList.map((s: Record<string, unknown>) => ({
            id: (s._id || s.studentId || '') as string,
            name: (s.name || '') as string,
            nameBn: (s.nameBn || '') as string,
            roll: (s.roll || 0) as number,
            class: (s.className || '') as string,
            section: (s.section || 'A') as string,
            gender: (s.gender || 'male') as 'male' | 'female',
            dateOfBirth: (s.dateOfBirth ? new Date(s.dateOfBirth as string).toISOString().split('T')[0] : '') as string,
            guardianName: (s.fatherName || '') as string,
            guardianPhone: (s.guardianPhone || '') as string,
            address: typeof s.address === 'object' && s.address ? ((s.address as Record<string, string>).present || '') : (s.address || '') as string,
            status: (s.status || 'active') as 'active' | 'inactive',
            admissionDate: (s.createdAt ? new Date(s.createdAt as string).toISOString().split('T')[0] : '') as string,
            monthlyFee: 1500,
            dueAmount: 0,
          }));
          setStudents(mapped);
          setApiLoaded(true);
        }
      } catch {
        console.log('Using demo data (backend not available)');
      }
    };
    fetchStudents();
  }, []);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedSection, setSelectedSection] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<typeof students[0] | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    class: '',
    section: '',
    group: '',
    guardianName: '',
    guardianPhone: '',
    status: 'active'
  });

  const isHigherClass = (className: string) => className === 'Class 9' || className === 'Class 10';

  const resetForm = () => {
    setFormData({ name: '', class: '', section: '', group: '', guardianName: '', guardianPhone: '', status: 'active' });
  };

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           student.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           student.guardianPhone.includes(searchQuery);
      const matchesClass = selectedClass === 'all' || student.class === selectedClass;
      const matchesSection = selectedSection === 'all' || student.section === selectedSection;
      const matchesStatus = selectedStatus === 'all' || student.status === selectedStatus;
      
      return matchesSearch && matchesClass && matchesSection && matchesStatus;
    });
  }, [students, searchQuery, selectedClass, selectedSection, selectedStatus]);

  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleAdd = async () => {
    if (!formData.name || !formData.class) {
      toast({ title: "Error", description: "Please fill required fields", variant: "destructive" });
      return;
    }
    if (isHigherClass(formData.class) && !formData.group) {
      toast({ title: "Error", description: "Please select a group for Class 9/10", variant: "destructive" });
      return;
    }
    try {
      const apiData = {
        name: formData.name,
        className: formData.class,
        section: formData.section || 'A',
        fatherName: formData.guardianName,
        guardianPhone: formData.guardianPhone,
        status: formData.status,
        gender: 'male',
        roll: students.length + 1,
      };
      const res = await api.createStudent(apiData);
      if (res.success) {
        const s = res.data as Record<string, unknown>;
        const newStudent = {
          id: (s._id || s.studentId || '') as string,
          name: (s.name || '') as string,
          nameBn: (s.nameBn || '') as string,
          roll: (s.roll || 0) as number,
          class: (s.className || '') as string,
          section: (s.section || 'A') as string,
          gender: (s.gender || 'male') as 'male' | 'female',
          dateOfBirth: '',
          guardianName: (s.fatherName || '') as string,
          guardianPhone: (s.guardianPhone || '') as string,
          address: '',
          status: (s.status || 'active') as 'active' | 'inactive',
          admissionDate: new Date().toISOString().split('T')[0],
          monthlyFee: 1500,
          dueAmount: 0,
        };
        setStudents([newStudent, ...students]);
        toast({ title: "Success", description: `Student "${formData.name}" added successfully!` });
        resetForm();
        setAddDialogOpen(false);
      }
    } catch (err: unknown) {
      toast({ title: "Error", description: err instanceof Error ? err.message : 'Failed to add student', variant: "destructive" });
    }
  };

  const handleEdit = async () => {
    if (!selectedStudent || !formData.name || !formData.class) {
      toast({ title: "Error", description: "Please fill required fields", variant: "destructive" });
      return;
    }
    // Validate group for Class 9 & 10
    if (isHigherClass(formData.class) && !formData.group) {
      toast({ title: "Error", description: "Please select a group for Class 9/10", variant: "destructive" });
      return;
    }
    try {
      const apiData = {
        name: formData.name,
        className: formData.class,
        section: formData.section || selectedStudent.section,
        fatherName: formData.guardianName,
        guardianPhone: formData.guardianPhone,
        status: formData.status,
      };
      await api.updateStudent(selectedStudent.id, apiData);
      setStudents(students.map(s => 
        s.id === selectedStudent.id 
          ? { 
              ...s, 
              name: formData.name, 
              class: formData.class, 
              section: formData.section || s.section, 
              group: isHigherClass(formData.class) ? formData.group : undefined,
              guardianName: formData.guardianName, 
              guardianPhone: formData.guardianPhone, 
              status: formData.status as 'active' | 'inactive' 
            }
          : s
      ));
      toast({ title: "Success", description: `Student "${formData.name}" updated successfully!` });
      resetForm();
      setEditDialogOpen(false);
      setSelectedStudent(null);
    } catch (err: unknown) {
      toast({ title: "Error", description: err instanceof Error ? err.message : 'Failed to update student', variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    if (!selectedStudent) return;
    try {
      await api.deleteStudent(selectedStudent.id);
      setStudents(students.filter(s => s.id !== selectedStudent.id));
      toast({ title: "Deleted", description: `Student "${selectedStudent.name}" deleted successfully!` });
      setDeleteDialogOpen(false);
      setSelectedStudent(null);
    } catch (err: unknown) {
      toast({ title: "Error", description: err instanceof Error ? err.message : 'Failed to delete student', variant: "destructive" });
    }
  };

  const openEditDialog = (student: typeof students[0]) => {
    setSelectedStudent(student);
    setFormData({
      name: student.name,
      class: student.class,
      section: student.section,
      group: (student as any).group || '',
      guardianName: student.guardianName,
      guardianPhone: student.guardianPhone,
      status: student.status
    });
    setEditDialogOpen(true);
  };

  const openViewDialog = (student: typeof students[0]) => {
    setSelectedStudent(student);
    setViewDialogOpen(true);
  };

  const openDeleteDialog = (student: typeof students[0]) => {
    setSelectedStudent(student);
    setDeleteDialogOpen(true);
  };

  const handleExport = () => {
    toast({ title: "Exporting", description: "Student data is being exported..." });
    setTimeout(() => {
      toast({ title: "Success", description: "Export completed!" });
    }, 1000);
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="page-header">Students</h1>
          <p className="page-subtitle">Manage all students in your institute</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 bg-muted text-foreground rounded-xl hover:bg-muted/80 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button 
            onClick={() => { resetForm(); setAddDialogOpen(true); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-2xl p-4 md:p-6 border border-border/50 mb-6 animate-fade-in">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, ID, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
            />
          </div>
          
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
          >
            <option value="all">All Classes</option>
            {classes.map(cls => (
              <option key={cls.id} value={cls.name}>{cls.name}</option>
            ))}
          </select>

          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
          >
            <option value="all">All Sections</option>
            {sections.map(sec => (
              <option key={sec} value={sec}>Section {sec}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{paginatedStudents.length}</span> of{' '}
          <span className="font-medium text-foreground">{filteredStudents.length}</span> students
        </p>
      </div>

      {/* Students Table */}
      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden animate-fade-in">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Student</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground hidden sm:table-cell">Roll</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Class</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Guardian</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">Due Amount</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedStudents.map((student, index) => (
                <tr 
                  key={student.id} 
                  className="table-row animate-fade-in"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-5 h-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground truncate">{student.name}</p>
                        <p className="text-xs text-muted-foreground">{student.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 hidden sm:table-cell">
                    <span className="text-sm font-medium text-foreground">{student.roll}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <span className="text-sm text-foreground">{student.class}</span>
                      <span className="text-muted-foreground"> ({student.section})</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 hidden md:table-cell">
                    <div>
                      <p className="text-sm text-foreground">{student.guardianName}</p>
                      <p className="text-xs text-muted-foreground">{student.guardianPhone}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 hidden lg:table-cell">
                    <span className={cn(
                      'text-sm font-medium',
                      student.dueAmount > 0 ? 'text-destructive' : 'text-success'
                    )}>
                      {student.dueAmount > 0 ? `৳${student.dueAmount.toLocaleString()}` : 'Paid'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={cn(
                      'inline-flex px-2.5 py-1 rounded-full text-xs font-medium',
                      student.status === 'active' 
                        ? 'bg-success/10 text-success' 
                        : 'bg-muted text-muted-foreground'
                    )}>
                      {student.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-1">
                      <button 
                        onClick={() => openViewDialog(student)}
                        className="p-2 rounded-lg hover:bg-muted transition-colors" 
                        title="View"
                      >
                        <Eye className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                      </button>
                      <button 
                        onClick={() => openEditDialog(student)}
                        className="p-2 rounded-lg hover:bg-muted transition-colors" 
                        title="Edit"
                      >
                        <Edit className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                      </button>
                      <button 
                        onClick={() => openDeleteDialog(student)}
                        className="p-2 rounded-lg hover:bg-destructive/10 transition-colors" 
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={cn(
                      'w-8 h-8 rounded-lg text-sm font-medium transition-colors',
                      currentPage === pageNum
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    )}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Student Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <input
              type="text"
              placeholder="Student Name *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <div className="grid grid-cols-2 gap-4">
              <select
                value={formData.class}
                onChange={(e) => setFormData({ ...formData, class: e.target.value, group: '' })}
                className="px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Select Class *</option>
                {classes.map(cls => (
                  <option key={cls.id} value={cls.name}>{cls.name}</option>
                ))}
              </select>
              <select
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                className="px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Section</option>
                {sections.map(sec => (
                  <option key={sec} value={sec}>Section {sec}</option>
                ))}
              </select>
            </div>
            {/* Group Selection for Class 9 & 10 */}
            {isHigherClass(formData.class) && (
              <select
                value={formData.group}
                onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Select Group (Required) *</option>
                <option value="science">Science (বিজ্ঞান)</option>
                <option value="business">Business Studies (ব্যবসায় শিক্ষা)</option>
                <option value="arts">Arts / Humanities (মানবিক)</option>
              </select>
            )}
            <input
              type="text"
              placeholder="Guardian Name"
              value={formData.guardianName}
              onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
              className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={formData.guardianPhone}
              onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
              className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <button
              onClick={handleAdd}
              className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors font-medium"
            >
              Add Student
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Student Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <input
              type="text"
              placeholder="Student Name *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <div className="grid grid-cols-2 gap-4">
              <select
                value={formData.class}
                onChange={(e) => setFormData({ ...formData, class: e.target.value, group: '' })}
                className="px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Select Class *</option>
                {classes.map(cls => (
                  <option key={cls.id} value={cls.name}>{cls.name}</option>
                ))}
              </select>
              <select
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                className="px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Section</option>
                {sections.map(sec => (
                  <option key={sec} value={sec}>Section {sec}</option>
                ))}
              </select>
            </div>
            {/* Group Selection for Class 9 & 10 */}
            {isHigherClass(formData.class) && (
              <select
                value={formData.group}
                onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Select Group (Required) *</option>
                <option value="science">Science (বিজ্ঞান)</option>
                <option value="business">Business Studies (ব্যবসায় শিক্ষা)</option>
                <option value="arts">Arts / Humanities (মানবিক)</option>
              </select>
            )}
            <input
              type="text"
              placeholder="Guardian Name"
              value={formData.guardianName}
              onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
              className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={formData.guardianPhone}
              onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
              className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <button
              onClick={handleEdit}
              className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors font-medium"
            >
              Update Student
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Student Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                  <GraduationCap className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{selectedStudent.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedStudent.id}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground">Class</p>
                  <p className="text-sm font-medium text-foreground">{selectedStudent.class} ({selectedStudent.section})</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Roll</p>
                  <p className="text-sm font-medium text-foreground">{selectedStudent.roll}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Guardian</p>
                  <p className="text-sm font-medium text-foreground">{selectedStudent.guardianName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium text-foreground">{selectedStudent.guardianPhone}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Due Amount</p>
                  <p className={cn('text-sm font-medium', selectedStudent.dueAmount > 0 ? 'text-destructive' : 'text-success')}>
                    {selectedStudent.dueAmount > 0 ? `৳${selectedStudent.dueAmount.toLocaleString()}` : 'Paid'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <span className={cn(
                    'inline-flex px-2.5 py-1 rounded-full text-xs font-medium',
                    selectedStudent.status === 'active' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                  )}>
                    {selectedStudent.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Student?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedStudent?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default Students;
