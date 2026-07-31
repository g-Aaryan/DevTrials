import mongoose, { Document } from "mongoose";

export interface ISubmission extends Document {
  userId: string;
  problemId: string;

  language: "cpp" | "java" | "python" | "javascript";
  sourceCode: string;

  status:
    | "PENDING"
    | "QUEUED"
    | "RUNNING"
    | "COMPLETED"
    | "FAILED";

  verdict:
    | "PENDING"
    | "ACCEPTED"
    | "WRONG_ANSWER"
    | "TIME_LIMIT_EXCEEDED"
    | "MEMORY_LIMIT_EXCEEDED"
    | "RUNTIME_ERROR"
    | "COMPILATION_ERROR";

  executionTime?: number;
  memoryUsed?: number;

  createdAt: Date;
  updatedAt: Date;
}

const submissionSchema = new mongoose.Schema<ISubmission>(
  {
    userId: {
      type: String,
      required: [true, "User ID is required"],
    },
    
    problemId: {
      type: String,
      required: [true, "Problem ID is required"],
    },

    language: {
      type: String,
      enum: ["cpp", "java", "python", "javascript"],
      required: [true, "Language is required"],
    },

    sourceCode: {
      type: String,
      required: [true, "Source code is required"],
    },

    status: {
      type: String,
      enum: ["PENDING", "QUEUED", "RUNNING", "COMPLETED", "FAILED"],
      default: "PENDING",
    },

    verdict: {
      type: String,
      enum: [
        "PENDING",
        "ACCEPTED",
        "WRONG_ANSWER",
        "TIME_LIMIT_EXCEEDED",
        "MEMORY_LIMIT_EXCEEDED",
        "RUNTIME_ERROR",
        "COMPILATION_ERROR",
      ],
      default: "PENDING",
    },

    executionTime: {
      type: Number,
      min: 0,
    },

    memoryUsed: {
      type: Number,
      min: 0,
    },
  },
  {
    timestamps: true,

    toJSON: {
      transform: (_, record) => {
        delete (record as any).__v;

        record.id = record._id;
        delete record._id;

        return record;
      },
    },
  }
);


submissionSchema.index({
  userId: 1,
  createdAt: -1,
});

submissionSchema.index({
  problemId: 1,
  createdAt: -1,
});

export const Submission = mongoose.model<ISubmission>(
  "Submission",
  submissionSchema
);