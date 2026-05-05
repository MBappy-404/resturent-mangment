import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Download,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
  Users,
  UserCheck,
  UserX,
  Briefcase,
  Shield,
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
import {
  staffMembers as initialStaff,
  staffRoles,
  departments,
  type StaffMember,
} from '@/data/staffData';

const SchoolStaff: React.FC = () => {
  const { toast } = useToast();
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    nameBn: '',
    role: 'Assistant Teacher',
    department: 'Bangla',
    phone: '',
    email: '',
    salary: '',
    status: 'active',
    nid: '',
    address: '',
    qualifications: '',
    responsibilities: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      nameBn: '',
      role: 'Assistant Teacher',
      department: 'Bangla',
      phone: '',
      email: '',
      salary: '',
      status: 'active',
      nid: '',
      address: '',
      qualifications: '',
      responsibilities: '',
    });
  };

  const filteredStaff = useMemo(() => {
    return staff.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.nameBn.includes(searchQuery) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = selectedRole === 'all' || s.role === selectedRole;
      const matchesDept =
        selectedDepartment === 'all' || s.department === selectedDepartment;
      const matchesStatus =
        selectedStatus === 'all' || s.status === selectedStatus;
      const matchesCategory =
        selectedCategory === 'all' ||
        staffRoles.find((r) => r.role === s.role)?.category === selectedCategory;
      return matchesSearch && matchesRole && matchesDept && matchesStatus && matchesCategory;
    });
  }, [staff, searchQuery, selectedRole, selectedDepartment, selectedStatus, selectedCategory]);

  const stats = useMemo(() => {
    return {
      total: staff.length,
      active: staff.filter((s) => s.status === 'active').length,
      onLeave: staff.filter((s) => s.status === 'on-leave').length,
      teaching: staff.filter((s) =>
        staffRoles
          .filter((r) => r.category === 'Teaching')
          .map((r) => r.role)
          .includes(s.role as never)
      ).length,
      totalSalary: staff.reduce((sum, s) => sum + s.salary, 0),
    };
  }, [staff]);

  const handleAdd = () => {
    if (!formData.name || !formData.phone) {
      toast({
        title: 'Error',
        description: 'Please fill required fields',
        variant: 'destructive',
      });
      return;
    }
    const roleInfo = staffRoles.find((r) => r.role === formData.role);
    const newStaff: StaffMember = {
      id: `STF${Date.now()}`,
      name: formData.name,
      nameBn: formData.nameBn || formData.name,
      role: formData.role,
      roleBn: roleInfo?.roleBn || formData.role,
      department: formData.department,
      phone: formData.phone,
      email: formData.email,
      joinDate: new Date().toISOString().split('T')[0],
      salary: parseInt(formData.salary) || 15000,
      status: formData.status as StaffMember['status'],
      gender: 'male',
      nid: formData.nid,
      address: formData.address,
      qualifications: formData.qualifications,
      responsibilities: formData.responsibilities
        .split(',')
        .map((r) => r.trim())
        .filter(Boolean),
    };
    setStaff([newStaff, ...staff]);
    toast({
      title: 'Success',
      description: `Staff member "${formData.name}" added successfully!`,
    });
    resetForm();
    setAddDialogOpen(false);
  };

  const handleEdit = () => {
    if (!selectedStaff || !formData.name) {
      toast({
        title: 'Error',
        description: 'Please fill required fields',
        variant: 'destructive',
      });
      return;
    }
    const roleInfo = staffRoles.find((r) => r.role === formData.role);
    setStaff(
      staff.map((s) =>
        s.id === selectedStaff.id
          ? {
              ...s,
              name: formData.name,
              nameBn: formData.nameBn || formData.name,
              role: formData.role,
              roleBn: roleInfo?.roleBn || formData.role,
              department: formData.department,
              phone: formData.phone,
              email: formData.email,
              salary: parseInt(formData.salary) || s.salary,
              status: formData.status as StaffMember['status'],
              nid: formData.nid,
              address: formData.address,
              qualifications: formData.qualifications,
              responsibilities: formData.responsibilities
                .split(',')
                .map((r) => r.trim())
                .filter(Boolean),
            }
          : s
      )
    );
    toast({
      title: 'Success',
      description: `Staff member "${formData.name}" updated!`,
    });
    resetForm();
    setEditDialogOpen(false);
    setSelectedStaff(null);
  };

  const handleDelete = () => {
    if (!selectedStaff) return;
    setStaff(staff.filter((s) => s.id !== selectedStaff.id));
    toast({
      title: 'Deleted',
      description: `"${selectedStaff.name}" removed from staff list.`,
    });
    setDeleteDialogOpen(false);
    setSelectedStaff(null);
  };

  const openEditDialog = (member: StaffMember) => {
    setSelectedStaff(member);
    setFormData({
      name: member.name,
      nameBn: member.nameBn,
      role: member.role,
      department: member.department,
      phone: member.phone,
      email: member.email,
      salary: member.salary.toString(),
      status: member.status,
      nid: member.nid,
      address: member.address,
      qualifications: member.qualifications,
      responsibilities: member.responsibilities.join(', '),
    });
    setEditDialogOpen(true);
  };

  const openViewDialog = (member: StaffMember) => {
    setSelectedStaff(member);
    setViewDialogOpen(true);
  };

  const openDeleteDialog = (member: StaffMember) => {
    setSelectedStaff(member);
    setDeleteDialogOpen(true);
  };

  const handleExport = () => {
    const csvContent = [
      ['Name', 'Role', 'Department', 'Phone', 'Email', 'Salary', 'Status', 'Join Date'].join(','),
      ...filteredStaff.map((s) =>
        [s.name, s.role, s.department, s.phone, s.email, s.salary, s.status, s.joinDate].join(',')
      ),
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'staff-list.csv';
    a.click();
    toast({ title: 'Exported', description: 'Staff list exported as CSV' });
  };

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      inactive: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      'on-leave': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    };
    return (
      <span className={cn('px-2 py-1 text-xs rounded-full font-medium', styles[status] || '')}>
        {status === 'on-leave' ? 'On Leave' : status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const categoryBadge = (role: string) => {
    const cat = staffRoles.find((r) => r.role === role)?.category || 'General';
    const styles: Record<string, string> = {
      Teaching: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      Administrative: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      Support: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    };
    return (
      <span className={cn('px-2 py-0.5 text-[10px] rounded-full font-medium', styles[cat] || '')}>
        {cat}
      </span>
    );
  };

  const StaffFormFields = () => (
    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name (English) *</label>
          <input
            type="text"
            className="w-full p-2 border rounded-lg bg-background"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Name (বাংলা)</label>
          <input
            type="text"
            className="w-full p-2 border rounded-lg bg-background"
            value={formData.nameBn}
            onChange={(e) => setFormData({ ...formData, nameBn: e.target.value })}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Role *</label>
          <select
            className="w-full p-2 border rounded-lg bg-background"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            {staffRoles.map((r) => (
              <option key={r.role} value={r.role}>
                {r.role} ({r.roleBn})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Department *</label>
          <select
            className="w-full p-2 border rounded-lg bg-background"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          >
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Phone *</label>
          <input
            type="text"
            className="w-full p-2 border rounded-lg bg-background"
            placeholder="+880-1XXX-XXXXXX"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            className="w-full p-2 border rounded-lg bg-background"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Salary (BDT)</label>
          <input
            type="number"
            className="w-full p-2 border rounded-lg bg-background"
            value={formData.salary}
            onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            className="w-full p-2 border rounded-lg bg-background"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="on-leave">On Leave</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">NID Number</label>
          <input
            type="text"
            className="w-full p-2 border rounded-lg bg-background"
            value={formData.nid}
            onChange={(e) => setFormData({ ...formData, nid: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Address</label>
          <input
            type="text"
            className="w-full p-2 border rounded-lg bg-background"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Qualifications</label>
        <input
          type="text"
          className="w-full p-2 border rounded-lg bg-background"
          placeholder="e.g. M.A, B.Ed"
          value={formData.qualifications}
          onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Responsibilities (comma separated)</label>
        <textarea
          className="w-full p-2 border rounded-lg bg-background"
          rows={2}
          placeholder="Teaching, Exam coordination, Club advisor"
          value={formData.responsibilities}
          onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
        />
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="page-header">School Staff Management</h1>
        <p className="page-subtitle">
          Manage all school staff — teachers, administrative staff, and support personnel
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total Staff</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <UserCheck className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.active}</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-500/10">
              <UserX className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.onLeave}</p>
              <p className="text-xs text-muted-foreground">On Leave</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Briefcase className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.teaching}</p>
              <p className="text-xs text-muted-foreground">Teaching</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <Shield className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">৳{(stats.totalSalary / 1000).toFixed(0)}K</p>
              <p className="text-xs text-muted-foreground">Monthly Salary</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center flex-1">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search staff..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="px-3 py-2 border rounded-lg bg-background text-sm"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="Teaching">Teaching</option>
              <option value="Administrative">Administrative</option>
              <option value="Support">Support</option>
            </select>
            <select
              className="px-3 py-2 border rounded-lg bg-background text-sm"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <option value="all">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <select
              className="px-3 py-2 border rounded-lg bg-background text-sm"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="on-leave">On Leave</option>
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
              Add Staff
            </button>
          </div>
        </div>
      </div>

      {/* Staff Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground">Role</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground hidden md:table-cell">Department</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground hidden lg:table-cell">Phone</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground hidden lg:table-cell">Salary</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.map((member) => (
                <tr
                  key={member.id}
                  className="border-t border-border hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-sm">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.nameBn}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <p className="text-sm">{member.role}</p>
                      {categoryBadge(member.role)}
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-sm">{member.department}</td>
                  <td className="px-4 py-3 hidden lg:table-cell text-sm">{member.phone}</td>
                  <td className="px-4 py-3 hidden lg:table-cell text-sm font-medium">
                    ৳{member.salary.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">{statusBadge(member.status)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openViewDialog(member)}
                        className="p-2 rounded-lg hover:bg-muted transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditDialog(member)}
                        className="p-2 rounded-lg hover:bg-muted transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeleteDialog(member)}
                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredStaff.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No staff members found</p>
          </div>
        )}
      </div>

      <p className="text-sm text-muted-foreground mt-4">
        Showing {filteredStaff.length} of {staff.length} staff members
      </p>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Staff Details</DialogTitle>
          </DialogHeader>
          {selectedStaff && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">
                  {selectedStaff.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedStaff.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedStaff.nameBn}</p>
                  <div className="flex gap-2 mt-1">
                    {statusBadge(selectedStaff.status)}
                    {categoryBadge(selectedStaff.role)}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Role</p>
                  <p className="font-medium">{selectedStaff.role} ({selectedStaff.roleBn})</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Department</p>
                  <p className="font-medium">{selectedStaff.department}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Phone</p>
                  <p className="font-medium">{selectedStaff.phone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedStaff.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Monthly Salary</p>
                  <p className="font-medium">৳{selectedStaff.salary.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Join Date</p>
                  <p className="font-medium">{selectedStaff.joinDate}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">NID</p>
                  <p className="font-medium">{selectedStaff.nid}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Address</p>
                  <p className="font-medium">{selectedStaff.address}</p>
                </div>
              </div>
              <div>
                <p className="text-muted-foreground text-sm mb-1">Qualifications</p>
                <p className="text-sm font-medium">{selectedStaff.qualifications}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm mb-2">Responsibilities</p>
                <div className="flex flex-wrap gap-2">
                  {selectedStaff.responsibilities.map((r, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 text-xs bg-muted rounded-full"
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Staff Member</DialogTitle>
          </DialogHeader>
          <StaffFormFields />
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={() => setAddDialogOpen(false)} className="px-4 py-2 border rounded-lg hover:bg-muted">Cancel</button>
            <button onClick={handleAdd} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">Add Staff</button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Staff Member</DialogTitle>
          </DialogHeader>
          <StaffFormFields />
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={() => setEditDialogOpen(false)} className="px-4 py-2 border rounded-lg hover:bg-muted">Cancel</button>
            <button onClick={handleEdit} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">Update</button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Staff Member?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove <strong>{selectedStaff?.name}</strong> ({selectedStaff?.role}) from the staff list?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default SchoolStaff;
