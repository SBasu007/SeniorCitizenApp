import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  Image,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { recordStyles } from '../../styles/record.style';
import { useUser, useAuth } from '@clerk/clerk-expo';
import { router, useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { Linking } from 'react-native';
import { ActivityIndicator, Modal, TextInput, Button } from 'react-native';
import { profileApi } from '../../utils/axiosapi'; // Make sure this import path is correct

interface MedicalRecord {
  id: string;
  type: string;
  date: string;
  details: string;
  file_url: string;
}

interface FamilyMember {
  relative_user_id: string;
  name: string;
  relation: string;
  avatar?: string;
}

type UserProfile = {
  url:string;
  name: string;
  age: number;
};

export default function RecordScreen() {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [relation, setRelation] = useState('');
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [selectedFamilyMember, setSelectedFamilyMember] = useState<FamilyMember | null>(null);
const [showFamilyModal, setShowFamilyModal] = useState(false);
  
  // User profile state
  const [userName, setUserName] = useState<string>('');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  const { user } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();

  // Load user data including name from profile
  const loadUserData = async (): Promise<void> => {
    try {
      setLoading(true);
      const token = await getToken();

      if (!token) {
        setUserName(user?.fullName ?? '');
        return;
      }

      // Load user profile
      const profileResponse = await profileApi.getProfile(user!.id, token);
      
      if (profileResponse?.success && profileResponse.data) {
        const profile: UserProfile = profileResponse.data;
        setUserName(profile.name || user?.fullName || '');
        setUserProfile(profile);
      } else {
        setUserName(user?.fullName ?? '');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setUserName(user?.fullName ?? '');
    } finally {
      setLoading(false);
    }
  };

  //pdf handling
  const pickAndUploadPDF = async () => {
    try {
      // Pick the PDF file
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        console.log('Document upload cancelled or failed');
        return;
      }

      setLoading(true); //loading starts

      const asset = result.assets[0];
      const fileToUpload = {
        uri: asset.uri,
        name: asset.name ?? 'document.pdf',
        type: asset.mimeType ?? 'application/pdf',
      };

      const formData = new FormData();
      formData.append('pdf', fileToUpload as any); 
      formData.append('user_id', user?.id ?? '');

      console.log('Uploading...');

      const response = await fetch('https://seniorcitizenapp.onrender.com/pdf/upload-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      setLoading(false);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Upload failed:', errorText);
      Alert.alert(errorText);
      return;
    }

      const responseData = await response.json();
      console.log('Upload success');
      Alert.alert('Success', 'PDF uploaded successfully!');
      fetchMedicalRecords();
    } catch (error) {
      console.error('Error uploading PDF:', error);
    }
  };

  //fetch pdfs
  const fetchMedicalRecords = async () => {
    try {
      const response = await fetch(`https://seniorcitizenapp.onrender.com/records/${user?.id}`);
      const data = await response.json();
      
      if (Array.isArray(data) && data.length > 0) {
        const transformed: MedicalRecord[] = data.map((record: any) => ({
          id: record.id,
          type: record.filename,
          date: record.created_at.split("T")[0],
          details: record.summary,
          file_url: record.file_url,
        }));
        setMedicalRecords(transformed);
      } 
    } catch (error) {
      console.error('Error fetching medical records:', error);
    }
  };

  //fetch relatives
  const fetchRelatives = async () => {
    try {
      const response = await fetch(`https://seniorcitizenapp.onrender.com/profile/relative/${user?.id}`);
      const json = await response.json();

      if (!json.success) {
        console.error('Failed to fetch relatives:', json.message);
        return;
      }

      const relatives: FamilyMember[] = json.data.map((item: any) => ({
        relative_user_id: item.relative_user_id,
        name: item.name || 'Unknown',
        relation: item.relation || 'Relative',
        avatar: item.avatar || '', // optional
      }));

    setFamilyMembers(relatives);
  } catch (error) {
    console.error('Error fetching relatives:', error);
  }
};
const handleAddRelative = async () => {
  if (!accessToken || !relation) {
    Alert.alert('Error', 'Please fill all fields');
    return;
  }

    try {
      const res = await fetch('https://seniorcitizenapp.onrender.com/profile/addRelative', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,           // silently passed
          access_token: accessToken,
          relation,
        }),
      });

      const result = await res.json();

    if (result.success) {
      Alert.alert('Success', 'Relative added successfully');
      setShowPopup(false);
      setAccessToken('');
      setRelation('');
      fetchRelatives()
    } else {
      Alert.alert('Failed', result.message || 'Could not add relative');
    }
  } catch (err) {
    console.error('Error adding relative:', err);
    Alert.alert('Error', 'Something went wrong');
  }
};


  if (!user) return <Text>Loading user...</Text>;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
    
    fetchMedicalRecords();
    fetchRelatives();
  }, []);

  useEffect(() => {
    if (user?.id) {
      loadUserData();
    }
  }, [user?.id]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'normal':
        return recordStyles.statusNormal;
      case 'low':
        return recordStyles.statusLow;
      case 'high':
        return recordStyles.statusHigh;
      default:
        return recordStyles.statusNormal;
    }
  };

  const renderQuickAction = (icon: string, title: string, subtitle: string, color: string, onPress: () => void) => (
    <TouchableOpacity style={recordStyles.quickActionCard} onPress={onPress} activeOpacity={0.7}>
      <View style={[recordStyles.quickActionIcon, { backgroundColor: color }]}>
        <Ionicons name={icon as any} size={24} color="#FFFFFF" />
      </View>
      <Text style={recordStyles.quickActionTitle}>{title}</Text>
      <Text style={recordStyles.quickActionSubtitle}>{subtitle}</Text>
    </TouchableOpacity>
  );

  const renderMedicalRecord = (record: MedicalRecord) => (
    <View key={record.id} style={recordStyles.recordCard}>
      <View style={recordStyles.recordHeader}>
        <Text style={recordStyles.recordType}>{record.type}</Text>
      </View>
      <Text style={recordStyles.recordDetails}>{record.details}</Text>
      <View style={recordStyles.recordActions}>
        <TouchableOpacity
          style={recordStyles.viewButton}
          onPress={() => Linking.openURL(record.file_url)} 
        >
          <Ionicons name="eye-outline" size={14} color="#007AFF" />
          <Text style={recordStyles.viewButtonText}>View Details</Text>
        </TouchableOpacity>
        <Text style={recordStyles.recordDate}>{(record.date)}</Text>
      </View>
    </View>
  );

