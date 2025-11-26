import React from "react";
import { Stack } from "expo-router";

const SettingLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Settings" }} />
    </Stack>
  );
};

export default SettingLayout;
