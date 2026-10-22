import { useState } from "react";
import { View } from "react-native";

import { PrimaryButton } from "@/components/nutrak/buttons";
import { OnboardingLayout } from "@/components/nutrak/onboarding-layout";
import { OptionCard, TONES, type IconName, type Tone } from "@/components/nutrak/option-card";
import { IMAGES } from "@/constants/nutrak";
import { useStepNavigation } from "@/lib/use-step-navigation";
import { useOnboarding, type Relationship } from "@/store/onboarding";

const STEP = 2;

const OPTIONS: { value: Relationship; title: string; subtitle: string; icon: IconName; tone: Tone }[] = [
  { value: "mother", title: "Mother", subtitle: "I’m the child’s mother", icon: "human-female", tone: TONES.pink },
  { value: "father", title: "Father", subtitle: "I’m the child’s father", icon: "human-male", tone: TONES.blue },
  { value: "guardian", title: "Legal guardian", subtitle: "I’m the child’s legal guardian", icon: "shield-account", tone: TONES.teal },
  { value: "other", title: "Other caregiver", subtitle: "Grandparent or family caregiver with guardian consent", icon: "account-heart", tone: TONES.yellow },
];

export default function RelationshipStep() {
  const { child, updateChild } = useOnboarding();
  const { goNext, editing } = useStepNavigation(STEP);
  const [value, setValue] = useState<Relationship | null>(child.relationship);
  const name = child.name || "your child";

  const next = () => {
    if (!value) return;
    updateChild({ relationship: value });
    goNext();
  };

  return (
    <OnboardingLayout
      step={STEP}
      icon="people-outline"
      title={`How are you related to ${name}?`}
      description="This helps us tailor tips and communication for you."
      illustration={IMAGES.family}
      footer={<PrimaryButton label={editing ? "SAVE" : "NEXT"} onPress={next} disabled={!value} />}
    >
      <View style={{ gap: 10 }} accessibilityRole="radiogroup">
        {OPTIONS.map((option) => (
          <OptionCard
            key={option.value}
            title={option.title}
            subtitle={option.subtitle}
            icon={option.icon}
            tone={option.tone}
            selected={value === option.value}
            onPress={() => setValue(option.value)}
          />
        ))}
      </View>
    </OnboardingLayout>
  );
}
