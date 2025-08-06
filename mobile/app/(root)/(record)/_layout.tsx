import React from "react";
import { Stack } from "expo-router";

export default function ServiceLayout() {
    return (
        <Stack >
            <Stack.Screen 
                name="record" 
                options={{
                    title: "Records",
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="analytics"
                options={{
                    title: "Your Record Analysis",
                    headerShown: true,
                    headerStyle: {
                    backgroundColor: 'white', // light background
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