import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "@/components/nutrak/buttons";
import { OnboardingLayout } from "@/components/nutrak/onboarding-layout";
import { COLORS, IMAGES } from "@/constants/nutrak";
import { useStepNavigation } from "@/lib/use-step-navigation";
import { useOnboarding, type Gender } from "@/store/onboarding";

const STEP = 6;

const OPTIONS = [
  {
    value: "boy",
    label: "Boy",
    image: IMAGES.boy,
    symbol: "gender-male",
    accent: COLORS.blue,
    light: COLORS.blueLight,
    circle: "#A9DFFF",
    gradient: ["#168CF5", "#1681E7"],
  },
  {
    value: "girl",
    label: "Girl",
    image: IMAGES.girl,
    symbol: "gender-female",
    accent: COLORS.pink,
    light: COLORS.pinkLight,
    circle: "#FFB8D4",
    gradient: ["#F52D7A", "#F02570"],
  },
] as const;

export default function GenderStep() {
  const { child, updateChild } = useOnboarding();
  const { goNext, editing } = useStepNavigation(STEP);
  const [gender, setGender] = useState<Gender | null>(child.gender);

  const next = () => {
    if (!gender) return;
    updateChild({ gender });
    goNext();
  };

  return (
    <OnboardingLayout
      step={STEP}
      icon="people-outline"
      title={`What is ${child.name ? `${child.name}’s` : "your child’s"} gender?`}
      description="Please select your child’s gender so we can provide the most relevant nutrition recommendations."
      illustration={
        <View style={styles.pair}>
          <Image source={IMAGES.boy} style={styles.pairImage} resizeMode="contain" />
          <Image source={IMAGES.girl} style={styles.pairImage} resizeMode="contain" />
        </View>
      }
      footer={<PrimaryButton label={editing ? "SAVE" : "NEXT"} onPress={next} disabled={!gender} />}
    >
      <View style={styles.row} accessibilityRole="radiogroup">
        {OPTIONS.map((option) => {
          const selected = gender === option.value;
          return (
            <Pressable
              key={option.value}
              accessibilityRole="radio"
              accessibilityLabel={option.label}
              accessibilityState={{ selected }}
              onPress={() => setGender(option.value)}
              style={({ pressed }) => [
                styles.card,
                { backgroundColor: option.light },
                selected && { borderColor: option.accent },
                pressed && styles.pressed,
              ]}
            >
              <View style={styles.avatarArea}>
                <View style={[styles.circle, { backgroundColor: option.circle }]} />
                <Image source={option.image} style={styles.avatar} resizeMode="contain" />
                <View style={[styles.symbol, { backgroundColor: option.accent }]}>
                  <MaterialCommunityIcons name={option.symbol} size={20} color={COLORS.white} />
                </View>
                {selected && (
                  <View style={[styles.check, { backgroundColor: option.accent }]}>
                    <Ionicons name="checkmark" size={16} color={COLORS.white} />
                  </View>
                )}
              </View>
              <LinearGradient
                colors={option.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.label}
              >
                <Text style={styles.labelText}>{option.label}</Text>
              </LinearGradient>
            </Pressable>
          );
        })}
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  pair: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  pairImage: {
    flex: 1,
    height: "100%",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  card: {
    flex: 1,
    padding: 12,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "transparent",
    gap: 12,
  },
  pressed: {
    opacity: 0.9,
  },
  avatarArea: {
    height: 180,
    alignItems: "center",
    justifyContent: "center",
  },
  circle: {
    position: "absolute",
    width: "88%",
    aspectRatio: 1,
    maxHeight: 160,
    borderRadius: 999,
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  symbol: {
    position: "absolute",
    top: 4,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  check: {
    position: "absolute",
    top: 4,
    left: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  label: {
    minHeight: 50,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  labelText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "900",
  },
});
