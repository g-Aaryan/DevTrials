import jwt from "jsonwebtoken";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET!;

interface AccessTokenPayload {
    userId: string;
    role: string;
}

export const generateAccessToken = (
    userId: string,
    role: string
) => {
    return jwt.sign(
        { userId, role },
        JWT_SECRET,
        { expiresIn: "15m" }
    );
};

export const verifyAccessToken = (
    token: string
): AccessTokenPayload => {
    return jwt.verify(
        token,
        JWT_SECRET
    ) as AccessTokenPayload;
};

export const generateRefreshToken = () => {
    return crypto.randomBytes(64).toString("hex");
};

export const hashRefreshToken = (
    refreshToken: string
) => {
    return crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex");
};