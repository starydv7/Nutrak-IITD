import { Fragment } from "react";
import { StyleSheet, Text, View } from "react-native";

import { COLORS } from "@/constants/nutrak";

type Props = {
  current: number;
  total: number;
  /**
   * "progress" fills every step up to `current` (onboarding steps);
   * "single" only highlights `current` (symptom questions).
   */
  variant?: "progress" | "single";
};

export function StepProgress({ current, total, variant = "progress" }: Props) {
  return (
    <View
      style={styles.row}
      accessibilityRole="progressbar"
      accessibilityLabel={`Step ${current} of ${total}`}
      accessibilityValue={{ min: 1, max: total, now: current }}
    >
      {Array.from({ length: total }, (_, i) => {
        const step = i + 1;
        const active =
          variant === "progress" ? step <= current : step === current;
        const lineActive = variant === "progress" && step < current;

        return (
          <Fragment key={step}>
            {i > 0 && (
              <View
                style={[
                  styles.line,
                  variant === "single" && styles.lineHidden,
                  lineActive && styles.lineActive,
                ]}
              />
            )}
            <View
              style={[
                styles.circle,
                active && styles.circleActive,
                step === current && styles.circleCurrent,
              ]}
            >
              <Text
                style={[styles.number, active && styles.numberActive]}
                maxFontSizeMultiplier={1.2}
              >
                {step}
              </Text>
            </View>
          </Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  circle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#E7EBE4",
    alignItems: "center",
    justifyContent: "center",
  },
  circleActive: {
    backgroundColor: COLORS.brightGreen,
  },
  circleCurrent: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#BFE5C8",
  },
  number: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6F7A72",
  },
  numberActive: {
    color: COLORS.white,
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: "#E1E6DE",
  },
  lineHidden: {
    backgroundColor: "transparent",
  },
  lineActive: {
    backgroundColor: COLORS.brightGreen,
  },
});
