import {RegisterUserData} from "../dto/user.dto";
import { createUser, findUserByEmail, findUserByEmailWithPassword, findUserById, verifyuserEmail } from "../repositories/user.repository";
import { generateOtp, hashOtp, verifyOtp } from "../utils/otp.utils";
import { hashPassword, comparePassword } from "../utils/password.utils";
import { deleteOtp, getOtp, storeOtp } from "../repositories/otp.repository";
import { sendVerificationOtp } from "./email.service";
import { generateAccessToken, generateRefreshToken, hashRefreshToken } from "../utils/token.utils";
import { createSession, deleteAllUserSessions, deleteSession, getSession, updateSessionRefreshToken } from "../repositories/session.repository";


export const registerUser = async (userData: RegisterUserData) => {
    const existingUser = await findUserByEmail(userData.email);
    if (existingUser) {
        throw new Error("User already exists");
    }

    const hashedPassword = await hashPassword(userData.password)

    const user = await createUser({
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: "USER",
        isEmailVerified: false,
    });

    const otp = generateOtp();

    const hashedOtp = hashOtp(otp);

    await storeOtp(user.id,hashedOtp);

    await sendVerificationOtp(user.email,otp);

    return user;
}

export const verifyUserEmail = async (userId:string,otp:string)=>{
    const user = await findUserById(userId);
    if (!user) {throw new Error("User not found")}

    if (user.isEmailVerified) {throw new Error("Email is already verified")}

    const storedOtpHash = await getOtp(userId);
    if (!storedOtpHash) {throw new Error("OTP expired or not found")}

    const isOtpValid = verifyOtp(otp,storedOtpHash);
    if (!isOtpValid) {throw new Error("Invalid OTP")}

    const verifiedUser = await verifyuserEmail(userId);

    await deleteOtp(userId);

    return verifiedUser;
}

export const resendVerificationOtp = async (userId: string) => {
    const user = await findUserById(userId);
    if (!user) { throw new Error("User not found"); }

    if (user.isEmailVerified) { throw new Error("Email is already verified"); }

    const otp = generateOtp();
    const hashedOtp = hashOtp(otp);

    await storeOtp(userId, hashedOtp);
    await sendVerificationOtp(user.email, otp);

    return {
        message: "Verification OTP sent successfully"
    };
}

export const loginUser = async (email: string,password: string) => {
    const user = await findUserByEmailWithPassword(email);
    if (!user) { throw new Error("Invalid email or password"); }

    if (!user.isEmailVerified) { throw new Error("Please verify your email first"); }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) { throw new Error("Invalid email or password"); }

    const accessToken = generateAccessToken(
        user._id.toString(),
        user.role
    );

    const refreshToken = generateRefreshToken();
    const refreshTokenHash = hashRefreshToken(refreshToken);

    const sessionId = crypto.randomUUID();

    await createSession(
        sessionId,
        user._id.toString(),
        refreshTokenHash
    );

    return {
        user,
        accessToken,
        refreshToken,
        sessionId
    };
}

export const refreshAccessToken = async (
    sessionId: string,
    refreshToken: string
) => {
    const session = await getSession(sessionId);
    if (!session) { throw new Error("Session expired or invalid"); }

    const refreshTokenHash = hashRefreshToken(refreshToken);

    if (refreshTokenHash !== session.refreshTokenHash) {
        throw new Error("Invalid refresh token");
    }

    const user = await findUserById(session.userId);
    if (!user) { throw new Error("User not found"); }

    const newAccessToken = generateAccessToken(
        user._id.toString(),
        user.role
    );

    const newRefreshToken = generateRefreshToken();
    const newRefreshTokenHash = hashRefreshToken(newRefreshToken);

    await updateSessionRefreshToken(
        sessionId,
        newRefreshTokenHash
    );

    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
    };
}

export const logoutUser = async (
    sessionId: string,
    userId: string
) => {
    const session = await getSession(sessionId);
    if (!session) { throw new Error("Session not found"); }

    if (session.userId !== userId) {
        throw new Error("Invalid session");
    }

    await deleteSession(sessionId, userId);

    return {
        message: "Logged out successfully"
    };
}

export const logoutAllDevices = async (
    userId: string
) => {
    await deleteAllUserSessions(userId);

    return {
        message: "Logged out from all devices successfully"
    };
}

export const getMe = async (userId: string) => {
    const user = await findUserById(userId);
    if (!user) { throw new Error("User not found"); }

    return user;
}