import express,{Response,Request} from "express";
const router = express.Router();
import errorHandler from "../utils/ExpressError";
import User from "../models/User";
import sendOtp from "../utils/sendOtp";
import genrateOtp from "../utils/gentareOtp";
import bcrypt from "bcrypt";
import redisClient from "../redis";
import generateToken from "../utils/generateToken";
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

    await redisClient.hset(`signup:${email}`,{
        email,
        password:hashedPass,
        userName,
        otp:hashedOtp,
        otpExpiry:Date.now()+5*1000*60,
    });
    res.cookie('email',email,{
        httpOnly:true,
        maxAge:5*60*1000,
        sameSite:"strict",
    });
    await redisClient.expire(`signup:${email}`,300);
    return res.status(200).json({
        success:true,
        message:"User Registered successfully",
    });
    
}));
interface OtpBody{
    Otp:string,
}
router.post("/verify-signup-otp",errorHandler(async(req:Request<{},{},OtpBody>,res:Response)=>{
    const email = req.cookies.email;
    const {Otp} =  req.body;
    if(!email){
        return res.status(401).json({
            success:false,
            message:"Session Expires",
        });
    }
    const userData = await redisClient.hgetall(`signup:${email}`);
    if(!userData.email){
        return res.status(401).json({
            success:false,
            message:"Data for signUp is not available",
        });
    }
    const compair = await bcrypt.compare(Otp,userData.otp);
    if(!compair){
        return res.status(401).json({
            success:false,
            message:"Wrong Otp",
        });
    }
    if(userData.otpExpiry && Number(userData.otpExpiry) < Date.now()){
        return res.status(401).json({
            success:false,
            message:"Expired Otp",
        });
    }
    await User.create({
        email:userData.email,
        userName:userData.userName,
        password:userData.password,
        otp:null,
        otpExpiry:null,
    });
    const existingUser = await User.findOne({email});
    if(!existingUser){
        return res.status(400).json({
            success:false,
            message:"The User is not exist",
        });
    }; 
    const token = generateToken(existingUser._id.toString());
    res.cookie("token",token,{
        httpOnly:true,
        sameSite:"strict",
        maxAge:7*24*60*60*1000,
    });
    await redisClient.del(`signup:${email}`);
    res.clearCookie("email");
    return res.status(200).json({
        success:true,
        message:"User Created Successfully",
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
            message:"The User is not exist",
        });
    };
    const comparPass = await bcrypt.compare(password,existingUser.password);
    if(!comparPass){
        return res.status(400).json({
            success:false,
            message:"Wrong Password",
        });
    }
    const otp = genrateOtp();
    await sendOtp(otp,email);
    const hashedOtp = await bcrypt.hash(otp,10);
    await User.updateOne({email},{
        otp:hashedOtp,
        otpExpiry:Date.now() + 5*60 * 1000,
    });
    res.cookie("email",email,{
        httpOnly:true,
        sameSite:"strict",
        maxAge:5*60*1000,
    });
    return res.status(200).json({
        success:true,
        message:"The User is Logged in Successfully",
    });
}));
router.post("/verify-login-otp",errorHandler(async(req:Request<{},{},OtpBody>,res:Response)=>{
    const email = req.cookies.email;
    const {Otp} = req.body;
    const existingUser = await User.findOne({email});
    if(!existingUser){
        return res.status(401).json({
            success:false,
            message:"User is not Registered",
        });
    }
    if(existingUser.otpExpiry && existingUser.otpExpiry.getTime() < Date.now() ){
        return res.status(401).json({
            success:false,
            message:"Expired Otp",
        });
    }
    const compair = await bcrypt.compare(Otp,existingUser.otp!);

    if(!compair){
        return res.status(401).json({
            success:false,
            message:"Wrong Otp",
        });
    }
    const token = generateToken(existingUser._id.toString());
    res.cookie("token",token,{
        httpOnly:true,
        sameSite:"strict",
        maxAge:7*24*60*60*1000,
    });
    await User.updateOne({email},{
        otp:null,
        otpExpiry:null,
    });
    res.clearCookie("email");
    return res.status(200).json({
            success:true,
            message:"Otp Verified",
        });
}));
