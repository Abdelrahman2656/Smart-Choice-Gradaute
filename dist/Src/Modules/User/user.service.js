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
exports.signUp = void 0;
const Database_1 = require("../../../Database");
const messages_1 = require("../../Utils/constant/messages");
const encryption_1 = require("../../Utils/encryption");
//---------------------------------------------------Sign Up --------------------------------------------------------------
const signUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //get data from req 
    let { firstName, lastName, email, phone, password, role, gender } = req.body;
    //check userExist
    const userExist = yield Database_1.User.findOne({ email });
    if (userExist) {
        return next(new AppError(messages_1.messages.user.alreadyExist, 409));
    }
    //generate token 
    //send email 
    //encrypt phone 
    let cipherText = yield (0, encryption_1.Encrypt)({ key: phone, secretKey: process.env.SECRET_CRYPTO });
    //hash password
    password = yield (0, encryption_1.Hash)({ key: password, SALT_ROUNDS: process.env.SALT_ROUNDS });
    //create user 
    const user = new Database_1.User({
        firstName,
        lastName,
        email,
        phone: cipherText,
        password,
        role,
        gender
    });
    const userCreated = yield user.save();
    if (!userCreated) {
        return next(new AppError(messages_1.messages.user.failToCreate, 500));
    }
    // response
    return res.status(201).json({ message: messages_1.messages.user.createdSuccessfully, success: true, UserData: userCreated });
});
exports.signUp = signUp;
