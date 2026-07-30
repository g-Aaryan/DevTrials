import express from "express";
import pingRouter from "./ping.router";
import submissionRouter from "./submission.router";

const v1router = express.Router();

v1router.use('/ping',pingRouter)
v1router.use('/submissions',submissionRouter)

export default v1router;