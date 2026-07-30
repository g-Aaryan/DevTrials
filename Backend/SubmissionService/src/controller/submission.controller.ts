import { NextFunction,Request,Response } from "express";
import * as submissionService from "../services/submission.service";
import { FilterQuery } from "mongoose";
import { ISubmission } from "../models/submission.model";
import logger from "../config/logger.config";

export const createSubmission = async (req: Request,res: Response,next: NextFunction) => {
  try {
    logger.info("Creating submission with data:", req.body);
    const submission = await submissionService.createsubmission(req.body);
    res.status(201).json({
      success: true,
      message: "Submission created and queued successfully",
      data: submission,
    });
   }catch (error) {
    next(error);
  }
};

export const getSubmissionById = async (req: Request,res: Response,next: NextFunction) => {
  try {
    const { id } = req.params;
    const submission =
      await submissionService.getSubmissionById(id);

    res.status(200).json({
      success: true,
      data: submission,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllSubmissions = async (req: Request,res: Response,next: NextFunction) => {
  try {
    const filter = req.query as FilterQuery<ISubmission>;
    const submissions =
      await submissionService.getAllSubmissions(filter);
    res.status(200).json({
      success: true,
      data: submissions,
    });
  } catch (error) {
    next(error);
  }
};

export const getSubmissionsByUser = async (req: Request,res: Response,next: NextFunction) => {
  try {
    const { userId } = req.params;
    const submissions =
      await submissionService.getSubmissionsByUser(userId);
    res.status(200).json({
      success: true,
      data: submissions,
    });
  } catch (error) {
    next(error);
  }
};


export const getSubmissionsByProblem = async (req: Request,res: Response,next: NextFunction) => {
  try {
    const { problemId } = req.params;
    const submissions =
      await submissionService.getSubmissionsByProblem(
        problemId
      );
    res.status(200).json({
      success: true,
      data: submissions,
    });
  } catch (error) {
    next(error);
  }
};


export const deleteSubmission = async (req: Request,res: Response,next: NextFunction) => {
  try {
    const { id } = req.params;
    const deletedSubmission =
      await submissionService.deleteSubmission(id);
    res.status(200).json({
      success: true,
      message: "Submission deleted successfully",
      data: deletedSubmission,
    });
  } catch (error) {
    next(error);
  }
};

