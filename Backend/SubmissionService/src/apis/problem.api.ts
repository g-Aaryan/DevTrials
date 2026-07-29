const PROBLEM_SERVICE_URL =
  process.env.PROBLEM_SERVICE_URL || "http://localhost:3000";

export const getProblemById = async (
  problemId: string
) => {
  const response = await fetch(
    `${PROBLEM_SERVICE_URL}/api/v1/problems/${problemId}`
  );

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