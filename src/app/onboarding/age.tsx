import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useState, type ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "@/components/nutrak/buttons";
import { TextField } from "@/components/nutrak/form";
import { OnboardingLayout } from "@/components/nutrak/onboarding-layout";
import { COLORS, IMAGES } from "@/constants/nutrak";
import {
  MAX_AGE_YEARS,
  MIN_AGE_YEARS,
  diffYearsMonths,
  formatAge,
  isoToDisplay,
  parseDob,
  toIsoDate,
} from "@/lib/nutrition";
import { useStepNavigation } from "@/lib/use-step-navigation";
import { useOnboarding, type AgeInput } from "@/store/onboarding";

const STEP = 5;

type Mode = AgeInput["mode"];

function maskDob(text: string) {
  const digits = text.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

function inRange(years: number, months: number) {
  const total = years + months / 12;
  return total >= MIN_AGE_YEARS && total <= MAX_AGE_YEARS;
}

export default function AgeStep() {
  const { child, updateChild } = useOnboarding();
  const { goNext, editing } = useStepNavigation(STEP);
  const saved = child.age;
  const [mode, setMode] = useState<Mode>(saved?.mode ?? "dob");
  const [dob, setDob] = useState(saved?.mode === "dob" ? isoToDisplay(saved.dob) : "");
  const [years, setYears] = useState(saved?.mode === "age" ? String(saved.years) : "");
  const [months, setMonths] = useState(saved?.mode === "age" ? String(saved.months) : "");

  let age: AgeInput | null = null;
  let error: string | null = null;

  if (mode === "dob") {
    if (dob.length === 10) {
      const date = parseDob(dob);
      if (!date) {
        error = "Please enter a valid date as DD/MM/YYYY.";
      } else if (date > new Date()) {
        error = "Date of birth can’t be in the future.";
      } else {
        const diff = diffYearsMonths(date);
        if (inRange(diff.years, diff.months)) {
          age = { mode: "dob", dob: toIsoDate(date) };
        } else {
          error = `Nutrak supports children aged ${MIN_AGE_YEARS}–${MAX_AGE_YEARS} years.`;
        }
      }
    }
  } else if (years.length > 0 || months.length > 0) {
    const y = Number(years || 0);
    const m = Number(months || 0);
    if (m > 11) {
      error = "Months should be between 0 and 11.";
    } else if (!inRange(y, m)) {
      error = `Nutrak supports children aged ${MIN_AGE_YEARS}–${MAX_AGE_YEARS} years.`;
    } else {
      age = { mode: "age", years: y, months: m };
    }
  }

  const next = () => {
    if (!age) return;
    updateChild({ age });
    goNext();
  };

  return (
    <OnboardingLayout
      step={STEP}
      icon="happy-outline"
      title={`Tell us ${child.name ? `${child.name}’s` : "your child’s"} age`}
      description="This helps us give the most accurate nutrition assessment and recommendations for your child."
      illustration={IMAGES.child}
      footer={<PrimaryButton label={editing ? "SAVE" : "NEXT"} onPress={next} disabled={!age} />}
    >
      <View style={styles.choices} accessibilityRole="radiogroup">
        <ModeCard
          selected={mode === "dob"}
          onSelect={() => setMode("dob")}
          icon="calendar-month-outline"
          title="Date of Birth"
          subtitle="Enter your child’s date of birth"
        >
          <TextField
            placeholder="DD / MM / YYYY"
            keyboardType="number-pad"
            maxLength={10}
            value={dob}
            onFocus={() => setMode("dob")}
            onChangeText={(t) => setDob(maskDob(t))}
            trailing={<Ionicons name="calendar-outline" size={20} color={COLORS.green} />}
          />
        </ModeCard>

        <View style={styles.orRow}>
          <View style={styles.orLine} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.orLine} />
        </View>

        <ModeCard
          selected={mode === "age"}
          onSelect={() => setMode("age")}
          icon="account-outline"
          title="Age (in numbers)"
          subtitle="Enter your child’s age in years and months"
        >
          <View style={styles.ageRow}>
            <View style={styles.flex}>
              <TextField
                placeholder="e.g. 3"
                keyboardType="number-pad"
                maxLength={2}
                value={years}
                onFocus={() => setMode("age")}
                onChangeText={(t) => setYears(t.replace(/\D/g, ""))}
                trailing={<Text style={styles.unit}>years</Text>}
              />
            </View>
            <View style={styles.flex}>
              <TextField
                placeholder="e.g. 6"
                keyboardType="number-pad"
                maxLength={2}
                value={months}
                onFocus={() => setMode("age")}
                onChangeText={(t) => setMonths(t.replace(/\D/g, ""))}
                trailing={<Text style={styles.unit}>months</Text>}
              />
            </View>
          </View>
        </ModeCard>
      </View>

      {error ? (
        <Text style={styles.error} accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : age ? (
        <Text style={styles.success}>✓ Age: {formatAge(age)}</Text>
      ) : null}
    </OnboardingLayout>
  );
}

function ModeCard({
  selected,
  onSelect,
  icon,
  title,
  subtitle,
  children,
}: {
  selected: boolean;
  onSelect: () => void;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <View style={[styles.modeCard, selected && styles.modeCardSelected]}>
      <Pressable
        accessibilityRole="radio"
        accessibilityState={{ selected }}
        accessibilityLabel={title}
        onPress={onSelect}
        style={styles.modeHeader}
      >
        <View style={[styles.radio, selected && styles.radioOn]}>
          {selected && <View style={styles.radioDot} />}
        </View>
        <MaterialCommunityIcons name={icon} size={30} color={COLORS.darkGreen} />
        <View style={styles.flex}>
          <Text style={styles.modeTitle}>{title}</Text>
          <Text style={styles.modeSubtitle}>{subtitle}</Text>
        </View>
      </Pressable>
      <View style={styles.modeBody}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  choices: {
    padding: 14,
    borderRadius: 24,
    backgroundColor: "#EEF7EA",
    gap: 12,
  },
  modeCard: {
    padding: 14,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    gap: 12,
  },
  modeCardSelected: {
    borderColor: COLORS.green,
  },
  modeHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.darkGreen,
    alignItems: "center",
    justifyContent: "center",
  },
  radioOn: {
    borderColor: COLORS.green,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.green,
  },
  modeTitle: {
    color: COLORS.darkGreen,
    fontSize: 16,
    fontWeight: "800",
  },
  modeSubtitle: {
    color: COLORS.mutedGreen,
    fontSize: 12,
    marginTop: 2,
  },
  modeBody: {
    paddingLeft: 36,
  },
  ageRow: {
    flexDirection: "row",
    gap: 10,
  },
  flex: {
    flex: 1,
  },
  unit: {
    color: COLORS.mutedGreen,
    fontSize: 12,
    fontWeight: "700",
  },
  orRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#CFDCCB",
  },
  orText: {
    color: COLORS.mutedGreen,
    fontSize: 13,
    fontWeight: "700",
  },
  error: {
    color: COLORS.error,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  success: {
    color: COLORS.green,
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
  },
});
