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


export default api;
