import { ISubmission } from "../models/submission.model";
import { BadRequestError } from "../utils/errors/app.error";
import { getProblemById } from "../apis/problem.api";
import * as submissionRepository from "../repositories/submission.repository";
import { FilterQuery } from "mongoose";
import { addSubmissionJob } from "../producers/submission.producer";
import logger from "../config/logger.config";


export const createsubmission = async (submissionData: Partial<ISubmission>)=>{
    if(!submissionData.problemId) {
        throw new BadRequestError("Problem ID is required");
   }
    if(!submissionData.sourceCode) {
            throw new BadRequestError("Source code is required");
    }

    if(!submissionData.language) {
            throw new BadRequestError("Language is required");
    }

      logger.info("getting problem by id")
      const problem = await getProblemById(submissionData.problemId);

    if (!problem) {throw new Error("Problem not found");}

    const submission = await submissionRepository.createSubmission({
      ...submissionData,
      status: "PENDING",
      verdict: "PENDING",
    });
    try {
        await addSubmissionJob({
            submissionId: submission.id,
            problemId: submission.problemId,
            language: submission.language,
            sourceCode: submission.sourceCode,
        });

    const queuedSubmission =
      await submissionRepository.updateSubmission(
        submission.id,
        {  status: "QUEUED"}
      );

    return queuedSubmission;
  } catch (error) {
    await submissionRepository.updateSubmission(
      submission.id,
      {status: "FAILED"}
    );
     throw new Error("Failed to queue submission");
  }

}

export const getSubmissionById = async (submissionId: string) => {
  const submission = await submissionRepository.getSubmissionById(submissionId);
  if (!submission) {
    throw new Error("Submission not found");
  }

  return submission;
};

export const getAllSubmissions = async (filter: FilterQuery<ISubmission> = {}) => {
  return await submissionRepository.getAllSubmissions(filter);
};

export const getSubmissionsByUser = async (userId: string) => {
  return await submissionRepository.getSubmissionsByUser(userId);
};

export const getSubmissionsByProblem = async (problemId: string) => {
  return await submissionRepository.getSubmissionsByProblem(problemId);
};

export const deleteSubmission = async (submissionId: string) => {
  const deletedSubmission = await submissionRepository.deleteSubmission(submissionId);

  if (!deletedSubmission) {
    throw new Error("Submission not found");
  }

  return deletedSubmission;
};

export const updateSubmissionStatus = async (submissionId: string,status: ISubmission["status"]) => {
  const updatedSubmission =
    await submissionRepository.updateSubmission(
      submissionId,
      { status}
    );

  if (!updatedSubmission) {
    throw new Error("Submission not found");
  }

  return updatedSubmission;
};


export const updateSubmissionResult = async (
  submissionId: string,
  result: {
    status: ISubmission["status"];
    verdict: ISubmission["verdict"];
    executionTime?: number;
    memoryUsed?: number;
  }
) => {
  const updatedSubmission =
    await submissionRepository.updateSubmission(
      submissionId,
      result
    );

  if (!updatedSubmission) {
    throw new Error("Submission not found");
  }

  return updatedSubmission;
};