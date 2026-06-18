import express, { Request,Response,NextFunction } from "express";
const router = express.Router();
const app = express();
const PORT = process.env.PORT;
app.use(express.json());
router.use("")
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