import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { servicesStyles } from '../../styles/service.style';

interface Service {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  price: string;
  icon: string;
  color: string;
  popular?: boolean;
}

export default function ServicesScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  // Services data
  const emergencyServices = [
    {
      id: 'ambulance',
      title: '24/7 Ambulance Service',
      description: 'Emergency medical transportation available round the clock. Trained paramedics and life support equipment.',
      icon: 'medical',
    },
    {
      id: 'hearse',
      title: '24/7 Hearse Van Service',
      description: 'Respectful and dignified transportation services available 24/7 with professional staff.',
      icon: 'car',
    },
  ];

  const regularServices: Service[] = [
    {
      id: 'doctor-home',
      title: 'Doctor at Home',
      subtitle: 'Home visits',
      description: 'Qualified doctors visit your home for consultations and basic treatments.',
      price: 'Starting ₹500',
      icon: 'medical-outline',
      color: '#4CAF50',
      popular: true,
    },
    {
      id: 'online-consultation',
      title: 'Online Consultation',
      subtitle: 'Video call',
      description: 'Connect with doctors via video call from the comfort of your home.',
      price: 'Starting ₹300',
      icon: 'videocam-outline',
      color: '#2196F3',
      popular: true,
    },
    {
      id: 'medical-procedures',
      title: 'Medical Procedures',
      subtitle: 'At home/clinic',
      description: 'Minor medical procedures and treatments at home or in our clinics.',
      price: 'Starting ₹1000',
      icon: 'cut-outline',
      color: '#9C27B0',
    },
    {
      id: 'equipment-rent',
      title: 'Medical Equipment',
      subtitle: 'On rent',
      description: 'Rent medical equipment like wheelchairs, oxygen concentrators, etc.',
      price: 'Starting ₹200/day',
      icon: 'hardware-chip-outline',
      color: '#FF9800',
    },
    {
      id: 'lab-test',
      title: 'Lab Test at Home',
      subtitle: 'Sample collection',
      description: 'Home sample collection for various lab tests with accurate results.',
      price: 'Starting ₹150',
      icon: 'flask-outline',
      color: '#607D8B',
      popular: true,
    },
  ];

  const handleBookService = (serviceTitle: string) => {
    Alert.alert(
      'Book Service',
      `Would you like to book ${serviceTitle}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Book Now', 
          onPress: () => Alert.alert('Success', 'Service booking initiated! You will receive a call shortly.') 
        },
      ]
    );
  };

  const handleEmergencyCall = (serviceType: string) => {
    Alert.alert(
      'Emergency Service',
      `Calling ${serviceType}...`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Call Now', 
          onPress: () => Alert.alert('Calling', 'Emergency service has been notified. Help is on the way!') 
        },
      ]
    );
  };

  const renderEmergencyService = (service: any) => (
    <View key={service.id} style={servicesStyles.emergencyCard}>
      <View style={servicesStyles.emergencyHeader}>
        <View style={servicesStyles.emergencyIcon}>
          <Ionicons name={service.icon as any} size={24} color="#FFFFFF" />
        </View>
        <Text style={servicesStyles.emergencyTitle}>{service.title}</Text>
        <View style={servicesStyles.emergencyBadge}>
          <Text style={servicesStyles.emergencyBadgeText}>24/7</Text>
        </View>
      </View>
      <Text style={servicesStyles.emergencyDescription}>{service.description}</Text>
      <View style={{flexDirection: "row", justifyContent: "space-between"}}>
        <TouchableOpacity 
          style={servicesStyles.emergencyButton}
          onPress={() => handleEmergencyCall(service.title)}
          activeOpacity={0.7}
        >
          <Text style={servicesStyles.emergencyButtonText}>Call Now</Text>
        </TouchableOpacity>
        <TouchableOpacity
        style={servicesStyles.emergencyButton}
        activeOpacity={0.7}
        onPress={() => router.push('/(root)/(service)/ambulance')}>
          <Text style={servicesStyles.emergencyButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderServiceCard = (service: Service) => (
    <View key={service.id} style={servicesStyles.serviceCard}>
      {service.popular && (
        <View style={servicesStyles.popularBadge}>
          <Text style={servicesStyles.popularBadgeText}>POPULAR</Text>
        </View>
      )}
      <View style={[servicesStyles.serviceIcon, { backgroundColor: service.color }]}>
        <Ionicons name={service.icon as any} size={28} color="#FFFFFF" />
      </View>
      <Text style={servicesStyles.serviceTitle}>{service.title}</Text>
      <Text style={servicesStyles.serviceSubtitle}>{service.subtitle}</Text>
      <Text style={servicesStyles.servicePrice}>{service.price}</Text>
      <TouchableOpacity 
        style={servicesStyles.bookButton}
        onPress={() => handleBookService(service.title)}
        activeOpacity={0.7}
      >
        <Text style={servicesStyles.bookButtonText}>Book Now</Text>
      </TouchableOpacity>
    </View>
  );

  const renderServicesInRows = () => {
    const rows = [];
    for (let i = 0; i < regularServices.length; i += 2) {
      rows.push(
        <View key={i} style={servicesStyles.servicesRow}>
          {renderServiceCard(regularServices[i])}
          {regularServices[i + 1] && renderServiceCard(regularServices[i + 1])}
        </View>
      );
    }
    return rows;
  };

  return (
    <View style={servicesStyles.container}>
      {/* Header */}
      <View style={servicesStyles.header}>
        <Text style={servicesStyles.headerTitle}>Medical Services</Text>
        <Text style={servicesStyles.headerSubtitle}>Book healthcare services at your convenience</Text>
      </View>

      <ScrollView 
        style={servicesStyles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <View style={servicesStyles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={servicesStyles.searchInput}
            placeholder="Search services..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Emergency Services */}
        <View style={servicesStyles.emergencySection}>
          <Text style={servicesStyles.sectionTitle}>Emergency Services</Text>
          {emergencyServices.map(renderEmergencyService)}
        </View>

        {/* Regular Services */}
        <View style={servicesStyles.servicesGrid}>
          <Text style={servicesStyles.sectionTitle}>Book Services</Text>
          {renderServicesInRows()}
        </View>

        {/* Corporate Tie-ups */}
        <View style={servicesStyles.corporateSection}>
          <View style={servicesStyles.corporateHeader}>
            <View style={servicesStyles.corporateIcon}>
              <Ionicons name="business" size={20} color="#FFFFFF" />
            </View>
            <Text style={servicesStyles.corporateTitle}>Corporate Health Solutions</Text>
          </View>
          <Text style={servicesStyles.corporateDescription}>
            Comprehensive healthcare solutions for your organization. We provide customized health packages for employees.
          </Text>
          <View style={servicesStyles.corporateFeatures}>
            <View style={servicesStyles.featureItem}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={servicesStyles.featureText}>Annual Health Checkups</Text>
            </View>
            <View style={servicesStyles.featureItem}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={servicesStyles.featureText}>On-site Medical Services</Text>
            </View>
            <View style={servicesStyles.featureItem}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={servicesStyles.featureText}>Health Wellness Programs</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={servicesStyles.corporateButton}
            onPress={() => Alert.alert('Corporate Services', 'Our team will contact you within 24 hours to discuss your requirements.')}
            activeOpacity={0.7}
          >
            <Text style={servicesStyles.corporateButtonText}>Get Quote</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
