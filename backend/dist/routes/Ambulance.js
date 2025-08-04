import supabase from "../middleware/supabase";
import { Router } from "express";
const router = Router();
router.get("/ambulances", async (req, res) => {
    try {
        const { data, error } = await supabase.rpc("get_available_ambulances");
        if (error) {
            return res.status(400).json({ message: "Error in database", error: error });
        }
        return res.status(200).json({ message: "Available ambulances fetched", data: data });
    }
    catch (err) {
        return res.status(500).json({ message: "internal server error", error: err });
    }
});
export default router;
