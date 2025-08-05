import express from 'express';
import supabase from "../middleware/supabase.js";
import dotenv from 'dotenv';
dotenv.config();
const router = express.Router();
// GET /records/:userId
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
    const { data, error } = await supabase
        .from('health_parameters')
        .select('*')
        .eq('user_id', userId);
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.json(data);
});
export default router;
