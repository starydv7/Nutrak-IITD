import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";

import { COLORS } from "@/constants/nutrak";

export type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

export type Tone = { bg: string; accent: string };

export const TONES = {
  red: { bg: "#FDECEC", accent: "#E8505B" },
  blue: { bg: "#E8F2FD", accent: "#2F8FE0" },
  yellow: { bg: "#FDF5E1", accent: "#EFA80F" },
  purple: { bg: "#F1EAFB", accent: "#9B59D0" },
  teal: { bg: "#E3F6F1", accent: "#1BA38A" },
  pink: { bg: "#FBEAF5", accent: "#C94FA8" },
  slate: { bg: "#EAF0F5", accent: "#5B7A90" },
  green: { bg: "#E9F6E4", accent: "#29A956" },
  orange: { bg: "#FDEFE3", accent: "#F07E2E" },
} satisfies Record<string, Tone>;

type Props = {
  title: string;
  subtitle?: string;
  icon?: IconName;
  /** Custom leading visual; overrides `icon`. */
  leading?: ReactNode;
  tone?: Tone;
  selected: boolean;
  onPress: () => void;
  multiple?: boolean;
  layout?: "row" | "tile";
  style?: StyleProp<ViewStyle>;
};

export function OptionCard({
  title,
  subtitle,
  icon,
  leading,
  tone = TONES.green,
  selected,
  onPress,
  multiple,
  layout = "row",
  style,
}: Props) {
  const tile = layout === "tile";

  return (
    <Pressable
      accessibilityRole={multiple ? "checkbox" : "radio"}
      accessibilityState={multiple ? { checked: selected } : { selected }}
      accessibilityLabel={subtitle ? `${title}. ${subtitle}` : title}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        tile && styles.tile,
        { backgroundColor: tone.bg, borderColor: selected ? tone.accent : "transparent" },
        pressed && styles.pressed,
        style,
      ]}
    >
      {leading ??
        (icon && (
          <View
            style={[
              styles.iconCircle,
              tile && styles.iconCircleTile,
              { backgroundColor: tone.accent },
            ]}
          >
            <MaterialCommunityIcons
              name={icon}
              size={tile ? 22 : 24}
              color={COLORS.white}
            />
          </View>
        ))}

      <View style={tile ? styles.tileText : styles.text}>
        <Text style={[styles.title, tile && styles.titleTile]}>{title}</Text>
        {subtitle ? (
          <Text style={[styles.subtitle, tile && styles.subtitleTile]}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      <View
        style={[
          styles.indicator,
          multiple && styles.indicatorSquare,
          tile && styles.indicatorTile,
          { borderColor: tone.accent },
          selected && { backgroundColor: tone.accent },
        ]}
      >
        {selected && <Ionicons name="checkmark" size={15} color={COLORS.white} />}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 18,
    borderWidth: 2,
  },
  tile: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 8,
    padding: 12,
    minHeight: 96,
  },
  pressed: {
    opacity: 0.85,
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircleTile: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  text: {
    flex: 1,
  },
  tileText: {
    alignSelf: "stretch",
  },
  title: {
    color: "#1D2B3A",
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 2,
  },
  titleTile: {
    fontSize: 13,
  },
  subtitle: {
    color: "#55616D",
    fontSize: 12,
    lineHeight: 17,
  },
  subtitleTile: {
    fontSize: 11,
    lineHeight: 15,
  },
  indicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
  },
  indicatorSquare: {
    borderRadius: 7,
  },
  indicatorTile: {
    position: "absolute",
    top: 12,
    right: 10,
  },
});
