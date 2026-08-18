import {redis} from "../config/redis.config";

const LEADERBOARD_KEY = "leaderboard:global";

const getSolvedProblemsKey = (userId: string) =>
    `leaderboard:solved:${userId}`;


// Increment user's score
export const incrementScore = async (
    userId: string,
    points: number
) => {
    return await redis.zincrby(
        LEADERBOARD_KEY,
        points,
        userId
    );
};


// Get user's current score
export const getUserScore = async (
    userId: string
) => {
    return await redis.zscore(
        LEADERBOARD_KEY,
        userId
    );
};


// Get user's rank
export const getUserRank = async (
    userId: string
) => {
    const rank = await redis.zrevrank(
        LEADERBOARD_KEY,
        userId
    );

    if (rank === null) {
        return null;
    }

    return rank + 1;
};


// Get leaderboard users with scores
export const getTopUsers = async (
    start: number,
    stop: number
) => {
    return await redis.zrevrange(
        LEADERBOARD_KEY,
        start,
        stop,
        "WITHSCORES"
    );
};


// Get total number of users
export const getLeaderboardSize = async () => {
    return await redis.zcard(
        LEADERBOARD_KEY
    );
};


// Check if user exists in leaderboard
export const isUserInLeaderboard = async (
    userId: string
) => {
    const score = await redis.zscore(
        LEADERBOARD_KEY,
        userId
    );

    return score !== null;
};


// Check if user has already solved a problem
export const hasSolvedProblem = async (
    userId: string,
    problemId: string
) => {
    const key = getSolvedProblemsKey(userId);

    return (await redis.sismember(
        key,
        problemId
    )) === 1;
};


// Mark problem as solved
export const markProblemSolved = async (
    userId: string,
    problemId: string
) => {
    const key = getSolvedProblemsKey(userId);

    return await redis.sadd(
        key,
        problemId
    );
};