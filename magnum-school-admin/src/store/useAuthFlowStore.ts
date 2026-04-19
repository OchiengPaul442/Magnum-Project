import { create } from 'zustand';

interface AuthFlowState {
  resetEmail: string | null;
  setResetEmail: (email: string) => void;
  clearResetEmail: () => void;
}

export const useAuthFlowStore = create<AuthFlowState>((set) => ({
  resetEmail: null,
  setResetEmail: (email) => set({ resetEmail: email }),
  clearResetEmail: () => set({ resetEmail: null }),
}));
