import { customAlphabet } from "nanoid"

export const generateOTP = ()=>{
return Number(customAlphabet("123456789", 6)())
}