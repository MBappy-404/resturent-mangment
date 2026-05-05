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
  Building,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Users,
  Bed,
  DollarSign,
  UtensilsCrossed,
  User,
  Phone,
  Calendar,
  CheckCircle,
} from 'lucide-react';

interface Room {
  id: string;
  roomNumber: string;
  floor: string;
  type: 'single' | 'double' | 'dormitory';
  capacity: number;
  occupied: number;
  monthlyRent: number;
  amenities: string;
  status: 'available' | 'full' | 'maintenance';
}

interface HostelResident {
  id: string;
  studentId: string;
  studentName: string;
  studentNameBn: string;
  class: string;
  roomId: string;
  roomNumber: string;
  bedNumber: string;
  joinDate: string;
  guardianName: string;
  guardianPhone: string;
  mealPlan: 'full' | 'partial' | 'none';
  monthlyFee: number;
  status: 'active' | 'inactive';
}

interface MealPlan {
  id: string;
  name: string;
  nameBn: string;
  description: string;
  mealsPerDay: number;
  monthlyPrice: number;
  status: 'active' | 'inactive';
}

const initialRooms: Room[] = [
  { id: '1', roomNumber: '101', floor: '1st', type: 'double', capacity: 2, occupied: 2, monthlyRent: 3000, amenities: 'AC, Attached Bathroom, Study Table', status: 'full' },
  { id: '2', roomNumber: '102', floor: '1st', type: 'double', capacity: 2, occupied: 1, monthlyRent: 3000, amenities: 'AC, Attached Bathroom, Study Table', status: 'available' },
  { id: '3', roomNumber: '201', floor: '2nd', type: 'dormitory', capacity: 6, occupied: 4, monthlyRent: 1500, amenities: 'Fan, Common Bathroom', status: 'available' },
  { id: '4', roomNumber: '202', floor: '2nd', type: 'single', capacity: 1, occupied: 1, monthlyRent: 5000, amenities: 'AC, Attached Bathroom, Study Table, TV', status: 'full' },
  { id: '5', roomNumber: '301', floor: '3rd', type: 'double', capacity: 2, occupied: 0, monthlyRent: 2500, amenities: 'Fan, Attached Bathroom', status: 'maintenance' },
];

const initialResidents: HostelResident[] = [
  { id: '1', studentId: 'STD-001', studentName: 'Rahima Akter', studentNameBn: 'রাহিমা আক্তার', class: '১০ম', roomId: '1', roomNumber: '101', bedNumber: 'A', joinDate: '2024-01-01', guardianName: 'Abdul Karim', guardianPhone: '01712345678', mealPlan: 'full', monthlyFee: 6500, status: 'active' },
  { id: '2', studentId: 'STD-002', studentName: 'Salma Khatun', studentNameBn: 'সালমা খাতুন', class: '৯ম', roomId: '1', roomNumber: '101', bedNumber: 'B', joinDate: '2024-01-05', guardianName: 'Ali Hossain', guardianPhone: '01812345678', mealPlan: 'full', monthlyFee: 6500, status: 'active' },
  { id: '3', studentId: 'STD-003', studentName: 'Fatima Rahman', studentNameBn: 'ফাতিমা রহমান', class: '৮ম', roomId: '2', roomNumber: '102', bedNumber: 'A', joinDate: '2024-01-10', guardianName: 'Rahman Uddin', guardianPhone: '01912345678', mealPlan: 'partial', monthlyFee: 5000, status: 'active' },
  { id: '4', studentId: 'STD-004', studentName: 'Ayesha Begum', studentNameBn: 'আয়েশা বেগম', class: '১০ম', roomId: '4', roomNumber: '202', bedNumber: '-', joinDate: '2024-01-15', guardianName: 'Kamal Hossain', guardianPhone: '01612345678', mealPlan: 'full', monthlyFee: 8500, status: 'active' },
];

const initialMealPlans: MealPlan[] = [
  { id: '1', name: 'Full Board', nameBn: 'পূর্ণ খাবার', description: 'সকাল, দুপুর ও রাতের খাবার', mealsPerDay: 3, monthlyPrice: 3500, status: 'active' },
  { id: '2', name: 'Partial Board', nameBn: 'আংশিক খাবার', description: 'দুপুর ও রাতের খাবার', mealsPerDay: 2, monthlyPrice: 2500, status: 'active' },
  { id: '3', name: 'Breakfast Only', nameBn: 'শুধু সকালের নাস্তা', description: 'শুধুমাত্র সকালের নাস্তা', mealsPerDay: 1, monthlyPrice: 1000, status: 'active' },
];

