const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

function getToken(): string | null {
  return localStorage.getItem('auth_token');
}

function setToken(token: string) {
  localStorage.setItem('auth_token', token);
}

function removeToken() {
  localStorage.removeItem('auth_token');
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    removeToken();
    window.location.href = '/auth';
    throw new Error('Unauthorized');
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Terjadi kesalahan');
  }

  return data as T;
}

// Auth API
export const authApi = {
  register: (email: string, password: string, full_name?: string) =>
    apiRequest<{ user: any; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, full_name }),
    }).then((data) => {
      setToken(data.token);
      return data;
    }),

  login: (email: string, password: string) =>
    apiRequest<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }).then((data) => {
      setToken(data.token);
      return data;
    }),

  getMe: () => apiRequest<{ user: any }>('/auth/me'),

  updateProfile: (full_name: string) =>
    apiRequest<{ user: any }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify({ full_name }),
    }),

  logout: () => {
    removeToken();
  },

  isAuthenticated: () => !!getToken(),
};

// CV API
export const cvApi = {
  getAll: () => apiRequest<{ cvs: any[] }>('/cv'),

  getById: (id: string) => apiRequest<{ cv: any }>(`/cv/${id}`),

  create: (data: { title?: string; cv_data?: any; cv_settings?: any }) =>
    apiRequest<{ cv: any }>('/cv', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: { title?: string; cv_data?: any; cv_settings?: any; is_primary?: boolean }) =>
    apiRequest<{ cv: any }>(`/cv/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest<{ success: boolean }>(`/cv/${id}`, {
      method: 'DELETE',
    }),

  duplicate: (id: string) =>
    apiRequest<{ cv: any }>(`/cv/${id}/duplicate`, {
      method: 'POST',
    }),

  rename: (id: string, title: string) =>
    apiRequest<{ cv: any }>(`/cv/${id}/rename`, {
      method: 'PATCH',
      body: JSON.stringify({ title }),
    }),

  setPrimary: (id: string) =>
    apiRequest<{ cv: any }>(`/cv/${id}/primary`, {
      method: 'PATCH',
    }),
};

// Admin API
export const adminApi = {
  // Stats
  getStats: () => apiRequest<{
    totalUsers: number;
    totalCvs: number;
    recentUsers: number;
    recentCvs: number;
    totalAdmins: number;
    activeTemplates: number;
  }>('/admin/stats'),

  // User management
  getUsers: () => apiRequest<{ users: any[] }>('/admin/users'),
  getUser: (id: string) => apiRequest<{ user: any }>(`/admin/users/${id}`),
  createUser: (data: { email: string; password: string; full_name?: string; role?: string }) =>
    apiRequest<{ user: any }>('/admin/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateUser: (id: string, data: { full_name?: string; email?: string; role?: string; password?: string }) =>
    apiRequest<{ user: any }>(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  updateUserRole: (id: string, role: string) =>
    apiRequest<{ user: any }>(`/admin/users/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    }),
  deleteUser: (id: string) =>
    apiRequest<{ message: string }>(`/admin/users/${id}`, {
      method: 'DELETE',
    }),

  // CV management
  getCvs: () => apiRequest<{ cvs: any[] }>('/admin/cvs'),
  deleteCv: (id: string) =>
    apiRequest<{ message: string }>(`/admin/cvs/${id}`, {
      method: 'DELETE',
    }),

  // Template management
  getTemplates: () => apiRequest<{ templates: any[] }>('/admin/templates'),
  createTemplate: (data: {
    name: string; slug: string; description?: string;
    category?: string; is_active?: boolean; sort_order?: number;
  }) =>
    apiRequest<{ template: any }>('/admin/templates', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateTemplate: (id: string, data: {
    name?: string; slug?: string; description?: string;
    category?: string; is_active?: boolean; sort_order?: number;
  }) =>
    apiRequest<{ template: any }>(`/admin/templates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteTemplate: (id: string) =>
    apiRequest<{ message: string }>(`/admin/templates/${id}`, {
      method: 'DELETE',
    }),
  toggleTemplate: (id: string) =>
    apiRequest<{ template: any }>(`/admin/templates/${id}/toggle`, {
      method: 'PATCH',
    }),
};

export { getToken, setToken, removeToken };