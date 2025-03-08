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
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = (_a) => __awaiter(void 0, [_a], void 0, function* ({ to, subject, html, attachments = [] }) {
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        port: 456,
        secure: true,
        auth: {
            user: process.env.USER_SENDER,
            pass: process.env.PASS_EMAIL
        }
    });
    yield transporter.sendMail({
        to,
        from: `"Smart Choice" <${process.env.USER_SENDER}>`,
        subject,
        html,
        attachments
    });
});
exports.sendEmail = sendEmail;
