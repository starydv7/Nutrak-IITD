import { router, useLocalSearchParams } from "expo-router";

import { nextRouteAfter } from "@/constants/nutrak";

/**
 * Advances to the next onboarding step, or returns to the summary when the
 * step was opened from there with `?edit=1`.
 */
export function useStepNavigation(step: number) {
  const { edit } = useLocalSearchParams<{ edit?: string }>();
  const editing = edit === "1";

  const goNext = () => {
    if (editing) router.back();
    else router.push(nextRouteAfter(step));
  };

  return { goNext, editing };
}
