import { AppDispatch } from '../store';
import {
  setUserProfile,
  setUserProfileLoading,
  setUserProfileError,
} from './userProfileSlice';
import { getUserProfile } from '@/app/server/auth/service';

export const fetchUserProfile = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(setUserProfileLoading());
    const data = await getUserProfile();
    dispatch(setUserProfile(data));
  } catch (error: any) {
    dispatch(
      setUserProfileError(error?.message || 'Failed to fetch user profile'),
    );
  }
};
