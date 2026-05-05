export interface Period {
  id: string;
  name: string;
  time: string;
  type: 'class' | 'break';
}

export interface RoutineEntry {
  id: string;
  day: string;
  periodId: string;
  subject: string;
  teacher: string;
  room: string;
  className: string;
  section: string;
}

export const weekDays = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Saturday',
];

export const periods: Period[] = [
  { id: '1', name: '1st Period', time: '8:00 - 8:40', type: 'class' },
  { id: '2', name: '2nd Period', time: '8:40 - 9:20', type: 'class' },
  { id: '3', name: '3rd Period', time: '9:20 - 10:00', type: 'class' },
  { id: 'tb', name: 'Tiffin Break', time: '10:00 - 10:20', type: 'break' },
  { id: '4', name: '4th Period', time: '10:20 - 11:00', type: 'class' },
  { id: '5', name: '5th Period', time: '11:00 - 11:40', type: 'class' },
  { id: '6', name: '6th Period', time: '11:40 - 12:20', type: 'class' },
  { id: 'lb', name: 'Lunch Break', time: '12:20 - 1:00', type: 'break' },
  { id: '7', name: '7th Period', time: '1:00 - 1:40', type: 'class' },
  { id: '8', name: '8th Period', time: '1:40 - 2:20', type: 'class' },
];

