import express, { Request, Response, NextFunction } from "express";

import {
  createSubmission,
  getSubmissionById,
  getAllSubmissions,
  getSubmissionsByUser,
  getSubmissionsByProblem,
  deleteSubmission,
  updateSubmissionVerdictController,
  getMySubmissions,
} from "../../controller/submission.controller";

import { validateRequestBody } from "../../validators/index";

import {
  createSubmissionSchema,
  updateSubmissionVerdictSchema,
} from "../../validators/submission.validator";
import { authenticateJWT, authorize } from "../../middlewares/auth.middleware";

const submissionRouter = express.Router();

const injectUserId = (req: Request, res: Response, next: NextFunction) => {
  if (req.user) {
    req.body.userId = req.user.id;
  }
  next();
};

// Create a submission
submissionRouter.post("/", authenticateJWT, injectUserId, validateRequestBody(createSubmissionSchema), createSubmission);

// Get submissions of the currently logged in user (must be before /:id)
submissionRouter.get("/me", authenticateJWT, getMySubmissions);

// Get all submissions (Admin only)
// Example: /submissions?status=COMPLETED
submissionRouter.get("/", authenticateJWT, authorize(["ADMIN"]), getAllSubmissions);

// Get submissions of a particular user (Self or Admin check in controller)
submissionRouter.get( "/user/:userId", authenticateJWT, getSubmissionsByUser);

// Get submissions for a particular problem (Self or Admin filtering in controller)
submissionRouter.get("/problem/:problemId", authenticateJWT, getSubmissionsByProblem);

// Get one submission (Self or Admin check in controller)
submissionRouter.get("/:id", authenticateJWT, getSubmissionById);

// Delete submission (Admin only)
submissionRouter.delete("/:id", authenticateJWT, authorize(["ADMIN"]), deleteSubmission);

submissionRouter.patch("/:submissionId",validateRequestBody(updateSubmissionVerdictSchema),updateSubmissionVerdictController);


export default submissionRouter;