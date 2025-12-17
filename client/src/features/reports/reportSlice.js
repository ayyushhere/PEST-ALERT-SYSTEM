import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/reports';

// --- HELPER: Get Token from State ---
const getConfig = (thunkAPI) => {
  const token = thunkAPI.getState().auth.user?.token;
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// --- THUNKS ---

// 1. Create New Report (Farmer)
export const createReport = createAsyncThunk(
  'reports/create',
  async (reportData, thunkAPI) => {
    try {
      // reportData is a FormData object here (for images)
      // Note: We don't necessarily need a token for public reporting, 
      // but if you protect it later, pass config.
      const response = await axios.post(API_URL, reportData);
      return response.data;
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// 2. Get All Reports (Admin)
export const getReports = createAsyncThunk(
  'reports/getAll',
  async (_, thunkAPI) => {
    try {
      const config = getConfig(thunkAPI);
      const response = await axios.get(API_URL, config);
      return response.data;
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// 3. Update Status (e.g., Reject)
export const updateReportStatus = createAsyncThunk(
  'reports/updateStatus',
  async ({ id, status }, thunkAPI) => {
    try {
      const config = getConfig(thunkAPI);
      const response = await axios.put(`${API_URL}/${id}`, { status }, config);
      return response.data; // Returns { message, report }
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// 4. Broadcast Alert (Resolve + Broadcast)
export const broadcastAlert = createAsyncThunk(
  'reports/broadcast',
  async (alertData, thunkAPI) => {
    try {
      const config = getConfig(thunkAPI);
      const response = await axios.post(`${API_URL}/broadcast`, alertData, config);
      return response.data;
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// --- SLICE ---
const reportSlice = createSlice({
  name: 'reports',
  initialState: {
    reports: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
  },
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Report
      .addCase(createReport.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createReport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Ideally, we don't add to the list immediately if the user is a farmer (they don't see the dashboard)
        // But if you wanted to show "My Reports", you would push it here.
      })
      .addCase(createReport.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Get Reports
      .addCase(getReports.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getReports.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.reports = action.payload;
      })
      .addCase(getReports.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Update Status (Locally update the item to avoid refetching)
      .addCase(updateReportStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const updatedReport = action.payload.report;
        state.reports = state.reports.map((report) =>
          report._id === updatedReport._id ? updatedReport : report
        );
      })

      // Broadcast Alert
      .addCase(broadcastAlert.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // The backend returns { report, alert }. We update the report status to Resolved.
        const updatedReport = action.payload.report;
        state.reports = state.reports.map((report) =>
          report._id === updatedReport._id ? updatedReport : report
        );
      });
  },
});

export const { reset } = reportSlice.actions;
export default reportSlice.reducer;