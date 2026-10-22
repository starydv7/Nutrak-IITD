import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "@/components/nutrak/buttons";
import { Panel, TextField } from "@/components/nutrak/form";
import { OnboardingLayout } from "@/components/nutrak/onboarding-layout";
import { COLORS, IMAGES } from "@/constants/nutrak";
import { useStepNavigation } from "@/lib/use-step-navigation";
import { useOnboarding } from "@/store/onboarding";

const STEP = 1;

export default function NameStep() {
  const { child, updateChild } = useOnboarding();
  const { goNext, editing } = useStepNavigation(STEP);
  const [name, setName] = useState(child.name);
  const trimmed = name.trim();
  const valid = trimmed.length >= 2 && /^[A-Za-z\u00C0-\u024F\u0900-\u097F .'-]+$/.test(trimmed);
  const showError = name.length > 0 && !valid;

  const next = () => {
    if (!valid) return;
    updateChild({ name: trimmed });
    goNext();
  };

  return (
    <OnboardingLayout
      step={STEP}
      icon="happy-outline"
      title="What’s your child’s name?"
      description="We’ll use this to personalise your child’s nutrition journey."
      illustration={IMAGES.happyChild}
      onBack={editing ? undefined : () => router.replace("/")}
      footer={<PrimaryButton label={editing ? "SAVE" : "NEXT"} onPress={next} disabled={!valid} />}
    >
      <Panel>
        <TextField
          label="Child’s name"
          icon="person-outline"
          placeholder="e.g. Aarav"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          autoComplete="name"
          textContentType="givenName"
          maxLength={40}
          returnKeyType="next"
          onSubmitEditing={next}
          error={showError ? "Please enter a valid name (letters only)." : null}
          hint="A first name or nickname is fine."
        />
      </Panel>
      <View style={styles.note}>
        <Text style={styles.noteText}>
          🔒 Your child’s details are kept private and used only for their
          nutrition plan.
        </Text>
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  note: {
    padding: 12,
    borderRadius: 14,
    backgroundColor: "#EEF7EA",
  },
  noteText: {
    color: COLORS.textGreen,
    fontSize: 12,
    lineHeight: 17,
  },
});
