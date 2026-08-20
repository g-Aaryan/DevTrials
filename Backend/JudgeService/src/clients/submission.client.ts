import axios from "axios";
import { serverconfig } from "../config";
export async function updateSubmission(
    submissionId: string,
    status: string,
    verdict: string
) {
    const url = `${serverconfig.SUBMISSION_SERVICE_URL}/${submissionId}`;
    console.log(url);
    console.log(`Updating submission ${submissionId} with status ${status} and verdict ${verdict}`);
try {

    const response = await axios.patch(
        url,
        {
            verdict,
            status
        }
    );

    return response.data;

} catch (error: any) {
    console.log("Status:", error.response?.status);
    console.log("Data:", error.response?.data);
    console.log("Message:", error.message);
    const message = error.response?.data?.message || error.message || 'Submission update failed';
    const status = error.response?.status || 500;
    throw new Error(`Submission update failed (${status}): ${message}`);
}


}