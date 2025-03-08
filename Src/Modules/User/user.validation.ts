import { generalFields } from "../../Utils/generalFields/generalFields";
import joi from 'joi'
//sign up
export const signUpVal = joi.object({
firstName:generalFields.firstName.required(),
lastName:generalFields.lastName.required(),
email:generalFields.email.required(),
password:generalFields.password.required(),
cPassword:generalFields.cPassword.required(),
phone:generalFields.phone.optional(),
gender:generalFields.gender.required(),
DOB:generalFields.DOB,
otpEmail:generalFields.otpEmail

}).required()
//confirm Email
export const confirmEmailVal = joi.object({
    email:generalFields.email.required(),
    code:generalFields.otpEmail.max(6).required()
}).required()
//sign in
export const signInVal = joi.object({
    email:generalFields.email.required(),
    password:generalFields.password.required()
}).required()
//refresh token
export const refreshTokenVal = joi.object({
    refreshToken:generalFields.refreshToken.required()
}).required()
//forget password 
export const forgetPasswordVal = joi.object({
    email:generalFields.email.required()
})
//change password 
export const changePasswordVal =joi.object({
    email:generalFields.email.required(),
    password:generalFields.password.required(),
    cPassword:generalFields.cPassword.required(),
    otpEmail:generalFields.otpEmail.required()
}).required()