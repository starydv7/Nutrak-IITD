
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const COLORS = {
  background: "#FAF9F1",
  darkGreen: "#075333",
  green: "#15964B",
  textGreen: "#315E43",
};

export default function LandingPage() {
  const { width, height } = useWindowDimensions();
  const compact = width < 380;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <StatusBar style="dark" backgroundColor={COLORS.background} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          { minHeight: Math.max(height - 48, 540) },
        ]}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Background decorations */}
        <View
          pointerEvents="none"
          style={styles.backgroundGlow}
        />
        <View
          pointerEvents="none"
          style={styles.bottomGlow}
        />

        {/* Nutrak brand */}
        <View style={styles.brand}>
          <View style={styles.logo}>
            <View style={styles.logoStem} />
            <View style={styles.logoLeafLeft} />
            <View style={styles.logoLeafRight} />
            <View style={styles.logoDot} />
          </View>

          <Text style={styles.brandName}>Nutrak</Text>

          <Text style={styles.tagline}>
            Better Food • Healthier You
          </Text>
        </View>

        {/* Hero illustration */}
        <View style={styles.hero}>
          <LinearGradient
            colors={["#F5F9EA", "#E8F6DF", "#DDF1D5"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />

          <View style={styles.heroBlobOne} />
          <View style={styles.heroBlobTwo} />

          {/* Decorative plants */}
          <View
            pointerEvents="none"
            style={styles.leftPlant}
          >
            <View style={[styles.leaf, styles.leaf1]} />
            <View style={[styles.leaf, styles.leaf2]} />
            <View style={[styles.leaf, styles.leaf3]} />
          </View>

          <View
            pointerEvents="none"
            style={styles.rightPlant}
          >
            <View style={[styles.leaf, styles.leaf4]} />
            <View style={[styles.leaf, styles.leaf5]} />
            <View style={[styles.leaf, styles.leaf6]} />
          </View>

          <Text style={styles.heart}>♥</Text>

          <Image
            source={require("../../assets/images/nutrak-child.png")}
            style={styles.child}
            resizeMode="contain"
            accessibilityLabel="Child enjoying a healthy meal"
          />
        </View>

        {/* Welcome message */}
        <View style={styles.message}>
          <Text
            style={[
              styles.messageText,
              compact && styles.compactMessage,
            ]}
          >
            Personalized nutrition for your child’s
          </Text>

          <Text
            style={[
              styles.messageText,
              compact && styles.compactMessage,
            ]}
          >
            brighter and healthier tomorrow
          </Text>
        </View>

        {/* Get Started */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Get Started with child nutrition onboarding"
          onPress={() => router.push("/onboarding/gender")}
          style={({ pressed }) => [
            styles.buttonWrapper,
            pressed && styles.buttonPressed,
          ]}
        >
          <LinearGradient
            colors={["#20A957", "#15964B", "#118A43"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Get Started</Text>
            <Text style={styles.arrow}>→</Text>
          </LinearGradient>
        </Pressable>

        <Text style={styles.footer}>
          A healthier future starts here
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 16,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  backgroundGlow: {
    position: "absolute",
    top: 70,
    right: -110,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "#F0F5E7",
  },

  bottomGlow: {
    position: "absolute",
    bottom: -100,
    left: -80,
    width: 280,
    height: 240,
    borderRadius: 140,
    backgroundColor: "#E5F4DB",
  },

  /* Logo */
  brand: {
    alignItems: "center",
    marginBottom: 18,
    zIndex: 2,
  },

  logo: {
    height: 72,
    width: 78,
    position: "relative",
    marginBottom: 4,
  },

  logoStem: {
    position: "absolute",
    left: 37,
    bottom: 0,
    width: 3,
    height: 34,
    backgroundColor: COLORS.darkGreen,
    borderRadius: 2,
  },

  logoLeafLeft: {
    position: "absolute",
    left: 7,
    top: 13,
    width: 31,
    height: 47,
    backgroundColor: "#38B957",
    borderTopLeftRadius: 2,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 2,
    transform: [{ rotate: "-27deg" }],
  },

  logoLeafRight: {
    position: "absolute",
    right: 5,
    top: 13,
    width: 30,
    height: 46,
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
    left: 29,
    width: 19,
    height: 19,
    borderRadius: 10,
    backgroundColor: COLORS.darkGreen,
  },

  brandName: {
    fontSize: 42,
    lineHeight: 48,
    fontWeight: "900",
    letterSpacing: -1.5,
    color: COLORS.darkGreen,
  },

  tagline: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.darkGreen,
    marginTop: 2,
  },

  /* Hero illustration */
  hero: {
    width: "100%",
    aspectRatio: 0.9,
    maxHeight: 440,
    minHeight: 240,
    borderRadius: 28,
    overflow: "hidden",
    position: "relative",
    alignItems: "center",
    justifyContent: "flex-end",
  },

  heroBlobOne: {
    position: "absolute",
    top: -15,
    right: -35,
    width: "90%",
    height: "70%",
    borderRadius: 180,
    backgroundColor: "#F7FAED",
  },

  heroBlobTwo: {
    position: "absolute",
    bottom: 12,
    left: -35,
    width: "80%",
    height: "45%",
    borderRadius: 130,
    backgroundColor: "#D0EDC5",
    opacity: 0.75,
  },

  child: {
    width: "108%",
    height: "100%",
    zIndex: 2,
  },

  /* Decorative plants */
  leftPlant: {
    position: "absolute",
    left: 0,
    bottom: 12,
    height: "64%",
    width: 75,
    zIndex: 1,
  },

  rightPlant: {
    position: "absolute",
    right: 0,
    bottom: 10,
    height: "65%",
    width: 75,
    zIndex: 1,
  },

  leaf: {
    position: "absolute",
    width: 23,
    height: 49,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 25,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 3,
    backgroundColor: "#72C95C",
  },

  leaf1: {
    left: 8,
    bottom: 10,
    transform: [{ rotate: "-45deg" }],
  },

  leaf2: {
    left: 38,
    bottom: 46,
    backgroundColor: "#39AC4D",
    transform: [{ rotate: "35deg" }],
  },

  leaf3: {
    left: 3,
    bottom: 80,
    backgroundColor: "#A7DF8D",
    transform: [{ rotate: "-25deg" }, { scale: 0.8 }],
  },

  leaf4: {
    right: 7,
    bottom: 10,
    transform: [{ rotate: "45deg" }],
  },

  leaf5: {
    right: 36,
    bottom: 48,
    backgroundColor: "#39AC4D",
    transform: [{ rotate: "-35deg" }],
  },

  leaf6: {
    right: 2,
    bottom: 83,
    backgroundColor: "#A7DF8D",
    transform: [{ rotate: "25deg" }, { scale: 0.8 }],
  },

  heart: {
    position: "absolute",
    top: "10%",
    left: "12%",
    color: "#FF6D69",
    fontSize: 34,
    zIndex: 3,
    transform: [{ rotate: "-12deg" }],
  },

  /* Welcome message */
  message: {
    alignItems: "center",
    marginTop: 14,
    marginBottom: 18,
    paddingHorizontal: 2,
  },

  messageText: {
    color: COLORS.textGreen,
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    fontWeight: "500",
  },

  compactMessage: {
    fontSize: 12,
    lineHeight: 18,
  },

  /* Button */
  buttonWrapper: {
    width: "100%",
    borderRadius: 28,
    overflow: "hidden",
    elevation: 3,
    shadowColor: COLORS.green,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 7,
  },

  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },

  button: {
    width: "100%",
    minHeight: 54,
    borderRadius: 28,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  arrow: {
    color: "#FFFFFF",
    fontSize: 24,
    lineHeight: 28,
  },

  footer: {
    color: "#64806A",
    fontSize: 11,
    marginTop: 12,
    textAlign: "center",
  },
});
