import { Router } from "express";
import authenticateUser from "../middleware/auth.js";
const router = Router();
router.post("/signup", authenticateUser, async (req, res) => {
    try {
        return res.status(200).json({ message: "route working as user verified" });
    }
    catch (error) {
        console.error("❌ Signup API error:", error);
        return res.status(400).json({ message: "Internal server error", error: error });
    }
});
export default router;
