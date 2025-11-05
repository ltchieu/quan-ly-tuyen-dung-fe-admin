import { axiosClient } from "../api/axios_client";
import { ApiResponse } from "../model/api_respone";
import { FileUploadResponse } from "../model/upload_file";

const uploadService = {
  uploadFile: async (
    file: File,
    fileType: 'cv' | 'image'
  ): Promise<FileUploadResponse> => {
    const formData = new FormData();
    formData.append('File', file);
    const endpoint = `/upload/${fileType}`;

    try {
      const response = await axiosClient.post<ApiResponse<FileUploadResponse>>(
        endpoint,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data && response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Upload thất bại');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      throw new Error(message);
    }
  },

  deleteFile: async (
    fileType: string,
    fileName: string
  ): Promise<boolean> => {
    try {
      const endpoint = `/upload/${fileType}/${fileName}`;
      
      const response = await axiosClient.delete<ApiResponse<boolean>>(endpoint);

      if (response.data && response.data.success) {
        return true;
      } else {
        throw new Error(response.data.message || 'Xóa file thất bại');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      throw new Error(message);
    }
  },
};

export default uploadService;