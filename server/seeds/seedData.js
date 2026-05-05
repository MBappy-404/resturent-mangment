const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const User = require('../modules/auth/auth.model');
const Student = require('../modules/student/student.model');
const Teacher = require('../modules/teacher/teacher.model');
const Staff = require('../modules/staff/staff.model');
const Administration = require('../modules/administration/administration.model');
const Subject = require('../modules/subject/subject.model');
const ClassRoutine = require('../modules/classRoutine/classRoutine.model');
const Notice = require('../modules/notice/notice.model');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding...');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Student.deleteMany({}),
      Teacher.deleteMany({}),
      Staff.deleteMany({}),
      Administration.deleteMany({}),
      Subject.deleteMany({}),
      ClassRoutine.deleteMany({}),
      Notice.deleteMany({})
    ]);
    console.log('Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@school.edu.bd',
      password: 'password123',
      phone: '+880-1711-000000',
      role: 'super_admin'
    });
    console.log('Admin user created: admin@school.edu.bd / password123');

    // Create teachers
    const teacherData = [
      { name: 'Md. Abdur Rahim', nameBn: 'মো. আব্দুর রহিম', designation: 'Head Teacher', department: 'Administration', subjects: ['Bangla', 'Bangladesh & Global Studies'], phone: '+880-1711-234567', email: 'rahim@school.edu.bd', gender: 'male', salary: 65000, qualifications: 'M.A. in Bangla, B.Ed', experience: 25 },
      { name: 'Ayesha Begum', nameBn: 'আয়েশা বেগম', designation: 'Assistant Head Teacher', department: 'English', subjects: ['English'], phone: '+880-1812-345678', email: 'ayesha@school.edu.bd', gender: 'female', salary: 55000, qualifications: 'M.A. in English, B.Ed', experience: 20 },
      { name: 'Md. Rafiqul Islam', nameBn: 'মো. রফিকুল ইসলাম', designation: 'Senior Teacher', department: 'Bangla', subjects: ['Bangla'], phone: '+880-1911-456789', gender: 'male', salary: 42000, qualifications: 'M.A. in Bangla', experience: 15 },
      { name: 'Nusrat Jahan', nameBn: 'নুসরাত জাহান', designation: 'Senior Teacher', department: 'Science', subjects: ['Science', 'Chemistry'], phone: '+880-1611-567890', gender: 'female', salary: 40000, qualifications: 'M.Sc. in Chemistry', experience: 12 },
      { name: 'Abdul Karim', nameBn: 'আব্দুল করিম', designation: 'Senior Teacher', department: 'Mathematics', subjects: ['Mathematics'], phone: '+880-1511-678901', gender: 'male', salary: 42000, qualifications: 'M.Sc. in Mathematics', experience: 18 },
      { name: 'Fatima Akter', nameBn: 'ফাতিমা আক্তার', designation: 'Assistant Teacher', department: 'English', subjects: ['English'], phone: '+880-1711-789012', gender: 'female', salary: 32000, qualifications: 'B.A. in English, B.Ed', experience: 8 },
      { name: 'Tanvir Ahmed', nameBn: 'তানভীর আহমেদ', designation: 'Assistant Teacher', department: 'ICT', subjects: ['ICT'], phone: '+880-1811-890123', gender: 'male', salary: 30000, qualifications: 'B.Sc. in CSE', experience: 5 },
      { name: 'Kamal Hossain', nameBn: 'কামাল হোসেন', designation: 'Assistant Teacher', department: 'Social Science', subjects: ['Bangladesh & Global Studies'], phone: '+880-1911-901234', gender: 'male', salary: 32000, qualifications: 'M.S.S. in Political Science', experience: 10 },
      { name: 'Moulana Hasan', nameBn: 'মৌলানা হাসান', designation: 'Assistant Teacher', department: 'Religion', subjects: ['Religion'], phone: '+880-1611-012345', gender: 'male', salary: 28000, qualifications: 'Kamil in Arabic, B.Ed', experience: 14 },
      { name: 'Lamia Haque', nameBn: 'লামিয়া হক', designation: 'Junior Teacher', department: 'Music', subjects: ['Music'], phone: '+880-1511-123456', gender: 'female', salary: 22000, qualifications: 'B.A. in Music', experience: 3 }
    ];

    const teachers = await Teacher.insertMany(teacherData.map(t => ({ ...t, createdBy: admin._id })));
    console.log(`${teachers.length} teachers created`);

    // Create students
    const classes = ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'];
    const sections = ['A', 'B'];
    const studentNames = [
      { name: 'Imran Khan', nameBn: 'ইমরান খান', gender: 'male' },
      { name: 'Nusrat Jahan Moni', nameBn: 'নুসরাত জাহান মনি', gender: 'female' },
      { name: 'Ayesha Siddiqua', nameBn: 'আয়েশা সিদ্দিকা', gender: 'female' },
      { name: 'Jubayer Rahman', nameBn: 'জুবায়ের রহমান', gender: 'male' },
      { name: 'Tasnim Akter', nameBn: 'তাসনিম আক্তার', gender: 'female' },
      { name: 'Rafsan Ahmed', nameBn: 'রাফসান আহমেদ', gender: 'male' },
      { name: 'Farhana Islam', nameBn: 'ফারহানা ইসলাম', gender: 'female' },
      { name: 'Sakib Hasan', nameBn: 'সাকিব হাসান', gender: 'male' },
      { name: 'Mariam Begum', nameBn: 'মরিয়ম বেগম', gender: 'female' },
      { name: 'Arif Hossain', nameBn: 'আরিফ হোসেন', gender: 'male' }
    ];

    const students = [];
    let rollCounter = 1;
    for (const cls of classes) {
      for (const sec of sections) {
        for (let i = 0; i < studentNames.length; i++) {
          students.push({
            ...studentNames[i],
            fatherName: `${studentNames[i].name.split(' ')[1] || 'Ahmed'} Uddin`,
            motherName: `${studentNames[i].gender === 'male' ? 'Rahima' : 'Halima'} Begum`,
            guardianPhone: `+880-1${Math.floor(Math.random() * 9)}11-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`,
            dateOfBirth: new Date(2008 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
            className: cls,
            section: sec,
            roll: rollCounter++,
            session: '2024',
            religion: 'Islam',
            address: { present: 'Chittagong, Bangladesh', permanent: 'Chittagong, Bangladesh' },
            status: 'active',
            createdBy: admin._id
          });
        }
      }
    }
    await Student.insertMany(students);
    console.log(`${students.length} students created`);

    // Create staff
    const staffData = [
      { name: 'Rabeya Khatun', nameBn: 'রাবেয়া খাতুন', role: 'Librarian', category: 'Support', department: 'Library', phone: '+880-1611-012345', salary: 28000, qualifications: 'B.A., Diploma in Library Science' },
      { name: 'Shahidul Islam', nameBn: 'শহিদুল ইসলাম', role: 'Lab Assistant', category: 'Support', department: 'Science Lab', phone: '+880-1711-123456', salary: 22000, qualifications: 'H.S.C. (Science)' },
      { name: 'Ratan Mia', nameBn: 'রতন মিয়া', role: 'Accountant', category: 'Administrative', department: 'Accounts', phone: '+880-1811-234567', salary: 35000, qualifications: 'B.Com, CA (Inter)' },
      { name: 'Jamal Uddin', nameBn: 'জামাল উদ্দিন', role: 'Office Assistant', category: 'Administrative', department: 'Office', phone: '+880-1911-345678', salary: 18000, qualifications: 'H.S.C.' },
      { name: 'Karim Sheikh', nameBn: 'করিম শেখ', role: 'Guard', category: 'Support', department: 'Security', phone: '+880-1511-456789', salary: 15000, qualifications: 'S.S.C.' },
      { name: 'Rahim Mia', nameBn: 'রহিম মিয়া', role: 'Peon', category: 'Support', department: 'General', phone: '+880-1611-567890', salary: 12000, qualifications: 'Class 8' },
      { name: 'Helal Uddin', nameBn: 'হেলাল উদ্দিন', role: 'Driver', category: 'Support', department: 'Transport', phone: '+880-1711-678901', salary: 18000, qualifications: 'S.S.C., Driving License' },
      { name: 'Sumon Das', nameBn: 'সুমন দাস', role: 'Computer Operator', category: 'Administrative', department: 'Office', phone: '+880-1811-789012', salary: 25000, qualifications: 'B.Sc., Computer Diploma' },
      { name: 'Fatema Begum', nameBn: 'ফাতেমা বেগম', role: 'Cleaner', category: 'Support', department: 'Maintenance', phone: '+880-1911-890123', salary: 10000, qualifications: 'Class 5' }
    ];

    await Staff.insertMany(staffData.map(s => ({ ...s, status: 'active', createdBy: admin._id })));
    console.log(`${staffData.length} staff members created`);

    // Create administration members
    const adminData = [
      { name: 'Prof. Dr. Anisur Rahman', nameBn: 'অধ্যাপক ড. আনিসুর রহমান', designation: 'Chairman / Director', designationBn: 'চেয়ারম্যান / পরিচালক', category: 'director', occupation: 'Educationist & Former University Professor', phone: '+880-1711-111111', email: 'chairman@school.edu.bd', appointmentDate: new Date('2015-01-01'), status: 'active', bio: 'Former Professor at Chittagong University with 30+ years in education', responsibilities: ['Overall school governance', 'Policy making', 'Strategic planning'] },
      { name: 'Dr. Shahinur Alam', nameBn: 'ড. শাহিনুর আলম', designation: 'Vice Chairman', designationBn: 'ভাইস চেয়ারম্যান', category: 'director', occupation: 'Retired Professor, Chittagong University', phone: '+880-1811-222222', email: 'vice.chairman@school.edu.bd', appointmentDate: new Date('2016-06-15'), status: 'active' },
      { name: 'Md. Abdur Rahim', nameBn: 'মো. আব্দুর রহিম', designation: 'Head Teacher (Ex-Officio Secretary)', designationBn: 'প্রধান শিক্ষক (পদাধিকার সচিব)', category: 'director', occupation: 'Head Teacher', phone: '+880-1711-234567', email: 'headteacher@school.edu.bd', appointmentDate: new Date('2005-01-15'), status: 'active' },
      { name: 'Alhaj Md. Nurul Islam', nameBn: 'আলহাজ্ব মো. নুরুল ইসলাম', designation: 'President', designationBn: 'সভাপতি', category: 'governing-body', occupation: 'Business Leader & Philanthropist', phone: '+880-1711-333333', status: 'active', responsibilities: ['Preside over governing body meetings', 'Approve budgets'] },
      { name: 'Advocate Selina Akter', nameBn: 'এডভোকেট সেলিনা আক্তার', designation: 'Secretary', designationBn: 'সাধারণ সম্পাদক', category: 'governing-body', occupation: 'Lawyer, Chittagong Bar Association', phone: '+880-1811-444444', status: 'active' },
      { name: 'Mr. Habibur Rahman', nameBn: 'জনাব হাবিবুর রহমান', designation: 'Treasurer', designationBn: 'কোষাধ্যক্ষ', category: 'governing-body', occupation: 'Bank Manager (Retired)', phone: '+880-1911-555555', status: 'active' },
      { name: 'Dr. Farhana Yasmin', nameBn: 'ড. ফারহানা ইয়াসমিন', designation: 'Member - Parent Representative', designationBn: 'সদস্য - অভিভাবক প্রতিনিধি', category: 'governing-body', occupation: 'Doctor, Chittagong Medical College', phone: '+880-1611-666666', status: 'active' },
      { name: 'Prof. Mizanur Rahman', nameBn: 'অধ্যাপক মিজানুর রহমান', designation: 'Member - Education Expert', designationBn: 'সদস্য - শিক্ষা বিশেষজ্ঞ', category: 'governing-body', occupation: 'Professor, Education Department', phone: '+880-1511-777777', status: 'active' },
      { name: 'Ayesha Begum', nameBn: 'আয়েশা বেগম', designation: 'Exam Committee Head', designationBn: 'পরীক্ষা কমিটি প্রধান', category: 'committee', committeeRole: 'Exam Committee', phone: '+880-1812-345678', status: 'active', responsibilities: ['Organize exams', 'Result processing', 'Exam schedule preparation'] },
      { name: 'Abdul Karim', nameBn: 'আব্দুল করিম', designation: 'Discipline Committee Head', designationBn: 'শৃঙ্খলা কমিটি প্রধান', category: 'committee', committeeRole: 'Discipline Committee', phone: '+880-1511-678901', status: 'active', responsibilities: ['Student discipline', 'Code of conduct enforcement'] }
    ];

    await Administration.insertMany(adminData.map(a => ({ ...a, createdBy: admin._id })));
    console.log(`${adminData.length} administration members created`);

    // Create subjects
    const subjectData = [
      { name: 'Bangla', nameBn: 'বাংলা', code: 'BNG-101', className: 'Class 6', type: 'compulsory' },
      { name: 'English', nameBn: 'ইংরেজি', code: 'ENG-101', className: 'Class 6', type: 'compulsory' },
      { name: 'Mathematics', nameBn: 'গণিত', code: 'MTH-101', className: 'Class 6', type: 'compulsory' },
      { name: 'Science', nameBn: 'বিজ্ঞান', code: 'SCI-101', className: 'Class 6', type: 'compulsory' },
      { name: 'Bangladesh & Global Studies', nameBn: 'বাংলাদেশ ও বিশ্বপরিচয়', code: 'BGS-101', className: 'Class 6', type: 'compulsory' },
      { name: 'Religion', nameBn: 'ধর্ম', code: 'REL-101', className: 'Class 6', type: 'compulsory' },
      { name: 'ICT', nameBn: 'তথ্য ও যোগাযোগ প্রযুক্তি', code: 'ICT-101', className: 'Class 6', type: 'compulsory' },
      { name: 'Arts & Crafts', nameBn: 'চারু ও কারুকলা', code: 'ART-101', className: 'Class 6', type: 'optional' },
      { name: 'Physical Education', nameBn: 'শারীরিক শিক্ষা', code: 'PHE-101', className: 'Class 6', type: 'optional' },
      { name: 'Music', nameBn: 'সংগীত', code: 'MUS-101', className: 'Class 6', type: 'optional' }
    ];

    await Subject.insertMany(subjectData.map(s => ({ ...s, createdBy: admin._id })));
    console.log(`${subjectData.length} subjects created`);

    // Create notices
    const noticeData = [
      { title: 'Annual Exam Schedule Published', titleBn: 'বার্ষিক পরীক্ষার সময়সূচী প্রকাশ', description: 'The annual examination for all classes will begin from December 1, 2024. Students are advised to collect their admit cards from the office.', category: 'exam', targetAudience: 'all', status: 'published', isPinned: true },
      { title: 'Parent-Teacher Meeting', titleBn: 'অভিভাবক-শিক্ষক সভা', description: 'A parent-teacher meeting will be held on November 15, 2024 at 10:00 AM in the school auditorium. All parents are requested to attend.', category: 'general', targetAudience: 'parents', status: 'published' },
      { title: 'Independence Day Celebration', titleBn: 'স্বাধীনতা দিবস উদযাপন', description: 'The school will celebrate Independence Day on March 26. Cultural programs will be organized. All students must wear white attire.', category: 'event', targetAudience: 'all', status: 'published' }
    ];

    await Notice.insertMany(noticeData.map(n => ({ ...n, createdBy: admin._id })));
    console.log(`${noticeData.length} notices created`);

    console.log('\n--- Seed Complete ---');
    console.log('Admin login: admin@school.edu.bd / password123');
    process.exit(0);
  } catch (error) {
    console.error('Seed Error:', error);
    process.exit(1);
  }
};

seedData();
