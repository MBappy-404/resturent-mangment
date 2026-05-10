import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
  Bus,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  MapPin,
  User,
  Phone,
  Route,
  Users,
  Clock,
  CheckCircle,
} from 'lucide-react';
import api from '@/services/api';

interface Vehicle {
  id: string;
  number: string;
  type: 'bus' | 'microbus' | 'van';
  capacity: number;
  driver: string;
  driverPhone: string;
  helper: string;
  route: string;
  status: 'active' | 'maintenance' | 'inactive';
}

interface BusRoute {
  id: string;
  name: string;
  nameBn: string;
  stops: string[];
  vehicleId: string;
  departureTime: string;
  returnTime: string;
  students: number;
  fee: number;
}

interface Driver {
  id: string;
  name: string;
  nameBn: string;
  phone: string;
  license: string;
  address: string;
  experience: number;
  status: 'active' | 'inactive';
}

const Transport: React.FC = () => {
  const { toast } = useToast();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [routes, setRoutes] = useState<BusRoute[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [isAddRouteOpen, setIsAddRouteOpen] = useState(false);
  const [isAddDriverOpen, setIsAddDriverOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [editType, setEditType] = useState<'vehicle' | 'route' | 'driver'>('vehicle');
  const [newVehicle, setNewVehicle] = useState({ number: '', type: 'bus' as Vehicle['type'], capacity: 40, driver: '', driverPhone: '', helper: '', route: '', status: 'active' as Vehicle['status'] });
  const [newRoute, setNewRoute] = useState({ name: '', nameBn: '', stops: '', vehicleId: '', departureTime: '', returnTime: '', fee: 0 });
  const [newDriver, setNewDriver] = useState({ name: '', nameBn: '', phone: '', license: '', address: '', experience: 0, status: 'active' as Driver['status'] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const vRes = await api.getVehicles();
        const vRaw = vRes.data as Record<string, unknown>;
        const vArr = Array.isArray(vRaw) ? vRaw : (Array.isArray((vRaw as Record<string, unknown>)?.vehicles) ? (vRaw as Record<string, unknown>).vehicles as Record<string, unknown>[] : []);
        setVehicles(vArr.map((v: Record<string, unknown>) => ({ id: (v._id || v.id) as string, number: (v.number || '') as string, type: (v.type || 'bus') as Vehicle['type'], capacity: (v.capacity || 0) as number, driver: (v.driver || '') as string, driverPhone: (v.driverPhone || '') as string, helper: (v.helper || '') as string, route: (v.route || '') as string, status: (v.status || 'active') as Vehicle['status'] })));
      } catch (e) { console.error('Failed to load vehicles', e); }
      try {
        const rRes = await api.getBusRoutes();
        const rRaw = rRes.data as Record<string, unknown>;
        const rArr = Array.isArray(rRaw) ? rRaw : (Array.isArray((rRaw as Record<string, unknown>)?.routes) ? (rRaw as Record<string, unknown>).routes as Record<string, unknown>[] : []);
        setRoutes(rArr.map((r: Record<string, unknown>) => ({ id: (r._id || r.id) as string, name: (r.name || '') as string, nameBn: (r.nameBn || '') as string, stops: (r.stops || []) as string[], vehicleId: (r.vehicleId || '') as string, departureTime: (r.departureTime || '') as string, returnTime: (r.returnTime || '') as string, students: (r.students || 0) as number, fee: (r.fee || 0) as number })));
      } catch (e) { console.error('Failed to load routes', e); }
      try {
        const dRes = await api.getDrivers();
        const dRaw = dRes.data as Record<string, unknown>;
        const dArr = Array.isArray(dRaw) ? dRaw : (Array.isArray((dRaw as Record<string, unknown>)?.drivers) ? (dRaw as Record<string, unknown>).drivers as Record<string, unknown>[] : []);
        setDrivers(dArr.map((d: Record<string, unknown>) => ({ id: (d._id || d.id) as string, name: (d.name || '') as string, nameBn: (d.nameBn || '') as string, phone: (d.phone || '') as string, license: (d.license || '') as string, address: (d.address || '') as string, experience: (d.experience || 0) as number, status: (d.status || 'active') as Driver['status'] })));
      } catch (e) { console.error('Failed to load drivers', e); }
    };
    fetchData();
  }, []);

  const handleAddVehicle = async () => {
    if (!newVehicle.number || !newVehicle.driver) {
      toast({ title: 'ত্রুটি', description: 'সব ফিল্ড পূরণ করুন', variant: 'destructive' });
      return;
    }
    try {
      const res = await api.createVehicle(newVehicle);
      const v = res.data as Record<string, unknown>;
      setVehicles([{ id: (v._id || v.id) as string, number: (v.number || '') as string, type: (v.type || 'bus') as Vehicle['type'], capacity: (v.capacity || 0) as number, driver: (v.driver || '') as string, driverPhone: (v.driverPhone || '') as string, helper: (v.helper || '') as string, route: (v.route || '') as string, status: (v.status || 'active') as Vehicle['status'] }, ...vehicles]);
      setNewVehicle({ number: '', type: 'bus', capacity: 40, driver: '', driverPhone: '', helper: '', route: '', status: 'active' });
      setIsAddVehicleOpen(false);
      toast({ title: 'সফল', description: 'যানবাহন যোগ করা হয়েছে' });
    } catch (e) { toast({ title: 'ত্রুটি', description: 'যোগ করতে ব্যর্থ', variant: 'destructive' }); }
  };

  const handleAddRoute = async () => {
    if (!newRoute.name || !newRoute.nameBn) {
      toast({ title: 'ত্রুটি', description: 'সব ফিল্ড পূরণ করুন', variant: 'destructive' });
      return;
    }
    try {
      const routeData = { ...newRoute, stops: newRoute.stops.split(',').map((s) => s.trim()), students: 0 };
      const res = await api.createBusRoute(routeData);
      const r = res.data as Record<string, unknown>;
      setRoutes([{ id: (r._id || r.id) as string, name: (r.name || '') as string, nameBn: (r.nameBn || '') as string, stops: (r.stops || []) as string[], vehicleId: (r.vehicleId || '') as string, departureTime: (r.departureTime || '') as string, returnTime: (r.returnTime || '') as string, students: (r.students || 0) as number, fee: (r.fee || 0) as number }, ...routes]);
      setNewRoute({ name: '', nameBn: '', stops: '', vehicleId: '', departureTime: '', returnTime: '', fee: 0 });
      setIsAddRouteOpen(false);
      toast({ title: 'সফল', description: 'রুট যোগ করা হয়েছে' });
    } catch (e) { toast({ title: 'ত্রুটি', description: 'যোগ করতে ব্যর্থ', variant: 'destructive' }); }
  };

  const handleAddDriver = async () => {
    if (!newDriver.name || !newDriver.phone) {
      toast({ title: 'ত্রুটি', description: 'সব ফিল্ড পূরণ করুন', variant: 'destructive' });
      return;
    }
    try {
      const res = await api.createDriver(newDriver);
      const d = res.data as Record<string, unknown>;
      setDrivers([{ id: (d._id || d.id) as string, name: (d.name || '') as string, nameBn: (d.nameBn || '') as string, phone: (d.phone || '') as string, license: (d.license || '') as string, address: (d.address || '') as string, experience: (d.experience || 0) as number, status: (d.status || 'active') as Driver['status'] }, ...drivers]);
      setNewDriver({ name: '', nameBn: '', phone: '', license: '', address: '', experience: 0, status: 'active' });
      setIsAddDriverOpen(false);
      toast({ title: 'সফল', description: 'ড্রাইভার যোগ করা হয়েছে' });
    } catch (e) { toast({ title: 'ত্রুটি', description: 'যোগ করতে ব্যর্থ', variant: 'destructive' }); }
  };

  const handleEdit = async () => {
    try {
      if (editType === 'vehicle') {
        await api.updateVehicle(selectedItem.id, selectedItem);
        setVehicles(vehicles.map((v) => (v.id === selectedItem.id ? selectedItem : v)));
      } else if (editType === 'route') {
        await api.updateBusRoute(selectedItem.id, selectedItem);
        setRoutes(routes.map((r) => (r.id === selectedItem.id ? selectedItem : r)));
      } else {
        await api.updateDriver(selectedItem.id, selectedItem);
        setDrivers(drivers.map((d) => (d.id === selectedItem.id ? selectedItem : d)));
      }
      setIsEditOpen(false);
      toast({ title: 'সফল', description: 'আপডেট করা হয়েছে' });
    } catch (e) { toast({ title: 'ত্রুটি', description: 'আপডেট ব্যর্থ', variant: 'destructive' }); }
  };

  const handleDelete = async (type: 'vehicle' | 'route' | 'driver', id: string) => {
    try {
      if (type === 'vehicle') { await api.deleteVehicle(id); setVehicles(vehicles.filter((v) => v.id !== id)); }
      else if (type === 'route') { await api.deleteBusRoute(id); setRoutes(routes.filter((r) => r.id !== id)); }
      else { await api.deleteDriver(id); setDrivers(drivers.filter((d) => d.id !== id)); }
      toast({ title: 'সফল', description: 'মুছে ফেলা হয়েছে' });
    } catch (e) { toast({ title: 'ত্রুটি', description: 'মুছতে ব্যর্থ', variant: 'destructive' }); }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-500/10 text-green-500',
      maintenance: 'bg-yellow-500/10 text-yellow-500',
      inactive: 'bg-red-500/10 text-red-500',
    };
    return colors[status] || colors.inactive;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      bus: 'bg-blue-500/10 text-blue-500',
      microbus: 'bg-purple-500/10 text-purple-500',
      van: 'bg-orange-500/10 text-orange-500',
    };
    return colors[type] || colors.bus;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">পরিবহন ব্যবস্থাপনা</h1>
            <p className="text-muted-foreground">যানবাহন, রুট এবং ড্রাইভার পরিচালনা করুন</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="card-elevated">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Bus className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{vehicles.length}</p>
                  <p className="text-xs text-muted-foreground">যানবাহন</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="card-elevated">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary/10">
                  <Route className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{routes.length}</p>
                  <p className="text-xs text-muted-foreground">রুট</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="card-elevated">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/10">
                  <User className="w-5 h-5 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{drivers.length}</p>
                  <p className="text-xs text-muted-foreground">ড্রাইভার</p>
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
                  <p className="text-2xl font-bold text-foreground">{routes.reduce((sum, r) => sum + r.students, 0)}</p>
                  <p className="text-xs text-muted-foreground">শিক্ষার্থী</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="vehicles" className="space-y-4">
          <TabsList>
            <TabsTrigger value="vehicles" className="gap-2">
              <Bus className="w-4 h-4" />
              যানবাহন
            </TabsTrigger>
            <TabsTrigger value="routes" className="gap-2">
              <Route className="w-4 h-4" />
              রুট
            </TabsTrigger>
            <TabsTrigger value="drivers" className="gap-2">
              <User className="w-4 h-4" />
              ড্রাইভার
            </TabsTrigger>
          </TabsList>

          {/* Vehicles Tab */}
          <TabsContent value="vehicles" className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="যানবাহন খুঁজুন..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
              <Dialog open={isAddVehicleOpen} onOpenChange={setIsAddVehicleOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    যানবাহন যোগ করুন
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>নতুন যানবাহন যোগ করুন</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>যানবাহন নম্বর</Label>
                      <Input value={newVehicle.number} onChange={(e) => setNewVehicle({ ...newVehicle, number: e.target.value })} placeholder="চট্টগ্রাম মেট্রো-ক-১২৩৪" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>প্রকার</Label>
                        <Select value={newVehicle.type} onValueChange={(v) => setNewVehicle({ ...newVehicle, type: v as Vehicle['type'] })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bus">বাস</SelectItem>
                            <SelectItem value="microbus">মাইক্রোবাস</SelectItem>
                            <SelectItem value="van">ভ্যান</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>ধারণক্ষমতা</Label>
                        <Input type="number" value={newVehicle.capacity} onChange={(e) => setNewVehicle({ ...newVehicle, capacity: Number(e.target.value) })} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>ড্রাইভার</Label>
                        <Input value={newVehicle.driver} onChange={(e) => setNewVehicle({ ...newVehicle, driver: e.target.value })} placeholder="ড্রাইভারের নাম" />
                      </div>
                      <div className="space-y-2">
                        <Label>ফোন</Label>
                        <Input value={newVehicle.driverPhone} onChange={(e) => setNewVehicle({ ...newVehicle, driverPhone: e.target.value })} placeholder="01XXXXXXXXX" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>হেল্পার</Label>
                        <Input value={newVehicle.helper} onChange={(e) => setNewVehicle({ ...newVehicle, helper: e.target.value })} placeholder="হেল্পারের নাম" />
                      </div>
                      <div className="space-y-2">
                        <Label>রুট</Label>
                        <Input value={newVehicle.route} onChange={(e) => setNewVehicle({ ...newVehicle, route: e.target.value })} placeholder="রুটের নাম" />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild><Button variant="outline">বাতিল</Button></DialogClose>
                    <Button onClick={handleAddVehicle}>যোগ করুন</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {vehicles.filter((v) => v.number.toLowerCase().includes(searchTerm.toLowerCase()) || v.driver.includes(searchTerm)).map((vehicle) => (
                <Card key={vehicle.id} className="card-elevated">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Bus className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{vehicle.number}</h3>
                          <div className="flex gap-2 mt-1">
                            <Badge className={getTypeColor(vehicle.type)}>{vehicle.type}</Badge>
                            <Badge className={getStatusColor(vehicle.status)}>{vehicle.status}</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>ড্রাইভার: {vehicle.driver}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{vehicle.driverPhone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{vehicle.route}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>ধারণক্ষমতা: {vehicle.capacity} জন</span>
                      </div>
                    </div>
                    <div className="flex justify-end gap-1 mt-4">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelectedItem(vehicle); setIsViewOpen(true); }}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelectedItem(vehicle); setEditType('vehicle'); setIsEditOpen(true); }}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete('vehicle', vehicle.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Routes Tab */}
          <TabsContent value="routes" className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="রুট খুঁজুন..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
              <Dialog open={isAddRouteOpen} onOpenChange={setIsAddRouteOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    রুট যোগ করুন
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>নতুন রুট যোগ করুন</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>নাম (English)</Label>
                        <Input value={newRoute.name} onChange={(e) => setNewRoute({ ...newRoute, name: e.target.value })} placeholder="Route Name" />
                      </div>
                      <div className="space-y-2">
                        <Label>নাম (বাংলা)</Label>
                        <Input value={newRoute.nameBn} onChange={(e) => setNewRoute({ ...newRoute, nameBn: e.target.value })} placeholder="রুটের নাম" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>স্টপ (কমা দিয়ে আলাদা করুন)</Label>
                      <Input value={newRoute.stops} onChange={(e) => setNewRoute({ ...newRoute, stops: e.target.value })} placeholder="স্টপ ১, স্টপ ২, স্টপ ৩" />
                    </div>
                    <div className="space-y-2">
                      <Label>যানবাহন</Label>
                      <Select value={newRoute.vehicleId} onValueChange={(v) => setNewRoute({ ...newRoute, vehicleId: v })}>
                        <SelectTrigger><SelectValue placeholder="যানবাহন নির্বাচন করুন" /></SelectTrigger>
                        <SelectContent>
                          {vehicles.map((v) => (
                            <SelectItem key={v.id} value={v.id}>{v.number}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>রওনা সময়</Label>
                        <Input type="time" value={newRoute.departureTime} onChange={(e) => setNewRoute({ ...newRoute, departureTime: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>ফেরত সময়</Label>
                        <Input type="time" value={newRoute.returnTime} onChange={(e) => setNewRoute({ ...newRoute, returnTime: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>ফি (টাকা)</Label>
                        <Input type="number" value={newRoute.fee} onChange={(e) => setNewRoute({ ...newRoute, fee: Number(e.target.value) })} />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild><Button variant="outline">বাতিল</Button></DialogClose>
                    <Button onClick={handleAddRoute}>যোগ করুন</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {routes.filter((r) => r.name.toLowerCase().includes(searchTerm.toLowerCase()) || r.nameBn.includes(searchTerm)).map((route) => (
                <Card key={route.id} className="card-elevated">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-foreground">{route.nameBn}</h3>
                        <p className="text-sm text-muted-foreground">{route.name}</p>
                      </div>
                      <Badge className="bg-primary/10 text-primary">৳{route.fee}/মাস</Badge>
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{route.stops.join(' → ')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>রওনা: {route.departureTime} | ফেরত: {route.returnTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{route.students} জন শিক্ষার্থী</span>
                      </div>
                    </div>
                    <div className="flex justify-end gap-1 mt-4">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelectedItem(route); setEditType('route'); setIsEditOpen(true); }}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete('route', route.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Drivers Tab */}
          <TabsContent value="drivers" className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="ড্রাইভার খুঁজুন..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
              <Dialog open={isAddDriverOpen} onOpenChange={setIsAddDriverOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    ড্রাইভার যোগ করুন
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>নতুন ড্রাইভার যোগ করুন</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>নাম (English)</Label>
                        <Input value={newDriver.name} onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })} placeholder="Driver Name" />
                      </div>
                      <div className="space-y-2">
                        <Label>নাম (বাংলা)</Label>
                        <Input value={newDriver.nameBn} onChange={(e) => setNewDriver({ ...newDriver, nameBn: e.target.value })} placeholder="ড্রাইভারের নাম" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>ফোন</Label>
                        <Input value={newDriver.phone} onChange={(e) => setNewDriver({ ...newDriver, phone: e.target.value })} placeholder="01XXXXXXXXX" />
                      </div>
                      <div className="space-y-2">
                        <Label>লাইসেন্স নম্বর</Label>
                        <Input value={newDriver.license} onChange={(e) => setNewDriver({ ...newDriver, license: e.target.value })} placeholder="CTG-XXXXX" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>ঠিকানা</Label>
                      <Input value={newDriver.address} onChange={(e) => setNewDriver({ ...newDriver, address: e.target.value })} placeholder="ঠিকানা" />
                    </div>
                    <div className="space-y-2">
                      <Label>অভিজ্ঞতা (বছর)</Label>
                      <Input type="number" value={newDriver.experience} onChange={(e) => setNewDriver({ ...newDriver, experience: Number(e.target.value) })} />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild><Button variant="outline">বাতিল</Button></DialogClose>
                    <Button onClick={handleAddDriver}>যোগ করুন</Button>
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
                        <th className="text-left p-4 font-medium text-muted-foreground">নাম</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">ফোন</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">লাইসেন্স</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">অভিজ্ঞতা</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">স্ট্যাটাস</th>
                        <th className="text-right p-4 font-medium text-muted-foreground">অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody>
                      {drivers.filter((d) => d.name.toLowerCase().includes(searchTerm.toLowerCase()) || d.nameBn.includes(searchTerm)).map((driver) => (
                        <tr key={driver.id} className="border-b border-border last:border-0">
                          <td className="p-4">
                            <div>
                              <p className="font-medium text-foreground">{driver.nameBn}</p>
                              <p className="text-sm text-muted-foreground">{driver.name}</p>
                            </div>
                          </td>
                          <td className="p-4 text-muted-foreground">{driver.phone}</td>
                          <td className="p-4 text-muted-foreground">{driver.license}</td>
                          <td className="p-4 text-muted-foreground">{driver.experience} বছর</td>
                          <td className="p-4">
                            <Badge className={getStatusColor(driver.status)}>{driver.status}</Badge>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelectedItem(driver); setEditType('driver'); setIsEditOpen(true); }}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete('driver', driver.id)}>
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

        {/* View Dialog */}
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>বিস্তারিত</DialogTitle>
            </DialogHeader>
            {selectedItem && (
              <div className="space-y-4 py-4">
                {Object.entries(selectedItem).map(([key, value]) => (
                  key !== 'id' && (
                    <div key={key}>
                      <Label className="text-muted-foreground capitalize">{key}</Label>
                      <p className="font-medium">{String(value)}</p>
                    </div>
                  )
                ))}
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
              <DialogTitle>সম্পাদনা করুন</DialogTitle>
            </DialogHeader>
            {selectedItem && editType === 'vehicle' && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>যানবাহন নম্বর</Label>
                  <Input value={selectedItem.number} onChange={(e) => setSelectedItem({ ...selectedItem, number: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>ড্রাইভার</Label>
                    <Input value={selectedItem.driver} onChange={(e) => setSelectedItem({ ...selectedItem, driver: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>ফোন</Label>
                    <Input value={selectedItem.driverPhone} onChange={(e) => setSelectedItem({ ...selectedItem, driverPhone: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>স্ট্যাটাস</Label>
                  <Select value={selectedItem.status} onValueChange={(v) => setSelectedItem({ ...selectedItem, status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">সক্রিয়</SelectItem>
                      <SelectItem value="maintenance">মেরামত</SelectItem>
                      <SelectItem value="inactive">নিষ্ক্রিয়</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            {selectedItem && editType === 'driver' && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>নাম (English)</Label>
                    <Input value={selectedItem.name} onChange={(e) => setSelectedItem({ ...selectedItem, name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>নাম (বাংলা)</Label>
                    <Input value={selectedItem.nameBn} onChange={(e) => setSelectedItem({ ...selectedItem, nameBn: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>ফোন</Label>
                  <Input value={selectedItem.phone} onChange={(e) => setSelectedItem({ ...selectedItem, phone: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>স্ট্যাটাস</Label>
                  <Select value={selectedItem.status} onValueChange={(v) => setSelectedItem({ ...selectedItem, status: v })}>
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
              <Button onClick={handleEdit}>আপডেট করুন</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Transport;
