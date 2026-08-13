import { NextFunction,Request,Response } from "express";
import * as submissionService from "../services/submission.service";
import { FilterQuery } from "mongoose";
import { ISubmission } from "../models/submission.model";
import logger from "../config/logger.config";
import { updateVerdict } from "../services/submission.service";
import { UnauthorizedError, ForbiddenError } from "../utils/errors/app.error";

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

    if (!req.user) {
      throw new UnauthorizedError("Unauthorized");
    }

    if (req.user.role !== "ADMIN" && submission.userId !== req.user.id) {
      throw new ForbiddenError("Forbidden: Access is denied");
    }

    res.status(200).json({
      success: true,
      data: submission,
    });
  } catch (error) {
    next(error);
  }
};

export const getMySubmissions = async (req: Request,res: Response,next: NextFunction) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError("Unauthorized");
    }
    const submissions =
      await submissionService.getSubmissionsByUser(req.user.id);
    res.status(200).json({
      success: true,
      data: submissions,
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
    if (!req.user) {
      throw new UnauthorizedError("Unauthorized");
    }
    if (req.user.role !== "ADMIN" && req.user.id !== userId) {
      throw new ForbiddenError("Forbidden: Access is denied");
    }
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
    if (!req.user) {
      throw new UnauthorizedError("Unauthorized");
    }
    let submissions;
    if (req.user.role === "ADMIN") {
      submissions = await submissionService.getSubmissionsByProblem(problemId);
    } else {
      submissions = await submissionService.getAllSubmissions({ problemId, userId: req.user.id });
    }
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

export async function updateSubmissionVerdictController(req: Request,res: Response,next: NextFunction){
    try {
        const { submissionId } = req.params;
        const { verdict, status } = req.body;

        console.log(req.params)
        console.log(`Updating submission ${submissionId} with verdict ${verdict} and status ${status}`);

        const submission = await updateVerdict(
            submissionId,
            verdict,
            status
        );

        return res.status(200).json({
            success: true,
            message: "Submission updated successfully",
            data: submission
        });

    } catch (error) {
        next(error);
    }
}