const renderFamilyMember = (member: FamilyMember) => (
  <TouchableOpacity key={member.relative_user_id} style={recordStyles.familyMember}>
    <View style={recordStyles.familyMemberImage}>
      <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>
        {member.name.charAt(0)}
      </Text>
    </View>
    <Text style={recordStyles.familyMemberName}>{member.relation}</Text>
  </TouchableOpacity>
);

  return (
    <View style={recordStyles.container}>
      {/* Header */}
      <View style={recordStyles.header}>
        <Text style={recordStyles.headerTitle}>Health Records</Text>
        <Text style={recordStyles.headerSubtitle}>Track your health journey</Text>
      </View>

      <ScrollView 
        style={recordStyles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {/* Profile Section */}
          <View style={recordStyles.profileSection}>
            <View style={recordStyles.profileHeader}>
              <View style={recordStyles.profileImageContainer}>
                <Text style={recordStyles.profileInitials}>JD</Text>
              </View>
              <View style={recordStyles.profileInfo}>
                <Text style={recordStyles.profileName}>John Doe {user.id}</Text>
                <Text style={recordStyles.profileDetails}>Age: 32 • Male</Text>
                <Text style={recordStyles.profileDetails}>Blood Type: O+</Text>
                <Text style={recordStyles.profileDetails}>Last Checkup: Aug 2, 2024</Text>
              </View>
            </View>
            <View style={recordStyles.profileStats}>
              <View style={recordStyles.statItem}>
                <Text style={recordStyles.statValue}>{medicalRecords.length}</Text>
                <Text style={recordStyles.statLabel}>Records</Text>
              </View>
              <View style={recordStyles.statItem}>
                <Text style={recordStyles.statValue}>3</Text>
                <Text style={recordStyles.statLabel}>Alerts</Text>
              </View>
              <View style={recordStyles.statItem}>
                <Text style={recordStyles.statValue}>98%</Text>
                <Text style={recordStyles.statLabel}>Health Score</Text>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={recordStyles.quickActionsSection}>
            <Text style={recordStyles.sectionTitle}>Quick Actions</Text>
            <View style={recordStyles.quickActionsGrid}>
              {renderQuickAction('document-text-outline', 'Add Record', 'Upload new report', '#4CAF50', pickAndUploadPDF)}
              {renderQuickAction('calendar-outline', 'Schedule', 'Book appointment', '#2196F3', () => {})}
              {renderQuickAction('stats-chart', 'Analytics', 'Show Records', '#FF9800', () => router.push({
                pathname: '/(root)/(record)/analytics',
                params: { userId: user?.id } 
              }))}
              {renderQuickAction('medical-outline', 'Medications', 'Track medicines', '#9C27B0', () => {})}
            </View>
          </View>

          {/* Recent Medical Records */}
          <View style={recordStyles.medicalRecordsSection}>
            <Text style={recordStyles.sectionTitle}>Recent Records</Text>
            {medicalRecords.length > 0 ? (
              medicalRecords.map(renderMedicalRecord)
            ) : (
              <Text style={{ textAlign: 'center', marginTop: 5, color: '#888' }}>
                No records uploaded yet.
              </Text>
            )}
          </View>

          {/* Family Connect */}
          <View style={recordStyles.familySection}>
            <Text style={recordStyles.sectionTitle}>Family Connect</Text>
            <View style={recordStyles.familyCard}>
              <View style={recordStyles.familyHeader}>
                <View style={recordStyles.familyIcon}>
                  <Ionicons name="people" size={20} color="#4CAF50" />
                </View>
                <View>
                  <Text style={recordStyles.familyTitle}>Share with Family</Text>
                  <Text style={recordStyles.familySubtitle}>Keep your loved ones informed</Text>
                </View>
              </View>
              
              <View style={recordStyles.familyMembers}>
                {familyMembers.length > 0 &&
                  familyMembers.map(renderFamilyMember)
                }
                <TouchableOpacity style={recordStyles.addMemberButton} onPress={() => setShowPopup(true)}>
                  <Ionicons name="add" size={20} color="#DDD" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={recordStyles.shareButton}>
                <Ionicons name="share-outline" size={20} color="#FFFFFF" />
                <Text style={recordStyles.shareButtonText}>Share Health Summary</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {loading && (
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 999,
        }}>
          <View style={{
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 10,
            alignItems: 'center',
          }}>
            <ActivityIndicator size="large" color="#c52727" />
            <Text style={{ marginTop: 10 }}>
              {loading ? 'Processing...' : 'Uploading PDF...'}
            </Text>
          </View>
        </View>
      )}

      <Modal
        visible={showPopup}
        animationType="slide"
        transparent
        onRequestClose={() => setShowPopup(false)}
      >
        <View style={{
          flex: 1,
          justifyContent: 'flex-end',
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}>
          <View style={{
            backgroundColor: 'white',
            padding: 20,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            height: '50%',
          }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Add Relative</Text>

            <TextInput
              placeholder="Access Token"
              value={accessToken}
              onChangeText={setAccessToken}
              style={{ borderBottomWidth: 1, marginBottom: 15 }}
            />

            <TextInput
              placeholder="Relation (e.g. father, sister)"
              value={relation}
              onChangeText={setRelation}
              style={{ borderBottomWidth: 1, marginBottom: 15 }}
            />

      <TouchableOpacity
  onPress={handleAddRelative}
  style={{
    backgroundColor: '#c52727',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  }}
>
  <Text style={{ color: 'white', fontWeight: 'bold' }}>Submit</Text>
</TouchableOpacity>
    </View>
  </View>
</Modal>
    </View>
  );
}
