"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOTP = void 0;
const nanoid_1 = require("nanoid");
const generateOTP = () => {
    return Number((0, nanoid_1.customAlphabet)("123456789", 6)());
};
exports.generateOTP = generateOTP;
