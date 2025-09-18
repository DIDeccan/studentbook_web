// src/redux/contentSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@src/apis/api"; // your axios instance
import API_ENDPOINTS from "@src/apis/endpoints"; 
import toast from "react-hot-toast";

// Async thunk for fetching content data
export const fetchContentData = createAsyncThunk(
  "content/fetchContentData",
  async ({ studentId, classId }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        API_ENDPOINTS.COURSE_MANAGEMENT.MAIN_CONTENT(studentId, classId)
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch content data"
      );
    }
  }
);

const contentSlice = createSlice({
  name: "content",
  initialState: {
    loading: false,
    error: null,
    data: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContentData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContentData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data; // only store "data"
      })
      .addCase(fetchContentData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

export default contentSlice.reducer;
