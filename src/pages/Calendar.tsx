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
  CalendarDays,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Clock,
  MapPin,
  Users,
  PartyPopper,
  BookOpen,
  Sun,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  titleBn: string;
  description: string;
  date: string;
  endDate?: string;
  time?: string;
  type: 'holiday' | 'exam' | 'event' | 'meeting' | 'other';
  location?: string;
  participants?: string;
  isImportant: boolean;
}

const initialEvents: CalendarEvent[] = [
  { id: '1', title: 'Eid ul-Fitr Holiday', titleBn: 'ঈদ-উল-ফিতর ছুটি', description: 'ঈদ-উল-ফিতর উপলক্ষে ৭ দিনের ছুটি', date: '2024-04-10', endDate: '2024-04-16', type: 'holiday', isImportant: true },
  { id: '2', title: 'Half-Yearly Exam', titleBn: 'অর্ধ-বার্ষিক পরীক্ষা', description: 'সকল শ্রেণির অর্ধ-বার্ষিক পরীক্ষা শুরু', date: '2024-05-01', endDate: '2024-05-15', type: 'exam', isImportant: true },
  { id: '3', title: 'Annual Sports Day', titleBn: 'বার্ষিক ক্রীড়া প্রতিযোগিতা', description: 'বার্ষিক ক্রীড়া প্রতিযোগিতা ও পুরস্কার বিতরণী', date: '2024-03-15', time: '09:00', type: 'event', location: 'স্কুল মাঠ', participants: 'সকল শিক্ষার্থী', isImportant: true },
  { id: '4', title: 'Parent-Teacher Meeting', titleBn: 'অভিভাবক সভা', description: '১ম সাময়িক পরীক্ষার ফলাফল নিয়ে আলোচনা', date: '2024-02-20', time: '10:00', type: 'meeting', location: 'স্কুল অডিটোরিয়াম', participants: 'সকল অভিভাবক', isImportant: false },
  { id: '5', title: 'Independence Day', titleBn: 'স্বাধীনতা দিবস', description: 'জাতীয় স্বাধীনতা দিবস উদযাপন ও ছুটি', date: '2024-03-26', type: 'holiday', isImportant: true },
  { id: '6', title: 'Science Fair', titleBn: 'বিজ্ঞান মেলা', description: 'বার্ষিক বিজ্ঞান মেলা ও প্রদর্শনী', date: '2024-04-05', time: '10:00', type: 'event', location: 'স্কুল হল', participants: '৬ষ্ঠ-১০ম শ্রেণি', isImportant: false },
  { id: '7', title: 'Final Exam', titleBn: 'বার্ষিক পরীক্ষা', description: 'বার্ষিক পরীক্ষা শুরু', date: '2024-11-15', endDate: '2024-11-30', type: 'exam', isImportant: true },
  { id: '8', title: 'Victory Day', titleBn: 'বিজয় দিবস', description: 'মহান বিজয় দিবস উদযাপন', date: '2024-12-16', type: 'holiday', isImportant: true },
];

const months = [
  'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
  'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
];

const weekDays = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি'];

