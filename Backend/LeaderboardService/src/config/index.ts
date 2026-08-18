import dotenv from 'dotenv';
type Serveconfig ={
    PORT:number
    REDIS_PORT:number
    REDIS_HOST:string
}

function loadenv(){
    dotenv.config();
    console.log("Env variables loaded")
}

loadenv();

export const serverconfig:Serveconfig={
    PORT:Number(process.env.PORT)||3001,
    REDIS_PORT:Number(process.env.REDIS_PORT)||6379,
    REDIS_HOST:process.env.REDIS_HOST||"localhost"
}