import express,{Response,Request} from "express";
const router = express.Router();
import errorHandler from "../utils/ExpressError";
import User from "../models/User";
import mongoose from "mongoose";

interface SignUpBody{
    email:string,
    password:string,
    userName:string,
};
router.post("/sign-up",errorHandler(async(req:Request<{},{},SignUpBody>,res:Response)=>{
    const {email,password,userName} = req.body;
    const existingUser = await User.findOne({email});
    if(existingUser){
        return res.status(400).json({
            success:false,
            message:"User Already Exist",
        });
    }
    
}))