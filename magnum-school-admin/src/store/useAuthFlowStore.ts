import { create } from 'zustand';

interface AuthFlowState {
  pendingEmail: string | null;
  resetEmail: string | null;
  setPendingEmail: (email: string) => void;
  clearPendingEmail: () => void;
  setResetEmail: (email: string) => void;
  clearResetEmail: () => void;
}

export const useAuthFlowStore = create<AuthFlowState>((set) => ({
  pendingEmail: null,
  resetEmail: null,
  setPendingEmail: (email) => set({ pendingEmail: email }),
  clearPendingEmail: () => set({ pendingEmail: null }),
  setResetEmail: (email) => set({ resetEmail: email }),
  clearResetEmail: () => set({ resetEmail: null }),
}));
