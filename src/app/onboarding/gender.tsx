
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Gender = "boy" | "girl";

const COLORS = {
  background: "#FAF9F1",
  darkGreen: "#075333",
  green: "#15964B",
  textGreen: "#315E43",
  blue: "#1685EB",
  blueLight: "#DDF1FF",
  pink: "#F52D7A",
  pinkLight: "#FCE5EF",
  white: "#FFFFFF",
};

export default function GenderPage() {
  const [gender, setGender] = useState<Gender | null>(null);

  const { width, height } = useWindowDimensions();

  // Scale spacing and typography to the available screen.
  const scale = Math.min(width / 390, height / 844);
  const spacing = Math.max(5, Math.min(width * 0.035, 14));
  const compact = height < 700 || width < 350;

  const selectGender = (value: Gender) => {
    setGender(value);
  };

  const continueOnboarding = () => {
    if (!gender) return;

    router.push({
      pathname: "/onboarding/age",
      params: { gender },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <StatusBar
        style="dark"
        backgroundColor={COLORS.background}
      />

      <View style={[styles.screen, { paddingHorizontal: spacing }]}>
        {/* Header: brand and child illustration */}
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backArrow}>‹</Text>
          </Pressable>

          <View style={styles.brand}>
            <View style={styles.logo}>
              <View style={styles.logoStem} />
              <View style={styles.logoLeft} />
              <View style={styles.logoRight} />
              <View style={styles.logoDot} />
            </View>

            <View style={styles.brandText}>
              <Text style={styles.brandName}>Nutrak</Text>
              <Text style={styles.tagline}>
                Better Food • Healthier You
              </Text>
            </View>
          </View>

          <View style={styles.headerIllustration}>
            <Image
              source={require("../../../assets/images/nutrak-child.png")}
              style={styles.headerChild}
              resizeMode="contain"
              accessibilityLabel="Nutrak child illustration"
            />
          </View>
        </View>

        {/* Main question panel */}
        <View style={styles.questionCard}>
          <LinearGradient
            colors={["#E7F6DF", "#F0F8E9", "#E6F4DF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />

          <View style={styles.questionContent}>
            <View style={styles.questionIcon}>
              <Text style={styles.peopleIcon}>♧</Text>
            </View>

            <Text
              style={[
                styles.questionTitle,
                { fontSize: compact ? 19 : 23 },
              ]}
            >
              What is your child's gender?
            </Text>

            <Text
              style={[
                styles.questionDescription,
                { fontSize: compact ? 11 : 13 },
              ]}
            >
              Please select your child's gender so we can
              provide the most relevant nutrition recommendations.
            </Text>
          </View>

          <View
            pointerEvents="none"
            style={styles.questionDecoration}
          >
            <Image
              source={require("../../../assets/images/nutrak-child.png")}
              style={styles.questionChild}
              resizeMode="contain"
            />
          </View>

          <View pointerEvents="none" style={styles.questionLeafOne} />
          <View pointerEvents="none" style={styles.questionLeafTwo} />
        </View>

        {/* Selectable gender cards */}
        <View style={[styles.optionsRow, { gap: spacing * 0.8 }]}>
          {/* Boy */}
          <Pressable
            accessibilityRole="radio"
            accessibilityLabel="Boy"
            accessibilityState={{ selected: gender === "boy" }}
            onPress={() => selectGender("boy")}
            style={[
              styles.genderCard,
              styles.boyCard,
              gender === "boy" && styles.selectedBoyCard,
            ]}
          >
            <View style={styles.avatarArea}>
              <View style={styles.boyCircle} />

              <Image
                source={require("../../../assets/images/boy-avatar.png")}
                style={styles.avatar}
                resizeMode="contain"
              />

              <View style={styles.genderSymbolBlue}>
                <Text style={styles.symbol}>♂</Text>
              </View>
            </View>

            <View style={styles.cardLabelArea}>
              <LinearGradient
                colors={
                  gender === "boy"
                    ? ["#0875E0", "#168CF5"]
                    : ["#168CF5", "#1681E7"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.boyLabel}
              >
                <Text style={styles.genderLabel}>Boy</Text>
              </LinearGradient>
            </View>
          </Pressable>

          {/* Girl */}
          <Pressable
            accessibilityRole="radio"
            accessibilityLabel="Girl"
            accessibilityState={{ selected: gender === "girl" }}
            onPress={() => selectGender("girl")}
            style={[
              styles.genderCard,
              styles.girlCard,
              gender === "girl" && styles.selectedGirlCard,
            ]}
          >
            <View style={styles.avatarArea}>
              <View style={styles.girlCircle} />

              <Image
                source={require("../../../assets/images/girl-avatar.png")}
                style={styles.avatar}
                resizeMode="contain"
              />

              <View style={styles.genderSymbolPink}>
                <Text style={styles.symbol}>♀</Text>
              </View>
            </View>

            <View style={styles.cardLabelArea}>
              <LinearGradient
                colors={["#F52D7A", "#F02570"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.girlLabel}
              >
                <Text style={styles.genderLabel}>Girl</Text>
              </LinearGradient>
            </View>
          </Pressable>
        </View>

        {/* Flexible footer and continue button */}
        <View style={styles.footer}>
          <Text style={styles.helperText}>
            {gender
              ? `${gender === "boy" ? "Boy" : "Girl"} selected`
              : "Select an option to continue"}
          </Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Next onboarding step"
            accessibilityState={{ disabled: !gender }}
            disabled={!gender}
            onPress={continueOnboarding}
            style={({ pressed }) => [
              styles.nextButton,
              pressed && gender && styles.buttonPressed,
              !gender && styles.disabledButton,
            ]}
          >
            <LinearGradient
              colors={
                gender
                  ? ["#20A957", "#15964B", "#118A43"]
                  : ["#A8D5B4", "#99CBA7"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.nextGradient}
            >
              <Text style={styles.nextText}>NEXT</Text>
              <Text style={styles.nextArrow}>→</Text>
            </LinearGradient>
          </Pressable>
        </View>

        {/* Decorative bottom leaves */}
        <View
          pointerEvents="none"
          style={styles.bottomDecoration}
        >
          <View style={styles.bottomLeafLeft} />
          <View style={styles.bottomLeafCenter} />
          <View style={styles.bottomLeafRight} />
          <View style={styles.bottomLeafFarRight} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  screen: {
    flex: 1,
    paddingTop: "1%",
    paddingBottom: "1%",
    overflow: "hidden",
  },

  /* Header */
  header: {
    flex: 0.8,
    minHeight: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    flex: 0.35,
    alignItems: "flex-start",
    justifyContent: "center",
    zIndex: 2,
  },

  backArrow: {
    color: COLORS.darkGreen,
    fontSize: 32,
    fontWeight: "400",
  },

  brand: {
    flex: 1.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 0,
  },

  logo: {
    width: "28%",
    aspectRatio: 1,
    maxWidth: 48,
    position: "relative",
    marginRight: 4,
  },

  logoStem: {
    position: "absolute",
    left: "49%",
    bottom: 0,
    width: 2,
    height: "44%",
    backgroundColor: COLORS.darkGreen,
  },

  logoLeft: {
    position: "absolute",
    left: "10%",
    top: "20%",
    width: "43%",
    height: "62%",
    backgroundColor: "#38B957",
    borderTopLeftRadius: 2,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 2,
    transform: [{ rotate: "-27deg" }],
  },

  logoRight: {
    position: "absolute",
    right: "8%",
    top: "20%",
    width: "41%",
    height: "60%",
    backgroundColor: COLORS.darkGreen,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 2,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 30,
    transform: [{ rotate: "24deg" }],
  },

  logoDot: {
    position: "absolute",
    top: 0,
    left: "40%",
    width: "24%",
    aspectRatio: 1,
    borderRadius: 100,
    backgroundColor: COLORS.darkGreen,
  },

  brandText: {
    flexShrink: 1,
    justifyContent: "center",
  },

  brandName: {
    fontSize: 23,
    lineHeight: 27,
    fontWeight: "900",
    letterSpacing: -1,
    color: COLORS.darkGreen,
  },

  tagline: {
    fontSize: 7,
    fontWeight: "600",
    color: COLORS.darkGreen,
  },

  headerIllustration: {
    flex: 0.9,
    height: "90%",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  headerChild: {
    width: "100%",
    height: "100%",
  },

  /* Question card */
  questionCard: {
    flex: 1.2,
    minHeight: 0,
    marginVertical: "1.5%",
    borderRadius: 24,
    overflow: "hidden",
    position: "relative",
    justifyContent: "center",
  },

  questionContent: {
    width: "70%",
    height: "100%",
    justifyContent: "center",
    paddingLeft: "4%",
    paddingVertical: "3%",
    zIndex: 2,
  },

  questionIcon: {
    width: "20%",
    aspectRatio: 1,
    maxWidth: 38,
    borderRadius: 100,
    backgroundColor: "#29A956",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "3%",
  },

  peopleIcon: {
    color: COLORS.white,
    fontSize: 23,
    fontWeight: "700",
  },

  questionTitle: {
    color: COLORS.darkGreen,
    fontWeight: "900",
    lineHeight: 1.15 * 23,
    letterSpacing: -0.6,
    marginBottom: "3%",
  },

  questionDescription: {
    color: COLORS.textGreen,
    lineHeight: 1.5 * 12,
    fontWeight: "500",
  },

  questionDecoration: {
    position: "absolute",
    right: "-7%",
    bottom: 0,
    width: "48%",
    height: "85%",
    justifyContent: "flex-end",
  },

  questionChild: {
    width: "100%",
    height: "100%",
  },

  questionLeafOne: {
    position: "absolute",
    right: "8%",
    bottom: "-5%",
    width: "9%",
    height: "22%",
    backgroundColor: "#48B75A",
    borderTopLeftRadius: 2,
    borderTopRightRadius: 28,
    borderBottomLeftRadius: 28,
    transform: [{ rotate: "-35deg" }],
  },

  questionLeafTwo: {
    position: "absolute",
    right: "2%",
    bottom: "-5%",
    width: "8%",
    height: "19%",
    backgroundColor: "#7DCC64",
    borderTopLeftRadius: 2,
    borderTopRightRadius: 28,
    borderBottomLeftRadius: 28,
    transform: [{ rotate: "35deg" }],
  },

  /* Gender cards */
  optionsRow: {
    flex: 1.9,
    minHeight: 0,
    flexDirection: "row",
    marginVertical: "1%",
  },

  genderCard: {
    flex: 1,
    minWidth: 0,
    minHeight: 0,
    borderRadius: 24,
    borderWidth: 1.5,
    padding: "3%",
    justifyContent: "space-between",
    overflow: "hidden",
  },

  boyCard: {
    backgroundColor: COLORS.blueLight,
    borderColor: "transparent",
  },

  girlCard: {
    backgroundColor: COLORS.pinkLight,
    borderColor: "transparent",
  },

  selectedBoyCard: {
    borderColor: COLORS.blue,
  },

  selectedGirlCard: {
    borderColor: COLORS.pink,
  },

  avatarArea: {
    flex: 1,
    minHeight: 0,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginBottom: "4%",
  },

  boyCircle: {
    position: "absolute",
    width: "82%",
    aspectRatio: 1,
    maxHeight: "95%",
    borderRadius: 999,
    backgroundColor: "#A9DFFF",
  },

  girlCircle: {
    position: "absolute",
    width: "82%",
    aspectRatio: 1,
    maxHeight: "95%",
    borderRadius: 999,
    backgroundColor: "#FFB8D4",
  },

  avatar: {
    width: "100%",
    height: "100%",
    zIndex: 1,
  },

  genderSymbolBlue: {
    position: "absolute",
    top: "3%",
    right: "0%",
    width: "30%",
    aspectRatio: 1,
    borderRadius: 100,
    backgroundColor: COLORS.blue,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },

  genderSymbolPink: {
    position: "absolute",
    top: "3%",
    right: "0%",
    width: "30%",
    aspectRatio: 1,
    borderRadius: 100,
    backgroundColor: COLORS.pink,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },

  symbol: {
    color: COLORS.white,
    fontSize: 25,
    fontWeight: "700",
  },

  cardLabelArea: {
    width: "100%",
  },

  boyLabel: {
    width: "100%",
    paddingVertical: "10%",
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },

  girlLabel: {
    width: "100%",
    paddingVertical: "10%",
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },

  genderLabel: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "900",
  },

  /* Footer */
  footer: {
    flex: 0.55,
    minHeight: 0,
    justifyContent: "center",
    paddingTop: "1%",
    paddingBottom: "1%",
    gap: "8%",
  },

  helperText: {
    color: "#64806A",
    fontSize: 10,
    textAlign: "center",
  },

  nextButton: {
    width: "100%",
    borderRadius: 999,
    overflow: "hidden",
    elevation: 2,
    shadowColor: COLORS.green,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.16,
    shadowRadius: 5,
  },

  disabledButton: {
    elevation: 0,
    shadowOpacity: 0,
  },

  nextGradient: {
    width: "100%",
    paddingVertical: "3.5%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },

  nextText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "900",
  },

  nextArrow: {
    color: COLORS.white,
    fontSize: 21,
    lineHeight: 23,
  },

  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },

  /* Bottom decorations */
  bottomDecoration: {
    flex: 0.18,
    minHeight: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    overflow: "hidden",
  },

  bottomLeafLeft: {
    width: "7%",
    height: "75%",
    backgroundColor: "#8CD46D",
    borderTopLeftRadius: 2,
    borderTopRightRadius: 30,
    transform: [{ rotate: "-35deg" }],
  },

  bottomLeafCenter: {
    width: "6%",
    height: "60%",
    backgroundColor: "#55B95A",
    borderTopLeftRadius: 2,
    borderTopRightRadius: 30,
    transform: [{ rotate: "30deg" }],
  },

  bottomLeafRight: {
    width: "6%",
    height: "60%",
    backgroundColor: "#55B95A",
    borderTopLeftRadius: 2,
    borderTopRightRadius: 30,
    transform: [{ rotate: "-30deg" }],
  },

  bottomLeafFarRight: {
    width: "7%",
    height: "75%",
    backgroundColor: "#8CD46D",
    borderTopLeftRadius: 2,
    borderTopRightRadius: 30,
    transform: [{ rotate: "35deg" }],
  },
});
