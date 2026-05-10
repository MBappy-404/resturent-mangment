const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const User = require('../modules/auth/auth.model');
const Library = require('../modules/library/library.model');
const Accounts = require('../modules/accounts/accounts.model');
const Guardian = require('../modules/guardian/guardian.model');
const Diary = require('../modules/diary/diary.model');
const { SMSTemplate, SMSHistory } = require('../modules/sms/sms.model');
const { Vehicle, BusRoute, Driver } = require('../modules/transport/transport.model');
const { Certificate, CertificateTemplate } = require('../modules/certificates/certificates.model');
const CalendarEvent = require('../modules/calendar/calendar.model');
const { Alumni, AlumniEvent } = require('../modules/alumni/alumni.model');
const Medical = require('../modules/medical/medical.model');
const { ScholarshipProgram, ScholarshipApplication } = require('../modules/scholarship/scholarship.model');
const { Room, HostelResident } = require('../modules/hostel/hostel.model');

const seedNewModules = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding new modules...');

    const admin = await User.findOne({ role: 'super_admin' });
    if (!admin) { console.error('Admin user not found. Run main seed first.'); process.exit(1); }
    const uid = admin._id;

    // Clear new module data
    const models = [Library, Accounts, Guardian, Diary, SMSTemplate, SMSHistory, Vehicle, BusRoute, Driver, Certificate, CertificateTemplate, CalendarEvent, Alumni, AlumniEvent, Medical, ScholarshipProgram, ScholarshipApplication, Room, HostelResident];
    for (const M of models) {
      await M.deleteMany({});
      try { await M.collection.dropIndexes(); } catch(e) {}
    }
    console.log('Cleared new module data');

    // Library
    const books = [
      { title: 'Physics for Class 10', author: 'Dr. Rafiq Ahmed', isbn: '978-123-456-001', category: 'Science', totalCopies: 50, availableCopies: 35, location: 'Shelf A-1', status: 'available' },
      { title: 'Mathematics Made Easy', author: 'Prof. Kamal Hossain', isbn: '978-123-456-002', category: 'Mathematics', totalCopies: 40, availableCopies: 5, location: 'Shelf B-2', status: 'low_stock' },
      { title: 'English Grammar', author: 'Sarah Khan', isbn: '978-123-456-003', category: 'Language', totalCopies: 30, availableCopies: 0, location: 'Shelf C-1', status: 'out_of_stock' },
      { title: 'Bangladesh History', author: 'Dr. Jamal Uddin', isbn: '978-123-456-004', category: 'History', totalCopies: 25, availableCopies: 20, location: 'Shelf D-3', status: 'available' },
      { title: 'Chemistry Fundamentals', author: 'Prof. Nusrat Jahan', isbn: '978-123-456-005', category: 'Science', totalCopies: 35, availableCopies: 28, location: 'Shelf A-2', status: 'available' },
    ];
    for (const b of books) await Library.create({ ...b, createdBy: uid });
    console.log(`${books.length} books created`);

    // Accounts
    const transactions = [
      { type: 'income', category: 'Student Fees', description: 'December Month Fee Collection', amount: 285000, date: new Date('2024-12-01'), paymentMethod: 'Bank Transfer', reference: 'FEE-DEC-2024' },
      { type: 'expense', category: 'Salary', description: 'Teacher Salary - November', amount: 450000, date: new Date('2024-12-01'), paymentMethod: 'Bank Transfer', reference: 'SAL-NOV-2024' },
      { type: 'income', category: 'Admission Fees', description: 'New Admissions Q4', amount: 125000, date: new Date('2024-11-28'), paymentMethod: 'Cash', reference: 'ADM-Q4-2024' },
      { type: 'expense', category: 'Utilities', description: 'Electricity Bill - November', amount: 35000, date: new Date('2024-11-25'), paymentMethod: 'Bank Transfer', reference: 'UTIL-NOV-2024' },
      { type: 'expense', category: 'Maintenance', description: 'Building Repair Work', amount: 75000, date: new Date('2024-11-20'), paymentMethod: 'Cash', reference: 'MNT-NOV-2024' },
      { type: 'income', category: 'Exam Fees', description: 'Half Yearly Exam Fees', amount: 95000, date: new Date('2024-11-15'), paymentMethod: 'Cash', reference: 'EXM-HY-2024' },
    ];
    for (const t of transactions) await Accounts.create({ ...t, createdBy: uid });
    console.log(`${transactions.length} transactions created`);

    // Guardian
    const guardians = [
      { name: 'Md. Abdul Rahman', phone: '+880-1711-123456', email: 'rahman@email.com', address: 'Agrabad, Chittagong', occupation: 'Businessman', relation: 'Father', students: [{ id: 'STU-00001', name: 'Tanvir Rahman', class: 'Class 10' }], status: 'active' },
      { name: 'Fatima Begum', phone: '+880-1812-234567', email: 'fatima@email.com', address: 'Nasirabad, Chittagong', occupation: 'Doctor', relation: 'Mother', students: [{ id: 'STU-00002', name: 'Nusrat Jahan', class: 'Class 8' }, { id: 'STU-00003', name: 'Sabbir Ahmed', class: 'Class 5' }], status: 'active' },
      { name: 'Kamal Hossain', phone: '+880-1911-345678', email: 'kamal@email.com', address: 'Halishahar, Chittagong', occupation: 'Engineer', relation: 'Father', students: [{ id: 'STU-00004', name: 'Rafiq Hossain', class: 'Class 9' }], status: 'active' },
      { name: 'Jamal Uddin', phone: '+880-1611-456789', email: 'jamal@email.com', address: 'GEC Circle, Chittagong', occupation: 'Teacher', relation: 'Father', students: [{ id: 'STU-00005', name: 'Imran Uddin', class: 'Class 7' }], status: 'inactive' },
      { name: 'Rabeya Khatun', phone: '+880-1511-567890', email: 'rabeya@email.com', address: 'Khulshi, Chittagong', occupation: 'Housewife', relation: 'Mother', students: [{ id: 'STU-00006', name: 'Ayesha Khatun', class: 'Class 6' }], status: 'active' },
    ];
    for (const g of guardians) await Guardian.create({ ...g, createdBy: uid });
    console.log(`${guardians.length} guardians created`);

    // Diary
    const diaryEntries = [
      { title: 'Math Homework - Chapter 5', type: 'homework', class: 'Class 10', section: 'A', subject: 'Mathematics', content: 'Complete exercises 5.1 to 5.5 from the textbook.', dueDate: new Date('2024-12-10'), createdBy: 'Mr. Kamal Hossain' },
      { title: 'Science Project', type: 'classwork', class: 'Class 9', section: 'B', subject: 'Science', content: 'Prepare a model on solar system.', dueDate: new Date('2024-12-15'), createdBy: 'Dr. Nusrat Jahan' },
      { title: 'Parent Meeting Notice', type: 'notice', class: 'Class 8', section: 'A', subject: 'General', content: 'Parents are requested to attend the meeting on December 20th.', createdBy: 'Admin Office' },
      { title: 'English Essay', type: 'homework', class: 'Class 7', section: 'C', subject: 'English', content: 'Write an essay on "My Favorite Festival" (minimum 200 words).', dueDate: new Date('2024-12-08'), createdBy: 'Mrs. Sarah Khan' },
      { title: 'Behavior Remark', type: 'remark', class: 'Class 6', section: 'A', subject: 'General', content: 'Excellent participation in class activities.', createdBy: 'Class Teacher' },
    ];
    for (const d of diaryEntries) await Diary.create({ ...d, user: uid });
    console.log(`${diaryEntries.length} diary entries created`);

    // SMS Templates
    const smsTemplates = [
      { name: 'Attendance Alert', nameBn: 'উপস্থিতি সতর্কতা', content: 'প্রিয় অভিভাবক, আপনার সন্তান {student_name} আজ {date} তারিখে স্কুলে অনুপস্থিত ছিল।', type: 'attendance' },
      { name: 'Fee Reminder', nameBn: 'ফি রিমাইন্ডার', content: 'প্রিয় অভিভাবক, {student_name} এর {month} মাসের ফি {amount} টাকা বকেয়া আছে।', type: 'fee' },
      { name: 'Exam Notice', nameBn: 'পরীক্ষার নোটিশ', content: '{exam_name} পরীক্ষা {date} তারিখ থেকে শুরু হবে।', type: 'notice' },
      { name: 'Result Published', nameBn: 'ফলাফল প্রকাশ', content: '{student_name} এর {exam_name} পরীক্ষার ফলাফল: GPA {gpa}', type: 'result' },
    ];
    for (const t of smsTemplates) await SMSTemplate.create({ ...t, createdBy: uid });
    console.log(`${smsTemplates.length} SMS templates created`);

    // SMS History
    const smsHistory = [
      { template: 'Attendance Alert', recipients: 12, sentAt: new Date('2024-12-05'), status: 'sent', type: 'attendance' },
      { template: 'Fee Reminder', recipients: 45, sentAt: new Date('2024-12-01'), status: 'sent', type: 'fee' },
      { template: 'Exam Notice', recipients: 85, sentAt: new Date('2024-11-28'), status: 'sent', type: 'notice' },
    ];
    for (const h of smsHistory) await SMSHistory.create({ ...h, createdBy: uid });
    console.log(`${smsHistory.length} SMS history records created`);

    // Transport
    const vehicles = [
      { number: 'চট্টগ্রাম মেট্রো-ক-১২৩৪', type: 'bus', capacity: 40, driver: 'আবুল হোসেন', driverPhone: '01712345678', helper: 'রফিক', route: 'নাসিরাবাদ রুট', status: 'active' },
      { number: 'চট্টগ্রাম মেট্রো-খ-৫৬৭৮', type: 'microbus', capacity: 15, driver: 'করিম উদ্দিন', driverPhone: '01812345678', helper: 'সালাম', route: 'হালিশহর রুট', status: 'active' },
      { number: 'চট্টগ্রাম মেট্রো-গ-৯০১২', type: 'bus', capacity: 45, driver: 'জাহিদ আলী', driverPhone: '01912345678', helper: 'বাদল', route: 'পাঁচলাইশ রুট', status: 'maintenance' },
      { number: 'চট্টগ্রাম মেট্রো-ঘ-৩৪৫৬', type: 'van', capacity: 10, driver: 'সাইফুল ইসলাম', driverPhone: '01612345678', helper: 'মিলন', route: 'খুলশী রুট', status: 'active' },
    ];
    for (const v of vehicles) await Vehicle.create({ ...v, createdBy: uid });
    console.log(`${vehicles.length} vehicles created`);

    const busRoutes = [
      { name: 'Nasirabad Route', nameBn: 'নাসিরাবাদ রুট', stops: ['নাসিরাবাদ', 'জিইসি', 'চকবাজার', 'স্কুল'], departureTime: '07:00', returnTime: '14:00', students: 35, fee: 1500 },
      { name: 'Halishahar Route', nameBn: 'হালিশহর রুট', stops: ['হালিশহর', 'আগ্রাবাদ', 'চকবাজার', 'স্কুল'], departureTime: '07:15', returnTime: '14:15', students: 12, fee: 1200 },
      { name: 'Panchlaish Route', nameBn: 'পাঁচলাইশ রুট', stops: ['পাঁচলাইশ', 'মেহেদীবাগ', 'চকবাজার', 'স্কুল'], departureTime: '07:30', returnTime: '14:30', students: 40, fee: 1800 },
      { name: 'Khulshi Route', nameBn: 'খুলশী রুট', stops: ['খুলশী', 'বায়েজিদ', 'স্কুল'], departureTime: '07:00', returnTime: '14:00', students: 8, fee: 1000 },
    ];
    for (const r of busRoutes) await BusRoute.create({ ...r, createdBy: uid });
    console.log(`${busRoutes.length} bus routes created`);

    const drivers = [
      { name: 'Abul Hossain', nameBn: 'আবুল হোসেন', phone: '01712345678', license: 'DL-CTG-2020-001', address: 'পটিয়া, চট্টগ্রাম', experience: 15, status: 'active' },
      { name: 'Karim Uddin', nameBn: 'করিম উদ্দিন', phone: '01812345678', license: 'DL-CTG-2019-002', address: 'হালিশহর, চট্টগ্রাম', experience: 12, status: 'active' },
      { name: 'Zahid Ali', nameBn: 'জাহিদ আলী', phone: '01912345678', license: 'DL-CTG-2021-003', address: 'পাঁচলাইশ, চট্টগ্রাম', experience: 8, status: 'active' },
    ];
    for (const d of drivers) await Driver.create({ ...d, createdBy: uid });
    console.log(`${drivers.length} drivers created`);

    // Certificates
    const certificates = [
      { type: 'transfer', studentName: 'Rahima Akter', studentNameBn: 'রাহিমা আক্তার', studentId: 'STD-001', class: '১০ম', section: 'A', fatherName: 'আব্দুল করিম', motherName: 'ফাতেমা বেগম', issueDate: new Date('2024-01-20'), reason: 'অন্য স্কুলে ভর্তি', status: 'printed', serialNo: 'TC-2024-001' },
      { type: 'character', studentName: 'Karim Uddin', studentNameBn: 'করিম উদ্দিন', studentId: 'STD-002', class: '৮ম', section: 'B', fatherName: 'জহির উদ্দিন', motherName: 'সালমা খাতুন', issueDate: new Date('2024-01-18'), status: 'approved', serialNo: 'CC-2024-001' },
      { type: 'bonafide', studentName: 'Salma Khatun', studentNameBn: 'সালমা খাতুন', studentId: 'STD-003', class: '৯ম', section: 'A', fatherName: 'আলী হোসেন', motherName: 'রহিমা বেগম', issueDate: new Date('2024-01-15'), reason: 'ব্যাংক একাউন্ট', status: 'printed', serialNo: 'BF-2024-001' },
      { type: 'testimonial', studentName: 'Jahid Hassan', studentNameBn: 'জাহিদ হাসান', studentId: 'STD-004', class: '১০ম', section: 'A', fatherName: 'হাসান আলী', motherName: 'নাজমা বেগম', issueDate: new Date('2024-01-10'), status: 'pending', serialNo: 'TM-2024-001' },
    ];
    for (const c of certificates) await Certificate.create({ ...c, createdBy: uid });
    console.log(`${certificates.length} certificates created`);

    const certTemplates = [
      { name: 'Transfer Certificate', nameBn: 'ছাড়পত্র', type: 'transfer', content: 'This is to certify that {student_name} was a student of this institution.', isActive: true },
      { name: 'Character Certificate', nameBn: 'চারিত্রিক সনদ', type: 'character', content: 'This is to certify that {student_name} bears a good moral character.', isActive: true },
      { name: 'Bonafide Certificate', nameBn: 'প্রকৃত সনদ', type: 'bonafide', content: 'This is to certify that {student_name} is a bonafide student of this institution.', isActive: true },
      { name: 'Testimonial', nameBn: 'প্রশংসাপত্র', type: 'testimonial', content: 'This is to certify that {student_name} has completed studies with good results.', isActive: true },
    ];
    for (const t of certTemplates) await CertificateTemplate.create({ ...t, createdBy: uid });
    console.log(`${certTemplates.length} certificate templates created`);

    // Calendar
    const calEvents = [
      { title: 'Eid ul-Fitr Holiday', titleBn: 'ঈদ-উল-ফিতর ছুটি', description: 'ঈদ-উল-ফিতর উপলক্ষে ৭ দিনের ছুটি', date: new Date('2024-04-10'), endDate: new Date('2024-04-16'), type: 'holiday', isImportant: true },
      { title: 'Half-Yearly Exam', titleBn: 'অর্ধ-বার্ষিক পরীক্ষা', description: 'সকল শ্রেণির অর্ধ-বার্ষিক পরীক্ষা শুরু', date: new Date('2024-05-01'), endDate: new Date('2024-05-15'), type: 'exam', isImportant: true },
      { title: 'Annual Sports Day', titleBn: 'বার্ষিক ক্রীড়া প্রতিযোগিতা', description: 'বার্ষিক ক্রীড়া প্রতিযোগিতা ও পুরস্কার বিতরণী', date: new Date('2024-03-15'), time: '09:00', type: 'event', location: 'স্কুল মাঠ', participants: 'সকল শিক্ষার্থী', isImportant: true },
      { title: 'Parent-Teacher Meeting', titleBn: 'অভিভাবক সভা', description: '১ম সাময়িক পরীক্ষার ফলাফল নিয়ে আলোচনা', date: new Date('2024-02-20'), time: '10:00', type: 'meeting', location: 'স্কুল অডিটোরিয়াম', participants: 'সকল অভিভাবক', isImportant: false },
      { title: 'Independence Day', titleBn: 'স্বাধীনতা দিবস', description: 'জাতীয় স্বাধীনতা দিবস উদযাপন ও ছুটি', date: new Date('2024-03-26'), type: 'holiday', isImportant: true },
      { title: 'Science Fair', titleBn: 'বিজ্ঞান মেলা', description: 'বার্ষিক বিজ্ঞান মেলা ও প্রদর্শনী', date: new Date('2024-04-05'), time: '10:00', type: 'event', location: 'স্কুল হল', participants: '৬ষ্ঠ-১০ম শ্রেণি', isImportant: false },
      { title: 'Final Exam', titleBn: 'বার্ষিক পরীক্ষা', description: 'বার্ষিক পরীক্ষা শুরু', date: new Date('2024-11-15'), endDate: new Date('2024-11-30'), type: 'exam', isImportant: true },
      { title: 'Victory Day', titleBn: 'বিজয় দিবস', description: 'মহান বিজয় দিবস উদযাপন', date: new Date('2024-12-16'), type: 'holiday', isImportant: true },
    ];
    for (const e of calEvents) await CalendarEvent.create({ ...e, createdBy: uid });
    console.log(`${calEvents.length} calendar events created`);

    // Alumni
    const alumniData = [
      { name: 'Dr. Mahbub Alam', nameBn: 'ড. মাহবুব আলম', email: 'mahbub@email.com', phone: '01712345678', passingYear: '2010', class: 'SSC', currentProfession: 'Doctor', company: 'Chittagong Medical College', designation: 'Professor', address: 'চট্টগ্রাম', achievements: 'MBBS Gold Medalist', status: 'active' },
      { name: 'Eng. Fatima Rahman', nameBn: 'ইঞ্জি. ফাতিমা রহমান', email: 'fatima@email.com', phone: '01812345678', passingYear: '2012', class: 'SSC', currentProfession: 'Software Engineer', company: 'Google', designation: 'Senior Engineer', address: 'ঢাকা', achievements: 'BUET First Class', status: 'active' },
      { name: 'Adv. Karim Uddin', nameBn: 'অ্যাডভোকেট করিম উদ্দিন', email: 'karim@email.com', phone: '01912345678', passingYear: '2008', class: 'SSC', currentProfession: 'Lawyer', company: 'Supreme Court', designation: 'Advocate', address: 'চট্টগ্রাম', achievements: 'LLB Gold Medalist', status: 'active' },
      { name: 'Prof. Salma Khatun', nameBn: 'প্রফেসর সালমা খাতুন', email: 'salma@email.com', phone: '01612345678', passingYear: '2005', class: 'SSC', currentProfession: 'Professor', company: 'Chittagong University', designation: 'Professor', address: 'চট্টগ্রাম', achievements: 'PhD from UK', status: 'active' },
    ];
    for (const a of alumniData) await Alumni.create({ ...a, createdBy: uid });
    console.log(`${alumniData.length} alumni created`);

    const alumniEvents = [
      { title: 'Annual Reunion 2024', titleBn: 'বার্ষিক পুনর্মিলনী ২০২৪', description: 'সকল প্রাক্তন শিক্ষার্থীদের বার্ষিক পুনর্মিলনী', date: new Date('2024-12-25'), time: '10:00', venue: 'স্কুল অডিটোরিয়াম', organizer: 'Alumni Association', expectedAttendees: 200, status: 'upcoming' },
      { title: 'Career Counseling', titleBn: 'ক্যারিয়ার কাউন্সেলিং', description: 'প্রাক্তন শিক্ষার্থীদের দ্বারা ক্যারিয়ার গাইডেন্স', date: new Date('2024-06-15'), time: '11:00', venue: 'কনফারেন্স রুম', organizer: 'Dr. Mahbub Alam', expectedAttendees: 50, status: 'completed' },
    ];
    for (const e of alumniEvents) await AlumniEvent.create({ ...e, createdBy: uid });
    console.log(`${alumniEvents.length} alumni events created`);

    // Medical
    const medicalRecords = [
      { studentId: 'STD-001', studentName: 'Rahima Akter', studentNameBn: 'রাহিমা আক্তার', class: '৮ম', section: 'A', bloodGroup: 'A+', height: '152 cm', weight: '45 kg', allergies: 'Dust allergy', chronicConditions: 'None', currentMedications: 'None', emergencyContact: 'Abdul Karim', emergencyPhone: '01712345678', emergencyRelation: 'পিতা', doctorName: 'Dr. Mahbub', doctorPhone: '01812345678', lastCheckup: new Date('2024-01-15'), notes: 'সুস্থ', status: 'healthy' },
      { studentId: 'STD-002', studentName: 'Karim Uddin', studentNameBn: 'করিম উদ্দিন', class: '৯ম', section: 'B', bloodGroup: 'B+', height: '160 cm', weight: '52 kg', allergies: 'Peanut allergy', chronicConditions: 'Asthma', currentMedications: 'Inhaler', emergencyContact: 'Zahir Uddin', emergencyPhone: '01912345678', emergencyRelation: 'পিতা', doctorName: 'Dr. Rahman', doctorPhone: '01612345678', lastCheckup: new Date('2024-01-10'), notes: 'Asthma under control', status: 'needs-attention' },
      { studentId: 'STD-003', studentName: 'Salma Khatun', studentNameBn: 'সালমা খাতুন', class: '১০ম', section: 'A', bloodGroup: 'O+', height: '155 cm', weight: '48 kg', allergies: 'None', chronicConditions: 'None', currentMedications: 'None', emergencyContact: 'Ali Hossain', emergencyPhone: '01512345678', emergencyRelation: 'পিতা', doctorName: 'Dr. Fatima', doctorPhone: '01712345679', lastCheckup: new Date('2024-01-20'), notes: 'Excellent health', status: 'healthy' },
      { studentId: 'STD-004', studentName: 'Jahid Hassan', studentNameBn: 'জাহিদ হাসান', class: '৭ম', section: 'C', bloodGroup: 'AB+', height: '148 cm', weight: '42 kg', allergies: 'Medicine allergy (Penicillin)', chronicConditions: 'Diabetes Type 1', currentMedications: 'Insulin', emergencyContact: 'Hassan Ali', emergencyPhone: '01312345678', emergencyRelation: 'পিতা', doctorName: 'Dr. Kamal', doctorPhone: '01812345679', lastCheckup: new Date('2024-01-05'), notes: 'Needs regular monitoring', status: 'critical' },
    ];
    for (const m of medicalRecords) await Medical.create({ ...m, createdBy: uid });
    console.log(`${medicalRecords.length} medical records created`);

    // Scholarship
    const programs = [
      { name: 'Merit Scholarship', nameBn: 'মেধা বৃত্তি', description: 'মেধাবী শিক্ষার্থীদের জন্য সম্পূর্ণ বৃত্তি', amount: 24000, eligibility: 'GPA 5.00', deadline: new Date('2024-06-30'), totalSlots: 20, filledSlots: 15, status: 'active', sponsor: 'School Fund' },
      { name: 'Need-Based Aid', nameBn: 'আর্থিক সহায়তা', description: 'আর্থিকভাবে অসচ্ছল শিক্ষার্থীদের জন্য', amount: 18000, eligibility: 'Family income < 15000/month', deadline: new Date('2024-07-15'), totalSlots: 30, filledSlots: 25, status: 'active', sponsor: 'Govt. Fund' },
      { name: 'Sports Scholarship', nameBn: 'ক্রীড়া বৃত্তি', description: 'জাতীয় পর্যায়ে অংশগ্রহণকারীদের জন্য', amount: 12000, eligibility: 'National level participation', deadline: new Date('2024-08-01'), totalSlots: 10, filledSlots: 5, status: 'active', sponsor: 'Alumni Association' },
    ];
    for (const p of programs) await ScholarshipProgram.create({ ...p, createdBy: uid });
    console.log(`${programs.length} scholarship programs created`);

    const applications = [
      { programName: 'Merit Scholarship', studentId: 'STD-001', studentName: 'Rahima Akter', studentNameBn: 'রাহিমা আক্তার', class: '৮ম', gpa: '5.00', familyIncome: '25000', reason: 'Academic excellence', appliedDate: new Date('2024-05-15'), status: 'approved' },
      { programName: 'Need-Based Aid', studentId: 'STD-004', studentName: 'Jahid Hassan', studentNameBn: 'জাহিদ হাসান', class: '৭ম', gpa: '4.50', familyIncome: '12000', reason: 'Family financial hardship', appliedDate: new Date('2024-06-01'), status: 'pending' },
      { programName: 'Sports Scholarship', studentId: 'STD-002', studentName: 'Karim Uddin', studentNameBn: 'করিম উদ্দিন', class: '৯ম', gpa: '4.20', familyIncome: '20000', reason: 'National cricket team member', appliedDate: new Date('2024-06-10'), status: 'approved' },
    ];
    for (const a of applications) await ScholarshipApplication.create({ ...a, createdBy: uid });
    console.log(`${applications.length} scholarship applications created`);

    // Hostel
    const rooms = [
      { roomNumber: '101', floor: '1st Floor', type: 'double', capacity: 2, occupied: 2, monthlyRent: 3000, amenities: 'Bed, Desk, Fan, Attached Bathroom', status: 'full' },
      { roomNumber: '102', floor: '1st Floor', type: 'double', capacity: 2, occupied: 1, monthlyRent: 3000, amenities: 'Bed, Desk, Fan, Attached Bathroom', status: 'available' },
      { roomNumber: '201', floor: '2nd Floor', type: 'dormitory', capacity: 6, occupied: 4, monthlyRent: 1500, amenities: 'Bed, Shared Bathroom, Fan', status: 'available' },
      { roomNumber: '202', floor: '2nd Floor', type: 'single', capacity: 1, occupied: 1, monthlyRent: 5000, amenities: 'Bed, Desk, AC, Attached Bathroom', status: 'full' },
      { roomNumber: '301', floor: '3rd Floor', type: 'dormitory', capacity: 8, occupied: 0, monthlyRent: 1200, amenities: 'Bed, Shared Bathroom', status: 'maintenance' },
    ];
    for (const r of rooms) await Room.create({ ...r, createdBy: uid });
    console.log(`${rooms.length} hostel rooms created`);

    const residents = [
      { studentId: 'STD-001', studentName: 'Rahima Akter', studentNameBn: 'রাহিমা আক্তার', class: '৮ম', roomNumber: '101', bedNumber: 'A', joinDate: new Date('2024-01-10'), guardianName: 'Abdul Karim', guardianPhone: '01712345678', mealPlan: 'full', monthlyFee: 5500, status: 'active' },
      { studentId: 'STD-002', studentName: 'Karim Uddin', studentNameBn: 'করিম উদ্দিন', class: '৯ম', roomNumber: '101', bedNumber: 'B', joinDate: new Date('2024-01-12'), guardianName: 'Zahir Uddin', guardianPhone: '01912345678', mealPlan: 'full', monthlyFee: 5500, status: 'active' },
      { studentId: 'STD-003', studentName: 'Salma Khatun', studentNameBn: 'সালমা খাতুন', class: '১০ম', roomNumber: '102', bedNumber: 'A', joinDate: new Date('2024-02-01'), guardianName: 'Ali Hossain', guardianPhone: '01512345678', mealPlan: 'partial', monthlyFee: 4500, status: 'active' },
      { studentId: 'STD-004', studentName: 'Jahid Hassan', studentNameBn: 'জাহিদ হাসান', class: '৭ম', roomNumber: '202', bedNumber: 'A', joinDate: new Date('2024-01-15'), guardianName: 'Hassan Ali', guardianPhone: '01312345678', mealPlan: 'full', monthlyFee: 7500, status: 'active' },
    ];
    for (const r of residents) await HostelResident.create({ ...r, createdBy: uid });
    console.log(`${residents.length} hostel residents created`);

    console.log('\n--- New Module Seed Complete ---');
    process.exit(0);
  } catch (error) {
    console.error('Seed Error:', error.message);
    process.exit(1);
  }
};

seedNewModules();
