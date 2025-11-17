const API_BASE_URL = 'http://localhost:5000/api';

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

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid, clear storage and redirect to login
        localStorage.removeItem('authToken');
        localStorage.removeItem('member');
        window.location.href = '/';
      }
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  },

  // Auth endpoints
  auth: {
    register(data: { firstName: string; lastName: string; email: string; password: string }) {
      return api.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    login(email: string, password: string) {
      return api.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
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
};
