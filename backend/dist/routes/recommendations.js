import express from 'express';
import youtubeService from '../services/youtubeservices';
const router = express.Router();
// This will be accessible at GET /recommendations/videos/general
router.get('/videos/general', async (req, res) => {
    try {
        const { limit = '10' } = req.query;
        console.log('Fetching general recommendations...'); // Add logging
        const videos = await youtubeService.searchHealthVideos('general health', parseInt(limit));
        const response = {
            success: true,
            data: {
                disease: 'general',
                videos,
                totalCount: videos.length
            }
        };
        res.json(response);
    }
    catch (error) {
        console.error('General Recommendations API Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch general video recommendations',
            error: error.message
        });
    }
});
// This will be accessible at GET /recommendations/videos/:userId
router.get('/videos/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { disease, limit = '10' } = req.query;
        console.log(`Fetching recommendations for user ${userId}, disease: ${disease}`); // Add logging
        if (!disease) {
            return res.status(400).json({
                success: false,
                message: 'Disease parameter is required'
            });
        }
        const videos = await youtubeService.searchHealthVideos(disease, parseInt(limit));
        const response = {
            success: true,
            data: {
                disease: disease,
                videos,
                totalCount: videos.length
            }
        };
        res.json(response);
    }
    catch (error) {
        console.error('Recommendations API Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch video recommendations',
            error: error.message
        });
    }
});
export default router;
