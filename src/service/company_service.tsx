import { axiosClient } from "../api/axios_client";
import { PagedResponse, ApiResponse } from "../model/api_respone";
import {
  PendingCompanyDto,
  CompanyVerificationRequest,
  CompanyDetailDto,
  UpdateCompanyRequest,
} from "../model/company_model";

const companyService = {
  getPendingCompanies: async (
    page: number,
    pageSize: number
  ): Promise<PagedResponse<PendingCompanyDto>> => {
    const response = await axiosClient.get<
      ApiResponse<PagedResponse<PendingCompanyDto>>
    >("/company/pending", {
      params: { page, pageSize },
    });
    return response.data.data;
  },

  verifyCompany: async (
    request: CompanyVerificationRequest
  ): Promise<boolean> => {
    const response = await axiosClient.post<ApiResponse<boolean>>(
      "/company/verify",
      request
    );
    return response.data.data;
  },

  getAllCompanies: async (
    page: number,
    pageSize: number,
    verified: boolean | null = null
  ): Promise<PagedResponse<CompanyDetailDto>> => {
    const response = await axiosClient.get<
      ApiResponse<PagedResponse<CompanyDetailDto>>
    >("/company", {
      params: {
        page,
        pageSize,
        ...(verified !== null && { verified }),
      },
    });
    return response.data.data;
  },
  getCompanyById: async (id: string): Promise<CompanyDetailDto> => {
    try {
      const response = await axiosClient.get<ApiResponse<CompanyDetailDto>>(
        `/Company/${id}`
      );

      if (response.data && response.data.success) {
        return response.data.data;
      }

      else {
        throw new Error(response.data.message || "Lấy dữ liệu thất bại");
      }
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(error.message || "Lỗi không xác định khi gọi API");
      }
    }
  },

  updateCompany: async (
    id: string,
    request: Partial<UpdateCompanyRequest>
  ): Promise<boolean> => {
    const response = await axiosClient.put<ApiResponse<boolean>>(
      `/company/${id}`,
      request
    );
    return response.data.data;
  },

  deleteCompany: async (id: string): Promise<boolean> => {
    const response = await axiosClient.delete<ApiResponse<boolean>>(
      `/company/${id}`
    );
    return response.data.data;
  },
};

export default companyService;
