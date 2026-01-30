import { z } from 'zod';

// Vietnamese phone regex: 0[3|5|7|8|9]xxxxxxxx
const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;

export const LoginSchema = z.object({
    email: z
        .string()
        .min(1, 'Vui lòng nhập email')
        .email('Email không hợp lệ'),
    password: z
        .string()
        .min(1, 'Vui lòng nhập mật khẩu')
        .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

export const RegisterSchema = z.object({
    fullName: z
        .string()
        .min(1, 'Vui lòng nhập họ tên'),
    phone: z
        .string()
        .min(1, 'Vui lòng nhập số điện thoại')
        .regex(phoneRegex, 'Số điện thoại không hợp lệ'),
    email: z
        .string()
        .min(1, 'Vui lòng nhập email')
        .email('Email không hợp lệ'),
    password: z
        .string()
        .min(1, 'Vui lòng nhập mật khẩu')
        .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

export type LoginFormData = z.infer<typeof LoginSchema>;
export type RegisterFormData = z.infer<typeof RegisterSchema>;