const Hostel: React.FC = () => {
  const { toast } = useToast();
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [residents, setResidents] = useState<HostelResident[]>(initialResidents);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>(initialMealPlans);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [isAddResidentOpen, setIsAddResidentOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedResident, setSelectedResident] = useState<HostelResident | null>(null);
  const [newRoom, setNewRoom] = useState({
    roomNumber: '', floor: '', type: 'double' as Room['type'], capacity: 2, monthlyRent: 0, amenities: '', status: 'available' as Room['status']
  });
  const [newResident, setNewResident] = useState({
    studentId: '', studentName: '', studentNameBn: '', class: '', roomId: '', bedNumber: '', guardianName: '', guardianPhone: '', mealPlan: 'full' as HostelResident['mealPlan']
  });

  const filteredResidents = residents.filter((r) => {
    const matchesSearch = r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.studentNameBn.includes(searchTerm) || r.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddRoom = () => {
    if (!newRoom.roomNumber) {
      toast({ title: 'ত্রুটি', description: 'সব ফিল্ড পূরণ করুন', variant: 'destructive' });
      return;
    }
    const room: Room = { id: Date.now().toString(), ...newRoom, occupied: 0 };
    setRooms([room, ...rooms]);
    setNewRoom({ roomNumber: '', floor: '', type: 'double', capacity: 2, monthlyRent: 0, amenities: '', status: 'available' });
    setIsAddRoomOpen(false);
    toast({ title: 'সফল', description: 'রুম যোগ করা হয়েছে' });
  };

  const handleAddResident = () => {
    if (!newResident.studentId || !newResident.roomId) {
      toast({ title: 'ত্রুটি', description: 'সব ফিল্ড পূরণ করুন', variant: 'destructive' });
      return;
    }
    const room = rooms.find((r) => r.id === newResident.roomId);
    const mealPlan = mealPlans.find((m) => m.id === (newResident.mealPlan === 'full' ? '1' : newResident.mealPlan === 'partial' ? '2' : '3'));
    const resident: HostelResident = {
      id: Date.now().toString(),
      ...newResident,
      roomNumber: room?.roomNumber || '',
      joinDate: new Date().toISOString().split('T')[0],
      monthlyFee: (room?.monthlyRent || 0) + (mealPlan?.monthlyPrice || 0),
      status: 'active'
    };
    setResidents([resident, ...residents]);
    if (room) {
      setRooms(rooms.map((r) => r.id === room.id ? { ...r, occupied: r.occupied + 1, status: r.occupied + 1 >= r.capacity ? 'full' : 'available' } : r));
    }
    setNewResident({ studentId: '', studentName: '', studentNameBn: '', class: '', roomId: '', bedNumber: '', guardianName: '', guardianPhone: '', mealPlan: 'full' });
    setIsAddResidentOpen(false);
    toast({ title: 'সফল', description: 'আবাসিক যোগ করা হয়েছে' });
  };

  const handleEditRoom = () => {
    if (!selectedRoom) return;
    setRooms(rooms.map((r) => (r.id === selectedRoom.id ? selectedRoom : r)));
    setIsEditOpen(false);
    toast({ title: 'সফল', description: 'রুম আপডেট করা হয়েছে' });
  };

  const handleDeleteRoom = (id: string) => {
    setRooms(rooms.filter((r) => r.id !== id));
    toast({ title: 'সফল', description: 'রুম মুছে ফেলা হয়েছে' });
  };

  const handleDeleteResident = (id: string) => {
    const resident = residents.find((r) => r.id === id);
    if (resident) {
      setRooms(rooms.map((r) => r.id === resident.roomId ? { ...r, occupied: Math.max(0, r.occupied - 1), status: 'available' } : r));
    }
    setResidents(residents.filter((r) => r.id !== id));
    toast({ title: 'সফল', description: 'আবাসিক সরানো হয়েছে' });
  };

  const getRoomStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      available: 'bg-green-500/10 text-green-500',
      full: 'bg-red-500/10 text-red-500',
      maintenance: 'bg-yellow-500/10 text-yellow-500',
    };
    return colors[status] || colors.available;
  };

  const getRoomTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      single: 'bg-purple-500/10 text-purple-500',
      double: 'bg-blue-500/10 text-blue-500',
      dormitory: 'bg-orange-500/10 text-orange-500',
    };
    return colors[type] || colors.single;
  };

  const totalCapacity = rooms.reduce((sum, r) => sum + r.capacity, 0);
  const totalOccupied = rooms.reduce((sum, r) => sum + r.occupied, 0);
  const totalRevenue = residents.filter((r) => r.status === 'active').reduce((sum, r) => sum + r.monthlyFee, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">হোস্টেল ব্যবস্থাপনা</h1>
            <p className="text-muted-foreground">Room allocation, meal plans & hostel management</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="card-elevated">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Building className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{rooms.length}</p>
                  <p className="text-xs text-muted-foreground">মোট রুম</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="card-elevated">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Bed className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{totalOccupied}/{totalCapacity}</p>
                  <p className="text-xs text-muted-foreground">দখলকৃত/ধারণক্ষমতা</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="card-elevated">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <Users className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{residents.filter((r) => r.status === 'active').length}</p>
                  <p className="text-xs text-muted-foreground">আবাসিক</p>
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
                  <p className="text-2xl font-bold text-foreground">৳{totalRevenue.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">মাসিক আয়</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="rooms" className="space-y-4">
          <TabsList>
            <TabsTrigger value="rooms" className="gap-2">
              <Building className="w-4 h-4" />
              রুম
            </TabsTrigger>
            <TabsTrigger value="residents" className="gap-2">
              <Users className="w-4 h-4" />
              আবাসিক
            </TabsTrigger>
            <TabsTrigger value="meals" className="gap-2">
              <UtensilsCrossed className="w-4 h-4" />
              খাবার
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rooms" className="space-y-4">
            <div className="flex justify-end">
              <Dialog open={isAddRoomOpen} onOpenChange={setIsAddRoomOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    রুম যোগ করুন
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>নতুন রুম যোগ করুন</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>রুম নম্বর</Label>
                        <Input value={newRoom.roomNumber} onChange={(e) => setNewRoom({ ...newRoom, roomNumber: e.target.value })} placeholder="101" />
                      </div>
                      <div className="space-y-2">
                        <Label>তলা</Label>
                        <Select value={newRoom.floor} onValueChange={(v) => setNewRoom({ ...newRoom, floor: v })}>
                          <SelectTrigger><SelectValue placeholder="তলা" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Ground">গ্রাউন্ড</SelectItem>
                            <SelectItem value="1st">১ম</SelectItem>
                            <SelectItem value="2nd">২য়</SelectItem>
                            <SelectItem value="3rd">৩য়</SelectItem>
                            <SelectItem value="4th">৪র্থ</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>রুমের ধরন</Label>
                        <Select value={newRoom.type} onValueChange={(v) => setNewRoom({ ...newRoom, type: v as Room['type'] })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="single">সিঙ্গেল</SelectItem>
                            <SelectItem value="double">ডাবল</SelectItem>
                            <SelectItem value="dormitory">ডরমিটরি</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>ধারণক্ষমতা</Label>
                        <Input type="number" value={newRoom.capacity} onChange={(e) => setNewRoom({ ...newRoom, capacity: Number(e.target.value) })} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>মাসিক ভাড়া (টাকা)</Label>
                      <Input type="number" value={newRoom.monthlyRent} onChange={(e) => setNewRoom({ ...newRoom, monthlyRent: Number(e.target.value) })} />
                    </div>
                    <div className="space-y-2">
                      <Label>সুবিধা</Label>
                      <Textarea value={newRoom.amenities} onChange={(e) => setNewRoom({ ...newRoom, amenities: e.target.value })} placeholder="AC, Attached Bathroom, etc." rows={2} />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild><Button variant="outline">বাতিল</Button></DialogClose>
                    <Button onClick={handleAddRoom}>যোগ করুন</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {rooms.map((room) => (
                <Card key={room.id} className="card-elevated">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Building className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">রুম {room.roomNumber}</h3>
                          <p className="text-sm text-muted-foreground">{room.floor} তলা</p>
                        </div>
                      </div>
                      <Badge className={getRoomStatusColor(room.status)}>
                        {room.status === 'available' ? 'খালি আছে' : room.status === 'full' ? 'পূর্ণ' : 'মেরামত'}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">ধরন:</span>
                        <Badge className={getRoomTypeColor(room.type)}>{room.type === 'single' ? 'সিঙ্গেল' : room.type === 'double' ? 'ডাবল' : 'ডরমিটরি'}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">দখল:</span>
                        <span>{room.occupied}/{room.capacity} জন</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">ভাড়া:</span>
                        <span className="font-semibold text-primary">৳{room.monthlyRent.toLocaleString()}/মাস</span>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 mt-3">
                      <div className={`h-2 rounded-full ${room.occupied === room.capacity ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${(room.occupied / room.capacity) * 100}%` }}></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">{room.amenities}</p>
                    <div className="flex justify-end gap-1 mt-3">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelectedRoom(room); setIsEditOpen(true); }}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteRoom(room.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="residents" className="space-y-4">
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
                    <SelectItem value="all">সব</SelectItem>
                    <SelectItem value="active">সক্রিয়</SelectItem>
                    <SelectItem value="inactive">নিষ্ক্রিয়</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Dialog open={isAddResidentOpen} onOpenChange={setIsAddResidentOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    আবাসিক যোগ করুন
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>নতুন আবাসিক যোগ করুন</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>স্টুডেন্ট আইডি</Label>
                        <Input value={newResident.studentId} onChange={(e) => setNewResident({ ...newResident, studentId: e.target.value })} placeholder="STD-XXX" />
                      </div>
                      <div className="space-y-2">
                        <Label>শ্রেণি</Label>
                        <Select value={newResident.class} onValueChange={(v) => setNewResident({ ...newResident, class: v })}>
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
                        <Input value={newResident.studentName} onChange={(e) => setNewResident({ ...newResident, studentName: e.target.value })} placeholder="Name" />
                      </div>
                      <div className="space-y-2">
                        <Label>নাম (বাংলা)</Label>
                        <Input value={newResident.studentNameBn} onChange={(e) => setNewResident({ ...newResident, studentNameBn: e.target.value })} placeholder="নাম" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>রুম নির্বাচন</Label>
                        <Select value={newResident.roomId} onValueChange={(v) => setNewResident({ ...newResident, roomId: v })}>
                          <SelectTrigger><SelectValue placeholder="রুম" /></SelectTrigger>
                          <SelectContent>
                            {rooms.filter((r) => r.status === 'available').map((r) => (
                              <SelectItem key={r.id} value={r.id}>রুম {r.roomNumber} ({r.occupied}/{r.capacity})</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>বেড নম্বর</Label>
                        <Input value={newResident.bedNumber} onChange={(e) => setNewResident({ ...newResident, bedNumber: e.target.value })} placeholder="A, B, C..." />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>অভিভাবকের নাম</Label>
                        <Input value={newResident.guardianName} onChange={(e) => setNewResident({ ...newResident, guardianName: e.target.value })} placeholder="অভিভাবকের নাম" />
                      </div>
                      <div className="space-y-2">
                        <Label>অভিভাবকের ফোন</Label>
                        <Input value={newResident.guardianPhone} onChange={(e) => setNewResident({ ...newResident, guardianPhone: e.target.value })} placeholder="01XXXXXXXXX" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>খাবার পরিকল্পনা</Label>
                      <Select value={newResident.mealPlan} onValueChange={(v) => setNewResident({ ...newResident, mealPlan: v as HostelResident['mealPlan'] })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full">পূর্ণ খাবার (৳3,500)</SelectItem>
                          <SelectItem value="partial">আংশিক খাবার (৳2,500)</SelectItem>
                          <SelectItem value="none">কোন খাবার নেই</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild><Button variant="outline">বাতিল</Button></DialogClose>
                    <Button onClick={handleAddResident}>যোগ করুন</Button>
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
                        <th className="text-left p-4 font-medium text-muted-foreground">আবাসিক</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">রুম</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">খাবার</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">অভিভাবক</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">মাসিক ফি</th>
                        <th className="text-right p-4 font-medium text-muted-foreground">অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredResidents.map((resident) => (
                        <tr key={resident.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium text-foreground">{resident.studentNameBn}</p>
                                <p className="text-sm text-muted-foreground">{resident.studentId} | {resident.class}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge variant="outline">রুম {resident.roomNumber} ({resident.bedNumber})</Badge>
                          </td>
                          <td className="p-4">
                            <Badge className={resident.mealPlan === 'full' ? 'bg-green-500/10 text-green-500' : resident.mealPlan === 'partial' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-gray-500/10 text-gray-500'}>
                              {resident.mealPlan === 'full' ? 'পূর্ণ' : resident.mealPlan === 'partial' ? 'আংশিক' : 'নেই'}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="w-4 h-4 text-muted-foreground" />
                              <span>{resident.guardianPhone}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="font-semibold text-primary">৳{resident.monthlyFee.toLocaleString()}</span>
                          </td>
                          <td className="p-4">
                            <div className="flex justify-end gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelectedResident(resident); setIsViewOpen(true); }}>
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteResident(resident.id)}>
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

          <TabsContent value="meals" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              {mealPlans.map((plan) => (
                <Card key={plan.id} className="card-elevated">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center">
                        <UtensilsCrossed className="w-6 h-6 text-orange-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{plan.nameBn}</h3>
                        <p className="text-sm text-muted-foreground">{plan.name}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{plan.description}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">দৈনিক খাবার:</span>
                        <span>{plan.mealsPerDay} বেলা</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">মাসিক মূল্য:</span>
                        <span className="font-semibold text-primary">৳{plan.monthlyPrice.toLocaleString()}</span>
                      </div>
                    </div>
                    <Badge className={plan.status === 'active' ? 'bg-green-500/10 text-green-500 mt-3' : 'bg-gray-500/10 text-gray-500 mt-3'}>
                      {plan.status === 'active' ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* View Resident Dialog */}
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedResident?.studentNameBn}</DialogTitle>
            </DialogHeader>
            {selectedResident && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><Label className="text-muted-foreground">আইডি</Label><p>{selectedResident.studentId}</p></div>
                  <div><Label className="text-muted-foreground">শ্রেণি</Label><p>{selectedResident.class}</p></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label className="text-muted-foreground">রুম</Label><p>{selectedResident.roomNumber} ({selectedResident.bedNumber})</p></div>
                  <div><Label className="text-muted-foreground">যোগদান</Label><p>{selectedResident.joinDate}</p></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label className="text-muted-foreground">অভিভাবক</Label><p>{selectedResident.guardianName}</p></div>
                  <div><Label className="text-muted-foreground">ফোন</Label><p>{selectedResident.guardianPhone}</p></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label className="text-muted-foreground">খাবার পরিকল্পনা</Label><p>{selectedResident.mealPlan === 'full' ? 'পূর্ণ খাবার' : selectedResident.mealPlan === 'partial' ? 'আংশিক খাবার' : 'কোন খাবার নেই'}</p></div>
                  <div><Label className="text-muted-foreground">মাসিক ফি</Label><p className="text-xl font-bold text-primary">৳{selectedResident.monthlyFee.toLocaleString()}</p></div>
                </div>
              </div>
            )}
            <DialogFooter>
              <DialogClose asChild><Button variant="outline">বন্ধ করুন</Button></DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Room Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>রুম সম্পাদনা</DialogTitle>
            </DialogHeader>
            {selectedRoom && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>মাসিক ভাড়া</Label>
                    <Input type="number" value={selectedRoom.monthlyRent} onChange={(e) => setSelectedRoom({ ...selectedRoom, monthlyRent: Number(e.target.value) })} />
                  </div>
                  <div className="space-y-2">
                    <Label>স্ট্যাটাস</Label>
                    <Select value={selectedRoom.status} onValueChange={(v) => setSelectedRoom({ ...selectedRoom, status: v as Room['status'] })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">খালি আছে</SelectItem>
                        <SelectItem value="full">পূর্ণ</SelectItem>
                        <SelectItem value="maintenance">মেরামত</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>সুবিধা</Label>
                  <Textarea value={selectedRoom.amenities} onChange={(e) => setSelectedRoom({ ...selectedRoom, amenities: e.target.value })} rows={2} />
                </div>
              </div>
            )}
            <DialogFooter>
              <DialogClose asChild><Button variant="outline">বাতিল</Button></DialogClose>
              <Button onClick={handleEditRoom}>আপডেট করুন</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Hostel;
