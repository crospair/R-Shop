import jwt from "jsonwebtoken";
import UserModel from "../../Models/UserModel.js";

export const Roles = {Admin:'Admin' , User:'User'};

export const Auth = (AccessRoles = [])=>{
    return async (req,res,next)=>{
        const {authorization} = req.headers;
        if(!authorization?.startsWith(process.env.BEARER)){
            return res.status(400).json({Message:"Invalid Authorization"});
        }
        const token = authorization.split(process.env.BEARER)[1];
        const decoded = jwt.verify(token,process.env.LOGINSIGNATURE);
        if(!decoded){
            return res.status(400).json({Message:"Invalid Token"});
        }
        const User = await UserModel.findById(decoded.ID).select("Username Role");
        if(!User){
            return res.status(404).json({Message:'User Nonexistent'});
        }
        if(!AccessRoles.includes(User.Role)){
            return res.status(403).json({Message:'403 Forbidden'})
        }
        req.user = User;
        next()
    }
}