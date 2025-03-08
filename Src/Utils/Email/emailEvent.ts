import EventEmitter from "events";
import { User } from "../../../Database";
import { Hash } from "../encryption";
import { sendEmail } from "./email";
import { emailHtml } from "./emailHtml";



export const eventEmitter = new EventEmitter

eventEmitter.on('sendEmail',async(data)=>{
    const {email ,firstName,lastName}=data
     // 🔹 Dynamically import `nanoid`
     const { customAlphabet } = await import("nanoid");
    const otp = String(Number(customAlphabet("123456789", 6)()))
    const hash= await Hash({key: otp , SALT_ROUNDS:process.env.SALT_ROUNDS})
    const expiredDateOtp = new Date(Date.now() + 5* 60 * 1000);
    await User.updateOne({email},{otpEmail:hash, expiredDateOtp})
    await sendEmail({
        to:email,
        subject:"Please Verify",
        html:emailHtml(otp ,`${firstName} ${lastName}`)

    } )
    
    
})
//second OTP to Confirm Password 


//forget password
eventEmitter.on('forgetPassword',async(data)=>{
    const {email,otpEmail,firstName,lastName}=data

    await sendEmail({
        to:email,
        subject:"OTP Forget Password",
        html:emailHtml(otpEmail,`${firstName} ${lastName}`)

    } )
    
    
})

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
eventEmitter.on('resendForgetPassword',async(data)=>{
    const {email,otpEmail,firstName,lastName}=data

    await sendEmail({
        to:email,
        subject:"Resend OTP Forget Password",
        html:emailHtml(otpEmail,`${firstName} ${lastName}`)

    } )
    
    
})