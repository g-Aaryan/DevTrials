import { apiClient } from "./client";

export const leaderboardApi = {
  async getLeaderboard(params?: { page?: number; limit?: number }) {
    const response = await apiClient.get("/api/v1/leaderboard", { params });
    return response.data;
  },

  async getUserScore(userId: string) {
    const response = await apiClient.get(`/api/v1/leaderboard/${userId}`);
    return response.data;
  },

  async getUserRank(userId: string) {
    const response = await apiClient.get(`/api/v1/leaderboard/${userId}/rank`);
    return response.data;
  }
};
