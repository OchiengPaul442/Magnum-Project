import { configureStore } from '@reduxjs/toolkit';
import sidebarReducer from './slices/sidebarSlice';
import userProfileReducer from './slices/userProfileSlice';

export const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
    userProfile: userProfileReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
