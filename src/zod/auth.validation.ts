import { z } from "zod";
export const ILoginZodSchema = z.object({
  email: z.email("Invalide Email Address"),
  password: z
    .string()
    .min(1, "password is required")
    .min(8, "Password must be at least 8 characters long"),
});

export const IRegisterZodSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(3, "Name must be at least 3 characters"),

  email: z.email("Invalid Email Address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters long"),

  confirmPassword: z
    .string()
    .min(1, "Confirm Password is required"),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }
);

export type ILoginPayload = z.infer<typeof ILoginZodSchema>;
export type IRegisterPayload = z.infer<typeof IRegisterZodSchema>;
