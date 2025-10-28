import { axiosClient } from "../api/axios_client";
import {
  ApplicationsChartResponse,
  DashboardStats,
  ModerationCategoriesResponse,
  TopEmployersResponse,
} from "../model/model";

export const dashboardService = {

    getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await axiosClient.get("/dashboard/stats");
    return response.data;
  },

  //Lấy dữ liệu cho biểu đồ lượt nộp hồ sơ
  getApplicationsChartData: async (): Promise<ApplicationsChartResponse> => {
    const response = await axiosClient.get("/dashboard/applications-chart");
    return response.data;
  },

  //Lấy danh sách nhà tuyển dụng hàng đầu
  getTopEmployers: async (): Promise<TopEmployersResponse> => {
    const response = await axiosClient.get("/dashboard/top-employers");
    return response.data;
  },

  //Lấy danh sách các mục chờ duyệt
  getModerationQueue: async (): Promise<ModerationCategoriesResponse> => {
    const response = await axiosClient.get("/dashboard/moderation-queue");
    return response.data;
  },
};
