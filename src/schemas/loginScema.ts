import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(4, "Username is required"),
  password: z.string().min(8, "Paswword must be at least 8 characters"),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
