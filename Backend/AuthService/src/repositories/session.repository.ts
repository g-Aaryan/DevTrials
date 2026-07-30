import {redis} from "../config/redis.config";

const SESSION_EXPIRY = 7 * 24 * 60 * 60;

export const createSession = async (
    sessionId: string,
    userId: string,
    refreshTokenHash: string
) => {
    await redis.set(
        `auth:session:${sessionId}`,
        JSON.stringify({
            userId,
            refreshTokenHash
        }),
        "EX",
        SESSION_EXPIRY
    );

    await redis.sadd(
        `auth:user-sessions:${userId}`,
        sessionId
    );
};

export const getSession = async (sessionId: string) => {
    const session = await redis.get(`auth:session:${sessionId}`);

    if (!session) return null;

    return JSON.parse(session);
};

export const deleteSession = async (
    sessionId: string,
    userId: string
) => {
    await redis.del(`auth:session:${sessionId}`);
    await redis.srem(`auth:user-sessions:${userId}`, sessionId);
};

export const deleteAllUserSessions = async (userId: string) => {
    const key = `auth:user-sessions:${userId}`;

    const sessionIds = await redis.smembers(key);

    if (sessionIds.length > 0) {
        const sessionKeys = sessionIds.map(
            (sessionId) => `auth:session:${sessionId}`
        );

        await redis.del(...sessionKeys);
    }

    await redis.del(key);
};

export const updateSessionRefreshToken = async (
    sessionId: string,
    refreshTokenHash: string
) => {
    const key = `auth:session:${sessionId}`;

    const session = await redis.get(key);
    if (!session) { return null; }

    const sessionData = JSON.parse(session);

    sessionData.refreshTokenHash = refreshTokenHash;

    await redis.set(
        key,
        JSON.stringify(sessionData),
        "EX",
        SESSION_EXPIRY
    );

    return sessionData;
};