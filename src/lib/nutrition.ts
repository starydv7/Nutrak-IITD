import type {
  Activity,
  AgeInput,
  ChildProfile,
  Gender,
  Goal,
  MealType,
  SymptomId,
} from "@/store/onboarding";

export const MIN_AGE_YEARS = 1;
export const MAX_AGE_YEARS = 18;

/** Parses a strict DD/MM/YYYY string into a local date, or null if invalid. */
export function parseDob(text: string): Date | null {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(text.trim());
  if (!match) return null;
  const [, dd, mm, yyyy] = match;
  const day = Number(dd);
  const month = Number(mm);
  const year = Number(yyyy);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
}

export function toIsoDate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function isoToDisplay(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

/** Whole years and remaining months between `dob` and `today`. */
export function diffYearsMonths(dob: Date, today = new Date()) {
  let months =
    (today.getFullYear() - dob.getFullYear()) * 12 +
    (today.getMonth() - dob.getMonth());
  if (today.getDate() < dob.getDate()) months -= 1;
  return { years: Math.floor(months / 12), months: months % 12 };
}

export function ageInYears(age: AgeInput | null): number | null {
  if (!age) return null;
  if (age.mode === "age") return age.years + age.months / 12;
  const [y, m, d] = age.dob.split("-").map(Number);
  const { years, months } = diffYearsMonths(new Date(y, m - 1, d));
  return years + months / 12;
}

export function formatAge(age: AgeInput | null) {
  if (!age) return "—";
  let years: number;
  let months: number;
  if (age.mode === "age") {
    ({ years, months } = age);
  } else {
    const [y, m, d] = age.dob.split("-").map(Number);
    ({ years, months } = diffYearsMonths(new Date(y, m - 1, d)));
  }
  const parts = [];
  if (years) parts.push(`${years} ${years === 1 ? "year" : "years"}`);
  if (months) parts.push(`${months} ${months === 1 ? "month" : "months"}`);
  return parts.join(" ") || "0 months";
}

/** Physical-activity coefficients from the IOM (2005) EER equations. */
const PA_COEFFICIENT: Record<Gender, Record<Activity, number>> = {
  boy: { sedentary: 1.0, low: 1.13, active: 1.26, very_active: 1.42 },
  girl: { sedentary: 1.0, low: 1.16, active: 1.31, very_active: 1.56 },
};

/**
 * Estimated Energy Requirement (kcal/day) using the IOM (2005) equations
 * for children aged 1–18, including the energy cost of growth.
 */
export function estimatedEnergyRequirement(params: {
  ageYears: number;
  gender: Gender;
  weightKg: number;
  heightCm: number;
  activity: Activity;
}) {
  const { ageYears, gender, weightKg, heightCm, activity } = params;
  const heightM = heightCm / 100;
  const pa = PA_COEFFICIENT[gender][activity];

  if (ageYears < 3) {
    return 89 * weightKg - 100 + 20;
  }

  const growth = ageYears < 9 ? 20 : 25;
  const age = Math.floor(ageYears);

  if (gender === "boy") {
    return (
      88.5 - 61.9 * age + pa * (26.7 * weightKg + 903 * heightM) + growth
    );
  }
  return 135.3 - 30.8 * age + pa * (10 * weightKg + 934 * heightM) + growth;
}

const GOAL_ADJUSTMENT: Record<Goal, number> = {
  healthy_growth: 1,
  weight_gain: 1.1,
  // Children should not be put on an energy deficit without medical supervision.
  weight_management: 1,
  immunity: 1,
  focus: 1,
  picky_eating: 1,
};

export const MACRO_SPLIT = { carbs: 0.5, protein: 0.2, fat: 0.3 } as const;

export const MEAL_SHARE: Record<MealType, [number, number]> = {
  breakfast: [0.25, 0.3],
  lunch: [0.3, 0.35],
  dinner: [0.25, 0.3],
  snack: [0.1, 0.1],
};

export type NutritionPlan = {
  calories: number;
  carbsG: number;
  proteinG: number;
  fatG: number;
  waterMl: number;
  meals: Record<MealType, [number, number]>;
};

export function buildNutritionPlan(child: ChildProfile): NutritionPlan | null {
  const ageYears = ageInYears(child.age);
  if (
    ageYears == null ||
    !child.gender ||
    !child.weightKg ||
    !child.heightCm ||
    !child.activity
  ) {
    return null;
  }

  const eer = estimatedEnergyRequirement({
    ageYears,
    gender: child.gender,
    weightKg: child.weightKg,
    heightCm: child.heightCm,
    activity: child.activity,
  });
  const calories =
    Math.round((eer * GOAL_ADJUSTMENT[child.goal ?? "healthy_growth"]) / 10) *
    10;

  const meals = Object.fromEntries(
    (Object.keys(MEAL_SHARE) as MealType[]).map((meal) => {
      const [lo, hi] = MEAL_SHARE[meal];
      return [meal, [Math.round(calories * lo), Math.round(calories * hi)]];
    }),
  ) as Record<MealType, [number, number]>;

  // Roughly 1 L/day for toddlers rising to ~2.5 L for teens.
  const waterMl = Math.round(Math.min(2500, 1000 + ageYears * 90) / 50) * 50;

  return {
    calories,
    carbsG: Math.round((calories * MACRO_SPLIT.carbs) / 4),
    proteinG: Math.round((calories * MACRO_SPLIT.protein) / 4),
    fatG: Math.round((calories * MACRO_SPLIT.fat) / 9),
    waterMl,
    meals,
  };
}

export type NutrientFocus = {
  nutrient: string;
  reason: string;
  foods: string;
};

const SYMPTOM_NUTRIENTS: Record<SymptomId, string[]> = {
  tiredness: ["Iron", "Vitamin B12"],
  infections: ["Vitamin C", "Zinc", "Vitamin D"],
  appetite: ["Zinc"],
  slow_growth: ["Protein", "Zinc", "Calcium"],
  pale_skin: ["Iron", "Vitamin B12"],
  stomach: ["Fibre"],
  hair_fall: ["Iron", "Protein", "Zinc"],
  bone_pain: ["Calcium", "Vitamin D"],
  focus: ["Iron", "Omega-3", "Iodine"],
  weight_loss: ["Protein", "Healthy fats"],
};

type FoodSources = { plant: string; dairy?: string; egg?: string; meat?: string };

const NUTRIENT_FOODS: Record<string, FoodSources> = {
  Iron: { plant: "spinach, rajma, chana, jaggery, dates, ragi", egg: "eggs", meat: "chicken liver, fish" },
  "Vitamin B12": { plant: "fortified cereals or fortified plant milk", dairy: "milk, curd, paneer", egg: "eggs", meat: "fish, chicken" },
  "Vitamin C": { plant: "amla, oranges, guava, lemon, tomatoes" },
  Zinc: { plant: "pumpkin seeds, cashews, whole grains, dals", egg: "eggs", meat: "chicken" },
  "Vitamin D": { plant: "morning sunlight, mushrooms", dairy: "fortified milk", egg: "egg yolk", meat: "fatty fish" },
  Protein: { plant: "dal, soy, tofu, sprouts", dairy: "paneer, curd", egg: "eggs", meat: "chicken, fish" },
  Calcium: { plant: "ragi, sesame seeds, tofu", dairy: "milk, curd, paneer" },
  Fibre: { plant: "fruits, vegetables, oats, whole wheat roti, plenty of water" },
  "Omega-3": { plant: "walnuts, flaxseeds, chia seeds", meat: "fish such as salmon or mackerel" },
  Iodine: { plant: "iodised salt", dairy: "milk, curd" },
  "Healthy fats": { plant: "nuts, nut butters, avocado", dairy: "ghee, full-fat milk", egg: "eggs" },
};

function foodsForDiet(sources: FoodSources, diet: ChildProfile["diet"]) {
  const parts = [sources.plant];
  if (diet !== "vegan" && sources.dairy) parts.push(sources.dairy);
  if ((diet === "eggetarian" || diet === "non_vegetarian") && sources.egg) parts.push(sources.egg);
  if (diet === "non_vegetarian" && sources.meat) parts.push(sources.meat);
  const text = parts.join(", ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function nutrientFocus(child: ChildProfile): NutrientFocus[] {
  const counts = new Map<string, SymptomId[]>();
  for (const symptom of child.symptoms) {
    for (const nutrient of SYMPTOM_NUTRIENTS[symptom]) {
      counts.set(nutrient, [...(counts.get(nutrient) ?? []), symptom]);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1].length - a[1].length)
    .map(([nutrient, symptoms]) => ({
      nutrient,
      reason: `Linked to ${symptoms.length} selected ${symptoms.length === 1 ? "symptom" : "symptoms"}`,
      foods: foodsForDiet(NUTRIENT_FOODS[nutrient], child.diet),
    }));
}

/** Symptoms that warrant seeing a paediatrician rather than diet changes alone. */
export function needsDoctorReview(child: ChildProfile) {
  return (
    child.symptoms.includes("weight_loss") ||
    child.symptoms.length >= 4 ||
    child.conditions.some((c) => c === "chronic" || c === "medication")
  );
}

export function dateKey(date: Date) {
  return toIsoDate(date);
}
