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
exports.isAuthentication = void 0;
const Database_1 = require("../../Database");
const AppError_1 = require("../Utils/AppError/AppError");
const messages_1 = require("../Utils/constant/messages");
const token_1 = require("../Utils/Token/token");
const isAuthentication = () => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // get token 
            let { authorization } = req.headers;
            if (!(authorization === null || authorization === void 0 ? void 0 : authorization.startsWith('abdelrahman'))) {
                return next(new AppError_1.AppError('Invalid Bearer Token', 401));
            }
            let token = authorization.split(' ')[1];
            if (!token) {
                return next(new AppError_1.AppError('Token Required', 401));
            }
            //decode token 
            const payload = (0, token_1.verifyToken)({ token });
            if (typeof payload === "string" || "message" in payload) {
                return next(new AppError_1.AppError(payload.message, 401));
            }
            //userExist 
            let authUser = yield Database_1.User.findOne({ _id: payload._id, isConfirmed: true });
            if (!authUser) {
                return next(new AppError_1.AppError(messages_1.messages.user.notFound, 404));
            }
            req.authUser = authUser;
        }
        catch (error) {
            return next(new AppError_1.AppError("Authentication failed", 500));
        }
    });
};
exports.isAuthentication = isAuthentication;
