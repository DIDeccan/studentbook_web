import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@src/apis/api";
import API_ENDPOINTS from "@src/apis/endpoints";

export const fetchClasses = createAsyncThunk(
  "classes/fetchClasses",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(API_ENDPOINTS.CLASS_DEMO_VIDEO);
      return res.data.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const classSlice = createSlice({

  extraReducers: (builder) => {
    builder
      .addCase(fetchClasses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default classSlice.reducer;
