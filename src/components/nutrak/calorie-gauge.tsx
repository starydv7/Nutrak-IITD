import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Defs, G, LinearGradient, Stop } from "react-native-svg";

import { COLORS } from "@/constants/nutrak";

const SWEEP = 0.75;

type Props = {
  size?: number;
  remaining: number;
  goal: number;
};

/** 270° ring showing the share of today's calorie goal still remaining. */
export function CalorieGauge({ size = 180, remaining, goal }: Props) {
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = size / 2;
  const circumference = 2 * Math.PI * r;
  const track = circumference * SWEEP;
  const fraction = goal > 0 ? Math.min(1, Math.max(0, remaining / goal)) : 0;
  const over = remaining < 0;

  return (
    <View
      style={{ width: size, height: size }}
      accessible
      accessibilityLabel={`${Math.abs(remaining)} kilocalories ${over ? "over goal" : "remaining"} of ${goal}`}
    >
      <Svg width={size} height={size} style={styles.rotated}>
        <Defs>
          <LinearGradient id="gauge" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#2E9A47" />
            <Stop offset="1" stopColor="#7CCB5B" />
          </LinearGradient>
        </Defs>
        <G>
          <Circle
            cx={c}
            cy={c}
            r={r}
            stroke="#E3EFDC"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${track} ${circumference}`}
            fill="none"
          />
          {fraction > 0 && (
            <Circle
              cx={c}
              cy={c}
              r={r}
              stroke="url(#gauge)"
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={`${track * fraction} ${circumference}`}
              fill="none"
            />
          )}
        </G>
      </Svg>

      <View style={[StyleSheet.absoluteFill, styles.center]}>
        <MaterialCommunityIcons name="leaf" size={18} color={COLORS.brightGreen} />
        <Text style={styles.label}>{over ? "Over by" : "Remaining"}</Text>
        <Text style={[styles.value, over && styles.over]} adjustsFontSizeToFit numberOfLines={1}>
          {Math.abs(remaining)}
        </Text>
        <Text style={styles.unit}>kcal</Text>
      </View>
      <Text style={styles.goal}>Goal {goal} kcal</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  rotated: {
    transform: [{ rotate: "135deg" }],
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  label: {
    color: COLORS.textGreen,
    fontSize: 13,
    fontWeight: "600",
  },
  value: {
    color: COLORS.darkGreen,
    fontSize: 40,
    lineHeight: 46,
    fontWeight: "900",
  },
  over: {
    color: COLORS.error,
  },
  unit: {
    color: COLORS.textGreen,
    fontSize: 13,
    fontWeight: "600",
  },
  goal: {
    position: "absolute",
    bottom: 4,
    alignSelf: "center",
    color: COLORS.textGreen,
    fontSize: 12,
    fontWeight: "600",
  },
});
