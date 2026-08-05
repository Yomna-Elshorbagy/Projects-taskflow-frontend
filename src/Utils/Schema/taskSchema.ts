import { z } from "zod";

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must not exceed 100 characters"),

  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(2000, "Description must not exceed 2000 characters"),

  dueDate: z.coerce.date(),

  assignee: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid assignee id"),

  status: z.enum(["To Do", "In Progress", "Done", "Ready for test", "Approved"]).optional(),

  priority: z.enum(["Low", "Medium", "High"]).optional(),
});

export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(3)
    .max(100)
    .optional(),

  description: z
    .string()
    .min(20)
    .max(2000)
    .optional(),

  dueDate: z.coerce.date().optional(),

  assignee: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid assignee id")
    .optional(),

  status: z.enum(["To Do", "In Progress", "Done", "Ready for test", "Approved"]).optional(),

  priority: z.enum(["Low", "Medium", "High"]).optional(),
});

export type CreateTaskSchemaType = z.infer<typeof createTaskSchema>;

export type UpdateTaskSchemaType = z.infer<typeof updateTaskSchema>;