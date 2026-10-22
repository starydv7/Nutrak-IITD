import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, type Href } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "@/components/nutrak/buttons";
import { OnboardingLayout } from "@/components/nutrak/onboarding-layout";
import {
  ACTIVITY_LABEL,
  CONDITION_LABEL,
  DIET_LABEL,
  GOAL_LABEL,
  RELATIONSHIP_LABEL,
  SYMPTOM_LABEL,
} from "@/constants/labels";
import { COLORS, IMAGES } from "@/constants/nutrak";
import {
  buildNutritionPlan,
  formatAge,
  needsDoctorReview,
  nutrientFocus,
} from "@/lib/nutrition";
import { resumeRoute } from "@/lib/onboarding-flow";
import { useOnboarding } from "@/store/onboarding";

export default function SummaryScreen() {
  const { child, isOnboarded, completeOnboarding } = useOnboarding();
  const [finishing, setFinishing] = useState(false);
  const plan = buildNutritionPlan(child);
  const focus = nutrientFocus(child);
  const doctor = needsDoctorReview(child);
  const name = child.name || "Your child";

  useEffect(() => {
    if (finishing && isOnboarded) router.replace("/dashboard");
  }, [finishing, isOnboarded]);

  if (!plan) {
    const missing = resumeRoute(child, false);
    return (
      <OnboardingLayout
        title="A few details are missing"
        description="Please complete the remaining steps so we can build your child’s plan."
        footer={
          <PrimaryButton label="CONTINUE" onPress={() => router.replace(missing)} />
        }
      />
    );
  }

  const edit = (path: string) => router.push(`${path}?edit=1` as Href);

  const profileRows: { label: string; value: string; route: string }[] = [
    { label: "Name", value: child.name, route: "/onboarding/name" },
    { label: "You are", value: child.relationship ? RELATIONSHIP_LABEL[child.relationship] : "—", route: "/onboarding/relationship" },
    { label: "Age", value: formatAge(child.age), route: "/onboarding/age" },
    { label: "Gender", value: child.gender === "girl" ? "Girl" : "Boy", route: "/onboarding/gender" },
    { label: "Height", value: `${child.heightCm} cm`, route: "/onboarding/height" },
    { label: "Weight", value: `${child.weightKg} kg`, route: "/onboarding/weight" },
    { label: "Diet", value: child.diet ? DIET_LABEL[child.diet] : "—", route: "/onboarding/diet" },
    { label: "Activity", value: child.activity ? ACTIVITY_LABEL[child.activity] : "—", route: "/onboarding/activity" },
    {
      label: "Health",
      value:
        child.conditions.length === 0
          ? "Not provided"
          : child.conditions.map((c) => CONDITION_LABEL[c]).join(", "),
      route: "/onboarding/conditions",
    },
    { label: "Goal", value: child.goal ? GOAL_LABEL[child.goal] : "—", route: "/onboarding/goal" },
  ];

  return (
    <OnboardingLayout
      badge="All done!"
      icon="sparkles-outline"
      title={`${name}’s nutrition plan is ready`}
      description="Here’s a personalised daily target based on the details you shared."
      illustration={IMAGES.happyChild}
      footer={
        <PrimaryButton
          label="GO TO DASHBOARD"
          loading={finishing}
          onPress={() => {
            if (isOnboarded) {
              router.dismissTo("/dashboard");
              return;
            }
            setFinishing(true);
            completeOnboarding();
          }}
        />
      }
    >
      <View style={styles.targetCard}>
        <Text style={styles.sectionLabel}>DAILY ENERGY TARGET</Text>
        <View style={styles.kcalRow}>
          <Text style={styles.kcal}>{plan.calories}</Text>
          <Text style={styles.kcalUnit}>kcal / day</Text>
        </View>
        <View style={styles.macros}>
          <Macro label="Carbs" grams={plan.carbsG} color="#E8505B" bg="#FDECEC" />
          <Macro label="Protein" grams={plan.proteinG} color="#9B59D0" bg="#F1EAFB" />
          <Macro label="Fat" grams={plan.fatG} color="#EFA80F" bg="#FDF5E1" />
        </View>
        <View style={styles.waterRow}>
          <MaterialCommunityIcons name="cup-water" size={20} color={COLORS.blue} />
          <Text style={styles.waterText}>
            Water: about {(plan.waterMl / 1000).toFixed(1)} L a day
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Suggested meal split</Text>
        {(
          [
            ["breakfast", "Breakfast", IMAGES.breakfast],
            ["lunch", "Lunch", IMAGES.lunch],
            ["dinner", "Dinner", IMAGES.dinner],
            ["snack", "Snacks", IMAGES.snack],
          ] as const
        ).map(([key, label, image]) => {
          const [lo, hi] = plan.meals[key];
          return (
            <View key={key} style={styles.mealRow}>
              <Image source={image} style={styles.mealImage} resizeMode="contain" />
              <Text style={styles.mealLabel}>{label}</Text>
              <Text style={styles.mealValue}>
                {lo === hi ? lo : `${lo} – ${hi}`} kcal
              </Text>
            </View>
          );
        })}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nutrients to focus on</Text>
        {focus.length === 0 ? (
          <Text style={styles.body}>
            No symptoms were selected — great! We’ll focus on balanced meals
            for {GOAL_LABEL[child.goal ?? "healthy_growth"].toLowerCase()}.
          </Text>
        ) : (
          <>
            <Text style={styles.body}>
              Based on: {child.symptoms.map((s) => SYMPTOM_LABEL[s].toLowerCase()).join(", ")}.
            </Text>
            {focus.slice(0, 5).map((item) => (
              <View key={item.nutrient} style={styles.focusRow}>
                <View style={styles.focusDot} />
                <View style={styles.flex}>
                  <Text style={styles.focusTitle}>
                    {item.nutrient}
                    <Text style={styles.focusReason}>  · {item.reason}</Text>
                  </Text>
                  <Text style={styles.focusFoods}>{item.foods}</Text>
                </View>
              </View>
            ))}
          </>
        )}
      </View>

      {doctor && (
        <View style={styles.doctor}>
          <MaterialCommunityIcons name="stethoscope" size={24} color="#B54708" />
          <Text style={[styles.body, styles.flex, { color: "#7A3E0A" }]}>
            Some of the details you shared (such as weight loss, several
            symptoms or an ongoing condition) are worth discussing with your
            paediatrician alongside this plan.
          </Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Child profile</Text>
        {profileRows.map((row) => (
          <Pressable
            key={row.label}
            accessibilityRole="button"
            accessibilityLabel={`Edit ${row.label}: ${row.value}`}
            onPress={() => edit(row.route)}
            style={styles.profileRow}
          >
            <Text style={styles.profileLabel}>{row.label}</Text>
            <Text style={styles.profileValue} numberOfLines={2}>
              {row.value}
            </Text>
            <Ionicons name="create-outline" size={18} color={COLORS.green} />
          </Pressable>
        ))}
      </View>

      <Text style={styles.disclaimer}>
        Targets use the IOM Estimated Energy Requirement equations for
        children. They are guidance only and do not replace advice from your
        doctor or a registered dietitian.
      </Text>
    </OnboardingLayout>
  );
}

function Macro({
  label,
  grams,
  color,
  bg,
}: {
  label: string;
  grams: number;
  color: string;
  bg: string;
}) {
  return (
    <View style={[styles.macro, { backgroundColor: bg }]}>
      <Text style={[styles.macroValue, { color }]}>{grams}g</Text>
      <Text style={styles.macroLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  targetCard: {
    padding: 18,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
  },
  sectionLabel: {
    color: COLORS.mutedGreen,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
  },
  kcalRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  kcal: {
    color: COLORS.darkGreen,
    fontSize: 44,
    lineHeight: 48,
    fontWeight: "900",
  },
  kcalUnit: {
    color: COLORS.textGreen,
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 7,
  },
  macros: {
    flexDirection: "row",
    gap: 8,
  },
  macro: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: "center",
  },
  macroValue: {
    fontSize: 20,
    fontWeight: "900",
  },
  macroLabel: {
    color: "#55616D",
    fontSize: 12,
    fontWeight: "600",
  },
  waterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  waterText: {
    color: COLORS.textGreen,
    fontSize: 13,
    fontWeight: "600",
  },
  section: {
    padding: 16,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 10,
  },
  sectionTitle: {
    color: COLORS.darkGreen,
    fontSize: 17,
    fontWeight: "900",
  },
  mealRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  mealImage: {
    width: 40,
    height: 34,
  },
  mealLabel: {
    flex: 1,
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "700",
  },
  mealValue: {
    color: COLORS.textGreen,
    fontSize: 14,
    fontWeight: "700",
  },
  body: {
    color: COLORS.textGreen,
    fontSize: 13,
    lineHeight: 19,
  },
  focusRow: {
    flexDirection: "row",
    gap: 10,
  },
  focusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    backgroundColor: COLORS.brightGreen,
  },
  focusTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "800",
  },
  focusReason: {
    color: COLORS.mutedGreen,
    fontSize: 12,
    fontWeight: "500",
  },
  focusFoods: {
    color: COLORS.textGreen,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 2,
  },
  doctor: {
    flexDirection: "row",
    gap: 10,
    padding: 14,
    borderRadius: 16,
    backgroundColor: "#FFF1E0",
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#EEF2EC",
  },
  profileLabel: {
    width: 70,
    color: COLORS.mutedGreen,
    fontSize: 13,
    fontWeight: "600",
  },
  profileValue: {
    flex: 1,
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "700",
  },
  disclaimer: {
    color: COLORS.mutedGreen,
    fontSize: 11,
    lineHeight: 16,
    textAlign: "center",
  },
});
