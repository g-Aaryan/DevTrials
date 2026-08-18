import express from "express";
import pingRouter from "./ping.router";
import leaderboardRouter from "./leaderboard.router";

const v1router = express.Router();


v1router.use('/ping',pingRouter)
v1router.use('/leaderboard',leaderboardRouter)

export default v1router;