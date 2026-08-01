import axios from "axios";
import {serverconfig} from "../config/index";


export async function getProblemById(problemId: string) {

    const url = `${serverconfig.PROBLEM_SERVICE_URL}/${problemId}`;
    console.log(`calling the api with ${url}`)
    const response = await axios.get(url);

    return response.data.data;
}