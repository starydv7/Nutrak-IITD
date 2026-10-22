import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import { PrimaryButton, SecondaryButton } from "@/components/nutrak/buttons";
import { OnboardingLayout, goBackOr } from "@/components/nutrak/onboarding-layout";
import { OptionCard, TONES, type IconName, type Tone } from "@/components/nutrak/option-card";
import { COLORS, IMAGES } from "@/constants/nutrak";
import { useOnboarding, type SymptomId } from "@/store/onboarding";

const PAGE_SIZE = 5;

const SYMPTOMS: { id: SymptomId; title: string; description: string; icon: IconName; tone: Tone }[] = [
  { id: "tiredness", title: "Constant Tiredness and Low Energy", description: "Your child feels tired easily, loses interest in play, and has low energy throughout the day.", icon: "battery-low", tone: TONES.red },
  { id: "infections", title: "Frequent Infections", description: "Repeated cold, cough, fever or other infections (especially in the last few months).", icon: "virus-outline", tone: TONES.yellow },
  { id: "appetite", title: "Loss of Appetite", description: "Your child eats less than usual or shows disinterest in food.", icon: "food-off-outline", tone: TONES.blue },
  { id: "slow_growth", title: "Slow Growth", description: "Your child’s weight or height is not increasing as expected for their age.", icon: "human-male-height-variant", tone: TONES.purple },
  { id: "pale_skin", title: "Pale Skin, Hair or Nails", description: "Skin looks pale, hair becomes dry or weak, or nails are brittle.", icon: "hand-back-right-outline", tone: TONES.teal },
  { id: "stomach", title: "Stomach Issues", description: "Frequent stomach pain, constipation or diarrhoea.", icon: "stomach", tone: TONES.red },
  { id: "hair_fall", title: "Hair Fall", description: "Noticeable hair fall or thinning of hair.", icon: "hair-dryer-outline", tone: TONES.green },
  { id: "bone_pain", title: "Bone and Joint Pain", description: "Complaints of leg pain, back pain or weak bones (especially in growing children).", icon: "bone", tone: TONES.blue },
  { id: "focus", title: "Trouble in Focus and Learning", description: "Difficulty in concentration, poor memory or low academic performance.", icon: "brain", tone: TONES.purple },
  { id: "weight_loss", title: "Unexplained Weight Loss", description: "Sudden loss of weight or not gaining weight despite normal eating.", icon: "scale-bathroom", tone: TONES.orange },
];

const PAGES = Math.ceil(SYMPTOMS.length / PAGE_SIZE);

export default function SymptomsScreen() {
  const { child, updateChild } = useOnboarding();
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<SymptomId[]>(child.symptoms);

  const toggle = (id: SymptomId) =>
    setSelected((current) =>
      current.includes(id) ? current.filter((s) => s !== id) : [...current, id],
    );

  const first = page * PAGE_SIZE;
  const visible = SYMPTOMS.slice(first, first + PAGE_SIZE);
  const lastPage = page === PAGES - 1;

  const submit = () => {
    updateChild({ symptoms: selected });
    router.push("/onboarding/summary");
  };

  const back = () => (page > 0 ? setPage(page - 1) : goBackOr("/onboarding/goal"));

  return (
    <OnboardingLayout
      key={page}
      progress={{ current: first + 1, total: SYMPTOMS.length, variant: "single" }}
      badge={`Question ${first + 1} of ${SYMPTOMS.length}`}
      title={`${SYMPTOMS.length} Important Symptoms to Check`}
      description={`Select the symptoms you have noticed in ${child.name || "your child"}. This helps us understand if there is any nutrition deficiency.`}
      card={false}
      onBack={back}
      footer={
        lastPage ? (
          <View style={styles.footerRow}>
            <SecondaryButton
              label="BACK"
              icon="arrow-back"
              onPress={back}
              style={styles.flex}
            />
            <PrimaryButton
              label="SUBMIT"
              showArrow={false}
              onPress={submit}
              style={styles.flex}
            />
          </View>
        ) : (
          <PrimaryButton label="NEXT" onPress={() => setPage(page + 1)} />
        )
      }
    >
      <View style={styles.list}>
        {visible.map((symptom, i) => {
          const number = first + i + 1;
          const avatar =
            child.gender === "girl"
              ? IMAGES.girl
              : child.gender === "boy"
                ? IMAGES.boy
                : number % 2 === 0
                  ? IMAGES.girl
                  : IMAGES.boy;
          return (
            <OptionCard
              key={symptom.id}
              multiple
              title={`${number}. ${symptom.title}`}
              subtitle={symptom.description}
              tone={symptom.tone}
              selected={selected.includes(symptom.id)}
              onPress={() => toggle(symptom.id)}
              leading={
                <View style={styles.visual}>
                  <View style={[styles.avatarFrame, { backgroundColor: COLORS.white }]}>
                    <Image source={avatar} style={styles.avatar} resizeMode="cover" />
                  </View>
                  <View style={[styles.iconBadge, { backgroundColor: symptom.tone.accent }]}>
                    <MaterialCommunityIcons name={symptom.icon} size={18} color={COLORS.white} />
                  </View>
                </View>
              }
            />
          );
        })}
      </View>

      {lastPage && (
        <Text style={styles.hint}>
          {selected.length === 0
            ? "Haven’t noticed any of these? Just tap Submit."
            : `${selected.length} ${selected.length === 1 ? "symptom" : "symptoms"} selected`}
        </Text>
      )}
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 10,
  },
  visual: {
    width: 78,
    height: 72,
  },
  avatarFrame: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: "hidden",
    alignItems: "center",
  },
  avatar: {
    width: 64,
    height: 104,
  },
  iconBadge: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  footerRow: {
    flexDirection: "row",
    gap: 12,
  },
  flex: {
    flex: 1,
    width: undefined,
  },
  hint: {
    color: COLORS.mutedGreen,
    fontSize: 12,
    textAlign: "center",
  },
});
