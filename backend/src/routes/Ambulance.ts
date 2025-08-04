import supabase from "../middleware/supabase.js";
import authenticateUser, { AuthenticatedRequest } from "../middleware/auth.js";
import { Router } from "express";
import { Request,Response } from "express";

const router:Router = Router();


router.get("/ambulances",authenticateUser,async(req:AuthenticatedRequest,res:Response)=>{
    try{
        const {data,error} = await supabase.rpc("get_available_ambulances");

        if(error){
            return res.status(400).json({message:"Error in database",error:error})
        }
        
        return res.status(200).json({message:"Available ambulances fetched",data:data})
    }catch(err){
        return res.status(500).json({message:"internal server error",error:err})
    }
})

export default router