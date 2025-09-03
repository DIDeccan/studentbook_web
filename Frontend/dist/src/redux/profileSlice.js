import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@src/apis/api";
import API_ENDPOINTS from "@src/apis/endpoints";
import toast from "react-hot-toast";
import { safeParseLocalStorage } from "../utils/storage";

const resolveIds = (studentId, classId, state) => {
  const profile = state.studentProfile?.data;
  return {
    studentId: studentId || profile?.student_id,
    classId: classId || profile?.course_id 
  };
};

// ------------------- Thunks -------------------

// Fetch Student Profile
export const fetchStudentProfile = createAsyncThunk(
  "studentProfile/fetch",
  async ({ studentId, classId }, { getState, rejectWithValue }) => {
    try {
      const token =
        getState().auth?.accessToken || localStorage.getItem("accessToken");
      if (!token) return rejectWithValue("No auth token found");

      const { studentId: sid, classId: cid } = resolveIds(
        studentId,
        classId,
        getState()
      );
      if (!sid || !cid)
        return rejectWithValue("Missing studentId or classId (course_id)");


      const res = await api.get(API_ENDPOINTS.STUDENTS.PROFILE(sid, cid), {
        headers: { Authorization: `Bearer ${token}` }
      });

      return res.data; 
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Update Student Profile
export const updateStudentProfile = createAsyncThunk(
  "studentProfile/update",
  async ({ studentId, classId, payload }, { getState, rejectWithValue }) => {
    try {
      const token =
        getState().auth?.accessToken || localStorage.getItem("accessToken");
      if (!token) return rejectWithValue("No auth token found");

      const { studentId: sid, classId: cid } = resolveIds(
        studentId,
        classId,
        getState()
      );
      if (!sid || !cid)
        return rejectWithValue("Missing studentId or classId (course_id)");

      const res = await api.put(
        API_ENDPOINTS.STUDENTS.PROFILE(sid, cid),
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      toast.success("Profile updated successfully");
      return res.data;
    } catch (err) {
      toast.error("Failed to update profile");
      return rejectWithValue(err.response?.data || "Update failed");
    }
  }
);

// Upload Student Profile Image
export const uploadStudentProfileImage = createAsyncThunk(
  "studentProfile/uploadImage",
  async ({ studentId, classId, file }, { getState, rejectWithValue }) => {
    try {
      const token =
        getState().auth?.accessToken || localStorage.getItem("accessToken");
      if (!token) return rejectWithValue("No auth token found");

      const { studentId: sid, classId: cid } = resolveIds(
        studentId,
        classId,
        getState()
      );
      if (!sid || !cid)
        return rejectWithValue("Missing studentId or classId (course_id)");

      const formData = new FormData();
      formData.append("profile_image", file);

      const res = await api.put(
        API_ENDPOINTS.STUDENTS.PROFILE(sid, cid),
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      toast.success("Profile picture updated");
      return res.data;
    } catch (err) {
      toast.error("Image upload failed");
      return rejectWithValue(err.response?.data || "Upload failed");
    }
  }
);

// ------------------- Slice -------------------
const profileSlice = createSlice({
  name: "studentProfile",
  initialState: {
    data: safeParseLocalStorage("studentProfileData") || null,
    loading: false,
    error: null
  },
  reducers: {
    clearStudentProfile: (state) => {
      state.data = null;
      localStorage.removeItem("studentProfileData");
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchStudentProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
    .addCase(fetchStudentProfile.fulfilled, (state, action) => {

  state.loading = false;
  state.data = action.payload.data; 

  localStorage.setItem(
    "studentProfileData",
    JSON.stringify(state.data)
  );

})

      .addCase(fetchStudentProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateStudentProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStudentProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload?.data || action.payload;
        localStorage.setItem(
          "studentProfileData",
          JSON.stringify(state.data)
        );
      })
      .addCase(updateStudentProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Upload Image
      .addCase(uploadStudentProfileImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadStudentProfileImage.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload?.data || action.payload;
        localStorage.setItem(
          "studentProfileData",
          JSON.stringify(state.data)
        );
      })
      .addCase(uploadStudentProfileImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearStudentProfile } = profileSlice.actions;
export default profileSlice.reducer;
