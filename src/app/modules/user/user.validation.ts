import { z } from 'zod';
import { UserRole } from './user.constant';

const userValidationSchema = z.object({
  body: z.object({
    username: z.string({
      invalid_type_error: 'username must be string',
      required_error: 'username is required',
    }),
    email: z
      .string({
        invalid_type_error: 'email must be string',
        required_error: 'email is required',
      })
      .email({ message: 'Invalid email address' }),
    password: z
      .string({
        invalid_type_error: 'password must be string',
        required_error: 'password is required',
      })
      .min(6, { message: 'Password must be at least 6 characters long' })
      .max(20, { message: 'Password must be less than 20 characters long' }),
    role: z.enum([...UserRole] as [string, ...string[]]),
  }),
});

const loginValidationSchema = z.object({
  body: z.object({
    username: z.string({ required_error: 'username is required.' }),
    password: z.string({ required_error: 'Password is required' }),
  }),
});

const changePasswordValidationSchema = z.object({
  body: z.object({
    currentPassword: z.string({
      required_error: 'current password is required',
    }),
    newPassword: z
      .string({ required_error: 'Password is required' })
      .min(6, { message: 'Password must be at least 6 characters long' })
      .max(20, { message: 'Password must be less than 20 characters long' }),
  }),
});

export const UserValidation = {
  userValidationSchema,
  loginValidationSchema,
  changePasswordValidationSchema,
};
