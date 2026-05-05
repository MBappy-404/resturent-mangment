import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Download, 
  Eye, 
  Edit, 
  Trash2,
  BookOpen,
  BookMarked,
  Users,
  AlertCircle
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  totalCopies: number;
  availableCopies: number;
  location: string;
  status: 'available' | 'low_stock' | 'out_of_stock';
}

const initialBooks: Book[] = [
  { id: 'BK-001', title: 'Physics for Class 10', author: 'Dr. Rafiq Ahmed', isbn: '978-123-456-001', category: 'Science', totalCopies: 50, availableCopies: 35, location: 'Shelf A-1', status: 'available' },
  { id: 'BK-002', title: 'Mathematics Made Easy', author: 'Prof. Kamal Hossain', isbn: '978-123-456-002', category: 'Mathematics', totalCopies: 40, availableCopies: 5, location: 'Shelf B-2', status: 'low_stock' },
  { id: 'BK-003', title: 'English Grammar', author: 'Sarah Khan', isbn: '978-123-456-003', category: 'Language', totalCopies: 30, availableCopies: 0, location: 'Shelf C-1', status: 'out_of_stock' },
  { id: 'BK-004', title: 'Bangladesh History', author: 'Dr. Jamal Uddin', isbn: '978-123-456-004', category: 'History', totalCopies: 25, availableCopies: 20, location: 'Shelf D-3', status: 'available' },
  { id: 'BK-005', title: 'Chemistry Fundamentals', author: 'Prof. Nusrat Jahan', isbn: '978-123-456-005', category: 'Science', totalCopies: 35, availableCopies: 28, location: 'Shelf A-2', status: 'available' },
];

