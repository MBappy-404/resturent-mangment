import React, { useState, useMemo, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Book,
  Filter,
  Save,
  X
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { classes } from '@/data/demoData';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import api from '@/services/api';

// Group types for Class 9 & 10
export type GroupType = 'science' | 'business' | 'arts' | 'general';

export interface Subject {
  id: string;
  name: string;
  nameBn: string;
  code: string;
  classId: string;
  className: string;
  group: GroupType;
  academicYear: string;
  isCompulsory: boolean;
  fullMarks: number;
  passMarks: number;
}

// Compulsory subjects for all groups in Class 9-10
const compulsorySubjects = [
  { name: 'Bangla', nameBn: 'বাংলা', code: 'BAN' },
  { name: 'English', nameBn: 'ইংরেজি', code: 'ENG' },
  { name: 'Mathematics', nameBn: 'গণিত', code: 'MATH' },
  { name: 'Religion', nameBn: 'ধর্ম', code: 'REL' },
  { name: 'ICT', nameBn: 'তথ্য ও যোগাযোগ প্রযুক্তি', code: 'ICT' },
];

// Group-specific subjects
const groupSubjects: Record<GroupType, { name: string; nameBn: string; code: string }[]> = {
  science: [
    { name: 'Physics', nameBn: 'পদার্থবিজ্ঞান', code: 'PHY' },
    { name: 'Chemistry', nameBn: 'রসায়ন', code: 'CHE' },
    { name: 'Biology', nameBn: 'জীববিজ্ঞান', code: 'BIO' },
    { name: 'Higher Mathematics', nameBn: 'উচ্চতর গণিত', code: 'HMATH' },
  ],
  business: [
    { name: 'Accounting', nameBn: 'হিসাববিজ্ঞান', code: 'ACC' },
    { name: 'Business Entrepreneurship', nameBn: 'ব্যবসায় উদ্যোগ', code: 'BUS' },
    { name: 'Finance & Banking', nameBn: 'ফিন্যান্স ও ব্যাংকিং', code: 'FIN' },
  ],
  arts: [
    { name: 'History', nameBn: 'ইতিহাস', code: 'HIS' },
    { name: 'Geography', nameBn: 'ভূগোল', code: 'GEO' },
    { name: 'Civics', nameBn: 'পৌরনীতি', code: 'CIV' },
  ],
  general: [],
};

// Standard subjects for classes below 9
const standardSubjects = [
  { name: 'Bangla', nameBn: 'বাংলা', code: 'BAN' },
  { name: 'English', nameBn: 'ইংরেজি', code: 'ENG' },
  { name: 'Mathematics', nameBn: 'গণিত', code: 'MATH' },
  { name: 'General Science', nameBn: 'সাধারণ বিজ্ঞান', code: 'SCI' },
  { name: 'Bangladesh & Global Studies', nameBn: 'বাংলাদেশ ও বিশ্বপরিচয়', code: 'BGS' },
  { name: 'Religion', nameBn: 'ধর্ম', code: 'REL' },
  { name: 'ICT', nameBn: 'তথ্য ও যোগাযোগ প্রযুক্তি', code: 'ICT' },
];

// Generate initial subjects
const generateInitialSubjects = (): Subject[] => {
  const subjects: Subject[] = [];
  const academicYear = '2024';
  let idCounter = 1;

  classes.forEach(cls => {
    const isHigherClass = cls.name === 'Class 9' || cls.name === 'Class 10';
    
    if (isHigherClass) {
      // Generate subjects for each group
      (['science', 'business'] as GroupType[]).forEach(group => {
        // Add compulsory subjects
        compulsorySubjects.forEach(sub => {
          subjects.push({
            id: `SUB-${String(idCounter++).padStart(4, '0')}`,
            name: sub.name,
            nameBn: sub.nameBn,
            code: sub.code,
            classId: cls.id,
            className: cls.name,
            group,
            academicYear,
            isCompulsory: true,
            fullMarks: 100,
            passMarks: 33,
          });
        });
        
        // Add group-specific subjects
        groupSubjects[group].forEach(sub => {
          subjects.push({
            id: `SUB-${String(idCounter++).padStart(4, '0')}`,
            name: sub.name,
            nameBn: sub.nameBn,
            code: sub.code,
            classId: cls.id,
            className: cls.name,
            group,
            academicYear,
            isCompulsory: false,
            fullMarks: 100,
            passMarks: 33,
          });
        });
      });
    } else {
      // Standard subjects for lower classes
      standardSubjects.forEach(sub => {
        subjects.push({
          id: `SUB-${String(idCounter++).padStart(4, '0')}`,
          name: sub.name,
          nameBn: sub.nameBn,
          code: sub.code,
          classId: cls.id,
          className: cls.name,
          group: 'general',
          academicYear,
          isCompulsory: true,
          fullMarks: 100,
          passMarks: 33,
        });
      });
    }
  });

  return subjects;
};

const academicYears = ['2024', '2025', '2026'];
const groups: { value: GroupType; label: string; labelBn: string }[] = [
  { value: 'general', label: 'General', labelBn: 'সাধারণ' },
  { value: 'science', label: 'Science', labelBn: 'বিজ্ঞান' },
  { value: 'business', label: 'Business Studies', labelBn: 'ব্যবসায় শিক্ষা' },
  { value: 'arts', label: 'Arts/Humanities', labelBn: 'মানবিক' },
];

const Subjects: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>(generateInitialSubjects);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await api.getSubjects();
        const data = Array.isArray(res.data) ? res.data : [];
        if (data.length > 0) {
          setSubjects(data.map((s: Record<string, unknown>) => ({
            id: (s._id || '') as string,
            name: (s.name || '') as string,
            nameBn: (s.nameBn || '') as string,
            code: (s.code || '') as string,
            classId: (s.classId || '') as string,
            className: (s.className || '') as string,
            group: (s.group || 'general') as GroupType,
            academicYear: (s.academicYear || '2024') as string,
            isCompulsory: (s.isCompulsory ?? true) as boolean,
            fullMarks: (s.fullMarks || 100) as number,
            passMarks: (s.passMarks || 33) as number,
          })));
        }
      } catch { /* keep generated subjects */ }
    };
    fetchSubjects();
  }, []);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedGroup, setSelectedGroup] = useState<GroupType | 'all'>('all');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    nameBn: '',
    code: '',
    classId: '',
    group: 'general' as GroupType,
    academicYear: '2024',
    isCompulsory: true,
    fullMarks: 100,
    passMarks: 33,
  });

  const isHigherClass = (className: string) => {
    return className === 'Class 9' || className === 'Class 10';
  };

  const filteredSubjects = useMemo(() => {
    return subjects.filter(subject => {
      const matchesSearch = subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           subject.nameBn.includes(searchQuery) ||
                           subject.code.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesClass = selectedClass === 'all' || subject.className === selectedClass;
      const matchesGroup = selectedGroup === 'all' || subject.group === selectedGroup;
      const matchesYear = subject.academicYear === selectedYear;
      return matchesSearch && matchesClass && matchesGroup && matchesYear;
    });
  }, [subjects, searchQuery, selectedClass, selectedGroup, selectedYear]);

  const handleOpenDialog = (subject?: Subject) => {
    if (subject) {
      setEditingSubject(subject);
      setFormData({
        name: subject.name,
        nameBn: subject.nameBn,
        code: subject.code,
        classId: subject.classId,
        group: subject.group,
        academicYear: subject.academicYear,
        isCompulsory: subject.isCompulsory,
        fullMarks: subject.fullMarks,
        passMarks: subject.passMarks,
      });
    } else {
      setEditingSubject(null);
      setFormData({
        name: '',
        nameBn: '',
        code: '',
        classId: '',
        group: 'general',
        academicYear: '2024',
        isCompulsory: true,
        fullMarks: 100,
        passMarks: 33,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    const selectedClassObj = classes.find(c => c.id === formData.classId);
    if (!selectedClassObj) {
      toast({ title: 'Error', description: 'Please select a class', variant: 'destructive' });
      return;
    }

    if (!formData.name || !formData.code) {
      toast({ title: 'Error', description: 'Please fill all required fields', variant: 'destructive' });
      return;
    }

    if (isHigherClass(selectedClassObj.name) && formData.group === 'general') {
      toast({ title: 'Error', description: 'Please select a group for Class 9/10', variant: 'destructive' });
      return;
    }

    if (editingSubject) {
      try {
        await api.updateSubject(editingSubject.id, { ...formData, className: selectedClassObj.name });
      } catch { /* still update UI */ }
      setSubjects(prev => prev.map(s => 
        s.id === editingSubject.id 
          ? { ...s, ...formData, className: selectedClassObj.name } 
          : s
      ));
      toast({ title: 'Success', description: 'Subject updated successfully' });
    } else {
      try {
        const res = await api.createSubject({ ...formData, className: selectedClassObj.name });
        if (res.success) {
          const d = res.data as Record<string, unknown>;
          const newSubject: Subject = {
            id: (d._id || `SUB-${subjects.length + 1}`) as string,
            ...formData,
            className: selectedClassObj.name,
          };
          setSubjects(prev => [...prev, newSubject]);
          toast({ title: 'Success', description: 'Subject added successfully' });
        }
      } catch {
        const newSubject: Subject = {
          id: `SUB-${String(subjects.length + 1).padStart(4, '0')}`,
          ...formData,
          className: selectedClassObj.name,
        };
        setSubjects(prev => [...prev, newSubject]);
        toast({ title: 'Success', description: 'Subject added successfully' });
      }
    }
    setIsDialogOpen(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteSubject(id);
    } catch { /* still update UI */ }
    setSubjects(prev => prev.filter(s => s.id !== id));
    toast({ title: 'Deleted', description: 'Subject removed successfully' });
  };

  const getGroupBadgeColor = (group: GroupType) => {
    switch (group) {
      case 'science': return 'bg-blue-500/10 text-blue-600';
      case 'business': return 'bg-green-500/10 text-green-600';
      case 'arts': return 'bg-purple-500/10 text-purple-600';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="page-header">Subject Management</h1>
          <p className="page-subtitle">Configure subjects by class, group, and academic year</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Subject
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingSubject ? 'Edit Subject' : 'Add New Subject'}</DialogTitle>
              <DialogDescription>
                {editingSubject ? 'Update the subject details' : 'Add a new subject to the curriculum'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Subject Name (English)</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Mathematics"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="nameBn">Subject Name (Bangla)</Label>
                <Input
                  id="nameBn"
                  value={formData.nameBn}
                  onChange={(e) => setFormData({ ...formData, nameBn: e.target.value })}
                  placeholder="e.g., গণিত"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="code">Subject Code</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g., MATH"
                />
              </div>
              <div className="grid gap-2">
                <Label>Class</Label>
                <Select value={formData.classId} onValueChange={(value) => {
                  const cls = classes.find(c => c.id === value);
                  setFormData({ 
                    ...formData, 
                    classId: value,
                    group: cls && isHigherClass(cls.name) ? 'science' : 'general'
                  });
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map(cls => (
                      <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {formData.classId && isHigherClass(classes.find(c => c.id === formData.classId)?.name || '') && (
                <div className="grid gap-2">
                  <Label>Group (Required for Class 9-10)</Label>
                  <Select value={formData.group} onValueChange={(value: GroupType) => setFormData({ ...formData, group: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="science">Science (বিজ্ঞান)</SelectItem>
                      <SelectItem value="business">Business Studies (ব্যবসায় শিক্ষা)</SelectItem>
                      <SelectItem value="arts">Arts/Humanities (মানবিক)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="grid gap-2">
                <Label>Academic Year</Label>
                <Select value={formData.academicYear} onValueChange={(value) => setFormData({ ...formData, academicYear: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {academicYears.map(year => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="fullMarks">Full Marks</Label>
                  <Input
                    id="fullMarks"
                    type="number"
                    value={formData.fullMarks}
                    onChange={(e) => setFormData({ ...formData, fullMarks: Number(e.target.value) })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="passMarks">Pass Marks</Label>
                  <Input
                    id="passMarks"
                    type="number"
                    value={formData.passMarks}
                    onChange={(e) => setFormData({ ...formData, passMarks: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                {editingSubject ? 'Update' : 'Save'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Subjects</p>
              <p className="text-2xl font-bold text-foreground">{filteredSubjects.length}</p>
            </div>
            <div className="p-3 rounded-xl bg-primary/10">
              <Book className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Science Subjects</p>
              <p className="text-2xl font-bold text-blue-600">
                {filteredSubjects.filter(s => s.group === 'science').length}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/10">
              <Book className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Business Subjects</p>
              <p className="text-2xl font-bold text-green-600">
                {filteredSubjects.filter(s => s.group === 'business').length}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-green-500/10">
              <Book className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">General Subjects</p>
              <p className="text-2xl font-bold text-muted-foreground">
                {filteredSubjects.filter(s => s.group === 'general').length}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-muted">
              <Book className="w-6 h-6 text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-2xl p-4 md:p-6 border border-border/50 mb-6 animate-fade-in">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search subjects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            />
          </div>
          
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
          >
            <option value="all">All Classes</option>
            {classes.map(cls => (
              <option key={cls.id} value={cls.name}>{cls.name}</option>
            ))}
          </select>

          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value as GroupType | 'all')}
            className="px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
          >
            <option value="all">All Groups</option>
            {groups.map(g => (
              <option key={g.value} value={g.value}>{g.label}</option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
          >
            {academicYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Subjects Table */}
      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden animate-fade-in">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Subject</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground hidden sm:table-cell">Code</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Class</th>
                <th className="text-center py-4 px-4 text-sm font-medium text-muted-foreground">Group</th>
                <th className="text-center py-4 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Marks</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubjects.map((subject, index) => (
                <tr 
                  key={subject.id} 
                  className="table-row animate-fade-in"
                  style={{ animationDelay: `${index * 20}ms` }}
                >
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-foreground">{subject.name}</p>
                      <p className="text-xs text-muted-foreground">{subject.nameBn}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 hidden sm:table-cell">
                    <span className="px-2 py-1 bg-muted rounded text-sm font-mono">{subject.code}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-foreground">{subject.className}</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={cn(
                      'inline-flex px-2.5 py-1 rounded-full text-xs font-medium',
                      getGroupBadgeColor(subject.group)
                    )}>
                      {groups.find(g => g.value === subject.group)?.label || 'General'}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center hidden md:table-cell">
                    <span className="text-sm text-foreground">{subject.fullMarks}/{subject.passMarks}</span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleOpenDialog(subject)}
                        className="p-2 rounded-lg bg-muted hover:bg-muted/80 text-foreground transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(subject.id)}
                        className="p-2 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Subjects;
