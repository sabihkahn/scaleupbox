import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true, // send cookies automatically
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers["Authorization"] = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Use api so withCredentials is included
        const res = await api.post("/auth/token/refresh");

        // Save new access token
        localStorage.setItem("token", res.data.accessToken);

        // Retry the original request
        originalRequest.headers["Authorization"] = `Bearer ${res.data.accessToken}`;
        return api(originalRequest);
      } catch (err) {
        // Refresh failed → logout
        localStorage.removeItem("token");
        window.location.href = "/auth";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
