import { Slot, Stack } from "expo-router";
import React from "react";
import SafeScreen from '@/components/SafeScreen';
import { StatusBar } from "react-native";
export default function RootLayout() {
  return (
    <SafeScreen >
      <StatusBar backgroundColor="#FCF3F2" barStyle="dark-content" />
      <Slot />
    </SafeScreen>
  );
}
