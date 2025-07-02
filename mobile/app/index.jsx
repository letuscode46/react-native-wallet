import React from 'react';
import { Stack } from 'expo-router';
import SafeScreen from '../components/SafeScreen';

export default function RootLayout() {
  return (
    <SafeScreen>
      <Stack screenOptions={{ headerShown: true }} />
    </SafeScreen>
  );
}
