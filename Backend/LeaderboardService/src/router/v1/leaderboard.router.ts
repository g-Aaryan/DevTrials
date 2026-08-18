import express from "express";
import {
    updateLeaderboard,
    getUserScoreController,
    getUserRankController,
    getLeaderboardController
} from "../../controller/leaderboard.controller";

const leaderboardRouter = express.Router();

leaderboardRouter.post("/score",updateLeaderboard);

leaderboardRouter.get("/",getLeaderboardController);

leaderboardRouter.get("/:userId",getUserScoreController);

leaderboardRouter.get("/:userId/rank",getUserRankController);

export default leaderboardRouter;