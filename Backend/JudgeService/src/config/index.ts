import dotenv from 'dotenv';
type Serveconfig ={
    PORT:number
    PROBLEM_SERVICE_URL:string
    SUBMISSION_SERVICE_URL:string
    LEADERBOARD_SERVICE_URL:string
}

function loadenv(){
    dotenv.config();
    console.log("Env variables loaded")
}

loadenv();

export const serverconfig:Serveconfig={
    PORT:Number(process.env.PORT)||3001,
    PROBLEM_SERVICE_URL:process.env.PROBLEM_SERVICE_URL||"http://localhost:3000/api/v1/problem",
    SUBMISSION_SERVICE_URL:process.env.SUBMISSION_SERVICE_URL||"http://localhost:3002/api/v1/submissions",
    LEADERBOARD_SERVICE_URL:process.env.LEADERBOARD_SERVICE_URL||"http://localhost:3010/api/v1/leaderboard/score"
}