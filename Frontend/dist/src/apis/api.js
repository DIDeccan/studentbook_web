import axios from "axios";

//  Get base URL from .env (must start with VITE_ for Vite)
export const BASE_URL = import.meta.env.VITE_API_BASE_URL;

console.log("API Base URL:", BASE_URL);

const api = axios.create({
  baseURL: BASE_URL
});

export default api;
