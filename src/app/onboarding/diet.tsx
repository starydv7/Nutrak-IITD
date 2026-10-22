import { useState } from "react";
import { View } from "react-native";

import { PrimaryButton } from "@/components/nutrak/buttons";
import { OnboardingLayout } from "@/components/nutrak/onboarding-layout";
import { OptionCard, TONES, type IconName, type Tone } from "@/components/nutrak/option-card";
import { IMAGES } from "@/constants/nutrak";
import { useStepNavigation } from "@/lib/use-step-navigation";
import { useOnboarding, type Diet } from "@/store/onboarding";

const STEP = 7;

const DIET_OPTIONS: { value: Diet; title: string; subtitle: string; icon: IconName; tone: Tone }[] = [
  { value: "vegetarian", title: "Vegetarian", subtitle: "Dairy, grains, pulses, fruits & vegetables", icon: "leaf", tone: TONES.green },
  { value: "eggetarian", title: "Eggetarian", subtitle: "Vegetarian food plus eggs", icon: "egg", tone: TONES.yellow },
  { value: "non_vegetarian", title: "Non-vegetarian", subtitle: "Includes eggs, chicken, fish or meat", icon: "food-drumstick", tone: TONES.orange },
  { value: "vegan", title: "Vegan", subtitle: "Only plant foods — no dairy, eggs or meat", icon: "sprout", tone: TONES.teal },
  { value: "jain", title: "Jain", subtitle: "Vegetarian without root vegetables", icon: "flower-tulip", tone: TONES.purple },
];

export default function DietStep() {
  const { child, updateChild } = useOnboarding();
  const { goNext, editing } = useStepNavigation(STEP);
  const [diet, setDiet] = useState<Diet | null>(child.diet);

  const next = () => {
    if (!diet) return;
    updateChild({ diet });
    goNext();
  };

  return (
    <OnboardingLayout
      step={STEP}
      icon="restaurant-outline"
      title={`What does ${child.name || "your child"} usually eat?`}
      description="We’ll only suggest foods that match your family’s food preferences."
      illustration={IMAGES.healthyFood}
      footer={<PrimaryButton label={editing ? "SAVE" : "NEXT"} onPress={next} disabled={!diet} />}
    >
      <View style={{ gap: 10 }} accessibilityRole="radiogroup">
        {DIET_OPTIONS.map((option) => (
          <OptionCard
            key={option.value}
            {...option}
            selected={diet === option.value}
            onPress={() => setDiet(option.value)}
          />
        ))}
      </View>
    </OnboardingLayout>
  );
}
