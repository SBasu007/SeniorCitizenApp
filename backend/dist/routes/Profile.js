import express from 'express';
import dotenv from 'dotenv';
import supabase from '../middleware/supabase';
dotenv.config();
const router = express.Router();
// PUT: Update user profile
router.put('/update/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { name, age, disease, phone, email, avatar } = req.body;
        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: 'Name and email are required fields'
            });
        }
        const { data, error } = await supabase
            .from('profile')
            .upsert({
            user_id: userId,
            name,
            age: age ? parseInt(age) : null,
            disease,
            phone,
            email,
            avatar,
            updated_at: new Date().toISOString()
        })
            .select();
        if (error) {
            console.error('Supabase error:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to update profile',
                error: error.message
            });
        }
        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: data[0]
        });
    }
    catch (error) {
        console.error('Server error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});
// Get user profile
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { data, error } = await supabase
            .from('profile')
            .select('*')
            .eq('user_id', userId)
            .single();
        if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
            console.error('Supabase error:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch profile',
                error: error.message
            });
        }
        res.status(200).json({
            success: true,
            data: data || null
        });
    }
    catch (error) {
        console.error('Server error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: errorMessage,
        });
    }
});
export default router;
