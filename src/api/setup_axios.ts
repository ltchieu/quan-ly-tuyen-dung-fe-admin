import { axiosClient } from "./axios_client";

export const setupAxiosInterceptors = (getAccessToken: () => string | null, logout: () => void, refreshTokenFn: (refreshToken: string) => Promise<any>, login: (data: any) => void) => {
  axiosClient.interceptors.request.use(
    (config) => {
      const token = getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const storedRefreshToken = localStorage.getItem("refreshToken");
        if (!storedRefreshToken) {
          logout();
          return Promise.reject(error);
        }
        try {
          const response = await refreshTokenFn(storedRefreshToken);
          login(response);
          originalRequest.headers.Authorization = `Bearer ${response.accessToken}`;
          return axiosClient(originalRequest);
        } catch (err) {
          logout();
          return Promise.reject(err);
        }
      }

      return Promise.reject(error);
    }
  );
};
