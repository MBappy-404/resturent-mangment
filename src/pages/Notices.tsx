import React, { useState } from 'react';
import { 
  Plus, 
  Bell, 
  Calendar, 
  AlertCircle, 
  Gift,
  Search,
  Eye,
  Edit,
  Trash2,
  Megaphone
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { notices as initialNotices } from '@/data/demoData';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

const priorityStyles = {
  high: 'border-l-destructive bg-destructive/5',
  medium: 'border-l-warning bg-warning/5',
  low: 'border-l-info bg-info/5',
};

const typeIcons = {
  general: Bell,
  exam: AlertCircle,
  holiday: Gift,
  event: Calendar,
};

const typeStyles = {
  general: 'bg-primary/10 text-primary',
  exam: 'bg-destructive/10 text-destructive',
  holiday: 'bg-success/10 text-success',
  event: 'bg-accent/10 text-accent',
};

const Notices: React.FC = () => {
  const { toast } = useToast();
  const [notices, setNotices] = useState(initialNotices);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<typeof notices[0] | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'general' as 'general' | 'exam' | 'holiday' | 'event',
    priority: 'medium' as 'high' | 'medium' | 'low'
  });

  const resetForm = () => {
    setFormData({ title: '', content: '', type: 'general', priority: 'medium' });
  };

  const filteredNotices = notices.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notice.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || notice.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleAdd = () => {
    if (!formData.title || !formData.content) {
      toast({ title: "Error", description: "Please fill required fields", variant: "destructive" });
      return;
    }
    const newNotice = {
      id: `NOT${Date.now()}`,
      title: formData.title,
      titleBn: formData.title,
      content: formData.content,
      type: formData.type,
      priority: formData.priority,
      date: new Date().toISOString().split('T')[0]
    };
    setNotices([newNotice, ...notices]);
    toast({ title: "Success", description: `Notice "${formData.title}" created successfully!` });
    resetForm();
    setAddDialogOpen(false);
  };

  const handleEdit = () => {
    if (!selectedNotice || !formData.title || !formData.content) {
      toast({ title: "Error", description: "Please fill required fields", variant: "destructive" });
      return;
    }
    setNotices(notices.map(n => 
      n.id === selectedNotice.id 
        ? { ...n, title: formData.title, content: formData.content, type: formData.type, priority: formData.priority }
        : n
    ));
    toast({ title: "Success", description: `Notice "${formData.title}" updated successfully!` });
    resetForm();
    setEditDialogOpen(false);
    setSelectedNotice(null);
  };

  const handleDelete = () => {
    if (!selectedNotice) return;
    setNotices(notices.filter(n => n.id !== selectedNotice.id));
    toast({ title: "Deleted", description: `Notice "${selectedNotice.title}" deleted successfully!` });
    setDeleteDialogOpen(false);
    setSelectedNotice(null);
  };

  const openEditDialog = (notice: typeof notices[0]) => {
    setSelectedNotice(notice);
    setFormData({
      title: notice.title,
      content: notice.content,
      type: notice.type,
      priority: notice.priority
    });
    setEditDialogOpen(true);
  };

  const openViewDialog = (notice: typeof notices[0]) => {
    setSelectedNotice(notice);
    setViewDialogOpen(true);
  };

  const openDeleteDialog = (notice: typeof notices[0]) => {
    setSelectedNotice(notice);
    setDeleteDialogOpen(true);
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="page-header">Notice Board</h1>
          <p className="page-subtitle">Manage and publish announcements</p>
        </div>
        <button 
          onClick={() => { resetForm(); setAddDialogOpen(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create Notice</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-2xl p-4 md:p-6 border border-border/50 mb-6 animate-fade-in">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search notices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
            />
          </div>
          
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
          >
            <option value="all">All Types</option>
            <option value="general">General</option>
            <option value="exam">Exam</option>
            <option value="holiday">Holiday</option>
            <option value="event">Event</option>
          </select>
        </div>
      </div>

      {/* Notices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNotices.map((notice, index) => {
          const Icon = typeIcons[notice.type];
          return (
            <div
              key={notice.id}
              className={cn(
                'bg-card rounded-2xl p-6 border border-border/50 border-l-4 hover:shadow-lg transition-all duration-300 animate-fade-in hover-lift',
                priorityStyles[notice.priority]
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={cn(
                  'p-2 rounded-xl',
                  typeStyles[notice.type]
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    'px-2.5 py-1 rounded-full text-xs font-medium capitalize',
                    notice.priority === 'high' && 'bg-destructive/10 text-destructive',
                    notice.priority === 'medium' && 'bg-warning/10 text-warning',
                    notice.priority === 'low' && 'bg-info/10 text-info'
                  )}>
                    {notice.priority} Priority
                  </span>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-foreground mb-2">{notice.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{notice.content}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{notice.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => openViewDialog(notice)}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button 
                    onClick={() => openEditDialog(notice)}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <Edit className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button 
                    onClick={() => openDeleteDialog(notice)}
                    className="p-2 rounded-lg hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredNotices.length === 0 && (
        <div className="bg-card rounded-2xl p-12 border border-border/50 text-center animate-fade-in">
          <Megaphone className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No notices found</h3>
          <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Add Notice Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Notice</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <input
              type="text"
              placeholder="Notice Title *"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <textarea
              placeholder="Notice Content *"
              rows={4}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
            <div className="grid grid-cols-2 gap-4">
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as typeof formData.type })}
                className="px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="general">General</option>
                <option value="exam">Exam</option>
                <option value="holiday">Holiday</option>
                <option value="event">Event</option>
              </select>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as typeof formData.priority })}
                className="px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
            <button
              onClick={handleAdd}
              className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors font-medium"
            >
              Create Notice
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Notice Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Notice</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <input
              type="text"
              placeholder="Notice Title *"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <textarea
              placeholder="Notice Content *"
              rows={4}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
            <div className="grid grid-cols-2 gap-4">
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as typeof formData.type })}
                className="px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="general">General</option>
                <option value="exam">Exam</option>
                <option value="holiday">Holiday</option>
                <option value="event">Event</option>
              </select>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as typeof formData.priority })}
                className="px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
            <button
              onClick={handleEdit}
              className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors font-medium"
            >
              Update Notice
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Notice Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Notice Details</DialogTitle>
          </DialogHeader>
          {selectedNotice && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4">
                <div className={cn('p-3 rounded-xl', typeStyles[selectedNotice.type])}>
                  {React.createElement(typeIcons[selectedNotice.type], { className: 'w-6 h-6' })}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground">{selectedNotice.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={cn(
                      'px-2 py-0.5 rounded-full text-xs font-medium capitalize',
                      typeStyles[selectedNotice.type]
                    )}>
                      {selectedNotice.type}
                    </span>
                    <span className={cn(
                      'px-2 py-0.5 rounded-full text-xs font-medium capitalize',
                      selectedNotice.priority === 'high' && 'bg-destructive/10 text-destructive',
                      selectedNotice.priority === 'medium' && 'bg-warning/10 text-warning',
                      selectedNotice.priority === 'low' && 'bg-info/10 text-info'
                    )}>
                      {selectedNotice.priority}
                    </span>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">{selectedNotice.content}</p>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground pt-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Published on {selectedNotice.date}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Notice?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedNotice?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default Notices;
