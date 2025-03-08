"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandling = exports.asyncHandler = void 0;
const AppError_1 = require("../Utils/AppError/AppError");
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch((err) => {
            next(new AppError_1.AppError(err.message, err.statusCode || 500));
        });
    };
};
exports.asyncHandler = asyncHandler;
const globalErrorHandling = async (err, req, res, next) => {
    if (process.env.MODE == 'DEV') {
        return res.status(err.statusCode || 500).json({ message: err.message, success: false, stack: err.stack });
    }
    return res.status(err.statusCode || 500).json({ message: err.message, success: false });
};
exports.globalErrorHandling = globalErrorHandling;
