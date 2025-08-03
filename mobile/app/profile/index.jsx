import React, { useState } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo';
import { Link } from 'expo-router';
import { SignOutButton } from '../../components/SignOutButton';
import { profileStyles } from '../styles/profile.styles';

export default function Profile() {
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.fullName || 'John Doe',
    age: '28',
    disease: 'Diabetes Type 2',
    phone: '+1 234 567 8900',
    email: user?.emailAddresses[0]?.emailAddress || 'john.doe@example.com',
    avatar: user?.imageUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
  });

  const handleSave = () => {
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully!');
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

  const renderProfileField = (label, value, field, icon, editable = true) => (
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
        />
      </View>
    </View>
  );

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
              style={profileStyles.editButton}
              onPress={isEditing ? handleSave : () => setIsEditing(true)}
            >
              <Ionicons 
                name={isEditing ? "checkmark" : "pencil"} 
                size={16} 
                color="#FFFFFF" 
              />
              <Text style={profileStyles.editButtonText}>
                {isEditing ? 'Save' : 'Edit'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Avatar Section */}
          <View style={profileStyles.avatarSection}>
            <View style={profileStyles.avatarContainer}>
              <Image 
                source={{ 
                  uri: profileData.avatar,
                  // Default fallback image if the user's avatar fails to load
                  headers: {
                    'User-Agent': 'Mozilla/5.0'
                  }
                }} 
                style={profileStyles.avatar}
                // Use an online default image as fallback
                defaultSource={{ 
                  uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80' 
                }}
                // Add error handling for image loading
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
