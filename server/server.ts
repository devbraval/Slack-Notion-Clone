import express, { Request,Response,NextFunction } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
const router = express.Router();
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin:"http://localhost:5173",
        credentials:true,
    }),
);
app.use((err:any,req:Request,res:Response,next:NextFunction)=>{
    console.error(err);
    res.status(500).json({
        sucess:false,
        message:err.message,
    });
});

app.listen(PORT,()=>{
    console.log("Server is live");
    
})