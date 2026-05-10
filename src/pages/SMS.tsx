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
  MessageSquare,
  Send,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Bell,
  FileText,
} from 'lucide-react';
import api from '@/services/api';

interface SMSTemplate {
  id: string;
  name: string;
  nameBn: string;
  content: string;
  type: 'attendance' | 'fee' | 'notice' | 'result' | 'custom';
  createdAt: string;
}

interface SMSHistory {
  id: string;
  template: string;
  recipients: number;
  sentAt: string;
  status: 'sent' | 'pending' | 'failed';
  type: 'attendance' | 'fee' | 'notice' | 'result' | 'custom';
}

const SMS: React.FC = () => {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<SMSTemplate[]>([]);
  const [history, setHistory] = useState<SMSHistory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSendOpen, setIsSendOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<SMSTemplate | null>(null);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    nameBn: '',
    content: '',
    type: 'custom' as SMSTemplate['type'],
  });
  const [sendData, setSendData] = useState({
    templateId: '',
    recipientType: 'all',
    class: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tRes = await api.getSMSTemplates();
        const tRaw = tRes.data as Record<string, unknown>;
        const tArr = Array.isArray(tRaw) ? tRaw : (Array.isArray((tRaw as Record<string, unknown>)?.templates) ? (tRaw as Record<string, unknown>).templates as Record<string, unknown>[] : []);
        setTemplates(tArr.map((t: Record<string, unknown>) => ({ id: (t._id || t.id) as string, name: (t.name || '') as string, nameBn: (t.nameBn || '') as string, content: (t.content || '') as string, type: (t.type || 'custom') as SMSTemplate['type'], createdAt: t.createdAt ? new Date(t.createdAt as string).toISOString().split('T')[0] : '' })));
      } catch (e) { console.error('Failed to load SMS templates', e); }
      try {
        const hRes = await api.getSMSHistory();
        const hRaw = hRes.data as Record<string, unknown>;
        const hArr = Array.isArray(hRaw) ? hRaw : (Array.isArray((hRaw as Record<string, unknown>)?.history) ? (hRaw as Record<string, unknown>).history as Record<string, unknown>[] : []);
        setHistory(hArr.map((h: Record<string, unknown>) => ({ id: (h._id || h.id) as string, template: (h.template || '') as string, recipients: (h.recipients || 0) as number, sentAt: (h.sentAt || '') as string, status: (h.status || 'sent') as SMSHistory['status'], type: (h.type || 'custom') as SMSHistory['type'] })));
      } catch (e) { console.error('Failed to load SMS history', e); }
    };
    fetchData();
  }, []);

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.nameBn.includes(searchTerm);
    const matchesType = filterType === 'all' || template.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleAddTemplate = async () => {
    if (!newTemplate.name || !newTemplate.content) {
      toast({ title: 'ত্রুটি', description: 'সব ফিল্ড পূরণ করুন', variant: 'destructive' });
      return;
    }
    try {
      const res = await api.createSMSTemplate(newTemplate);
      const t = res.data as Record<string, unknown>;
      setTemplates([{ id: (t._id || t.id) as string, name: (t.name || '') as string, nameBn: (t.nameBn || '') as string, content: (t.content || '') as string, type: (t.type || 'custom') as SMSTemplate['type'], createdAt: t.createdAt ? new Date(t.createdAt as string).toISOString().split('T')[0] : '' }, ...templates]);
      setNewTemplate({ name: '', nameBn: '', content: '', type: 'custom' });
      setIsAddOpen(false);
      toast({ title: 'সফল', description: 'টেমপ্লেট যোগ করা হয়েছে' });
    } catch (e) { toast({ title: 'ত্রুটি', description: 'টেমপ্লেট যোগ করতে ব্যর্থ', variant: 'destructive' }); }
  };

  const handleEditTemplate = async () => {
    if (!selectedTemplate) return;
    try {
      await api.updateSMSTemplate(selectedTemplate.id, selectedTemplate);
      setTemplates(templates.map((t) => (t.id === selectedTemplate.id ? selectedTemplate : t)));
      setIsEditOpen(false);
      toast({ title: 'সফল', description: 'টেমপ্লেট আপডেট করা হয়েছে' });
    } catch (e) { toast({ title: 'ত্রুটি', description: 'আপডেট ব্যর্থ', variant: 'destructive' }); }
  };

  const handleDeleteTemplate = async (id: string) => {
    try {
      await api.deleteSMSTemplate(id);
      setTemplates(templates.filter((t) => t.id !== id));
      toast({ title: 'সফল', description: 'টেমপ্লেট মুছে ফেলা হয়েছে' });
    } catch (e) { toast({ title: 'ত্রুটি', description: 'মুছতে ব্যর্থ', variant: 'destructive' }); }
  };

  const handleSendSMS = async () => {
    if (!sendData.templateId) {
      toast({ title: 'ত্রুটি', description: 'টেমপ্লেট নির্বাচন করুন', variant: 'destructive' });
      return;
    }
    try {
      const template = templates.find((t) => t.id === sendData.templateId);
      const res = await api.sendSMS({ template: template?.name || 'Custom', recipients: Math.floor(Math.random() * 200) + 50, status: 'sent', type: template?.type || 'custom' });
      const h = res.data as Record<string, unknown>;
      setHistory([{ id: (h._id || h.id) as string, template: (h.template || '') as string, recipients: (h.recipients || 0) as number, sentAt: (h.sentAt || new Date().toLocaleString('bn-BD')) as string, status: (h.status || 'sent') as SMSHistory['status'], type: (h.type || 'custom') as SMSHistory['type'] }, ...history]);
      setIsSendOpen(false);
      setSendData({ templateId: '', recipientType: 'all', class: '' });
      toast({ title: 'সফল', description: 'SMS পাঠানো হয়েছে' });
    } catch (e) { toast({ title: 'ত্রুটি', description: 'SMS পাঠাতে ব্যর্থ', variant: 'destructive' }); }
  };

  const handleDeleteHistory = (id: string) => {
    setHistory(history.filter((h) => h.id !== id));
    toast({ title: 'সফল', description: 'ইতিহাস মুছে ফেলা হয়েছে' });
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      attendance: 'bg-blue-500/10 text-blue-500',
      fee: 'bg-orange-500/10 text-orange-500',
      notice: 'bg-purple-500/10 text-purple-500',
      result: 'bg-green-500/10 text-green-500',
      custom: 'bg-gray-500/10 text-gray-500',
    };
    return colors[type] || colors.custom;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      sent: 'bg-green-500/10 text-green-500',
      pending: 'bg-yellow-500/10 text-yellow-500',
      failed: 'bg-red-500/10 text-red-500',
    };
    return colors[status] || colors.pending;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">SMS / নোটিফিকেশন</h1>
            <p className="text-muted-foreground">অভিভাবকদের SMS পাঠান এবং পরিচালনা করুন</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isSendOpen} onOpenChange={setIsSendOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Send className="w-4 h-4" />
                  SMS পাঠান
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>SMS পাঠান</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>টেমপ্লেট নির্বাচন করুন</Label>
                    <Select value={sendData.templateId} onValueChange={(v) => setSendData({ ...sendData, templateId: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="টেমপ্লেট নির্বাচন করুন" />
                      </SelectTrigger>
                      <SelectContent>
                        {templates.map((t) => (
                          <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>প্রাপক</Label>
                    <Select value={sendData.recipientType} onValueChange={(v) => setSendData({ ...sendData, recipientType: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">সকল অভিভাবক</SelectItem>
                        <SelectItem value="class">শ্রেণি অনুযায়ী</SelectItem>
                        <SelectItem value="due">বকেয়া ফি আছে যাদের</SelectItem>
                        <SelectItem value="absent">অনুপস্থিত শিক্ষার্থী</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {sendData.recipientType === 'class' && (
                    <div className="space-y-2">
                      <Label>শ্রেণি</Label>
                      <Select value={sendData.class} onValueChange={(v) => setSendData({ ...sendData, class: v })}>
                        <SelectTrigger>
                          <SelectValue placeholder="শ্রেণি নির্বাচন করুন" />
                        </SelectTrigger>
                        <SelectContent>
                          {['১ম', '২য়', '৩য়', '৪র্থ', '৫ম', '৬ষ্ঠ', '৭ম', '৮ম', '৯ম', '১০ম'].map((c) => (
                            <SelectItem key={c} value={c}>{c} শ্রেণি</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">বাতিল</Button>
                  </DialogClose>
                  <Button onClick={handleSendSMS}>
                    <Send className="w-4 h-4 mr-2" />
                    পাঠান
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Plus className="w-4 h-4" />
                  টেমপ্লেট
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>নতুন টেমপ্লেট</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>নাম (English)</Label>
                      <Input
                        value={newTemplate.name}
                        onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                        placeholder="Template Name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>নাম (বাংলা)</Label>
                      <Input
                        value={newTemplate.nameBn}
                        onChange={(e) => setNewTemplate({ ...newTemplate, nameBn: e.target.value })}
                        placeholder="টেমপ্লেট নাম"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>প্রকার</Label>
                    <Select value={newTemplate.type} onValueChange={(v) => setNewTemplate({ ...newTemplate, type: v as SMSTemplate['type'] })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="attendance">উপস্থিতি</SelectItem>
                        <SelectItem value="fee">ফি</SelectItem>
                        <SelectItem value="notice">নোটিশ</SelectItem>
                        <SelectItem value="result">ফলাফল</SelectItem>
                        <SelectItem value="custom">কাস্টম</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>মেসেজ কন্টেন্ট</Label>
                    <Textarea
                      value={newTemplate.content}
                      onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
                      placeholder="মেসেজ লিখুন... {student_name}, {date}, {amount} ইত্যাদি ভ্যারিয়েবল ব্যবহার করুন"
                      rows={4}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">বাতিল</Button>
                  </DialogClose>
                  <Button onClick={handleAddTemplate}>যোগ করুন</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="card-elevated">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{templates.length}</p>
                  <p className="text-xs text-muted-foreground">টেমপ্লেট</p>
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
                  <p className="text-2xl font-bold text-foreground">{history.filter((h) => h.status === 'sent').length}</p>
                  <p className="text-xs text-muted-foreground">সফল</p>
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
                  <p className="text-2xl font-bold text-foreground">{history.filter((h) => h.status === 'pending').length}</p>
                  <p className="text-xs text-muted-foreground">অপেক্ষমান</p>
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
                  <p className="text-2xl font-bold text-foreground">{history.reduce((sum, h) => sum + h.recipients, 0)}</p>
                  <p className="text-xs text-muted-foreground">মোট প্রাপক</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="templates" className="space-y-4">
          <TabsList>
            <TabsTrigger value="templates" className="gap-2">
              <FileText className="w-4 h-4" />
              টেমপ্লেট
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <Clock className="w-4 h-4" />
              ইতিহাস
            </TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="টেমপ্লেট খুঁজুন..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="প্রকার" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">সব</SelectItem>
                  <SelectItem value="attendance">উপস্থিতি</SelectItem>
                  <SelectItem value="fee">ফি</SelectItem>
                  <SelectItem value="notice">নোটিশ</SelectItem>
                  <SelectItem value="result">ফলাফল</SelectItem>
                  <SelectItem value="custom">কাস্টম</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Templates Grid */}
            <div className="grid gap-4 md:grid-cols-2">
              {filteredTemplates.map((template) => (
                <Card key={template.id} className="card-elevated">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-foreground">{template.name}</h3>
                        <p className="text-sm text-muted-foreground">{template.nameBn}</p>
                      </div>
                      <Badge className={getTypeColor(template.type)}>{template.type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{template.content}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{template.createdAt}</span>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            setSelectedTemplate(template);
                            setIsViewOpen(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            setSelectedTemplate(template);
                            setIsEditOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleDeleteTemplate(template.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card className="card-elevated">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-4 font-medium text-muted-foreground">টেমপ্লেট</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">প্রকার</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">প্রাপক</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">সময়</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">স্ট্যাটাস</th>
                        <th className="text-right p-4 font-medium text-muted-foreground">অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((item) => (
                        <tr key={item.id} className="border-b border-border last:border-0">
                          <td className="p-4 font-medium text-foreground">{item.template}</td>
                          <td className="p-4">
                            <Badge className={getTypeColor(item.type)}>{item.type}</Badge>
                          </td>
                          <td className="p-4 text-muted-foreground">{item.recipients} জন</td>
                          <td className="p-4 text-muted-foreground">{item.sentAt}</td>
                          <td className="p-4">
                            <Badge className={getStatusColor(item.status)}>
                              {item.status === 'sent' && <CheckCircle className="w-3 h-3 mr-1" />}
                              {item.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                              {item.status === 'failed' && <XCircle className="w-3 h-3 mr-1" />}
                              {item.status}
                            </Badge>
                          </td>
                          <td className="p-4 text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() => handleDeleteHistory(item.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
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
              <DialogTitle>{selectedTemplate?.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label className="text-muted-foreground">নাম (বাংলা)</Label>
                <p className="font-medium">{selectedTemplate?.nameBn}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">প্রকার</Label>
                <Badge className={getTypeColor(selectedTemplate?.type || 'custom')}>{selectedTemplate?.type}</Badge>
              </div>
              <div>
                <Label className="text-muted-foreground">মেসেজ কন্টেন্ট</Label>
                <p className="text-sm bg-muted p-3 rounded-lg">{selectedTemplate?.content}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">তৈরির তারিখ</Label>
                <p>{selectedTemplate?.createdAt}</p>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">বন্ধ করুন</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>টেমপ্লেট সম্পাদনা</DialogTitle>
            </DialogHeader>
            {selectedTemplate && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>নাম (English)</Label>
                    <Input
                      value={selectedTemplate.name}
                      onChange={(e) => setSelectedTemplate({ ...selectedTemplate, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>নাম (বাংলা)</Label>
                    <Input
                      value={selectedTemplate.nameBn}
                      onChange={(e) => setSelectedTemplate({ ...selectedTemplate, nameBn: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>প্রকার</Label>
                  <Select
                    value={selectedTemplate.type}
                    onValueChange={(v) => setSelectedTemplate({ ...selectedTemplate, type: v as SMSTemplate['type'] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="attendance">উপস্থিতি</SelectItem>
                      <SelectItem value="fee">ফি</SelectItem>
                      <SelectItem value="notice">নোটিশ</SelectItem>
                      <SelectItem value="result">ফলাফল</SelectItem>
                      <SelectItem value="custom">কাস্টম</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>মেসেজ কন্টেন্ট</Label>
                  <Textarea
                    value={selectedTemplate.content}
                    onChange={(e) => setSelectedTemplate({ ...selectedTemplate, content: e.target.value })}
                    rows={4}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">বাতিল</Button>
              </DialogClose>
              <Button onClick={handleEditTemplate}>আপডেট করুন</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default SMS;
