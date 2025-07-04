import { create } from "zustand";

interface Toast {
  id: string;
  title: string;
  description?: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Date.now().toString();
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));

    // Auto remove after duration
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, toast.duration || 5000);
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

export const useToast = () => {
  const { addToast } = useToastStore();

  const toast = {
    success: (title: string, description?: string) =>
      addToast({ title, description, type: "success" }),
    error: (title: string, description?: string) =>
      addToast({ title, description, type: "error" }),
    warning: (title: string, description?: string) =>
      addToast({ title, description, type: "warning" }),
    info: (title: string, description?: string) =>
      addToast({ title, description, type: "info" }),
  };

  return { toast };
};
