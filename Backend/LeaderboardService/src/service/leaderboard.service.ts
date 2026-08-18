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
    difficulty: "EASY" | "MEDIUM" | "HARD"
) => {
    console.log("SERVICE HIT");
    const alreadySolved = await hasSolvedProblem(
        userId,
        problemId
    );

    if (alreadySolved) {
        return {
            pointsAwarded: 0,
            alreadySolved: true
        };
    }

    const points = POINTS[difficulty];

    await incrementScore(userId, points);

    await markProblemSolved(userId, problemId);

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

