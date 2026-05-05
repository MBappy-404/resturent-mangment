// Demo data for Institute Management System
// Realistic Bangladeshi names and data

export interface Institute {
  id: string;
  name: string;
  nameBn: string;
  type: 'school' | 'college' | 'madrasa' | 'kindergarten';
  address: string;
  phone: string;
  email: string;
  logo?: string;
  studentCount: number;
  teacherCount: number;
}

export interface Student {
  id: string;
  name: string;
  nameBn: string;
  roll: number;
  class: string;
  section: string;
  gender: 'male' | 'female';
  dateOfBirth: string;
  guardianName: string;
  guardianPhone: string;
  address: string;
  photo?: string;
  status: 'active' | 'inactive';
  admissionDate: string;
  bloodGroup?: string;
  monthlyFee: number;
  dueAmount: number;
}

export interface Teacher {
  id: string;
  name: string;
  nameBn: string;
  designation: string;
  department: string;
  phone: string;
  email: string;
  joinDate: string;
  salary: number;
  status: 'active' | 'inactive';
  photo?: string;
  gender: 'male' | 'female';
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'leave';
}

export interface FeeRecord {
  id: string;
  studentId: string;
  month: string;
  year: number;
  amount: number;
  paid: number;
  status: 'paid' | 'partial' | 'unpaid';
  paidDate?: string;
}

export interface ExamResult {
  id: string;
  studentId: string;
  examName: string;
  subject: string;
  fullMarks: number;
  obtainedMarks: number;
  grade: string;
}

export interface Notice {
  id: string;
  title: string;
  titleBn: string;
  content: string;
  date: string;
  priority: 'high' | 'medium' | 'low';
  type: 'general' | 'exam' | 'holiday' | 'event';
}

// Demo Institutes
export const institutes: Institute[] = [
  {
    id: 'inst-1',
    name: 'Chittagong Model School & College',
    nameBn: 'চট্টগ্রাম মডেল স্কুল এন্ড কলেজ',
    type: 'school',
    address: 'Agrabad, Chittagong',
    phone: '+880-31-123456',
    email: 'info@cmsc.edu.bd',
    studentCount: 1250,
    teacherCount: 85,
  },
  {
    id: 'inst-2',
    name: 'Al-Amin Madrasa',
    nameBn: 'আল-আমিন মাদ্রাসা',
    type: 'madrasa',
    address: 'Halishahar, Chittagong',
    phone: '+880-31-234567',
    email: 'info@alamin.edu.bd',
    studentCount: 650,
    teacherCount: 45,
  },
  {
    id: 'inst-3',
    name: 'Little Stars Kindergarten',
    nameBn: 'লিটল স্টার্স কিন্ডারগার্টেন',
    type: 'kindergarten',
    address: 'Nasirabad, Chittagong',
    phone: '+880-31-345678',
    email: 'info@littlestars.edu.bd',
    studentCount: 180,
    teacherCount: 15,
  },
];

// Classes and Sections
export const classes = [
  { id: 'play', name: 'Play', nameBn: 'প্লে' },
  { id: 'nursery', name: 'Nursery', nameBn: 'নার্সারি' },
  { id: 'kg', name: 'KG', nameBn: 'কেজি' },
  { id: '1', name: 'Class 1', nameBn: 'প্রথম শ্রেণি' },
  { id: '2', name: 'Class 2', nameBn: 'দ্বিতীয় শ্রেণি' },
  { id: '3', name: 'Class 3', nameBn: 'তৃতীয় শ্রেণি' },
  { id: '4', name: 'Class 4', nameBn: 'চতুর্থ শ্রেণি' },
  { id: '5', name: 'Class 5', nameBn: 'পঞ্চম শ্রেণি' },
  { id: '6', name: 'Class 6', nameBn: 'ষষ্ঠ শ্রেণি' },
  { id: '7', name: 'Class 7', nameBn: 'সপ্তম শ্রেণি' },
  { id: '8', name: 'Class 8', nameBn: 'অষ্টম শ্রেণি' },
  { id: '9', name: 'Class 9', nameBn: 'নবম শ্রেণি' },
  { id: '10', name: 'Class 10', nameBn: 'দশম শ্রেণি' },
];

