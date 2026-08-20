import axios from "axios";
import {serverconfig} from "../config/index";


export async function updateLeaderboard(userId: string, problemId: string, difficulty: string) {
    const url = `${serverconfig.LEADERBOARD_SERVICE_URL}`;
    try {
        const response = await axios.post(url, {
            userId,
            problemId,
            difficulty
        });
        return response.data.data;
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || 'Leaderboard update failed';
        const status = error.response?.status || 500;
        throw new Error(`Leaderboard update failed (${status}): ${message}`);
    }
}