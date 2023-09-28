import axios from "axios";
import { getCookie } from "./cookies";

// const BASE_URL = "http://localhost:4000/api";
const BASE_URL = "https://nla-server-production.up.railway.app/api";
console.log(getCookie(""));

export const publicRequest = axios.create({
  baseURL: BASE_URL,
  headers: { Authorization: `Bearer ${getCookie("student_token")}` },
});

export const adminRequest = axios.create({
  baseURL: `${BASE_URL}/admin`,
  headers: { Authorization: `Bearer ${getCookie("admin_token")}` },
});

export const authRequest = axios.create({
  baseURL: `${BASE_URL}/auth`,
});
