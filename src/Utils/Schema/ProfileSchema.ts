import { z } from "zod";

export const profileSchema = z.object({
  userName: z.string().min(3, "Username must be at least 3 characters").optional(),
  mobileNumber: z
    .string()
    .regex(/^01[01245]\d{8}$/, "Must be a valid Egyptian mobile number")
    .optional(),
  address: z.string().optional(),
  gender: z.enum(["male", "female"]).optional(),
});

export type ProfileSchemaType = z.infer<typeof profileSchema>;
