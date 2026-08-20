import { apiClient } from "./client";

export const submissionsApi = {
  async submitCode(data: { problemId: string; language: string; sourceCode: string }) {
    const response = await apiClient.post("/api/v1/submissions", data);
    return response.data;
  },

  async getMySubmissions() {
    const response = await apiClient.get("/api/v1/submissions/me");
    return response.data;
  },

  async getSubmission(id: string) {
    const response = await apiClient.get(`/api/v1/submissions/${id}`);
    return response.data;
  },

  async getUserSubmissions(userId: string) {
    const response = await apiClient.get(`/api/v1/submissions/user/${userId}`);
    return response.data;
  },

  async getProblemSubmissions(problemId: string) {
    const response = await apiClient.get(`/api/v1/submissions/problem/${problemId}`);
    return response.data;
  }
};
