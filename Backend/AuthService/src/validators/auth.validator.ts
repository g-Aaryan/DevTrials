import { z } from "zod";

export const registerSchema = z.object({
    name: z.string()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must be less than 50 characters"),

    email: z.string()
        .email("Invalid email address"),

    password: z.string()
        .min(8, "Password must be at least 8 characters")
});


export const verifyEmailSchema = z.object({
    userId: z.string()
        .min(1, "User ID is required"),

    otp: z.string()
        .length(6, "OTP must be 6 digits")
        .regex(/^\d+$/, "OTP must contain only numbers")
});


export const resendOtpSchema = z.object({
    userId: z.string()
        .min(1, "User ID is required")
});


export const loginSchema = z.object({
    email: z.string()
        .email("Invalid email address"),

    password: z.string()
        .min(1, "Password is required")
});