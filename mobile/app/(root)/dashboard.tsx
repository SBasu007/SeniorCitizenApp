import React, { useState, useEffect, JSX } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser, useAuth } from '@clerk/clerk-expo';
import { 
  profileApi, 
  recommendationsApi, 
  RecommendedVideo,
  VideoRecommendationResponse 
} from '../utils/axiosapi';
import { dashboardStyles } from '../styles/dashboard.styles';

interface UserProfile {
  name: string;
  disease: string;
  age: number;
  email: string;
  phone?: string;
  avatar?: string;
}

interface Article {
  id: string;
  title: string;
  description: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
}

export default function DashboardScreen(): JSX.Element {
  const [fadeAnim] = useState(new Animated.Value(0));
  const { user } = useUser();
  const { getToken } = useAuth();
  
  // State management
  const [userName, setUserName] = useState<string>('');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [recommendedVideos, setRecommendedVideos] = useState<RecommendedVideo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [videosLoading, setVideosLoading] = useState<boolean>(false);

  // Sample articles data
  const featuredArticles: Article[] = [
    {
      id: '1',
      title: 'The Science of Sleep',
      description: 'Learn about the importance of sleep and how to improve your sleep quality for better health and well-being.',
      author: 'Dr. Emily Watson',
      date: 'Aug 1, 2024',
      readTime: '5 min read',
      category: 'Sleep Health',
    },
    {
      id: '2',
      title: 'Nutrition Basics',
      description: 'Explore the fundamentals of nutrition and how nutrients and macronutrients affect your health.',
      author: 'Dr. James Miller',
      date: 'Jul 28, 2024',
      readTime: '7 min read',
      category: 'Nutrition',
    },
  ];

  // Load user profile and recommendations
  useEffect(() => {
    if (user?.id) {
      loadUserData();
    }
  }, [user?.id]);

  const loadUserData = async (): Promise<void> => {
    try {
      setLoading(true);
      const token = await getToken();

      if (!token) {
        setUserName(user?.fullName ?? '');
        await loadGeneralRecommendations();
        return;
      }

      // Load user profile
      const profileResponse = await profileApi.getProfile(user!.id, token);
      
      if (profileResponse?.success && profileResponse.data) {
        const profile: UserProfile = profileResponse.data;
        setUserName(profile.name || user?.fullName || '');
        setUserProfile(profile);

        // Load disease-specific recommendations
        if (profile.disease && profile.disease.trim()) {
          await loadDiseaseRecommendations(profile.disease, token);
        } else {
          await loadGeneralRecommendations(token);
        }
      } else {
        setUserName(user?.fullName ?? '');
        await loadGeneralRecommendations(token);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setUserName(user?.fullName ?? '');
      await loadGeneralRecommendations();
    } finally {
      setLoading(false);
    }
  };

  const loadDiseaseRecommendations = async (disease: string, token: string): Promise<void> => {
    try {
      setVideosLoading(true);
      const response: VideoRecommendationResponse = await recommendationsApi.getVideoRecommendations(
        user?.id || '', 
        disease, 
        token, 
        8 // Limit to 8 videos
      );

      if (response.success && response.data?.videos) {
        // Remove duplicates and ensure unique videos
        const uniqueVideos = response.data.videos.filter((video, index, self) => 
          index === self.findIndex(v => v.id === video.id)
        );
        setRecommendedVideos(uniqueVideos);
      } else {
        // Fallback to general recommendations
        await loadGeneralRecommendations(token);
      }
    } catch (error) {
      console.error('Error loading disease recommendations:', error);
      await loadGeneralRecommendations(token);
    } finally {
      setVideosLoading(false);
    }
  };

  const loadGeneralRecommendations = async (token?: string): Promise<void> => {
    try {
      setVideosLoading(true);
      
      if (token) {
        const response: VideoRecommendationResponse = await recommendationsApi.getGeneralRecommendations(token, 8);
        if (response.success && response.data?.videos) {
          // Remove duplicates and ensure unique videos
          const uniqueVideos = response.data.videos.filter((video, index, self) => 
            index === self.findIndex(v => v.id === video.id)
          );
          setRecommendedVideos(uniqueVideos);
          return;
        }
      }

      // Fallback to static recommendations
      setRecommendedVideos([
        {
          id: 'fallback_1',
          title: 'Understanding Your Blood Pressure',
          channelTitle: 'Dr. Sarah Johnson',
          duration: '8:45',
          viewCount: '125K views',
          description: 'Learn about blood pressure management and lifestyle changes.',
          thumbnail: 'blood_pressure',
          url: '#',
          publishedAt: new Date().toISOString(),
        },
        {
          id: 'fallback_2',
          title: 'Managing Stress for Better Health',
          channelTitle: 'Dr. Michael Chen',
          duration: '12:30',
          viewCount: '89K views',
          description: 'Discover effective stress management techniques.',
          thumbnail: 'stress_management',
          url: '#',
          publishedAt: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      console.error('Error loading general recommendations:', error);
      setRecommendedVideos([]);
    } finally {
      setVideosLoading(false);
    }
  };

  const handleVideoPress = async (video: RecommendedVideo): Promise<void> => {
    if (video.url === '#') {
      Alert.alert('Video Unavailable', 'This is a demo video.');
      return;
    }

    try {
      const supported = await Linking.canOpenURL(video.url);
      if (supported) {
        await Linking.openURL(video.url);
      } else {
        Alert.alert('Error', 'Cannot open video URL');
      }
    } catch (error) {
      console.error('Error opening video:', error);
      Alert.alert('Error', 'Failed to open video');
    }
  };

  // Animation effect
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  // FIXED: Remove the key prop from inside this function
  const renderRecommendedVideo = (video: RecommendedVideo): JSX.Element => (
    <TouchableOpacity 
      style={dashboardStyles.videoCard} 
      activeOpacity={0.7}
      onPress={() => handleVideoPress(video)}
    >
      <View style={dashboardStyles.videoThumbnail}>
        <Ionicons name="fitness" size={40} color="#FF6B6B" />
        <TouchableOpacity style={dashboardStyles.playButton}>
          <Ionicons name="play" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={dashboardStyles.videoDuration}>
          <Text style={dashboardStyles.durationText}>{video.duration}</Text>
        </View>
      </View>
      <View style={dashboardStyles.videoContent}>
        <Text style={dashboardStyles.videoTitle} numberOfLines={2}>
          {video.title}
        </Text>
        <View style={dashboardStyles.videoMeta}>
          <View style={dashboardStyles.doctorInfo}>
            <View style={dashboardStyles.doctorAvatar}>
              <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: 'bold' }}>
                {video.channelTitle
                  .split(' ')
                  .map((n: string) => n[0])
                  .join('')
                  .substring(0, 2)}
              </Text>
            </View>
            <Text style={dashboardStyles.doctorName} numberOfLines={1}>
              {video.channelTitle}
            </Text>
          </View>
          <Text style={dashboardStyles.viewCount}>{video.viewCount}</Text>
        </View>
        <Text style={dashboardStyles.videoDescription} numberOfLines={3}>
          {video.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderArticle = (article: Article): JSX.Element => (
    <TouchableOpacity key={article.id} style={dashboardStyles.articleCard} activeOpacity={0.7}>
      <View style={dashboardStyles.articleImage}>
        <Ionicons name="document-text" size={32} color="#FFA726" />
      </View>
      <View style={dashboardStyles.articleContent}>
        <View style={dashboardStyles.articleBadge}>
          <Text style={dashboardStyles.articleBadgeText}>{article.category}</Text>
        </View>
        <Text style={dashboardStyles.articleTitle}>{article.title}</Text>
        <Text style={dashboardStyles.articleDescription}>{article.description}</Text>
        <View style={dashboardStyles.articleMeta}>
          <View>
            <Text style={dashboardStyles.articleAuthor}>{article.author}</Text>
            <Text style={dashboardStyles.articleDate}>{article.date}</Text>
          </View>
          <View style={dashboardStyles.readTimeContainer}>
            <Ionicons name="time" size={12} color="#666" />
            <Text style={dashboardStyles.readTime}>{article.readTime}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[dashboardStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text style={{ marginTop: 10, color: '#666' }}>Loading recommendations...</Text>
      </View>
    );
  }

  return (
    <View style={dashboardStyles.container}>
      {/* Header */}
      <View style={dashboardStyles.header}>
        <View style={dashboardStyles.headerTop}>
          <View>
            <Text style={dashboardStyles.welcomeText}>Good Morning</Text>
            <Text style={dashboardStyles.userNameText}>
              {userName ? `${userName}!` : '...'}
            </Text>
            {userProfile?.disease && (
              <Text style={dashboardStyles.diseaseText}>
                Managing: {userProfile.disease}
              </Text>
            )}
          </View>
          <TouchableOpacity style={dashboardStyles.notificationButton}>
            <Ionicons name="notifications-outline" size={20} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={dashboardStyles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Recommended for You */}
          <View style={dashboardStyles.recommendedSection}>
            <View style={dashboardStyles.sectionHeader}>
              <View>
                <Text style={dashboardStyles.sectionTitle}>
                  {userProfile?.disease ? `Recommended for ${userProfile.disease}` : 'Recommended for you'}
                </Text>
                <Text style={dashboardStyles.sectionSubtitle}>
                  {userProfile?.disease 
                    ? `Videos tailored for your condition` 
                    : 'Based on your health profile'
                  }
                </Text>
              </View>
              <TouchableOpacity style={dashboardStyles.viewAllButton}>
                <Text style={dashboardStyles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>

            {videosLoading ? (
              <View style={{ padding: 20, alignItems: 'center' }}>
                <ActivityIndicator size="small" color="#FF6B6B" />
                <Text style={{ marginTop: 10, color: '#666' }}>Loading videos...</Text>
              </View>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingRight: 10 }}
              >
                {/* FIXED: Add unique keys here with index fallback */}
                {recommendedVideos.map((video, index) => (
                  <View key={`${video.id}-${index}`}>
                    {renderRecommendedVideo(video)}
                  </View>
                ))}
              </ScrollView>
            )}
          </View>

          {/* Featured Articles */}
          <View style={dashboardStyles.articlesSection}>
            <View style={dashboardStyles.sectionHeader}>
              <Text style={dashboardStyles.sectionTitle}>Featured Articles</Text>
              <TouchableOpacity style={dashboardStyles.viewAllButton}>
                <Text style={dashboardStyles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            {featuredArticles.map(renderArticle)}
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
