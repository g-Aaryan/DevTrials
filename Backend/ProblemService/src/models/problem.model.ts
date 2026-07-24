import mongoose, { Document } from "mongoose";

export interface ITestcase {
  input: string;
  output: string;
}

export interface IExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface IProblem extends Document {
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";

  tags: string[];
  constraints: string[];

  examples: IExample[];

  visibleTestcases: ITestcase[];
  hiddenTestcases: ITestcase[];

  editorial?: string;

  createdAt: Date;
  updatedAt: Date;
}

const testcaseSchema = new mongoose.Schema<ITestcase>(
  {
    input: {
      type: String,
      required: [true, "Input is required"],
      trim: true,
    },
    output: {
      type: String,
      required: [true, "Output is required"],
      trim: true,
    },
  },
  {
    _id: false,
  }
);

const exampleSchema = new mongoose.Schema<IExample>(
  {
    input: {
      type: String,
      required: true,
      trim: true,
    },
    output: {
      type: String,
      required: true,
      trim: true,
    },
    explanation: {
      type: String,
      trim: true,
    },
  },
  {
    _id: false,
  }
);

const problemSchema = new mongoose.Schema<IProblem>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      unique: true,
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },

    description: {
      type: String,
      required: [true, "Description is required"],
    },

    difficulty: {
      type: String,
      enum: {
        values: ["easy", "medium", "hard"],
        message: "Invalid difficulty level",
      },
      required: true,
    },

    tags: {
      type: [String],
      default: [],
    },

    constraints: {
      type: [String],
      default: [],
    },

    examples: {
      type: [exampleSchema],
      default: [],
    },

    visibleTestcases: {
      type: [testcaseSchema],
      default: [],
    },

    hiddenTestcases: {
      type: [testcaseSchema],
      default: [],
    },

    editorial: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,

    toJSON: {
      transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

problemSchema.index({ title: 1 }, { unique: true });
problemSchema.index({ difficulty: 1 });

export const Problem = mongoose.model<IProblem>(
  "Problem",
  problemSchema
);