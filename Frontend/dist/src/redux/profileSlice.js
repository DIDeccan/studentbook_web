import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@src/apis/api";
import API_ENDPOINTS from "@src/apis/endpoints";
import toast from "react-hot-toast";
import { safeParseLocalStorage } from "../utils/storage";

const resolveIds = (studentId, classId, state) => {
  const profile = state.studentProfile?.data;
  const resolved = {
    studentId: studentId || profile?.student_id,
    classId: classId || profile?.course_id,
  };
  console.log("resolveIds:", { studentId, classId, resolved });
  return resolved;
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

      const { studentId: sid, classId: cid } = resolveIds(studentId, classId, getState());
      if (!sid || !cid)
        return rejectWithValue("Missing studentId or classId (course_id)");

      const res = await api.get(API_ENDPOINTS.STUDENTS.PROFILE(sid, cid), {
        headers: { Authorization: `Bearer ${token}` },
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

      const { studentId: sid, classId: cid } = resolveIds(studentId, classId, getState());
      if (!sid || !cid)
        return rejectWithValue("Missing studentId or classId (course_id)");

      const res = await api.put(API_ENDPOINTS.STUDENTS.PROFILE(sid, cid), payload, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });

      toast.success("Profile updated successfully");
      return res.data;
    } catch (err) {
      toast.error("Failed to update profile");
      return rejectWithValue(err.response?.data || "Update failed");
    }
  }
);

export const uploadStudentProfileImage = createAsyncThunk(
  "studentProfile/uploadImage",
  async ({ studentId, classId, file }, { getState, rejectWithValue }) => {
    try {
      const token =
        getState().auth?.accessToken || localStorage.getItem("accessToken");
      if (!token) return rejectWithValue("No auth token found");

      const { studentId: sid, classId: cid } = resolveIds(studentId, classId, getState());
      if (!sid || !cid)
        return rejectWithValue("Missing studentId or classId (course_id)");

      const formData = new FormData();
      formData.append("profile_image", file);

      const res = await api.put(API_ENDPOINTS.STUDENTS.PROFILE(sid, cid), formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      return res.data;
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Upload failed";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);
export const removeStudentProfileImage = createAsyncThunk(
  "studentProfile/removeImage",
  async ({ studentId, classId }, { getState, rejectWithValue }) => {
    try {
      const token =
        getState().auth?.accessToken || localStorage.getItem("accessToken");
      if (!token) return rejectWithValue("No auth token found");

      if (!studentId || !classId)
        return rejectWithValue("Missing studentId or classId");

      const res = await api.put(
        API_ENDPOINTS.STUDENTS.PROFILE(studentId, classId),
        { profile_image: null },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );

      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Remove failed";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const sendPhoneOtp = createAsyncThunk(
  "studentProfile/sendPhoneOtp",
  async ({ studentId, classId, newPhone }, { getState, rejectWithValue }) => {
    try {
      const token =
        getState().auth?.accessToken || localStorage.getItem("accessToken");
      if (!token) return rejectWithValue("No auth token found");

      const res = await api.put(
        API_ENDPOINTS.STUDENTS.PROFILE(studentId, classId),
        { phone_number: newPhone },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("OTP sent to your phone");
      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Failed to send OTP";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

//Resend OTP
export const resendOtp = createAsyncThunk(
  "auth/resendOtp",
  async (newPhone, { rejectWithValue }) => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.RESEND_OTP, { phone_number: newPhone }, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


export const verifyPhoneOtp = createAsyncThunk(
  "studentProfile/verifyPhoneOtp",
  async ({ studentId, newPhone, otp, classId }, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.post(API_ENDPOINTS.AUTH.ACTIVATE_OTP, {
        student_id: studentId,
        new_phone_number: newPhone,
        otp: otp,
      });

      // Update profile locally after verification
      dispatch(updateStudentProfile({ studentId, classId, payload: { phone_number: newPhone } }));

      toast.success("Phone number verified successfully");
      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || err.message || "OTP verification failed";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);




// ------------------- Slice -------------------
const profileSlice = createSlice({
  name: "studentProfile",
  initialState: {
    data: safeParseLocalStorage("studentProfileData") || null,
    loading: false,
    error: null,
    uploading: false,
    otpLoading: false
  },
  reducers: {
    clearStudentProfile: (state) => {
      state.data = null;
      localStorage.removeItem("studentProfileData");
      console.log("clearStudentProfile called");
    },
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
        localStorage.setItem("studentProfileData", JSON.stringify(state.data));
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
        localStorage.setItem("studentProfileData", JSON.stringify(state.data));
      })
      .addCase(updateStudentProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Upload Image
      .addCase(uploadStudentProfileImage.pending, (state, action) => {
        state.uploading = true;
        state.error = null;
        const file = action.meta.arg?.file;
        if (file && state.data) {
          state.data.profile_image = URL.createObjectURL(file);
        }
      })
      .addCase(uploadStudentProfileImage.fulfilled, (state, action) => {
        state.uploading = false;
        const newData = action.payload?.data || action.payload;

        if (state.data) {
          state.data = { ...state.data, ...newData };

          if (newData?.profile_image) {
            state.data.profile_image = `${newData.profile_image}?t=${new Date().getTime()}`;
          }
        }

        localStorage.setItem("studentProfileData", JSON.stringify(state.data));
      })

      .addCase(uploadStudentProfileImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || "Upload failed";
        console.error("uploadStudentProfileImage rejected:", state.error);
      })

      .addCase(removeStudentProfileImage.pending, (state) => {
        state.uploading = true;
        state.error = null;
      })
      .addCase(removeStudentProfileImage.fulfilled, (state, action) => {
        state.uploading = false;
        if (state.data) state.data.profile_image = null;
        localStorage.setItem("studentProfileData", JSON.stringify(state.data));
        toast.success("Profile image removed");
      })
      .addCase(removeStudentProfileImage.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload || action.error.message || "Remove failed";
      })

      .addCase(verifyPhoneOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPhoneOtp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(verifyPhoneOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(resendOtp.pending, (state) => { state.otpLoading = true; state.error = null; })
      .addCase(resendOtp.fulfilled, (state) => { state.otpLoading = false; })
      .addCase(resendOtp.rejected, (state, action) => { state.otpLoading = false; state.error = action.payload; })

  },
});

export const { clearStudentProfile } = profileSlice.actions;
export default profileSlice.reducer;
