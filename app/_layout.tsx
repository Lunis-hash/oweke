import React from 'react';
import { Stack } from 'expo-router';
import { AppProvider } from '@/context/AppContext';
import { AuthProvider } from '@/context/auth';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { StripeProvider } from '@stripe/stripe-react-native';

const publishableKey = 
  process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || 
  'pk_test_51Tsn1y1n8AkKHpjmTxILfV3IUz9gohe14j4J5lDTLxie03bWa5mEY3dLJ2daF7GlifDjQwvKogZYhCIMYk3Y31FF00cS5Fv7ve';

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <StripeProvider publishableKey={publishableKey}>
        <AuthProvider>
          <AppProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'fade',
            }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="onboarding" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="interview" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" />
          </Stack>
        </AppProvider>
        </AuthProvider>
      </StripeProvider>
    </ErrorBoundary>
  );
}
