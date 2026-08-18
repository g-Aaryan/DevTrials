import { Request, Response } from "express";

import {
    processAcceptedSubmission,
    getScore,
    getRank,
    getLeaderboard
} from "../service/leaderboard.service";


// Update leaderboard after accepted submission
export const updateLeaderboard = async (
    req: Request,
    res: Response
) => {
    try {
        const {
            userId,
            problemId,
            difficulty
        } = req.body;
        console.log("CONTROLLER HIT");
        const result = await processAcceptedSubmission(
            userId,
            problemId,
            difficulty
        );

        res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update leaderboard"
        });
    }
};


// Get user's score
export const getUserScoreController = async (
    req: Request,
    res: Response
) => {
    try {
        const { userId } = req.params;

        const score = await getScore(userId);

        res.status(200).json({
            success: true,
            data: {
                userId,
                score: score ? Number(score) : 0
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch score"
        });
    }
};


// Get user's rank
export const getUserRankController = async (
    req: Request,
    res: Response
) => {
    try {
        const { userId } = req.params;

        const rank = await getRank(userId);

        res.status(200).json({
            success: true,
            data: {
                userId,
                rank
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch rank"
        });
    }
};


// Get leaderboard
export const getLeaderboardController = async (
    req: Request,
    res: Response
) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const leaderboard = await getLeaderboard(
            page,
            limit
        );

        res.status(200).json({
            success: true,
            data: leaderboard
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch leaderboard"
        });
    }
};