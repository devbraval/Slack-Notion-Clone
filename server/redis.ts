import Redis from "ioredis";

const redisClient = new Redis({
    host:'localhost',
    port:6379,
});

redisClient.on('connect',()=>{
    console.log("Redis Connected");
});

redisClient.on('error',()=>{
    console.log("Error Ouccured while connecting with Redis");
    
});

export default redisClient;