export const sections = ['A', 'B', 'C', 'D'];

// Bangladeshi Names
const maleNames = [
  { en: 'Mohammad Rafiq', bn: 'মোহাম্মদ রফিক' },
  { en: 'Abdul Karim', bn: 'আব্দুল করিম' },
  { en: 'Md. Hasan', bn: 'মোঃ হাসান' },
  { en: 'Tanvir Ahmed', bn: 'তানভীর আহমেদ' },
  { en: 'Rakib Hossain', bn: 'রাকিব হোসেন' },
  { en: 'Imran Khan', bn: 'ইমরান খান' },
  { en: 'Sajid Rahman', bn: 'সাজিদ রহমান' },
  { en: 'Fahim Chowdhury', bn: 'ফাহিম চৌধুরী' },
  { en: 'Nayeem Islam', bn: 'নাঈম ইসলাম' },
  { en: 'Arif Hossain', bn: 'আরিফ হোসেন' },
  { en: 'Sabbir Ahmed', bn: 'সাব্বির আহমেদ' },
  { en: 'Mehedi Hasan', bn: 'মেহেদী হাসান' },
  { en: 'Jubayer Rahman', bn: 'জুবায়ের রহমান' },
  { en: 'Shakib Al Hasan', bn: 'সাকিব আল হাসান' },
  { en: 'Tamim Iqbal', bn: 'তামিম ইকবাল' },
];

const femaleNames = [
  { en: 'Fatima Akter', bn: 'ফাতিমা আক্তার' },
  { en: 'Ayesha Siddiqua', bn: 'আয়েশা সিদ্দিকা' },
  { en: 'Nusrat Jahan', bn: 'নুসরাত জাহান' },
  { en: 'Sadia Islam', bn: 'সাদিয়া ইসলাম' },
  { en: 'Maliha Rahman', bn: 'মালিহা রহমান' },
  { en: 'Tasnim Akter', bn: 'তাসনিম আক্তার' },
  { en: 'Rabeya Khatun', bn: 'রাবেয়া খাতুন' },
  { en: 'Jannatul Ferdous', bn: 'জান্নাতুল ফেরদৌস' },
  { en: 'Afrin Sultana', bn: 'আফরিন সুলতানা' },
  { en: 'Lamia Haque', bn: 'লামিয়া হক' },
  { en: 'Sumiya Akter', bn: 'সুমিয়া আক্তার' },
  { en: 'Nadia Islam', bn: 'নাদিয়া ইসলাম' },
  { en: 'Rima Begum', bn: 'রিমা বেগম' },
  { en: 'Sabrina Ahmed', bn: 'সাবরিনা আহমেদ' },
  { en: 'Tania Sultana', bn: 'তানিয়া সুলতানা' },
];

const guardianNames = [
  'Md. Abdul Rahman', 'Kamal Hossain', 'Jamal Uddin', 'Fazlur Rahman',
  'Shamsul Alam', 'Nurul Islam', 'Rafiqul Islam', 'Aminul Islam',
  'Moinul Haque', 'Rezaul Karim', 'Habibur Rahman', 'Mizanur Rahman',
];

const addresses = [
  'Agrabad, Chittagong', 'Nasirabad, Chittagong', 'Halishahar, Chittagong',
  'GEC Circle, Chittagong', 'Khulshi, Chittagong', 'Pahartali, Chittagong',
  'Patenga, Chittagong', 'Kotwali, Chittagong', 'Bakolia, Chittagong',
  'Chandgaon, Chittagong', 'Bayezid, Chittagong', 'Oxygen, Chittagong',
];

