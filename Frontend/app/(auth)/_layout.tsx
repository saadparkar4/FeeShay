import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Onboarding" />
      <Stack.Screen name="Welcome" />
      <Stack.Screen name="Login" />
      <Stack.Screen name="Register" />
    </Stack>
  );
} 