import { submissionQueue } from "../queues/submission.queue";

export interface SubmissionJobPayload {
  submissionId: string;
  problemId: string;
  language: string;
  sourceCode: string;
}

export const addSubmissionJob = async (
  payload: SubmissionJobPayload
) => {
  return await submissionQueue.add(
    "execute-submission",
    payload,
    {
      attempts: 3,

      backoff: {
        type: "exponential",
        delay: 1000,
      },

      removeOnComplete: true,
      removeOnFail: false,
    }
  );
};