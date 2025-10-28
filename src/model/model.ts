// 1. Dữ liệu cho 4 thẻ thống kê
export interface DashboardStats {
  revenueToday: { value: string; change: string };
  newCandidates: { value: number; change: string };
  newEmployers: { value: number; change: string };
  newJobs: { value: number; change: string };
}

// 2. Dữ liệu cho biểu đồ
export interface ApplicationChartDatapoint {
  month: string;
  applications: number;
}
export type ApplicationsChartResponse = ApplicationChartDatapoint[];

// 3. Dữ liệu cho bảng Nhà tuyển dụng
export interface TopEmployer {
  id: string;
  name: string;
  jobs: number;
  spend: string;
  views: string;
}
export type TopEmployersResponse = TopEmployer[];

// 4. Dữ liệu cho danh sách "Duyệt nội dung"
export interface ModerationCategory {
  id: string;
  // API nên trả về một 'type' để chúng ta map với icon
  type: 'pending_jobs' | 'reported_profiles' | 'support_tickets' | 'new_reviews';
  primary: string;
  secondary: string;
}
export type ModerationCategoriesResponse = ModerationCategory[];