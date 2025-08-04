import React, { useEffect, useState, useRef } from "react";
import { Platform, View, Text, SafeAreaView, ScrollView, TouchableOpacity, Alert } from "react-native";
import * as Location from 'expo-location';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from "@clerk/clerk-expo";
import { Ambulance } from "@/app/utils/Models/AmbulanceResponse";
import { authApi } from "@/app/utils/axiosapi";

export default function Form() {
    const { getToken } = useAuth();
    const [userlocation, setUserLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
    const mapRef = useRef<MapView>(null);
    // Hardcoded ambulance location (nearby to user)
    const ambulanceLocation = {
        latitude: 37.3119983, 
        longitude:  -122.084,
        title: "Ambulance Station",
        description: "Nearest ambulance available"
    };
    useEffect(() => {
        const getCurrentLocation = async () => {
            try {
                // Request permission
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== "granted") {
                    setErrorMsg("Permission to access location was denied");
                    return;
                }

                // Get current location
                let location = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.High,
                    timeInterval: 5000,
                    distanceInterval: 10
                });
                setUserLocation(location);
                //console.log("Location obtained:", location);
                
                // Animate map to user's location
                if (mapRef.current) {
                    mapRef.current.animateToRegion({
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }, 1000);
                }
            } catch (error) {
                console.error("Error getting location:", error);
                setErrorMsg("Error getting location");
            }
        };

        const getAvailableAmbulances = async () => {
            try {
                const token = await getToken();
                if (!token) {
                    console.error("No token available");
                    return;
                }
                
                const response = await authApi.availableAmbulances(token);
                //console.log("Ambulances fetched:", response.data);
                setAmbulances(response.data);
            } catch (error) {
                console.error("Error fetching ambulances:", error);
                setErrorMsg("Failed to fetch ambulances");
            }
        }

        getCurrentLocation();
        getAvailableAmbulances();
    }, []);

    const centerOnUser = () => {
        if (userlocation && mapRef.current) {
            mapRef.current.animateToRegion({
                latitude: userlocation.coords.latitude,
                longitude: userlocation.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            }, 1000);
        }
    };

    // Calculate distance between user and ambulance
    const calculateDistance = () => {
        if (!userlocation) return null;
        
        const R = 6371; // Earth's radius in kilometers
        const lat1 = userlocation.coords.latitude;
        const lon1 = userlocation.coords.longitude;
        const lat2 = ambulanceLocation.latitude;
        const lon2 = ambulanceLocation.longitude;
        
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;
        
        return distance.toFixed(1);
    };

    // Function to fit map to show both user and ambulance
    const fitMapToShowBoth = () => {
        if (!userlocation || !mapRef.current) return;
        
        const coordinates = [
            {
                latitude: userlocation.coords.latitude,
                longitude: userlocation.coords.longitude,
            },
            {
                latitude: ambulanceLocation.latitude,
                longitude: ambulanceLocation.longitude,
            },
        ];
        
        mapRef.current.fitToCoordinates(coordinates, {
            edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
            animated: true,
        });
    };

    // Call fitMapToShowBoth when location is obtained
    useEffect(() => {
        if (userlocation) {
            setTimeout(() => {
                fitMapToShowBoth();
            }, 1000);
        }
    }, [userlocation]);
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView 
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: 20 }}
                showsVerticalScrollIndicator={false}
            >
                <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
                    Book Ambulance
                </Text>
                
                {errorMsg ? (
                    <Text style={{ color: 'red', marginBottom: 10 }}>
                        {errorMsg}
                    </Text>
                ) : null}
                
                {userlocation ? (
                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
                            Your Location:
                        </Text>
                        <Text>Latitude: {userlocation.coords.latitude}</Text>
                        <Text>Longitude: {userlocation.coords.longitude}</Text>
                        <Text>Accuracy: {userlocation.coords.accuracy} meters</Text>
                        
                        <View style={{ marginTop: 15, padding: 15, backgroundColor: '#f0f8ff', borderRadius: 8 }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#0066cc', marginBottom: 5 }}>
                                🚑 Nearest Ambulance
                            </Text>
                            <Text>Distance: {calculateDistance()} km</Text>
                            <Text>Location: {ambulanceLocation.title}</Text>
                        </View>
                    </View>
                ) : (
                    <Text>Getting your location...</Text>
                )}
                
                <View style={{ height: 300, marginTop: 20, marginBottom: 20, position: 'relative' }}>
                    <MapView 
                        ref={mapRef}
                        style={{ width: '100%', height: '100%' }}
                        provider={PROVIDER_GOOGLE}
                        initialRegion={{
                            latitude: userlocation?.coords.latitude || 37.78825,
                            longitude: userlocation?.coords.longitude || -122.4324,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        }}
                        showsUserLocation={true}
                        showsMyLocationButton={false}
                        scrollEnabled={true}
                        zoomEnabled={true}
                        rotateEnabled={true}
                        pitchEnabled={true}
                    >
                        {userlocation && (
                            <Marker
                                coordinate={{
                                    latitude: userlocation.coords.latitude,
                                    longitude: userlocation.coords.longitude,
                                }}
                                title="Your Location"
                                description="You are here"
                                pinColor="red"
                            />
                        )}
                        
                        {/* Ambulance Marker */}
                        <Marker
                            coordinate={{
                                latitude: ambulanceLocation.latitude,
                                longitude: ambulanceLocation.longitude,
                            }}
                            title={ambulanceLocation.title}
                            description={ambulanceLocation.description}
                            pinColor="blue"
                        />

                        {/* Route Line between User and Ambulance */}
                        {userlocation && (
                            <Polyline
                                coordinates={[
                                    {
                                        latitude: userlocation.coords.latitude,
                                        longitude: userlocation.coords.longitude,
                                    },
                                    {
                                        latitude: ambulanceLocation.latitude,
                                        longitude: ambulanceLocation.longitude,
                                    },
                                ]}
                                strokeColor="#0066cc"
                                strokeWidth={4}
                            />
                        )}

                    </MapView>
                    
                    {/* Custom location button */}
                    <TouchableOpacity
                        style={{
                            position: 'absolute',
                            bottom: 20,
                            right: 20,
                            backgroundColor: 'white',
                            borderRadius: 25,
                            width: 50,
                            height: 50,
                            justifyContent: 'center',
                            alignItems: 'center',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            elevation: 5,
                        }}
                        onPress={centerOnUser}
                    >
                        <Ionicons name="locate" size={24} color="#007AFF" />
                    </TouchableOpacity>

                    {/* Show route button */}
                    <TouchableOpacity
                        style={{
                            position: 'absolute',
                            bottom: 20,
                            right: 80,
                            backgroundColor: 'white',
                            borderRadius: 25,
                            width: 50,
                            height: 50,
                            justifyContent: 'center',
                            alignItems: 'center',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            elevation: 5,
                        }}
                        onPress={fitMapToShowBoth}
                    >
                        <Ionicons name="map" size={24} color="#0066cc" />
                    </TouchableOpacity>
                </View>
                
                {/* Add more content below the map */}
                <View style={{ marginBottom: 20 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
                        Service Details
                    </Text>
                    <Text>Additional content can go here...</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}