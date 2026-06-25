import jwt from "jsonwebtoken";

function generateToken(userId:string){
    return jwt.sign(
        {id:userId},
        process.env.JWT_SECRET!,
        {
            expiresIn:"7d",
        }
    );
};

export default generateToken;