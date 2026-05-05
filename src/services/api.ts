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

  // Health
  async health() {
    return this.request('/health');
  }
}

export const api = new ApiService();
export default api;
