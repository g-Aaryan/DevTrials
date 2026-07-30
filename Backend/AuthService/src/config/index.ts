import dotenv from 'dotenv';
type Serveconfig ={
    PORT:number
    REDIS_HOST:string
    REDIS_PORT:number
    DB_URL:string
    OTP_SECRET:string
}

function loadenv(){
    dotenv.config();
    console.log("Env variables loaded")
}

loadenv();

export const serverconfig:Serveconfig={
    PORT:Number(process.env.PORT)||3001,
    REDIS_HOST:process.env.REDIS_HOST||"localhost",
    REDIS_PORT:Number(process.env.REDIS_PORT)||6379,
    DB_URL:process.env.DB_URL||"mongodb://localhost:27017/lc_auth_userdb",
    OTP_SECRET:process.env.OTP_SECRET||"default_otp_secret"
}
