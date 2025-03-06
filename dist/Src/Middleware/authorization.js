"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthorization = void 0;
const messages_1 = require("../Utils/constant/messages");
const isAuthorization = (roles = []) => {
    return (req, res, next) => {
        if (!req.authUser || !roles.includes(req.authUser.role)) {
            return next(new AppError(messages_1.messages.user.notAuthorized, 401));
        }
    };
};
exports.isAuthorization = isAuthorization;
