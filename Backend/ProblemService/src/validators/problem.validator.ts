import { z } from "zod";

const testcaseSchema = z.object({
  input: z.string().min(1, "Input is required"),
  output: z.string().min(1, "Output is required"),
});

export const createProblemSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required"),

  description: z
    .string()
    .trim()
    .min(1, "Description is required"),

  difficulty: z.enum(["easy", "medium", "hard"]),

  editorial: z.string().optional(),

  testcases: z
    .array(testcaseSchema)
    .min(1, "At least one testcase is required"),
});

export const updateProblemSchema =
  createProblemSchema.partial();

export const findByDifficultySchema = z.object({
  difficulty: z.enum(["easy", "medium", "hard"]),
});

export const idParamSchema = z.object({
  id: z.string().min(1, "Problem id is required"),
});

export type CreateProblemDto = z.infer<
  typeof createProblemSchema
>;

export type UpdateProblemDto = z.infer<
  typeof updateProblemSchema
>;