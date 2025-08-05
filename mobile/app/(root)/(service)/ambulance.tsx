import React, { useEffect, useState, useRef } from "react";
import { Platform, View, Text, SafeAreaView, ScrollView, TouchableOpacity, Alert,Animated } from "react-native";
import * as Location from 'expo-location';
import * as Linking from 'expo-linking';
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
    const [showTime, setShowTime] = useState(false);
    const pulseAnim = useRef(new Animated.Value(1)).current;

    const mapRef = useRef<MapView>(null);
    // Hardcoded ambulance location (nearby to user)
    const ambulanceLocation = {
        latitude: 37.3119983, 
        longitude:  -122.084,
        title: "Ambulance Station",
        description: "Nearest ambulance available"
    };
    /**
     * Gets user location and Available ambulances
     */
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


    /**
     * Centers map on user
     */
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

    const handleToggleETA = () => {
        setShowTime((prev) => !prev);
    };

    // Function to fit map to show both user and ambulance
    const fitMapToShowBoth = () => {
        if (!userlocation || !mapRef.current || !activeAmbulanceDetails) return;
        
        const coordinates = [
            {
                latitude: userlocation.coords.latitude,
                longitude: userlocation.coords.longitude,
            },
            {
                latitude: activeAmbulanceDetails.latitude,
                longitude: activeAmbulanceDetails.longitude,
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

    /**
     * handles call to ambulance driver
     */
    const handlCallDriver=()=>{
        if(activeAmbulanceDetails?.phone_number){
            const phoneNumber = `tel:${activeAmbulanceDetails.phone_number}`;
            Linking.openURL(phoneNumber);
        }else{
            Alert.alert("Phone number unavailable","Cannot place the call");
        }
    }
    
    /**
     * animation use effect
     */

    useEffect(() => {
    // Pulsing animation for "Waiting for driver..."
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);



    if (loadingLocation || loadingAmbulances || !userlocation || loadingActiveAmbulance) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
          🚨 Getting your Ambulance ready
        </Text>

        {loadingLocation && (
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>📍 Getting your location...</Text>
        )}
        {loadingAmbulances && (
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>🚑 Getting available ambulances...</Text>
        )}

        {!loadingLocation && !loadingAmbulances && loadingActiveAmbulance && (
          <Animated.Text
            style={{
              fontWeight: "bold",
              fontSize: 16,
              transform: [{ scale: pulseAnim }],
              marginTop: 10,
            }}
          >
            ⏳ Waiting for driver...
          </Animated.Text>
        )}
      </SafeAreaView>
    );
    }

return (
  <SafeAreaView style={ambulanceStyles.container}>
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>

      <View style={{ marginBottom: 20 }}>
        {activeAmbulanceDetails && (
        <View style={ambulanceStyles.bookedAmbulanceCard}>
            <Text style={{ color: 'white', fontSize: 20, textDecorationStyle: 'solid',fontWeight:'bold' }}>
                🚑 Ambulance on the way
            </Text>

            <Text style={ambulanceStyles.bookedAmbulanceCardText}>
                <Text style={{ fontWeight: 'bold' }}>Driver Name: </Text>
                {activeAmbulanceDetails.first_name} {activeAmbulanceDetails.last_name}
            </Text>

            <Text style={ambulanceStyles.bookedAmbulanceCardText}>
                <Text style={{ fontWeight: 'bold' }}>Driver Contact: </Text>
                {activeAmbulanceDetails.phone_number}
            </Text>

            <Text style={ambulanceStyles.bookedAmbulanceCardText}>
                <Text style={{ fontWeight: 'bold' }}>Ambulance Number: </Text>
                {activeAmbulanceDetails.license_plate}
            </Text>

            <Text style={ambulanceStyles.bookedAmbulanceCardText}>
                <Text style={{ fontWeight: 'bold' }}>Ambulance Location: </Text>
                {ambulanceLocation.title}
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
      {/* addition section */}
      <View style={ambulanceStyles.additionalSection}>
        <Text style={ambulanceStyles.additionalSectionTitle}>
            Shortcuts
        </Text>

        <View style={ambulanceStyles.additionalGrid}>
  {/* Call Driver Card */}
        <TouchableOpacity onPress={handlCallDriver} style={ambulanceStyles.additionalCard}>
            <View style={ambulanceStyles.cardRow}>
            <Ionicons name="call" size={20} color="#FF6B6B" style={{ marginRight: 6 }} />
            <Text style={ambulanceStyles.additionalCardText}>Call Driver</Text>
            </View>
        </TouchableOpacity>

        {/* Estimated Time Card */}
        <TouchableOpacity onPress={handleToggleETA} style={ambulanceStyles.additionalCard}>
            <View style={ambulanceStyles.cardRow}>
                <Ionicons name="time-outline" size={20} color="#FF6B6B" style={{ marginRight: 6 }} />
                <Text style={ambulanceStyles.additionalCardText}>
                {showTime ? "10 mins" : "ETA"}
                </Text>
            </View>
        </TouchableOpacity>
</View>
        </View>


    </ScrollView>
  </SafeAreaView>
);
}
