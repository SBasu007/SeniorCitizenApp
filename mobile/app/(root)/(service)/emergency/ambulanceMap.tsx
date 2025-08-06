import React, { useEffect } from "react";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";
import { LocationObject } from "expo-location";
import { ambulanceStyles } from "@/app/styles/ambulance.style";
interface Props {
    userlocation: LocationObject;
    ambulanceLocation: {
        latitude: number;
        longitude: number;
        title: string;
        description: string;
    };
    mapRef: React.RefObject<MapView|null>;
    onCenter: () => void;
    onFit: () => void;
}

const AmbulanceMap: React.FC<Props> = ({ userlocation, ambulanceLocation, mapRef, onCenter, onFit }) => {
    return (
        <View style={ambulanceStyles.mapContainer}>
            <MapView
                ref={mapRef}
                style={ambulanceStyles.map}
                provider={PROVIDER_GOOGLE}
                initialRegion={{
                    latitude: userlocation.coords.latitude,
                    longitude: userlocation.coords.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
                showsUserLocation={true}
                showsMyLocationButton={false}
                scrollEnabled={true}
                zoomEnabled={true}
                rotateEnabled={true}
                pitchEnabled={true}
                onMapReady={onFit}
            >
                <Marker
                    coordinate={{
                        latitude: userlocation.coords.latitude,
                        longitude: userlocation.coords.longitude,
                    }}
                    title="Your Location"
                    description="You are here"
                    pinColor="red"
                />
                <Marker
                    coordinate={{
                        latitude: ambulanceLocation.latitude,
                        longitude: ambulanceLocation.longitude,
                    }}
                    title={ambulanceLocation.title}
                    description={ambulanceLocation.description}
                    pinColor="blue"
                />
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
            </MapView>

            <TouchableOpacity
                style={{
                    position: "absolute",
                    bottom: 20,
                    right: 20,
                    backgroundColor: "white",
                    borderRadius: 25,
                    width: 50,
                    height: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                }}
                onPress={onCenter}
            >
                <Ionicons name="locate" size={24} color="#007AFF" />
            </TouchableOpacity>

            <TouchableOpacity
                style={{
                    position: "absolute",
                    bottom: 20,
                    right: 80,
                    backgroundColor: "white",
                    borderRadius: 25,
                    width: 50,
                    height: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                }}
                onPress={onFit}
            >
                <Ionicons name="map" size={24} color="#0066cc" />
            </TouchableOpacity>
        </View>
    );
};

export default AmbulanceMap;
