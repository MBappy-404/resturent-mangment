import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Trash2,
  Users,
  Phone,
  Mail,
  GraduationCap,
  Download
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Guardian {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  occupation: string;
  relation: string;
  students: { id: string; name: string; class: string }[];
  status: 'active' | 'inactive';
}

const initialGuardians: Guardian[] = [
  { id: 'GRD-001', name: 'Md. Abdul Rahman', phone: '+880-1711-123456', email: 'rahman@email.com', address: 'Agrabad, Chittagong', occupation: 'Businessman', relation: 'Father', students: [{ id: 'STU-00001', name: 'Tanvir Rahman', class: 'Class 10' }], status: 'active' },
  { id: 'GRD-002', name: 'Fatima Begum', phone: '+880-1812-234567', email: 'fatima@email.com', address: 'Nasirabad, Chittagong', occupation: 'Doctor', relation: 'Mother', students: [{ id: 'STU-00002', name: 'Nusrat Jahan', class: 'Class 8' }, { id: 'STU-00003', name: 'Sabbir Ahmed', class: 'Class 5' }], status: 'active' },
  { id: 'GRD-003', name: 'Kamal Hossain', phone: '+880-1911-345678', email: 'kamal@email.com', address: 'Halishahar, Chittagong', occupation: 'Engineer', relation: 'Father', students: [{ id: 'STU-00004', name: 'Rafiq Hossain', class: 'Class 9' }], status: 'active' },
  { id: 'GRD-004', name: 'Jamal Uddin', phone: '+880-1611-456789', email: 'jamal@email.com', address: 'GEC Circle, Chittagong', occupation: 'Teacher', relation: 'Father', students: [{ id: 'STU-00005', name: 'Imran Uddin', class: 'Class 7' }], status: 'inactive' },
  { id: 'GRD-005', name: 'Rabeya Khatun', phone: '+880-1511-567890', email: 'rabeya@email.com', address: 'Khulshi, Chittagong', occupation: 'Housewife', relation: 'Mother', students: [{ id: 'STU-00006', name: 'Ayesha Khatun', class: 'Class 6' }], status: 'active' },
];

