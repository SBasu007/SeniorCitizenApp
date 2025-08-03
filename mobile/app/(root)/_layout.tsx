import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#DC2626', // Red color for active tabs
        tabBarInactiveTintColor: '#9CA3AF', // Light gray for inactive tabs
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: {
            backgroundColor: '#FFFFFF', // White background
            borderTopWidth: 1,
            borderTopColor: '#FCA5A5', // Light red border
            height: 85,
            paddingBottom: 25,
            paddingTop: 10,
            shadowOpacity: 0,      // <-- remove shadow
            shadowColor: 'transparent', // <-- remove shadow
          },
          default: {
            backgroundColor: '#FFFFFF', // White background
            borderTopWidth: 1,
            borderTopColor: '#FCA5A5', // Light red border
            height: 65,
            paddingBottom: 10,
            paddingTop: 5,
            elevation: 0,          // <-- remove shadow
            shadowOpacity: 0,      // <-- remove shadow
            shadowColor: 'transparent', // <-- remove shadow
          },
        }),
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'chatbubbles' : 'chatbubbles-outline'} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="record"
        options={{
          title: 'Record',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'document' : 'document-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          title: 'Services',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'grid' : 'grid-outline'} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'analytics' : 'analytics-outline'} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
  );
}
