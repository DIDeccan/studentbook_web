import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@src/apis/api";
import API_ENDPOINTS from "@src/apis/endpoints";
import toast from "react-hot-toast";
import { safeParseLocalStorage } from "../utils/storage";
// --- Thunks ---

// Register user
export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, userData, {
        headers: { "Content-Type": "application/json" },
      });
      return { message: response.data.message, registrationData: userData };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Verify OTP
export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (otpData, { rejectWithValue }) => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.VERIFY_OTP, otpData, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data; 
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Resend OTP
export const resendOtp = createAsyncThunk(
  "auth/resendOtp",
  async (email, { rejectWithValue }) => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.RESEND_OTP, { email }, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data; 
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Create Order
export const createOrder = createAsyncThunk(
  "auth/createOrder",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState().auth;
      const token = state.accessToken;
      const userData = state.userData || {};
      const registrationData = state.registrationData;

      if (!token) return rejectWithValue("User not authenticated.");
      if (!registrationData) return rejectWithValue("Registration data missing.");

      const studentClass =
        registrationData?.student_class || userData?.student_class;

      if (!studentClass) {
        return rejectWithValue("Student class missing.");
      }

      const res = await api.post(
        API_ENDPOINTS.PAYMENT.CREATE_ORDER,
        {
          student_class: registrationData.student_class,
          price: 1000,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Order creation failed");
    }
  }
);


export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ phone_number, password }, { rejectWithValue, dispatch }) => {
    try {
      // Login
      const res = await api.post(API_ENDPOINTS.AUTH.LOGIN, { phone_number, password });
      const { access, refresh } = res.data;

      // Fetch profile
      const profileRes = await api.get(API_ENDPOINTS.STUDENTS.PROFILE, {
        headers: { Authorization: `Bearer ${access}` }
      });

      const userData = profileRes.data;

      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("userData", JSON.stringify(userData));

      return { access, refresh, user: userData };
    } catch (err) {
      return rejectWithValue(err.response?.data || "Login failed");
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (payload, { rejectWithValue }) => {
    try {
      const body = payload.otp
        ? {
            user: payload.phone,
            otp: payload.otp,
            new_password: payload.newPassword,
            confirm_new_password: payload.confirmPassword,
          }
        : { user: payload.phone };

      const res = await api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, body);
      return res.data.message || "Operation successful";
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// logout 
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState().auth;
      const accessToken = state.accessToken;
      const refreshToken = state.refreshToken;

      console.log("Attempting logout...");
      console.log("Access Token:", accessToken);
      console.log("Refresh Token:", refreshToken);

      if (accessToken && refreshToken) {
       const response =  await api.post(
          API_ENDPOINTS.AUTH.LOGOUT,
          { refresh: refreshToken },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
         console.log("Logout API response:", response.data);
      }

      return true; 
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  }
);

// --- Slice ---
const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    error: null,
    success: null,
    registrationData: null,
    otpVerified: false,
    accessToken: localStorage.getItem("accessToken") || null,
    refreshToken: localStorage.getItem("refreshToken") || null,
    orderData: null,
    userData: safeParseLocalStorage("userData")
  },
  reducers: {
    logout: (state) => {
      state.registrationData = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.otpVerified = false;
      state.orderData = null;
      state.userData = null;
      localStorage.clear();
    },
  },
  extraReducers: (builder) => {
    builder
      // Signup
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.registrationData = action.payload.registrationData;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Registration failed";
      })

      // OTP
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.otpVerified = true;

        const tokens = action.payload.data || {};
        state.accessToken = tokens.access || null;
        state.refreshToken = tokens.refresh || null;

  if (tokens.access && tokens.refresh) {
    const userData = {
      email: state.registrationData?.email || "",
      role: "student",
    };

    state.userData = userData;   
    localStorage.setItem("accessToken", tokens.access);
    localStorage.setItem("refreshToken", tokens.refresh);
    localStorage.setItem("userData", JSON.stringify(userData));
  }
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "OTP verification failed";
      })

      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orderData = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Order creation failed";
      })

     // Login
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        const tokens = action.payload;
        state.accessToken = tokens.access || null;
        state.refreshToken = tokens.refresh || null;

        const userData = tokens.user || state.registrationData || {};
  state.userData = userData;
        

        if (tokens.access && tokens.refresh) {
          localStorage.setItem("accessToken", tokens.access);
          localStorage.setItem("refreshToken", tokens.refresh);
          localStorage.setItem("userData", JSON.stringify(userData));
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Login failed";
      })

      .addCase(forgotPassword.pending, (state) => {
    state.loading = true;
    state.error = null;
    state.success = null;
  })
  .addCase(forgotPassword.fulfilled, (state, action) => {
    state.loading = false;
    state.success = action.payload;
  })
  .addCase(forgotPassword.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload || "Forgot password failed";
  })

      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.registrationData = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.otpVerified = false;
        state.orderData = null;
        state.userData = null;
        localStorage.clear();
        toast.success("Logout successful");
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.registrationData = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.otpVerified = false;
        state.orderData = null;
        state.userData = null;
        localStorage.clear();
        toast.error(action.payload || "Logout failed");
      });
  },
});

export const { logout, saveTokens } = authSlice.actions;
export default authSlice.reducer;
