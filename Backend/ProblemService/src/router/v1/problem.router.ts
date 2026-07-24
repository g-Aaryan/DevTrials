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

const problemRouter = express.Router();

problemRouter.post("/",validateRequestBody(createProblemSchema), createProblem);

problemRouter.get("/", getAllProblems);

problemRouter.get("/:id", getProblemById);

problemRouter.put("/:id", validateRequestBody(updateProblemSchema), updateProblem);

problemRouter.delete("/:id", deleteProblem);

export default problemRouter;