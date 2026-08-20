import { apiClient } from "./client";

export const authApi = {
  async register(data: any) {
    const response = await apiClient.post("/api/v1/auth/register", data);
    return response.data;
  },

  async verifyEmail(data: any) {
    const response = await apiClient.post("/api/v1/auth/verify", data);
    return response.data;
  },

  async login(data: any) {
    const response = await apiClient.post("/api/v1/auth/login", data);
    return response.data;
  },

  async logout() {
    const response = await apiClient.post("/api/v1/auth/logout");
    return response.data;
  },

  async resendOtp(data: any) {
    const response = await apiClient.post("/api/v1/auth/resend-otp", data);
    return response.data;
  },

  async forgotPassword(data: any) {
    const response = await apiClient.post("/api/v1/auth/forgot-password", data);
    return response.data;
  },

  async resetPassword(data: any) {
    const response = await apiClient.post("/api/v1/auth/reset-password", data);
    return response.data;
  }
};
