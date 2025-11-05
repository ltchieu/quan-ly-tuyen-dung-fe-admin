import { axiosClient } from "../api/axios_client";
import { ApiResponse, PagedResponse } from "../model/api_respone";
import { UpdateUserRequest, UserDto, UserSummaryDto } from "../model/user_model";

export const getUsers = async (
  page: number,
  pageSize: number
): Promise<PagedResponse<UserSummaryDto>> => {
  try {
    const response = await axiosClient.get<
      ApiResponse<PagedResponse<UserSummaryDto>>
    >('/users', {
      params: { page, pageSize },
    });

    if (response.data && response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Không thể lấy danh sách người dùng');
    }
  } catch (error: any) {
    const message = error.response?.data?.message || error.message;
    throw new Error(message);
  }
};

export const getUserById = async (id: string): Promise<UserDto> => {
    try {
      const response = await axiosClient.get<ApiResponse<UserDto>>(`/users/${id}`);
      if (response.data && response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Không tìm thấy người dùng');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      throw new Error(message);
    }
  }


  export const updateUser = async (
    id: string,
    data: UpdateUserRequest
  ): Promise<UserDto> => {
    try {
      const response = await axiosClient.put<ApiResponse<UserDto>>(
        `/users/${id}`,
        data
      );
      if (response.data && response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Cập nhật thất bại');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      throw new Error(message);
    }
  }

 
  export const deleteUser = async (id: string): Promise<boolean> => {
    try {
      // API của bạn trả về ApiResponse<bool>
      const response = await axiosClient.delete<ApiResponse<boolean>>(
        `/users/${id}`
      );
      if (response.data && response.data.success) {
        return true;
      } else {
        throw new Error(response.data.message || 'Xóa thất bại');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      throw new Error(message);
    }
  }