import axios from "axios";
import { getToken } from "./storage";

const instance = axios.create({
  // baseURL: "http://localhost:3000",
  baseURL: "http://localhost:3000/api/v1",
});

instance.interceptors.request.use(async (req) => {
  const token = await getToken();
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default instance;
