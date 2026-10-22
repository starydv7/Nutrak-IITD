import { ONBOARDING_ROUTES } from "@/constants/nutrak";
import type { ChildProfile } from "@/store/onboarding";

const STEP_COMPLETE: ((child: ChildProfile) => boolean)[] = [
  (c) => c.name.trim().length > 0,
  (c) => c.relationship != null,
  (c) => c.heightCm != null,
  (c) => c.weightKg != null,
  (c) => c.age != null,
  (c) => c.gender != null,
  (c) => c.diet != null,
  (c) => c.activity != null,
  // Optional: parents may skip this step.
  () => true,
  (c) => c.goal != null,
];

/** Where a logged-in parent should land to continue onboarding. */
export function resumeRoute(child: ChildProfile, isOnboarded: boolean) {
  if (isOnboarded) return "/dashboard" as const;
  const index = STEP_COMPLETE.findIndex((done) => !done(child));
  return index === -1 ? ("/onboarding/symptoms" as const) : ONBOARDING_ROUTES[index];
}

export function isValidIndianMobile(digits: string) {
  return /^[6-9]\d{9}$/.test(digits);
}

export function formatPhone(digits: string) {
  return digits.length === 10
    ? `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`
    : `+91 ${digits}`;
}
