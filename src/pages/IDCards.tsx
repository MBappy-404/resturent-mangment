import React, { useState } from 'react';
import { 
  Search, 
  Download, 
  Printer,
  IdCard,
  Users,
  GraduationCap,
  Eye,
  QrCode
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { students, teachers } from '@/data/demoData';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const IDCards: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'students' | 'teachers'>('students');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState<any>(null);

  const data = selectedType === 'students' ? students.slice(0, 50) : teachers;

  const filteredData = data.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSelect = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedItems.length === filteredData.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredData.map(item => item.id));
    }
  };

  const handlePrint = () => {
    if (selectedItems.length === 0) {
      toast.error('Please select at least one item to print');
      return;
    }
    toast.success(`Printing ${selectedItems.length} ID card(s)...`);
  };

  const handlePreview = (item: any) => {
    setPreviewItem(item);
    setIsPreviewOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="page-header">ID Card Generator</h1>
          <p className="page-subtitle">Generate and print ID cards for students and staff</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2" onClick={handlePrint}>
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print Selected ({selectedItems.length})</span>
          </Button>
          <Button className="gap-2">
            <Download className="w-4 h-4" />
            <span>Export PDF</span>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Students</p>
              <p className="text-2xl font-bold text-foreground">{students.length}</p>
            </div>
            <div className="p-3 rounded-xl bg-primary/10">
              <GraduationCap className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Teachers</p>
              <p className="text-2xl font-bold text-foreground">{teachers.length}</p>
            </div>
            <div className="p-3 rounded-xl bg-secondary/10">
              <Users className="w-6 h-6 text-secondary" />
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Selected</p>
              <p className="text-2xl font-bold text-primary">{selectedItems.length}</p>
            </div>
            <div className="p-3 rounded-xl bg-primary/10">
              <IdCard className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Cards Generated</p>
              <p className="text-2xl font-bold text-success">1,280</p>
            </div>
            <div className="p-3 rounded-xl bg-success/10">
              <QrCode className="w-6 h-6 text-success" />
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
              placeholder="Search by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { setSelectedType('students'); setSelectedItems([]); }}
              className={cn('px-4 py-2.5 rounded-xl text-sm font-medium transition-colors',
                selectedType === 'students' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
              )}
            >
              Students
            </button>
            <button
              onClick={() => { setSelectedType('teachers'); setSelectedItems([]); }}
              className={cn('px-4 py-2.5 rounded-xl text-sm font-medium transition-colors',
                selectedType === 'teachers' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
              )}
            >
              Teachers
            </button>
          </div>
          <Button variant="outline" onClick={selectAll}>
            {selectedItems.length === filteredData.length ? 'Deselect All' : 'Select All'}
          </Button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredData.map((item) => (
          <div 
            key={item.id} 
            className={cn(
              'bg-card rounded-2xl border-2 overflow-hidden transition-all cursor-pointer',
              selectedItems.includes(item.id) ? 'border-primary shadow-lg' : 'border-border/50 hover:border-primary/50'
            )}
            onClick={() => toggleSelect(item.id)}
          >
            {/* ID Card Preview */}
            <div className="bg-gradient-to-br from-primary to-primary/80 p-4 text-primary-foreground">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs opacity-80">EduManage</p>
                    <p className="text-[10px] opacity-60">Institute System</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-primary-foreground/20 rounded text-xs capitalize">
                  {selectedType === 'students' ? 'Student' : 'Staff'}
                </span>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-20 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  <Users className="w-8 h-8 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">{item.name}</h3>
                  <p className="text-xs text-muted-foreground">{item.id}</p>
                  {selectedType === 'students' ? (
                    <>
                      <p className="text-xs mt-1">{(item as any).class} - {(item as any).section}</p>
                      <p className="text-xs text-muted-foreground">Roll: {(item as any).roll}</p>
                    </>
                  ) : (
                    <>
                      <p className="text-xs mt-1">{(item as any).designation}</p>
                      <p className="text-xs text-muted-foreground">{(item as any).department}</p>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                    <QrCode className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <span className="text-xs text-muted-foreground">QR Code</span>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); handlePreview(item); }}
                  className="p-2 rounded-lg hover:bg-muted"
                >
                  <Eye className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>ID Card Preview</DialogTitle></DialogHeader>
          {previewItem && (
            <div className="py-4">
              {/* Full ID Card */}
              <div className="bg-card border-2 border-primary rounded-xl overflow-hidden">
                <div className="bg-gradient-to-br from-primary to-primary/80 p-6 text-primary-foreground text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <GraduationCap className="w-6 h-6" />
                    <span className="font-bold">EduManage Institute</span>
                  </div>
                  <p className="text-xs opacity-80">Chittagong, Bangladesh</p>
                </div>
                <div className="p-6">
                  <div className="flex justify-center mb-4">
                    <div className="w-24 h-28 rounded-lg bg-muted flex items-center justify-center">
                      <Users className="w-12 h-12 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-foreground">{previewItem.name}</h3>
                    <p className="text-sm text-muted-foreground">{previewItem.id}</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    {selectedType === 'students' ? (
                      <>
                        <div className="flex justify-between"><span className="text-muted-foreground">Class:</span><span className="font-medium">{previewItem.class} ({previewItem.section})</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Roll:</span><span className="font-medium">{previewItem.roll}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Blood Group:</span><span className="font-medium">{previewItem.bloodGroup}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Guardian:</span><span className="font-medium">{previewItem.guardianName}</span></div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between"><span className="text-muted-foreground">Designation:</span><span className="font-medium">{previewItem.designation}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Department:</span><span className="font-medium">{previewItem.department}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Phone:</span><span className="font-medium">{previewItem.phone}</span></div>
                      </>
                    )}
                  </div>
                  <div className="flex justify-center mt-4 pt-4 border-t border-border">
                    <div className="w-16 h-16 rounded bg-muted flex items-center justify-center">
                      <QrCode className="w-10 h-10 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>Close</Button>
            <Button onClick={() => { toast.success('Printing ID card...'); setIsPreviewOpen(false); }}>
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default IDCards;
