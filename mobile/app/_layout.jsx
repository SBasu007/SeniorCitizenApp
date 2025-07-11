import { Slot, Stack } from "expo-router";
import React from "react";
import SafeScreen from '@/components/SafeScreen';
import { StatusBar } from "react-native";
import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache'

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <SafeScreen >
      <StatusBar backgroundColor="#FCF3F2" barStyle="dark-content" />
      <Slot />
    </SafeScreen>
    </ClerkProvider>
    
  );
}
