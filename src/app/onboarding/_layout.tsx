import { Redirect, Stack } from "expo-router";

import { COLORS } from "@/constants/nutrak";
import { useOnboarding } from "@/store/onboarding";

export default function OnboardingLayout() {
  const { isLoggedIn } = useOnboarding();

  if (!isLoggedIn) {
    return <Redirect href="/auth/consent" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        contentStyle: { backgroundColor: COLORS.background },
      }}
    />
  );
}
