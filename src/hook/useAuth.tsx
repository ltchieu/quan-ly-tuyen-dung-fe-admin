import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { LoginResponse, UserDto } from "../model/auth_model";
import { axiosClient } from "../api/axios_client";
import { logoutService, refreshToken } from "../service/auth_service";
import { setupAxiosInterceptors } from "../api/setup_axios";

interface AuthContextType {
  user: UserDto | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (data: LoginResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserDto | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const login = (data: LoginResponse) => {
    setAccessToken(data.accessToken);
    setUser(data.user);
    localStorage.setItem("refreshToken", data.refreshToken);

     setupAxiosInterceptors(() => data.accessToken, logout, refreshToken, login);
  };

  const logout = async () => {
    const storedRefreshToken = localStorage.getItem("refreshToken");
    if (storedRefreshToken) {
      try {
        await logoutService(storedRefreshToken);
      } catch (e) {
        console.error("Lỗi khi gọi API logout", e);
      }
    }
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem("refreshToken");
  };

  useEffect(() => {
    // Thiết lập axios interceptor ngay từ đầu
    setupAxiosInterceptors(() => accessToken, logout, refreshToken, login);

    const tryRefreshToken = async () => {
      const storedRefreshToken = localStorage.getItem("refreshToken");
      if (!storedRefreshToken) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await refreshToken(storedRefreshToken);
        login(response);
      } catch (error) {
        console.error("Lỗi khi refresh token lúc tải trang:", error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    tryRefreshToken();
  }, []);

  if (isLoading) {
    return <div>Loading session...</div>;
  }

  return (
    <AuthContext.Provider
      value={{ user, accessToken, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook tùy chỉnh
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
