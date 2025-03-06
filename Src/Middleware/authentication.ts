import { User } from "../../Database";
import { messages } from "../Utils/constant/messages";
import { verifyToken } from "../Utils/Token/token"
import { AppNext, AppRequest, AppResponse } from "../Utils/type"

interface AuthenticatedRequest extends AppRequest {
    authUser?: any; 
  }
export const isAuthentication =()=>{
    return async(req:AuthenticatedRequest,res:AppResponse, next:AppNext)=>{
       try{
  // get token 
  const token = req.headers["authorization"] as string | undefined;


  if (!token){
    return next(new AppError('Token Required',401))
  }
  //decode token 
  const payload = verifyToken({token})

  if (typeof payload === "string" || "message" in payload) {
    return next(new AppError((payload as { message: string }).message, 401));
  }
  //userExist 
  let authUser = await User.findOne({_id:payload._id,isConfirmed:true})
  if(!authUser){
    return next(new AppError(messages.user.notFound,404))
  }
  req.authUser = authUser
       }catch(error){
        return next(new AppError("Authentication failed", 500));
       }

    }
  
}

