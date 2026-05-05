import React, { useState } from 'react';
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
  Download,
  FileText,
  GraduationCap,
  User,
  Calendar,
  Printer,
  CheckCircle,
  Clock,
} from 'lucide-react';

interface Certificate {
  id: string;
  type: 'transfer' | 'character' | 'bonafide' | 'testimonial';
  studentName: string;
  studentNameBn: string;
  studentId: string;
  class: string;
  section: string;
  fatherName: string;
  motherName: string;
  issueDate: string;
  reason?: string;
  remarks?: string;
  status: 'pending' | 'approved' | 'printed';
  serialNo: string;
}

interface CertificateTemplate {
  id: string;
  name: string;
  nameBn: string;
  type: 'transfer' | 'character' | 'bonafide' | 'testimonial';
  content: string;
  isActive: boolean;
}

const initialCertificates: Certificate[] = [
  { id: '1', type: 'transfer', studentName: 'Rahima Akter', studentNameBn: 'রাহিমা আক্তার', studentId: 'STD-001', class: '১০ম', section: 'A', fatherName: 'আব্দুল করিম', motherName: 'ফাতেমা বেগম', issueDate: '2024-01-20', reason: 'অন্য স্কুলে ভর্তি', status: 'printed', serialNo: 'TC-2024-001' },
  { id: '2', type: 'character', studentName: 'Karim Uddin', studentNameBn: 'করিম উদ্দিন', studentId: 'STD-002', class: '৮ম', section: 'B', fatherName: 'জহির উদ্দিন', motherName: 'সালমা খাতুন', issueDate: '2024-01-18', status: 'approved', serialNo: 'CC-2024-001' },
  { id: '3', type: 'bonafide', studentName: 'Salma Khatun', studentNameBn: 'সালমা খাতুন', studentId: 'STD-003', class: '৯ম', section: 'A', fatherName: 'আলী হোসেন', motherName: 'রহিমা বেগম', issueDate: '2024-01-15', reason: 'ব্যাংক একাউন্ট খোলার জন্য', status: 'printed', serialNo: 'BF-2024-001' },
  { id: '4', type: 'testimonial', studentName: 'Jahid Hassan', studentNameBn: 'জাহিদ হাসান', studentId: 'STD-004', class: '১০ম', section: 'A', fatherName: 'হাসান আলী', motherName: 'নাজমা বেগম', issueDate: '2024-01-10', status: 'pending', serialNo: 'TM-2024-001' },
];

const initialTemplates: CertificateTemplate[] = [
  { id: '1', name: 'Transfer Certificate', nameBn: 'বদলি সনদপত্র', type: 'transfer', content: 'এই মর্মে প্রত্যয়ন করা যাচ্ছে যে, {student_name} পিতা: {father_name}, মাতা: {mother_name} এই প্রতিষ্ঠানে {class} শ্রেণিতে অধ্যয়নরত ছিল এবং তার বিরুদ্ধে কোন শৃঙ্খলা বিরোধী অভিযোগ নেই।', isActive: true },
  { id: '2', name: 'Character Certificate', nameBn: 'চারিত্রিক সনদপত্র', type: 'character', content: 'এই মর্মে প্রত্যয়ন করা যাচ্ছে যে, {student_name} পিতা: {father_name} একজন সৎ, নিষ্ঠাবান ও চরিত্রবান ছাত্র/ছাত্রী। সে এই প্রতিষ্ঠানে অধ্যয়নকালে সদাচারী ছিল।', isActive: true },
  { id: '3', name: 'Bonafide Certificate', nameBn: 'বোনাফাইড সনদপত্র', type: 'bonafide', content: 'এই মর্মে প্রত্যয়ন করা যাচ্ছে যে, {student_name} রোল নং: {roll}, আইডি: {student_id} বর্তমানে এই প্রতিষ্ঠানের {class} শ্রেণির একজন নিয়মিত ছাত্র/ছাত্রী।', isActive: true },
  { id: '4', name: 'Testimonial', nameBn: 'প্রশংসাপত্র', type: 'testimonial', content: 'এই মর্মে প্রত্যয়ন করা যাচ্ছে যে, {student_name} এই প্রতিষ্ঠানে অধ্যয়নকালে একজন মেধাবী ও পরিশ্রমী ছাত্র/ছাত্রী হিসেবে পরিচিত ছিল। তার ভবিষ্যৎ উজ্জ্বল কামনা করি।', isActive: true },
];

