import { z } from "zod";
import type { Gender } from "../../Types/UserType";

const genders: [Gender, ...Gender[]] = ["male", "female"];

export const signupSchema = z
  .object({
    userName: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(70, "Username must not exceed 70 characters"),

    email: z.string().email("Invalid email address"),

    password: z.string().regex(/^[A-Z][A-Za-z0-9]{5,20}$/, "Invalid password pattern"),

    Cpassword: z.string().min(1, "Confirm password is required"),

    gender: z.enum(genders),

    mobileNumber: z
      .string()
      .regex(/^01[01245]\d{8}$/, "Invalid Egyptian mobile number"),
  })
  .refine((data) => data.password === data.Cpassword, {
    message: "Password and Confirm Password do not match",
    path: ["Cpassword"],
  });

export type SignupSchemaType = z.infer<typeof signupSchema>;