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
import { useToast } from '@/hooks/use-toast';
import {
  Heart,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  User,
  Phone,
  AlertTriangle,
  Activity,
  Stethoscope,
  Droplet,
  FileText,
} from 'lucide-react';
import api from '@/services/api';

interface MedicalRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentNameBn: string;
  class: string;
  section: string;
  bloodGroup: string;
  height: string;
  weight: string;
  allergies: string;
  chronicConditions: string;
  currentMedications: string;
  emergencyContact: string;
  emergencyPhone: string;
  emergencyRelation: string;
  doctorName: string;
  doctorPhone: string;
  lastCheckup: string;
  notes: string;
  status: 'healthy' | 'needs-attention' | 'critical';
}

const _unusedMedRecords: MedicalRecord[] = [
  { id: '1', studentId: 'STD-001', studentName: 'Rahima Akter', studentNameBn: 'রাহিমা আক্তার', class: '৮ম', section: 'A', bloodGroup: 'A+', height: '152 cm', weight: '45 kg', allergies: 'Dust allergy', chronicConditions: 'None', currentMedications: 'None', emergencyContact: 'Abdul Karim', emergencyPhone: '01712345678', emergencyRelation: 'পিতা', doctorName: 'Dr. Mahbub', doctorPhone: '01812345678', lastCheckup: '2024-01-15', notes: 'সুস্থ', status: 'healthy' },
  { id: '2', studentId: 'STD-002', studentName: 'Karim Uddin', studentNameBn: 'করিম উদ্দিন', class: '৯ম', section: 'B', bloodGroup: 'B+', height: '160 cm', weight: '52 kg', allergies: 'Peanut allergy', chronicConditions: 'Asthma', currentMedications: 'Inhaler', emergencyContact: 'Zahir Uddin', emergencyPhone: '01912345678', emergencyRelation: 'পিতা', doctorName: 'Dr. Rahman', doctorPhone: '01612345678', lastCheckup: '2024-01-10', notes: 'Asthma under control', status: 'needs-attention' },
  { id: '3', studentId: 'STD-003', studentName: 'Salma Khatun', studentNameBn: 'সালমা খাতুন', class: '১০ম', section: 'A', bloodGroup: 'O+', height: '155 cm', weight: '48 kg', allergies: 'None', chronicConditions: 'None', currentMedications: 'None', emergencyContact: 'Ali Hossain', emergencyPhone: '01512345678', emergencyRelation: 'পিতা', doctorName: 'Dr. Fatima', doctorPhone: '01712345679', lastCheckup: '2024-01-20', notes: 'Excellent health', status: 'healthy' },
  { id: '4', studentId: 'STD-004', studentName: 'Jahid Hassan', studentNameBn: 'জাহিদ হাসান', class: '৭ম', section: 'C', bloodGroup: 'AB+', height: '148 cm', weight: '42 kg', allergies: 'Medicine allergy (Penicillin)', chronicConditions: 'Diabetes Type 1', currentMedications: 'Insulin', emergencyContact: 'Hassan Ali', emergencyPhone: '01312345678', emergencyRelation: 'পিতা', doctorName: 'Dr. Kamal', doctorPhone: '01812345679', lastCheckup: '2024-01-05', notes: 'Needs regular monitoring', status: 'critical' },
];

