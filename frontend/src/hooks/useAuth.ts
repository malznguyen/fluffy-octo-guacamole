"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/api/services";
import { User } from "@/lib/api/types";
import { toast } from "sonner";

export const authKeys = {
  all: ["auth"] as const,
  user: () => [...authKeys.all, "user"] as const,
};

export function useUser() {
  return useQuery<User, Error>({
    queryKey: authKeys.user(),
    queryFn: authApi.getMe,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { email: string; password: string }) => authApi.login(data),
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      queryClient.setQueryData(authKeys.user(), data.user);
      toast.success("Đăng nhập thành công", {
        description: `Chào mừng trở lại, ${data.user.fullName}!`,
      });
    },
    onError: () => {
      toast.error("Đăng nhập thất bại", {
        description: "Email hoặc mật khẩu không đúng.",
      });
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: {
      email: string;
      password: string;
      fullName: string;
      phone?: string;
    }) => authApi.register(data),
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      queryClient.setQueryData(authKeys.user(), data.user);
      toast.success("Đăng ký thành công", {
        description: "Tài khoản của bạn đã được tạo thành công!",
      });
    },
    onError: () => {
      toast.error("Đăng ký thất bại", {
        description: "Email đã được sử dụng hoặc thông tin không hợp lệ.",
      });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  
  return () => {
    localStorage.removeItem("token");
    queryClient.clear();
    window.location.href = "/dang-nhap";
  };
}