// Generate Students
export const generateStudents = (count: number): Student[] => {
  const students: Student[] = [];
  const allNames = [...maleNames, ...femaleNames];
  
  for (let i = 0; i < count; i++) {
    const isMale = Math.random() > 0.5;
    const names = isMale ? maleNames : femaleNames;
    const name = names[Math.floor(Math.random() * names.length)];
    const classItem = classes[Math.floor(Math.random() * classes.length)];
    const section = sections[Math.floor(Math.random() * sections.length)];
    const guardian = guardianNames[Math.floor(Math.random() * guardianNames.length)];
    const address = addresses[Math.floor(Math.random() * addresses.length)];
    
    const year = 2015 + Math.floor(Math.random() * 10);
    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
    
    const monthlyFee = 1500 + Math.floor(Math.random() * 3) * 500;
    const dueAmount = Math.random() > 0.7 ? monthlyFee * Math.floor(Math.random() * 3 + 1) : 0;
    
    students.push({
      id: `STU-${String(i + 1).padStart(5, '0')}`,
      name: name.en,
      nameBn: name.bn,
      roll: Math.floor(Math.random() * 50) + 1,
      class: classItem.name,
      section,
      gender: isMale ? 'male' : 'female',
      dateOfBirth: `${year}-${month}-${day}`,
      guardianName: guardian,
      guardianPhone: `+880-1${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}`,
      address,
      status: Math.random() > 0.1 ? 'active' : 'inactive',
      admissionDate: `202${Math.floor(Math.random() * 4)}-01-15`,
      bloodGroup: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'][Math.floor(Math.random() * 8)],
      monthlyFee,
      dueAmount,
    });
  }
  
  return students;
};

// Generate Teachers
export const generateTeachers = (count: number): Teacher[] => {
  const teachers: Teacher[] = [];
  const designations = ['Principal', 'Vice Principal', 'Senior Teacher', 'Assistant Teacher', 'Junior Teacher'];
  const departments = ['Bangla', 'English', 'Mathematics', 'Science', 'Social Science', 'Religion', 'ICT', 'Physical Education'];
  
  for (let i = 0; i < count; i++) {
    const isMale = Math.random() > 0.4;
    const names = isMale ? maleNames : femaleNames;
    const name = names[Math.floor(Math.random() * names.length)];
    const designation = designations[Math.floor(Math.random() * designations.length)];
    const department = departments[Math.floor(Math.random() * departments.length)];
    
    teachers.push({
      id: `TCH-${String(i + 1).padStart(4, '0')}`,
      name: name.en,
      nameBn: name.bn,
      designation,
      department,
      phone: `+880-1${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}`,
      email: `${name.en.toLowerCase().replace(/[.\s]/g, '')}@school.edu.bd`,
      joinDate: `201${Math.floor(Math.random() * 10)}-0${Math.floor(Math.random() * 9) + 1}-15`,
      salary: 25000 + Math.floor(Math.random() * 50) * 1000,
      status: Math.random() > 0.1 ? 'active' : 'inactive',
      gender: isMale ? 'male' : 'female',
    });
  }
  
  return teachers;
};

// Generate Notices
export const notices: Notice[] = [
  {
    id: 'notice-1',
    title: 'Annual Sports Day Announcement',
    titleBn: 'বার্ষিক ক্রীড়া দিবস ঘোষণা',
    content: 'Annual Sports Day will be held on December 15, 2024. All students are requested to participate actively.',
    date: '2024-12-01',
    priority: 'high',
    type: 'event',
  },
  {
    id: 'notice-2',
    title: 'Half-Yearly Exam Schedule',
    titleBn: 'অর্ধ-বার্ষিক পরীক্ষার সময়সূচী',
    content: 'Half-yearly examination will start from November 20, 2024. Detailed schedule will be published soon.',
    date: '2024-11-10',
    priority: 'high',
    type: 'exam',
  },
  {
    id: 'notice-3',
    title: 'Winter Vacation Notice',
    titleBn: 'শীতকালীন ছুটির নোটিশ',
    content: 'School will remain closed from December 25, 2024 to January 5, 2025 for winter vacation.',
    date: '2024-12-20',
    priority: 'medium',
    type: 'holiday',
  },
  {
    id: 'notice-4',
    title: 'Parent-Teacher Meeting',
    titleBn: 'অভিভাবক-শিক্ষক সভা',
    content: 'Parent-Teacher meeting scheduled for November 25, 2024 at 10:00 AM. All parents are requested to attend.',
    date: '2024-11-15',
    priority: 'medium',
    type: 'general',
  },
  {
    id: 'notice-5',
    title: 'Fee Payment Deadline',
    titleBn: 'ফি প্রদানের শেষ তারিখ',
    content: 'Last date for November fee payment is November 15, 2024. Late fee will be applicable after the deadline.',
    date: '2024-11-05',
    priority: 'high',
    type: 'general',
  },
];

