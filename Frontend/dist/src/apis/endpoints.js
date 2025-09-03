// Base API URL from .env
export const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const API_ENDPOINTS = {
  CLASSES: `${BASE_URL}/class-list`,
  CLASS_DEMO_VIDEO: `${BASE_URL}/class-list-demo-vedio`,

  AUTH: {
    LOGIN: `${BASE_URL}/login`,
    REGISTER: `${BASE_URL}/student-register`,
    VERIFY_OTP: `${BASE_URL}/student-activation`,
    LOGOUT: `${BASE_URL}/logout`,
    ACTIVATE_OTP: `${BASE_URL}/verify-otp`,      
    RESEND_OTP: `${BASE_URL}/resend_otp`,
    FORGOT_PASSWORD: `${BASE_URL}/user-forgot-password`,
    CHANGE_PASSWORD: `${BASE_URL}/user-change-password`
  },

  STUDENTS: {
    LIST: `${BASE_URL}/student-list`,
    DETAILS: (id) => `${BASE_URL}/student-detail/${id}`,
    PROFILE: (studentId, classId) => `${BASE_URL}/student-profile/${studentId}/${classId}/`
  },
  PAYMENT: {
    CREATE_ORDER: `${BASE_URL}/payment-create-order`,
    VERIFY: `${BASE_URL}/verify-payment`
  }
};

export default API_ENDPOINTS;