export const routineEntries: RoutineEntry[] = [
  // Sunday
  { id: 'RT001', day: 'Sunday', periodId: '1', subject: 'Bangla', teacher: 'Md. Rafiqul Islam', room: 'Room 301', className: 'Class 6', section: 'A' },
  { id: 'RT002', day: 'Sunday', periodId: '2', subject: 'English', teacher: 'Fatima Akter', room: 'Room 301', className: 'Class 6', section: 'A' },
  { id: 'RT003', day: 'Sunday', periodId: '3', subject: 'Mathematics', teacher: 'Abdul Karim', room: 'Room 301', className: 'Class 6', section: 'A' },
  { id: 'RT004', day: 'Sunday', periodId: '4', subject: 'Science', teacher: 'Nusrat Jahan', room: 'Lab 1', className: 'Class 6', section: 'A' },
  { id: 'RT005', day: 'Sunday', periodId: '5', subject: 'Bangladesh & Global Studies', teacher: 'Kamal Hossain', room: 'Room 301', className: 'Class 6', section: 'A' },
  { id: 'RT006', day: 'Sunday', periodId: '6', subject: 'Religion', teacher: 'Moulana Hasan', room: 'Room 301', className: 'Class 6', section: 'A' },
  { id: 'RT007', day: 'Sunday', periodId: '7', subject: 'ICT', teacher: 'Tanvir Ahmed', room: 'Computer Lab', className: 'Class 6', section: 'A' },
  { id: 'RT008', day: 'Sunday', periodId: '8', subject: 'Physical Education', teacher: 'Arif Hossain', room: 'Field', className: 'Class 6', section: 'A' },

  // Monday
  { id: 'RT009', day: 'Monday', periodId: '1', subject: 'Mathematics', teacher: 'Abdul Karim', room: 'Room 301', className: 'Class 6', section: 'A' },
  { id: 'RT010', day: 'Monday', periodId: '2', subject: 'Bangla', teacher: 'Md. Rafiqul Islam', room: 'Room 301', className: 'Class 6', section: 'A' },
  { id: 'RT011', day: 'Monday', periodId: '3', subject: 'Science', teacher: 'Nusrat Jahan', room: 'Lab 1', className: 'Class 6', section: 'A' },
  { id: 'RT012', day: 'Monday', periodId: '4', subject: 'English', teacher: 'Fatima Akter', room: 'Room 301', className: 'Class 6', section: 'A' },
  { id: 'RT013', day: 'Monday', periodId: '5', subject: 'Arts & Crafts', teacher: 'Sadia Islam', room: 'Art Room', className: 'Class 6', section: 'A' },
  { id: 'RT014', day: 'Monday', periodId: '6', subject: 'Agriculture Studies', teacher: 'Habibur Rahman', room: 'Room 301', className: 'Class 6', section: 'A' },
  { id: 'RT015', day: 'Monday', periodId: '7', subject: 'Bangladesh & Global Studies', teacher: 'Kamal Hossain', room: 'Room 301', className: 'Class 6', section: 'A' },

  // Tuesday
  { id: 'RT016', day: 'Tuesday', periodId: '1', subject: 'English', teacher: 'Fatima Akter', room: 'Room 301', className: 'Class 6', section: 'A' },
  { id: 'RT017', day: 'Tuesday', periodId: '2', subject: 'Mathematics', teacher: 'Abdul Karim', room: 'Room 301', className: 'Class 6', section: 'A' },
  { id: 'RT018', day: 'Tuesday', periodId: '3', subject: 'Bangla', teacher: 'Md. Rafiqul Islam', room: 'Room 301', className: 'Class 6', section: 'A' },
  { id: 'RT019', day: 'Tuesday', periodId: '4', subject: 'ICT', teacher: 'Tanvir Ahmed', room: 'Computer Lab', className: 'Class 6', section: 'A' },
  { id: 'RT020', day: 'Tuesday', periodId: '5', subject: 'Science', teacher: 'Nusrat Jahan', room: 'Lab 1', className: 'Class 6', section: 'A' },
  { id: 'RT021', day: 'Tuesday', periodId: '6', subject: 'Music', teacher: 'Lamia Haque', room: 'Music Room', className: 'Class 6', section: 'A' },
  { id: 'RT022', day: 'Tuesday', periodId: '7', subject: 'Home Economics', teacher: 'Rima Begum', room: 'Room 302', className: 'Class 6', section: 'A' },

  // Wednesday
  { id: 'RT023', day: 'Wednesday', periodId: '1', subject: 'Science', teacher: 'Nusrat Jahan', room: 'Lab 1', className: 'Class 6', section: 'A' },
  { id: 'RT024', day: 'Wednesday', periodId: '2', subject: 'Bangla', teacher: 'Md. Rafiqul Islam', room: 'Room 301', className: 'Class 6', section: 'A' },
  { id: 'RT025', day: 'Wednesday', periodId: '3', subject: 'English', teacher: 'Fatima Akter', room: 'Room 301', className: 'Class 6', section: 'A' },
  { id: 'RT026', day: 'Wednesday', periodId: '4', subject: 'Mathematics', teacher: 'Abdul Karim', room: 'Room 301', className: 'Class 6', section: 'A' },
  { id: 'RT027', day: 'Wednesday', periodId: '5', subject: 'Religion', teacher: 'Moulana Hasan', room: 'Room 301', className: 'Class 6', section: 'A' },
  { id: 'RT028', day: 'Wednesday', periodId: '6', subject: 'Physical Education', teacher: 'Arif Hossain', room: 'Field', className: 'Class 6', section: 'A' },

  // Thursday
  { id: 'RT029', day: 'Thursday', periodId: '1', subject: 'Bangla', teacher: 'Md. Rafiqul Islam', room: 'Room 301', className: 'Class 6', section: 'A' },
  { id: 'RT030', day: 'Thursday', periodId: '2', subject: 'Science', teacher: 'Nusrat Jahan', room: 'Lab 1', className: 'Class 6', section: 'A' },
  { id: 'RT031', day: 'Thursday', periodId: '3', subject: 'Mathematics', teacher: 'Abdul Karim', room: 'Room 301', className: 'Class 6', section: 'A' },
  { id: 'RT032', day: 'Thursday', periodId: '4', subject: 'English', teacher: 'Fatima Akter', room: 'Room 301', className: 'Class 6', section: 'A' },
  { id: 'RT033', day: 'Thursday', periodId: '5', subject: 'Bangladesh & Global Studies', teacher: 'Kamal Hossain', room: 'Room 301', className: 'Class 6', section: 'A' },
  { id: 'RT034', day: 'Thursday', periodId: '6', subject: 'ICT', teacher: 'Tanvir Ahmed', room: 'Computer Lab', className: 'Class 6', section: 'A' },

  // Saturday (half day)
  { id: 'RT035', day: 'Saturday', periodId: '1', subject: 'Mathematics', teacher: 'Abdul Karim', room: 'Room 301', className: 'Class 6', section: 'A' },
  { id: 'RT036', day: 'Saturday', periodId: '2', subject: 'English', teacher: 'Fatima Akter', room: 'Room 301', className: 'Class 6', section: 'A' },
  { id: 'RT037', day: 'Saturday', periodId: '3', subject: 'Bangla', teacher: 'Md. Rafiqul Islam', room: 'Room 301', className: 'Class 6', section: 'A' },
  { id: 'RT038', day: 'Saturday', periodId: '4', subject: 'Science', teacher: 'Nusrat Jahan', room: 'Lab 1', className: 'Class 6', section: 'A' },
];
