import axios from 'axios';
class YouTubeService {
    constructor() {
        this.baseUrl = 'https://www.googleapis.com/youtube/v3';
        this.apiKey = process.env.YOUTUBE_API_KEY || '';
        if (!this.apiKey) {
            throw new Error('YouTube API key is not configured');
        }
    }
    // Disease-specific search terms mapping
    getDiseaseSearchTerms(disease) {
        const searchTermsMap = {
            'diabetes': ['diabetes management', 'blood sugar control', 'diabetic diet', 'insulin therapy'],
            'hypertension': ['blood pressure management', 'heart health', 'hypertension diet', 'cardiovascular exercise'],
            'heart disease': ['heart health', 'cardiac rehabilitation', 'heart diet', 'cardiovascular wellness'],
            'asthma': ['asthma management', 'breathing exercises', 'asthma triggers', 'respiratory health'],
            'arthritis': ['joint pain relief', 'arthritis exercises', 'anti-inflammatory diet', 'joint mobility'],
            'depression': ['mental health', 'depression management', 'mindfulness meditation', 'mental wellness'],
            'anxiety': ['anxiety relief', 'stress management', 'relaxation techniques', 'mental health'],
            'obesity': ['weight loss', 'healthy eating', 'exercise for weight loss', 'metabolism boost'],
            'migraine': ['migraine relief', 'headache management', 'migraine triggers', 'stress relief'],
            'chronic pain': ['pain management', 'chronic pain relief', 'pain therapy', 'physical therapy'],
            'insomnia': ['sleep health', 'sleep hygiene', 'insomnia treatment', 'better sleep'],
            'default': ['general health', 'wellness tips', 'healthy lifestyle', 'preventive care']
        };
        const normalizedDisease = disease.toLowerCase();
        return searchTermsMap[normalizedDisease] || searchTermsMap['default'];
    }
    async searchHealthVideos(disease, maxResults = 10) {
        try {
            const searchTerms = this.getDiseaseSearchTerms(disease);
            const allVideos = [];
            // Search for each term to get diverse results
            for (const term of searchTerms.slice(0, 2)) { // Limit to 2 terms to avoid API quota issues
                const response = await axios.get(`${this.baseUrl}/search`, {
                    params: {
                        key: this.apiKey,
                        q: `${term} doctor medical advice`,
                        part: 'snippet',
                        type: 'video',
                        maxResults: 5,
                        order: 'relevance',
                        safeSearch: 'strict',
                        videoDefinition: 'any',
                        videoDuration: 'medium', // 4-20 minutes
                        relevanceLanguage: 'en'
                    }
                });
                if (response.data.items) {
                    allVideos.push(...response.data.items);
                }
            }
            if (allVideos.length === 0) {
                return [];
            }
            // Get video statistics and details
            const videoIds = allVideos.map(video => video.id.videoId).join(',');
            const statsResponse = await axios.get(`${this.baseUrl}/videos`, {
                params: {
                    key: this.apiKey,
                    id: videoIds,
                    part: 'statistics,contentDetails,snippet'
                }
            });
            // Format the response
            const formattedVideos = statsResponse.data.items.map(video => ({
                id: video.id,
                title: video.snippet.title,
                description: video.snippet.description,
                thumbnail: video.snippet.thumbnails.medium?.url ||
                    video.snippet.thumbnails.default?.url ||
                    '',
                channelTitle: video.snippet.channelTitle,
                publishedAt: video.snippet.publishedAt,
                duration: this.formatDuration(video.contentDetails.duration),
                viewCount: this.formatViewCount(video.statistics.viewCount),
                likeCount: video.statistics.likeCount || '0',
                url: `https://www.youtube.com/watch?v=${video.id}`
            }));
            // Sort by view count and return top results
            return formattedVideos
                .sort((a, b) => parseInt(b.likeCount) - parseInt(a.likeCount))
                .slice(0, maxResults);
        }
        catch (error) {
            console.error('YouTube API Error:', error.response?.data || error.message);
            throw new Error('Failed to fetch videos from YouTube');
        }
    }
    formatDuration(duration) {
        const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
        if (!match)
            return '0:00';
        const hours = (match[1] || '').replace('H', '');
        const minutes = (match[2] || '').replace('M', '');
        const seconds = (match[3] || '').replace('S', '');
        if (hours) {
            return `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
        }
        return `${minutes || '0'}:${seconds.padStart(2, '0')}`;
    }
    formatViewCount(count) {
        const num = parseInt(count);
        if (num >= 1000000) {
            return `${(num / 1000000).toFixed(1)}M views`;
        }
        if (num >= 1000) {
            return `${(num / 1000).toFixed(1)}K views`;
        }
        return `${num} views`;
    }
}
export default new YouTubeService();
