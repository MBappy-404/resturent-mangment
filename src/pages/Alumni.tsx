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
  Users,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  GraduationCap,
  Briefcase,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Award,
  Building,
} from 'lucide-react';
import api from '@/services/api';

interface AlumniMember {
  id: string;
  name: string;
  nameBn: string;
  email: string;
  phone: string;
  passingYear: string;
  class: string;
  currentProfession: string;
  company: string;
  designation: string;
  address: string;
  achievements: string;
  photo?: string;
  status: 'active' | 'inactive';
}

interface AlumniEvent {
  id: string;
  title: string;
  titleBn: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  organizer: string;
  expectedAttendees: number;
  status: 'upcoming' | 'completed' | 'cancelled';
}

const _unusedAlumni: AlumniMember[] = [
  { id: '1', name: 'Dr. Mahbub Alam', nameBn: 'ড. মাহবুব আলম', email: 'mahbub@email.com', phone: '01712345678', passingYear: '2010', class: 'SSC', currentProfession: 'Doctor', company: 'Chittagong Medical College', designation: 'Professor', address: 'চট্টগ্রাম', achievements: 'MBBS Gold Medalist, Published 20+ research papers', status: 'active' },
  { id: '2', name: 'Eng. Fatima Rahman', nameBn: 'ইঞ্জি. ফাতিমা রহমান', email: 'fatima@email.com', phone: '01812345678', passingYear: '2012', class: 'SSC', currentProfession: 'Software Engineer', company: 'Google', designation: 'Senior Engineer', address: 'ঢাকা', achievements: 'BUET First Class, Google Developer Expert', status: 'active' },
  { id: '3', name: 'Adv. Karim Uddin', nameBn: 'অ্যাডভোকেট করিম উদ্দিন', email: 'karim@email.com', phone: '01912345678', passingYear: '2008', class: 'SSC', currentProfession: 'Lawyer', company: 'Supreme Court', designation: 'Advocate', address: 'চট্টগ্রাম', achievements: 'LLB Gold Medalist, 100+ successful cases', status: 'active' },
  { id: '4', name: 'Prof. Salma Khatun', nameBn: 'প্রফেসর সালমা খাতুন', email: 'salma@email.com', phone: '01612345678', passingYear: '2005', class: 'SSC', currentProfession: 'Professor', company: 'Chittagong University', designation: 'Professor', address: 'চট্টগ্রাম', achievements: 'PhD from UK, Vice Chancellor Award', status: 'active' },
];

const _unusedAlumniEvents: AlumniEvent[] = [
  { id: '1', title: 'Annual Alumni Reunion 2024', titleBn: 'বার্ষিক প্রাক্তন ছাত্র মিলনমেলা ২০২৪', description: 'সকল প্রাক্তন ছাত্রদের জন্য বার্ষিক মিলনমেলা', date: '2024-12-15', time: '10:00', venue: 'স্কুল অডিটোরিয়াম', organizer: 'Alumni Association', expectedAttendees: 200, status: 'upcoming' },
  { id: '2', title: 'Career Counseling Session', titleBn: 'ক্যারিয়ার কাউন্সেলিং সেশন', description: 'বর্তমান শিক্ষার্থীদের জন্য ক্যারিয়ার গাইডেন্স', date: '2024-03-20', time: '14:00', venue: 'সেমিনার হল', organizer: 'Dr. Mahbub Alam', expectedAttendees: 100, status: 'completed' },
  { id: '3', title: 'Scholarship Fund Program', titleBn: 'বৃত্তি তহবিল কর্মসূচি', description: 'মেধাবী শিক্ষার্থীদের জন্য বৃত্তি প্রদান', date: '2024-06-10', time: '11:00', venue: 'স্কুল মাঠ', organizer: 'Alumni Association', expectedAttendees: 150, status: 'upcoming' },
];

