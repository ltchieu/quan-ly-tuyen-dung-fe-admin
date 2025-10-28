import axios from "axios";
import { axiosClient } from "../api/axios_client";
import { ApiResponse } from "../model/api_respone";
import { LoginRequest, LoginResponse } from "../model/auth_model";

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
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
