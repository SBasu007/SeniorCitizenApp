import {Request,Response, Router} from "express";

const router = Router();

router.get("/signup",async(req:Request,res:Response)=>{
    return res.status(200).json({message:'router working'})
})

export default router;