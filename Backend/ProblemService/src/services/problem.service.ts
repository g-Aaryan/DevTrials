import { FilterQuery } from "mongoose";

import { IProblem } from "../models/problem.model";
import * as problemRepository from "../repositories/problem.repository";
import { sanitizeMarkdown } from "../utils/sanitisemarkdown";

export const createProblem = async (
  problemData: Partial<IProblem>
) => {
  if (problemData.description) {
    problemData.description = await sanitizeMarkdown(
      problemData.description
    );
  }

  if (problemData.editorial) {
    problemData.editorial = await sanitizeMarkdown(
      problemData.editorial
    );
  }

  return await problemRepository.createProblem(problemData);
};

export const getAllProblems = async (
  filter: FilterQuery<IProblem> = {}
) => {
  return await problemRepository.getAllProblems(filter);
};

export const getProblemById = async (
  problemId: string
) => {
  const problem = await problemRepository.getProblemById(problemId);

  if (!problem) {
    throw new Error("Problem not found");
  }

  return problem;
};

export const updateProblem = async (
  problemId: string,
  updatedData: Partial<IProblem>
) => {
  if (updatedData.description) {
    updatedData.description = await sanitizeMarkdown(
      updatedData.description
    );
  }

  if (updatedData.editorial) {
    updatedData.editorial = await sanitizeMarkdown(
      updatedData.editorial
    );
  }

  const updatedProblem = await problemRepository.updateProblem(
    problemId,
    updatedData
  );

  if (!updatedProblem) {
    throw new Error("Problem not found");
  }

  return updatedProblem;
};

export const deleteProblem = async (
  problemId: string
) => {
  const deletedProblem = await problemRepository.deleteProblem(problemId);

  if (!deletedProblem) {
    throw new Error("Problem not found");
  }

  return deletedProblem;
};