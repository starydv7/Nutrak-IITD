import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import type { ReactNode } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type ImageSourcePropType,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { COLORS, GRADIENTS, IMAGES, TOTAL_STEPS } from "@/constants/nutrak";
import { useOnboarding } from "@/store/onboarding";

import { BottomLeaves } from "./decorations";
import { NutrakLogo } from "./nutrak-logo";
import { StepProgress } from "./step-progress";

type Props = {
  step?: number;
  progress?: { current: number; total: number; variant?: "progress" | "single" };
  badge?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  /** Image (or custom node) shown on the right of the question card. */
  illustration?: ImageSourcePropType | ReactNode;
  /** When false, the question card is rendered without its green panel. */
  card?: boolean;
  children?: ReactNode;
  footer?: ReactNode;
  onBack?: () => void;
};

export function goBackOr(fallback: Parameters<typeof router.replace>[0]) {
  if (router.canGoBack()) router.back();
  else router.replace(fallback);
}

export function OnboardingLayout({
  step,
  progress,
  badge,
  icon,
  title,
  description,
  illustration,
  card = true,
  children,
  footer,
  onBack,
}: Props) {
  const { child } = useOnboarding();
  const { width } = useWindowDimensions();
  const compact = width < 370;

  const headerImage =
    child.gender === "girl"
      ? IMAGES.girl
      : child.gender === "boy"
        ? IMAGES.boy
        : IMAGES.child;

  const progressProps =
    progress ?? (step ? { current: step, total: TOTAL_STEPS } : undefined);
  const badgeText = badge ?? (step ? `Step ${step} of ${TOTAL_STEPS}` : undefined);

  const illustrationNode =
    illustration == null ? null : isImageSource(illustration) ? (
      <Image
        source={illustration}
        style={styles.cardImage}
        resizeMode="contain"
        accessibilityIgnoresInvertColors
      />
    ) : (
      illustration
    );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <StatusBar style="dark" />
      <BottomLeaves />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={12}
            onPress={onBack ?? (() => goBackOr("/"))}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={26} color={COLORS.darkGreen} />
          </Pressable>

          <View style={styles.logo}>
            <NutrakLogo size={compact ? 30 : 36} />
          </View>

          <View style={styles.headerArt}>
            <View style={styles.headerGlow} />
            <Image
              source={headerImage}
              style={styles.headerImage}
              resizeMode="contain"
              accessibilityIgnoresInvertColors
            />
          </View>
        </View>

        {progressProps && (
          <View style={styles.progress}>
            <StepProgress {...progressProps} />
          </View>
        )}

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.questionCard, !card && styles.questionPlain]}>
            {card && (
              <LinearGradient
                colors={GRADIENTS.card}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
            )}

            <View
              style={[
                styles.questionContent,
                !illustrationNode && styles.questionContentFull,
              ]}
            >
              {(icon || badgeText) && (
                <View style={styles.badgeRow}>
                  {icon && (
                    <View style={styles.questionIcon}>
                      <Ionicons name={icon} size={20} color={COLORS.white} />
                    </View>
                  )}
                  {badgeText && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{badgeText}</Text>
                    </View>
                  )}
                </View>
              )}

              <Text
                style={[styles.title, compact && styles.titleCompact]}
                accessibilityRole="header"
              >
                {title}
              </Text>

              {description ? (
                <Text style={[styles.description, compact && styles.descriptionCompact]}>
                  {description}
                </Text>
              ) : null}
            </View>

            {illustrationNode && (
              <View pointerEvents="none" style={styles.cardArt}>
                {illustrationNode}
              </View>
            )}
          </View>

          {children}
        </ScrollView>

        {footer && <View style={styles.footer}>{footer}</View>}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function isImageSource(value: unknown): value is ImageSourcePropType {
  return (
    typeof value === "number" ||
    (typeof value === "object" &&
      value !== null &&
      "uri" in (value as Record<string, unknown>))
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 72,
  },
  backButton: {
    width: 36,
    height: 44,
    justifyContent: "center",
  },
  logo: {
    flex: 1,
    alignItems: "flex-start",
    paddingLeft: 4,
  },
  headerArt: {
    width: 104,
    height: 72,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  headerGlow: {
    position: "absolute",
    bottom: 0,
    width: 100,
    height: 50,
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    backgroundColor: "#E6F4DF",
  },
  headerImage: {
    width: 96,
    height: 70,
  },
  progress: {
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 24,
    gap: 14,
  },
  questionCard: {
    borderRadius: 24,
    overflow: "hidden",
    minHeight: 150,
    flexDirection: "row",
  },
  questionPlain: {
    minHeight: 0,
  },
  questionContent: {
    width: "64%",
    padding: 16,
    zIndex: 2,
  },
  questionContentFull: {
    width: "100%",
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  questionIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.brightGreen,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "#D3EECB",
  },
  badgeText: {
    color: COLORS.darkGreen,
    fontSize: 12,
    fontWeight: "700",
  },
  title: {
    color: COLORS.darkGreen,
    fontSize: 23,
    lineHeight: 27,
    fontWeight: "900",
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  titleCompact: {
    fontSize: 20,
    lineHeight: 24,
  },
  description: {
    color: COLORS.textGreen,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "500",
  },
  descriptionCompact: {
    fontSize: 12,
    lineHeight: 17,
  },
  cardArt: {
    position: "absolute",
    right: -6,
    top: 8,
    bottom: 0,
    width: "40%",
    justifyContent: "flex-end",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  footer: {
    paddingHorizontal: 22,
    paddingTop: 8,
    paddingBottom: 14,
    gap: 10,
    zIndex: 2,
  },
});
