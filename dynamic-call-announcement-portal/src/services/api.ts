import { Category, CallAnnouncement } from '../../types';

const API_BASE_URL = 'http://localhost:5000/api';

// Categories API
export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const response = await fetch(`${API_BASE_URL}/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  },

  getById: async (id: string): Promise<Category> => {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`);
    if (!response.ok) throw new Error('Failed to fetch category');
    return response.json();
  },

  create: async (category: Category): Promise<Category> => {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category),
    });
    if (!response.ok) throw new Error('Failed to create category');
    return response.json();
  },

  update: async (id: string, category: Category): Promise<Category> => {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category),
    });
    if (!response.ok) throw new Error('Failed to update category');
    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete category');
  },
};

// Call Announcements API
export const callsApi = {
  getAll: async (): Promise<CallAnnouncement[]> => {
    const response = await fetch(`${API_BASE_URL}/calls`);
    if (!response.ok) throw new Error('Failed to fetch calls');
    return response.json();
  },

  getById: async (id: string): Promise<CallAnnouncement> => {
    const response = await fetch(`${API_BASE_URL}/calls/${id}`);
    if (!response.ok) throw new Error('Failed to fetch call');
    return response.json();
  },

    create: async (call: CallAnnouncement, file?: File): Promise<CallAnnouncement> => {
    const formData = new FormData();
    formData.append('data', JSON.stringify(call));
    
    if (file) {
      formData.append('attachment', file);
    }
    
    const response = await fetch(`${API_BASE_URL}/calls`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      let errorMessage = 'Failed to create call';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }
    
    return response.json();
  },

  update: async (id: string, call: Partial<CallAnnouncement>, file?: File): Promise<CallAnnouncement> => {
    const formData = new FormData();
    formData.append('data', JSON.stringify(call));
    
    if (file) {
      formData.append('attachment', file);
    }
    
    const response = await fetch(`${API_BASE_URL}/calls/${id}`, {
      method: 'PUT',
      body: formData,
    });
    
    if (!response.ok) {
      let errorMessage = 'Failed to update call';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }
    
    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/calls/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete call');
  },
};