const Library: React.FC = () => {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState<Partial<Book>>({});

  const categories = [...new Set(books.map(b => b.category))];

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAdd = () => {
    const totalCopies = formData.totalCopies || 0;
    const availableCopies = formData.availableCopies || totalCopies;
    const newBook: Book = {
      id: `BK-${String(books.length + 1).padStart(3, '0')}`,
      title: formData.title || '',
      author: formData.author || '',
      isbn: formData.isbn || '',
      category: formData.category || 'General',
      totalCopies,
      availableCopies,
      location: formData.location || '',
      status: availableCopies === 0 ? 'out_of_stock' : availableCopies < 10 ? 'low_stock' : 'available'
    };
    setBooks([...books, newBook]);
    setIsAddOpen(false);
    setFormData({});
    toast.success('Book added successfully');
  };

  const handleEdit = () => {
    if (!selectedBook) return;
    const availableCopies = formData.availableCopies || 0;
    setBooks(books.map(b => b.id === selectedBook.id ? { 
      ...b, 
      ...formData,
      status: availableCopies === 0 ? 'out_of_stock' : availableCopies < 10 ? 'low_stock' : 'available'
    } : b));
    setIsEditOpen(false);
    setSelectedBook(null);
    setFormData({});
    toast.success('Book updated successfully');
  };

  const handleDelete = () => {
    if (!selectedBook) return;
    setBooks(books.filter(b => b.id !== selectedBook.id));
    setIsDeleteOpen(false);
    setSelectedBook(null);
    toast.success('Book deleted successfully');
  };

  const statusStyles = {
    available: 'bg-success/10 text-success',
    low_stock: 'bg-warning/10 text-warning',
    out_of_stock: 'bg-destructive/10 text-destructive',
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="page-header">Library Management</h1>
          <p className="page-subtitle">Manage books and track issues/returns</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button onClick={() => setIsAddOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            <span>Add Book</span>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Books</p>
              <p className="text-2xl font-bold text-foreground">{books.length}</p>
            </div>
            <div className="p-3 rounded-xl bg-primary/10">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Available</p>
              <p className="text-2xl font-bold text-success">{books.filter(b => b.status === 'available').length}</p>
            </div>
            <div className="p-3 rounded-xl bg-success/10">
              <BookMarked className="w-6 h-6 text-success" />
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Low Stock</p>
              <p className="text-2xl font-bold text-warning">{books.filter(b => b.status === 'low_stock').length}</p>
            </div>
            <div className="p-3 rounded-xl bg-warning/10">
              <AlertCircle className="w-6 h-6 text-warning" />
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Copies</p>
              <p className="text-2xl font-bold text-foreground">{books.reduce((acc, b) => acc + b.totalCopies, 0)}</p>
            </div>
            <div className="p-3 rounded-xl bg-secondary/10">
              <Users className="w-6 h-6 text-secondary" />
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
              placeholder="Search books by title or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBooks.map((book) => (
          <div key={book.id} className="bg-card rounded-2xl p-6 border border-border/50 hover:shadow-lg transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground line-clamp-1">{book.title}</h3>
                  <p className="text-sm text-muted-foreground">{book.author}</p>
                </div>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Category</span>
                <span className="font-medium">{book.category}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Available</span>
                <span className="font-medium">{book.availableCopies} / {book.totalCopies}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Location</span>
                <span className="font-medium">{book.location}</span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium', statusStyles[book.status])}>
                {book.status.replace('_', ' ')}
              </span>
              <div className="flex items-center gap-1">
                <button onClick={() => { setSelectedBook(book); setIsViewOpen(true); }} className="p-2 rounded-lg hover:bg-muted">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                </button>
                <button onClick={() => { setSelectedBook(book); setFormData(book); setIsEditOpen(true); }} className="p-2 rounded-lg hover:bg-muted">
                  <Edit className="w-4 h-4 text-muted-foreground" />
                </button>
                <button onClick={() => { setSelectedBook(book); setIsDeleteOpen(true); }} className="p-2 rounded-lg hover:bg-destructive/10">
                  <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add New Book</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Book Title</Label>
              <Input value={formData.title || ''} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="Enter book title" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Author</Label>
                <Input value={formData.author || ''} onChange={(e) => setFormData({...formData, author: e.target.value})} placeholder="Author name" />
              </div>
              <div className="grid gap-2">
                <Label>ISBN</Label>
                <Input value={formData.isbn || ''} onChange={(e) => setFormData({...formData, isbn: e.target.value})} placeholder="978-XXX-XXX-XXX" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Category</Label>
                <Input value={formData.category || ''} onChange={(e) => setFormData({...formData, category: e.target.value})} placeholder="Science" />
              </div>
              <div className="grid gap-2">
                <Label>Location</Label>
                <Input value={formData.location || ''} onChange={(e) => setFormData({...formData, location: e.target.value})} placeholder="Shelf A-1" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Total Copies</Label>
                <Input type="number" value={formData.totalCopies || ''} onChange={(e) => setFormData({...formData, totalCopies: parseInt(e.target.value)})} />
              </div>
              <div className="grid gap-2">
                <Label>Available Copies</Label>
                <Input type="number" value={formData.availableCopies || ''} onChange={(e) => setFormData({...formData, availableCopies: parseInt(e.target.value)})} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Add Book</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Book Details</DialogTitle></DialogHeader>
          {selectedBook && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-sm text-muted-foreground">Title</p><p className="font-medium">{selectedBook.title}</p></div>
                <div><p className="text-sm text-muted-foreground">Author</p><p className="font-medium">{selectedBook.author}</p></div>
                <div><p className="text-sm text-muted-foreground">ISBN</p><p className="font-medium">{selectedBook.isbn}</p></div>
                <div><p className="text-sm text-muted-foreground">Category</p><p className="font-medium">{selectedBook.category}</p></div>
                <div><p className="text-sm text-muted-foreground">Location</p><p className="font-medium">{selectedBook.location}</p></div>
                <div><p className="text-sm text-muted-foreground">Copies</p><p className="font-medium">{selectedBook.availableCopies} / {selectedBook.totalCopies}</p></div>
              </div>
            </div>
          )}
          <DialogFooter><Button onClick={() => setIsViewOpen(false)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Book</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Book Title</Label>
              <Input value={formData.title || ''} onChange={(e) => setFormData({...formData, title: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Author</Label>
                <Input value={formData.author || ''} onChange={(e) => setFormData({...formData, author: e.target.value})} />
              </div>
              <div className="grid gap-2">
                <Label>Available Copies</Label>
                <Input type="number" value={formData.availableCopies || ''} onChange={(e) => setFormData({...formData, availableCopies: parseInt(e.target.value)})} />
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
          <DialogHeader><DialogTitle>Delete Book</DialogTitle></DialogHeader>
          <p className="py-4">Are you sure you want to delete "{selectedBook?.title}"? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Library;
