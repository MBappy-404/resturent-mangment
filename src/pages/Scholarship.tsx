import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
  Award,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  GraduationCap,
  Users,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  Calendar,
} from 'lucide-react';
import api from '@/services/api';

interface ScholarshipProgram {
  id: string;
  name: string;
  nameBn: string;
  description: string;
  amount: number;
  eligibility: string;
  deadline: string;
  totalSlots: number;
  filledSlots: number;
  status: 'active' | 'closed' | 'upcoming';
  sponsor: string;
}

interface ScholarshipApplication {
  id: string;
  programId: string;
  programName: string;
  studentId: string;
  studentName: string;
  studentNameBn: string;
  class: string;
  gpa: string;
  familyIncome: string;
  reason: string;
  appliedDate: string;
  status: 'pending' | 'approved' | 'rejected';
  remarks?: string;
}

const _unusedPrograms: ScholarshipProgram[] = [
  { id: '1', name: 'Merit Scholarship', nameBn: 'মেধা বৃত্তি', description: 'মেধাবী শিক্ষার্থীদের জন্য বার্ষিক বৃত্তি', amount: 12000, eligibility: 'GPA 5.00', deadline: '2024-06-30', totalSlots: 20, filledSlots: 15, status: 'active', sponsor: 'প্রতিষ্ঠান' },
  { id: '2', name: 'Need-based Scholarship', nameBn: 'দরিদ্র মেধাবী বৃত্তি', description: 'আর্থিকভাবে অসচ্ছল মেধাবী শিক্ষার্থীদের জন্য', amount: 15000, eligibility: 'GPA 4.50+, Family income < 15000', deadline: '2024-07-15', totalSlots: 30, filledSlots: 22, status: 'active', sponsor: 'Alumni Association' },
  { id: '3', name: 'Sports Scholarship', nameBn: 'ক্রীড়া বৃত্তি', description: 'জাতীয় পর্যায়ে অংশগ্রহণকারী খেলোয়াড়দের জন্য', amount: 10000, eligibility: 'National level participation', deadline: '2024-05-31', totalSlots: 10, filledSlots: 10, status: 'closed', sponsor: 'Sports Club' },
  { id: '4', name: 'Science Scholarship', nameBn: 'বিজ্ঞান বৃত্তি', description: 'বিজ্ঞান বিভাগের শিক্ষার্থীদের জন্য বিশেষ বৃত্তি', amount: 8000, eligibility: 'Science students, GPA 4.75+', deadline: '2024-08-01', totalSlots: 15, filledSlots: 0, status: 'upcoming', sponsor: 'Science Foundation' },
];

const _unusedApplications: ScholarshipApplication[] = [
  { id: '1', programId: '1', programName: 'মেধা বৃত্তি', studentId: 'STD-001', studentName: 'Rahima Akter', studentNameBn: 'রাহিমা আক্তার', class: '১০ম', gpa: '5.00', familyIncome: '25000', reason: 'মেধার ভিত্তিতে বৃত্তি প্রাপ্তির আবেদন', appliedDate: '2024-01-15', status: 'approved' },
  { id: '2', programId: '2', programName: 'দরিদ্র মেধাবী বৃত্তি', studentId: 'STD-002', studentName: 'Karim Uddin', studentNameBn: 'করিম উদ্দিন', class: '৯ম', gpa: '4.75', familyIncome: '12000', reason: 'আর্থিক অসচ্ছলতার কারণে বৃত্তির জন্য আবেদন', appliedDate: '2024-01-20', status: 'pending' },
  { id: '3', programId: '1', programName: 'মেধা বৃত্তি', studentId: 'STD-003', studentName: 'Salma Khatun', studentNameBn: 'সালমা খাতুন', class: '৮ম', gpa: '4.90', familyIncome: '30000', reason: 'মেধাবী শিক্ষার্থী হিসেবে বৃত্তি প্রার্থী', appliedDate: '2024-01-18', status: 'pending' },
  { id: '4', programId: '2', programName: 'দরিদ্র মেধাবী বৃত্তি', studentId: 'STD-004', studentName: 'Jahid Hassan', studentNameBn: 'জাহিদ হাসান', class: '৭ম', gpa: '4.50', familyIncome: '10000', reason: 'পারিবারিক আর্থিক সমস্যার কারণে', appliedDate: '2024-01-22', status: 'rejected', remarks: 'GPA requirement not met' },
];

