import express from "express";
import pingRouter from "./ping.router";
import problemRouter from "./problem.router";

const v1router = express.Router();

v1router.use('/ping',pingRouter)
v1router.use('/problem',problemRouter)

export default v1router;