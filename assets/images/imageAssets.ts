// assets/imageAssets.ts
// React Native requires static local paths for bundled images.
// Copy this file into your project's assets/ folder.
export const images = {
  child: require("./images/nutrak-child.png"),
  onboardingFamily: require("./images/onboarding-family.png"),
  healthyFood: require("./images/healthy-food.png"),
  happyChild: require("./images/happy-child.png"),
  boyAvatar: require("./images/boy-avatar.png"),
  girlAvatar: require("./images/girl-avatar.png"),
  mealPlanBanner: require("./images/meal-plan-banner.png"),
  breakfast: require("./images/breakfast.png"),
  lunch: require("./images/lunch.png"),
  dinner: require("./images/dinner.png"),
  healthySnack: require("./images/healthy-snack.png"),
  emptyRecipes: require("./images/empty-recipes.png"),
} as const;
