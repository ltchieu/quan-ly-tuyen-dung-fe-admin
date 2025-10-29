import React, { 
  createContext, 
  useContext, 
  useState, 
  ReactNode, 
  useEffect 
} from 'react';
import { LoginResponse, UserDto } from '../model/auth_model';
import { axiosClient } from '../api/axios_client';
import { logoutService, refreshToken } from '../service/auth_service';

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
    localStorage.setItem('refreshToken', data.refreshToken);
  };

  const logout = async () => {
    const storedRefreshToken = localStorage.getItem('refreshToken');
    if (storedRefreshToken) {
      try {
        await logoutService(storedRefreshToken);
      } catch (e) {
        console.error("Lỗi khi gọi API logout", e);
      }
    }
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem('refreshToken');
  };

  useEffect(() => {
    const requestInterceptor = axiosClient.interceptors.request.use(
      (config) => {
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axiosClient.interceptors.response.use(
      (response) => response, 

      async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          const storedRefreshToken = localStorage.getItem('refreshToken');
          if (!storedRefreshToken) {
            logout();
            return Promise.reject(error);
          }

          try {
            const response = await refreshToken(storedRefreshToken);           
            login(response); 
            originalRequest.headers.Authorization = `Bearer ${response.accessToken}`;
            return axiosClient(originalRequest); 
            
          } catch (refreshError) {
            logout(); 
            return Promise.reject(refreshError);
          }
        }
        
        return Promise.reject(error);
      }
    );

    return () => {
      axiosClient.interceptors.request.eject(requestInterceptor);
      axiosClient.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken]); 

  useEffect(() => {
    const tryRefreshToken = async () => {
      const storedRefreshToken = localStorage.getItem('refreshToken');
      if (!storedRefreshToken) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await refreshToken(storedRefreshToken);
        login(response); 
      } catch (error) {
        console.error('Failed to refresh token on load', error);
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
    <AuthContext.Provider value={{ user, accessToken, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook tùy chỉnh
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};