import express,{Response,Request} from "express";
const router = express.Router();
import errorHandler from "../utils/ExpressError";
import User from "../models/User";
import mongoose from "mongoose";
import sendOtp from "../utils/sendOtp";
import genrateOtp from "../utils/gentareOtp";
import bcrypt from "bcrypt";

interface SignUpBody{
    email:string,
    password:string,
    userName:string,
};
router.post("/sign-up",errorHandler(async(req:Request<{},{},SignUpBody>,res:Response)=>{
    const {email,password,userName} = req.body;
    if(!email || !password || !userName){
        return res.status(400).json({
            success:false,
            message:"All fileds are Required",
        });
    };
    const existingUser = await User.findOne({email});
    if(existingUser){
        return res.status(400).json({
            success:false,
            message:"User Already Exist",
        });
    }
    const existingUserName = await User.findOne({userName});
    if(existingUserName){
        return res.status(400).json({
            success:false,
            message:"UserName Already existing",
        });
    }
    const otp = genrateOtp();
    const hashedPass = await bcrypt.hash(password,10);
    const hashedOtp = await bcrypt.hash(otp,10);
    await sendOtp(otp,email);
    await User.create({
        email:email,
        password:hashedPass,
        userName:userName,
        otp:hashedOtp,
        otpExpiry:Date.now() * 5 * 60 *1000,
    });
    res.status(200).json({
        success:true,
        message:"User Registered successfully",
    });
    
}));

interface LoginBody{
    email:string,
    password:string,
}
router.post("/login",errorHandler(async(req:Request<{},{},LoginBody>,res:Response)=>{
    const {email,password} = req.body;
    if(!email || !password){
        return res.status(400).json({
            success:false,
            message:"All fileds are Required",
        });
    };
    const existingUser = await User.findOne({email});
    if(!existingUser){
        return res.status(400).json({
            success:false,
            message:"The User is already Exist",
        });
    };
    const comparPass = bcrypt.compare(password,existingUser.password);
    if(!comparPass){
        return res.status(400).json({
            success:false,
            message:"The User is not Exist",
        });
    }
    const otp = genrateOtp();
    await sendOtp(otp,email);
    const hashedOtp = bcrypt.hash(otp,10);
    await User.updateOne({
        otp:hashedOtp,
        
    })
}))