import express from "express";

import {
    register,
    verifyEmail,
    resendOtp,
    login,
    refresh,
    logout,
    logoutAll,
    me
} from "../../controller/auth.controller";

import { authenticate } from "../../middlewares/auth.middleware";
import { validateRequestBody } from "../../validators/index";

import {
    registerSchema,
    verifyEmailSchema,
    resendOtpSchema,
    loginSchema
} from "../../validators/auth.validator";

const authRouter = express.Router();


authRouter.post(
    "/register",
    validateRequestBody(registerSchema),
    register
);


authRouter.post(
    "/verify-email",
    validateRequestBody(verifyEmailSchema),
    verifyEmail
);


authRouter.post(
    "/resend-otp",
    validateRequestBody (resendOtpSchema),
    resendOtp
);


authRouter.post(
    "/login",
    validateRequestBody(loginSchema),
    login
);


authRouter.post(
    "/refresh",
    refresh
);


authRouter.post(
    "/logout",
    authenticate,
    logout
);


authRouter.post(
    "/logout-all",
    authenticate,
    logoutAll
);


authRouter.get(
    "/me",
    authenticate,
    me
);


export default authRouter;