import express from 'express';
import dotenv from 'dotenv';
import supabase from '../middleware/supabase.js';
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
//get relations
router.get('/relative/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { data, error } = await supabase
            .rpc('get_relatives_by_user', { user_id_input: userId });
        if (error) {
            console.error('Supabase RPC error:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch relatives',
                error: error.message
            });
        }
        res.status(200).json({
            success: true,
            data: data || []
        });
    }
    catch (error) {
        console.error('Server error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error occurred',
        });
    }
});
//post a new member
router.post('/addRelative', async (req, res) => {
    try {
        const { userId, access_token, relation } = req.body;
        if (!userId || !access_token || !relation) {
            return res.status(400).json({
                success: false,
                message: 'Missing userId, access_token, or relation',
            });
        }
        // Step 1: Check if a profile with this token exists
        const { data: profileData, error: profileError } = await supabase
            .from('profile')
            .select('user_id')
            .eq('access_token', access_token)
            .single();
        if (profileError) {
            return res.status(404).json({
                success: false,
                message: 'No user found with the given access token',
                error: profileError.message,
            });
        }
        const relative_user_id = profileData.user_id;
        // Step 2: Insert into relations
        const { data: insertData, error: insertError } = await supabase
            .from('relations')
            .insert([
            {
                user_id: userId,
                relative_user_id,
                relation,
            }
        ])
            .select();
        if (insertError) {
            return res.status(500).json({
                success: false,
                message: 'Failed to insert relation',
                error: insertError.message,
            });
        }
        res.status(200).json({
            success: true,
            message: 'Relation added successfully',
            data: insertData[0],
        });
    }
    catch (er) {
        console.error('Server error:', er);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
export default router;
