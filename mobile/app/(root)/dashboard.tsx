import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  TextInput,
  FlatList,
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

interface PopularVideo {
  id: string;
  title: string;
  views: string;
  duration: string;
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

  const popularVideos: PopularVideo[] = [
    {
      id: '1',
      title: 'Yoga for Beginners',
      views: '2.1M views',
      duration: '15:20',
    },
    {
      id: '2',
      title: 'Healthy Eating Habits',
      views: '1.8M views',
      duration: '10:45',
    },
    {
      id: '3',
      title: 'Sleep Better Tonight',
      views: '1.5M views',
      duration: '9:30',
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

  const renderPopularVideo = ({ item }: { item: PopularVideo }) => (
    <TouchableOpacity style={dashboardStyles.popularVideoCard} activeOpacity={0.7}>
      <View style={dashboardStyles.popularThumbnail}>
        <Ionicons name="heart" size={24} color="#4CAF50" />
        <TouchableOpacity style={dashboardStyles.popularPlayButton}>
          <Ionicons name="play" size={16} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={[dashboardStyles.videoDuration, { bottom: 8, right: 8 }]}>
          <Text style={dashboardStyles.durationText}>{item.duration}</Text>
        </View>
      </View>
      <View style={dashboardStyles.popularVideoContent}>
        <Text style={dashboardStyles.popularVideoTitle}>{item.title}</Text>
        <Text style={dashboardStyles.popularVideoMeta}>{item.views}</Text>
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
          {/* Search Bar */}
          <View style={dashboardStyles.searchContainer}>
            <Ionicons name="search" size={20} color="#666" />
            <TextInput
              style={dashboardStyles.searchInput}
              placeholder="Search health topics..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Quick Health Tip */}
          <View style={dashboardStyles.quickTipsSection}>
            <View style={dashboardStyles.tipHeader}>
              <View style={dashboardStyles.tipIcon}>
                <Ionicons name="bulb" size={16} color="#FFFFFF" />
              </View>
              <Text style={dashboardStyles.tipTitle}>Daily Health Tip</Text>
            </View>
            <Text style={dashboardStyles.tipText}>
              Stay hydrated! Aim for 8 glasses of water daily to maintain optimal health and energy levels.
            </Text>
          </View>

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

          {/* Popular Videos */}
          <View style={dashboardStyles.popularSection}>
            <View style={dashboardStyles.sectionHeader}>
              <Text style={dashboardStyles.sectionTitle}>Popular Videos</Text>
              <TouchableOpacity style={dashboardStyles.viewAllButton}>
                <Text style={dashboardStyles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={popularVideos}
              renderItem={renderPopularVideo}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={dashboardStyles.popularVideosList}
            />
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
