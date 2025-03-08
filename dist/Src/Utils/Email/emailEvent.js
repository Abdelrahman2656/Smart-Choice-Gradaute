"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventEmitter = void 0;
const events_1 = __importDefault(require("events"));
const Database_1 = require("../../../Database");
const encryption_1 = require("../encryption");
const email_1 = require("./email");
const emailHtml_1 = require("./emailHtml");
exports.eventEmitter = new events_1.default;
exports.eventEmitter.on('sendEmail', async (data) => {
    const { email, firstName, lastName } = data;
    // 🔹 Dynamically import `nanoid`
    const { customAlphabet } = await Promise.resolve().then(() => __importStar(require("nanoid")));
    const otp = String(Number(customAlphabet("123456789", 6)()));
    const hash = await (0, encryption_1.Hash)({ key: otp, SALT_ROUNDS: process.env.SALT_ROUNDS });
    const expiredDateOtp = new Date(Date.now() + 5 * 60 * 1000);
    await Database_1.User.updateOne({ email }, { otpEmail: hash, expiredDateOtp });
    await (0, email_1.sendEmail)({
        to: email,
        subject: "Please Verify",
        html: (0, emailHtml_1.emailHtml)(otp, `${firstName} ${lastName}`)
    });
});
//second OTP to Confirm Password 
//forget password
exports.eventEmitter.on('forgetPassword', async (data) => {
    const { email, otpEmail, firstName, lastName } = data;
    await (0, email_1.sendEmail)({
        to: email,
        subject: "OTP Forget Password",
        html: (0, emailHtml_1.emailHtml)(otpEmail, `${firstName} ${lastName}`)
    });
});
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
exports.eventEmitter.on('resendForgetPassword', async (data) => {
    const { email, otpEmail, firstName, lastName } = data;
    await (0, email_1.sendEmail)({
        to: email,
        subject: "Resend OTP Forget Password",
        html: (0, emailHtml_1.emailHtml)(otpEmail, `${firstName} ${lastName}`)
    });
});
