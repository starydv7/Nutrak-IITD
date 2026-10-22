import { useState } from "react";
import { View } from "react-native";

import { PrimaryButton } from "@/components/nutrak/buttons";
import { OnboardingLayout } from "@/components/nutrak/onboarding-layout";
import { OptionCard, TONES, type IconName, type Tone } from "@/components/nutrak/option-card";
import { IMAGES } from "@/constants/nutrak";
import { useStepNavigation } from "@/lib/use-step-navigation";
import { useOnboarding, type Activity } from "@/store/onboarding";

const STEP = 8;

const OPTIONS: { value: Activity; title: string; subtitle: string; icon: IconName; tone: Tone }[] = [
  { value: "sedentary", title: "Mostly inactive", subtitle: "Mostly sitting — screens, reading, little outdoor play", icon: "sofa-single", tone: TONES.slate },
  { value: "low", title: "Lightly active", subtitle: "Some play or walking, under 1 hour a day", icon: "walk", tone: TONES.blue },
  { value: "active", title: "Active", subtitle: "1–2 hours of play, cycling or sports most days", icon: "bike", tone: TONES.green },
  { value: "very_active", title: "Very active", subtitle: "Over 2 hours of sports or training daily", icon: "run-fast", tone: TONES.orange },
];

export default function ActivityStep() {
  const { child, updateChild } = useOnboarding();
  const { goNext, editing } = useStepNavigation(STEP);
  const [activity, setActivity] = useState<Activity | null>(child.activity);

  const next = () => {
    if (!activity) return;
    updateChild({ activity });
    goNext();
  };

  return (
    <OnboardingLayout
      step={STEP}
      icon="football-outline"
      title={`How active is ${child.name || "your child"}?`}
      description="Think about a typical day including school, play and sports."
      illustration={IMAGES.happyChild}
      footer={<PrimaryButton label={editing ? "SAVE" : "NEXT"} onPress={next} disabled={!activity} />}
    >
      <View style={{ gap: 10 }} accessibilityRole="radiogroup">
        {OPTIONS.map((option) => (
          <OptionCard
            key={option.value}
            {...option}
            selected={activity === option.value}
            onPress={() => setActivity(option.value)}
          />
        ))}
      </View>
    </OnboardingLayout>
  );
}
