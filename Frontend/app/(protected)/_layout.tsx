import AuthContext from "@/context/AuthContext";
import { Redirect, Stack } from "expo-router";
import React, { useContext } from "react";
import { StyleSheet } from "react-native";

const ProtectedLayout = () => {
  const { isAuthenticated } = useContext(AuthContext);
  if (!isAuthenticated) return <Redirect href={"/Welcome"} />;
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
};

export default ProtectedLayout;

const styles = StyleSheet.create({});
