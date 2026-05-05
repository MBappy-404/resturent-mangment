import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserPlus, 
  UserCheck, 
  Receipt, 
  FileText, 
  Send, 
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { classes, sections } from '@/data/demoData';

const colorClasses = {
  primary: 'bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground',
  secondary: 'bg-secondary/10 text-secondary hover:bg-secondary hover:text-secondary-foreground',
  accent: 'bg-accent/10 text-accent hover:bg-accent hover:text-accent-foreground',
  info: 'bg-info/10 text-info hover:bg-info hover:text-info-foreground',
  warning: 'bg-warning/10 text-warning hover:bg-warning hover:text-warning-foreground',
  success: 'bg-success/10 text-success hover:bg-success hover:text-success-foreground',
};

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [addStudentOpen, setAddStudentOpen] = useState(false);
  const [collectFeeOpen, setCollectFeeOpen] = useState(false);
  const [createExamOpen, setCreateExamOpen] = useState(false);
  const [sendNoticeOpen, setSendNoticeOpen] = useState(false);

  const [studentForm, setStudentForm] = useState({ name: '', class: '', section: '', guardian: '', phone: '' });
  const [feeForm, setFeeForm] = useState({ studentId: '', amount: '', month: '' });
  const [examForm, setExamForm] = useState({ name: '', class: '', date: '', subjects: '' });
  const [noticeForm, setNoticeForm] = useState({ title: '', content: '', type: 'general', priority: 'medium' });

  const handleAddStudent = () => {
    if (!studentForm.name || !studentForm.class) {
      toast({ title: "Error", description: "Please fill required fields", variant: "destructive" });
      return;
    }
    toast({ title: "Success", description: `Student "${studentForm.name}" added successfully!` });
    setStudentForm({ name: '', class: '', section: '', guardian: '', phone: '' });
    setAddStudentOpen(false);
  };

  const handleCollectFee = () => {
    if (!feeForm.studentId || !feeForm.amount) {
      toast({ title: "Error", description: "Please fill required fields", variant: "destructive" });
      return;
    }
    toast({ title: "Success", description: `৳${feeForm.amount} collected successfully!` });
    setFeeForm({ studentId: '', amount: '', month: '' });
    setCollectFeeOpen(false);
  };

  const handleCreateExam = () => {
    if (!examForm.name || !examForm.class) {
      toast({ title: "Error", description: "Please fill required fields", variant: "destructive" });
      return;
    }
    toast({ title: "Success", description: `Exam "${examForm.name}" created successfully!` });
    setExamForm({ name: '', class: '', date: '', subjects: '' });
    setCreateExamOpen(false);
  };

  const handleSendNotice = () => {
    if (!noticeForm.title || !noticeForm.content) {
      toast({ title: "Error", description: "Please fill required fields", variant: "destructive" });
      return;
    }
    toast({ title: "Success", description: `Notice "${noticeForm.title}" sent successfully!` });
    setNoticeForm({ title: '', content: '', type: 'general', priority: 'medium' });
    setSendNoticeOpen(false);
  };

  const handleGenerateReport = () => {
    toast({ title: "Generating Report", description: "Your report is being generated..." });
    setTimeout(() => {
      toast({ title: "Success", description: "Report generated and downloaded!" });
    }, 1500);
  };

  const actions = [
    { icon: UserPlus, label: 'Add Student', onClick: () => setAddStudentOpen(true), color: 'primary' },
    { icon: UserCheck, label: 'Take Attendance', onClick: () => navigate('/attendance'), color: 'secondary' },
    { icon: Receipt, label: 'Collect Fee', onClick: () => setCollectFeeOpen(true), color: 'accent' },
    { icon: FileText, label: 'Create Exam', onClick: () => setCreateExamOpen(true), color: 'info' },
    { icon: Send, label: 'Send Notice', onClick: () => setSendNoticeOpen(true), color: 'warning' },
    { icon: Download, label: 'Generate Report', onClick: handleGenerateReport, color: 'success' },
  ];

  return (
    <>
      <div className="bg-card rounded-2xl p-6 border border-border/50 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
            <p className="text-sm text-muted-foreground">Frequently used actions</p>
          </div>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {actions.map((action, index) => (
            <button
              key={action.label}
              onClick={action.onClick}
              className={cn(
                'flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300 hover-lift',
                colorClasses[action.color as keyof typeof colorClasses]
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <action.icon className="w-6 h-6" />
              <span className="text-xs font-medium text-center">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Add Student Dialog */}
      <Dialog open={addStudentOpen} onOpenChange={setAddStudentOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <input
              type="text"
              placeholder="Student Name *"
              value={studentForm.name}
              onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
              className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <div className="grid grid-cols-2 gap-4">
              <select
                value={studentForm.class}
                onChange={(e) => setStudentForm({ ...studentForm, class: e.target.value })}
                className="px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Select Class *</option>
                {classes.map(cls => (
                  <option key={cls.id} value={cls.name}>{cls.name}</option>
                ))}
              </select>
              <select
                value={studentForm.section}
                onChange={(e) => setStudentForm({ ...studentForm, section: e.target.value })}
                className="px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Section</option>
                {sections.map(sec => (
                  <option key={sec} value={sec}>Section {sec}</option>
                ))}
              </select>
            </div>
            <input
              type="text"
              placeholder="Guardian Name"
              value={studentForm.guardian}
              onChange={(e) => setStudentForm({ ...studentForm, guardian: e.target.value })}
              className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={studentForm.phone}
              onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })}
              className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              onClick={handleAddStudent}
              className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors font-medium"
            >
              Add Student
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Collect Fee Dialog */}
      <Dialog open={collectFeeOpen} onOpenChange={setCollectFeeOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Collect Fee</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <input
              type="text"
              placeholder="Student ID or Name *"
              value={feeForm.studentId}
              onChange={(e) => setFeeForm({ ...feeForm, studentId: e.target.value })}
              className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              type="number"
              placeholder="Amount (৳) *"
              value={feeForm.amount}
              onChange={(e) => setFeeForm({ ...feeForm, amount: e.target.value })}
              className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <select
              value={feeForm.month}
              onChange={(e) => setFeeForm({ ...feeForm, month: e.target.value })}
              className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select Month</option>
              <option value="January">January</option>
              <option value="February">February</option>
              <option value="March">March</option>
              <option value="April">April</option>
              <option value="May">May</option>
              <option value="June">June</option>
              <option value="July">July</option>
              <option value="August">August</option>
              <option value="September">September</option>
              <option value="October">October</option>
              <option value="November">November</option>
              <option value="December">December</option>
            </select>
            <button
              onClick={handleCollectFee}
              className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors font-medium"
            >
              Collect Fee
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Exam Dialog */}
      <Dialog open={createExamOpen} onOpenChange={setCreateExamOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Exam</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <input
              type="text"
              placeholder="Exam Name *"
              value={examForm.name}
              onChange={(e) => setExamForm({ ...examForm, name: e.target.value })}
              className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <select
              value={examForm.class}
              onChange={(e) => setExamForm({ ...examForm, class: e.target.value })}
              className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select Class *</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.name}>{cls.name}</option>
              ))}
            </select>
            <input
              type="date"
              value={examForm.date}
              onChange={(e) => setExamForm({ ...examForm, date: e.target.value })}
              className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              type="text"
              placeholder="Subjects (comma separated)"
              value={examForm.subjects}
              onChange={(e) => setExamForm({ ...examForm, subjects: e.target.value })}
              className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              onClick={handleCreateExam}
              className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors font-medium"
            >
              Create Exam
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Send Notice Dialog */}
      <Dialog open={sendNoticeOpen} onOpenChange={setSendNoticeOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send Notice</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <input
              type="text"
              placeholder="Notice Title *"
              value={noticeForm.title}
              onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
              className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <textarea
              placeholder="Notice Content *"
              rows={4}
              value={noticeForm.content}
              onChange={(e) => setNoticeForm({ ...noticeForm, content: e.target.value })}
              className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
            <div className="grid grid-cols-2 gap-4">
              <select
                value={noticeForm.type}
                onChange={(e) => setNoticeForm({ ...noticeForm, type: e.target.value })}
                className="px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="general">General</option>
                <option value="exam">Exam</option>
                <option value="holiday">Holiday</option>
                <option value="event">Event</option>
              </select>
              <select
                value={noticeForm.priority}
                onChange={(e) => setNoticeForm({ ...noticeForm, priority: e.target.value })}
                className="px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
            <button
              onClick={handleSendNotice}
              className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors font-medium"
            >
              Send Notice
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
