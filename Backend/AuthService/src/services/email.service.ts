import nodemailer from "nodemailer";
import {serverconfig} from "../config/index";

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: serverconfig.EMAIL_USER,
    pass: serverconfig.EMAIL_PASSWORD,
  },
});

export const sendVerificationOtp = async (
  email: string,
  otp: string
): Promise<void> => {
  await transporter.sendMail({
    from: serverconfig.EMAIL_USER,

    to: email,

    subject: "Verify your DevTrails email",

    text: `Your DevTrails verification OTP is ${otp}. This OTP expires in 5 minutes.`,
  });
};