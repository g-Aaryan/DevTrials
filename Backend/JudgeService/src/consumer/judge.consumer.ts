import { Worker } from "bullmq";
import { SUBMISSION_QUEUE } from "../utils/constants";
import { createNewRedisConnection } from "../config/redis.config";
import logger from "../config/logger.config";
import { processSubmission } from "../processors/submission.processor";

async function setupSubmissionWorker() {
    const worker = new Worker(
        SUBMISSION_QUEUE,

        async (job) => {
            logger.info(`Processing submission job: ${job.id}`);

            await processSubmission(job);
        },

        {
            connection: createNewRedisConnection()
        }
    );

    worker.on("completed", (job) => {
        logger.info(`Submission job completed: ${job.id}`);
    });

    worker.on("failed", (job, error) => {
        logger.error(`Submission job failed: ${job?.id}`, error);
    });

    worker.on("error", (error) => {
        logger.error(`Submission worker error: ${error}`);
    });
}

export async function startWorkers() {
    await setupSubmissionWorker();
}