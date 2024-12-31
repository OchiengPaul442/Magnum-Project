// src/lib/validationSchema.ts
import { z } from 'zod';

export const signInSchema = z.object({
  email: z
    .string()
    .email({ message: 'Invalid email address' })
    .nonempty({ message: 'Email is required' }),
  password: z
    .string()
    .min(3, { message: 'Password must be at least 6 characters' })
    .nonempty({ message: 'Password is required' }),
});

export const createPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters' })
      .nonempty({ message: 'Password is required' }),
    confirmPassword: z
      .string()
      .nonempty({ message: 'Please confirm your password' }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'], // This will assign the error to the confirmPassword field
  });

export const forgotPasswordSchema = z.object({
  otp: z
    .array(
      z
        .string()
        .length(1)
        .regex(/^\d$/, { message: 'Each digit must be a number' }),
    )
    .length(4, { message: 'OTP must be exactly 4 digits' }),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export type CreatePasswordFormValues = z.infer<typeof createPasswordSchema>;
export type SignInFormValues = z.infer<typeof signInSchema>;
