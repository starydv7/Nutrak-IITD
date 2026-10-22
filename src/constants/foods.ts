import type { Diet, MealType } from "@/store/onboarding";

type FoodTag = "vegan" | "veg" | "egg" | "nonveg";

export type FoodItem = {
  name: string;
  portion: string;
  kcal: number;
  carbs: number;
  protein: number;
  fat: number;
  tag: FoodTag;
  /** No onion, garlic or root vegetables. */
  jain?: boolean;
};

/** Approximate values for child-sized portions. */
export const FOODS: Record<MealType, FoodItem[]> = {
  breakfast: [
    { name: "Vegetable poha", portion: "1 bowl", kcal: 250, carbs: 40, protein: 6, fat: 7, tag: "vegan" },
    { name: "Idli with sambar", portion: "3 idlis", kcal: 280, carbs: 52, protein: 10, fat: 3, tag: "vegan" },
    { name: "Besan chilla", portion: "2 pieces", kcal: 240, carbs: 28, protein: 12, fat: 9, tag: "vegan", jain: true },
    { name: "Oats with milk & banana", portion: "1 bowl", kcal: 300, carbs: 48, protein: 11, fat: 7, tag: "veg", jain: true },
    { name: "Paneer paratha with curd", portion: "1 paratha", kcal: 330, carbs: 38, protein: 12, fat: 14, tag: "veg", jain: true },
    { name: "Boiled egg & toast", portion: "1 egg, 2 slices", kcal: 260, carbs: 26, protein: 14, fat: 11, tag: "egg" },
  ],
  lunch: [
    { name: "Dal, rice & sabzi", portion: "1 plate", kcal: 420, carbs: 68, protein: 15, fat: 9, tag: "vegan" },
    { name: "Rajma chawal", portion: "1 plate", kcal: 450, carbs: 72, protein: 16, fat: 10, tag: "vegan" },
    { name: "Curd rice", portion: "1 bowl", kcal: 330, carbs: 50, protein: 9, fat: 9, tag: "veg", jain: true },
    { name: "Roti with paneer sabzi", portion: "2 rotis", kcal: 430, carbs: 45, protein: 18, fat: 19, tag: "veg", jain: true },
    { name: "Egg bhurji with roti", portion: "2 rotis", kcal: 410, carbs: 42, protein: 19, fat: 18, tag: "egg" },
    { name: "Chicken curry with rice", portion: "1 plate", kcal: 480, carbs: 55, protein: 28, fat: 15, tag: "nonveg" },
  ],
  dinner: [
    { name: "Moong dal khichdi with ghee", portion: "1 bowl", kcal: 380, carbs: 58, protein: 13, fat: 10, tag: "veg", jain: true },
    { name: "Roti with dal & veggies", portion: "2 rotis", kcal: 400, carbs: 60, protein: 15, fat: 10, tag: "vegan" },
    { name: "Vegetable upma", portion: "1 bowl", kcal: 320, carbs: 48, protein: 8, fat: 10, tag: "vegan" },
    { name: "Tofu stir-fry with rice", portion: "1 plate", kcal: 390, carbs: 52, protein: 17, fat: 12, tag: "vegan", jain: true },
    { name: "Egg curry with roti", portion: "2 rotis", kcal: 430, carbs: 40, protein: 20, fat: 20, tag: "egg" },
    { name: "Fish curry with rice", portion: "1 plate", kcal: 460, carbs: 52, protein: 27, fat: 15, tag: "nonveg" },
  ],
  snack: [
    { name: "Banana", portion: "1 medium", kcal: 105, carbs: 27, protein: 1, fat: 0, tag: "vegan", jain: true },
    { name: "Apple with peanut butter", portion: "1 apple, 1 tbsp", kcal: 190, carbs: 20, protein: 5, fat: 9, tag: "vegan", jain: true },
    { name: "Roasted chana", portion: "1 handful", kcal: 130, carbs: 18, protein: 7, fat: 2, tag: "vegan", jain: true },
    { name: "Glass of milk", portion: "200 ml", kcal: 150, carbs: 12, protein: 8, fat: 8, tag: "veg", jain: true },
    { name: "Sprouts chaat", portion: "1 bowl", kcal: 140, carbs: 20, protein: 9, fat: 2, tag: "vegan" },
    { name: "Boiled egg", portion: "1 egg", kcal: 78, carbs: 1, protein: 6, fat: 5, tag: "egg" },
  ],
};

const ALLOWED_TAGS: Record<Diet, FoodTag[]> = {
  vegan: ["vegan"],
  vegetarian: ["vegan", "veg"],
  jain: ["vegan", "veg"],
  eggetarian: ["vegan", "veg", "egg"],
  non_vegetarian: ["vegan", "veg", "egg", "nonveg"],
};

export function foodsFor(meal: MealType, diet: Diet | null) {
  const allowed = ALLOWED_TAGS[diet ?? "non_vegetarian"];
  return FOODS[meal].filter(
    (food) => allowed.includes(food.tag) && (diet !== "jain" || food.jain),
  );
}
