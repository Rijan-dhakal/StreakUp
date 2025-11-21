import { getToken } from "@/src/utils/secureStore";
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5001/api",
});

api.interceptors.request.use(async (config) => {
  const token = await getToken('jwt');  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});