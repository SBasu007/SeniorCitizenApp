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
import { recordStyles } from '../styles/record.style';
import { useUser } from '@clerk/clerk-expo';
import * as DocumentPicker from 'expo-document-picker';
import { Linking } from 'react-native';
import { ActivityIndicator } from 'react-native';

interface MedicalRecord {
  id: string;
  type: string;
  date: string;
  details: string;
  file_url: string;
}

interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  avatar?: string;
}

export default function RecordScreen() {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const {user} = useUser() 

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


  if (!user) return <Text>Loading user...</Text>;
 
  const familyMembers: FamilyMember[] = [
    { id: '1', name: 'Mom', relation: 'Mother' },
    { id: '2', name: 'Dad', relation: 'Father' },
    { id: '3', name: 'Sister', relation: 'Sister' },
  ];

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
  }, []);

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
        {/* <Text style={[recordStyles.recordStatus, getStatusStyle(record.status)]}>
          {record.status.toUpperCase()}
        </Text> */}
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
    <TouchableOpacity key={member.id} style={recordStyles.familyMember}>
      <View style={recordStyles.familyMemberImage}>
        <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>
          {member.name.charAt(0)}
        </Text>
      </View>
      <Text style={recordStyles.familyMemberName}>{member.name}</Text>
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
                <Text style={recordStyles.statValue}>24</Text>
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
              {renderQuickAction('fitness-outline', 'Symptoms', 'Log symptoms', '#FF9800', () => {})}
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
                {familyMembers.map(renderFamilyMember)}
                <TouchableOpacity style={recordStyles.addMemberButton}>
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

      {/* Floating Action Button */}
      {/* <TouchableOpacity style={recordStyles.fab}>
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity> */}
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
      <Text style={{ marginTop: 10 }}>Uploading PDF...</Text>
    </View>
  </View>
)}
    </View>
  );
}
