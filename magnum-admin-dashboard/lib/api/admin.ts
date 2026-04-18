import { apiClient } from "@/lib/api/client";

const withTrailingSlash = (path: string) =>
  path.endsWith("/") ? path : `${path}/`;

export interface ListParams {
  search?: string;
  status?: string;
  school_id?: string;
  vendor_id?: string;
  student_id?: string;
  parent_id?: string;
  account_id?: string;
  user_id?: string;
  card_id?: string;
  sale_id?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  page_size?: number;
}

export const adminApi = {
  getDashboardOverview: async () => {
    const response = await apiClient.get("/api/admin/dashboard/overview/");
    return response.data;
  },

  listSchools: async (params?: ListParams) => {
    const response = await apiClient.get("/api/admin/schools/", { params });
    return response.data;
  },
  getSchool: async (id: string) => {
    const response = await apiClient.get(
      withTrailingSlash(`/api/admin/schools/${id}`),
    );
    return response.data;
  },
  updateSchoolStatus: async (id: string, status: string) => {
    const response = await apiClient.patch(
      withTrailingSlash(`/api/admin/schools/${id}/status`),
      { status },
    );
    return response.data;
  },
  onboardSchool: async (payload: Record<string, unknown>) => {
    const response = await apiClient.post(
      "/api/onboardschoolwithmainbursar/",
      payload,
    );
    return response.data;
  },

  listStudents: async (params?: ListParams) => {
    const response = await apiClient.get("/api/admin/students/", { params });
    return response.data;
  },
  getStudent: async (id: string) => {
    const response = await apiClient.get(
      withTrailingSlash(`/api/admin/students/${id}`),
    );
    return response.data;
  },
  updateStudentStatus: async (id: string, status: string) => {
    const response = await apiClient.patch(
      withTrailingSlash(`/api/admin/students/${id}/status`),
      { status },
    );
    return response.data;
  },

  listParents: async (params?: ListParams) => {
    const response = await apiClient.get("/api/admin/parents/", { params });
    return response.data;
  },
  getParent: async (id: string) => {
    const response = await apiClient.get(
      withTrailingSlash(`/api/admin/parents/${id}`),
    );
    return response.data;
  },

  listVendors: async (params?: ListParams) => {
    const response = await apiClient.get("/api/admin/vendors/", { params });
    return response.data;
  },
  getVendor: async (id: string) => {
    const response = await apiClient.get(
      withTrailingSlash(`/api/admin/vendors/${id}`),
    );
    return response.data;
  },
  updateVendorStatus: async (id: string, status: string) => {
    const response = await apiClient.patch(
      withTrailingSlash(`/api/admin/vendors/${id}/status`),
      { status },
    );
    return response.data;
  },

  listItems: async (params?: ListParams) => {
    const response = await apiClient.get("/api/admin/items/", { params });
    return response.data;
  },
  getItem: async (id: string) => {
    const response = await apiClient.get(`/api/admin/items/${id}/`);
    return response.data;
  },

  listSales: async (params?: ListParams) => {
    const response = await apiClient.get("/api/admin/sales/", { params });
    return response.data;
  },
  getSale: async (id: string) => {
    const response = await apiClient.get(`/api/admin/sales/${id}/`);
    return response.data;
  },

  listCards: async (params?: ListParams) => {
    const response = await apiClient.get("/api/admin/cards/", { params });
    return response.data;
  },
  getCard: async (id: string) => {
    const response = await apiClient.get(`/api/admin/cards/${id}/`);
    return response.data;
  },
  createCard: async (payload: Record<string, unknown>) => {
    const response = await apiClient.post("/api/admin/cards/", payload);
    return response.data;
  },
  bulkImportCards: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post(
      "/api/admin/cards/bulk-import/",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return response.data;
  },
  assignCard: async (id: string, payload: Record<string, unknown>) => {
    const response = await apiClient.post(
      `/api/admin/cards/${id}/assign/`,
      payload,
    );
    return response.data;
  },
  replaceCard: async (id: string, payload: Record<string, unknown>) => {
    const response = await apiClient.post(
      `/api/admin/cards/${id}/replace/`,
      payload,
    );
    return response.data;
  },
  updateCardStatus: async (id: string, status: string) => {
    const response = await apiClient.patch(`/api/admin/cards/${id}/status/`, {
      status,
    });
    return response.data;
  },

  listStudentAccounts: async (params?: ListParams) => {
    const response = await apiClient.get("/api/admin/student-accounts/", {
      params,
    });
    return response.data;
  },
  getStudentAccount: async (id: string) => {
    const response = await apiClient.get(`/api/admin/student-accounts/${id}/`);
    return response.data;
  },
  recalculateStudentAccount: async (id: string) => {
    const response = await apiClient.post(
      `/api/admin/student-accounts/${id}/recalculate/`,
    );
    return response.data;
  },

  listUserAccounts: async (params?: ListParams) => {
    const response = await apiClient.get("/api/admin/user-accounts/", {
      params,
    });
    return response.data;
  },
  getUserAccount: async (id: string) => {
    const response = await apiClient.get(`/api/admin/user-accounts/${id}/`);
    return response.data;
  },
  recalculateUserAccount: async (id: string) => {
    const response = await apiClient.post(
      `/api/admin/user-accounts/${id}/recalculate/`,
    );
    return response.data;
  },

  listTransactions: async (params?: ListParams) => {
    const response = await apiClient.get("/api/admin/transactions/", {
      params,
    });
    return response.data;
  },
  getTransaction: async (id: string) => {
    const response = await apiClient.get(`/api/admin/transactions/${id}/`);
    return response.data;
  },

  listActivityLogs: async (params?: ListParams) => {
    const response = await apiClient.get("/api/admin/activitylogs/", {
      params,
    });
    return response.data;
  },

  listAdminUsers: async (params?: ListParams) => {
    const response = await apiClient.get("/api/admin/users/", { params });
    return response.data;
  },
  updateAdminUserRoles: async (id: string, groups: string[]) => {
    const response = await apiClient.patch(`/api/admin/users/${id}/roles/`, {
      groups,
    });
    return response.data;
  },

  getGroupsPermissions: async () => {
    const response = await apiClient.get("/api/admin/groups-permissions/");
    return response.data;
  },
};
