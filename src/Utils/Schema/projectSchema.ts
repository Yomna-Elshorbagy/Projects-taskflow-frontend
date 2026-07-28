import { z } from "zod";

export const createProjectSchema = z.object({
  name: z
    .string()
    .min(3, "Project name must be at least 3 characters")
    .max(100, "Project name must not exceed 100 characters"),

  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(2000, "Description must not exceed 2000 characters")
    .optional(),
});

export const updateProjectSchema = z.object({
  name: z
    .string()
    .min(3, "Project name must be at least 3 characters")
    .max(100, "Project name must not exceed 100 characters")
    .optional(),

  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(2000, "Description must not exceed 2000 characters")
    .optional(),
});

export type CreateProjectSchemaType = z.infer<
  typeof createProjectSchema
>;

export type UpdateProjectSchemaType = z.infer<
  typeof updateProjectSchema
>;