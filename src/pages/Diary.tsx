import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Trash2,
  BookMarked,
  Calendar,
  Clock,
  FileText,
  Download
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { classes } from '@/data/demoData';

interface DiaryEntry {
  id: string;
  title: string;
  type: 'homework' | 'classwork' | 'notice' | 'remark';
  class: string;
  section: string;
  subject: string;
  content: string;
  dueDate?: string;
  createdAt: string;
  createdBy: string;
}

const initialEntries: DiaryEntry[] = [
  { id: 'DRY-001', title: 'Math Homework - Chapter 5', type: 'homework', class: 'Class 10', section: 'A', subject: 'Mathematics', content: 'Complete exercises 5.1 to 5.5 from the textbook. Show all working steps.', dueDate: '2024-12-10', createdAt: '2024-12-05', createdBy: 'Mr. Kamal Hossain' },
  { id: 'DRY-002', title: 'Science Project', type: 'classwork', class: 'Class 9', section: 'B', subject: 'Science', content: 'Prepare a model on solar system. Materials will be provided by school.', dueDate: '2024-12-15', createdAt: '2024-12-05', createdBy: 'Dr. Nusrat Jahan' },
  { id: 'DRY-003', title: 'Parent Meeting Notice', type: 'notice', class: 'Class 8', section: 'A', subject: 'General', content: 'Parents are requested to attend the meeting on December 20th at 10:00 AM.', createdAt: '2024-12-04', createdBy: 'Admin Office' },
  { id: 'DRY-004', title: 'English Essay', type: 'homework', class: 'Class 7', section: 'C', subject: 'English', content: 'Write an essay on "My Favorite Festival" (minimum 200 words).', dueDate: '2024-12-08', createdAt: '2024-12-03', createdBy: 'Mrs. Sarah Khan' },
  { id: 'DRY-005', title: 'Behavior Remark', type: 'remark', class: 'Class 6', section: 'A', subject: 'General', content: 'Excellent participation in class activities. Keep up the good work!', createdAt: '2024-12-02', createdBy: 'Class Teacher' },
];

