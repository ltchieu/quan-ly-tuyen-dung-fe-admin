import axios from "axios";
import { axiosClient } from "../api/axios_client";
import { ApiResponse } from "../model/api_respone";
import {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
} from "../model/auth_model";

export async function loginService(credentials: LoginRequest): Promise<LoginResponse> {
  try {
    const response = await axiosClient.post<ApiResponse<LoginResponse>>(
      "/auth/login",
      credentials
    );

    if (response.data && response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || "Đăng nhập thất bại");
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      // Lấy message lỗi từ body của response
      const apiError = error.response.data as ApiResponse<null>;
      throw new Error(apiError.message || "Lỗi không xác định từ máy chủ");
    } else {
      // Lỗi mạng hoặc lỗi khác
      throw new Error("Không thể kết nối đến máy chủ");
    }
  }
}

export async function refreshToken(token: string): Promise<LoginResponse> {
  try {
    const response = await axiosClient.post<ApiResponse<LoginResponse>>(
      "/auth/refresh",
      { refreshToken: token } as RefreshTokenRequest
    );
    if (response.data && response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || "Refresh token thất bại");
    }
  } catch (error: any) {
    const message = error.response?.data?.message || error.message;
    throw new Error(message);
  }
}

export async function logoutService (token: string): Promise<boolean> {
    try {
      const response = await axiosClient.post<ApiResponse<boolean>>(
        '/auth/logout',
        { refreshToken: token } as RefreshTokenRequest
      );
      return response.data.data;
    } catch (error: any) {
      console.error("Lỗi khi đăng xuất:", error);
      return false; 
    }
  }
