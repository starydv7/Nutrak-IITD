export const COLORS = {
  background: "#FAF9F1",
  darkGreen: "#075333",
  green: "#15964B",
  brightGreen: "#29A956",
  lightGreen: "#E7F6DF",
  paleGreen: "#F0F8E9",
  textGreen: "#315E43",
  mutedGreen: "#64806A",
  border: "#DCE8D6",
  white: "#FFFFFF",
  blue: "#1685EB",
  blueLight: "#DDF1FF",
  pink: "#F52D7A",
  pinkLight: "#FCE5EF",
  error: "#D93A3A",
  text: "#14231A",
} as const;

export const GRADIENTS = {
  primary: ["#20A957", "#15964B", "#118A43"] as const,
  primaryDisabled: ["#A8D5B4", "#99CBA7"] as const,
  card: ["#E7F6DF", "#F0F8E9", "#E6F4DF"] as const,
};

export const IMAGES = {
  child: require("../../assets/images/nutrak-child.png"),
  happyChild: require("../../assets/images/happy-child.png"),
  family: require("../../assets/images/onboarding-family.png"),
  healthyFood: require("../../assets/images/healthy-food.png"),
  boy: require("../../assets/images/boy-avatar.png"),
  girl: require("../../assets/images/girl-avatar.png"),
  mealPlan: require("../../assets/images/meal-plan-banner.png"),
  breakfast: require("../../assets/images/breakfast.png"),
  lunch: require("../../assets/images/lunch.png"),
  dinner: require("../../assets/images/dinner.png"),
  snack: require("../../assets/images/healthy-snack.png"),
} as const;

/** Hardcoded OTP until a real SMS provider is integrated. */
export const DEMO_OTP = "123456";
export const OTP_LENGTH = DEMO_OTP.length;
export const OTP_RESEND_SECONDS = 30;

export const TOTAL_STEPS = 10;

/** Ordered onboarding steps; index + 1 is the step number shown in the progress bar. */
export const ONBOARDING_ROUTES = [
  "/onboarding/name",
  "/onboarding/relationship",
  "/onboarding/height",
  "/onboarding/weight",
  "/onboarding/age",
  "/onboarding/gender",
  "/onboarding/diet",
  "/onboarding/activity",
  "/onboarding/conditions",
  "/onboarding/goal",
] as const;

export type OnboardingRoute = (typeof ONBOARDING_ROUTES)[number];

export function nextRouteAfter(step: number) {
  return step < TOTAL_STEPS
    ? ONBOARDING_ROUTES[step]
    : ("/onboarding/symptoms" as const);
}
