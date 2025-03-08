"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const enum_1 = require("../../Src/Utils/constant/enum");
const userSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 15
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 15
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true,
        unique: true
    },
    role: {
        type: String,
        enum: Object.values(enum_1.roles),
        default: enum_1.roles.USER
    },
    isConfirmed: {
        type: Boolean,
        default: false
    },
    gender: {
        type: String,
        enum: Object.values(enum_1.gender),
        default: enum_1.gender.MALE
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    DOB: {
        type: String,
        default: () => new Date().toISOString() // ISO format string of the current date and time
    },
    otpEmail: String,
    expiredDateOtp: Date
});
//model
exports.User = (0, mongoose_1.model)('User', userSchema);
