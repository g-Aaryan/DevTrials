import { FilterQuery } from "mongoose";
import { IProblem, Problem } from "../models/problem.model";

export const createProblem = async (
  problemData: Partial<IProblem>
) => {
  return await Problem.create(problemData);
};

export const getAllProblems = async (
  filter: FilterQuery<IProblem> = {}
) => {
  return await Problem.find(filter);
};

export const getProblemById = async (
  problemId: string
) => {
  return await Problem.findById(problemId);
};

export const updateProblem = async (
  problemId: string,
  updatedData: Partial<IProblem>
) => {
  return await Problem.findByIdAndUpdate(
    problemId,
    updatedData,
    {
      new: true,
      runValidators: true,
    }
  );
};

export const deleteProblem = async (
  problemId: string
) => {
  return await Problem.findByIdAndDelete(problemId);
};