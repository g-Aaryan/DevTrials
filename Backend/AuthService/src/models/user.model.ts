import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "USER" | "ADMIN";
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name must be less than 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },

    role: {
      type: String,
      enum: {
        values: ["USER", "ADMIN"],
        message: "Invalid user role",
      },
      default: "USER",
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,

    toJSON: {
      transform: (_, record) => {
        delete (record as any).__v;
        delete (record as any).password;

        record.id = record._id;
        delete record._id;

        return record;
      },
    },
  }
);

userSchema.index(
  { email: 1 },
  { unique: true }
);

export const User = mongoose.model<IUser>(
  "User",
  userSchema
);