import { Router } from "express";
import { asyncHandler } from "../../Middleware/asyncHandler";
import * as US from './user.service'

const userRouter = Router()

userRouter.post('/user',asyncHandler(US.signUp))

export default userRouter