import axios from "axios";

// const BASE_URL = "http://localhost:4000/api";
// const BASE_URL = "https://nla-server-production.up.railway.app/api";
const BASE_URL = "http://193.203.163.95:4000/api";

export const publicRequest = axios.create({
  baseURL: BASE_URL,
});

export const adminRequest = axios.create({
  baseURL: `${BASE_URL}/admin`,
});

export const authRequest = axios.create({
  baseURL: `${BASE_URL}/auth`,
});
