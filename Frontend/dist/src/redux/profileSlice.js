import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@src/apis/api";
import API_ENDPOINTS from "@src/apis/endpoints";
import toast from "react-hot-toast";
import { safeParseLocalStorage } from "../utils/storage";

// --- Thunks ---
// 1. Fetch Profile
export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (_, { getState, rejectWithValue }) => {
    try {
    const token = getState().auth.accessToken || localStorage.getItem("accessToken");
    if (!token) return rejectWithValue("No access token");
      const res = await api.get(API_ENDPOINTS.STUDENTS.PROFILE, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("API Response:", res);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch profile");
    }
  }
);

// 2. Update Profile 
export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (payload, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await api.put(API_ENDPOINTS.STUDENTS.PROFILE, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Profile updated");
      return res.data;
    } catch (err) {
      toast.error("Failed to update");
      return rejectWithValue(err.response?.data || "Update failed");
    }
  }
);

// 3. Upload Profile Image
export const uploadProfileImage = createAsyncThunk(
  "profile/uploadProfileImage",
  async (file, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const formData = new FormData();
      formData.append("profile_image", file);

      const res = await api.put(API_ENDPOINTS.STUDENTS.PROFILE, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Profile picture updated");
      return res.data;
    } catch (err) {
      toast.error("Image upload failed");
      return rejectWithValue(err.response?.data || "Upload failed");
    }
  }
);

// --- Slice ---
const profileSlice = createSlice({
  name: "profile",
  initialState: {
    loading: false,
    error: null,
    data: safeParseLocalStorage("profileData")
  },
  reducers: {
    clearProfile: (state) => {
      state.data = null;
      localStorage.removeItem("profileData");
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Profile
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        localStorage.setItem("profileData", JSON.stringify(state.data));
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        localStorage.setItem("profileData", JSON.stringify(action.payload));
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Upload Image
      .addCase(uploadProfileImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadProfileImage.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        localStorage.setItem("profileData", JSON.stringify(action.payload));
      })
      .addCase(uploadProfileImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
