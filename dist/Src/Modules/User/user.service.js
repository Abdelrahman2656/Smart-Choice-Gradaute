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
exports.changePassword = exports.forgetPassword = exports.refreshToken = exports.activateAccount = exports.login = exports.ConfirmEmail = exports.signUp = void 0;
const Database_1 = require("../../../Database");
const AppError_1 = require("../../Utils/AppError/AppError");
const messages_1 = require("../../Utils/constant/messages");
const emailEvent_1 = require("../../Utils/Email/emailEvent");
const encryption_1 = require("../../Utils/encryption");
const token_1 = require("../../Utils/Token/token");
const otp_1 = require("../../Utils/OTP/otp");
//---------------------------------------------------Sign Up --------------------------------------------------------------
const signUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //get data from req
    let { firstName, lastName, email, phone, password, role, gender } = req.body;
    //check userExist
    let userExist = yield Database_1.User.findOne({ email });
    if (userExist) {
        // If OTP exists and is still valid, return an error
        if (userExist.otpEmail &&
            userExist.expiredDateOtp &&
            userExist.expiredDateOtp.getTime() > Date.now()) {
            return next(new AppError_1.AppError(messages_1.messages.user.AlreadyHasOtp, 400));
        }
    }
    //send email
    emailEvent_1.eventEmitter.emit("sendEmail", { email, firstName, lastName });
    //encrypt phone
    let cipherText = yield (0, encryption_1.Encrypt)({
        key: phone,
        secretKey: process.env.SECRET_CRYPTO,
    });
    //hash password
    password = yield (0, encryption_1.Hash)({
        key: password,
        SALT_ROUNDS: process.env.SALT_ROUNDS,
    });
    //create user
    const user = new Database_1.User({
        firstName,
        lastName,
        email,
        phone: cipherText,
        password,
        role,
        gender,
    });
    const userCreated = yield user.save();
    if (!userCreated) {
        return next(new AppError_1.AppError(messages_1.messages.user.failToCreate, 500));
    }
    // response
    return res.status(201).json({
        message: messages_1.messages.user.createdSuccessfully,
        success: true,
        UserData: userCreated,
    });
});
exports.signUp = signUp;
//---------------------------------------------------Confirm Email --------------------------------------------------------------
const ConfirmEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //get data from req
    let { code, email } = req.body;
    //check email existence
    let userExist = yield Database_1.User.findOne({ email });
    if (!userExist) {
        return next(new AppError_1.AppError(messages_1.messages.user.notFound, 404));
    }
    if (userExist.isConfirmed == true) {
        return next(new AppError_1.AppError(messages_1.messages.user.AlreadyVerified, 401));
    }
    if (!userExist.otpEmail) {
        return next(new AppError_1.AppError("OTP Not Found", 400));
    }
    //compare otp
    let match = (0, encryption_1.comparePassword)({
        password: String(code),
        hashPassword: userExist.otpEmail.toString(),
    });
    if (!match) {
        return next(new AppError_1.AppError(messages_1.messages.user.invalidOTP, 400));
    }
    //update user
    yield Database_1.User.updateOne({ email }, { isConfirmed: true, $unset: { otpEmail: "", expiredDateOtp: "" } });
    yield userExist.save();
    //send response
    return res
        .status(201)
        .json({ message: messages_1.messages.user.verifiedSuccessfully, success: true });
});
exports.ConfirmEmail = ConfirmEmail;
//---------------------------------------------------Login --------------------------------------------------------------
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //get data from req
    let { email, password } = req.body;
    //check user existence
    const userExist = yield Database_1.User.findOne({ email });
    if (!userExist) {
        return next(new AppError_1.AppError(messages_1.messages.user.notFound, 404));
    }
    //compare password
    let match = (0, encryption_1.comparePassword)({
        password,
        hashPassword: userExist.password.toString(),
    });
    if (!match) {
        return next(new AppError_1.AppError(messages_1.messages.user.Incorrect, 400));
    }
    //generate token
    const accessToken = (0, token_1.generateToken)({
        payload: { email, id: userExist.id },
        options: { expiresIn: 10 },
    });
    const refreshToken = (0, token_1.generateToken)({
        payload: { email, id: userExist.id },
        options: { expiresIn: "7d" },
    });
    //return response
    return res
        .status(200)
        .json({
        message: messages_1.messages.user.loginSuccessfully,
        success: true,
        accessToken,
        refreshToken,
    });
});
exports.login = login;
//---------------------------------------------------Activate Account--------------------------------------------------------------
const activateAccount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //get data from req
    let { token } = req.params;
    if (!token) {
        return next(new AppError_1.AppError("Verification token is missing", 400));
    }
    // decode token
    const result = (0, token_1.verifyToken)({ token });
    if (!result || typeof result !== "object" || !("id" in result)) {
        return next(result);
    }
    // update user
    let user = yield Database_1.User.findByIdAndUpdate(result.id, { isConfirmed: true });
    if (!user) {
        return next(new AppError_1.AppError(messages_1.messages.user.notFound, 404));
    }
    //return response
    res.status(200).json({ message: messages_1.messages.user.login, success: true });
});
exports.activateAccount = activateAccount;
//---------------------------------------------------Refresh Token--------------------------------------------------------------
const refreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //get token from req
    let { refreshToken } = req.body;
    if (!refreshToken) {
        return next(new AppError_1.AppError("Verification token is missing", 400));
    }
    //decode token
    const result = (0, token_1.verifyToken)({ token: refreshToken });
    if ("message" in result) {
        return next(new Error(result.message));
    }
    //generate token
    const accessToken = (0, token_1.generateToken)({
        payload: { email: result.email, id: result.id },
        options: { expiresIn: "7d" },
    });
    //send response
    return res.status(200).json({ success: true, accessToken });
});
exports.refreshToken = refreshToken;
//---------------------------------------------------Forget Password--------------------------------------------------------------
const forgetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //get email from req
    let { email } = req.body;
    //checkExistence
    const userExist = yield Database_1.User.findOne({ email });
    if (!userExist) {
        return next(new AppError_1.AppError(messages_1.messages.user.notFound, 404));
    }
    //check if user already have otp
    if (userExist.otpEmail && userExist.expiredDateOtp.getTime() > Date.now()) {
        return next(new AppError_1.AppError(messages_1.messages.user.AlreadyHasOtp, 400));
    }
    //generate OTP
    let forgetOTP = String((0, otp_1.generateOTP)());
    //hash
    userExist.otpEmail = forgetOTP;
    userExist.expiredDateOtp = new Date(Date.now() + 20 * 1000);
    //update
    setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
        yield Database_1.User.updateOne({ _id: userExist._id, expiredDateOtp: { $lte: Date.now() } }, { $unset: { otpEmail: "", expiredDateOtp: "" } });
    }), 20 * 1000);
    //save to db
    yield userExist.save();
    //send email
    emailEvent_1.eventEmitter.emit("forgetPassword", {
        email,
        otpEmail: userExist.otpEmail,
        firstName: userExist.firstName,
        lastName: userExist.lastName,
    });
    //send response
    return res
        .status(200)
        .json({ message: messages_1.messages.user.checkEmail, success: true });
});
exports.forgetPassword = forgetPassword;
//---------------------------------------------------Change Password--------------------------------------------------------------
const changePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //get data from req
    let { otpEmail, email, password } = req.body;
    //check existence
    const userExist = yield Database_1.User.findOne({ email });
    if (!userExist) {
        return next(new AppError_1.AppError(messages_1.messages.user.notFound, 404));
    }
    //check otp
    if (userExist.otpEmail !== otpEmail) {
        return next(new AppError_1.AppError(messages_1.messages.user.invalidOTP, 401));
    }
    //if otp expired
    if (userExist.expiredDateOtp.getTime() < Date.now()) {
        //generate otp
        let secondForgetPassword = String((0, otp_1.generateOTP)());
        //add to otp
        userExist.otpEmail = secondForgetPassword;
        userExist.expiredDateOtp = new Date(Date.now() + 20 * 1000);
        //save to db
        yield userExist.save();
        //send resend email
        emailEvent_1.eventEmitter.emit("resendForgetPassword", {
            email,
            otpEmail: secondForgetPassword,
            firstName: userExist.firstName,
            lastName: userExist.lastName,
        });
    }
    //if every thing good then
    let hashPassword = (0, encryption_1.Hash)({
        key: password,
        SALT_ROUNDS: process.env.SALT_ROUNDS,
    });
    //update in db
    yield Database_1.User.updateOne({ email }, { password: hashPassword, $unset: { otpEmail: "", expiredDateOtp: "" } });
    //send response 
    return res.status(200).json({ success: true, message: messages_1.messages.user.updateSuccessfully });
});
exports.changePassword = changePassword;