const Alumni: React.FC = () => {
  const { toast } = useToast();
  const [alumni, setAlumni] = useState<AlumniMember[]>([]);
  const [events, setEvents] = useState<AlumniEvent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState<string>('all');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedAlumni, setSelectedAlumni] = useState<AlumniMember | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<AlumniEvent | null>(null);
  const [isEventEditOpen, setIsEventEditOpen] = useState(false);
  const [newAlumni, setNewAlumni] = useState({
    name: '', nameBn: '', email: '', phone: '', passingYear: '', class: 'SSC',
    currentProfession: '', company: '', designation: '', address: '', achievements: '', status: 'active' as AlumniMember['status']
  });
  const [newEvent, setNewEvent] = useState({
    title: '', titleBn: '', description: '', date: '', time: '', venue: '', organizer: '', expectedAttendees: 0, status: 'upcoming' as AlumniEvent['status']
  });

  const years = Array.from({ length: 30 }, (_, i) => (new Date().getFullYear() - i).toString());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const aRes = await api.getAlumni();
        const aRaw = aRes.data as Record<string, unknown>;
        const aArr = Array.isArray(aRaw) ? aRaw : (Array.isArray((aRaw as Record<string, unknown>)?.alumni) ? (aRaw as Record<string, unknown>).alumni as Record<string, unknown>[] : []);
        setAlumni(aArr.map((a: Record<string, unknown>) => ({ id: (a._id || a.id) as string, name: (a.name || '') as string, nameBn: (a.nameBn || '') as string, email: (a.email || '') as string, phone: (a.phone || '') as string, passingYear: (a.passingYear || '') as string, class: (a.class || '') as string, currentProfession: (a.currentProfession || '') as string, company: (a.company || '') as string, designation: (a.designation || '') as string, address: (a.address || '') as string, achievements: (a.achievements || '') as string, status: (a.status || 'active') as AlumniMember['status'] })));
      } catch (e) { console.error('Failed to load alumni', e); }
      try {
        const eRes = await api.getAlumniEvents();
        const eRaw = eRes.data as Record<string, unknown>;
        const eArr = Array.isArray(eRaw) ? eRaw : (Array.isArray((eRaw as Record<string, unknown>)?.events) ? (eRaw as Record<string, unknown>).events as Record<string, unknown>[] : []);
        setEvents(eArr.map((e: Record<string, unknown>) => ({ id: (e._id || e.id) as string, title: (e.title || '') as string, titleBn: (e.titleBn || '') as string, description: (e.description || '') as string, date: e.date ? new Date(e.date as string).toISOString().split('T')[0] : '', time: (e.time || '') as string, venue: (e.venue || '') as string, organizer: (e.organizer || '') as string, expectedAttendees: (e.expectedAttendees || 0) as number, status: (e.status || 'upcoming') as AlumniEvent['status'] })));
      } catch (e) { console.error('Failed to load alumni events', e); }
    };
    fetchData();
  }, []);

  const filteredAlumni = alumni.filter((a) => {
    const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.nameBn.includes(searchTerm) || a.currentProfession.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = filterYear === 'all' || a.passingYear === filterYear;
    return matchesSearch && matchesYear;
  });

  const handleAddAlumni = async () => {
    if (!newAlumni.name || !newAlumni.phone) {
      toast({ title: 'ত্রুটি', description: 'সব ফিল্ড পূরণ করুন', variant: 'destructive' });
      return;
    }
    try {
      const res = await api.createAlumni(newAlumni);
      const a = res.data as Record<string, unknown>;
      setAlumni([{ id: (a._id || a.id) as string, name: (a.name || '') as string, nameBn: (a.nameBn || '') as string, email: (a.email || '') as string, phone: (a.phone || '') as string, passingYear: (a.passingYear || '') as string, class: (a.class || '') as string, currentProfession: (a.currentProfession || '') as string, company: (a.company || '') as string, designation: (a.designation || '') as string, address: (a.address || '') as string, achievements: (a.achievements || '') as string, status: (a.status || 'active') as AlumniMember['status'] }, ...alumni]);
      setNewAlumni({ name: '', nameBn: '', email: '', phone: '', passingYear: '', class: 'SSC', currentProfession: '', company: '', designation: '', address: '', achievements: '', status: 'active' });
      setIsAddOpen(false);
      toast({ title: 'সফল', description: 'প্রাক্তন ছাত্র যোগ করা হয়েছে' });
    } catch (e) { toast({ title: 'ত্রুটি', description: 'যোগ করতে ব্যর্থ', variant: 'destructive' }); }
  };

  const handleEditAlumni = async () => {
    if (!selectedAlumni) return;
    try {
      await api.updateAlumni(selectedAlumni.id, selectedAlumni);
      setAlumni(alumni.map((a) => (a.id === selectedAlumni.id ? selectedAlumni : a)));
      setIsEditOpen(false);
      toast({ title: 'সফল', description: 'তথ্য আপডেট করা হয়েছে' });
    } catch (e) { toast({ title: 'ত্রুটি', description: 'আপডেট ব্যর্থ', variant: 'destructive' }); }
  };

  const handleDeleteAlumni = async (id: string) => {
    try {
      await api.deleteAlumni(id);
      setAlumni(alumni.filter((a) => a.id !== id));
      toast({ title: 'সফল', description: 'মুছে ফেলা হয়েছে' });
    } catch (e) { toast({ title: 'ত্রুটি', description: 'মুছতে ব্যর্থ', variant: 'destructive' }); }
  };

  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.date) {
      toast({ title: 'ত্রুটি', description: 'সব ফিল্ড পূরণ করুন', variant: 'destructive' });
      return;
    }
    try {
      const res = await api.createAlumniEvent(newEvent);
      const ev = res.data as Record<string, unknown>;
      setEvents([{ id: (ev._id || ev.id) as string, title: (ev.title || '') as string, titleBn: (ev.titleBn || '') as string, description: (ev.description || '') as string, date: ev.date ? new Date(ev.date as string).toISOString().split('T')[0] : '', time: (ev.time || '') as string, venue: (ev.venue || '') as string, organizer: (ev.organizer || '') as string, expectedAttendees: (ev.expectedAttendees || 0) as number, status: (ev.status || 'upcoming') as AlumniEvent['status'] }, ...events]);
      setNewEvent({ title: '', titleBn: '', description: '', date: '', time: '', venue: '', organizer: '', expectedAttendees: 0, status: 'upcoming' });
      setIsAddEventOpen(false);
      toast({ title: 'সফল', description: 'ইভেন্ট যোগ করা হয়েছে' });
    } catch (e) { toast({ title: 'ত্রুটি', description: 'যোগ করতে ব্যর্থ', variant: 'destructive' }); }
  };

  const handleEditEvent = async () => {
    if (!selectedEvent) return;
    try {
      await api.updateAlumniEvent(selectedEvent.id, selectedEvent);
      setEvents(events.map((e) => (e.id === selectedEvent.id ? selectedEvent : e)));
      setIsEventEditOpen(false);
      toast({ title: 'সফল', description: 'ইভেন্ট আপডেট করা হয়েছে' });
    } catch (e) { toast({ title: 'ত্রুটি', description: 'আপডেট ব্যর্থ', variant: 'destructive' }); }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      await api.deleteAlumniEvent(id);
      setEvents(events.filter((e) => e.id !== id));
      toast({ title: 'সফল', description: 'ইভেন্ট মুছে ফেলা হয়েছে' });
    } catch (e) { toast({ title: 'ত্রুটি', description: 'মুছতে ব্যর্থ', variant: 'destructive' }); }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-500/10 text-green-500',
      inactive: 'bg-gray-500/10 text-gray-500',
      upcoming: 'bg-blue-500/10 text-blue-500',
      completed: 'bg-green-500/10 text-green-500',
      cancelled: 'bg-red-500/10 text-red-500',
    };
    return colors[status] || colors.active;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">প্রাক্তন ছাত্র ব্যবস্থাপনা</h1>
            <p className="text-muted-foreground">Alumni database, career tracking & events</p>
          </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                প্রাক্তন ছাত্র যোগ করুন
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>নতুন প্রাক্তন ছাত্র যোগ করুন</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>নাম (English)</Label>
                    <Input value={newAlumni.name} onChange={(e) => setNewAlumni({ ...newAlumni, name: e.target.value })} placeholder="Full Name" />
                  </div>
                  <div className="space-y-2">
                    <Label>নাম (বাংলা)</Label>
                    <Input value={newAlumni.nameBn} onChange={(e) => setNewAlumni({ ...newAlumni, nameBn: e.target.value })} placeholder="পুরো নাম" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>ইমেইল</Label>
                    <Input type="email" value={newAlumni.email} onChange={(e) => setNewAlumni({ ...newAlumni, email: e.target.value })} placeholder="email@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>ফোন</Label>
                    <Input value={newAlumni.phone} onChange={(e) => setNewAlumni({ ...newAlumni, phone: e.target.value })} placeholder="01XXXXXXXXX" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>পাশের সাল</Label>
                    <Select value={newAlumni.passingYear} onValueChange={(v) => setNewAlumni({ ...newAlumni, passingYear: v })}>
                      <SelectTrigger><SelectValue placeholder="সাল নির্বাচন করুন" /></SelectTrigger>
                      <SelectContent>
                        {years.map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>পরীক্ষা</Label>
                    <Select value={newAlumni.class} onValueChange={(v) => setNewAlumni({ ...newAlumni, class: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PSC">PSC</SelectItem>
                        <SelectItem value="JSC">JSC</SelectItem>
                        <SelectItem value="SSC">SSC</SelectItem>
                        <SelectItem value="HSC">HSC</SelectItem>
                        <SelectItem value="Dakhil">দাখিল</SelectItem>
                        <SelectItem value="Alim">আলিম</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>পেশা</Label>
                    <Input value={newAlumni.currentProfession} onChange={(e) => setNewAlumni({ ...newAlumni, currentProfession: e.target.value })} placeholder="পেশা" />
                  </div>
                  <div className="space-y-2">
                    <Label>প্রতিষ্ঠান</Label>
                    <Input value={newAlumni.company} onChange={(e) => setNewAlumni({ ...newAlumni, company: e.target.value })} placeholder="কোম্পানি/প্রতিষ্ঠান" />
                  </div>
                  <div className="space-y-2">
                    <Label>পদবী</Label>
                    <Input value={newAlumni.designation} onChange={(e) => setNewAlumni({ ...newAlumni, designation: e.target.value })} placeholder="পদবী" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>ঠিকানা</Label>
                  <Input value={newAlumni.address} onChange={(e) => setNewAlumni({ ...newAlumni, address: e.target.value })} placeholder="বর্তমান ঠিকানা" />
                </div>
                <div className="space-y-2">
                  <Label>অর্জন/সাফল্য</Label>
                  <Textarea value={newAlumni.achievements} onChange={(e) => setNewAlumni({ ...newAlumni, achievements: e.target.value })} placeholder="উল্লেখযোগ্য অর্জন" rows={2} />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild><Button variant="outline">বাতিল</Button></DialogClose>
                <Button onClick={handleAddAlumni}>যোগ করুন</Button>
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
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{alumni.length}</p>
                  <p className="text-xs text-muted-foreground">মোট প্রাক্তন ছাত্র</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="card-elevated">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <Briefcase className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{alumni.filter((a) => a.status === 'active').length}</p>
                  <p className="text-xs text-muted-foreground">সক্রিয় সদস্য</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="card-elevated">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Calendar className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{events.filter((e) => e.status === 'upcoming').length}</p>
                  <p className="text-xs text-muted-foreground">আসন্ন ইভেন্ট</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="card-elevated">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Award className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{events.filter((e) => e.status === 'completed').length}</p>
                  <p className="text-xs text-muted-foreground">সম্পন্ন ইভেন্ট</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="members" className="space-y-4">
          <TabsList>
            <TabsTrigger value="members" className="gap-2">
              <Users className="w-4 h-4" />
              সদস্যগণ
            </TabsTrigger>
            <TabsTrigger value="events" className="gap-2">
              <Calendar className="w-4 h-4" />
              ইভেন্ট
            </TabsTrigger>
          </TabsList>

          <TabsContent value="members" className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="নাম বা পেশা দিয়ে খুঁজুন..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
              <Select value={filterYear} onValueChange={setFilterYear}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="পাশের সাল" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">সব সাল</SelectItem>
                  {years.slice(0, 20).map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {filteredAlumni.map((member) => (
                <Card key={member.id} className="card-elevated">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-8 h-8 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-foreground">{member.nameBn}</h3>
                            <p className="text-sm text-muted-foreground">{member.name}</p>
                          </div>
                          <Badge className={getStatusColor(member.status)}>{member.status === 'active' ? 'সক্রিয়' : 'নিষ্ক্রিয়'}</Badge>
                        </div>
                        <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4" />
                            <span>{member.designation}, {member.company}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <GraduationCap className="w-4 h-4" />
                            <span>{member.class} - {member.passingYear}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            <span>{member.phone}</span>
                          </div>
                        </div>
                        <div className="flex justify-end gap-1 mt-3">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelectedAlumni(member); setIsViewOpen(true); }}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelectedAlumni(member); setIsEditOpen(true); }}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteAlumni(member.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-4">
            <div className="flex justify-end">
              <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    ইভেন্ট যোগ করুন
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>নতুন ইভেন্ট যোগ করুন</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>শিরোনাম (English)</Label>
                        <Input value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} placeholder="Event Title" />
                      </div>
                      <div className="space-y-2">
                        <Label>শিরোনাম (বাংলা)</Label>
                        <Input value={newEvent.titleBn} onChange={(e) => setNewEvent({ ...newEvent, titleBn: e.target.value })} placeholder="ইভেন্ট শিরোনাম" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>তারিখ</Label>
                        <Input type="date" value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>সময়</Label>
                        <Input type="time" value={newEvent.time} onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>স্থান</Label>
                        <Input value={newEvent.venue} onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })} placeholder="ইভেন্টের স্থান" />
                      </div>
                      <div className="space-y-2">
                        <Label>আয়োজক</Label>
                        <Input value={newEvent.organizer} onChange={(e) => setNewEvent({ ...newEvent, organizer: e.target.value })} placeholder="আয়োজক" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>বিবরণ</Label>
                      <Textarea value={newEvent.description} onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} placeholder="ইভেন্টের বিবরণ" rows={2} />
                    </div>
                    <div className="space-y-2">
                      <Label>প্রত্যাশিত অংশগ্রহণকারী</Label>
                      <Input type="number" value={newEvent.expectedAttendees} onChange={(e) => setNewEvent({ ...newEvent, expectedAttendees: Number(e.target.value) })} />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild><Button variant="outline">বাতিল</Button></DialogClose>
                    <Button onClick={handleAddEvent}>যোগ করুন</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <Card key={event.id} className="card-elevated">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <Badge className={getStatusColor(event.status)}>
                        {event.status === 'upcoming' ? 'আসন্ন' : event.status === 'completed' ? 'সম্পন্ন' : 'বাতিল'}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{event.titleBn}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{event.description}</p>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{event.date} | {event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{event.venue}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{event.expectedAttendees} জন প্রত্যাশিত</span>
                      </div>
                    </div>
                    <div className="flex justify-end gap-1 mt-3">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelectedEvent(event); setIsEventEditOpen(true); }}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteEvent(event.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* View Alumni Dialog */}
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedAlumni?.nameBn}</DialogTitle>
            </DialogHeader>
            {selectedAlumni && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><Label className="text-muted-foreground">ইমেইল</Label><p className="flex items-center gap-2"><Mail className="w-4 h-4" />{selectedAlumni.email}</p></div>
                  <div><Label className="text-muted-foreground">ফোন</Label><p className="flex items-center gap-2"><Phone className="w-4 h-4" />{selectedAlumni.phone}</p></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label className="text-muted-foreground">পরীক্ষা</Label><p>{selectedAlumni.class}</p></div>
                  <div><Label className="text-muted-foreground">পাশের সাল</Label><p>{selectedAlumni.passingYear}</p></div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div><Label className="text-muted-foreground">পেশা</Label><p>{selectedAlumni.currentProfession}</p></div>
                  <div><Label className="text-muted-foreground">প্রতিষ্ঠান</Label><p>{selectedAlumni.company}</p></div>
                  <div><Label className="text-muted-foreground">পদবী</Label><p>{selectedAlumni.designation}</p></div>
                </div>
                <div><Label className="text-muted-foreground">ঠিকানা</Label><p className="flex items-center gap-2"><MapPin className="w-4 h-4" />{selectedAlumni.address}</p></div>
                <div><Label className="text-muted-foreground">অর্জন/সাফল্য</Label><p className="bg-muted p-3 rounded-lg text-sm">{selectedAlumni.achievements}</p></div>
              </div>
            )}
            <DialogFooter>
              <DialogClose asChild><Button variant="outline">বন্ধ করুন</Button></DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Alumni Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>তথ্য সম্পাদনা</DialogTitle>
            </DialogHeader>
            {selectedAlumni && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>নাম (English)</Label>
                    <Input value={selectedAlumni.name} onChange={(e) => setSelectedAlumni({ ...selectedAlumni, name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>নাম (বাংলা)</Label>
                    <Input value={selectedAlumni.nameBn} onChange={(e) => setSelectedAlumni({ ...selectedAlumni, nameBn: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>পেশা</Label>
                    <Input value={selectedAlumni.currentProfession} onChange={(e) => setSelectedAlumni({ ...selectedAlumni, currentProfession: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>পদবী</Label>
                    <Input value={selectedAlumni.designation} onChange={(e) => setSelectedAlumni({ ...selectedAlumni, designation: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>প্রতিষ্ঠান</Label>
                  <Input value={selectedAlumni.company} onChange={(e) => setSelectedAlumni({ ...selectedAlumni, company: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>স্ট্যাটাস</Label>
                  <Select value={selectedAlumni.status} onValueChange={(v) => setSelectedAlumni({ ...selectedAlumni, status: v as AlumniMember['status'] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">সক্রিয়</SelectItem>
                      <SelectItem value="inactive">নিষ্ক্রিয়</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <DialogFooter>
              <DialogClose asChild><Button variant="outline">বাতিল</Button></DialogClose>
              <Button onClick={handleEditAlumni}>আপডেট করুন</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Event Dialog */}
        <Dialog open={isEventEditOpen} onOpenChange={setIsEventEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>ইভেন্ট সম্পাদনা</DialogTitle>
            </DialogHeader>
            {selectedEvent && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>শিরোনাম (বাংলা)</Label>
                    <Input value={selectedEvent.titleBn} onChange={(e) => setSelectedEvent({ ...selectedEvent, titleBn: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>স্ট্যাটাস</Label>
                    <Select value={selectedEvent.status} onValueChange={(v) => setSelectedEvent({ ...selectedEvent, status: v as AlumniEvent['status'] })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="upcoming">আসন্ন</SelectItem>
                        <SelectItem value="completed">সম্পন্ন</SelectItem>
                        <SelectItem value="cancelled">বাতিল</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>তারিখ</Label>
                    <Input type="date" value={selectedEvent.date} onChange={(e) => setSelectedEvent({ ...selectedEvent, date: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>সময়</Label>
                    <Input type="time" value={selectedEvent.time} onChange={(e) => setSelectedEvent({ ...selectedEvent, time: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>স্থান</Label>
                  <Input value={selectedEvent.venue} onChange={(e) => setSelectedEvent({ ...selectedEvent, venue: e.target.value })} />
                </div>
              </div>
            )}
            <DialogFooter>
              <DialogClose asChild><Button variant="outline">বাতিল</Button></DialogClose>
              <Button onClick={handleEditEvent}>আপডেট করুন</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Alumni;
