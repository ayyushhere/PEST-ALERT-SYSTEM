import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
// import reportReducer from '../features/reports/reportSlice'; // Uncomment when you create this

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // reports: reportReducer,
  },
});