import axios from "axios";
import {serverconfig} from "../config/index";


export async function updateLeaderboard(userId: string, problemId: string, difficulty: string) {

    const url = `${serverconfig.LEADERBOARD_SERVICE_URL}`;

    const response = await axios.post(url, {
        userId,
        problemId,
        difficulty
    });

    return response.data.data;
}