const Certificates: React.FC = () => {
  const { toast } = useToast();
  const [certificates, setCertificates] = useState<Certificate[]>(initialCertificates);
  const [templates, setTemplates] = useState<CertificateTemplate[]>(initialTemplates);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isTemplateEditOpen, setIsTemplateEditOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<CertificateTemplate | null>(null);
  const [newCertificate, setNewCertificate] = useState({
    type: 'transfer' as Certificate['type'],
    studentName: '',
    studentNameBn: '',
    studentId: '',
    class: '',
    section: '',
    fatherName: '',
    motherName: '',
    reason: '',
    remarks: '',
  });

  const filteredCertificates = certificates.filter((cert) => {
    const matchesSearch = cert.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.studentNameBn.includes(searchTerm) ||
      cert.serialNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || cert.type === filterType;
    const matchesStatus = filterStatus === 'all' || cert.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const generateSerialNo = (type: Certificate['type']) => {
    const prefix = type === 'transfer' ? 'TC' : type === 'character' ? 'CC' : type === 'bonafide' ? 'BF' : 'TM';
    const year = new Date().getFullYear();
    const count = certificates.filter((c) => c.type === type).length + 1;
    return `${prefix}-${year}-${String(count).padStart(3, '0')}`;
  };

  const handleAddCertificate = () => {
    if (!newCertificate.studentName || !newCertificate.studentId) {
      toast({ title: 'ত্রুটি', description: 'সব ফিল্ড পূরণ করুন', variant: 'destructive' });
      return;
    }
    const certificate: Certificate = {
      id: Date.now().toString(),
      ...newCertificate,
      issueDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      serialNo: generateSerialNo(newCertificate.type),
    };
    setCertificates([certificate, ...certificates]);
    setNewCertificate({ type: 'transfer', studentName: '', studentNameBn: '', studentId: '', class: '', section: '', fatherName: '', motherName: '', reason: '', remarks: '' });
    setIsAddOpen(false);
    toast({ title: 'সফল', description: 'সার্টিফিকেট তৈরি করা হয়েছে' });
  };

  const handleEditCertificate = () => {
    if (!selectedCertificate) return;
    setCertificates(certificates.map((c) => (c.id === selectedCertificate.id ? selectedCertificate : c)));
    setIsEditOpen(false);
    toast({ title: 'সফল', description: 'সার্টিফিকেট আপডেট করা হয়েছে' });
  };

  const handleDeleteCertificate = (id: string) => {
    setCertificates(certificates.filter((c) => c.id !== id));
    toast({ title: 'সফল', description: 'সার্টিফিকেট মুছে ফেলা হয়েছে' });
  };

  const handleApprove = (id: string) => {
    setCertificates(certificates.map((c) => (c.id === id ? { ...c, status: 'approved' as const } : c)));
    toast({ title: 'সফল', description: 'সার্টিফিকেট অনুমোদিত হয়েছে' });
  };

  const handlePrint = (id: string) => {
    setCertificates(certificates.map((c) => (c.id === id ? { ...c, status: 'printed' as const } : c)));
    toast({ title: 'সফল', description: 'সার্টিফিকেট প্রিন্ট করা হয়েছে' });
  };

  const handleEditTemplate = () => {
    if (!selectedTemplate) return;
    setTemplates(templates.map((t) => (t.id === selectedTemplate.id ? selectedTemplate : t)));
    setIsTemplateEditOpen(false);
    toast({ title: 'সফল', description: 'টেমপ্লেট আপডেট করা হয়েছে' });
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      transfer: 'বদলি সনদ',
      character: 'চারিত্রিক সনদ',
      bonafide: 'বোনাফাইড',
      testimonial: 'প্রশংসাপত্র',
    };
    return labels[type] || type;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      transfer: 'bg-blue-500/10 text-blue-500',
      character: 'bg-green-500/10 text-green-500',
      bonafide: 'bg-purple-500/10 text-purple-500',
      testimonial: 'bg-orange-500/10 text-orange-500',
    };
    return colors[type] || colors.transfer;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-500/10 text-yellow-500',
      approved: 'bg-blue-500/10 text-blue-500',
      printed: 'bg-green-500/10 text-green-500',
    };
    return colors[status] || colors.pending;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'অপেক্ষমান',
      approved: 'অনুমোদিত',
      printed: 'প্রিন্ট হয়েছে',
    };
    return labels[status] || status;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">সার্টিফিকেট জেনারেটর</h1>
            <p className="text-muted-foreground">বদলি, চারিত্রিক ও অন্যান্য সার্টিফিকেট তৈরি করুন</p>
          </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                সার্টিফিকেট তৈরি করুন
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>নতুন সার্টিফিকেট তৈরি করুন</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>সার্টিফিকেটের প্রকার</Label>
                  <Select value={newCertificate.type} onValueChange={(v) => setNewCertificate({ ...newCertificate, type: v as Certificate['type'] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="transfer">বদলি সনদপত্র (TC)</SelectItem>
                      <SelectItem value="character">চারিত্রিক সনদপত্র</SelectItem>
                      <SelectItem value="bonafide">বোনাফাইড সনদপত্র</SelectItem>
                      <SelectItem value="testimonial">প্রশংসাপত্র</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>শিক্ষার্থীর নাম (English)</Label>
                    <Input value={newCertificate.studentName} onChange={(e) => setNewCertificate({ ...newCertificate, studentName: e.target.value })} placeholder="Student Name" />
                  </div>
                  <div className="space-y-2">
                    <Label>শিক্ষার্থীর নাম (বাংলা)</Label>
                    <Input value={newCertificate.studentNameBn} onChange={(e) => setNewCertificate({ ...newCertificate, studentNameBn: e.target.value })} placeholder="শিক্ষার্থীর নাম" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>স্টুডেন্ট আইডি</Label>
                    <Input value={newCertificate.studentId} onChange={(e) => setNewCertificate({ ...newCertificate, studentId: e.target.value })} placeholder="STD-XXX" />
                  </div>
                  <div className="space-y-2">
                    <Label>শ্রেণি</Label>
                    <Select value={newCertificate.class} onValueChange={(v) => setNewCertificate({ ...newCertificate, class: v })}>
                      <SelectTrigger><SelectValue placeholder="শ্রেণি" /></SelectTrigger>
                      <SelectContent>
                        {['১ম', '২য়', '৩য়', '৪র্থ', '৫ম', '৬ষ্ঠ', '৭ম', '৮ম', '৯ম', '১০ম'].map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>শাখা</Label>
                    <Select value={newCertificate.section} onValueChange={(v) => setNewCertificate({ ...newCertificate, section: v })}>
                      <SelectTrigger><SelectValue placeholder="শাখা" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">A</SelectItem>
                        <SelectItem value="B">B</SelectItem>
                        <SelectItem value="C">C</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>পিতার নাম</Label>
                    <Input value={newCertificate.fatherName} onChange={(e) => setNewCertificate({ ...newCertificate, fatherName: e.target.value })} placeholder="পিতার নাম" />
                  </div>
                  <div className="space-y-2">
                    <Label>মাতার নাম</Label>
                    <Input value={newCertificate.motherName} onChange={(e) => setNewCertificate({ ...newCertificate, motherName: e.target.value })} placeholder="মাতার নাম" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>কারণ (ঐচ্ছিক)</Label>
                  <Input value={newCertificate.reason} onChange={(e) => setNewCertificate({ ...newCertificate, reason: e.target.value })} placeholder="সার্টিফিকেটের কারণ" />
                </div>
                <div className="space-y-2">
                  <Label>মন্তব্য (ঐচ্ছিক)</Label>
                  <Textarea value={newCertificate.remarks} onChange={(e) => setNewCertificate({ ...newCertificate, remarks: e.target.value })} placeholder="অতিরিক্ত মন্তব্য" rows={2} />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild><Button variant="outline">বাতিল</Button></DialogClose>
                <Button onClick={handleAddCertificate}>তৈরি করুন</Button>
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
                  <Award className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{certificates.length}</p>
                  <p className="text-xs text-muted-foreground">মোট সার্টিফিকেট</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="card-elevated">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-500/10">
                  <Clock className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{certificates.filter((c) => c.status === 'pending').length}</p>
                  <p className="text-xs text-muted-foreground">অপেক্ষমান</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="card-elevated">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <CheckCircle className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{certificates.filter((c) => c.status === 'approved').length}</p>
                  <p className="text-xs text-muted-foreground">অনুমোদিত</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="card-elevated">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <Printer className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{certificates.filter((c) => c.status === 'printed').length}</p>
                  <p className="text-xs text-muted-foreground">প্রিন্ট হয়েছে</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="certificates" className="space-y-4">
          <TabsList>
            <TabsTrigger value="certificates" className="gap-2">
              <Award className="w-4 h-4" />
              সার্টিফিকেট
            </TabsTrigger>
            <TabsTrigger value="templates" className="gap-2">
              <FileText className="w-4 h-4" />
              টেমপ্লেট
            </TabsTrigger>
          </TabsList>

          <TabsContent value="certificates" className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="সার্টিফিকেট খুঁজুন..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="প্রকার" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">সব প্রকার</SelectItem>
                  <SelectItem value="transfer">বদলি সনদ</SelectItem>
                  <SelectItem value="character">চারিত্রিক সনদ</SelectItem>
                  <SelectItem value="bonafide">বোনাফাইড</SelectItem>
                  <SelectItem value="testimonial">প্রশংসাপত্র</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="স্ট্যাটাস" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">সব স্ট্যাটাস</SelectItem>
                  <SelectItem value="pending">অপেক্ষমান</SelectItem>
                  <SelectItem value="approved">অনুমোদিত</SelectItem>
                  <SelectItem value="printed">প্রিন্ট হয়েছে</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Certificates Table */}
            <Card className="card-elevated">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-4 font-medium text-muted-foreground">সিরিয়াল নং</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">শিক্ষার্থী</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">প্রকার</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">শ্রেণি</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">তারিখ</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">স্ট্যাটাস</th>
                        <th className="text-right p-4 font-medium text-muted-foreground">অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCertificates.map((cert) => (
                        <tr key={cert.id} className="border-b border-border last:border-0">
                          <td className="p-4 font-mono text-sm text-primary">{cert.serialNo}</td>
                          <td className="p-4">
                            <div>
                              <p className="font-medium text-foreground">{cert.studentNameBn}</p>
                              <p className="text-sm text-muted-foreground">{cert.studentId}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge className={getTypeColor(cert.type)}>{getTypeLabel(cert.type)}</Badge>
                          </td>
                          <td className="p-4 text-muted-foreground">{cert.class} ({cert.section})</td>
                          <td className="p-4 text-muted-foreground">{cert.issueDate}</td>
                          <td className="p-4">
                            <Badge className={getStatusColor(cert.status)}>{getStatusLabel(cert.status)}</Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex justify-end gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelectedCertificate(cert); setIsViewOpen(true); }}>
                                <Eye className="w-4 h-4" />
                              </Button>
                              {cert.status === 'pending' && (
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500" onClick={() => handleApprove(cert.id)}>
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                              )}
                              {cert.status === 'approved' && (
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-green-500" onClick={() => handlePrint(cert.id)}>
                                  <Printer className="w-4 h-4" />
                                </Button>
                              )}
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelectedCertificate(cert); setIsEditOpen(true); }}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteCertificate(cert.id)}>
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

          <TabsContent value="templates" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {templates.map((template) => (
                <Card key={template.id} className="card-elevated">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-foreground">{template.nameBn}</h3>
                        <p className="text-sm text-muted-foreground">{template.name}</p>
                      </div>
                      <Badge className={getTypeColor(template.type)}>{getTypeLabel(template.type)}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{template.content}</p>
                    <div className="flex justify-between items-center">
                      <Badge variant={template.isActive ? 'default' : 'secondary'}>
                        {template.isActive ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                      </Badge>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelectedTemplate(template); setIsTemplateEditOpen(true); }}>
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* View Dialog */}
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>সার্টিফিকেট বিস্তারিত</DialogTitle>
            </DialogHeader>
            {selectedCertificate && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">সিরিয়াল নং</Label>
                    <p className="font-mono text-primary">{selectedCertificate.serialNo}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">প্রকার</Label>
                    <Badge className={getTypeColor(selectedCertificate.type)}>{getTypeLabel(selectedCertificate.type)}</Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">শিক্ষার্থীর নাম</Label>
                    <p className="font-medium">{selectedCertificate.studentNameBn}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">স্টুডেন্ট আইডি</Label>
                    <p>{selectedCertificate.studentId}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">পিতার নাম</Label>
                    <p>{selectedCertificate.fatherName}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">মাতার নাম</Label>
                    <p>{selectedCertificate.motherName}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-muted-foreground">শ্রেণি</Label>
                    <p>{selectedCertificate.class}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">শাখা</Label>
                    <p>{selectedCertificate.section}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">তারিখ</Label>
                    <p>{selectedCertificate.issueDate}</p>
                  </div>
                </div>
                {selectedCertificate.reason && (
                  <div>
                    <Label className="text-muted-foreground">কারণ</Label>
                    <p>{selectedCertificate.reason}</p>
                  </div>
                )}
                {selectedCertificate.remarks && (
                  <div>
                    <Label className="text-muted-foreground">মন্তব্য</Label>
                    <p>{selectedCertificate.remarks}</p>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <DialogClose asChild><Button variant="outline">বন্ধ করুন</Button></DialogClose>
              {selectedCertificate?.status === 'approved' && (
                <Button onClick={() => { handlePrint(selectedCertificate.id); setIsViewOpen(false); }}>
                  <Printer className="w-4 h-4 mr-2" />
                  প্রিন্ট করুন
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Certificate Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>সার্টিফিকেট সম্পাদনা</DialogTitle>
            </DialogHeader>
            {selectedCertificate && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>শিক্ষার্থীর নাম (English)</Label>
                    <Input value={selectedCertificate.studentName} onChange={(e) => setSelectedCertificate({ ...selectedCertificate, studentName: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>শিক্ষার্থীর নাম (বাংলা)</Label>
                    <Input value={selectedCertificate.studentNameBn} onChange={(e) => setSelectedCertificate({ ...selectedCertificate, studentNameBn: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>কারণ</Label>
                  <Input value={selectedCertificate.reason || ''} onChange={(e) => setSelectedCertificate({ ...selectedCertificate, reason: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>মন্তব্য</Label>
                  <Textarea value={selectedCertificate.remarks || ''} onChange={(e) => setSelectedCertificate({ ...selectedCertificate, remarks: e.target.value })} rows={2} />
                </div>
              </div>
            )}
            <DialogFooter>
              <DialogClose asChild><Button variant="outline">বাতিল</Button></DialogClose>
              <Button onClick={handleEditCertificate}>আপডেট করুন</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Template Dialog */}
        <Dialog open={isTemplateEditOpen} onOpenChange={setIsTemplateEditOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>টেমপ্লেট সম্পাদনা</DialogTitle>
            </DialogHeader>
            {selectedTemplate && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>নাম (English)</Label>
                    <Input value={selectedTemplate.name} onChange={(e) => setSelectedTemplate({ ...selectedTemplate, name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>নাম (বাংলা)</Label>
                    <Input value={selectedTemplate.nameBn} onChange={(e) => setSelectedTemplate({ ...selectedTemplate, nameBn: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>কন্টেন্ট</Label>
                  <Textarea value={selectedTemplate.content} onChange={(e) => setSelectedTemplate({ ...selectedTemplate, content: e.target.value })} rows={6} />
                  <p className="text-xs text-muted-foreground">ভ্যারিয়েবল: {'{student_name}'}, {'{father_name}'}, {'{mother_name}'}, {'{class}'}, {'{roll}'}, {'{student_id}'}</p>
                </div>
              </div>
            )}
            <DialogFooter>
              <DialogClose asChild><Button variant="outline">বাতিল</Button></DialogClose>
              <Button onClick={handleEditTemplate}>আপডেট করুন</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Certificates;
