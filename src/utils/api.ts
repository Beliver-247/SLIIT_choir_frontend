const API_BASE_URL = 'https://sliit-choir-backend.onrender.com/api';
//const API_BASE_URL = 'http://localhost:5000/api';

export const api = {
  getAuthToken: () => localStorage.getItem('authToken'),
  
  async request(endpoint: string, options: RequestInit = {}) {
    const token = this.getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid, clear storage and redirect to login
          localStorage.removeItem('authToken');
          localStorage.removeItem('member');
          window.location.href = '/';
        }
        return {
          success: false,
          error: responseData.message || `API Error: ${response.statusText}`,
          status: response.status,
        };
      }

      // Handle two response formats:
      // Format 1: { success: true, data: [...] } (used by GET endpoints)
      // Format 2: { message, token, member } (used by auth endpoints)
      
      if (responseData.hasOwnProperty('data')) {
        // Format 1: Already has { success, data } structure
        return {
          success: true,
          data: responseData.data,
          message: responseData.message,
          status: response.status,
        };
      } else {
        // Format 2: Direct response like { token, member, message }
        return {
          success: true,
          data: responseData,
          message: responseData.message,
          status: response.status,
        };
      }
    } catch (error) {
      console.error('API Request Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
        status: 0,
      };
    }
  },

  // Auth endpoints
  auth: {
    register(data: { 
      firstName: string; 
      lastName: string; 
      studentId: string;
      email: string; 
      password: string;
      confirmPassword: string;
    }) {
      return api.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    login(studentId: string, password: string) {
      return api.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ studentId, password }),
      });
    },

    getProfile() {
      return api.request('/auth/profile');
    },
  },

  // Members endpoints
  members: {
    getAll() {
      return api.request('/members');
    },

    getById(id: string) {
      return api.request(`/members/${id}`);
    },

    update(id: string, data: Record<string, any>) {
      return api.request(`/members/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    updateStatus(id: string, status: 'active' | 'inactive' | 'suspended') {
      return api.request(`/members/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
    },

    delete(id: string) {
      return api.request(`/members/${id}`, { method: 'DELETE' });
    },
  },

  // Events endpoints
  events: {
    getAll(filters?: Record<string, any>) {
      const params = new URLSearchParams(filters);
      return api.request(`/events?${params}`);
    },

    getById(id: string) {
      return api.request(`/events/${id}`);
    },

    create(data: Record<string, any>) {
      return api.request('/events', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    update(id: string, data: Record<string, any>) {
      return api.request(`/events/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    delete(id: string) {
      return api.request(`/events/${id}`, { method: 'DELETE' });
    },

    register(id: string) {
      return api.request(`/events/${id}/register`, { method: 'POST' });
    },

    unregister(id: string) {
      return api.request(`/events/${id}/register`, { method: 'DELETE' });
    },
  },

  // Donations endpoints
  donations: {
    getAll(filters?: Record<string, any>) {
      const params = new URLSearchParams(filters);
      return api.request(`/donations?${params}`);
    },

    getById(id: string) {
      return api.request(`/donations/${id}`);
    },

    create(data: Record<string, any>) {
      return api.request('/donations', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    updateStatus(id: string, status: 'pending' | 'completed' | 'failed' | 'refunded') {
      return api.request(`/donations/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
    },

    getStats() {
      return api.request('/donations/stats/summary');
    },

    delete(id: string) {
      return api.request(`/donations/${id}`, { method: 'DELETE' });
    },
  },

  // Practice Schedules endpoints
  schedules: {
    getAll(filters?: Record<string, any>) {
      const params = new URLSearchParams(filters);
      return api.request(`/schedules?${params}`);
    },

    getById(id: string) {
      return api.request(`/schedules/${id}`);
    },

    create(data: Record<string, any>) {
      return api.request('/schedules', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    update(id: string, data: Record<string, any>) {
      return api.request(`/schedules/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    delete(id: string) {
      return api.request(`/schedules/${id}`, { method: 'DELETE' });
    },

    markAttendance(id: string, memberId: string, status: 'present' | 'absent' | 'excused') {
      return api.request(`/schedules/${id}/attendance`, {
        method: 'POST',
        body: JSON.stringify({ memberId, status }),
      });
    },

    getAttendance(id: string) {
      return api.request(`/schedules/${id}/attendance`);
    },
  },

  // Attendance endpoints
  attendance: {
    markAttendance(data: {
      memberId: string;
      eventId?: string;
      scheduleId?: string;
      status: 'present' | 'absent' | 'excused' | 'late';
      comments?: string;
    }) {
      return api.request('/attendance/mark', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    getAll(filters?: Record<string, any>) {
      const params = new URLSearchParams(filters);
      return api.request(`/attendance/list?${params}`);
    },

    getEventAttendance(eventId: string) {
      return api.request(`/attendance/event/${eventId}`);
    },

    getScheduleAttendance(scheduleId: string) {
      return api.request(`/attendance/schedule/${scheduleId}`);
    },

    updateAttendance(id: string, data: { status?: string; comments?: string }) {
      return api.request(`/attendance/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    deleteAttendance(id: string) {
      return api.request(`/attendance/${id}`, { method: 'DELETE' });
    },

    exportToExcel(filters?: Record<string, any>) {
      const params = new URLSearchParams(filters);
      return `${API_BASE_URL}/attendance/export/excel?${params}&token=${api.getAuthToken()}`;
    },

    getAnalytics(filters?: Record<string, any>) {
      const params = new URLSearchParams(filters);
      return api.request(`/attendance/analytics?${params}`);
    },

    getMemberHistory(memberId: string, filters?: Record<string, any>) {
      const params = new URLSearchParams(filters);
      return api.request(`/attendance/member/${memberId}?${params}`);
    },
  },

  // Merchandise endpoints
  merchandise: {
    getAll(filters?: Record<string, any>) {
      const params = new URLSearchParams(filters);
      return api.request(`/merchandise?${params}`);
    },

    getById(id: string) {
      return api.request(`/merchandise/${id}`);
    },

    create(data: Record<string, any>) {
      return api.request('/merchandise', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    update(id: string, data: Record<string, any>) {
      return api.request(`/merchandise/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    delete(id: string) {
      return api.request(`/merchandise/${id}`, { method: 'DELETE' });
    },
  },

  // Orders endpoints
  orders: {
    create(data: {
      items: Array<{
        merchandiseId: string;
        size: string;
        quantity: number;
      }>;
      receipt: string;
    }) {
      return api.request('/orders', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    createWithFile(formData: FormData) {
      const token = api.getAuthToken();
      const headers: Record<string, string> = {};

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      return fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers,
        body: formData,
      }).then(async (response) => {
        const responseData = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('member');
            window.location.href = '/';
          }
          return {
            success: false,
            error: responseData.message || `API Error: ${response.statusText}`,
            status: response.status,
          };
        }

        return {
          success: true,
          data: responseData.data || responseData,
          message: responseData.message,
          status: response.status,
        };
      }).catch((error) => {
        console.error('API Request Error:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Network error',
          status: 0,
        };
      });
    },

    getAll(filters?: Record<string, any>) {
      const params = new URLSearchParams(filters);
      return api.request(`/orders?${params}`);
    },

    getById(id: string) {
      return api.request(`/orders/${id}`);
    },

    getMyOrders() {
      return api.request('/orders/my-orders');
    },

    confirm(id: string) {
      return api.request(`/orders/${id}/confirm`, {
        method: 'PUT',
      });
    },

    decline(id: string, reason: string) {
      return api.request(`/orders/${id}/decline`, {
        method: 'PUT',
        body: JSON.stringify({ reason }),
      });
    },

    delete(id: string) {
      return api.request(`/orders/${id}`, { method: 'DELETE' });
    },

    getStats() {
      return api.request('/orders/stats/summary');
    },
  },
};
