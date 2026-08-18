import  Redis from "ioredis";
import logger from "./logger.config";
import { serverconfig } from ".";

const redisConfig = {
    host: serverconfig.REDIS_HOST ,
    port: serverconfig.REDIS_PORT,
    maxRetriesPerRequest: null,
}

export const redis = new Redis(redisConfig);

redis.on("connect", () => {
    logger.info("Connected to redis successfully");
});

redis.on("error", (error) => {
    logger.error("Redis connection error", error);
});