// Dashboard Statistics
export const dashboardStats = {
  totalStudents: 1250,
  totalTeachers: 85,
  presentToday: 1180,
  absentToday: 70,
  monthlyCollection: 2875000,
  totalDue: 425000,
  upcomingExams: 3,
  todaysClasses: 42,
};

// Monthly attendance data for charts
export const monthlyAttendance = [
  { month: 'Jan', present: 92, absent: 8 },
  { month: 'Feb', present: 88, absent: 12 },
  { month: 'Mar', present: 95, absent: 5 },
  { month: 'Apr', present: 90, absent: 10 },
  { month: 'May', present: 85, absent: 15 },
  { month: 'Jun', present: 78, absent: 22 },
  { month: 'Jul', present: 94, absent: 6 },
  { month: 'Aug', present: 96, absent: 4 },
  { month: 'Sep', present: 93, absent: 7 },
  { month: 'Oct', present: 91, absent: 9 },
  { month: 'Nov', present: 89, absent: 11 },
  { month: 'Dec', present: 87, absent: 13 },
];

// Fee collection data for charts
export const feeCollection = [
  { month: 'Jan', collected: 2500000, due: 350000 },
  { month: 'Feb', collected: 2650000, due: 280000 },
  { month: 'Mar', collected: 2800000, due: 220000 },
  { month: 'Apr', collected: 2700000, due: 300000 },
  { month: 'May', collected: 2550000, due: 380000 },
  { month: 'Jun', collected: 2200000, due: 520000 },
  { month: 'Jul', collected: 2750000, due: 290000 },
  { month: 'Aug', collected: 2900000, due: 180000 },
  { month: 'Sep', collected: 2850000, due: 210000 },
  { month: 'Oct', collected: 2780000, due: 260000 },
  { month: 'Nov', collected: 2875000, due: 425000 },
  { month: 'Dec', collected: 2600000, due: 350000 },
];

// Class-wise student distribution
export const classDistribution = [
  { class: 'Play', students: 45 },
  { class: 'Nursery', students: 52 },
  { class: 'KG', students: 58 },
  { class: 'Class 1', students: 85 },
  { class: 'Class 2', students: 92 },
  { class: 'Class 3', students: 98 },
  { class: 'Class 4', students: 105 },
  { class: 'Class 5', students: 112 },
  { class: 'Class 6', students: 125 },
  { class: 'Class 7', students: 130 },
  { class: 'Class 8', students: 128 },
  { class: 'Class 9', students: 115 },
  { class: 'Class 10', students: 105 },
];

// Generate demo data
export const students = generateStudents(300);
export const teachers = generateTeachers(30);

// Pricing Plans
export interface PricingPlan {
  id: string;
  name: string;
  nameBn: string;
  studentLimit: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  popular?: boolean;
}

export const pricingPlans: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    nameBn: 'স্টার্টার',
    studentLimit: 'Up to 100 students',
    monthlyPrice: 2999,
    yearlyPrice: 29990,
    features: [
      'Student Management',
      'Fee Collection',
      'Basic Reports',
      'Email Support',
      '1 Admin User',
    ],
  },
  {
    id: 'standard',
    name: 'Standard',
    nameBn: 'স্ট্যান্ডার্ড',
    studentLimit: 'Up to 500 students',
    monthlyPrice: 7999,
    yearlyPrice: 79990,
    features: [
      'Everything in Starter',
      'Attendance System',
      'Exam Management',
      'SMS Notifications',
      '5 Admin Users',
      'Guardian Portal',
    ],
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    nameBn: 'প্রিমিয়াম',
    studentLimit: 'Up to 2000 students',
    monthlyPrice: 14999,
    yearlyPrice: 149990,
    features: [
      'Everything in Standard',
      'Library Management',
      'Accounts Module',
      'ID Card Generator',
      'Unlimited Admin Users',
      'Priority Support',
      'Custom Reports',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    nameBn: 'এন্টারপ্রাইজ',
    studentLimit: 'Unlimited students',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      'Everything in Premium',
      'Multi-branch Support',
      'API Access',
      'White-labeling',
      'Dedicated Support',
      'Custom Development',
      'Training Sessions',
    ],
  },
];
