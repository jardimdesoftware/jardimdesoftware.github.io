import { apiBase } from "@/services/baseApi";

export interface AdminUserListItem {
  id: number;
  email: string;
  name: string | null;
  hasPassword: boolean;
  hasGoogle: boolean;
  lastLogin: string | null;
  createdAt: string;
}

export interface AdminUserInput {
  email: string;
  name?: string;
}

export const adminUsersService = {
  findAll: async (): Promise<AdminUserListItem[]> => {
    const { data } = await apiBase.get<AdminUserListItem[]>("/admin/admin-users");
    return data;
  },

  create: async (input: AdminUserInput): Promise<AdminUserListItem> => {
    const { data } = await apiBase.post<AdminUserListItem>(
      "/admin/admin-users",
      input,
    );
    return data;
  },

  remove: async (id: number): Promise<void> => {
    await apiBase.delete(`/admin/admin-users/${id}`);
  },
};
