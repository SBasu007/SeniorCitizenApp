import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Text, View, SafeAreaView } from 'react-native';
import AmbulanceLoad from './ambulance';
import Hearse from './hearse';

export default function ServiceBookingPage() {
  const { id } = useLocalSearchParams();

  if (id === 'ambulance') {
    return <AmbulanceLoad />;
  }

  if (id === 'hearse') {
    return <Hearse />;
  }

  return (
    <SafeAreaView>
      <Text>Service not found: {id}</Text>
    </SafeAreaView>
  );
}