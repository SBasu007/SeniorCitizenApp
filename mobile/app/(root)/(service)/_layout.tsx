import React from "react";
import { Stack } from "expo-router";

export default function ServiceLayout() {
    return (
        <Stack >
            <Stack.Screen 
                name="services" 
                options={{
                    title: "Services",
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="ambulance"
                options={{
                    title: "Booking Ambulance",
                    headerShown: true,
                    headerStyle: {
                    backgroundColor: '#FCF3F2', // light background
                    },
                    headerTintColor: '#000', // <-- this sets the text and back icon color to black
                    headerTitleStyle: {
                    fontWeight: 'bold',
                    },
                }}
            />
            <Stack.Screen
                name="hearse"
                options={{
                    title: "Booking Hearse",
                    headerShown: true,
                    headerStyle: {
                    backgroundColor: '#FCF3F2', // light background
                    },
                    headerTintColor: '#000', // <-- this sets the text and back icon color to black
                    headerTitleStyle: {
                    fontWeight: 'bold',
                    },
                }}
            />
        </Stack>
    );
}