const Medical: React.FC = () => {
  const { toast } = useToast();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterBloodGroup, setFilterBloodGroup] = useState<string>('all');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [newRecord, setNewRecord] = useState({
    studentId: '', studentName: '', studentNameBn: '', class: '', section: '', bloodGroup: '',
    height: '', weight: '', allergies: '', chronicConditions: '', currentMedications: '',
    emergencyContact: '', emergencyPhone: '', emergencyRelation: '', doctorName: '', doctorPhone: '',
    lastCheckup: '', notes: '', status: 'healthy' as MedicalRecord['status']
  });

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.getMedicalRecords();
        const raw = res.data as Record<string, unknown>;
        const arr = Array.isArray(raw) ? raw : (Array.isArray((raw as Record<string, unknown>)?.records) ? (raw as Record<string, unknown>).records as Record<string, unknown>[] : []);
        setRecords(arr.map((r: Record<string, unknown>) => ({ id: (r._id || r.id) as string, studentId: (r.studentId || '') as string, studentName: (r.studentName || '') as string, studentNameBn: (r.studentNameBn || '') as string, class: (r.class || '') as string, section: (r.section || '') as string, bloodGroup: (r.bloodGroup || '') as string, height: (r.height || '') as string, weight: (r.weight || '') as string, allergies: (r.allergies || '') as string, chronicConditions: (r.chronicConditions || '') as string, currentMedications: (r.currentMedications || '') as string, emergencyContact: (r.emergencyContact || '') as string, emergencyPhone: (r.emergencyPhone || '') as string, emergencyRelation: (r.emergencyRelation || '') as string, doctorName: (r.doctorName || '') as string, doctorPhone: (r.doctorPhone || '') as string, lastCheckup: r.lastCheckup ? new Date(r.lastCheckup as string).toISOString().split('T')[0] : '', notes: (r.notes || '') as string, status: (r.status || 'healthy') as MedicalRecord['status'] })));
      } catch (e) { console.error('Failed to load medical records', e); }
    };
    fetchData();
  }, []);

  const filteredRecords = records.filter((r) => {
    const matchesSearch = r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.studentNameBn.includes(searchTerm) || r.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
    const matchesBlood = filterBloodGroup === 'all' || r.bloodGroup === filterBloodGroup;
    return matchesSearch && matchesStatus && matchesBlood;
  });

  const handleAddRecord = async () => {
    if (!newRecord.studentName || !newRecord.studentId) {
      toast({ title: 'ত্রুটি', description: 'সব ফিল্ড পূরণ করুন', variant: 'destructive' });
      return;
    }
    try {
      const res = await api.createMedicalRecord(newRecord);
      const r = res.data as Record<string, unknown>;
      setRecords([{ id: (r._id || r.id) as string, studentId: (r.studentId || '') as string, studentName: (r.studentName || '') as string, studentNameBn: (r.studentNameBn || '') as string, class: (r.class || '') as string, section: (r.section || '') as string, bloodGroup: (r.bloodGroup || '') as string, height: (r.height || '') as string, weight: (r.weight || '') as string, allergies: (r.allergies || '') as string, chronicConditions: (r.chronicConditions || '') as string, currentMedications: (r.currentMedications || '') as string, emergencyContact: (r.emergencyContact || '') as string, emergencyPhone: (r.emergencyPhone || '') as string, emergencyRelation: (r.emergencyRelation || '') as string, doctorName: (r.doctorName || '') as string, doctorPhone: (r.doctorPhone || '') as string, lastCheckup: r.lastCheckup ? new Date(r.lastCheckup as string).toISOString().split('T')[0] : '', notes: (r.notes || '') as string, status: (r.status || 'healthy') as MedicalRecord['status'] }, ...records]);
      setNewRecord({ studentId: '', studentName: '', studentNameBn: '', class: '', section: '', bloodGroup: '', height: '', weight: '', allergies: '', chronicConditions: '', currentMedications: '', emergencyContact: '', emergencyPhone: '', emergencyRelation: '', doctorName: '', doctorPhone: '', lastCheckup: '', notes: '', status: 'healthy' });
      setIsAddOpen(false);
      toast({ title: 'সফল', description: 'মেডিকেল রেকর্ড যোগ করা হয়েছে' });
    } catch (e) { toast({ title: 'ত্রুটি', description: 'যোগ করতে ব্যর্থ', variant: 'destructive' }); }
  };

  const handleEditRecord = async () => {
    if (!selectedRecord) return;
    try {
      await api.updateMedicalRecord(selectedRecord.id, selectedRecord);
      setRecords(records.map((r) => (r.id === selectedRecord.id ? selectedRecord : r)));
      setIsEditOpen(false);
      toast({ title: 'সফল', description: 'রেকর্ড আপডেট করা হয়েছে' });
    } catch (e) { toast({ title: 'ত্রুটি', description: 'আপডেট ব্যর্থ', variant: 'destructive' }); }
  };

  const handleDeleteRecord = async (id: string) => {
    try {
      await api.deleteMedicalRecord(id);
      setRecords(records.filter((r) => r.id !== id));
      toast({ title: 'সফল', description: 'রেকর্ড মুছে ফেলা হয়েছে' });
    } catch (e) { toast({ title: 'ত্রুটি', description: 'মুছতে ব্যর্থ', variant: 'destructive' }); }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      healthy: 'bg-green-500/10 text-green-500',
      'needs-attention': 'bg-yellow-500/10 text-yellow-500',
      critical: 'bg-red-500/10 text-red-500',
    };
    return colors[status] || colors.healthy;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      healthy: 'সুস্থ',
      'needs-attention': 'মনোযোগ প্রয়োজন',
      critical: 'জরুরি',
    };
    return labels[status] || status;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">স্বাস্থ্য রেকর্ড</h1>
            <p className="text-muted-foreground">শিক্ষার্থীদের মেডিকেল তথ্য ও জরুরি যোগাযোগ</p>
          </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                রেকর্ড যোগ করুন
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>নতুন মেডিকেল রেকর্ড</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>স্টুডেন্ট আইডি</Label>
                    <Input value={newRecord.studentId} onChange={(e) => setNewRecord({ ...newRecord, studentId: e.target.value })} placeholder="STD-XXX" />
                  </div>
                  <div className="space-y-2">
                    <Label>নাম (English)</Label>
                    <Input value={newRecord.studentName} onChange={(e) => setNewRecord({ ...newRecord, studentName: e.target.value })} placeholder="Name" />
                  </div>
                  <div className="space-y-2">
                    <Label>নাম (বাংলা)</Label>
                    <Input value={newRecord.studentNameBn} onChange={(e) => setNewRecord({ ...newRecord, studentNameBn: e.target.value })} placeholder="নাম" />
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>শ্রেণি</Label>
                    <Select value={newRecord.class} onValueChange={(v) => setNewRecord({ ...newRecord, class: v })}>
                      <SelectTrigger><SelectValue placeholder="শ্রেণি" /></SelectTrigger>
                      <SelectContent>
                        {['১ম', '২য়', '৩য়', '৪র্থ', '৫ম', '৬ষ্ঠ', '৭ম', '৮ম', '৯ম', '১০ম'].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>শাখা</Label>
                    <Select value={newRecord.section} onValueChange={(v) => setNewRecord({ ...newRecord, section: v })}>
                      <SelectTrigger><SelectValue placeholder="শাখা" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">A</SelectItem>
                        <SelectItem value="B">B</SelectItem>
                        <SelectItem value="C">C</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>রক্তের গ্রুপ</Label>
                    <Select value={newRecord.bloodGroup} onValueChange={(v) => setNewRecord({ ...newRecord, bloodGroup: v })}>
                      <SelectTrigger><SelectValue placeholder="গ্রুপ" /></SelectTrigger>
                      <SelectContent>
                        {bloodGroups.map((bg) => <SelectItem key={bg} value={bg}>{bg}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>স্ট্যাটাস</Label>
                    <Select value={newRecord.status} onValueChange={(v) => setNewRecord({ ...newRecord, status: v as MedicalRecord['status'] })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="healthy">সুস্থ</SelectItem>
                        <SelectItem value="needs-attention">মনোযোগ প্রয়োজন</SelectItem>
                        <SelectItem value="critical">জরুরি</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>উচ্চতা</Label>
                    <Input value={newRecord.height} onChange={(e) => setNewRecord({ ...newRecord, height: e.target.value })} placeholder="152 cm" />
                  </div>
                  <div className="space-y-2">
                    <Label>ওজন</Label>
                    <Input value={newRecord.weight} onChange={(e) => setNewRecord({ ...newRecord, weight: e.target.value })} placeholder="45 kg" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>এলার্জি</Label>
                  <Input value={newRecord.allergies} onChange={(e) => setNewRecord({ ...newRecord, allergies: e.target.value })} placeholder="এলার্জি থাকলে লিখুন" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>দীর্ঘমেয়াদী রোগ</Label>
                    <Input value={newRecord.chronicConditions} onChange={(e) => setNewRecord({ ...newRecord, chronicConditions: e.target.value })} placeholder="যদি থাকে" />
                  </div>
                  <div className="space-y-2">
                    <Label>বর্তমান ওষুধ</Label>
                    <Input value={newRecord.currentMedications} onChange={(e) => setNewRecord({ ...newRecord, currentMedications: e.target.value })} placeholder="চলমান ওষুধ" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>জরুরি যোগাযোগ (নাম)</Label>
                    <Input value={newRecord.emergencyContact} onChange={(e) => setNewRecord({ ...newRecord, emergencyContact: e.target.value })} placeholder="নাম" />
                  </div>
                  <div className="space-y-2">
                    <Label>জরুরি ফোন</Label>
                    <Input value={newRecord.emergencyPhone} onChange={(e) => setNewRecord({ ...newRecord, emergencyPhone: e.target.value })} placeholder="01XXXXXXXXX" />
                  </div>
                  <div className="space-y-2">
                    <Label>সম্পর্ক</Label>
                    <Input value={newRecord.emergencyRelation} onChange={(e) => setNewRecord({ ...newRecord, emergencyRelation: e.target.value })} placeholder="পিতা/মাতা" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>ডাক্তারের নাম</Label>
                    <Input value={newRecord.doctorName} onChange={(e) => setNewRecord({ ...newRecord, doctorName: e.target.value })} placeholder="ডাক্তারের নাম" />
                  </div>
                  <div className="space-y-2">
                    <Label>ডাক্তারের ফোন</Label>
                    <Input value={newRecord.doctorPhone} onChange={(e) => setNewRecord({ ...newRecord, doctorPhone: e.target.value })} placeholder="01XXXXXXXXX" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>শেষ চেকআপ</Label>
                    <Input type="date" value={newRecord.lastCheckup} onChange={(e) => setNewRecord({ ...newRecord, lastCheckup: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>নোট</Label>
                  <Textarea value={newRecord.notes} onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })} placeholder="অতিরিক্ত তথ্য" rows={2} />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild><Button variant="outline">বাতিল</Button></DialogClose>
                <Button onClick={handleAddRecord}>যোগ করুন</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="card-elevated">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Heart className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{records.length}</p>
                  <p className="text-xs text-muted-foreground">মোট রেকর্ড</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="card-elevated">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <Activity className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{records.filter((r) => r.status === 'healthy').length}</p>
                  <p className="text-xs text-muted-foreground">সুস্থ</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="card-elevated">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-500/10">
                  <Stethoscope className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{records.filter((r) => r.status === 'needs-attention').length}</p>
                  <p className="text-xs text-muted-foreground">মনোযোগ প্রয়োজন</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="card-elevated">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/10">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{records.filter((r) => r.status === 'critical').length}</p>
                  <p className="text-xs text-muted-foreground">জরুরি</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="নাম বা আইডি দিয়ে খুঁজুন..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="স্ট্যাটাস" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">সব স্ট্যাটাস</SelectItem>
              <SelectItem value="healthy">সুস্থ</SelectItem>
              <SelectItem value="needs-attention">মনোযোগ প্রয়োজন</SelectItem>
              <SelectItem value="critical">জরুরি</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterBloodGroup} onValueChange={setFilterBloodGroup}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue placeholder="রক্তের গ্রুপ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">সব গ্রুপ</SelectItem>
              {bloodGroups.map((bg) => <SelectItem key={bg} value={bg}>{bg}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Records Table */}
        <Card className="card-elevated">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 font-medium text-muted-foreground">শিক্ষার্থী</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">শ্রেণি</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">রক্তের গ্রুপ</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">এলার্জি</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">জরুরি যোগাযোগ</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">স্ট্যাটাস</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((record) => (
                    <tr key={record.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{record.studentNameBn}</p>
                            <p className="text-sm text-muted-foreground">{record.studentId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">{record.class} ({record.section})</td>
                      <td className="p-4">
                        <Badge className="bg-red-500/10 text-red-500">
                          <Droplet className="w-3 h-3 mr-1" />
                          {record.bloodGroup}
                        </Badge>
                      </td>
                      <td className="p-4 text-muted-foreground">{record.allergies || 'নেই'}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span>{record.emergencyPhone}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge className={getStatusColor(record.status)}>{getStatusLabel(record.status)}</Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelectedRecord(record); setIsViewOpen(true); }}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelectedRecord(record); setIsEditOpen(true); }}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteRecord(record.id)}>
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

        {/* View Dialog */}
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                মেডিকেল রেকর্ড - {selectedRecord?.studentNameBn}
              </DialogTitle>
            </DialogHeader>
            {selectedRecord && (
              <div className="space-y-4 py-4">
                <div className="flex items-center justify-between">
                  <Badge className={getStatusColor(selectedRecord.status)}>{getStatusLabel(selectedRecord.status)}</Badge>
                  <Badge className="bg-red-500/10 text-red-500"><Droplet className="w-3 h-3 mr-1" />{selectedRecord.bloodGroup}</Badge>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div><Label className="text-muted-foreground">আইডি</Label><p>{selectedRecord.studentId}</p></div>
                  <div><Label className="text-muted-foreground">শ্রেণি</Label><p>{selectedRecord.class} ({selectedRecord.section})</p></div>
                  <div><Label className="text-muted-foreground">শেষ চেকআপ</Label><p>{selectedRecord.lastCheckup}</p></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label className="text-muted-foreground">উচ্চতা</Label><p>{selectedRecord.height}</p></div>
                  <div><Label className="text-muted-foreground">ওজন</Label><p>{selectedRecord.weight}</p></div>
                </div>
                <div className="p-3 bg-yellow-500/10 rounded-lg">
                  <Label className="text-yellow-600">এলার্জি</Label>
                  <p className="text-yellow-700">{selectedRecord.allergies || 'কোন এলার্জি নেই'}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label className="text-muted-foreground">দীর্ঘমেয়াদী রোগ</Label><p>{selectedRecord.chronicConditions || 'নেই'}</p></div>
                  <div><Label className="text-muted-foreground">বর্তমান ওষুধ</Label><p>{selectedRecord.currentMedications || 'নেই'}</p></div>
                </div>
                <div className="p-3 bg-red-500/10 rounded-lg">
                  <Label className="text-red-600">জরুরি যোগাযোগ</Label>
                  <p className="font-medium text-red-700">{selectedRecord.emergencyContact} ({selectedRecord.emergencyRelation})</p>
                  <p className="text-red-600">{selectedRecord.emergencyPhone}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label className="text-muted-foreground">ডাক্তার</Label><p>{selectedRecord.doctorName}</p></div>
                  <div><Label className="text-muted-foreground">ডাক্তারের ফোন</Label><p>{selectedRecord.doctorPhone}</p></div>
                </div>
                {selectedRecord.notes && (
                  <div><Label className="text-muted-foreground">নোট</Label><p className="bg-muted p-3 rounded-lg">{selectedRecord.notes}</p></div>
                )}
              </div>
            )}
            <DialogFooter>
              <DialogClose asChild><Button variant="outline">বন্ধ করুন</Button></DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>রেকর্ড সম্পাদনা</DialogTitle>
            </DialogHeader>
            {selectedRecord && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>উচ্চতা</Label>
                    <Input value={selectedRecord.height} onChange={(e) => setSelectedRecord({ ...selectedRecord, height: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>ওজন</Label>
                    <Input value={selectedRecord.weight} onChange={(e) => setSelectedRecord({ ...selectedRecord, weight: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>এলার্জি</Label>
                  <Input value={selectedRecord.allergies} onChange={(e) => setSelectedRecord({ ...selectedRecord, allergies: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>বর্তমান ওষুধ</Label>
                  <Input value={selectedRecord.currentMedications} onChange={(e) => setSelectedRecord({ ...selectedRecord, currentMedications: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>স্ট্যাটাস</Label>
                  <Select value={selectedRecord.status} onValueChange={(v) => setSelectedRecord({ ...selectedRecord, status: v as MedicalRecord['status'] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="healthy">সুস্থ</SelectItem>
                      <SelectItem value="needs-attention">মনোযোগ প্রয়োজন</SelectItem>
                      <SelectItem value="critical">জরুরি</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>নোট</Label>
                  <Textarea value={selectedRecord.notes} onChange={(e) => setSelectedRecord({ ...selectedRecord, notes: e.target.value })} rows={2} />
                </div>
              </div>
            )}
            <DialogFooter>
              <DialogClose asChild><Button variant="outline">বাতিল</Button></DialogClose>
              <Button onClick={handleEditRecord}>আপডেট করুন</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Medical;
