import React, { useState } from 'react'
import useCooldown from '../hooks/useCooldown';
import Message from './Message';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faEye,faEyeSlash} from "@fortawesome/free-solid-svg-icons";
function Login() {
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const[showPass,setShowPass]= useState(false);
    const [message,setMessage] = useState("");
    const [success,setSuccess] = useState(false);
    const toggel = ()=>{
        setShowPass(!showPass);
    }
    const {isDisable,startCooldown,cooldown} = useCooldown(10);
    const handleLogin = async(e)=>{
        e.preventDefault();
        if(isDisable)return;
        startCooldown();
        try{
          const res = await fetch("http://localhost:8080/login",{
            method:"POST",
            headers:{
              "Content-type" : "application/json",
            },
            body:JSON.stringify({email,password})
          });

          const data = await res.json();
          if(!data.success){
            setMessage("Login Failed" || data.message);
            setSuccess(false);
            return ;
          }
          setMessage("Login successfully" || data.message);
          setSuccess(true);

        }catch(err){
            setMessage("Somthing went wrong");
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

        {/* Logo */}


        {/* Heading */}

        <h1 className="text-3xl font-bold text-center text-white">
          Welcome Back
        </h1>

        <p className="text-gray-400 text-center mt-2 mb-8">
          Sign in to your  account
        </p>
        <Message message={message} success={success} setMessage={setMessage}/>

        {/* Email */}

        <div className="mb-5">

          <label className="block text-sm text-gray-300 mb-2">
            Email
          </label>

          <input
            type="email"
            placeholder="name@example.com"
            onChange={(e)=>{setEmail(e.target.value)}}
            className="w-full rounded-xl bg-[#1F2937] border border-gray-700 px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition"
          />

        </div>

        {/* Password */}

        <div className="mb-2">

          <div className="flex justify-between mb-2">

            <label className="text-sm text-gray-300">
              Password
            </label>

            <button className="text-sm text-blue-400 hover:text-blue-300">
              Forgot Password?
            </button>

          </div>

          <div className="relative">

            <input
              type={showPass ? "text" :"password"}
              placeholder="••••••••"
              onChange={(e)=>{setPassword(e.target.vaule)}}
              className="w-full rounded-xl bg-[#1F2937] border border-gray-700 px-4 py-3 pr-12 text-white placeholder-gray-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition"
            />

            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              onClick={toggel}
            >
              <FontAwesomeIcon icon={showPass?faEyeSlash:faEye}/>
            </button>

          </div>

        </div>

    

        {/* Login Button */}

        <button
        onClick={handleLogin}
        disabled={isDisable}

          className={`w-full rounded-xl py-3 text-white ${cooldown > 0 ? "bg-gray-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700" }`}
        >
          Login
          {cooldown > 0
        ? `Redirect  in ${cooldown}s`
        : ""}
        </button>

        {/* Divider */}


        {/* Footer */}

        <p className="text-center text-gray-400 text-sm mt-8">

          Don't have an account?

          <button className="ml-2 text-blue-400 hover:text-blue-300">
            Create Account
          </button>

        </p>

      </div>

    </div>

  </div>
);
}

export default Login
