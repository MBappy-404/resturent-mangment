const API_BASE = '/api';

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  total?: number;
  page?: number;
  pages?: number;
}

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.message || 'API request failed');
    }

    return json;
  }

  // Auth
  async login(email: string, password: string) {
    const res = await this.request<{ user: unknown; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (res.data?.token) {
      this.setToken(res.data.token);
    }
    return res;
  }

  async register(data: { name: string; email: string; password: string; role?: string }) {
    const res = await this.request<{ user: unknown; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (res.data?.token) {
      this.setToken(res.data.token);
    }
    return res;
  }

  async getProfile() {
    return this.request('/auth/me');
  }

  // Students
  async getStudents(params?: Record<string, string>) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/students${query}`);
  }

  async getStudent(id: string) {
    return this.request(`/students/${id}`);
  }

  async createStudent(data: unknown) {
    return this.request('/students', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateStudent(id: string, data: unknown) {
    return this.request(`/students/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async deleteStudent(id: string) {
    return this.request(`/students/${id}`, { method: 'DELETE' });
  }

  async getStudentStats() {
    return this.request('/students/stats/overview');
  }

  // Teachers
  async getTeachers(params?: Record<string, string>) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/teachers${query}`);
  }

  async createTeacher(data: unknown) {
    return this.request('/teachers', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateTeacher(id: string, data: unknown) {
    return this.request(`/teachers/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async deleteTeacher(id: string) {
    return this.request(`/teachers/${id}`, { method: 'DELETE' });
  }

  // Staff
  async getStaff(params?: Record<string, string>) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/staff${query}`);
  }

  async createStaff(data: unknown) {
    return this.request('/staff', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateStaff(id: string, data: unknown) {
    return this.request(`/staff/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async deleteStaff(id: string) {
    return this.request(`/staff/${id}`, { method: 'DELETE' });
  }

  // Administration
  async getAdministration(params?: Record<string, string>) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/administration${query}`);
  }

  async createAdministration(data: unknown) {
    return this.request('/administration', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateAdministration(id: string, data: unknown) {
    return this.request(`/administration/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async deleteAdministration(id: string) {
    return this.request(`/administration/${id}`, { method: 'DELETE' });
  }

  // Class Routines
  async getClassRoutines(params?: Record<string, string>) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/class-routines${query}`);
  }

  async createClassRoutine(data: unknown) {
    return this.request('/class-routines', { method: 'POST', body: JSON.stringify(data) });
  }

  async createBulkRoutines(data: unknown) {
    return this.request('/class-routines/bulk', { method: 'POST', body: JSON.stringify(data) });
  }

  // Attendance
  async getAttendance(params?: Record<string, string>) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/attendance${query}`);
  }

  async markAttendance(data: unknown) {
    return this.request('/attendance', { method: 'POST', body: JSON.stringify(data) });
  }

  // Fees
  async getFeeStructures(params?: Record<string, string>) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/fees/structures${query}`);
  }

  async getFeePayments(params?: Record<string, string>) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/fees/payments${query}`);
  }

  async createFeePayment(data: unknown) {
    return this.request('/fees/payments', { method: 'POST', body: JSON.stringify(data) });
  }

  // Exams
  async getExams(params?: Record<string, string>) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/exams${query}`);
  }

  async createExam(data: unknown) {
    return this.request('/exams', { method: 'POST', body: JSON.stringify(data) });
  }

  async getExamResults(params?: Record<string, string>) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/exams/results/all${query}`);
  }

  // Subjects
  async getSubjects(params?: Record<string, string>) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/subjects${query}`);
  }

  async createSubject(data: unknown) {
    return this.request('/subjects', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateSubject(id: string, data: unknown) {
    return this.request(`/subjects/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async deleteSubject(id: string) {
    return this.request(`/subjects/${id}`, { method: 'DELETE' });
  }

  // Notices
  async getNotices(params?: Record<string, string>) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/notices${query}`);
  }

  async createNotice(data: unknown) {
    return this.request('/notices', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateNotice(id: string, data: unknown) {
    return this.request(`/notices/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async deleteNotice(id: string) {
    return this.request(`/notices/${id}`, { method: 'DELETE' });
  }

  // Library
  async getLibrary(params?: Record<string, string>) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/library${query}`);
  }
  async createBook(data: unknown) { return this.request('/library', { method: 'POST', body: JSON.stringify(data) }); }
  async updateBook(id: string, data: unknown) { return this.request(`/library/${id}`, { method: 'PUT', body: JSON.stringify(data) }); }
  async deleteBook(id: string) { return this.request(`/library/${id}`, { method: 'DELETE' }); }

  // Accounts
  async getAccounts(params?: Record<string, string>) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/accounts${query}`);
  }
  async createTransaction(data: unknown) { return this.request('/accounts', { method: 'POST', body: JSON.stringify(data) }); }
  async updateTransaction(id: string, data: unknown) { return this.request(`/accounts/${id}`, { method: 'PUT', body: JSON.stringify(data) }); }
  async deleteTransaction(id: string) { return this.request(`/accounts/${id}`, { method: 'DELETE' }); }

  // Guardian
  async getGuardians(params?: Record<string, string>) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/guardians${query}`);
  }
  async createGuardian(data: unknown) { return this.request('/guardians', { method: 'POST', body: JSON.stringify(data) }); }
  async updateGuardian(id: string, data: unknown) { return this.request(`/guardians/${id}`, { method: 'PUT', body: JSON.stringify(data) }); }
  async deleteGuardian(id: string) { return this.request(`/guardians/${id}`, { method: 'DELETE' }); }

  // Diary
  async getDiary(params?: Record<string, string>) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/diary${query}`);
  }
  async createDiaryEntry(data: unknown) { return this.request('/diary', { method: 'POST', body: JSON.stringify(data) }); }
  async updateDiaryEntry(id: string, data: unknown) { return this.request(`/diary/${id}`, { method: 'PUT', body: JSON.stringify(data) }); }
  async deleteDiaryEntry(id: string) { return this.request(`/diary/${id}`, { method: 'DELETE' }); }

  // SMS
  async getSMSTemplates() { return this.request('/sms/templates'); }
  async createSMSTemplate(data: unknown) { return this.request('/sms/templates', { method: 'POST', body: JSON.stringify(data) }); }
  async updateSMSTemplate(id: string, data: unknown) { return this.request(`/sms/templates/${id}`, { method: 'PUT', body: JSON.stringify(data) }); }
  async deleteSMSTemplate(id: string) { return this.request(`/sms/templates/${id}`, { method: 'DELETE' }); }
  async getSMSHistory() { return this.request('/sms/history'); }
  async sendSMS(data: unknown) { return this.request('/sms/send', { method: 'POST', body: JSON.stringify(data) }); }

  // Transport
  async getVehicles() { return this.request('/transport/vehicles'); }
  async createVehicle(data: unknown) { return this.request('/transport/vehicles', { method: 'POST', body: JSON.stringify(data) }); }
  async updateVehicle(id: string, data: unknown) { return this.request(`/transport/vehicles/${id}`, { method: 'PUT', body: JSON.stringify(data) }); }
  async deleteVehicle(id: string) { return this.request(`/transport/vehicles/${id}`, { method: 'DELETE' }); }
  async getBusRoutes() { return this.request('/transport/routes'); }
  async createBusRoute(data: unknown) { return this.request('/transport/routes', { method: 'POST', body: JSON.stringify(data) }); }
  async updateBusRoute(id: string, data: unknown) { return this.request(`/transport/routes/${id}`, { method: 'PUT', body: JSON.stringify(data) }); }
  async deleteBusRoute(id: string) { return this.request(`/transport/routes/${id}`, { method: 'DELETE' }); }
  async getDrivers() { return this.request('/transport/drivers'); }
  async createDriver(data: unknown) { return this.request('/transport/drivers', { method: 'POST', body: JSON.stringify(data) }); }
  async updateDriver(id: string, data: unknown) { return this.request(`/transport/drivers/${id}`, { method: 'PUT', body: JSON.stringify(data) }); }
  async deleteDriver(id: string) { return this.request(`/transport/drivers/${id}`, { method: 'DELETE' }); }

  // Certificates
  async getCertificates(params?: Record<string, string>) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/certificates${query}`);
  }
  async createCertificate(data: unknown) { return this.request('/certificates', { method: 'POST', body: JSON.stringify(data) }); }
  async updateCertificate(id: string, data: unknown) { return this.request(`/certificates/${id}`, { method: 'PUT', body: JSON.stringify(data) }); }
  async deleteCertificate(id: string) { return this.request(`/certificates/${id}`, { method: 'DELETE' }); }
  async getCertificateTemplates() { return this.request('/certificates/templates'); }
  async createCertificateTemplate(data: unknown) { return this.request('/certificates/templates', { method: 'POST', body: JSON.stringify(data) }); }
  async updateCertificateTemplate(id: string, data: unknown) { return this.request(`/certificates/templates/${id}`, { method: 'PUT', body: JSON.stringify(data) }); }
  async deleteCertificateTemplate(id: string) { return this.request(`/certificates/templates/${id}`, { method: 'DELETE' }); }

  // Calendar
  async getCalendarEvents(params?: Record<string, string>) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/calendar${query}`);
  }
  async createCalendarEvent(data: unknown) { return this.request('/calendar', { method: 'POST', body: JSON.stringify(data) }); }
  async updateCalendarEvent(id: string, data: unknown) { return this.request(`/calendar/${id}`, { method: 'PUT', body: JSON.stringify(data) }); }
  async deleteCalendarEvent(id: string) { return this.request(`/calendar/${id}`, { method: 'DELETE' }); }

  // Alumni
  async getAlumni(params?: Record<string, string>) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/alumni${query}`);
  }
  async createAlumni(data: unknown) { return this.request('/alumni', { method: 'POST', body: JSON.stringify(data) }); }
  async updateAlumni(id: string, data: unknown) { return this.request(`/alumni/${id}`, { method: 'PUT', body: JSON.stringify(data) }); }
  async deleteAlumni(id: string) { return this.request(`/alumni/${id}`, { method: 'DELETE' }); }
  async getAlumniEvents() { return this.request('/alumni/events'); }
  async createAlumniEvent(data: unknown) { return this.request('/alumni/events', { method: 'POST', body: JSON.stringify(data) }); }
  async updateAlumniEvent(id: string, data: unknown) { return this.request(`/alumni/events/${id}`, { method: 'PUT', body: JSON.stringify(data) }); }
  async deleteAlumniEvent(id: string) { return this.request(`/alumni/events/${id}`, { method: 'DELETE' }); }

  // Medical
  async getMedicalRecords(params?: Record<string, string>) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/medical${query}`);
  }
  async createMedicalRecord(data: unknown) { return this.request('/medical', { method: 'POST', body: JSON.stringify(data) }); }
  async updateMedicalRecord(id: string, data: unknown) { return this.request(`/medical/${id}`, { method: 'PUT', body: JSON.stringify(data) }); }
  async deleteMedicalRecord(id: string) { return this.request(`/medical/${id}`, { method: 'DELETE' }); }

  // Scholarship
  async getScholarshipPrograms() { return this.request('/scholarship/programs'); }
  async createScholarshipProgram(data: unknown) { return this.request('/scholarship/programs', { method: 'POST', body: JSON.stringify(data) }); }
  async updateScholarshipProgram(id: string, data: unknown) { return this.request(`/scholarship/programs/${id}`, { method: 'PUT', body: JSON.stringify(data) }); }
  async deleteScholarshipProgram(id: string) { return this.request(`/scholarship/programs/${id}`, { method: 'DELETE' }); }
  async getScholarshipApplications(params?: Record<string, string>) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/scholarship/applications${query}`);
  }
  async createScholarshipApplication(data: unknown) { return this.request('/scholarship/applications', { method: 'POST', body: JSON.stringify(data) }); }
  async updateScholarshipApplication(id: string, data: unknown) { return this.request(`/scholarship/applications/${id}`, { method: 'PUT', body: JSON.stringify(data) }); }
  async deleteScholarshipApplication(id: string) { return this.request(`/scholarship/applications/${id}`, { method: 'DELETE' }); }

  // Hostel
  async getHostelRooms(params?: Record<string, string>) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/hostel/rooms${query}`);
  }
  async createHostelRoom(data: unknown) { return this.request('/hostel/rooms', { method: 'POST', body: JSON.stringify(data) }); }
  async updateHostelRoom(id: string, data: unknown) { return this.request(`/hostel/rooms/${id}`, { method: 'PUT', body: JSON.stringify(data) }); }
  async deleteHostelRoom(id: string) { return this.request(`/hostel/rooms/${id}`, { method: 'DELETE' }); }
  async getHostelResidents(params?: Record<string, string>) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/hostel/residents${query}`);
  }
  async createHostelResident(data: unknown) { return this.request('/hostel/residents', { method: 'POST', body: JSON.stringify(data) }); }
  async updateHostelResident(id: string, data: unknown) { return this.request(`/hostel/residents/${id}`, { method: 'PUT', body: JSON.stringify(data) }); }
  async deleteHostelResident(id: string) { return this.request(`/hostel/residents/${id}`, { method: 'DELETE' }); }

  // Health
  async health() {
    return this.request('/health');
  }
}

export const api = new ApiService();
export default api;
