import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SignedIn, SignedOut, useUser, useAuth } from '@clerk/clerk-expo';
import { Link } from 'expo-router';
import { SignOutButton } from '../../components/SignOutButton';
import { profileStyles } from '../styles/profile.styles';
import { profileAPI } from '../utils/axiosApi'; // Import the profile API
import * as Clipboard from 'expo-clipboard';

export default function Profile() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.fullName || '',
    age: '',
    disease: '',
    phone: '',
    email: user?.emailAddresses[0]?.emailAddress || '',
    avatar: user?.imageUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
  });

  // Load profile data when component mounts
  useEffect(() => {
    if (user?.id) {
      loadProfileData();
    }
  }, [user?.id]);

  // ────────── loadProfileData ──────────
const loadProfileData = async () => {
  try {
    setLoading(true);
    const token     = await getToken();
    const response  = await profileAPI.getProfile(user.id, token);

    if (response.success && response.data) {
      const db = response.data;

      setProfileData(prev => ({
        ...prev,

        /* numbers ➜ strings for TextInput */
        age : db.age !== null && db.age !== undefined ? db.age.toString() : '',

        /* everything else */
        name  : db.name   || user?.fullName                            || '',
        email : db.email  || user?.emailAddresses[0]?.emailAddress     || '',
        avatar: db.avatar || user?.imageUrl                            || prev.avatar,
        disease: db.disease ?? '',
        phone  : db.phone   ?? '',
        access_token: db.access_token ?? '',
      }));
    }
  } catch (err) {
    console.error('Error loading profile:', err);
  } finally {
    setLoading(false);
  }
};


  const handleSave = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      
      const response = await profileAPI.updateProfile(user.id, profileData, token);
      
      if (response.success) {
        setIsEditing(false);
        Alert.alert('Success', 'Profile updated successfully!');
      } else {
        Alert.alert('Error', response.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditAvatar = () => {
    Alert.alert(
      'Change Profile Picture',
      'Choose an option',
      [
        { text: 'Camera', onPress: () => console.log('Camera pressed') },
        { text: 'Gallery', onPress: () => console.log('Gallery pressed') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const renderProfileField = (label, value, field, icon, editable = true, copyable = false) => (
  <View style={profileStyles.fieldContainer}>
    <Text style={profileStyles.fieldLabel}>{label}</Text>
    <View style={profileStyles.inputContainer}>
      <Ionicons name={icon} size={20} color="#666" style={profileStyles.fieldIcon} />
      <TextInput
        style={[
          profileStyles.fieldInput,
          !editable && profileStyles.disabledInput
        ]}
        value={value}
        onChangeText={(text) => setProfileData({ ...profileData, [field]: text })}
        editable={isEditing && editable}
        placeholder={`Enter ${label.toLowerCase()}`}
        placeholderTextColor="#999"
        secureTextEntry={label.toLowerCase().includes('token')}
      />
      {copyable && !isEditing && (
        <TouchableOpacity
          onPress={() => {
            Clipboard.setStringAsync(value);
            Alert.alert('Copied', `${label} copied to clipboard`);
          }}
          style={{ paddingHorizontal: 8 }}
        >
          <Ionicons name="copy-outline" size={20} color="#007AFF" />
        </TouchableOpacity>
      )}
    </View>
  </View>
);

  if (loading && !profileData.name) {
    return (
      <SafeAreaView style={[profileStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text style={{ marginTop: 10, color: '#666' }}>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={profileStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <SignedIn>
        <ScrollView 
          style={profileStyles.content} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
        >
          {/* Profile Header */}
          <View style={profileStyles.profileHeader}>
            <TouchableOpacity 
              style={[
                profileStyles.editButton,
                loading && { opacity: 0.6 }
              ]}
              onPress={isEditing ? handleSave : () => setIsEditing(true)}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size={16} color="#FFFFFF" />
              ) : (
                <Ionicons 
                  name={isEditing ? "checkmark" : "pencil"} 
                  size={16} 
                  color="#FFFFFF" 
                />
              )}
              <Text style={profileStyles.editButtonText}>
                {loading ? 'Saving...' : (isEditing ? 'Save' : 'Edit')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Avatar Section */}
          <View style={profileStyles.avatarSection}>
            <View style={profileStyles.avatarContainer}>
              <Image 
                source={{ 
                  uri: profileData.avatar,
                  headers: {
                    'User-Agent': 'Mozilla/5.0'
                  }
                }} 
                style={profileStyles.avatar}
                defaultSource={{ 
                  uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80' 
                }}
                onError={() => {
                  setProfileData(prev => ({
                    ...prev,
                    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
                  }));
                }}
              />
              {isEditing && (
                <TouchableOpacity 
                  style={profileStyles.editAvatarButton}
                  onPress={handleEditAvatar}
                >
                  <Ionicons name="camera" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              )}
            </View>
            <Text style={profileStyles.userName}>{profileData.name}</Text>
            <Text style={profileStyles.userEmail}>{profileData.email}</Text>
          </View>

          {/* Profile Information */}
          <View style={profileStyles.sectionContainer}>
            <Text style={profileStyles.sectionTitle}>Personal Information</Text>
            
            {renderProfileField('Full Name', profileData.name, 'name', 'person-outline')}
            {renderProfileField('Age', profileData.age, 'age', 'calendar-outline')}
            {renderProfileField('Medical Condition', profileData.disease, 'disease', 'medical-outline')}
          </View>

          {/* Contact Information */}
          <View style={profileStyles.sectionContainer}>
            <Text style={profileStyles.sectionTitle}>Contact Information</Text>
            
            {renderProfileField('Phone Number', profileData.phone, 'phone', 'call-outline')}
            {renderProfileField('Email Address', profileData.email, 'email', 'mail-outline', false)}
            {renderProfileField('Access Token', profileData.access_token, 'access_token', 'key-outline', false, true)}
          </View>

          {/* Health Stats */}
          <View style={profileStyles.statsContainer}>
            <Text style={profileStyles.sectionTitle}>Health Overview</Text>
            <View style={profileStyles.statsRow}>
              <View style={profileStyles.statCard}>
                <Ionicons name="heart" size={24} color="#FF6B6B" />
                <Text style={profileStyles.statNumber}>72</Text>
                <Text style={profileStyles.statLabel}>BPM</Text>
              </View>
              <View style={profileStyles.statCard}>
                <Ionicons name="fitness" size={24} color="#4ECDC4" />
                <Text style={profileStyles.statNumber}>8,542</Text>
                <Text style={profileStyles.statLabel}>Steps</Text>
              </View>
              <View style={profileStyles.statCard}>
                <Ionicons name="water" size={24} color="#45B7D1" />
                <Text style={profileStyles.statNumber}>2.1L</Text>
                <Text style={profileStyles.statLabel}>Water</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={profileStyles.actionsSection}>
            <TouchableOpacity style={profileStyles.settingsButton}>
              <Ionicons name="settings-outline" size={24} color="#666" />
              <Text style={profileStyles.settingsButtonText}>Settings & Privacy</Text>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>

            <TouchableOpacity style={profileStyles.helpButton}>
              <Ionicons name="help-circle-outline" size={24} color="#666" />
              <Text style={profileStyles.helpButtonText}>Help & Support</Text>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>

            <TouchableOpacity style={profileStyles.medicalButton}>
              <Ionicons name="medical-outline" size={24} color="#666" />
              <Text style={profileStyles.medicalButtonText}>Medical Records</Text>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Sign Out Button */}
          <View style={profileStyles.signOutContainer}>
            <SignOutButton />
          </View>
        </ScrollView>
      </SignedIn>

      <SignedOut>
        <View style={profileStyles.signedOutContainer}>
          <View style={profileStyles.signedOutContent}>
            <Ionicons name="person-circle-outline" size={80} color="#DC2626" />
            <Text style={profileStyles.signedOutTitle}>Welcome to Diagno AI</Text>
            <Text style={profileStyles.signedOutSubtitle}>
              Sign in to access your profile and personalized health insights
            </Text>
            
            <View style={profileStyles.authButtons}>
              <Link href="/(auth)/sign-in" asChild>
                <TouchableOpacity style={profileStyles.signInButton}>
                  <Text style={profileStyles.signInButtonText}>Sign In</Text>
                </TouchableOpacity>
              </Link>
              
              <Link href="/(auth)/sign-up" asChild>
                <TouchableOpacity style={profileStyles.signUpButton}>
                  <Text style={profileStyles.signUpButtonText}>Create Account</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </SignedOut>
    </SafeAreaView>
  );
}
