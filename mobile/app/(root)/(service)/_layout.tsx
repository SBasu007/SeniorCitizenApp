import React from 'react';
import { Stack } from 'expo-router';

export default function ServiceLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#FCF3F2' },
        headerTintColor: '#000',
        headerTitleStyle: { fontWeight: 'bold' },
        headerShown: true, // Ensure header is always shown by default
      }}
    >
      {/* This sets the title for the main services page */}
      <Stack.Screen name="services" options={{ title: 'Services', headerShown:false}} />

      {/* This Stack.Screen manages the emergency service booking page */}
      <Stack.Screen name='emergency/ambulance' options={{title:'Emergency Ambulance'}}/>
      <Stack.Screen name='emergency/hearse' options={{title:'Emergency Hearse'}}/>
      <Stack.Screen name='regular/online-consultation' options={{title:'Online Consultation'}}/>
      <Stack.Screen name='regular/bookdoctor' options={{title:'Confirm Booking'}}/>
    </Stack>
  );
}