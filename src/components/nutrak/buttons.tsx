import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { COLORS, GRADIENTS } from "@/constants/nutrak";

type ButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  showArrow?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

export function PrimaryButton({
  label,
  onPress,
  disabled,
  loading,
  showArrow = true,
  style,
  accessibilityLabel,
}: ButtonProps) {
  const inactive = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      onPress={onPress}
      style={({ pressed }) => [
        styles.wrapper,
        !inactive && styles.shadow,
        pressed && !inactive && styles.pressed,
        style,
      ]}
    >
      <LinearGradient
        colors={inactive && !loading ? GRADIENTS.primaryDisabled : GRADIENTS.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.primary}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.white} />
        ) : (
          <>
            <Text style={styles.primaryText}>{label}</Text>
            {showArrow && (
              <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
            )}
          </>
        )}
      </LinearGradient>
    </Pressable>
  );
}

export function SecondaryButton({
  label,
  onPress,
  disabled,
  style,
  icon,
  accessibilityLabel,
}: ButtonProps & { icon?: keyof typeof Ionicons.glyphMap }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.wrapper,
        styles.secondary,
        pressed && styles.pressed,
        disabled && styles.secondaryDisabled,
        style,
      ]}
    >
      {icon && <Ionicons name={icon} size={18} color={COLORS.green} />}
      <Text style={styles.secondaryText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    borderRadius: 999,
    overflow: "hidden",
  },
  shadow: {
    elevation: 2,
    shadowColor: COLORS.green,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  primary: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: 20,
  },
  primaryText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 1,
  },
  secondary: {
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1.5,
    borderColor: COLORS.green,
    backgroundColor: COLORS.white,
  },
  secondaryDisabled: {
    opacity: 0.5,
  },
  secondaryText: {
    color: COLORS.green,
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
});
