import express from 'express';
import supabase from "../middleware/supabase.js";
import dotenv from 'dotenv';
dotenv.config();
const router = express.Router();
// GET /records/:userId
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
    const { data, error } = await supabase
        .from('records')
        .select('*')
        .eq('user_id', userId);
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.json(data);
});
// GET /parameters/:userId
router.get('/parameters/:userId', async (req, res) => {
    const { userId } = req.params;
    const { data, error } = await supabase
        .rpc('get_unique_health_parameters', { user_id_received: userId });
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.json(data);
});
router.get('/parameter-data/:userId/:parameterName', async (req, res) => {
    const { userId, parameterName } = req.params;
    const { data, error } = await supabase
        .rpc('get_parameter_data_by_user_and_name', {
        user_id_input: userId,
        parameter_name_input: parameterName
    });
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.json(data);
});
export default router;
