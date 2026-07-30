import crypto from "crypto";
import {serverconfig} from "../config/index";

export const generateOtp = (): string => {
  return crypto.randomInt(100000, 1000000).toString();
};

export const hashOtp = (otp: string): string => {
  return crypto
    .createHmac("sha256", serverconfig.OTP_SECRET)
    .update(otp)
    .digest("hex");
};

export const verifyOtp = (
  otp: string,
  storedOtpHash: string
): boolean => {
  return hashOtp(otp) === storedOtpHash;
};