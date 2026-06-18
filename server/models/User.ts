import mongoose,{Schema,Document} from "mongoose";

export interface IUser extends Document{
    email:string,
    password:string,
    userName:string,
    role:"user"|"manager"|"admin",
    otp?:string,
    otpExpiry?:Date,
    otpPurpose?:"LOGIN"|"FORRESETPASS",


}
const userSchma = new Schema<IUser>({
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
    },
    password:{
        type:String,
        required:true,
    },
    userName:{
        type:String,
        required:true,
        trim:true,
        unique:true,
    },
    role:{
        type:String,
        enum:["user","manager","admin"],
        default:"user",
    },
    otp:{
        type:String,
        
    },
    otpExpiry:{
        type:Date,

    },
    otpPurpose:{
        type:String,
        enum:["login","signUp"],
    }
},{
    timestamps:true,
});

const User = mongoose.model<IUser>("User",userSchma);
export default User;