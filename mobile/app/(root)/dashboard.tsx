import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { dashboardStyles } from '../styles/dashboard.styles';

interface RecommendedVideo {
  id: string;
  title: string;
  doctor: string;
  duration: string;
  views: string;
  description: string;
  thumbnail: string;
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

export default function DashboardScreen() {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data based on user's health profile
  const recommendedVideos: RecommendedVideo[] = [
    {
      id: '1',
      title: 'Understanding Your Blood Pressure',
      doctor: 'Dr. Sarah Johnson',
      duration: '8:45',
      views: '125K views',
      description: 'Learn about blood pressure management and lifestyle changes that can help improve your cardiovascular health.',
      thumbnail: 'blood_pressure',
    },
    {
      id: '2',
      title: 'Managing Stress for Better Health',
      doctor: 'Dr. Michael Chen',
      duration: '12:30',
      views: '89K views',
      description: 'Discover effective stress management techniques and their impact on your overall well-being.',
      thumbnail: 'stress_management',
    },
  ];

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

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const renderRecommendedVideo = (video: RecommendedVideo) => (
    <TouchableOpacity key={video.id} style={dashboardStyles.videoCard} activeOpacity={0.7}>
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
        <Text style={dashboardStyles.videoTitle}>{video.title}</Text>
        <View style={dashboardStyles.videoMeta}>
          <View style={dashboardStyles.doctorInfo}>
            <View style={dashboardStyles.doctorAvatar}>
              <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: 'bold' }}>
                {video.doctor.split(' ').map(n => n[0]).join('')}
              </Text>
            </View>
            <Text style={dashboardStyles.doctorName}>{video.doctor}</Text>
          </View>
          <Text style={dashboardStyles.viewCount}>{video.views}</Text>
        </View>
        <Text style={dashboardStyles.videoDescription}>{video.description}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderArticle = (article: Article) => (
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

  return (
    <View style={dashboardStyles.container}>
      {/* Header */}
      <View style={dashboardStyles.header}>
        <View style={dashboardStyles.headerTop}>
          <View>
            <Text style={dashboardStyles.welcomeText}>Good Morning</Text>
            <Text style={dashboardStyles.userNameText}>John!</Text>
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
                <Text style={dashboardStyles.sectionTitle}>Recommended for you</Text>
                <Text style={dashboardStyles.sectionSubtitle}>Based on your health profile</Text>
              </View>
              <TouchableOpacity style={dashboardStyles.viewAllButton}>
                <Text style={dashboardStyles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            {recommendedVideos.map(renderRecommendedVideo)}
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
