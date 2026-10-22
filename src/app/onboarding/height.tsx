import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "@/components/nutrak/buttons";
import { Panel, Segmented, TextField } from "@/components/nutrak/form";
import { OnboardingLayout } from "@/components/nutrak/onboarding-layout";
import { COLORS, IMAGES } from "@/constants/nutrak";
import { useStepNavigation } from "@/lib/use-step-navigation";
import { useOnboarding } from "@/store/onboarding";

const STEP = 3;
const MIN_CM = 45;
const MAX_CM = 210;
const CM_PER_INCH = 2.54;

type Unit = "cm" | "ft";

export default function HeightStep() {
  const { child, updateChild } = useOnboarding();
  const { goNext, editing } = useStepNavigation(STEP);
  const [unit, setUnit] = useState<Unit>("cm");
  const [cm, setCm] = useState(child.heightCm ? String(child.heightCm) : "");
  const initialInches = child.heightCm ? Math.round(child.heightCm / CM_PER_INCH) : null;
  const [ft, setFt] = useState(initialInches ? String(Math.floor(initialInches / 12)) : "");
  const [inch, setInch] = useState(initialInches ? String(initialInches % 12) : "");

  const heightCm =
    unit === "cm"
      ? Number(cm)
      : (Number(ft || 0) * 12 + Number(inch || 0)) * CM_PER_INCH;
  const hasInput = unit === "cm" ? cm.length > 0 : ft.length > 0 || inch.length > 0;
  const valid =
    Number.isFinite(heightCm) &&
    heightCm >= MIN_CM &&
    heightCm <= MAX_CM &&
    (unit === "cm" || Number(inch || 0) < 12);

  const next = () => {
    if (!valid) return;
    updateChild({ heightCm: Math.round(heightCm * 10) / 10 });
    goNext();
  };

  const numeric = (text: string, decimals = false) =>
    decimals ? text.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1") : text.replace(/\D/g, "");

  return (
    <OnboardingLayout
      step={STEP}
      icon="resize-outline"
      title={`How tall is ${child.name || "your child"}?`}
      description="Height helps us check growth and estimate daily energy needs."
      illustration={child.gender === "girl" ? IMAGES.girl : IMAGES.boy}
      footer={<PrimaryButton label={editing ? "SAVE" : "NEXT"} onPress={next} disabled={!valid} />}
    >
      <Panel>
        <Segmented
          options={[
            { value: "cm", label: "Centimetres" },
            { value: "ft", label: "Feet & inches" },
          ]}
          value={unit}
          onChange={setUnit}
        />

        {unit === "cm" ? (
          <TextField
            label="Height"
            icon="resize-outline"
            placeholder="e.g. 120"
            keyboardType="decimal-pad"
            maxLength={5}
            value={cm}
            onChangeText={(t) => setCm(numeric(t, true))}
            trailing={<Text style={styles.unit}>cm</Text>}
          />
        ) : (
          <View style={styles.row}>
            <View style={styles.flex}>
              <TextField
                label="Feet"
                placeholder="4"
                keyboardType="number-pad"
                maxLength={1}
                value={ft}
                onChangeText={(t) => setFt(numeric(t))}
                trailing={<Text style={styles.unit}>ft</Text>}
              />
            </View>
            <View style={styles.flex}>
              <TextField
                label="Inches"
                placeholder="2"
                keyboardType="number-pad"
                maxLength={2}
                value={inch}
                onChangeText={(t) => setInch(numeric(t))}
                trailing={<Text style={styles.unit}>in</Text>}
              />
            </View>
          </View>
        )}

        {hasInput && !valid ? (
          <Text style={styles.error}>
            Please enter a height between {MIN_CM} cm and {MAX_CM} cm
            {unit === "ft" ? " (inches must be 0–11)" : ""}.
          </Text>
        ) : valid && unit === "ft" ? (
          <Text style={styles.hint}>≈ {Math.round(heightCm)} cm</Text>
        ) : (
          <Text style={styles.hint}>Measure without shoes, standing straight.</Text>
        )}
      </Panel>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 12,
  },
  flex: {
    flex: 1,
  },
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
