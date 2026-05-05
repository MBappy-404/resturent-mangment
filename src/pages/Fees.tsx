import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Download, 
  Receipt,
  Wallet,
  AlertCircle,
  CheckCircle,
  Clock,
  X
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { students } from '@/data/demoData';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface StudentWithFee {
  id: string;
  name: string;
  class: string;
  section: string;
  monthlyFee: number;
  dueAmount: number;
  feeStatus: 'paid' | 'partial' | 'overdue';
}

const Fees: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isCollectDialogOpen, setIsCollectDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentWithFee | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [feeData, setFeeData] = useState<Map<string, number>>(new Map());
  const { toast } = useToast();

  const studentsWithDue = useMemo(() => {
    return students.filter(s => s.status === 'active').map(student => {
      const paidAmount = feeData.get(student.id) || 0;
      const currentDue = Math.max(0, student.dueAmount - paidAmount);
      return {
        ...student,
        dueAmount: currentDue,
        feeStatus: currentDue === 0 ? 'paid' : currentDue >= student.monthlyFee * 2 ? 'overdue' : 'partial'
      } as StudentWithFee;
    });
  }, [feeData]);

  const filteredStudents = useMemo(() => {
    return studentsWithDue.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           student.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = selectedStatus === 'all' || student.feeStatus === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, selectedStatus, studentsWithDue]);

  const totalCollection = studentsWithDue.reduce((acc, s) => acc + (s.monthlyFee - s.dueAmount), 0);
  const totalDue = studentsWithDue.reduce((acc, s) => acc + s.dueAmount, 0);
  const paidCount = studentsWithDue.filter(s => s.feeStatus === 'paid').length;
  const overdueCount = studentsWithDue.filter(s => s.feeStatus === 'overdue').length;

  const handleOpenCollectDialog = (student: StudentWithFee) => {
    setSelectedStudent(student);
    setPaymentAmount(student.dueAmount.toString());
    setPaymentMethod('cash');
    setIsCollectDialogOpen(true);
  };

  const handleCollectFee = () => {
    if (!selectedStudent) return;
    
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({ title: 'Error', description: 'Please enter a valid amount', variant: 'destructive' });
      return;
    }

    if (amount > selectedStudent.dueAmount) {
      toast({ title: 'Error', description: 'Amount cannot exceed due amount', variant: 'destructive' });
      return;
    }

    // Update payment data
    setFeeData(prev => {
      const newMap = new Map(prev);
      const currentPaid = newMap.get(selectedStudent.id) || 0;
      newMap.set(selectedStudent.id, currentPaid + amount);
      return newMap;
    });

    toast({ 
      title: 'Payment Successful', 
      description: `৳${amount.toLocaleString()} collected from ${selectedStudent.name} via ${paymentMethod}` 
    });
    setIsCollectDialogOpen(false);
    setSelectedStudent(null);
    setPaymentAmount('');
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="page-header">Fee Management</h1>
          <p className="page-subtitle">Collect and track student fees</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-muted text-foreground rounded-xl hover:bg-muted/80 transition-colors">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Collection</p>
              <p className="text-xl md:text-2xl font-bold text-foreground">৳{(totalCollection / 1000).toFixed(0)}K</p>
            </div>
            <div className="p-3 rounded-xl bg-secondary/10">
              <Wallet className="w-6 h-6 text-secondary" />
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Due</p>
              <p className="text-xl md:text-2xl font-bold text-destructive">৳{(totalDue / 1000).toFixed(0)}K</p>
            </div>
            <div className="p-3 rounded-xl bg-destructive/10">
              <AlertCircle className="w-6 h-6 text-destructive" />
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Fully Paid</p>
              <p className="text-2xl font-bold text-success">{paidCount}</p>
            </div>
            <div className="p-3 rounded-xl bg-success/10">
              <CheckCircle className="w-6 h-6 text-success" />
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Overdue</p>
              <p className="text-2xl font-bold text-warning">{overdueCount}</p>
            </div>
            <div className="p-3 rounded-xl bg-warning/10">
              <Clock className="w-6 h-6 text-warning" />
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
              placeholder="Search by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
            />
          </div>
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="partial">Partial</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Fee Table */}
      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden animate-fade-in">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Student</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground hidden sm:table-cell">Class</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">Monthly Fee</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">Due Amount</th>
                <th className="text-center py-4 px-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.slice(0, 20).map((student, index) => (
                <tr 
                  key={student.id} 
                  className="table-row animate-fade-in"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">
                          {student.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{student.name}</p>
                        <p className="text-xs text-muted-foreground">{student.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 hidden sm:table-cell">
                    <span className="text-sm text-foreground">{student.class}</span>
                    <span className="text-muted-foreground"> ({student.section})</span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="text-sm font-medium text-foreground">৳{student.monthlyFee.toLocaleString()}</span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className={cn(
                      'text-sm font-semibold',
                      student.dueAmount > 0 ? 'text-destructive' : 'text-success'
                    )}>
                      ৳{student.dueAmount.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={cn(
                      'inline-flex px-2.5 py-1 rounded-full text-xs font-medium',
                      student.feeStatus === 'paid' && 'bg-success/10 text-success',
                      student.feeStatus === 'partial' && 'bg-warning/10 text-warning',
                      student.feeStatus === 'overdue' && 'bg-destructive/10 text-destructive'
                    )}>
                      {student.feeStatus === 'paid' ? 'Paid' : student.feeStatus === 'partial' ? 'Partial' : 'Overdue'}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button 
                      onClick={() => handleOpenCollectDialog(student)}
                      className={cn(
                        'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                        student.feeStatus === 'paid'
                          ? 'bg-muted text-muted-foreground cursor-not-allowed'
                          : 'bg-primary text-primary-foreground hover:bg-primary/90'
                      )}
                      disabled={student.feeStatus === 'paid'}
                    >
                      {student.feeStatus === 'paid' ? 'Paid' : 'Collect'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Collect Fee Dialog */}
      <Dialog open={isCollectDialogOpen} onOpenChange={setIsCollectDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Collect Fee</DialogTitle>
            <DialogDescription>
              Collect fee payment from {selectedStudent?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedStudent && (
            <div className="grid gap-4 py-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Student</span>
                  <span className="text-sm font-medium">{selectedStudent.name}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Class</span>
                  <span className="text-sm">{selectedStudent.class} ({selectedStudent.section})</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Monthly Fee</span>
                  <span className="text-sm">৳{selectedStudent.monthlyFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Due Amount</span>
                  <span className="text-sm font-semibold text-destructive">৳{selectedStudent.dueAmount.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="amount">Payment Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="Enter amount"
                  max={selectedStudent.dueAmount}
                />
              </div>

              <div className="grid gap-2">
                <Label>Payment Method</Label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                >
                  <option value="cash">Cash</option>
                  <option value="bkash">bKash</option>
                  <option value="nagad">Nagad</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="card">Card</option>
                </select>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsCollectDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCollectFee}>
              <Receipt className="w-4 h-4 mr-2" />
              Collect ৳{parseFloat(paymentAmount || '0').toLocaleString()}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Fees;
