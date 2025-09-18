// import axios from "axios";

// //  Get base URL from .env (must start with VITE_ for Vite)
// export const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// console.log("API Base URL:", BASE_URL);

// const api = axios.create({
//   baseURL: BASE_URL
// });

// // Attach access token
// api.interceptors.request.use(
//   (config) => {
//     const authData = JSON.parse(localStorage.getItem("authData"));
//     if (authData?.accessToken) {
//       config.headers.Authorization = `Bearer ${authData.accessToken}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Refresh token logic
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       const authData = JSON.parse(localStorage.getItem("authData"));
//       const refreshToken = authData?.refreshToken;

//       if (!refreshToken) {
//         localStorage.removeItem("authData");
//         return Promise.reject(error);
//       }

//       try {
//         const res = await axios.post(API_ENDPOINTS.AUTH.REFRESH, { refresh: refreshToken });
//         const newAccess = res.data.access;

//         // update local storage
//         const newAuthData = { ...authData, accessToken: newAccess };
//         localStorage.setItem("authData", JSON.stringify(newAuthData));

//         // retry failed request with new token
//         originalRequest.headers.Authorization = `Bearer ${newAccess}`;
//         return api(originalRequest);
//       } catch (refreshErr) {
//         localStorage.removeItem("authData");
//         return Promise.reject(refreshErr);
//       }
//     }
//     return Promise.reject(error);
//   }
// );


// export default api;
// import axios from "axios";
// import API_ENDPOINTS from "@src/apis/endpoints";
// import { store } from '../redux/store'
// import { updateTokens, logout } from "../redux/authentication";

// // Base URL from env
// export const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// const api = axios.create({
//   baseURL: BASE_URL,
// });

// // Attach token before request
// api.interceptors.request.use((config) => {
//   const authData = JSON.parse(localStorage.getItem("authData"));
//   if (authData?.accessToken) {
//     config.headers.Authorization = `Bearer ${authData.accessToken}`;
//   }
//   return config;
// });

// // Response interceptor for refresh
// let isRefreshing = false;
// let failedQueue = [];

// const processQueue = (error, token = null) => {
//   failedQueue.forEach((prom) => {
//     if (error) {
//       prom.reject(error);
//     } else {
//       prom.resolve(token);
//     }
//   });
//   failedQueue = [];
// };

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       const authData = JSON.parse(localStorage.getItem("authData"));
//       if (!authData?.refreshToken) {
//         // No refresh token at all → log out
//         store.dispatch(logout());
//         return Promise.reject(error);
//       }

//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         })
//           .then((token) => {
//             originalRequest.headers.Authorization = `Bearer ${token}`;
//             return api(originalRequest);
//           })
//           .catch((err) => Promise.reject(err));
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;

//       try {
//         const res = await axios.post(API_ENDPOINTS.AUTH.REFRESH, {
//           refresh: authData.refreshToken,
//         });

//         const newAccess = res.data.access;
//         const newAuthData = { ...authData, accessToken: newAccess };
//         localStorage.setItem("authData", JSON.stringify(newAuthData));

//         // Update Redux
//        store.dispatch(updateTokens({ accessToken: newAccess }));

//         processQueue(null, newAccess);
//         isRefreshing = false;

//         originalRequest.headers.Authorization = `Bearer ${newAccess}`;
//         return api(originalRequest);
//       } catch (err) {
//         processQueue(err, null);
//         isRefreshing = false;

//         // Only log out if refresh fails (not just 401)
//         console.error("Token refresh failed", err);
//         store.dispatch(logout());
//         return Promise.reject(err);
//       }
//     }

//     return Promise.reject(error);
//   }
// );


// export default api;

import axios from "axios";
import API_ENDPOINTS, { BASE_URL} from "@src/apis/endpoints";
import { store } from '../redux/store';
import { updateTokens } from "../redux/authentication";

// Base URL from env
// export const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
});

// ------------------- Request Interceptor -------------------
api.interceptors.request.use((config) => {
  const authData = JSON.parse(localStorage.getItem("authData"));
  if (authData?.accessToken) {
    config.headers.Authorization = `Bearer ${authData.accessToken}`;
  }
  return config;
});

// ------------------- Refresh Logic -------------------
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// ------------------- Response Interceptor -------------------
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log("401 received, attempting refresh...");

      const authData = JSON.parse(localStorage.getItem("authData"));
      if (!authData?.refreshToken) {
        console.log("No refresh token available.");
        return Promise.reject({ message: "No refresh token available", originalError: error });
      }

      if (isRefreshing) {
        console.log("Already refreshing, queueing request...");
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            console.log("Retrying queued request with new token:", token);
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log("Sending refresh token request...");
        const res = await axios.post(API_ENDPOINTS.AUTH.REFRESH, {
          refresh: authData.refreshToken,
        });
        console.log("Refresh response:", res.data);

       const newAccess = res.data.data?.access;
const newRefresh = res.data.data?.refresh; // <-- get new refresh token if present

console.log("Refresh response received:");
console.log("New access token:", newAccess);
console.log("New refresh token:", newRefresh);

const newAuthData = {
  ...authData,
  accessToken: newAccess,
  refreshToken: newRefresh || authData.refreshToken, // fallback to old refresh
};

console.log("Saving updated tokens to localStorage:", newAuthData);
localStorage.setItem("authData", JSON.stringify(newAuthData));

// Update Redux state
console.log("Updating Redux store with new tokens");
store.dispatch(updateTokens({
  accessToken: newAccess,
  refreshToken: newRefresh || authData.refreshToken
}));

console.log("Retrying original request with new access token");
originalRequest.headers.Authorization = `Bearer ${newAccess}`;
return api(originalRequest);

      } catch (err) {
        console.error("Refresh failed:", err);
        processQueue(err, null);
        isRefreshing = false;
        return Promise.reject({ message: "Token refresh failed", originalError: err });
      }
    }

    return Promise.reject(error);
  }
);

export default api;
