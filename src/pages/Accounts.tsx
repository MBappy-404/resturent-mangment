import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Download, 
  Eye, 
  Edit, 
  Trash2,
  Wallet,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  date: string;
  paymentMethod: string;
  reference: string;
}

const initialTransactions: Transaction[] = [
  { id: 'TXN-001', type: 'income', category: 'Student Fees', description: 'December Month Fee Collection', amount: 285000, date: '2024-12-01', paymentMethod: 'Bank Transfer', reference: 'FEE-DEC-2024' },
  { id: 'TXN-002', type: 'expense', category: 'Salary', description: 'Teacher Salary - November', amount: 450000, date: '2024-12-01', paymentMethod: 'Bank Transfer', reference: 'SAL-NOV-2024' },
  { id: 'TXN-003', type: 'income', category: 'Admission Fees', description: 'New Admissions Q4', amount: 125000, date: '2024-11-28', paymentMethod: 'Cash', reference: 'ADM-Q4-2024' },
  { id: 'TXN-004', type: 'expense', category: 'Utilities', description: 'Electricity Bill - November', amount: 35000, date: '2024-11-25', paymentMethod: 'Bank Transfer', reference: 'UTIL-NOV-2024' },
  { id: 'TXN-005', type: 'expense', category: 'Maintenance', description: 'Building Repair Work', amount: 75000, date: '2024-11-20', paymentMethod: 'Cash', reference: 'MNT-NOV-2024' },
  { id: 'TXN-006', type: 'income', category: 'Exam Fees', description: 'Half Yearly Exam Fees', amount: 95000, date: '2024-11-15', paymentMethod: 'Cash', reference: 'EXM-HY-2024' },
];

