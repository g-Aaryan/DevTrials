import { FilterQuery } from "mongoose";
import {
  ISubmission,
  Submission,
} from "../models/submission.model";

export const createSubmission = async (
  submissionData: Partial<ISubmission>
) => {
  return await Submission.create(submissionData);
};

export const getSubmissionById = async (
  submissionId: string
) => {
  return await Submission.findById(submissionId);
};

export const getAllSubmissions = async (
  filter: FilterQuery<ISubmission> = {}
) => {
  return await Submission.find(filter).sort({
    createdAt: -1,
  });
};

export const getSubmissionsByUser = async (
  userId: string
) => {
  return await Submission.find({
    userId,
  }).sort({
    createdAt: -1,
  });
};

export const getSubmissionsByProblem = async (
  problemId: string
) => {
  return await Submission.find({
    problemId,
  }).sort({
    createdAt: -1,
  });
};

export const updateSubmission = async (
  submissionId: string,
  updatedData: Partial<ISubmission>
) => {
  return await Submission.findByIdAndUpdate(
    submissionId,
    updatedData,
    {
      new: true,
      runValidators: true,
    }
  );
};

export const deleteSubmission = async (
  submissionId: string
) => {
  return await Submission.findByIdAndDelete(
    submissionId
  );
};
export async function updateSubmissionVerdict(
    submissionId: string,
    verdict: ISubmission["verdict"],
    status: ISubmission["status"]
) {

    return await Submission.findByIdAndUpdate(
        submissionId,
        {
            verdict,
            status
        },
        {
            new: true
        }
    );

}