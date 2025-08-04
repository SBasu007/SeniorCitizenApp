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
                name="book"
                options={{
                    title: "book",
                    headerShown: false,
                }}
            />
        </Stack>
    );
}