const Accounts: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [formData, setFormData] = useState<Partial<Transaction>>({});

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const netBalance = totalIncome - totalExpense;

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         t.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || t.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleAdd = () => {
    const newTransaction: Transaction = {
      id: `TXN-${String(transactions.length + 1).padStart(3, '0')}`,
      type: formData.type || 'income',
      category: formData.category || '',
      description: formData.description || '',
      amount: formData.amount || 0,
      date: formData.date || new Date().toISOString().split('T')[0],
      paymentMethod: formData.paymentMethod || 'Cash',
      reference: formData.reference || ''
    };
    setTransactions([newTransaction, ...transactions]);
    setIsAddOpen(false);
    setFormData({});
    toast.success('Transaction added successfully');
  };

  const handleEdit = () => {
    if (!selectedTransaction) return;
    setTransactions(transactions.map(t => t.id === selectedTransaction.id ? { ...t, ...formData } : t));
    setIsEditOpen(false);
    setSelectedTransaction(null);
    setFormData({});
    toast.success('Transaction updated successfully');
  };

  const handleDelete = () => {
    if (!selectedTransaction) return;
    setTransactions(transactions.filter(t => t.id !== selectedTransaction.id));
    setIsDeleteOpen(false);
    setSelectedTransaction(null);
    toast.success('Transaction deleted successfully');
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="page-header">Accounts & Finance</h1>
          <p className="page-subtitle">Manage income, expenses and financial reports</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button onClick={() => setIsAddOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            <span>Add Transaction</span>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Income</p>
              <p className="text-xl md:text-2xl font-bold text-success">৳{(totalIncome / 1000).toFixed(0)}K</p>
            </div>
            <div className="p-3 rounded-xl bg-success/10">
              <TrendingUp className="w-6 h-6 text-success" />
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Expense</p>
              <p className="text-xl md:text-2xl font-bold text-destructive">৳{(totalExpense / 1000).toFixed(0)}K</p>
            </div>
            <div className="p-3 rounded-xl bg-destructive/10">
              <TrendingDown className="w-6 h-6 text-destructive" />
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Net Balance</p>
              <p className={cn('text-xl md:text-2xl font-bold', netBalance >= 0 ? 'text-success' : 'text-destructive')}>
                ৳{(netBalance / 1000).toFixed(0)}K
              </p>
            </div>
            <div className="p-3 rounded-xl bg-primary/10">
              <Wallet className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Transactions</p>
              <p className="text-2xl font-bold text-foreground">{transactions.length}</p>
            </div>
            <div className="p-3 rounded-xl bg-secondary/10">
              <DollarSign className="w-6 h-6 text-secondary" />
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
              placeholder="Search transactions..."
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
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Transaction</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground hidden sm:table-cell">Category</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Date</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="table-row">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', 
                        transaction.type === 'income' ? 'bg-success/10' : 'bg-destructive/10'
                      )}>
                        {transaction.type === 'income' ? 
                          <ArrowUpRight className="w-5 h-5 text-success" /> : 
                          <ArrowDownRight className="w-5 h-5 text-destructive" />
                        }
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{transaction.description}</p>
                        <p className="text-xs text-muted-foreground">{transaction.reference}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 hidden sm:table-cell">
                    <span className="px-2.5 py-1 bg-muted rounded-lg text-xs font-medium">{transaction.category}</span>
                  </td>
                  <td className="py-4 px-4 hidden md:table-cell text-sm">{transaction.date}</td>
                  <td className="py-4 px-4 text-right">
                    <span className={cn('font-semibold', transaction.type === 'income' ? 'text-success' : 'text-destructive')}>
                      {transaction.type === 'income' ? '+' : '-'}৳{transaction.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => { setSelectedTransaction(transaction); setIsViewOpen(true); }} className="p-2 rounded-lg hover:bg-muted">
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button onClick={() => { setSelectedTransaction(transaction); setFormData(transaction); setIsEditOpen(true); }} className="p-2 rounded-lg hover:bg-muted">
                        <Edit className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button onClick={() => { setSelectedTransaction(transaction); setIsDeleteOpen(true); }} className="p-2 rounded-lg hover:bg-destructive/10">
                        <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Transaction</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Type</Label>
                <select className="px-3 py-2 border border-border rounded-lg" value={formData.type || 'income'} onChange={(e) => setFormData({...formData, type: e.target.value as 'income' | 'expense'})}>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label>Category</Label>
                <Input value={formData.category || ''} onChange={(e) => setFormData({...formData, category: e.target.value})} placeholder="Student Fees" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Description</Label>
              <Input value={formData.description || ''} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Enter description" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Amount (৳)</Label>
                <Input type="number" value={formData.amount || ''} onChange={(e) => setFormData({...formData, amount: parseInt(e.target.value)})} placeholder="50000" />
              </div>
              <div className="grid gap-2">
                <Label>Date</Label>
                <Input type="date" value={formData.date || ''} onChange={(e) => setFormData({...formData, date: e.target.value})} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Payment Method</Label>
                <select className="px-3 py-2 border border-border rounded-lg" value={formData.paymentMethod || 'Cash'} onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}>
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Mobile Banking">Mobile Banking</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label>Reference</Label>
                <Input value={formData.reference || ''} onChange={(e) => setFormData({...formData, reference: e.target.value})} placeholder="REF-001" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Add Transaction</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Transaction Details</DialogTitle></DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-sm text-muted-foreground">Type</p><p className="font-medium capitalize">{selectedTransaction.type}</p></div>
                <div><p className="text-sm text-muted-foreground">Category</p><p className="font-medium">{selectedTransaction.category}</p></div>
                <div><p className="text-sm text-muted-foreground">Description</p><p className="font-medium">{selectedTransaction.description}</p></div>
                <div><p className="text-sm text-muted-foreground">Amount</p><p className="font-medium">৳{selectedTransaction.amount.toLocaleString()}</p></div>
                <div><p className="text-sm text-muted-foreground">Date</p><p className="font-medium">{selectedTransaction.date}</p></div>
                <div><p className="text-sm text-muted-foreground">Payment Method</p><p className="font-medium">{selectedTransaction.paymentMethod}</p></div>
                <div><p className="text-sm text-muted-foreground">Reference</p><p className="font-medium">{selectedTransaction.reference}</p></div>
              </div>
            </div>
          )}
          <DialogFooter><Button onClick={() => setIsViewOpen(false)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Transaction</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Description</Label>
              <Input value={formData.description || ''} onChange={(e) => setFormData({...formData, description: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Amount (৳)</Label>
                <Input type="number" value={formData.amount || ''} onChange={(e) => setFormData({...formData, amount: parseInt(e.target.value)})} />
              </div>
              <div className="grid gap-2">
                <Label>Date</Label>
                <Input type="date" value={formData.date || ''} onChange={(e) => setFormData({...formData, date: e.target.value})} />
              </div>
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
          <DialogHeader><DialogTitle>Delete Transaction</DialogTitle></DialogHeader>
          <p className="py-4">Are you sure you want to delete this transaction? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Accounts;
