import { z } from 'zod';
import { userSchema } from '../../schema';

const userRoleSchema = userSchema.shape.role.unwrap();

export const registerRequestSchema = z.object({
    username: z.string().trim().min(3).max(20).optional(),
    email: z.email(),
    password: z.string().min(8).max(128),
    role: userRoleSchema.optional(),
});

export const loginRequestSchema = z.object({
    email: z.email(),
    password: z.string().min(8).max(128),
});

export const refreshTokenRequestSchema = z.object({
    refreshToken: z.string().min(1),
});

export const forgotPasswordRequestSchema = z.object({
    email: z.email(),
});

export const resetPasswordRequestSchema = z.object({
    token: z.string().min(1),
    newPassword: z.string().min(8).max(128),
});

export type RegisterRequest = z.infer<typeof registerRequestSchema>;
export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type RefreshTokenRequest = z.infer<typeof refreshTokenRequestSchema>;
export type ForgotPasswordRequest = z.infer<typeof forgotPasswordRequestSchema>;
export type ResetPasswordRequest = z.infer<typeof resetPasswordRequestSchema>;