const Calendar: React.FC = () => {
  const { toast } = useToast();
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    titleBn: '',
    description: '',
    date: '',
    endDate: '',
    time: '',
    type: 'event' as CalendarEvent['type'],
    location: '',
    participants: '',
    isImportant: false,
  });

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);

  const getEventsForDate = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter((e) => {
      if (e.endDate) {
        return dateStr >= e.date && dateStr <= e.endDate;
      }
      return e.date === dateStr;
    });
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.titleBn.includes(searchTerm);
    const matchesType = filterType === 'all' || event.type === filterType;
    return matchesSearch && matchesType;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date) {
      toast({ title: 'ত্রুটি', description: 'সব ফিল্ড পূরণ করুন', variant: 'destructive' });
      return;
    }
    const event: CalendarEvent = { id: Date.now().toString(), ...newEvent };
    setEvents([event, ...events]);
    setNewEvent({ title: '', titleBn: '', description: '', date: '', endDate: '', time: '', type: 'event', location: '', participants: '', isImportant: false });
    setIsAddOpen(false);
    toast({ title: 'সফল', description: 'ইভেন্ট যোগ করা হয়েছে' });
  };

  const handleEditEvent = () => {
    if (!selectedEvent) return;
    setEvents(events.map((e) => (e.id === selectedEvent.id ? selectedEvent : e)));
    setIsEditOpen(false);
    toast({ title: 'সফল', description: 'ইভেন্ট আপডেট করা হয়েছে' });
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter((e) => e.id !== id));
    toast({ title: 'সফল', description: 'ইভেন্ট মুছে ফেলা হয়েছে' });
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      holiday: <Sun className="w-4 h-4" />,
      exam: <BookOpen className="w-4 h-4" />,
      event: <PartyPopper className="w-4 h-4" />,
      meeting: <Users className="w-4 h-4" />,
      other: <CalendarDays className="w-4 h-4" />,
    };
    return icons[type] || icons.other;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      holiday: 'bg-red-500/10 text-red-500 border-red-500/20',
      exam: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      event: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
      meeting: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
      other: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
    };
    return colors[type] || colors.other;
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      holiday: 'ছুটি',
      exam: 'পরীক্ষা',
      event: 'অনুষ্ঠান',
      meeting: 'সভা',
      other: 'অন্যান্য',
    };
    return labels[type] || type;
  };

  const getDotColor = (type: string) => {
    const colors: Record<string, string> = {
      holiday: 'bg-red-500',
      exam: 'bg-blue-500',
      event: 'bg-purple-500',
      meeting: 'bg-orange-500',
      other: 'bg-gray-500',
    };
    return colors[type] || colors.other;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">একাডেমিক ক্যালেন্ডার</h1>
            <p className="text-muted-foreground">ছুটি, পরীক্ষা ও অনুষ্ঠান পরিচালনা করুন</p>
          </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                ইভেন্ট যোগ করুন
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
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
                <div className="space-y-2">
                  <Label>প্রকার</Label>
                  <Select value={newEvent.type} onValueChange={(v) => setNewEvent({ ...newEvent, type: v as CalendarEvent['type'] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="holiday">ছুটি</SelectItem>
                      <SelectItem value="exam">পরীক্ষা</SelectItem>
                      <SelectItem value="event">অনুষ্ঠান</SelectItem>
                      <SelectItem value="meeting">সভা</SelectItem>
                      <SelectItem value="other">অন্যান্য</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>শুরুর তারিখ</Label>
                    <Input type="date" value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>শেষ তারিখ (ঐচ্ছিক)</Label>
                    <Input type="date" value={newEvent.endDate} onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>সময় (ঐচ্ছিক)</Label>
                    <Input type="time" value={newEvent.time} onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>স্থান (ঐচ্ছিক)</Label>
                    <Input value={newEvent.location} onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })} placeholder="স্থানের নাম" />
                  </div>
                  <div className="space-y-2">
                    <Label>অংশগ্রহণকারী (ঐচ্ছিক)</Label>
                    <Input value={newEvent.participants} onChange={(e) => setNewEvent({ ...newEvent, participants: e.target.value })} placeholder="যারা অংশ নেবে" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>বিবরণ</Label>
                  <Textarea value={newEvent.description} onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} placeholder="ইভেন্টের বিস্তারিত বিবরণ" rows={3} />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="isImportant" checked={newEvent.isImportant} onChange={(e) => setNewEvent({ ...newEvent, isImportant: e.target.checked })} className="rounded" />
                  <Label htmlFor="isImportant">গুরুত্বপূর্ণ হিসেবে চিহ্নিত করুন</Label>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild><Button variant="outline">বাতিল</Button></DialogClose>
                <Button onClick={handleAddEvent}>যোগ করুন</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="card-elevated">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <CalendarDays className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{events.length}</p>
                  <p className="text-xs text-muted-foreground">মোট ইভেন্ট</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="card-elevated">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/10">
                  <Sun className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{events.filter((e) => e.type === 'holiday').length}</p>
                  <p className="text-xs text-muted-foreground">ছুটি</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="card-elevated">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <BookOpen className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{events.filter((e) => e.type === 'exam').length}</p>
                  <p className="text-xs text-muted-foreground">পরীক্ষা</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="card-elevated">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <PartyPopper className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{events.filter((e) => e.type === 'event').length}</p>
                  <p className="text-xs text-muted-foreground">অনুষ্ঠান</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="card-elevated">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-500/10">
                  <Users className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{events.filter((e) => e.type === 'meeting').length}</p>
                  <p className="text-xs text-muted-foreground">সভা</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Calendar View */}
          <Card className="card-elevated lg:col-span-2">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="icon" onClick={previousMonth}>
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <CardTitle>{months[currentMonth]} {currentYear}</CardTitle>
                <Button variant="ghost" size="icon" onClick={nextMonth}>
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1">
                {weekDays.map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} className="p-2" />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dayEvents = getEventsForDate(day);
                  const isToday = new Date().getDate() === day && new Date().getMonth() === currentMonth && new Date().getFullYear() === currentYear;
                  return (
                    <div
                      key={day}
                      className={`p-2 min-h-[80px] border border-border rounded-lg ${isToday ? 'bg-primary/10 border-primary' : 'hover:bg-muted/50'} cursor-pointer transition-colors`}
                      onClick={() => {
                        if (dayEvents.length > 0) {
                          setSelectedEvent(dayEvents[0]);
                          setIsViewOpen(true);
                        }
                      }}
                    >
                      <span className={`text-sm font-medium ${isToday ? 'text-primary' : 'text-foreground'}`}>{day}</span>
                      <div className="mt-1 space-y-1">
                        {dayEvents.slice(0, 2).map((event) => (
                          <div key={event.id} className={`text-xs p-1 rounded truncate ${getTypeColor(event.type)}`}>
                            {event.titleBn}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <span className="text-xs text-muted-foreground">+{dayEvents.length - 2} আরও</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                আসন্ন ইভেন্ট
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {filteredEvents.slice(0, 6).map((event) => (
                <div
                  key={event.id}
                  className="p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => { setSelectedEvent(event); setIsViewOpen(true); }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={getTypeColor(event.type)}>
                          {getTypeIcon(event.type)}
                          <span className="ml-1">{getTypeLabel(event.type)}</span>
                        </Badge>
                        {event.isImportant && <AlertCircle className="w-4 h-4 text-red-500" />}
                      </div>
                      <h4 className="font-medium text-foreground truncate">{event.titleBn}</h4>
                      <p className="text-sm text-muted-foreground">{event.date}{event.time && ` | ${event.time}`}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Events List */}
        <Card className="card-elevated">
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <CardTitle>সকল ইভেন্ট</CardTitle>
              <div className="flex gap-2">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="ইভেন্ট খুঁজুন..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="প্রকার" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">সব</SelectItem>
                    <SelectItem value="holiday">ছুটি</SelectItem>
                    <SelectItem value="exam">পরীক্ষা</SelectItem>
                    <SelectItem value="event">অনুষ্ঠান</SelectItem>
                    <SelectItem value="meeting">সভা</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${getTypeColor(event.type)}`}>
                      {getTypeIcon(event.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-foreground">{event.titleBn}</h4>
                        {event.isImportant && <Badge variant="destructive" className="text-xs">গুরুত্বপূর্ণ</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <CalendarDays className="w-3 h-3" />
                          {event.date}{event.endDate && ` - ${event.endDate}`}
                        </span>
                        {event.time && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {event.time}
                          </span>
                        )}
                        {event.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {event.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelectedEvent(event); setIsViewOpen(true); }}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelectedEvent(event); setIsEditOpen(true); }}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteEvent(event.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* View Dialog */}
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedEvent?.titleBn}</DialogTitle>
            </DialogHeader>
            {selectedEvent && (
              <div className="space-y-4 py-4">
                <div className="flex items-center gap-2">
                  <Badge className={getTypeColor(selectedEvent.type)}>
                    {getTypeIcon(selectedEvent.type)}
                    <span className="ml-1">{getTypeLabel(selectedEvent.type)}</span>
                  </Badge>
                  {selectedEvent.isImportant && <Badge variant="destructive">গুরুত্বপূর্ণ</Badge>}
                </div>
                <div>
                  <Label className="text-muted-foreground">বিবরণ</Label>
                  <p>{selectedEvent.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">তারিখ</Label>
                    <p>{selectedEvent.date}{selectedEvent.endDate && ` - ${selectedEvent.endDate}`}</p>
                  </div>
                  {selectedEvent.time && (
                    <div>
                      <Label className="text-muted-foreground">সময়</Label>
                      <p>{selectedEvent.time}</p>
                    </div>
                  )}
                </div>
                {selectedEvent.location && (
                  <div>
                    <Label className="text-muted-foreground">স্থান</Label>
                    <p>{selectedEvent.location}</p>
                  </div>
                )}
                {selectedEvent.participants && (
                  <div>
                    <Label className="text-muted-foreground">অংশগ্রহণকারী</Label>
                    <p>{selectedEvent.participants}</p>
                  </div>
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
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>ইভেন্ট সম্পাদনা</DialogTitle>
            </DialogHeader>
            {selectedEvent && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>শিরোনাম (English)</Label>
                    <Input value={selectedEvent.title} onChange={(e) => setSelectedEvent({ ...selectedEvent, title: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>শিরোনাম (বাংলা)</Label>
                    <Input value={selectedEvent.titleBn} onChange={(e) => setSelectedEvent({ ...selectedEvent, titleBn: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>প্রকার</Label>
                  <Select value={selectedEvent.type} onValueChange={(v) => setSelectedEvent({ ...selectedEvent, type: v as CalendarEvent['type'] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="holiday">ছুটি</SelectItem>
                      <SelectItem value="exam">পরীক্ষা</SelectItem>
                      <SelectItem value="event">অনুষ্ঠান</SelectItem>
                      <SelectItem value="meeting">সভা</SelectItem>
                      <SelectItem value="other">অন্যান্য</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>শুরুর তারিখ</Label>
                    <Input type="date" value={selectedEvent.date} onChange={(e) => setSelectedEvent({ ...selectedEvent, date: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>শেষ তারিখ</Label>
                    <Input type="date" value={selectedEvent.endDate || ''} onChange={(e) => setSelectedEvent({ ...selectedEvent, endDate: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>সময়</Label>
                    <Input type="time" value={selectedEvent.time || ''} onChange={(e) => setSelectedEvent({ ...selectedEvent, time: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>বিবরণ</Label>
                  <Textarea value={selectedEvent.description} onChange={(e) => setSelectedEvent({ ...selectedEvent, description: e.target.value })} rows={3} />
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

export default Calendar;
