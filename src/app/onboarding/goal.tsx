import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "@/components/nutrak/buttons";
import { OnboardingLayout } from "@/components/nutrak/onboarding-layout";
import { OptionCard, TONES, type IconName, type Tone } from "@/components/nutrak/option-card";
import { COLORS, IMAGES } from "@/constants/nutrak";
import { useStepNavigation } from "@/lib/use-step-navigation";
import { useOnboarding, type Goal } from "@/store/onboarding";

const STEP = 10;

const OPTIONS: { value: Goal; title: string; subtitle: string; icon: IconName; tone: Tone }[] = [
  { value: "healthy_growth", title: "Healthy growth", subtitle: "Balanced nutrition for steady height and weight gain", icon: "sprout", tone: TONES.green },
  { value: "weight_gain", title: "Healthy weight gain", subtitle: "My child is underweight or a slow gainer", icon: "trending-up", tone: TONES.blue },
  { value: "weight_management", title: "Healthy weight management", subtitle: "Better food habits without restricting growth", icon: "scale-balance", tone: TONES.teal },
  { value: "immunity", title: "Better immunity", subtitle: "Fewer colds and infections", icon: "shield-check", tone: TONES.purple },
  { value: "focus", title: "Focus & learning", subtitle: "Brain-friendly foods for school performance", icon: "brain", tone: TONES.pink },
  { value: "picky_eating", title: "Overcome picky eating", subtitle: "Fun ideas to try new foods", icon: "food-apple", tone: TONES.orange },
];

export default function GoalStep() {
  const { child, updateChild } = useOnboarding();
  const { goNext, editing } = useStepNavigation(STEP);
  const [goal, setGoal] = useState<Goal | null>(child.goal);

  const next = () => {
    if (!goal) return;
    updateChild({ goal });
    goNext();
  };

  return (
    <OnboardingLayout
      step={STEP}
      icon="flag-outline"
      title="What’s your main goal?"
      description={`Choose what matters most for ${child.name || "your child"} right now. You can change this anytime.`}
      illustration={IMAGES.healthyFood}
      footer={<PrimaryButton label={editing ? "SAVE" : "NEXT"} onPress={next} disabled={!goal} />}
    >
      <View style={{ gap: 10 }} accessibilityRole="radiogroup">
        {OPTIONS.map((option) => (
          <OptionCard
            key={option.value}
            {...option}
            selected={goal === option.value}
            onPress={() => setGoal(option.value)}
          />
        ))}
      </View>
      {goal === "weight_management" && (
        <Text style={styles.note}>
          For growing children we focus on better food quality and activity,
          not calorie cutting. Please involve your paediatrician for weight
          concerns.
        </Text>
      )}
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  note: {
    padding: 12,
    borderRadius: 14,
    backgroundColor: "#EEF7EA",
    color: COLORS.textGreen,
    fontSize: 12,
    lineHeight: 17,
    overflow: "hidden",
  },
});
