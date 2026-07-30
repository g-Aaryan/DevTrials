import logger from "../config/logger.config";

const PROBLEM_SERVICE_URL =
  process.env.PROBLEM_SERVICE_URL || "http://localhost:3000";

export const getProblemById = async (problemId: string) => {
  logger.info(`Fetching problem with ID: ${problemId} from Problem Service`);
  

  const url = `${PROBLEM_SERVICE_URL}/api/v1/problem/${problemId}`;

  logger.info(`Constructed URL for Problem Service: ${url}`);
  const response = await fetch(
    url
  );

  logger.info(`Received response from Problem Service: ${response}`);

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      `Problem Service request failed: ${response.status}`
    );
  }

  const result = await response.json();

  return result.data;
};