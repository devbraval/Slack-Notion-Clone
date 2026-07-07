import React, { useRef, useState } from 'react';
import {useLocation,useNavigate} from "react-router-dom";
import Message from './Message';
import { fas } from '@fortawesome/free-solid-svg-icons';
import useCooldown from "../hooks/useCooldown"
const Otp = () => {
    const [otp,setOtp] = useState(new Array(6).fill(""));
    const inpRef = useRef([]);
    const location = useLocation();
    const [message,setMessage] = useState("");
    const [success,setSuccess] = useState(false);
    const  {isDisable,cooldown,startCooldown} = useCooldown();
    const navigate = useNavigate();
    const handleChange = (value,index)=>{
        if(! /^[0-9]?/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if(value && index < 5){
            inpRef.current[index+1]?.focus();
        }
    }
    const handleKeyDown = (e,index)=>{
        if(e.key !== "Backspace") return;
        e.preventDefault();
        const newOtp = [...otp];
        if(newOtp[index]){
            newOtp[index] = "";
            setOtp(newOtp);
        }
        if(index > 0){
            inpRef.current[index-1]?.focus();
        }
    }
    const handleOtpVerify = async(e)=>{
      e.preventDefault();
      startCooldown();
      const code = otp.join("");
      if(code.length !== 6){
        setMessage("Otp is not complete");
        setSuccess(false);
        return;
      }
      let url = "";
      let redirect = "/dashboard";
      if(location.pathname === "/signup-otp"){
        url = "http://localhost:8080/verify-signup-otp";
      }else if(location.pathname === "/login-otp"){
        url = "http://localhost:8080/verify-login-otp";
      }else if(location.pathname === "/forgot-password-otp"){
        url = "http://localhost:8080/forgot-password-otp";
        redirect = "/set-password";
      }else{
        setMessage("Invalid otp page");
        setSuccess(false);
        return;
      }
      try{
        const res = await fetch(url,{
          method:"POST",
          headers:{
            "Content-Type":"application/json",
          },
          body:JSON.stringify({otp:code}),
        });
        const data = await res.json();
        if(!data.success){
          setMessage(data.message ||"Otp verification failed");
          setSuccess(false);
          return;
        }
        setMessage(data.message ||"Otp verified successfully");
        setSuccess(true);
        navigate(redirect);
      }catch(err){
        setMessage("Somthing went wrong");
        setSuccess(false);
      }
      }
return (
  <div className="min-h-screen bg-[#09090B] flex items-center justify-center px-4">

    {/* Background */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute -top-40 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"></div>
    </div>

    <div className="relative w-full max-w-md">

      <div className="bg-[#111827]/80 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-2xl p-8">

        <h1 className="text-3xl font-bold text-center text-white">
          Verify OTP
        </h1>

        <p className="text-gray-400 text-center mt-2 mb-8">
          Enter the 6-digit verification code sent to your email.
        </p>

        {/* OTP Inputs */}
        <div className="flex justify-center gap-3 mb-8">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={digit}
              ref={(el) => (inpRef.current[index] = el)}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="
                w-12
                h-14
                rounded-xl
                bg-[#1F2937]
                border
                border-gray-700
                text-white
                text-xl
                text-center
                font-semibold
                outline-none
                transition
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-500/30
              "
            />
          ))}
        </div>

        {/* Verify Button */}
        <button
        
          className={`w-full text-white py-3 rounded-xl transition font-medium ${
    cooldown > 0
      ? "bg-gray-600 cursor-not-allowed"
      : "bg-blue-600 hover:bg-blue-700"
  }`}
          // ""
          onClick={handleOtpVerify}
          disabled={isDisable}
        >
          Verify OTP
          {cooldown > 0 ? `Redirect  in ${cooldown}s`:""}
        </button>

        {/* Resend */}
        <p className="text-center text-gray-400 text-sm mt-6">
          Didn't receive the code?
        </p>

        <button className="w-full mt-2 text-blue-400 hover:text-blue-300 font-medium">
          Resend OTP
        </button>

      </div>
    </div>
  </div>
);
}

export default Otp;