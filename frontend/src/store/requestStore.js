import { create } from 'zustand';
import axios from 'axios';
import { useAuthStore } from './authStore';

const api = axios.create({ baseURL: 'https://flowapprove-y2ye.onrender.com/api' });

// Add interceptor to include token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const useRequestStore = create((set, get) => ({
  requests: [],
  dashboardSummary: null,
  notifications: [],
  isLoading: false,

  fetchRequests: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get('/requests');
      set({ requests: res.data.requests, isLoading: false });
    } catch (error) {
      console.error(error);
      set({ isLoading: false });
    }
  },

  createRequest: async (data) => {
    set({ isLoading: true });
    try {
      const res = await api.post('/requests', data);
      set((state) => ({ requests: [...state.requests, res.data.request], isLoading: false }));
      return { success: true };
    } catch (error) {
      console.error(error);
      set({ isLoading: false });
      return { success: false, error: 'Failed to create request' };
    }
  },

  approveRequest: async (id, comment) => {
    try {
      await api.post(`/requests/${id}/approve`, { comment });
      get().fetchRequests();
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Approval failed' };
    }
  },

  rejectRequest: async (id, comment) => {
    try {
      await api.post(`/requests/${id}/reject`, { comment });
      get().fetchRequests();
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Rejection failed' };
    }
  },

  fetchDashboard: async (role) => {
    try {
      const res = await api.get(`/dashboard/${role}`);
      set({ dashboardSummary: res.data.summary });
    } catch (error) {
      console.error(error);
    }
  },

  fetchNotifications: async () => {
    try {
      const res = await api.get('/notifications');
      set({ notifications: res.data.notifications });
    } catch (error) {
      console.error(error);
    }
  },

  markNotificationRead: async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      get().fetchNotifications();
    } catch (error) {
      console.error(error);
    }
  },

  addRealtimeNotification: (notif) => {
    set((state) => ({ notifications: [notif, ...state.notifications] }));
  },

  updateRealtimeRequest: (req) => {
    set((state) => {
      const exists = state.requests.find(r => r._id === req._id);
      if (exists) {
        return { requests: state.requests.map(r => r._id === req._id ? req : r) };
      } else {
        return { requests: [...state.requests, req] };
      }
    });
  }
}));
