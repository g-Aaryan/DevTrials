import { Request, Response, NextFunction } from "express";

export const authorize = (...allowedRoles: string[]) => {
    return (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            if (!req.user) {
                throw new Error("Unauthorized");
            }

            if (!allowedRoles.includes(req.user.role)) {
                throw new Error("Forbidden");
            }

            next();

        } catch (error) {
            next(error);
        }
    };
};