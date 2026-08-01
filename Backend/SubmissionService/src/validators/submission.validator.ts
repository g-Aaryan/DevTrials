import { z } from "zod";

export const createSubmissionSchema = z.object({
  userId: z
    .string()
    .min(1, "User ID is required"),

  problemId: z
    .string()
    .min(1, "Problem ID is required"),

  language: z.enum([
    "cpp",
    "java",
    "python",
    "javascript",
  ]),

  sourceCode: z
    .string()
    .min(1, "Source code is required"),
});


export const submissionIdSchema = z.object({
  id: z
    .string()
    .min(1, "Submission ID is required"),
});


export const userIdSchema = z.object({
  userId: z
    .string()
    .min(1, "User ID is required"),
});


export const problemIdSchema = z.object({
  problemId: z
    .string()
    .min(1, "Problem ID is required"),
});


export const submissionFilterSchema = z.object({
  status: z
    .enum([
      "PENDING",
      "QUEUED",
      "RUNNING",
      "COMPLETED",
      "FAILED",
    ])
    .optional(),

  verdict: z
    .enum([
      "PENDING",
      "ACCEPTED",
      "WRONG_ANSWER",
      "TIME_LIMIT_EXCEEDED",
      "MEMORY_LIMIT_EXCEEDED",
      "RUNTIME_ERROR",
      "COMPILATION_ERROR",
    ])
    .optional(),

  language: z
    .enum([
      "cpp",
      "java",
      "python",
      "javascript",
    ])
    .optional(),
});

export const updateSubmissionVerdictSchema = z.object({
    status: z.enum([
        "PENDING",
        "QUEUED",
        "RUNNING",
        "COMPLETED",
        "FAILED"
    ]),

    verdict: z.enum([
        "PENDING",
        "ACCEPTED",
        "WRONG_ANSWER",
        "TIME_LIMIT_EXCEEDED",
        "MEMORY_LIMIT_EXCEEDED",
        "RUNTIME_ERROR",
        "COMPILATION_ERROR"
    ])
});

export const updateSubmissionVerdictParamsSchema = z.object({
    submissionId: z.string().min(1)
});


export type CreateSubmissionDto = z.infer<
  typeof createSubmissionSchema
>;