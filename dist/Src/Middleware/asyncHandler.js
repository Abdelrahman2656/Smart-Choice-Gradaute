"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const globalErrorHandling = (err, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (process.env.MODE == 'DEV') {
        return res.status(err.statusCode || 500).json({ message: err.message, success: false, stack: err.stack });
    }
    return res.status(err.statusCode || 500).json({ message: err.message, success: false });
});
exports.globalErrorHandling = globalErrorHandling;
