const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Module route imports
const authRoutes = require('./modules/auth/auth.routes');
const studentRoutes = require('./modules/student/student.routes');
const teacherRoutes = require('./modules/teacher/teacher.routes');
const classRoutineRoutes = require('./modules/classRoutine/classRoutine.routes');
const staffRoutes = require('./modules/staff/staff.routes');
const administrationRoutes = require('./modules/administration/administration.routes');
const attendanceRoutes = require('./modules/attendance/attendance.routes');
const feesRoutes = require('./modules/fees/fees.routes');
const examsRoutes = require('./modules/exams/exams.routes');
const subjectRoutes = require('./modules/subject/subject.routes');
const noticeRoutes = require('./modules/notice/notice.routes');
const libraryRoutes = require('./modules/library/library.routes');
const accountsRoutes = require('./modules/accounts/accounts.routes');
const guardianRoutes = require('./modules/guardian/guardian.routes');
const diaryRoutes = require('./modules/diary/diary.routes');
const smsRoutes = require('./modules/sms/sms.routes');
const transportRoutes = require('./modules/transport/transport.routes');
const certificatesRoutes = require('./modules/certificates/certificates.routes');
const calendarRoutes = require('./modules/calendar/calendar.routes');
const alumniRoutes = require('./modules/alumni/alumni.routes');
const medicalRoutes = require('./modules/medical/medical.routes');
const scholarshipRoutes = require('./modules/scholarship/scholarship.routes');
const hostelRoutes = require('./modules/hostel/hostel.routes');

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 500 });
app.use('/api/', limiter);

// Static files
const uploadsDir = path.join(__dirname, 'uploads');
const fs = require('fs');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/class-routines', classRoutineRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/administration', administrationRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/fees', feesRoutes);
app.use('/api/exams', examsRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/accounts', accountsRoutes);
app.use('/api/guardians', guardianRoutes);
app.use('/api/diary', diaryRoutes);
app.use('/api/sms', smsRoutes);
app.use('/api/transport', transportRoutes);
app.use('/api/certificates', certificatesRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/alumni', alumniRoutes);
app.use('/api/medical', medicalRoutes);
app.use('/api/scholarship', scholarshipRoutes);
app.use('/api/hostel', hostelRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'School Management System API is running',
    timestamp: new Date().toISOString(),
    modules: [
      'auth', 'students', 'teachers', 'class-routines', 'staff',
      'administration', 'attendance', 'fees', 'exams', 'subjects', 'notices',
      'library', 'accounts', 'guardians', 'diary', 'sms', 'transport',
      'certificates', 'calendar', 'alumni', 'medical', 'scholarship', 'hostel'
    ]
  });
});

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`School Management Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

module.exports = app;
