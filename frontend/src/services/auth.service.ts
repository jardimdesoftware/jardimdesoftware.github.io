import { apiBase } from "@/services/baseApi";
import { AdminUser, LoginCredentials, LoginResponse } from "@/interfaces/auth";

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const { data } = await apiBase.post<LoginResponse>(
      "/auth/login",
      credentials,
    );
    return data;
  },

  me: async (): Promise<AdminUser> => {
    const { data } = await apiBase.get<AdminUser>("/auth/me");
    return data;
  },
};
