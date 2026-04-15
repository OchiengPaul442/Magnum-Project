export interface ApiListResponse<T> {
  status?: string;
  data?: {
    results?: T[];
    pagination?: {
      page?: number;
      page_size?: number;
      total_pages?: number;
      total_records?: number;
    };
  };
}

export interface ApiDetailResponse<T> {
  status?: string;
  data?: T;
}
