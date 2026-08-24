import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminUsersService,
  AdminUserInput,
} from "@/services/admin-users.service";

export const ADMIN_USERS_KEYS = {
  all: ["admin-users"] as const,
};

export function useAdminUsers() {
  return useQuery({
    queryKey: ADMIN_USERS_KEYS.all,
    queryFn: () => adminUsersService.findAll(),
  });
}

export function useCreateAdminUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: AdminUserInput) => adminUsersService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_KEYS.all });
    },
  });
}

export function useDeleteAdminUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminUsersService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_KEYS.all });
    },
  });
}
