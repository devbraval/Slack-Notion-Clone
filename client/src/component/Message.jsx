import { useEffect } from "react";

function Message({ message, success,setMessage }) {
  if (!message) return null;
  useEffect(()=>{
    const timer = setTimeout(()=>{
        setMessage("");
    },4000);
    return() =>clearTimeout();
  },[message,setMessage]);
  return (
    <div
      className={`mb-4 rounded-lg px-4 py-3 text-center ${
        success
          ? "bg-green-500/20 text-green-400 border border-green-500"
          : "bg-red-500/20 text-red-400 border border-red-500"
      }`}
    >
      {message}
    </div>
  );
}

export default Message;