import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Plus,
  Download,
  Eye,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Crown,
  Shield,
  Users,
  Building2,
  Award,
  Calendar,
  ChevronDown,
  ChevronUp,
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
  administrationMembers as initialMembers,
  type AdministrationMember,
} from '@/data/administrationData';
import api from '@/services/api';

const Administration: React.FC = () => {
  const { toast } = useToast();
  const [members, setMembers] = useState<AdministrationMember[]>(initialMembers);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await api.getAdministration();
        if (res.success && Array.isArray(res.data)) {
          const mapped = (res.data as Array<Record<string, unknown>>).map((m): AdministrationMember => ({
            id: (m._id || '') as string,
            name: (m.name || '') as string,
            nameBn: (m.nameBn || '') as string,
            designation: (m.designation || '') as string,
            designationBn: (m.designationBn || '') as string,
            category: (m.category || 'governing-body') as AdministrationMember['category'],
            committeeRole: (m.committeeRole || '') as string,
            phone: (m.phone || '') as string,
            email: (m.email || '') as string,
            address: (m.address || '') as string,
            bio: (m.bio || '') as string,
            qualifications: (m.qualifications || '') as string,
            occupation: (m.occupation || '') as string,
            occupationBn: (m.occupationBn || '') as string,
            appointmentDate: (m.appointmentDate ? new Date(m.appointmentDate as string).toISOString().split('T')[0] : '') as string,
            tenureEnd: m.tenureEnd ? new Date(m.tenureEnd as string).toISOString().split('T')[0] : undefined,
            status: (m.status || 'active') as AdministrationMember['status'],
            responsibilities: Array.isArray(m.responsibilities) ? m.responsibilities as string[] : [],
            achievements: Array.isArray(m.achievements) ? m.achievements as string[] : [],
          }));
          setMembers(mapped);
        }
      } catch {
        console.log('Using demo data (backend not available)');
      }
    };
    fetchAdmin();
  }, []);
  const [activeTab, setActiveTab] = useState<'director' | 'governing-body' | 'committee'>('director');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<AdministrationMember | null>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    nameBn: '',
    designation: '',
    designationBn: '',
    category: 'governing-body' as AdministrationMember['category'],
    committeeRole: '',
    phone: '',
    email: '',
    address: '',
    bio: '',
    qualifications: '',
    occupation: '',
    occupationBn: '',
    appointmentDate: '',
    tenureEnd: '',
    status: 'active' as AdministrationMember['status'],
    responsibilities: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      nameBn: '',
      designation: '',
      designationBn: '',
      category: activeTab,
      committeeRole: '',
      phone: '',
      email: '',
      address: '',
      bio: '',
      qualifications: '',
      occupation: '',
      occupationBn: '',
      appointmentDate: '',
      tenureEnd: '',
      status: 'active',
      responsibilities: '',
    });
  };

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchesTab = m.category === activeTab;
      const matchesSearch =
        searchQuery === '' ||
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.nameBn.includes(searchQuery) ||
        m.designation.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [members, activeTab, searchQuery]);

  const stats = useMemo(() => ({
    directors: members.filter((m) => m.category === 'director').length,
    governingBody: members.filter((m) => m.category === 'governing-body').length,
    committee: members.filter((m) => m.category === 'committee').length,
    active: members.filter((m) => m.status === 'active').length,
  }), [members]);

  const handleAdd = async () => {
    if (!formData.name || !formData.designation) {
      toast({ title: 'Error', description: 'Please fill required fields', variant: 'destructive' });
      return;
    }
    try {
      const apiData = {
        name: formData.name,
        nameBn: formData.nameBn || formData.name,
        designation: formData.designation,
        designationBn: formData.designationBn || formData.designation,
        category: formData.category,
        committeeRole: formData.committeeRole || undefined,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        bio: formData.bio,
        qualifications: formData.qualifications,
        occupation: formData.occupation,
        occupationBn: formData.occupationBn || formData.occupation,
        appointmentDate: formData.appointmentDate || new Date().toISOString().split('T')[0],
        tenureEnd: formData.tenureEnd || undefined,
        status: formData.status,
        responsibilities: formData.responsibilities.split(',').map((r) => r.trim()).filter(Boolean),
      };
      const res = await api.createAdministration(apiData);
      if (res.success) {
        const d = res.data as Record<string, unknown>;
        const newMember: AdministrationMember = {
          id: (d._id || '') as string,
          name: (d.name || '') as string,
          nameBn: (d.nameBn || '') as string,
          designation: (d.designation || '') as string,
          designationBn: (d.designationBn || '') as string,
          category: (d.category || activeTab) as AdministrationMember['category'],
          committeeRole: (d.committeeRole || undefined) as string | undefined,
          phone: (d.phone || '') as string,
          email: (d.email || '') as string,
          address: (d.address || '') as string,
          bio: (d.bio || '') as string,
          qualifications: (d.qualifications || '') as string,
          occupation: (d.occupation || '') as string,
          occupationBn: (d.occupationBn || '') as string,
          appointmentDate: (d.appointmentDate || '') as string,
          tenureEnd: (d.tenureEnd || undefined) as string | undefined,
          status: (d.status || 'active') as AdministrationMember['status'],
          responsibilities: Array.isArray(d.responsibilities) ? d.responsibilities as string[] : [],
        };
        setMembers([...members, newMember]);
        toast({ title: 'Success', description: `${formData.name} added to ${activeTab === 'director' ? 'Directors' : activeTab === 'governing-body' ? 'Governing Body' : 'Committee'}` });
        resetForm();
        setAddDialogOpen(false);
      }
    } catch (err: unknown) {
      toast({ title: 'Error', description: err instanceof Error ? err.message : 'Failed to add member', variant: 'destructive' });
    }
  };

  const handleEdit = async () => {
    if (!selectedMember || !formData.name) {
      toast({ title: 'Error', description: 'Please fill required fields', variant: 'destructive' });
      return;
    }
    try {
      const apiData = {
        name: formData.name,
        nameBn: formData.nameBn || formData.name,
        designation: formData.designation,
        designationBn: formData.designationBn || formData.designation,
        category: formData.category,
        committeeRole: formData.committeeRole || undefined,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        bio: formData.bio,
        qualifications: formData.qualifications,
        occupation: formData.occupation,
        occupationBn: formData.occupationBn || formData.occupation,
        appointmentDate: formData.appointmentDate,
        tenureEnd: formData.tenureEnd || undefined,
        status: formData.status,
        responsibilities: formData.responsibilities.split(',').map((r) => r.trim()).filter(Boolean),
      };
      await api.updateAdministration(selectedMember.id, apiData);
      setMembers(members.map((m) =>
        m.id === selectedMember.id
          ? {
              ...m, name: formData.name, nameBn: formData.nameBn || formData.name,
              designation: formData.designation, designationBn: formData.designationBn || formData.designation,
              category: formData.category, committeeRole: formData.committeeRole || undefined,
              phone: formData.phone, email: formData.email, address: formData.address,
              bio: formData.bio, qualifications: formData.qualifications,
              occupation: formData.occupation, occupationBn: formData.occupationBn || formData.occupation,
              appointmentDate: formData.appointmentDate, tenureEnd: formData.tenureEnd || undefined,
              status: formData.status,
              responsibilities: formData.responsibilities.split(',').map((r) => r.trim()).filter(Boolean),
            }
          : m
      ));
      toast({ title: 'Success', description: `${formData.name} updated successfully` });
      resetForm();
      setEditDialogOpen(false);
      setSelectedMember(null);
    } catch (err: unknown) {
      toast({ title: 'Error', description: err instanceof Error ? err.message : 'Failed to update member', variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!selectedMember) return;
    try {
      await api.deleteAdministration(selectedMember.id);
      setMembers(members.filter((m) => m.id !== selectedMember.id));
      toast({ title: 'Deleted', description: `${selectedMember.name} removed` });
      setDeleteDialogOpen(false);
      setSelectedMember(null);
    } catch (err: unknown) {
      toast({ title: 'Error', description: err instanceof Error ? err.message : 'Failed to delete member', variant: 'destructive' });
    }
  };

  const openEditDialog = (member: AdministrationMember) => {
    setSelectedMember(member);
    setFormData({
      name: member.name,
      nameBn: member.nameBn,
      designation: member.designation,
      designationBn: member.designationBn,
      category: member.category,
      committeeRole: member.committeeRole || '',
      phone: member.phone,
      email: member.email,
      address: member.address,
      bio: member.bio,
      qualifications: member.qualifications,
      occupation: member.occupation,
      occupationBn: member.occupationBn,
      appointmentDate: member.appointmentDate,
      tenureEnd: member.tenureEnd || '',
      status: member.status,
      responsibilities: member.responsibilities.join(', '),
    });
    setEditDialogOpen(true);
  };

  const tabConfig = [
    { key: 'director' as const, label: 'Directors', labelBn: 'পরিচালক', icon: Crown, count: stats.directors },
    { key: 'governing-body' as const, label: 'Governing Body', labelBn: 'পরিচালনা পর্ষদ', icon: Shield, count: stats.governingBody },
    { key: 'committee' as const, label: 'Committees', labelBn: 'কমিটি', icon: Users, count: stats.committee },
  ];

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      inactive: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      emeritus: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    };
    return (
      <span className={cn('px-2 py-0.5 text-xs rounded-full font-medium', styles[status] || '')}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const AdminFormFields = () => (
    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name (English) *</label>
          <input type="text" className="w-full p-2 border rounded-lg bg-background" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Name (বাংলা)</label>
          <input type="text" className="w-full p-2 border rounded-lg bg-background" value={formData.nameBn} onChange={(e) => setFormData({ ...formData, nameBn: e.target.value })} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Designation *</label>
          <input type="text" className="w-full p-2 border rounded-lg bg-background" placeholder="e.g. President, Secretary" value={formData.designation} onChange={(e) => setFormData({ ...formData, designation: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Designation (বাংলা)</label>
          <input type="text" className="w-full p-2 border rounded-lg bg-background" value={formData.designationBn} onChange={(e) => setFormData({ ...formData, designationBn: e.target.value })} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select className="w-full p-2 border rounded-lg bg-background" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value as AdministrationMember['category'] })}>
            <option value="director">Director</option>
            <option value="governing-body">Governing Body</option>
            <option value="committee">Committee</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Committee Role</label>
          <input type="text" className="w-full p-2 border rounded-lg bg-background" placeholder="e.g. Member (Education Expert)" value={formData.committeeRole} onChange={(e) => setFormData({ ...formData, committeeRole: e.target.value })} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input type="text" className="w-full p-2 border rounded-lg bg-background" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input type="email" className="w-full p-2 border rounded-lg bg-background" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Address</label>
        <input type="text" className="w-full p-2 border rounded-lg bg-background" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Occupation</label>
          <input type="text" className="w-full p-2 border rounded-lg bg-background" value={formData.occupation} onChange={(e) => setFormData({ ...formData, occupation: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Occupation (বাংলা)</label>
          <input type="text" className="w-full p-2 border rounded-lg bg-background" value={formData.occupationBn} onChange={(e) => setFormData({ ...formData, occupationBn: e.target.value })} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Qualifications</label>
        <input type="text" className="w-full p-2 border rounded-lg bg-background" placeholder="e.g. Ph.D, M.Ed, B.Ed" value={formData.qualifications} onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Appointment Date</label>
          <input type="date" className="w-full p-2 border rounded-lg bg-background" value={formData.appointmentDate} onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tenure End</label>
          <input type="date" className="w-full p-2 border rounded-lg bg-background" value={formData.tenureEnd} onChange={(e) => setFormData({ ...formData, tenureEnd: e.target.value })} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <select className="w-full p-2 border rounded-lg bg-background" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as AdministrationMember['status'] })}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="emeritus">Emeritus</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Bio</label>
        <textarea className="w-full p-2 border rounded-lg bg-background" rows={3} value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Responsibilities (comma separated)</label>
        <textarea className="w-full p-2 border rounded-lg bg-background" rows={2} value={formData.responsibilities} onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })} />
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="page-header">School Administration</h1>
        <p className="page-subtitle">
          Manage directors, governing body, and committee members
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <Crown className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.directors}</p>
              <p className="text-xs text-muted-foreground">Directors</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.governingBody}</p>
              <p className="text-xs text-muted-foreground">Governing Body</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary/10">
              <Users className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.committee}</p>
              <p className="text-xs text-muted-foreground">Committee Members</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <Building2 className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.active}</p>
              <p className="text-xs text-muted-foreground">Active Members</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="glass-card p-1 mb-6">
        <div className="flex flex-col sm:flex-row gap-1">
          {tabConfig.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all flex-1 justify-center',
                activeTab === tab.key
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'hover:bg-muted text-muted-foreground'
              )}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span className={cn(
                'px-2 py-0.5 text-xs rounded-full',
                activeTab === tab.key ? 'bg-primary-foreground/20' : 'bg-muted'
              )}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Search & Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search members..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button
          onClick={() => { resetForm(); setAddDialogOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Member
        </button>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => {
          const isExpanded = expandedCard === member.id;
          return (
            <div
              key={member.id}
              className="glass-card overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              {/* Header with gradient */}
              <div className={cn(
                'p-4 text-white',
                member.category === 'director'
                  ? 'bg-gradient-to-r from-amber-600 to-amber-500'
                  : member.category === 'governing-body'
                  ? 'bg-gradient-to-r from-primary to-primary/80'
                  : 'bg-gradient-to-r from-secondary to-secondary/80'
              )}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{member.name}</h3>
                      <p className="text-xs opacity-80">{member.nameBn}</p>
                    </div>
                  </div>
                  {statusBadge(member.status)}
                </div>
              </div>

              {/* Body */}
              <div className="p-4">
                <div className="mb-3">
                  <p className="font-semibold text-sm">{member.designation}</p>
                  <p className="text-xs text-muted-foreground">{member.designationBn}</p>
                  {member.committeeRole && (
                    <span className="inline-block mt-1 px-2 py-0.5 text-[10px] bg-muted rounded-full">
                      {member.committeeRole}
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Briefcase className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="text-xs truncate">{member.occupation}</span>
                  </div>
                  {member.phone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="text-xs">{member.phone}</span>
                    </div>
                  )}
                  {member.email && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="text-xs truncate">{member.email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="text-xs">
                      Since {member.appointmentDate}
                      {member.tenureEnd && ` — Until ${member.tenureEnd}`}
                    </span>
                  </div>
                </div>

                {/* Expandable section */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-border space-y-3 animate-fade-in">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Qualifications</p>
                      <p className="text-xs">{member.qualifications}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Bio</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{member.bio}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Responsibilities</p>
                      <ul className="space-y-1">
                        {member.responsibilities.map((r, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {member.achievements && member.achievements.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-1">Achievements</p>
                        <ul className="space-y-1">
                          {member.achievements.map((a, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs">
                              <Award className="w-3 h-3 text-amber-500 mt-0.5 flex-shrink-0" />
                              {a}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                  <button
                    onClick={() => setExpandedCard(isExpanded ? null : member.id)}
                    className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="w-3.5 h-3.5" /> Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3.5 h-3.5" /> More
                      </>
                    )}
                  </button>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEditDialog(member)}
                      className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => { setSelectedMember(member); setDeleteDialogOpen(true); }}
                      className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No members found in this category</p>
        </div>
      )}

      {/* Add Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Administration Member</DialogTitle>
          </DialogHeader>
          <AdminFormFields />
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={() => setAddDialogOpen(false)} className="px-4 py-2 border rounded-lg hover:bg-muted">Cancel</button>
            <button onClick={handleAdd} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">Add Member</button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Administration Member</DialogTitle>
          </DialogHeader>
          <AdminFormFields />
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
            <AlertDialogTitle>Remove Administration Member?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove <strong>{selectedMember?.name}</strong> ({selectedMember?.designation}) from the administration? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

const Briefcase = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

export default Administration;
