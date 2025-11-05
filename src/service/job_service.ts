
import { axiosClient } from '../api/axios_client';
import { PagedResponse, ApiResponse } from '../model/api_respone';
import {
  JobDto,
  JobDetailDto,
  CreateJobRequest,
  UpdateJobRequest,
} from '../model/job_model';

const jobService = {
  getJobs: async (
    page: number,
    pageSize: number
  ): Promise<PagedResponse<JobDto>> => {
    const response = await axiosClient.get<ApiResponse<PagedResponse<JobDto>>>(
      '/jobs',
      {
        params: { page, pageSize },
      }
    );
    return response.data.data;
  },

  getJobById: async (id: string): Promise<JobDetailDto> => {
    const response = await axiosClient.get<ApiResponse<JobDetailDto>>(
      `/jobs/${id}`
    );
    if (response.data && response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Không tìm thấy công việc');
    }
  },

  createJob: async (request: CreateJobRequest): Promise<JobDetailDto> => {
    const response = await axiosClient.post<ApiResponse<JobDetailDto>>(
      '/jobs',
      request
    );
    return response.data.data;
  },

  updateJob: async (
    id: string,
    request: UpdateJobRequest
  ): Promise<JobDetailDto> => {
    const response = await axiosClient.put<ApiResponse<JobDetailDto>>(
      `/jobs/${id}`,
      request
    );
    return response.data.data;
  },

  deleteJob: async (id: string): Promise<boolean> => {
    const response = await axiosClient.delete<ApiResponse<boolean>>(
      `/jobs/${id}`
    );
    return response.data.data;
  },

  publishJob: async (id: string): Promise<boolean> => {
    console.log("job id: " + id)
    const response = await axiosClient.patch<ApiResponse<boolean>>(
      `/jobs/${id}/publish`
    );
    return response.data.data;
  },

  unpublishJob: async (id: string): Promise<boolean> => {
    const response = await axiosClient.patch<ApiResponse<boolean>>(
      `/jobs/${id}/unpublish`
    );
    return response.data.data;
  },
};

export default jobService;