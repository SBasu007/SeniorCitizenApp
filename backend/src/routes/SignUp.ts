import {Request,Response, Router} from "express";
import { supabase } from "../supabase.server.js";


const router:Router = Router();

router.post("/signup",async(req:Request,res:Response)=>{
    const user_id = "something"
    const user_email = "sometheing@gmail.com"
    try{
        const {data,error} = await supabase.from('users').insert([
            {
                user_id:user_id,
                email:user_email
            }
        ])
        if(error){
            return res.status(500).json({message:"Error posting user signup details",error:error});
        }

        return res.status(200).json({message:"Data inserted succesfully",});
    }catch(err){
        return res.status(400).json({message:"Internal server error",error:err});
    }
})

export default router;