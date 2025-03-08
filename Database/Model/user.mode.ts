import { model, Schema } from "mongoose";
import { gender, roles } from "../../Src/Utils/constant/enum";

//schema
interface IUser{
firstName:string,
lastName:string,
email:string,
password:String,
isConfirmed:boolean,
gender:string,
phone:string,
isDeleted:boolean;
role:string
otpEmail:String
expiredDateOtp:Date
DOB:string
}

const userSchema = new Schema<IUser>({
firstName:{
    type:String,
    required:true,
    trim:true,
    minlength:3,
    maxlength:15

},
lastName:{
    type:String,
    required:true,
    trim:true,
    minlength:3,
    maxlength:15
},
email:{
    type:String,
    lowercase:true,
    unique:true,
    required:true
},
password:{
    type:String,
    required:true,
 
    trim:true
},
phone:{
    type:String,
    trim:true,
    unique:true
},
role:{
    type:String,
    enum:Object.values(roles),
    default:roles.USER
},
isConfirmed:{
    type:Boolean,
    default:false
},
gender:{
    type:String,
    enum:Object.values(gender),
    default:gender.MALE
},
isDeleted: {
    type: Boolean,
    default: false
},
DOB: {
    type: String,
    default: () => new Date().toISOString() // ISO format string of the current date and time
},
otpEmail:String,
expiredDateOtp:Date
})
//model
export const User = model<IUser>('User',userSchema)