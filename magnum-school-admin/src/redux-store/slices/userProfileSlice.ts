import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserProfileState {
  data: any | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UserProfileState = {
  data: null,
  status: 'idle',
  error: null,
};

const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    setUserProfile(state, action: PayloadAction<any>) {
      state.data = action.payload;
      state.status = 'succeeded';
      state.error = null;
    },
    setUserProfileLoading(state) {
      state.status = 'loading';
      state.error = null;
    },
    setUserProfileError(state, action: PayloadAction<string>) {
      state.status = 'failed';
      state.error = action.payload;
    },
    clearUserProfile(state) {
      state.data = null;
      state.status = 'idle';
      state.error = null;
    },
  },
});

export const {
  setUserProfile,
  setUserProfileLoading,
  setUserProfileError,
  clearUserProfile,
} = userProfileSlice.actions;

export default userProfileSlice.reducer;
