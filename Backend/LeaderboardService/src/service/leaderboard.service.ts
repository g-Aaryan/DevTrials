import {
    incrementScore,
    getUserScore,
    getUserRank,
    getTopUsers,
    getLeaderboardSize,
    hasSolvedProblem,
    markProblemSolved
} from "../repositories/leaderboard.repository";

const POINTS = {
    EASY: 10,
    MEDIUM: 20,
    HARD: 30
};

export const processAcceptedSubmission = async (
    userId: string,
    problemId: string,
    difficulty: string
) => {
    console.log("SERVICE HIT for userId:", userId, "problemId:", problemId, "difficulty:", difficulty);
    const alreadySolved = await hasSolvedProblem(
        userId,
        problemId
    );

    if (alreadySolved) {
        console.log("Problem already solved by user", userId);
        return {
            pointsAwarded: 0,
            alreadySolved: true
        };
    }

    const diffKey = (difficulty || "EASY").toUpperCase() as keyof typeof POINTS;
    const points = POINTS[diffKey] || 10;

    await incrementScore(userId, points);

    await markProblemSolved(userId, problemId);

    console.log(`Successfully awarded ${points} points to user ${userId}`);

    return {
        pointsAwarded: points,
        alreadySolved: false
    };
};

export const getScore = async (
    userId: string
) => {
    return await getUserScore(userId);
};


export const getRank = async (
    userId: string
) => {
    return await getUserRank(userId);
};


export const getLeaderboard = async (
    page: number,
    limit: number
) => {
    const start = (page - 1) * limit;
    const stop = start + limit - 1;

    const users = await getTopUsers(start, stop);
    const total = await getLeaderboardSize();

    return {
        users,
        total,
        page,
        limit
    };
};

