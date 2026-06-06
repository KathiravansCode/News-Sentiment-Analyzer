import axios from "axios";

const api = axios.create({
  baseURL: "http://3.108.221.1:8000"
});

export default api;