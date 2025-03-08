"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordVal = exports.forgetPasswordVal = exports.refreshTokenVal = exports.signInVal = exports.confirmEmailVal = exports.signUpVal = void 0;
const generalFields_1 = require("../../Utils/generalFields/generalFields");
const joi_1 = __importDefault(require("joi"));
//sign up
exports.signUpVal = joi_1.default.object({
    firstName: generalFields_1.generalFields.firstName.required(),
    lastName: generalFields_1.generalFields.lastName.required(),
    email: generalFields_1.generalFields.email.required(),
    password: generalFields_1.generalFields.password.required(),
    cPassword: generalFields_1.generalFields.cPassword.required(),
    phone: generalFields_1.generalFields.phone.optional(),
    gender: generalFields_1.generalFields.gender.required(),
    DOB: generalFields_1.generalFields.DOB,
    otpEmail: generalFields_1.generalFields.otpEmail
}).required();
//confirm Email
exports.confirmEmailVal = joi_1.default.object({
    email: generalFields_1.generalFields.email.required(),
    code: generalFields_1.generalFields.otpEmail.max(6).required()
}).required();
//sign in
exports.signInVal = joi_1.default.object({
    email: generalFields_1.generalFields.email.required(),
    password: generalFields_1.generalFields.password.required()
}).required();
//refresh token
exports.refreshTokenVal = joi_1.default.object({
    refreshToken: generalFields_1.generalFields.refreshToken.required()
}).required();
//forget password 
exports.forgetPasswordVal = joi_1.default.object({
    email: generalFields_1.generalFields.email.required()
});
//change password 
exports.changePasswordVal = joi_1.default.object({
    email: generalFields_1.generalFields.email.required(),
    password: generalFields_1.generalFields.password.required(),
    cPassword: generalFields_1.generalFields.cPassword.required(),
    otpEmail: generalFields_1.generalFields.otpEmail.required()
}).required();