const Scholarship: React.FC = () => {
  const { toast } = useToast();
  const [programs, setPrograms] = useState<ScholarshipProgram[]>([]);
  const [applications, setApplications] = useState<ScholarshipApplication[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isAddProgramOpen, setIsAddProgramOpen] = useState(false);
  const [isAddApplicationOpen, setIsAddApplicationOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<ScholarshipProgram | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<ScholarshipApplication | null>(null);
  const [newProgram, setNewProgram] = useState({
    name: '', nameBn: '', description: '', amount: 0, eligibility: '', deadline: '', totalSlots: 0, sponsor: '', status: 'upcoming' as ScholarshipProgram['status']
  });
  const [newApplication, setNewApplication] = useState({
    programId: '', studentId: '', studentName: '', studentNameBn: '', class: '', gpa: '', familyIncome: '', reason: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pRes = await api.getScholarshipPrograms();
        const pRaw = pRes.data as Record<string, unknown>;
        const pArr = Array.isArray(pRaw) ? pRaw : (Array.isArray((pRaw as Record<string, unknown>)?.programs) ? (pRaw as Record<string, unknown>).programs as Record<string, unknown>[] : []);
        setPrograms(pArr.map((p: Record<string, unknown>) => ({ id: (p._id || p.id) as string, name: (p.name || '') as string, nameBn: (p.nameBn || '') as string, description: (p.description || '') as string, amount: (p.amount || 0) as number, eligibility: (p.eligibility || '') as string, deadline: p.deadline ? new Date(p.deadline as string).toISOString().split('T')[0] : '', totalSlots: (p.totalSlots || 0) as number, filledSlots: (p.filledSlots || 0) as number, status: (p.status || 'upcoming') as ScholarshipProgram['status'], sponsor: (p.sponsor || '') as string })));
      } catch (e) { console.error('Failed to load scholarship programs', e); }
      try {
        const aRes = await api.getScholarshipApplications();
        const aRaw = aRes.data as Record<string, unknown>;
        const aArr = Array.isArray(aRaw) ? aRaw : (Array.isArray((aRaw as Record<string, unknown>)?.applications) ? (aRaw as Record<string, unknown>).applications as Record<string, unknown>[] : []);
        setApplications(aArr.map((a: Record<string, unknown>) => ({ id: (a._id || a.id) as string, programId: (a.programId || '') as string, programName: (a.programName || '') as string, studentId: (a.studentId || '') as string, studentName: (a.studentName || '') as string, studentNameBn: (a.studentNameBn || '') as string, class: (a.class || '') as string, gpa: (a.gpa || '') as string, familyIncome: (a.familyIncome || '') as string, reason: (a.reason || '') as string, appliedDate: a.appliedDate ? new Date(a.appliedDate as string).toISOString().split('T')[0] : '', status: (a.status || 'pending') as ScholarshipApplication['status'], remarks: (a.remarks || '') as string })));
      } catch (e) { console.error('Failed to load scholarship applications', e); }
    };
    fetchData();
  }, []);

  const filteredApplications = applications.filter((a) => {
    const matchesSearch = a.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.studentNameBn.includes(searchTerm) || a.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || a.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddProgram = async () => {
    if (!newProgram.name || !newProgram.nameBn) {
      toast({ title: 'ত্রুটি', description: 'সব ফিল্ড পূরণ করুন', variant: 'destructive' });
      return;
    }
    try {
      const res = await api.createScholarshipProgram({ ...newProgram, filledSlots: 0 });
      const p = res.data as Record<string, unknown>;
      setPrograms([{ id: (p._id || p.id) as string, name: (p.name || '') as string, nameBn: (p.nameBn || '') as string, description: (p.description || '') as string, amount: (p.amount || 0) as number, eligibility: (p.eligibility || '') as string, deadline: p.deadline ? new Date(p.deadline as string).toISOString().split('T')[0] : '', totalSlots: (p.totalSlots || 0) as number, filledSlots: (p.filledSlots || 0) as number, status: (p.status || 'upcoming') as ScholarshipProgram['status'], sponsor: (p.sponsor || '') as string }, ...programs]);
      setNewProgram({ name: '', nameBn: '', description: '', amount: 0, eligibility: '', deadline: '', totalSlots: 0, sponsor: '', status: 'upcoming' });
      setIsAddProgramOpen(false);
      toast({ title: 'সফল', description: 'বৃত্তি প্রোগ্রাম যোগ করা হয়েছে' });
    } catch (e) { toast({ title: 'ত্রুটি', description: 'যোগ করতে ব্যর্থ', variant: 'destructive' }); }
  };

  const handleAddApplication = async () => {
    if (!newApplication.studentId || !newApplication.programId) {
      toast({ title: 'ত্রুটি', description: 'সব ফিল্ড পূরণ করুন', variant: 'destructive' });
      return;
    }
    try {
      const program = programs.find((p) => p.id === newApplication.programId);
      const res = await api.createScholarshipApplication({ ...newApplication, programName: program?.nameBn || '', appliedDate: new Date().toISOString().split('T')[0], status: 'pending' });
      const a = res.data as Record<string, unknown>;
      setApplications([{ id: (a._id || a.id) as string, programId: (a.programId || '') as string, programName: (a.programName || '') as string, studentId: (a.studentId || '') as string, studentName: (a.studentName || '') as string, studentNameBn: (a.studentNameBn || '') as string, class: (a.class || '') as string, gpa: (a.gpa || '') as string, familyIncome: (a.familyIncome || '') as string, reason: (a.reason || '') as string, appliedDate: a.appliedDate ? new Date(a.appliedDate as string).toISOString().split('T')[0] : '', status: (a.status || 'pending') as ScholarshipApplication['status'], remarks: (a.remarks || '') as string }, ...applications]);
      setNewApplication({ programId: '', studentId: '', studentName: '', studentNameBn: '', class: '', gpa: '', familyIncome: '', reason: '' });
      setIsAddApplicationOpen(false);
      toast({ title: 'সফল', description: 'আবেদন জমা হয়েছে' });
    } catch (e) { toast({ title: 'ত্রুটি', description: 'আবেদন ব্যর্থ', variant: 'destructive' }); }
  };

  const handleEditProgram = async () => {
    if (!selectedProgram) return;
    try {
      await api.updateScholarshipProgram(selectedProgram.id, selectedProgram);
      setPrograms(programs.map((p) => (p.id === selectedProgram.id ? selectedProgram : p)));
      setIsEditOpen(false);
      toast({ title: 'সফল', description: 'প্রোগ্রাম আপডেট করা হয়েছে' });
    } catch (e) { toast({ title: 'ত্রুটি', description: 'আপডেট ব্যর্থ', variant: 'destructive' }); }
  };

  const handleDeleteProgram = async (id: string) => {
    try {
      await api.deleteScholarshipProgram(id);
      setPrograms(programs.filter((p) => p.id !== id));
      toast({ title: 'সফল', description: 'প্রোগ্রাম মুছে ফেলা হয়েছে' });
    } catch (e) { toast({ title: 'ত্রুটি', description: 'মুছতে ব্যর্থ', variant: 'destructive' }); }
  };

  const handleDeleteApplication = async (id: string) => {
    try {
      await api.deleteScholarshipApplication(id);
      setApplications(applications.filter((a) => a.id !== id));
      toast({ title: 'সফল', description: 'আবেদন মুছে ফেলা হয়েছে' });
    } catch (e) { toast({ title: 'ত্রুটি', description: 'মুছতে ব্যর্থ', variant: 'destructive' }); }
  };

  const handleApprove = async (id: string) => {
    try {
      await api.updateScholarshipApplication(id, { status: 'approved' });
      setApplications(applications.map((a) => (a.id === id ? { ...a, status: 'approved' as const } : a)));
      toast({ title: 'সফল', description: 'আবেদন অনুমোদিত হয়েছে' });
    } catch (e) { toast({ title: 'ত্রুটি', description: 'অনুমোদন ব্যর্থ', variant: 'destructive' }); }
  };

  const handleReject = async (id: string) => {
    try {
      await api.updateScholarshipApplication(id, { status: 'rejected' });
      setApplications(applications.map((a) => (a.id === id ? { ...a, status: 'rejected' as const } : a)));
      toast({ title: 'সফল', description: 'আবেদন বাতিল করা হয়েছে' });
    } catch (e) { toast({ title: 'ত্রুটি', description: 'বাতিল ব্যর্থ', variant: 'destructive' }); }
  };

  const getProgramStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-500/10 text-green-500',
      closed: 'bg-red-500/10 text-red-500',
      upcoming: 'bg-blue-500/10 text-blue-500',
    };
    return colors[status] || colors.active;
  };

  const getApplicationStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-500/10 text-yellow-500',
      approved: 'bg-green-500/10 text-green-500',
      rejected: 'bg-red-500/10 text-red-500',
    };
    return colors[status] || colors.pending;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      active: 'চলমান',
      closed: 'বন্ধ',
      upcoming: 'আসন্ন',
      pending: 'অপেক্ষমান',
      approved: 'অনুমোদিত',
      rejected: 'বাতিল',
    };
    return labels[status] || status;
  };

  const totalDisbursed = applications.filter((a) => a.status === 'approved').reduce((sum, a) => {
    const program = programs.find((p) => p.id === a.programId);
    return sum + (program?.amount || 0);
  }, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">বৃত্তি ব্যবস্থাপনা</h1>
            <p className="text-muted-foreground">Scholarship programs, applications & disbursement</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="card-elevated">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Award className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{programs.length}</p>
                  <p className="text-xs text-muted-foreground">বৃত্তি প্রোগ্রাম</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="card-elevated">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Users className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{applications.length}</p>
                  <p className="text-xs text-muted-foreground">মোট আবেদন</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="card-elevated">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{applications.filter((a) => a.status === 'approved').length}</p>
                  <p className="text-xs text-muted-foreground">অনুমোদিত</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="card-elevated">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-500/10">
                  <DollarSign className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">৳{totalDisbursed.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">বিতরণ</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="programs" className="space-y-4">
          <TabsList>
            <TabsTrigger value="programs" className="gap-2">
              <Award className="w-4 h-4" />
              প্রোগ্রাম
            </TabsTrigger>
            <TabsTrigger value="applications" className="gap-2">
              <FileText className="w-4 h-4" />
              আবেদন
            </TabsTrigger>
          </TabsList>

          <TabsContent value="programs" className="space-y-4">
            <div className="flex justify-end">
              <Dialog open={isAddProgramOpen} onOpenChange={setIsAddProgramOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    প্রোগ্রাম যোগ করুন
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>নতুন বৃত্তি প্রোগ্রাম</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>নাম (English)</Label>
                        <Input value={newProgram.name} onChange={(e) => setNewProgram({ ...newProgram, name: e.target.value })} placeholder="Program Name" />
                      </div>
                      <div className="space-y-2">
                        <Label>নাম (বাংলা)</Label>
                        <Input value={newProgram.nameBn} onChange={(e) => setNewProgram({ ...newProgram, nameBn: e.target.value })} placeholder="প্রোগ্রামের নাম" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>বিবরণ</Label>
                      <Textarea value={newProgram.description} onChange={(e) => setNewProgram({ ...newProgram, description: e.target.value })} placeholder="প্রোগ্রামের বিবরণ" rows={2} />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>বৃত্তির পরিমাণ (টাকা)</Label>
                        <Input type="number" value={newProgram.amount} onChange={(e) => setNewProgram({ ...newProgram, amount: Number(e.target.value) })} />
                      </div>
                      <div className="space-y-2">
                        <Label>আসন সংখ্যা</Label>
                        <Input type="number" value={newProgram.totalSlots} onChange={(e) => setNewProgram({ ...newProgram, totalSlots: Number(e.target.value) })} />
                      </div>
                      <div className="space-y-2">
                        <Label>শেষ তারিখ</Label>
                        <Input type="date" value={newProgram.deadline} onChange={(e) => setNewProgram({ ...newProgram, deadline: e.target.value })} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>যোগ্যতা</Label>
                      <Input value={newProgram.eligibility} onChange={(e) => setNewProgram({ ...newProgram, eligibility: e.target.value })} placeholder="যোগ্যতার শর্তাবলী" />
                    </div>
                    <div className="space-y-2">
                      <Label>স্পন্সর</Label>
                      <Input value={newProgram.sponsor} onChange={(e) => setNewProgram({ ...newProgram, sponsor: e.target.value })} placeholder="বৃত্তি প্রদানকারী" />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild><Button variant="outline">বাতিল</Button></DialogClose>
                    <Button onClick={handleAddProgram}>যোগ করুন</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {programs.map((program) => (
                <Card key={program.id} className="card-elevated">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-foreground">{program.nameBn}</h3>
                        <p className="text-sm text-muted-foreground">{program.name}</p>
                      </div>
                      <Badge className={getProgramStatusColor(program.status)}>{getStatusLabel(program.status)}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{program.description}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">বৃত্তির পরিমাণ:</span>
                        <span className="font-semibold text-primary">৳{program.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">আসন:</span>
                        <span>{program.filledSlots}/{program.totalSlots}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">শেষ তারিখ:</span>
                        <span>{program.deadline}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">স্পন্সর:</span>
                        <span>{program.sponsor}</span>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 mt-3">
                      <div className="bg-primary h-2 rounded-full" style={{ width: `${(program.filledSlots / program.totalSlots) * 100}%` }}></div>
                    </div>
                    <div className="flex justify-end gap-1 mt-3">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelectedProgram(program); setIsViewOpen(true); }}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelectedProgram(program); setIsEditOpen(true); }}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteProgram(program.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="applications" className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="নাম বা আইডি দিয়ে খুঁজুন..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="স্ট্যাটাস" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">সব স্ট্যাটাস</SelectItem>
                    <SelectItem value="pending">অপেক্ষমান</SelectItem>
                    <SelectItem value="approved">অনুমোদিত</SelectItem>
                    <SelectItem value="rejected">বাতিল</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Dialog open={isAddApplicationOpen} onOpenChange={setIsAddApplicationOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    আবেদন করুন
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>নতুন আবেদন</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>বৃত্তি প্রোগ্রাম</Label>
                      <Select value={newApplication.programId} onValueChange={(v) => setNewApplication({ ...newApplication, programId: v })}>
                        <SelectTrigger><SelectValue placeholder="প্রোগ্রাম নির্বাচন করুন" /></SelectTrigger>
                        <SelectContent>
                          {programs.filter((p) => p.status === 'active').map((p) => (
                            <SelectItem key={p.id} value={p.id}>{p.nameBn}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>স্টুডেন্ট আইডি</Label>
                        <Input value={newApplication.studentId} onChange={(e) => setNewApplication({ ...newApplication, studentId: e.target.value })} placeholder="STD-XXX" />
                      </div>
                      <div className="space-y-2">
                        <Label>শ্রেণি</Label>
                        <Select value={newApplication.class} onValueChange={(v) => setNewApplication({ ...newApplication, class: v })}>
                          <SelectTrigger><SelectValue placeholder="শ্রেণি" /></SelectTrigger>
                          <SelectContent>
                            {['১ম', '২য়', '৩য়', '৪র্থ', '৫ম', '৬ষ্ঠ', '৭ম', '৮ম', '৯ম', '১০ম'].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>নাম (English)</Label>
                        <Input value={newApplication.studentName} onChange={(e) => setNewApplication({ ...newApplication, studentName: e.target.value })} placeholder="Name" />
                      </div>
                      <div className="space-y-2">
                        <Label>নাম (বাংলা)</Label>
                        <Input value={newApplication.studentNameBn} onChange={(e) => setNewApplication({ ...newApplication, studentNameBn: e.target.value })} placeholder="নাম" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>GPA</Label>
                        <Input value={newApplication.gpa} onChange={(e) => setNewApplication({ ...newApplication, gpa: e.target.value })} placeholder="5.00" />
                      </div>
                      <div className="space-y-2">
                        <Label>পারিবারিক আয়</Label>
                        <Input value={newApplication.familyIncome} onChange={(e) => setNewApplication({ ...newApplication, familyIncome: e.target.value })} placeholder="মাসিক আয়" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>আবেদনের কারণ</Label>
                      <Textarea value={newApplication.reason} onChange={(e) => setNewApplication({ ...newApplication, reason: e.target.value })} placeholder="কেন বৃত্তি প্রয়োজন" rows={3} />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild><Button variant="outline">বাতিল</Button></DialogClose>
                    <Button onClick={handleAddApplication}>জমা দিন</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="card-elevated">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-4 font-medium text-muted-foreground">শিক্ষার্থী</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">প্রোগ্রাম</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">GPA</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">আবেদনের তারিখ</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">স্ট্যাটাস</th>
                        <th className="text-right p-4 font-medium text-muted-foreground">অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredApplications.map((app) => (
                        <tr key={app.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                          <td className="p-4">
                            <div>
                              <p className="font-medium text-foreground">{app.studentNameBn}</p>
                              <p className="text-sm text-muted-foreground">{app.studentId} | {app.class}</p>
                            </div>
                          </td>
                          <td className="p-4 text-muted-foreground">{app.programName}</td>
                          <td className="p-4">
                            <Badge variant="outline">{app.gpa}</Badge>
                          </td>
                          <td className="p-4 text-muted-foreground">{app.appliedDate}</td>
                          <td className="p-4">
                            <Badge className={getApplicationStatusColor(app.status)}>{getStatusLabel(app.status)}</Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex justify-end gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelectedApplication(app); setIsViewOpen(true); }}>
                                <Eye className="w-4 h-4" />
                              </Button>
                              {app.status === 'pending' && (
                                <>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-green-500" onClick={() => handleApprove(app.id)}>
                                    <CheckCircle className="w-4 h-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleReject(app.id)}>
                                    <XCircle className="w-4 h-4" />
                                  </Button>
                                </>
                              )}
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteApplication(app.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* View Program Dialog */}
        <Dialog open={isViewOpen && selectedProgram !== null} onOpenChange={(open) => { if (!open) { setSelectedProgram(null); } setIsViewOpen(open); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedProgram?.nameBn}</DialogTitle>
            </DialogHeader>
            {selectedProgram && (
              <div className="space-y-4 py-4">
                <div><Label className="text-muted-foreground">বিবরণ</Label><p>{selectedProgram.description}</p></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label className="text-muted-foreground">বৃত্তির পরিমাণ</Label><p className="text-xl font-bold text-primary">৳{selectedProgram.amount.toLocaleString()}</p></div>
                  <div><Label className="text-muted-foreground">আসন</Label><p>{selectedProgram.filledSlots}/{selectedProgram.totalSlots}</p></div>
                </div>
                <div><Label className="text-muted-foreground">যোগ্যতা</Label><p>{selectedProgram.eligibility}</p></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label className="text-muted-foreground">শেষ তারিখ</Label><p>{selectedProgram.deadline}</p></div>
                  <div><Label className="text-muted-foreground">স্পন্সর</Label><p>{selectedProgram.sponsor}</p></div>
                </div>
              </div>
            )}
            <DialogFooter>
              <DialogClose asChild><Button variant="outline">বন্ধ করুন</Button></DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Program Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>প্রোগ্রাম সম্পাদনা</DialogTitle>
            </DialogHeader>
            {selectedProgram && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>নাম (বাংলা)</Label>
                  <Input value={selectedProgram.nameBn} onChange={(e) => setSelectedProgram({ ...selectedProgram, nameBn: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>বৃত্তির পরিমাণ</Label>
                    <Input type="number" value={selectedProgram.amount} onChange={(e) => setSelectedProgram({ ...selectedProgram, amount: Number(e.target.value) })} />
                  </div>
                  <div className="space-y-2">
                    <Label>আসন সংখ্যা</Label>
                    <Input type="number" value={selectedProgram.totalSlots} onChange={(e) => setSelectedProgram({ ...selectedProgram, totalSlots: Number(e.target.value) })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>স্ট্যাটাস</Label>
                  <Select value={selectedProgram.status} onValueChange={(v) => setSelectedProgram({ ...selectedProgram, status: v as ScholarshipProgram['status'] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">চলমান</SelectItem>
                      <SelectItem value="closed">বন্ধ</SelectItem>
                      <SelectItem value="upcoming">আসন্ন</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <DialogFooter>
              <DialogClose asChild><Button variant="outline">বাতিল</Button></DialogClose>
              <Button onClick={handleEditProgram}>আপডেট করুন</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Scholarship;
