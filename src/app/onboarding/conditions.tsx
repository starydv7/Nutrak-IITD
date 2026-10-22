import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { PrimaryButton, SecondaryButton } from "@/components/nutrak/buttons";
import { TextField } from "@/components/nutrak/form";
import { OnboardingLayout } from "@/components/nutrak/onboarding-layout";
import { OptionCard, TONES, type IconName, type Tone } from "@/components/nutrak/option-card";
import { COLORS, IMAGES } from "@/constants/nutrak";
import { useStepNavigation } from "@/lib/use-step-navigation";
import { useOnboarding, type Condition } from "@/store/onboarding";

const STEP = 9;

const OPTIONS: { value: Exclude<Condition, "none">; title: string; subtitle: string; icon: IconName; tone: Tone }[] = [
  { value: "food_allergy", title: "Food Allergy", subtitle: "e.g. milk, egg, nuts, seafood, wheat etc.", icon: "peanut-off-outline", tone: TONES.red },
  { value: "asthma", title: "Asthma / Breathing Problem", subtitle: "e.g. wheezing, chronic cough, breathing difficulty", icon: "lungs", tone: TONES.blue },
  { value: "digestive", title: "Digestive Disorder", subtitle: "e.g. lactose intolerance, IBS, stomach pain, constipation", icon: "stomach", tone: TONES.yellow },
  { value: "chronic", title: "Chronic Condition", subtitle: "e.g. diabetes, heart disease, thyroid, kidney", icon: "shield-plus-outline", tone: TONES.purple },
  { value: "skin", title: "Skin Condition", subtitle: "e.g. eczema, frequent rashes, skin infection", icon: "hand-back-left-outline", tone: TONES.teal },
  { value: "medication", title: "Regular Medication", subtitle: "e.g. long-term medicines or supplements", icon: "pill", tone: TONES.pink },
];

export default function ConditionsStep() {
  const { child, updateChild } = useOnboarding();
  const { goNext, editing } = useStepNavigation(STEP);
  const [selected, setSelected] = useState<Condition[]>(child.conditions);
  const [notes, setNotes] = useState(child.conditionNotes);

  const toggle = (value: Condition) => {
    setSelected((current) => {
      if (value === "none") return current.includes("none") ? [] : ["none"];
      const withoutNone = current.filter((c) => c !== "none");
      return withoutNone.includes(value)
        ? withoutNone.filter((c) => c !== value)
        : [...withoutNone, value];
    });
  };

  const hasConditions = selected.length > 0 && !selected.includes("none");

  const next = () => {
    if (selected.length === 0) return;
    updateChild({
      conditions: selected,
      conditionNotes: hasConditions ? notes.trim() : "",
    });
    goNext();
  };

  const skip = () => {
    updateChild({ conditions: [], conditionNotes: "" });
    goNext();
  };

  const pairs = [];
  for (let i = 0; i < OPTIONS.length; i += 2) pairs.push(OPTIONS.slice(i, i + 2));

  return (
    <OnboardingLayout
      step={STEP}
      icon="medkit-outline"
      title="Any pre-existing complication or allergy?"
      description="Let us know if your child has any existing medical condition or allergy. This helps us provide a safer and more personalized nutrition plan."
      illustration={child.gender === "boy" ? IMAGES.boy : IMAGES.girl}
      footer={
        <>
          <PrimaryButton label={editing ? "SAVE" : "NEXT"} onPress={next} disabled={selected.length === 0} />
          <SecondaryButton label="SKIP FOR NOW" onPress={skip} />
        </>
      }
    >
      <View style={styles.grid}>
        {pairs.map((pair) => (
          <View key={pair[0].value} style={styles.gridRow}>
            {pair.map((option) => (
              <OptionCard
                key={option.value}
                layout="tile"
                multiple
                {...option}
                selected={selected.includes(option.value)}
                onPress={() => toggle(option.value)}
              />
            ))}
          </View>
        ))}

        <OptionCard
          title="None of the above"
          subtitle="My child does not have any known complications or allergies."
          icon="cancel"
          tone={TONES.slate}
          multiple
          selected={selected.includes("none")}
          onPress={() => toggle("none")}
        />
      </View>

      {hasConditions && (
        <TextField
          label="Tell us more (optional)"
          icon="create-outline"
          placeholder={
            selected.includes("food_allergy")
              ? "e.g. allergic to peanuts and shellfish"
              : "Any details your nutritionist should know"
          }
          value={notes}
          onChangeText={setNotes}
          maxLength={200}
          multiline
        />
      )}

      <View style={styles.tip}>
        <MaterialCommunityIcons name="lightbulb-on-outline" size={22} color={COLORS.green} />
        <View style={styles.flex}>
          <Text style={styles.tipTitle}>You can always update this later.</Text>
          <Text style={styles.tipText}>
            This helps us keep your child safe and choose the right nutrition plan.
          </Text>
        </View>
      </View>

      {selected.includes("food_allergy") && (
        <View style={[styles.tip, styles.warn]}>
          <Ionicons name="warning-outline" size={20} color="#B76E00" />
          <Text style={[styles.tipText, styles.flex]}>
            We’ll avoid suggesting foods you list here, but always check labels
            and follow your doctor’s allergy advice.
          </Text>
        </View>
      )}
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: 10,
  },
  gridRow: {
    flexDirection: "row",
    gap: 10,
  },
  tip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: 14,
    backgroundColor: "#EEF7EA",
  },
  warn: {
    backgroundColor: "#FFF4E0",
  },
  flex: {
    flex: 1,
  },
  tipTitle: {
    color: COLORS.darkGreen,
    fontSize: 13,
    fontWeight: "800",
  },
  tipText: {
    color: COLORS.textGreen,
    fontSize: 12,
    lineHeight: 16,
  },
});
