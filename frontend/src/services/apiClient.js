import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api/v1";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach access token to every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401, try to refresh the token once then retry the original request
let isRefreshing = false;
let pendingQueue = [];

function processQueue(error, token = null) {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  pendingQueue = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) {
      redirectToSignIn();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({ resolve, reject });
      }).then((token) => {
        original.headers.Authorization = `Bearer ${token}`;
        return apiClient(original);
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      const { data } = await axios.post(`${BASE_URL}/auth/token/refresh/`, {
        refresh: refreshToken,
      });
      const newAccess = data.access;
      localStorage.setItem("access_token", newAccess);
      apiClient.defaults.headers.common.Authorization = `Bearer ${newAccess}`;
      processQueue(null, newAccess);
      original.headers.Authorization = `Bearer ${newAccess}`;
      return apiClient(original);
    } catch (refreshError) {
      processQueue(refreshError, null);
      redirectToSignIn();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

function redirectToSignIn() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
  window.location.href = "/sign-in";
}

export default apiClient;
