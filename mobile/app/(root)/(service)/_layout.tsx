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
                }}
            />
        </Stack>
    );
}