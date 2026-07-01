import React, { useEffect, useState } from 'react'

function useCooldown(second = 30) {
    const [cooldown ,setCooldown] = useState(0);
    const startCooldown = ()=>{
        setCooldown(second);
    }
    useEffect(()=>{
        if(cooldown == 0) return;
        const timer = setTimeout(()=>{
            setCooldown((prev)=>prev -1);
        },1000); 
        return()=>clearTimeout(); 
    },[cooldown]);
  return {
    isDisable:cooldown > 1,
    startCooldown,
    cooldown,
  }
};

export default useCooldown;
