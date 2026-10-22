import { useState } from "react";
import { StyleSheet, Text } from "react-native";

import { PrimaryButton } from "@/components/nutrak/buttons";
import { Panel, Segmented, TextField } from "@/components/nutrak/form";
import { OnboardingLayout } from "@/components/nutrak/onboarding-layout";
import { COLORS, IMAGES } from "@/constants/nutrak";
import { useStepNavigation } from "@/lib/use-step-navigation";
import { useOnboarding } from "@/store/onboarding";

const STEP = 4;
const MIN_KG = 5;
const MAX_KG = 150;
const LB_PER_KG = 2.20462;

type Unit = "kg" | "lb";

export default function WeightStep() {
  const { child, updateChild } = useOnboarding();
  const { goNext, editing } = useStepNavigation(STEP);
  const [unit, setUnit] = useState<Unit>("kg");
  const [text, setText] = useState(child.weightKg ? String(child.weightKg) : "");

  const changeUnit = (nextUnit: Unit) => {
    const value = Number(text);
    if (text && Number.isFinite(value) && nextUnit !== unit) {
      const converted = nextUnit === "lb" ? value * LB_PER_KG : value / LB_PER_KG;
      setText(String(Math.round(converted * 10) / 10));
    }
    setUnit(nextUnit);
  };

  const weightKg = unit === "kg" ? Number(text) : Number(text) / LB_PER_KG;
  const valid =
    text.length > 0 && Number.isFinite(weightKg) && weightKg >= MIN_KG && weightKg <= MAX_KG;

  const next = () => {
    if (!valid) return;
    updateChild({ weightKg: Math.round(weightKg * 10) / 10 });
    goNext();
  };

  return (
    <OnboardingLayout
      step={STEP}
      icon="barbell-outline"
      title={`How much does ${child.name || "your child"} weigh?`}
      description="Weight lets us calculate the right amount of energy and protein each day."
      illustration={IMAGES.healthyFood}
      footer={<PrimaryButton label={editing ? "SAVE" : "NEXT"} onPress={next} disabled={!valid} />}
    >
      <Panel>
        <Segmented
          options={[
            { value: "kg", label: "Kilograms" },
            { value: "lb", label: "Pounds" },
          ]}
          value={unit}
          onChange={changeUnit}
        />
        <TextField
          label="Weight"
          icon="speedometer-outline"
          placeholder={unit === "kg" ? "e.g. 22.5" : "e.g. 50"}
          keyboardType="decimal-pad"
          maxLength={5}
          value={text}
          onChangeText={(t) => setText(t.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1"))}
          trailing={<Text style={styles.unit}>{unit}</Text>}
        />
        {text.length > 0 && !valid ? (
          <Text style={styles.error}>
            Please enter a weight between {MIN_KG} kg and {MAX_KG} kg.
          </Text>
        ) : valid && unit === "lb" ? (
          <Text style={styles.hint}>≈ {Math.round(weightKg * 10) / 10} kg</Text>
        ) : (
          <Text style={styles.hint}>Weigh in the morning in light clothing for best accuracy.</Text>
        )}
      </Panel>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  unit: {
    color: COLORS.mutedGreen,
    fontSize: 14,
    fontWeight: "700",
  },
  error: {
    color: COLORS.error,
    fontSize: 12,
    fontWeight: "600",
  },
  hint: {
    color: COLORS.mutedGreen,
    fontSize: 12,
  },
});
