import axios from "axios";

const api = axios.create({
  baseURL: "https://newssentiment.duckdns.org"
});

export default api;