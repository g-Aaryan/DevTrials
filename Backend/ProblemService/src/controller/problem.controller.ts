import { NextFunction, Request, Response } from "express";
import { FilterQuery } from "mongoose";

import { IProblem } from "../models/problem.model";
import * as problemService from "../services/problem.service";

export const createProblem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const problem = await problemService.createProblem(req.body);

    res.status(201).json({
      success: true,
      message: "Problem created successfully",
      data: problem,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllProblems = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const filter = req.query as FilterQuery<IProblem>;

    const problems = await problemService.getAllProblems(filter);

    res.status(200).json({
      success: true,
      data: problems,
    });
  } catch (error) {
    next(error);
  }
};

export const getProblemById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const problem = await problemService.getProblemById(id);

    res.status(200).json({
      success: true,
      data: problem,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProblem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const updatedProblem = await problemService.updateProblem(
      id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Problem updated successfully",
      data: updatedProblem,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProblem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const deletedProblem = await problemService.deleteProblem(id);

    res.status(200).json({
      success: true,
      message: "Problem deleted successfully",
      data: deletedProblem,
    });
  } catch (error) {
    next(error);
  }
};