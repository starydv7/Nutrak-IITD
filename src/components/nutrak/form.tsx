import { Ionicons } from "@expo/vector-icons";
import { forwardRef, type ReactNode } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputInstance,
  type TextInputProps,
} from "react-native";

import { COLORS } from "@/constants/nutrak";

type FieldProps = TextInputProps & {
  label?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  prefix?: string;
  trailing?: ReactNode;
  error?: string | null;
  hint?: string;
};

export const TextField = forwardRef<TextInputInstance, FieldProps>(function TextField(
  { label, icon, prefix, trailing, error, hint, style, ...inputProps },
  ref,
) {
  return (
    <View style={styles.field}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.inputBox, error ? styles.inputError : null]}>
        {icon && <Ionicons name={icon} size={20} color={COLORS.green} />}
        {prefix ? <Text style={styles.prefix}>{prefix}</Text> : null}
        <TextInput
          ref={ref}
          placeholderTextColor="#9AA79F"
          style={[styles.input, style]}
          {...inputProps}
        />
        {trailing}
      </View>
      {error ? (
        <Text style={styles.error} accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : hint ? (
        <Text style={styles.hint}>{hint}</Text>
      ) : null}
    </View>
  );
});

type SegmentOption<T extends string> = { value: T; label: string };

export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <View style={styles.segmented} accessibilityRole="tablist">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(option.value)}
            style={[styles.segment, active && styles.segmentActive]}
          >
            <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function Panel({ children }: { children: ReactNode }) {
  return <View style={styles.panel}>{children}</View>;
}

const styles = StyleSheet.create({
  field: {
    gap: 6,
  },
  label: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "700",
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    minHeight: 50,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  prefix: {
    color: COLORS.textGreen,
    fontSize: 16,
    fontWeight: "700",
  },
  input: {
    flex: 1,
    color: COLORS.text,
    fontSize: 16,
    paddingVertical: 12,
  },
  error: {
    color: COLORS.error,
    fontSize: 12,
    fontWeight: "600",
  },
  hint: {
    color: COLORS.mutedGreen,
    fontSize: 12,
  },
  segmented: {
    flexDirection: "row",
    padding: 4,
    borderRadius: 999,
    backgroundColor: "#E4EFDF",
  },
  segment: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 999,
    alignItems: "center",
  },
  segmentActive: {
    backgroundColor: COLORS.white,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  segmentText: {
    color: COLORS.mutedGreen,
    fontSize: 14,
    fontWeight: "700",
  },
  segmentTextActive: {
    color: COLORS.darkGreen,
  },
  panel: {
    padding: 16,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 14,
  },
});
