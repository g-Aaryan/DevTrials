import { NextFunction, Request, Response } from "express";


export const AppErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

    console.log(err);

    if (err && typeof err.statusCode === "number") {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message
        });
    }

    next(err);
}

export const genericErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(err);

    res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });
}