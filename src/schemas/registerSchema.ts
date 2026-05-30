import { z } from "zod";

export const registerSchema = z
  .object({
    first_name: z.string().min(4, "Username is required"),
    last_name: z.string().min(4, "Username is required"),
    email: z.email().min(4, "Username is required"),
    password: z.string().min(8, "Paswword must be at least 8 characters"),
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
