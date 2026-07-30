import {redis} from "../config/redis.config";

const OTP_EXPIRY_SECONDS = 5 * 60;

const getOtpKey = (userId: string): string => {
  return `auth:email-otp:${userId}`;
};


// Store OTP hash in Redis for 5 minutes
export const storeOtp = async (
  userId: string,
  hashedOtp: string
): Promise<void> => {

  const key = getOtpKey(userId);

  await redis.set(
    key,
    hashedOtp,
    "EX",
    OTP_EXPIRY_SECONDS
  );
};


// Get stored OTP hash
export const getOtp = async (
  userId: string
): Promise<string | null> => {

  const key = getOtpKey(userId);

  return await redis.get(key);
};


// Delete OTP after successful verification
export const deleteOtp = async (
  userId: string
): Promise<void> => {

  const key = getOtpKey(userId);

  await redis.del(key);
};