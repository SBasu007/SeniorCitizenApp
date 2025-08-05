import express, { Request, Response } from 'express';
import youtubeService, { FormattedVideo } from '../services/youtubeservices.js';

const router = express.Router();

// This will be accessible at GET /recommendations/videos/general
router.get('/videos/general', async (req: Request, res: Response) => {
  try {
    const { limit = '10' } = req.query;
    
    console.log('Fetching general recommendations...'); // Add logging
    
    const videos = await youtubeService.searchHealthVideos('general health', parseInt(limit as string));

    const response = {
      success: true,
      data: {
        disease: 'general',
        videos,
        totalCount: videos.length
      }
    };

    res.json(response);
  } catch (error: any) {
    console.error('General Recommendations API Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch general video recommendations',
      error: error.message
    });
  }
});

// This will be accessible at GET /recommendations/videos/:userId
router.get('/videos/:userId', async (req: Request, res: Response) => {
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

    const videos = await youtubeService.searchHealthVideos(disease as string, parseInt(limit as string));

    const response = {
      success: true,
      data: {
        disease: disease as string,
        videos,
        totalCount: videos.length
      }
    };

    res.json(response);
  } catch (error: any) {
    console.error('Recommendations API Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch video recommendations',
      error: error.message
    });
  }
});

export default router;
