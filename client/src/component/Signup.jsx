import React, { useState } from 'react'
import useCooldown from "../hooks/useCooldown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faEye,faEyeSlash, faLeaf} from "@fortawesome/free-solid-svg-icons";
import Message from './Message';
const Signup = () => {
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [userName,setUserName] = useState("");
    const [message,setMessage] = useState("");
    const [success,setSuccess] = useState(false);
    const [showPass,setShowPass]= useState(false);
    const toggel = ()=>{
        setShowPass(!showPass);
    }
    const {isDisable,startCooldown,cooldown} = useCooldown(10);
    
    const handleSignup = async(e)=>{
        e.preventDefault();
        if(isDisable) return;
         console.log("1. Signup button clicked");
        startCooldown();
        try{
            console.log("2. Before fetch");
            const res = await fetch("http://localhost:8080/signup",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                },
                body:JSON.stringify({email,password,userName}),
            });
              console.log("3. Response received");
            const data = await res.json();
             console.log("4. Setting message");

            if(!data.success){
                setMessage("Sign up faild" || data.message);
                setSuccess(false);
                return;
            }
            setMessage("Sign up successfully" || data.message);
            setSuccess(true);
        }catch(err){
            setMessage("Something went wrong!" );
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
        Create Account
      </h1>

      <p className="text-gray-400 text-center mt-2 mb-8">
        Sign up to create your account
      </p>
      <Message message={message} success={success} setMessage={setMessage}/>
  

      {/* Username */}
      <div className="mb-5">
        <label className="block text-sm text-gray-300 mb-2">
          Username
        </label>

        <input
          type="text"
          placeholder="Enter your username"
          onChange={(e)=>setUserName(e.target.value)}
          className="w-full rounded-xl bg-[#1F2937] border border-gray-700 px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition"
        />
      </div>

      {/* Email */}
      <div className="mb-5">
        <label className="block text-sm text-gray-300 mb-2">
          Email
        </label>

        <input
          type="email"
          placeholder="name@example.com"
          onChange={(e)=>setEmail(e.target.value)}
          className="w-full rounded-xl bg-[#1F2937] border border-gray-700 px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition"
        />
      </div>

      {/* Password */}
      <div className="mb-6">

        <label className="block text-sm text-gray-300 mb-2">
          Password
        </label>

        <div className="relative">

          <input
            placeholder="••••••••"
            onChange={(e)=>setPassword(e.target.value)}
            type={showPass?"text" : "password"}
            className="w-full rounded-xl bg-[#1F2937] border border-gray-700 px-4 py-3 pr-12 text-white placeholder-gray-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition"
          />

          <button 
            type="button"
           onClick={toggel}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <FontAwesomeIcon icon={showPass?faEyeSlash:faEye}/>
          </button>

        </div>

      </div>

      {/* Signup Button */}
      <button
      onClick={handleSignup}
        className={`w-full rounded-xl py-3 text-white ${cooldown >0 ? "bg-gray-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
      >
        Sign Up
        {cooldown > 0 ? `Redirect  in ${cooldown}s` : ""}
      </button>

      {/* Footer */}
      <p className="text-center text-gray-400 text-sm mt-8">
        Already have an account?

        <button className="ml-2 text-blue-400 hover:text-blue-300">
          Login
        </button>
      </p>

    </div>

  </div>

</div>
  )
}

export default Signup
