import { z } from "zod";

export const registerSchema = z
  .object({
    first_name: z.string().min(4, "First Name is required"),
    last_name: z.string().min(4, "Last Name is required"),
    email: z.email().min(4, "Email is required"),
    username: z
      .string()
      .min(5, "Username is required and must be minimum 5 characters")
      .max(30, "Maximum length is 30 characters")
      .regex(/^[a-zA-Z0-9_.]{5,30}$/, "Only letters, numbers, '_' and '.' allowed"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Must be same as Password"),
    profile: z
      .string()
      .optional()
      .refine((val) => !val || val.length >= 4, {
        message: "Must be at least 4 characters",
      }),
    experience: z
      .number()
      .nullable()
      .refine(
        (number) => {
          if (number === null) return true;
          const parts = number.toString().split(".");
          return parts.length === 1 || parts[1].length <= 1;
        },
        {
          message: "Number must have at most 1 decimal place",
        },
      )
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterSchemaType = z.infer<typeof registerSchema>;
