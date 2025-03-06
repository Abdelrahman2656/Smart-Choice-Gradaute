import { User } from "../../../Database";
import { messages } from "../../Utils/constant/messages";
import { Encrypt, Hash } from "../../Utils/encryption";
import { AppNext, AppRequest, AppResponse } from "../../Utils/type";

//---------------------------------------------------Sign Up --------------------------------------------------------------
export const signUp = async(req:AppRequest,res:AppResponse,next:AppNext)=>{
//get data from req 
let {firstName,lastName,email,phone,password,role,gender}=req.body 
//check userExist
const userExist = await User.findOne(
    {email},
    
)
if(userExist){
    return next(new AppError(messages.user.alreadyExist,409))
}
//generate token 

//send email 


//encrypt phone 
let cipherText = await Encrypt({key:phone , secretKey:process.env.SECRET_CRYPTO} ) 
//hash password
password = await Hash({key:password ,SALT_ROUNDS:process.env.SALT_ROUNDS})

//create user 
const user = new User({
    firstName,
    lastName,
    email,
    phone:cipherText,
    password,
    role,
    gender
})
const userCreated = await user.save()
if(!userCreated){
    return next(new AppError(messages.user.failToCreate,500))
}
// response
return res.status(201).json({message:messages.user.createdSuccessfully,success:true , UserData:userCreated})
}
