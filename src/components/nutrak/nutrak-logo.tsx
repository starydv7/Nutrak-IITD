import { StyleSheet, Text, View } from "react-native";

import { COLORS } from "@/constants/nutrak";

type Props = {
  /** Height of the leaf mark in points. */
  size?: number;
  showText?: boolean;
  tagline?: string;
};

export function NutrakLogo({
  size = 40,
  showText = true,
  tagline = "Better Food • Healthier You",
}: Props) {
  const s = size / 72;

  return (
    <View style={styles.row}>
      <View style={{ width: 78 * s, height: 72 * s }}>
        <View
          style={[
            styles.stem,
            { left: 37 * s, width: Math.max(2, 3 * s), height: 34 * s },
          ]}
        />
        <View
          style={[
            styles.leafLeft,
            {
              left: 7 * s,
              top: 13 * s,
              width: 31 * s,
              height: 47 * s,
              borderTopRightRadius: 30 * s,
              borderBottomLeftRadius: 30 * s,
            },
          ]}
        />
        <View
          style={[
            styles.leafRight,
            {
              right: 5 * s,
              top: 13 * s,
              width: 30 * s,
              height: 46 * s,
              borderTopLeftRadius: 30 * s,
              borderBottomRightRadius: 30 * s,
            },
          ]}
        />
        <View
          style={[
            styles.dot,
            { left: 29 * s, width: 19 * s, height: 19 * s, borderRadius: 10 * s },
          ]}
        />
      </View>

      {showText && (
        <View style={{ marginLeft: 4 * s + 2 }}>
          <Text
            style={[
              styles.name,
              { fontSize: size * 0.62, lineHeight: size * 0.72 },
            ]}
          >
            Nutrak
          </Text>
          {tagline ? (
            <Text style={[styles.tagline, { fontSize: Math.max(8, size * 0.2) }]}>
              {tagline}
            </Text>
          ) : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  stem: {
    position: "absolute",
    bottom: 0,
    backgroundColor: COLORS.darkGreen,
    borderRadius: 2,
  },
  leafLeft: {
    position: "absolute",
    backgroundColor: "#38B957",
    borderTopLeftRadius: 2,
    borderBottomRightRadius: 2,
    transform: [{ rotate: "-27deg" }],
  },
  leafRight: {
    position: "absolute",
    backgroundColor: COLORS.darkGreen,
    borderTopRightRadius: 2,
    borderBottomLeftRadius: 2,
    transform: [{ rotate: "24deg" }],
  },
  dot: {
    position: "absolute",
    top: 0,
    backgroundColor: COLORS.darkGreen,
  },
  name: {
    fontWeight: "900",
    letterSpacing: -1,
    color: COLORS.darkGreen,
  },
  tagline: {
    fontWeight: "600",
    color: COLORS.darkGreen,
  },
});
