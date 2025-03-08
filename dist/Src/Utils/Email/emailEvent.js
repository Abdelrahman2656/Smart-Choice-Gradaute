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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventEmitter = void 0;
const events_1 = __importDefault(require("events"));
const encryption_1 = require("../encryption");
const Database_1 = require("../../../Database");
const email_1 = require("./email");
const emailHtml_1 = require("./emailHtml");
const otp_1 = require("../OTP/otp");
exports.eventEmitter = new events_1.default;
exports.eventEmitter.on('sendEmail', (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, firstName, lastName } = data;
    const otp = String((0, otp_1.generateOTP)());
    const hash = yield (0, encryption_1.Hash)({ key: otp, SALT_ROUNDS: process.env.SALT_ROUNDS });
    const expiredDateOtp = new Date(Date.now() + 5 * 60 * 1000);
    yield Database_1.User.updateOne({ email }, { otpEmail: hash, expiredDateOtp });
    yield (0, email_1.sendEmail)({
        to: email,
        subject: "Please Verify",
        html: (0, emailHtml_1.emailHtml)(otp, `${firstName} ${lastName}`)
    });
}));
//second OTP to Confirm Password 
// eventEmitter.on('resentOtp',async(data)=>{
//     const {email}=data
//     const user = await User.findOne({ email });
//     if (!user || user.isConfirmed) return;
//     // التحقق مما إذا كان OTP لا يزال نشطًا
//     if (user.expiredDateOtp && user.expiredDateOtp.getTime() > Date.now()) {
//       console.log(`🔄 OTP is still valid for ${email}, no need to resend.`);
//       return;
//     }
//     const secondOtp = customAlphabet('123456789',6)()
//     const hash= await Hash({key:secondOtp , SALT_ROUNDS:process.env.SALT_ROUNDS})
//     const expiredDateOtp = new Date(Date.now() + 10 * 1000); // 30 seconds expiration
//     await User.updateOne({email},{otpEmail:hash, expiredDateOtp})
//     await sendEmail({
//         to:email,
//         subject:"Resend OTP To confirm Your Account",
//         html:emailHtml(secondOtp )
//     } )
//     console.log(`New OTP sent to ${email}: ${secondOtp}`); // Debugging log
// })
//forget password
exports.eventEmitter.on('forgetPassword', (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otpEmail, firstName, lastName } = data;
    yield (0, email_1.sendEmail)({
        to: email,
        subject: "OTP Forget Password",
        html: (0, emailHtml_1.emailHtml)(otpEmail, `${firstName} ${lastName}`)
    });
}));
//second OTP to Confirm Password 
// eventEmitter.on('resentOtp',async(data)=>{
//     const {email}=data
//     const user = await User.findOne({ email });
//     if (!user || user.isConfirmed) return;
//     // التحقق مما إذا كان OTP لا يزال نشطًا
//     if (user.expiredDateOtp && user.expiredDateOtp.getTime() > Date.now()) {
//       console.log(`🔄 OTP is still valid for ${email}, no need to resend.`);
//       return;
//     }
//     const secondOtp = customAlphabet('123456789',6)()
//     const hash= await Hash({key:secondOtp , SALT_ROUNDS:process.env.SALT_ROUNDS})
//     const expiredDateOtp = new Date(Date.now() + 10 * 1000); // 30 seconds expiration
//     await User.updateOne({email},{otpEmail:hash, expiredDateOtp})
//     await sendEmail({
//         to:email,
//         subject:"Resend OTP To confirm Your Account",
//         html:emailHtml(secondOtp )
//     } )
//     console.log(`New OTP sent to ${email}: ${secondOtp}`); // Debugging log
// })
//resend forget password
exports.eventEmitter.on('resendForgetPassword', (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otpEmail, firstName, lastName } = data;
    yield (0, email_1.sendEmail)({
        to: email,
        subject: "Resend OTP Forget Password",
        html: (0, emailHtml_1.emailHtml)(otpEmail, `${firstName} ${lastName}`)
    });
}));