const Guardian: React.FC = () => {
  const [guardians, setGuardians] = useState<Guardian[]>(initialGuardians);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedGuardian, setSelectedGuardian] = useState<Guardian | null>(null);
  const [formData, setFormData] = useState<Partial<Guardian>>({});

  const filteredGuardians = guardians.filter(g => 
    g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.phone.includes(searchQuery)
  );

  const handleAdd = () => {
    const newGuardian: Guardian = {
      id: `GRD-${String(guardians.length + 1).padStart(3, '0')}`,
      name: formData.name || '',
      phone: formData.phone || '',
      email: formData.email || '',
      address: formData.address || '',
      occupation: formData.occupation || '',
      relation: formData.relation || 'Father',
      students: [],
      status: 'active'
    };
    setGuardians([...guardians, newGuardian]);
    setIsAddOpen(false);
    setFormData({});
    toast.success('Guardian added successfully');
  };

  const handleEdit = () => {
    if (!selectedGuardian) return;
    setGuardians(guardians.map(g => g.id === selectedGuardian.id ? { ...g, ...formData } : g));
    setIsEditOpen(false);
    setSelectedGuardian(null);
    setFormData({});
    toast.success('Guardian updated successfully');
  };

  const handleDelete = () => {
    if (!selectedGuardian) return;
    setGuardians(guardians.filter(g => g.id !== selectedGuardian.id));
    setIsDeleteOpen(false);
    setSelectedGuardian(null);
    toast.success('Guardian deleted successfully');
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="page-header">Guardian Management</h1>
          <p className="page-subtitle">Manage guardians and parent information</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button onClick={() => setIsAddOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            <span>Add Guardian</span>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Guardians</p>
              <p className="text-2xl font-bold text-foreground">{guardians.length}</p>
            </div>
            <div className="p-3 rounded-xl bg-primary/10">
              <Users className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold text-success">{guardians.filter(g => g.status === 'active').length}</p>
            </div>
            <div className="p-3 rounded-xl bg-success/10">
              <Users className="w-6 h-6 text-success" />
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Students</p>
              <p className="text-2xl font-bold text-foreground">{guardians.reduce((acc, g) => acc + g.students.length, 0)}</p>
            </div>
            <div className="p-3 rounded-xl bg-secondary/10">
              <GraduationCap className="w-6 h-6 text-secondary" />
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">With Multiple</p>
              <p className="text-2xl font-bold text-foreground">{guardians.filter(g => g.students.length > 1).length}</p>
            </div>
            <div className="p-3 rounded-xl bg-warning/10">
              <Users className="w-6 h-6 text-warning" />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-card rounded-2xl p-4 md:p-6 border border-border/50 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Guardians Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGuardians.map((guardian) => (
          <div key={guardian.id} className="bg-card rounded-2xl p-6 border border-border/50 hover:shadow-lg transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{guardian.name}</h3>
                  <p className="text-sm text-muted-foreground">{guardian.relation}</p>
                </div>
              </div>
              <span className={cn('px-2 py-1 rounded-full text-xs font-medium',
                guardian.status === 'active' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
              )}>
                {guardian.status}
              </span>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>{guardian.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span className="truncate">{guardian.email}</span>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-xs text-muted-foreground mb-2">Students ({guardian.students.length})</p>
              <div className="space-y-1">
                {guardian.students.map(student => (
                  <div key={student.id} className="flex items-center gap-2 text-sm">
                    <GraduationCap className="w-3 h-3 text-primary" />
                    <span>{student.name}</span>
                    <span className="text-muted-foreground">- {student.class}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-1 pt-4 border-t border-border">
              <button onClick={() => { setSelectedGuardian(guardian); setIsViewOpen(true); }} className="p-2 rounded-lg hover:bg-muted">
                <Eye className="w-4 h-4 text-muted-foreground" />
              </button>
              <button onClick={() => { setSelectedGuardian(guardian); setFormData(guardian); setIsEditOpen(true); }} className="p-2 rounded-lg hover:bg-muted">
                <Edit className="w-4 h-4 text-muted-foreground" />
              </button>
              <button onClick={() => { setSelectedGuardian(guardian); setIsDeleteOpen(true); }} className="p-2 rounded-lg hover:bg-destructive/10">
                <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Guardian</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Name</Label>
              <Input value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Full name" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Phone</Label>
                <Input value={formData.phone || ''} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="+880-1XXX-XXXXXX" />
              </div>
              <div className="grid gap-2">
                <Label>Relation</Label>
                <select className="px-3 py-2 border border-border rounded-lg" value={formData.relation || 'Father'} onChange={(e) => setFormData({...formData, relation: e.target.value})}>
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Guardian">Guardian</option>
                </select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Email</Label>
              <Input type="email" value={formData.email || ''} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="email@example.com" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Occupation</Label>
                <Input value={formData.occupation || ''} onChange={(e) => setFormData({...formData, occupation: e.target.value})} placeholder="Businessman" />
              </div>
              <div className="grid gap-2">
                <Label>Address</Label>
                <Input value={formData.address || ''} onChange={(e) => setFormData({...formData, address: e.target.value})} placeholder="City, Area" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Add Guardian</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Guardian Details</DialogTitle></DialogHeader>
          {selectedGuardian && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-sm text-muted-foreground">Name</p><p className="font-medium">{selectedGuardian.name}</p></div>
                <div><p className="text-sm text-muted-foreground">Relation</p><p className="font-medium">{selectedGuardian.relation}</p></div>
                <div><p className="text-sm text-muted-foreground">Phone</p><p className="font-medium">{selectedGuardian.phone}</p></div>
                <div><p className="text-sm text-muted-foreground">Email</p><p className="font-medium">{selectedGuardian.email}</p></div>
                <div><p className="text-sm text-muted-foreground">Occupation</p><p className="font-medium">{selectedGuardian.occupation}</p></div>
                <div><p className="text-sm text-muted-foreground">Address</p><p className="font-medium">{selectedGuardian.address}</p></div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Students</p>
                {selectedGuardian.students.map(s => (
                  <p key={s.id} className="font-medium">{s.name} - {s.class}</p>
                ))}
              </div>
            </div>
          )}
          <DialogFooter><Button onClick={() => setIsViewOpen(false)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Guardian</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Name</Label>
              <Input value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Phone</Label>
                <Input value={formData.phone || ''} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="grid gap-2">
                <Label>Email</Label>
                <Input value={formData.email || ''} onChange={(e) => setFormData({...formData, email: e.target.value})} />
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
          <DialogHeader><DialogTitle>Delete Guardian</DialogTitle></DialogHeader>
          <p className="py-4">Are you sure you want to delete "{selectedGuardian?.name}"? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Guardian;
