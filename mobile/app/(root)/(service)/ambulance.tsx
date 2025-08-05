import React, { useEffect, useState, useRef } from "react";
import { Platform, View, Text, SafeAreaView, ScrollView, TouchableOpacity, Alert } from "react-native";
import * as Location from 'expo-location';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from "@clerk/clerk-expo";
import { Ambulance } from "@/app/utils/Models/AmbulanceResponse";
import { ServiceApi } from "@/app/utils/axiosapi";
import AmbulanceMap from "./ambulanceMap";
import {ambulanceStyles} from "../../styles/ambulance.style"

export default function ambulanceLoad() {
    const { getToken } = useAuth();
    const [userlocation, setUserLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
    const [loadingLocation, setLoadingLocation] = useState<Boolean>(true);
    const [loadingAmbulances, setLoadingAmbulances] = useState<Boolean>(true);
    const [loadingActiveAmbulance,setLoadingActiveAmbulance] = useState<Boolean>(true)
    const [activeAmbulanceDetails,setActiveAmbulance] = useState<Ambulance | null>(null);
    
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
            setLoadingLocation(true);
            try {
                const location = await ServiceApi.getLocation();
                setUserLocation(location);
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
            } finally {
                setLoadingLocation(false);
            }
        };

        const getAvailableAmbulances = async () => {
            setLoadingAmbulances(true);
            try {
                const token = await getToken();
                if (!token) return;
                const response = await ServiceApi.availableAmbulances(token);
                //console.log(response.data)
                setAmbulances(response.data);
            } catch (error) {
                console.error("Error fetching ambulances:", error);
                setErrorMsg("Failed to fetch ambulances");
            } finally {
                setLoadingAmbulances(false);
            }
        };


        getCurrentLocation();
        getAvailableAmbulances();
    }, []);

    /**
     * 
     * @returns void sets active ambulacne to the first ambulance from the list of available ambulances
     */
    const bookingAccepted = () => {
        if (!ambulances || ambulances.length === 0 || !userlocation) return;

        setActiveAmbulance(ambulances[0]);
        setLoadingActiveAmbulance(false);
    };

    useEffect(() => {
        if (
            !loadingLocation &&
            !loadingAmbulances &&
            ambulances.length > 0 &&
            userlocation &&
            !activeAmbulanceDetails
        ) {
            const timeout = setTimeout(() => {
            bookingAccepted();
            }, 2000); // optional delay for realism

            return () => clearTimeout(timeout);
        }
    }, [loadingLocation, loadingAmbulances, ambulances, userlocation]);


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
    // const calculateDistance = () => {
    //     if (!userlocation) return null;
        
    //     const R = 6371; // Earth's radius in kilometers
    //     const lat1 = userlocation.coords.latitude;
    //     const lon1 = userlocation.coords.longitude;
    //     const lat2 = ambulanceLocation.latitude;
    //     const lon2 = ambulanceLocation.longitude;
        
    //     const dLat = (lat2 - lat1) * Math.PI / 180;
    //     const dLon = (lon2 - lon1) * Math.PI / 180;
        
    //     const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    //               Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    //               Math.sin(dLon/2) * Math.sin(dLon/2);
        
    //     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    //     const distance = R * c;
        
    //     return distance.toFixed(1);
    // };

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
    if (loadingLocation || loadingAmbulances || !userlocation || loadingActiveAmbulance) {
    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, marginBottom: 10 }}>Getting your Ambulance ready</Text>

        {loadingLocation && <Text>Getting your location...</Text>}
        {loadingAmbulances && <Text>Getting available ambulances...</Text>}

        {!loadingLocation && !loadingAmbulances && loadingActiveAmbulance && (
            <Text>Waiting for driver...</Text>
        )}

        </SafeAreaView>
    );
    }

return (
  <SafeAreaView style={ambulanceStyles.container}>
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>

      <View style={{ marginBottom: 20 }}>

        {/* <View style={ambulanceStyles.bookedAmbulanceCard}>
            <Text style={{color:'white',fontSize:20,textDecorationStyle:'solid'}}>
                Your Location:
            </Text>
            <Text style={ambulanceStyles.bookedAmbulanceCardText}>Latitude: {userlocation.coords.latitude}</Text>
            <Text style={ambulanceStyles.bookedAmbulanceCardText}>Longitude: {userlocation.coords.longitude}</Text>
            <Text style={ambulanceStyles.bookedAmbulanceCardText}>Accuracy: {userlocation.coords.accuracy} meters</Text>
        </View> */}

        {activeAmbulanceDetails && (
        <View style={ambulanceStyles.bookedAmbulanceCard}>
            <Text style={{ color: 'white', fontSize: 20, textDecorationStyle: 'solid' }}>
            🚑 Booked Ambulance
            </Text>
            <Text style={ambulanceStyles.bookedAmbulanceCardText}>
            Driver: {activeAmbulanceDetails.first_name} {activeAmbulanceDetails.last_name}
            </Text>
            <Text style={ambulanceStyles.bookedAmbulanceCardText}>
            Phone: {activeAmbulanceDetails.phone_number}
            </Text>
            <Text style={ambulanceStyles.bookedAmbulanceCardText}>
            Plate: {activeAmbulanceDetails.license_plate}
            </Text>
            <Text style={ambulanceStyles.bookedAmbulanceCardText}>
            Location: {ambulanceLocation.title}
            </Text>
        </View>
        )}

      </View>

      {/* Inject the Map here */}
      <AmbulanceMap
        userlocation={userlocation}
        ambulanceLocation={ambulanceLocation}
        mapRef={mapRef}
        onCenter={centerOnUser}
        onFit={fitMapToShowBoth}
      />

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
