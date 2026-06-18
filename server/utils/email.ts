import nodemailer,{Transporter} from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const Transpoter:Transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL,
        pass:process.env.PASS,
    },

});

Transpoter.verify((err)=>{
    if(err){
        console.log("NodeMailer Error");
    }else{
        console.log("Node Mailer is Ready");
    }
});

export default Transpoter;
