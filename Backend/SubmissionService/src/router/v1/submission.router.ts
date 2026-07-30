import express from "express";

import {
  createSubmission,
  getSubmissionById,
  getAllSubmissions,
  getSubmissionsByUser,
  getSubmissionsByProblem,
  deleteSubmission,
} from "../../controller/submission.controller";

import { validateRequestBody } from "../../validators/index";

import {
  createSubmissionSchema,
} from "../../validators/submission.validator";


const submissionRouter = express.Router();


// Create a submission
submissionRouter.post("/",validateRequestBody(createSubmissionSchema),createSubmission);

// Get all submissions
// Example: /submissions?status=COMPLETED
submissionRouter.get("/",getAllSubmissions);

// Get submissions of a particular user
submissionRouter.get( "/user/:userId",getSubmissionsByUser);

// Get submissions for a particular problem
submissionRouter.get("/problem/:problemId",getSubmissionsByProblem);

// Get one submission
submissionRouter.get("/:id",getSubmissionById);

// Delete submission
submissionRouter.delete("/:id",deleteSubmission);


export default submissionRouter;