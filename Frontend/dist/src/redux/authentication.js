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

const clearAuthData = () => {
  localStorage.removeItem("authData");
  localStorage.removeItem("studentProfileData");
};

// --- Thunks ---

export const fetchClasses = createAsyncThunk(
  "auth/fetchClasses",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(API_ENDPOINTS.CLASSES);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch classes");
    }
  }
);


export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (userData, { rejectWithValue }) => {
    try {
     
      const response = await api.post(
        API_ENDPOINTS.AUTH.REGISTER,
        payload,
        // { headers: { "Content-Type": "application/json" } }
      );

      return { message: response.data.message, registrationData: payload };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


export const verifyOtp = createAsyncThunk("auth/verifyOtp", async (otpData, { rejectWithValue }) => {
  try {
    const response = await api.post(API_ENDPOINTS.AUTH.VERIFY_OTP, otpData); 
      // headers: { "Content-Type": "application/json" },
    // });
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const resendOtp = createAsyncThunk("auth/resendOtp", async (phone_number, { rejectWithValue }) => {
  try {
    const response = await api.post(API_ENDPOINTS.AUTH.RESEND_OTP, { phone_number }); 
      // headers: { "Content-Type": "application/json" },
    // });
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const createOrder = createAsyncThunk("auth/createOrder", async (_, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState();
    // const { accessToken, userData, registrationData } = auth;

    // if (!accessToken) return rejectWithValue("User not authenticated.");
     const { userData, registrationData } = auth;
    if (!registrationData && !userData) return rejectWithValue("Registration data missing.");

    const studentClass = registrationData?.class_id || userData?.class_id;
    if (!studentClass) return rejectWithValue("Student class missing.");


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

      const { access, refresh, user_type, student_id, is_paid, class_id, student_package_id } = res.data;
      const user = {
        user_type,
        is_paid: !!is_paid,
        student_id: student_id ?? null,
        class_id: class_id ?? null,
        // student_package_id: student_package_id ?? null,
      };
      const authData = saveAuthData({
        accessToken: access,
        refreshToken: refresh,
        user,
      });
     
      return authData;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Login failed" });
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async ({ phone, otp, newPassword, confirmPassword }, { rejectWithValue }) => {
    try {
      let res;

   
      return res.data.message || "Operation successful";
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.response?.data?.detail || err.message || "Forgot password failed"
      );
    }
  }
);



export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { accessToken, refreshToken } = getState().auth;


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
  clearAuthData();
      if (response.data?.message_type === "error") {
        return rejectWithValue(response.data.message);
      }

      return response.data;
    } catch (error) {
      clearAuthData();
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  }
);


const initialState = {
  loading: false,
  error: null,
  success: null,
  registrationData: null,
  otpVerified: false,
  orderData: null,
  // accessToken: initialAuthData?.accessToken || null,
  // refreshToken: initialAuthData?.refreshToken || null,
  // userData: initialAuthData?.user || null,
  accessToken: safeParseLocalStorage("authData")?.accessToken || null,
  refreshToken: safeParseLocalStorage("authData")?.refreshToken || null,
  userData: safeParseLocalStorage("authData")?.user || null,
  classes: [],
classesLoading: false,
classesError: null,

}

// Helper to reset auth state
const resetAuthState = () => ({
  ...initialState,
  accessToken: null,
  refreshToken: null,
  userData: null,
  registrationData: null,
  otpVerified: false,
  orderData: null,
});
const authSlice = createSlice({
  name: "auth",
  initialState,
   reducers: {
    logout: (state) => {
      Object.assign(state, resetAuthState());
      // localStorage.removeItem("authData");
      clearAuthData();
    },
    // updateUserData: (state, action) => {
    //   const updatedUser = action.payload;
    //   state.userData = { ...state.userData, ...updatedUser };
    //   const existingAuthData = JSON.parse(localStorage.getItem("authData")) || {};
    //   localStorage.setItem(
    //     "authData",
    //     JSON.stringify({ ...existingAuthData, user: { ...(existingAuthData.user || {}), ...updatedUser } })
    //   );
    // },
    updateUserData: (state, action) => {
  // if (!state.userData) return; // do nothing if user is logged out

  const updatedUser = action.payload;
  state.userData = { ...state.userData, ...updatedUser };

  // const authData = {
  //   accessToken: state.accessToken,
  //   refreshToken: state.refreshToken,
  //   user: state.userData,
  // };

  // localStorage.setItem("authData", JSON.stringify(authData));
  saveAuthData({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.userData,
      });
},
updateTokens: (state, action) => {
  const { accessToken, refreshToken } = action.payload;
  state.accessToken = accessToken;
  if (refreshToken) state.refreshToken = refreshToken;

  saveAuthData({
    accessToken,
    refreshToken: refreshToken || state.refreshToken,
    user: state.userData,
  });

    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchClasses.pending, (state) => {
  state.classesLoading = true;
  state.classesError = null;
})
.addCase(fetchClasses.fulfilled, (state, action) => {
  state.classesLoading = false;
  state.classes = action.payload;
})
.addCase(fetchClasses.rejected, (state, action) => {
  state.classesLoading = false;
  state.classesError = action.payload;
})

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
          const baseUser = {
            user_type: state.registrationData?.user_type || "student",
            class_id: state.registrationData?.class_id || null,
            first_name: state.registrationData?.first_name || null,
            last_name: state.registrationData?.last_name || null,
            is_paid: false,
          };
          const authData = saveAuthData({ accessToken: tokens.access, refreshToken: tokens.refresh, user: baseUser });

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
        console.log("Clearing auth state and localStorage");
        Object.assign(state, resetAuthState());
        // localStorage.removeItem("authData");
        clearAuthData();
        // toast.success("Logout successful");
      })
      .addCase(logoutUser.rejected, (state, action) => {
        Object.assign(state, resetAuthState());
        // localStorage.removeItem("authData");
         clearAuthData();
        toast.error(action.payload || "Logout failed");
      });
  },
});

export const { logout, updateUserData, updateTokens } = authSlice.actions;
export default authSlice.reducer;
