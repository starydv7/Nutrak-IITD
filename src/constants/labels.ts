import type {
  Activity,
  Condition,
  Diet,
  Goal,
  Relationship,
  SymptomId,
} from "@/store/onboarding";

export const RELATIONSHIP_LABEL: Record<Relationship, string> = {
  mother: "Mother",
  father: "Father",
  guardian: "Legal guardian",
  other: "Caregiver",
};

export const DIET_LABEL: Record<Diet, string> = {
  vegetarian: "Vegetarian",
  eggetarian: "Eggetarian",
  non_vegetarian: "Non-vegetarian",
  vegan: "Vegan",
  jain: "Jain",
};

export const ACTIVITY_LABEL: Record<Activity, string> = {
  sedentary: "Mostly inactive",
  low: "Lightly active",
  active: "Active",
  very_active: "Very active",
};

export const CONDITION_LABEL: Record<Condition, string> = {
  food_allergy: "Food allergy",
  asthma: "Asthma / breathing problem",
  digestive: "Digestive disorder",
  chronic: "Chronic condition",
  skin: "Skin condition",
  medication: "Regular medication",
  none: "No known conditions",
};

export const GOAL_LABEL: Record<Goal, string> = {
  healthy_growth: "Healthy growth",
  weight_gain: "Healthy weight gain",
  weight_management: "Healthy weight management",
  immunity: "Better immunity",
  focus: "Focus & learning",
  picky_eating: "Overcome picky eating",
};

export const SYMPTOM_LABEL: Record<SymptomId, string> = {
  tiredness: "Constant tiredness and low energy",
  infections: "Frequent infections",
  appetite: "Loss of appetite",
  slow_growth: "Slow growth",
  pale_skin: "Pale skin, hair or nails",
  stomach: "Stomach issues",
  hair_fall: "Hair fall",
  bone_pain: "Bone and joint pain",
  focus: "Trouble in focus and learning",
  weight_loss: "Unexplained weight loss",
};
