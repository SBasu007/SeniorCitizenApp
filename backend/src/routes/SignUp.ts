import {Request,Response, Router} from "express";
import authenticateUser, { AuthenticatedRequest } from "../middleware/auth.js";
import supabase from "../middleware/supabase.js";
const router:Router = Router();

router.post("/signup", authenticateUser, async (req: AuthenticatedRequest, res: Response) => {
    try {
        // Get user ID from middleware
        const userId = req.user?.userId;
        console.log("User ID from middleware:", userId);
        
        return res.status(200).json({
            message: "route working as user verified",
            userId: userId
        });
    } catch (error) {
        console.error("❌ Signup API error:", error);
        return res.status(400).json({message: "Internal server error", error: error});
    }
})

export default router;