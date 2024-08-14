import { Stack } from "expo-router";

export default function Layout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="start" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="select" />
        <Stack.Screen name="location" />
        <Stack.Screen name="type" />
        <Stack.Screen name="subscription" />
      </Stack>
    </>
  );
}
