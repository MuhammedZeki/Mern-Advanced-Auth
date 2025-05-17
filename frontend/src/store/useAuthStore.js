import { create } from "zustand";
import { axiosInstance } from "../lib/axiosInstance";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  signUp: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/register`,
        data
      );
      if (res.status === 201) {
        set({ user: res.data.user, isAuthenticated: true });
        toast.success("Account created successfully!");
        return true;
      }
    } catch (error) {
      set({ error: error.response?.data?.message || "Error signing up" });
      toast.error(error.response?.data?.message);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
  verifyEmail: async (code) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/verify-email`,
        { code }
      );
      if (res && res.status === 200) {
        set({ user: res.data.user, isAuthenticated: true });
        toast.success("Email verify successfully!");
        return true;
      }
    } catch (error) {
      set({ error: error.response?.data?.message || "Error Verify mail" });
      toast.error(error.response?.data?.message);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
  login: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
        data
      );
      if (res.status === 200) {
        set({ user: res.data.user, isAuthenticated: true, error: null });
        toast.success("Logged in successfully!");
        return true;
      }
    } catch (error) {
      set({ error: error.response?.data?.message || "Error signing up" });
      toast.error(error.response?.data?.message);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/logout`
      );
      if (res.status === 200) {
        set({ user: null, isAuthenticated: false, error: null });
        return true;
      }
    } catch (error) {
      set({ error: error.response?.data?.message || "Error Logput" });
      toast.error(error.response?.data?.message);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
  checkUser: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const res = await axiosInstance.get(
        `${import.meta.env.VITE_BACKEND_URL}/auth/check`
      );
      if (res.status === 200) {
        set({ user: res.data, isAuthenticated: true });
      }
    } catch (error) {
      set({ error: null, isAuthenticated: false, isCheckingAuth: false });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
}));
