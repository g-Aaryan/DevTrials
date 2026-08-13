import dotenv from 'dotenv';
type Serveconfig ={
    PORT:number
    DB_URL:string
    ACCESS_TOKEN_SECRET:string
}

function loadenv(){
    dotenv.config();
    console.log("Env variables loaded")
}

loadenv();

export const serverconfig:Serveconfig={
    PORT:Number(process.env.PORT)||3001,
    DB_URL:process.env.DB_URL||"mongodb://localhost:27017/lc_submission_db",
    ACCESS_TOKEN_SECRET:process.env.ACCESS_TOKEN_SECRET || "default_access_token_secret"
}