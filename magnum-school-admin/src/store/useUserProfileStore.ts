import { create } from 'zustand';
import { getUserProfile } from '@/services/auth/service';
import { getErrorMessage } from '@/lib/api/swrConfig';
import { isAxiosError } from '@/lib/api/enhancedApiClient';
import { showErrorToast } from '@/lib/toast';

export interface UserProfileState {
  data: any | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  setUserProfile: (data: any) => void;
  setUserProfileLoading: () => void;
  setUserProfileError: (message: string) => void;
  clearUserProfile: () => void;
  fetchUserProfile: () => Promise<void>;
}

export const useUserProfileStore = create<UserProfileState>((set) => ({
  data: null,
  status: 'idle',
  error: null,
  setUserProfile: (data) => set({ data, status: 'succeeded', error: null }),
  setUserProfileLoading: () => set({ status: 'loading', error: null }),
  setUserProfileError: (message) => set({ status: 'failed', error: message }),
  clearUserProfile: () => set({ data: null, status: 'idle', error: null }),
  fetchUserProfile: async () => {
    set({ status: 'loading', error: null });
    try {
      const data = await getUserProfile();
      set({ data, status: 'succeeded', error: null });
    } catch (error) {
      const message = getErrorMessage(error);
      const isUnauthorized =
        isAxiosError(error) && error.response?.status === 401;

      if (!isUnauthorized) {
        showErrorToast(message, 'Unable to load user profile.');
      }
      set({ status: 'failed', error: message });
    }
  },
}));
