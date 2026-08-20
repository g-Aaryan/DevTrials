import { Job } from "bullmq";
import logger from "../config/logger.config";
import { getProblemById, } from "../clients/problem.client";
import { updateLeaderboard } from "../clients/leaderboard.client";
import { runcode } from "../utils/containers/codeRunner";
import { getImageName } from "../utils/getImage";
import { compareOutput } from "../utils/comparator";
import { generateFinalVerdict } from "../utils/verdict";
import { updateSubmission } from "../clients/submission.client";


export async function processSubmission(job: Job) {
    logger.info(`Received Payload:`);

    logger.info(job.data);
    console.log(`calling the api with ${job.data.problemId}`);
    const problem = await getProblemById(job.data.problemId);

    console.log(problem.hiddenTestcases);

    const results = [];
    for (const testcase of problem.hiddenTestcases) {
        const result = await runcode({
            code: job.data.sourceCode,
            language: job.data.language,
            input: testcase.input,
            timeout: 2000,
            imageName: getImageName(job.data.language)
        });

    results.push(result);
    }

    console.log(results);

    const testcaseResults = [];
    for (let i = 0; i < problem.hiddenTestcases.length; i++) {
        const testcase = problem.hiddenTestcases[i];
        const result = results[i];
        if (result.status === "time_limit_exceeded") {
            testcaseResults.push({
                testcase: i + 1,
                verdict: "TIME_LIMIT_EXCEEDED"
            });
            continue;
        }
        if (result.status === "failed") {
            testcaseResults.push({
                testcase: i + 1,
                verdict: "RUNTIME_ERROR"
            });
            continue;
        }
        const isCorrect = compareOutput(
            testcase.output,
            result.output
        );

        testcaseResults.push({
            testcase: i + 1,
            verdict: isCorrect ? "ACCEPTED" : "WRONG_ANSWER"
        });
    }
    console.log(`Testcase Results:`);
    console.log(testcaseResults);
    const finalVerdict = generateFinalVerdict(testcaseResults);
    console.log(`Updating submission ${job.data.submissionId} with verdict ${finalVerdict}`);
    await updateSubmission(job.data.submissionId,"COMPLETED",finalVerdict);
    if (finalVerdict === "ACCEPTED") {
        await updateLeaderboard(job.data.userId, job.data.problemId, job.data.difficulty);
    }

    logger.info(`Submission ${job.data.submissionId} updated successfully`);

}