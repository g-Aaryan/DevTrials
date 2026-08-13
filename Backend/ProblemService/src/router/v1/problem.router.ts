import express from "express";

import {
  createProblem,
  getAllProblems,
  getProblemById,
  updateProblem,
  deleteProblem,
} from "../../controller/problem.controller";
import { validateRequestBody } from "../../validators";
import { createProblemSchema, updateProblemSchema } from "../../validators/problem.validator";
import { authenticateJWT, authorize } from "../../middlewares/auth.middleware";

const problemRouter = express.Router();

problemRouter.post("/", authenticateJWT, authorize(["ADMIN"]), validateRequestBody(createProblemSchema), createProblem);

problemRouter.get("/", getAllProblems);

problemRouter.get("/:id", getProblemById);

problemRouter.put("/:id", authenticateJWT, authorize(["ADMIN"]), validateRequestBody(updateProblemSchema), updateProblem);

problemRouter.delete("/:id", authenticateJWT, authorize(["ADMIN"]), deleteProblem);

export default problemRouter;