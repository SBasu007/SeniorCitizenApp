import {Request,Response, Router} from "express";
import authenticateUser from "../middleware/auth.js";
import supabase from "../middleware/supabase.js";

const router:Router = Router();

router.post("/signup",authenticateUser,async(req:Request,res:Response)=>{
    try{
        return res.status(200).json({message:"route working as user verified"});
    }catch(error){
        console.error("❌ Signup API error:", error);
        return res.status(400).json({message:"Internal server error",error:error});
    }
})

export default router;