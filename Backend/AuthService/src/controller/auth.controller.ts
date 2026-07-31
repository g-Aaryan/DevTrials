import { Request, Response, NextFunction } from "express";

import {
    registerUser,
    verifyUserEmail,
    resendVerificationOtp,
    loginUser,
    refreshAccessToken,
    logoutUser,
    logoutAllDevices,
    getMe
} from "../services/auth.service";


const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: 7 * 24 * 60 * 60 * 1000
};


export const register = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await registerUser(req.body);

        res.status(201).json({
            success: true,
            message: "User registered successfully. Please verify your email.",
            data: user
        });
    } catch (error) {
        next(error);
    }
};


export const verifyEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { userId, otp } = req.body;

        const user = await verifyUserEmail(userId, otp);

        res.status(200).json({
            success: true,
            message: "Email verified successfully",
            data: user
        });
    } catch (error) {
        next(error);
    }
};


export const resendOtp = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { userId } = req.body;

        const result = await resendVerificationOtp(userId);

        res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        next(error);
    }
};


export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email, password } = req.body;

        const {
            user,
            accessToken,
            refreshToken,
            sessionId
        } = await loginUser(email, password);

        res.cookie(
            "refreshToken",
            refreshToken,
            cookieOptions
        );

        res.cookie(
            "sessionId",
            sessionId,
            cookieOptions
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                user,
                accessToken
            }
        });
    } catch (error) {
        next(error);
    }
};


export const refresh = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { refreshToken, sessionId } = req.cookies;

        if (!refreshToken || !sessionId) {
            throw new Error("Refresh token or session not found");
        }

        const tokens = await refreshAccessToken(
            sessionId,
            refreshToken
        );

        // Refresh token rotation
        res.cookie(
            "refreshToken",
            tokens.refreshToken,
            cookieOptions
        );

        res.status(200).json({
            success: true,
            data: {
                accessToken: tokens.accessToken
            }
        });
    } catch (error) {
        next(error);
    }
};


export const logout = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { sessionId } = req.cookies;

        // userId will come from authentication middleware
        const userId = req.user.userId;

        await logoutUser(
            sessionId,
            userId
        );

        res.clearCookie("refreshToken", cookieOptions);
        res.clearCookie("sessionId", cookieOptions);

        res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (error) {
        next(error);
    }
};


export const logoutAll = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // userId will come from authentication middleware
        const userId = req.user.userId;

        await logoutAllDevices(userId);

        res.clearCookie("refreshToken", cookieOptions);
        res.clearCookie("sessionId", cookieOptions);

        res.status(200).json({
            success: true,
            message: "Logged out from all devices successfully"
        });
    } catch (error) {
        next(error);
    }
};


export const me = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // userId will come from authentication middleware
        const userId = req.user.userId;

        const user = await getMe(userId);

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};