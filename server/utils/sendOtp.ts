import Transpoter from "./email";
import dotenv from "dotenv";
dotenv.config();
const sendOtp = async(otp:string,email:string)=>{
    try{
        await Transpoter.sendMail({
            from:process.env.EMAIL,
            to:email,
            subject:"Your Otp Code",
            html:`
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>OTP Verification</h2>
                <p>Your OTP is:</p>
                <h1 style="letter-spacing: 4px;">${otp}</h1>
                <p>This OTP will expire in 5 minutes.</p>
            </div>
            `
        })
    }catch(err){
        console.log("Send otp error: ",err);
        throw err;
    }
}

export default sendOtp;