const Diary: React.FC = () => {
  const [entries, setEntries] = useState<DiaryEntry[]>(initialEntries);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedClass, setSelectedClass] = useState('all');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);
  const [formData, setFormData] = useState<Partial<DiaryEntry>>({});

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         entry.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || entry.type === selectedType;
    const matchesClass = selectedClass === 'all' || entry.class === selectedClass;
    return matchesSearch && matchesType && matchesClass;
  });

  const handleAdd = () => {
    const newEntry: DiaryEntry = {
      id: `DRY-${String(entries.length + 1).padStart(3, '0')}`,
      title: formData.title || '',
      type: formData.type || 'homework',
      class: formData.class || 'Class 10',
      section: formData.section || 'A',
      subject: formData.subject || '',
      content: formData.content || '',
      dueDate: formData.dueDate,
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: 'Current User'
    };
    setEntries([newEntry, ...entries]);
    setIsAddOpen(false);
    setFormData({});
    toast.success('Diary entry added successfully');
  };

  const handleEdit = () => {
    if (!selectedEntry) return;
    setEntries(entries.map(e => e.id === selectedEntry.id ? { ...e, ...formData } : e));
    setIsEditOpen(false);
    setSelectedEntry(null);
    setFormData({});
    toast.success('Diary entry updated successfully');
  };

  const handleDelete = () => {
    if (!selectedEntry) return;
    setEntries(entries.filter(e => e.id !== selectedEntry.id));
    setIsDeleteOpen(false);
    setSelectedEntry(null);
    toast.success('Diary entry deleted successfully');
  };

  const typeStyles = {
    homework: { bg: 'bg-primary/10', text: 'text-primary', icon: FileText },
    classwork: { bg: 'bg-secondary/10', text: 'text-secondary', icon: BookMarked },
    notice: { bg: 'bg-warning/10', text: 'text-warning', icon: Calendar },
    remark: { bg: 'bg-success/10', text: 'text-success', icon: Clock },
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="page-header">Digital Diary</h1>
          <p className="page-subtitle">Manage homework, classwork and remarks</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button onClick={() => setIsAddOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            <span>Add Entry</span>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Entries</p>
              <p className="text-2xl font-bold text-foreground">{entries.length}</p>
            </div>
            <div className="p-3 rounded-xl bg-primary/10">
              <BookMarked className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Homework</p>
              <p className="text-2xl font-bold text-primary">{entries.filter(e => e.type === 'homework').length}</p>
            </div>
            <div className="p-3 rounded-xl bg-primary/10">
              <FileText className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Notices</p>
              <p className="text-2xl font-bold text-warning">{entries.filter(e => e.type === 'notice').length}</p>
            </div>
            <div className="p-3 rounded-xl bg-warning/10">
              <Calendar className="w-6 h-6 text-warning" />
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">This Week</p>
              <p className="text-2xl font-bold text-success">{entries.length}</p>
            </div>
            <div className="p-3 rounded-xl bg-success/10">
              <Clock className="w-6 h-6 text-success" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-2xl p-4 md:p-6 border border-border/50 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search entries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Types</option>
            <option value="homework">Homework</option>
            <option value="classwork">Classwork</option>
            <option value="notice">Notice</option>
            <option value="remark">Remark</option>
          </select>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Classes</option>
            {classes.map(cls => (
              <option key={cls.id} value={cls.name}>{cls.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Entries List */}
      <div className="space-y-4">
        {filteredEntries.map((entry) => {
          const TypeIcon = typeStyles[entry.type].icon;
          return (
            <div key={entry.id} className="bg-card rounded-2xl p-6 border border-border/50 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0', typeStyles[entry.type].bg)}>
                    <TypeIcon className={cn('w-6 h-6', typeStyles[entry.type].text)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{entry.title}</h3>
                      <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium capitalize', typeStyles[entry.type].bg, typeStyles[entry.type].text)}>
                        {entry.type}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-2">
                      <span>{entry.class} ({entry.section})</span>
                      <span>•</span>
                      <span>{entry.subject}</span>
                      {entry.dueDate && (
                        <>
                          <span>•</span>
                          <span className="text-primary">Due: {entry.dueDate}</span>
                        </>
                      )}
                    </div>
                    <p className="text-sm text-foreground/80 line-clamp-2">{entry.content}</p>
                    <p className="text-xs text-muted-foreground mt-2">By {entry.createdBy} on {entry.createdAt}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => { setSelectedEntry(entry); setIsViewOpen(true); }} className="p-2 rounded-lg hover:bg-muted">
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button onClick={() => { setSelectedEntry(entry); setFormData(entry); setIsEditOpen(true); }} className="p-2 rounded-lg hover:bg-muted">
                    <Edit className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button onClick={() => { setSelectedEntry(entry); setIsDeleteOpen(true); }} className="p-2 rounded-lg hover:bg-destructive/10">
                    <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Diary Entry</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Title</Label>
              <Input value={formData.title || ''} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="Entry title" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Type</Label>
                <select className="px-3 py-2 border border-border rounded-lg" value={formData.type || 'homework'} onChange={(e) => setFormData({...formData, type: e.target.value as DiaryEntry['type']})}>
                  <option value="homework">Homework</option>
                  <option value="classwork">Classwork</option>
                  <option value="notice">Notice</option>
                  <option value="remark">Remark</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label>Subject</Label>
                <Input value={formData.subject || ''} onChange={(e) => setFormData({...formData, subject: e.target.value})} placeholder="Mathematics" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label>Class</Label>
                <select className="px-3 py-2 border border-border rounded-lg" value={formData.class || 'Class 10'} onChange={(e) => setFormData({...formData, class: e.target.value})}>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.name}>{cls.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label>Section</Label>
                <select className="px-3 py-2 border border-border rounded-lg" value={formData.section || 'A'} onChange={(e) => setFormData({...formData, section: e.target.value})}>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label>Due Date</Label>
                <Input type="date" value={formData.dueDate || ''} onChange={(e) => setFormData({...formData, dueDate: e.target.value})} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Content</Label>
              <Textarea value={formData.content || ''} onChange={(e) => setFormData({...formData, content: e.target.value})} placeholder="Enter details..." rows={4} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Add Entry</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Diary Entry Details</DialogTitle></DialogHeader>
          {selectedEntry && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-sm text-muted-foreground">Title</p><p className="font-medium">{selectedEntry.title}</p></div>
                <div><p className="text-sm text-muted-foreground">Type</p><p className="font-medium capitalize">{selectedEntry.type}</p></div>
                <div><p className="text-sm text-muted-foreground">Class</p><p className="font-medium">{selectedEntry.class} ({selectedEntry.section})</p></div>
                <div><p className="text-sm text-muted-foreground">Subject</p><p className="font-medium">{selectedEntry.subject}</p></div>
                {selectedEntry.dueDate && <div><p className="text-sm text-muted-foreground">Due Date</p><p className="font-medium">{selectedEntry.dueDate}</p></div>}
                <div><p className="text-sm text-muted-foreground">Created By</p><p className="font-medium">{selectedEntry.createdBy}</p></div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Content</p>
                <p className="text-foreground">{selectedEntry.content}</p>
              </div>
            </div>
          )}
          <DialogFooter><Button onClick={() => setIsViewOpen(false)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Entry</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Title</Label>
              <Input value={formData.title || ''} onChange={(e) => setFormData({...formData, title: e.target.value})} />
            </div>
            <div className="grid gap-2">
              <Label>Content</Label>
              <Textarea value={formData.content || ''} onChange={(e) => setFormData({...formData, content: e.target.value})} rows={4} />
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
          <DialogHeader><DialogTitle>Delete Entry</DialogTitle></DialogHeader>
          <p className="py-4">Are you sure you want to delete "{selectedEntry?.title}"? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Diary;
