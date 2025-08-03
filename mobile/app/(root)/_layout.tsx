import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FloatingAgentButton from '../FloatingAgent';

export default function RootLayout() {
  const insets = useSafeAreaInsets();
  
  // Detect if using gesture navigation (typically bottom inset > 0 on Android)
  const isGestureNavigation = Platform.OS === 'android' && insets.bottom > 0;
  
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#DC2626',
          tabBarInactiveTintColor: '#9CA3AF',
          headerShown: false,
          tabBarStyle: Platform.select({
            ios: {
              backgroundColor: '#FFFFFF',
              borderTopWidth: 1,
              borderTopColor: '#FCA5A5',
              height: 85,
              paddingBottom: 25,
              paddingTop: 10,
              shadowOpacity: 0,
              shadowColor: 'transparent',
            },
            default: {
              backgroundColor: '#FFFFFF',
              borderTopWidth: 1,
              borderTopColor: '#FCA5A5',
              height: 65,
              paddingBottom: 10,
              paddingTop: 5,
              elevation: 0,
              shadowOpacity: 0,
              shadowColor: 'transparent',
              // Dynamic margin based on navigation type
              marginBottom: isGestureNavigation ? 0 : 45,
            },
          }),
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
          },
        }}
      >
        {/* Your tab screens remain the same */}
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
      
      {/* Floating Agent Button */}
      <FloatingAgentButton />
    </View>
  );
}
