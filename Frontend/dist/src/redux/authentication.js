import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@src/apis/api";
import API_ENDPOINTS from "@src/apis/endpoints";
import toast from "react-hot-toast";
import { safeParseLocalStorage } from "../utils/storage";

const saveAuthData = ({ accessToken, refreshToken, user }) => {
  const authData = { accessToken, refreshToken, user };
  localStorage.setItem("authData", JSON.stringify(authData));
  return authData;
};

// --- Thunks ---
export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (userData, { rejectWithValue }) => {
    try {
      const payload = {
        email: userData.email,
        first_name: userData.firstName,
        last_name: userData.lastName,
        phone_number: userData.phone,
        student_class: userData.classLevel,
        user_type: "student",
        password: userData.password,
        confirm_password: userData.confirmPassword,
      };
      const response = await api.post(
        API_ENDPOINTS.AUTH.REGISTER,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      return { message: response.data.message, registrationData: payload };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


export const verifyOtp = createAsyncThunk("auth/verifyOtp", async (otpData, { rejectWithValue }) => {
  try {
    const response = await api.post(API_ENDPOINTS.AUTH.VERIFY_OTP, otpData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const resendOtp = createAsyncThunk("auth/resendOtp", async (phone_number, { rejectWithValue }) => {
  try {
    const response = await api.post(API_ENDPOINTS.AUTH.RESEND_OTP, { phone_number }, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const createOrder = createAsyncThunk("auth/createOrder", async (_, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState();
    const { accessToken, userData, registrationData } = auth;

    if (!accessToken) return rejectWithValue("User not authenticated.");
    if (!registrationData) return rejectWithValue("Registration data missing.");

    const studentClass = registrationData?.student_class || userData?.student_class;
    if (!studentClass) return rejectWithValue("Student class missing.");

    const res = await api.post(
      API_ENDPOINTS.PAYMENT.CREATE_ORDER,
      { student_class: studentClass, price: 1000 },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || "Order creation failed");
    
  }
});

// LOGIN
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ phone_number, password }, { rejectWithValue }) => {
    try {

      const res = await api.post(API_ENDPOINTS.AUTH.LOGIN, { phone_number, password });
      const { access, refresh, user_type, student_id, is_paid } = res.data;

      const userData = { accessToken: access, refreshToken: refresh, user_type, student_id, is_paid };
      localStorage.setItem("userData", JSON.stringify(userData));

      return userData;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Login failed" });
    }
  }
);


export const forgotPassword = createAsyncThunk("auth/forgotPassword", async (payload, { rejectWithValue }) => {
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
});

export const logoutUser = createAsyncThunk("auth/logoutUser", async (_, { getState, rejectWithValue }) => {
  try {
    const { accessToken, refreshToken } = getState().auth;

    if (accessToken && refreshToken) {
      const response = await api.post(
        API_ENDPOINTS.AUTH.LOGOUT,
        { refresh: refreshToken },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    }

    localStorage.removeItem("authData");
    return true;
  } catch (error) {
    localStorage.removeItem("authData");
    return rejectWithValue(error.response?.data?.message || "Logout failed");
  }
});

// --- Slice ---
const initialAuthData = safeParseLocalStorage("authData");

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    error: null,
    success: null,
    registrationData: null,
    otpVerified: false,
    orderData: null,
    accessToken: initialAuthData?.accessToken || null,
    refreshToken: initialAuthData?.refreshToken || null,
    userData: initialAuthData?.user || null,
  },
  reducers: {
    logout: (state) => {
      state.registrationData = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.otpVerified = false;
      state.orderData = null;
      state.userData = null;
      Object.assign(state, initialState, { accessToken: null, refreshToken: null, userData: null });
      localStorage.removeItem("authData");
    },
     updateUserData: (state, action) => {
    const updatedUser = action.payload;
    state.userData = { ...state.userData, ...updatedUser };
    const existingAuthData = JSON.parse(localStorage.getItem("authData")) || {};
    localStorage.setItem(
      "authData",
      JSON.stringify({ ...existingAuthData, user: { ...existingAuthData.user, ...updatedUser } })
    );
  },
  },
  extraReducers: (builder) => {
    builder
      // Signup
      .addCase(signupUser.pending, (state) => { state.loading = true; state.error = null; state.success = null })
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
      .addCase(verifyOtp.pending, (state) => { state.loading = true; state.error = null })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.otpVerified = true;

        const tokens = action.payload.data || {};
        if (tokens.access && tokens.refresh) {
          const user = state.registrationData || { role: "student" };
          const authData = saveAuthData({ accessToken: tokens.access, refreshToken: tokens.refresh, user });

          state.accessToken = authData.accessToken;
          state.refreshToken = authData.refreshToken;
          state.userData = authData.user;
        }
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "OTP verification failed";
      })

      // Create Order  (was missing before)
      .addCase(createOrder.pending, (state) => { state.loading = true; state.error = null })
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
        const { accessToken, refreshToken, user } = action.payload;
        const authData = saveAuthData({ accessToken, refreshToken, user });
        state.accessToken = authData.accessToken;
        state.refreshToken = authData.refreshToken;
        state.userData = authData.user;
        toast.success("Login successful!");
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Login failed";
        toast.error(state.error);
      })

      // Forgot password
      .addCase(forgotPassword.pending, (state) => { state.loading = true; state.error = null; state.success = null })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Forgot password failed";
      })

      // Logout
      .addCase(logoutUser.pending, (state) => { state.loading = true; state.error = null })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.registrationData = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.otpVerified = false;
        state.orderData = null;
        state.userData = null;
        localStorage.removeItem("authData");
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
        localStorage.removeItem("authData");
        toast.error(action.payload || "Logout failed");
      });
  },
});

export const { logout, updateUserData } = authSlice.actions;
export default authSlice.reducer;
