export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}


export interface PagedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}