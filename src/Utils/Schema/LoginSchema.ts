import { z } from "zod";

export const loginSchema = z
  .object({
    email: z.string().email("Invalid email").optional().or(z.literal("")),

    mobileNumber: z
      .string()
      .regex(/^01[01245]\d{8}$/, "Invalid Egyptian mobile number")
      .optional()
      .or(z.literal("")),

    password: z.string().min(1, "Password is required"),
  })
  .refine((data) => data.email || data.mobileNumber, {
    message: "Either email or mobile number must be provided",
    path: ["email"],
  });

export type LoginSchemaType = z.infer<typeof loginSchema>;