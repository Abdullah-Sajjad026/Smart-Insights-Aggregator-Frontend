import axios from "axios";
import { SUCCESS_WAIT_DURATION } from "constants/common";
import { getManagedErrorMessage, sharedRoutes } from "modules/shared";
import { toast } from "react-toastify";

const apiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}`,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      if (config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    // Backend wraps responses in { data, message, success }
    // Return the inner data object for convenience
    if (response?.data?.data !== undefined) {
      return response.data.data;
    }
    // For responses without wrapper (like file downloads), return as is
    return response?.data;
  },
  (error) => {
    console.error({ error });

    if (error.code === "ECONNABORTED") {
      console.error("Request timeout");
    }

    if (error.code === "ERR_NETWORK" || error.code === '"ERR_NETWORK"') {
      toast.error(getManagedErrorMessage("network"));
      console.error("Network error");
    }

    if (
      error.response?.status === 401 &&
      window.location.pathname !== sharedRoutes.auth.signIn.path
    ) {
      localStorage.removeItem("token");

      setTimeout(() => {
        window.location.href = sharedRoutes.auth.signIn.getPath({
          redirect: window.location.href,
        });
      }, SUCCESS_WAIT_DURATION);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
