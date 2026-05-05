import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Download, 
  Eye, 
  Edit, 
  Trash2,
  Mail,
  Phone,
  Users
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { teachers as initialTeachers } from '@/data/demoData';
import api from '@/services/api';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

const Teachers: React.FC = () => {
  const { toast } = useToast();
  const [teachers, setTeachers] = useState(initialTeachers);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await api.getTeachers();
        const rawData = res.data as Record<string, unknown>;
        const teacherList = Array.isArray(rawData) ? rawData : (rawData?.teachers || []) as Array<Record<string, unknown>>;
        if (res.success && Array.isArray(teacherList) && teacherList.length > 0) {
          const mapped = teacherList.map((t: Record<string, unknown>) => ({
            id: (t._id || t.teacherId || '') as string,
            name: (t.name || '') as string,
            nameBn: (t.nameBn || '') as string,
            designation: (t.designation || '') as string,
            department: (t.department || '') as string,
            phone: (t.phone || '') as string,
            email: (t.email || '') as string,
            joinDate: (t.joinDate ? new Date(t.joinDate as string).toISOString().split('T')[0] : '') as string,
            salary: (t.salary || 0) as number,
            status: (t.status || 'active') as 'active' | 'inactive',
            gender: (t.gender || 'male') as 'male' | 'female',
          }));
          setTeachers(mapped);
        }
      } catch {
        console.log('Using demo data (backend not available)');
      }
    };
    fetchTeachers();
  }, []);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<typeof teachers[0] | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    designation: '',
    salary: '',
    status: 'active'
  });

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '', department: '', designation: '', salary: '', status: 'active' });
  };

  const departments = useMemo(() => {
    return [...new Set(teachers.map(t => t.department))];
  }, [teachers]);

  const filteredTeachers = useMemo(() => {
    return teachers.filter(teacher => {
      const matchesSearch = teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           teacher.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDept = selectedDepartment === 'all' || teacher.department === selectedDepartment;
      const matchesStatus = selectedStatus === 'all' || teacher.status === selectedStatus;
      
      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [teachers, searchQuery, selectedDepartment, selectedStatus]);

  const handleAdd = () => {
    if (!formData.name || !formData.email || !formData.department) {
      toast({ title: "Error", description: "Please fill required fields", variant: "destructive" });
      return;
    }
    const newTeacher = {
      id: `TCH${Date.now()}`,
      name: formData.name,
      nameBn: formData.name,
      email: formData.email,
      phone: formData.phone,
      department: formData.department,
      designation: formData.designation || 'Teacher',
      salary: parseInt(formData.salary) || 25000,
      status: formData.status as 'active' | 'inactive',
      joinDate: new Date().toISOString().split('T')[0],
      gender: 'male' as const
    };
    setTeachers([newTeacher, ...teachers]);
    toast({ title: "Success", description: `Teacher "${formData.name}" added successfully!` });
    resetForm();
    setAddDialogOpen(false);
  };

  const handleEdit = () => {
    if (!selectedTeacher || !formData.name || !formData.email) {
      toast({ title: "Error", description: "Please fill required fields", variant: "destructive" });
      return;
    }
    setTeachers(teachers.map(t => 
      t.id === selectedTeacher.id 
        ? { ...t, name: formData.name, email: formData.email, phone: formData.phone, department: formData.department, designation: formData.designation, salary: parseInt(formData.salary) || t.salary, status: formData.status as 'active' | 'inactive' }
        : t
    ));
    toast({ title: "Success", description: `Teacher "${formData.name}" updated successfully!` });
    resetForm();
    setEditDialogOpen(false);
    setSelectedTeacher(null);
  };

  const handleDelete = () => {
    if (!selectedTeacher) return;
    setTeachers(teachers.filter(t => t.id !== selectedTeacher.id));
    toast({ title: "Deleted", description: `Teacher "${selectedTeacher.name}" deleted successfully!` });
    setDeleteDialogOpen(false);
    setSelectedTeacher(null);
  };

  const openEditDialog = (teacher: typeof teachers[0]) => {
    setSelectedTeacher(teacher);
    setFormData({
      name: teacher.name,
      email: teacher.email,
      phone: teacher.phone,
      department: teacher.department,
      designation: teacher.designation,
      salary: teacher.salary.toString(),
      status: teacher.status
    });
    setEditDialogOpen(true);
  };

  const openViewDialog = (teacher: typeof teachers[0]) => {
    setSelectedTeacher(teacher);
    setViewDialogOpen(true);
  };

  const openDeleteDialog = (teacher: typeof teachers[0]) => {
    setSelectedTeacher(teacher);
    setDeleteDialogOpen(true);
  };

  const handleExport = () => {
    toast({ title: "Exporting", description: "Teacher data is being exported..." });
    setTimeout(() => {
      toast({ title: "Success", description: "Export completed!" });
    }, 1000);
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="page-header">Teachers & Staff</h1>
          <p className="page-subtitle">Manage all employees in your institute</p>
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
            <span>Add Teacher</span>
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
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
            />
          </div>
          
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
          >
            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
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
          Showing <span className="font-medium text-foreground">{filteredTeachers.length}</span> teachers
        </p>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeachers.map((teacher, index) => (
          <div 
            key={teacher.id}
            className="bg-card rounded-2xl p-6 border border-border/50 hover:shadow-lg transition-all duration-300 animate-fade-in hover-lift"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <Users className="w-7 h-7 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{teacher.name}</h3>
                  <p className="text-sm text-muted-foreground">{teacher.designation}</p>
                </div>
              </div>
              <span className={cn(
                'px-2.5 py-1 rounded-full text-xs font-medium',
                teacher.status === 'active' 
                  ? 'bg-success/10 text-success' 
                  : 'bg-muted text-muted-foreground'
              )}>
                {teacher.status === 'active' ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="px-2 py-1 bg-primary/10 text-primary rounded-lg text-xs font-medium">
                  {teacher.department}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span className="truncate">{teacher.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>{teacher.phone}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div>
                <p className="text-xs text-muted-foreground">Monthly Salary</p>
                <p className="text-lg font-semibold text-foreground">৳{teacher.salary.toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => openViewDialog(teacher)}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <Eye className="w-4 h-4 text-muted-foreground" />
                </button>
                <button 
                  onClick={() => openEditDialog(teacher)}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <Edit className="w-4 h-4 text-muted-foreground" />
                </button>
                <button 
                  onClick={() => openDeleteDialog(teacher)}
                  className="p-2 rounded-lg hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Teacher Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Teacher</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <input
              type="text"
              placeholder="Full Name *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              type="email"
              placeholder="Email Address *"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <div className="grid grid-cols-2 gap-4">
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Department *</option>
                <option value="Bengali">Bengali</option>
                <option value="English">English</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
                <option value="Social Science">Social Science</option>
                <option value="Religion">Religion</option>
                <option value="ICT">ICT</option>
                <option value="Physical Education">Physical Education</option>
              </select>
              <input
                type="text"
                placeholder="Designation"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Salary (৳)"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                className="px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <button
              onClick={handleAdd}
              className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors font-medium"
            >
              Add Teacher
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Teacher Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Teacher</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <input
              type="text"
              placeholder="Full Name *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              type="email"
              placeholder="Email Address *"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <div className="grid grid-cols-2 gap-4">
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Department *</option>
                <option value="Bengali">Bengali</option>
                <option value="English">English</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
                <option value="Social Science">Social Science</option>
                <option value="Religion">Religion</option>
                <option value="ICT">ICT</option>
                <option value="Physical Education">Physical Education</option>
              </select>
              <input
                type="text"
                placeholder="Designation"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Salary (৳)"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                className="px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <button
              onClick={handleEdit}
              className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors font-medium"
            >
              Update Teacher
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Teacher Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Teacher Details</DialogTitle>
          </DialogHeader>
          {selectedTeacher && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <Users className="w-8 h-8 text-secondary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{selectedTeacher.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedTeacher.designation}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground">Department</p>
                  <p className="text-sm font-medium text-foreground">{selectedTeacher.department}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium text-foreground">{selectedTeacher.email}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium text-foreground">{selectedTeacher.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Salary</p>
                  <p className="text-sm font-medium text-foreground">৳{selectedTeacher.salary.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Joining Date</p>
                  <p className="text-sm font-medium text-foreground">{selectedTeacher.joinDate}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <span className={cn(
                    'inline-flex px-2.5 py-1 rounded-full text-xs font-medium',
                    selectedTeacher.status === 'active' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                  )}>
                    {selectedTeacher.status === 'active' ? 'Active' : 'Inactive'}
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
            <AlertDialogTitle>Delete Teacher?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedTeacher?.name}"? This action cannot be undone.
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

export default Teachers;
