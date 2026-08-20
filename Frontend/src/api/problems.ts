import { apiClient } from "./client";

export const problemsApi = {
  async getProblems(params?: any) {
    const response = await apiClient.get("/api/v1/problem", { params });
    return response.data;
  },

  async getProblem(id: string) {
    const response = await apiClient.get(`/api/v1/problem/${id}`);
    return response.data;
  },

  async createProblem(data: any) {
    const response = await apiClient.post("/api/v1/problem", data);
    return response.data;
  },

  async updateProblem(id: string, data: any) {
    const response = await apiClient.put(`/api/v1/problem/${id}`, data);
    return response.data;
  },

  async deleteProblem(id: string) {
    const response = await apiClient.delete(`/api/v1/problem/${id}`);
    return response.data;
  }
};
