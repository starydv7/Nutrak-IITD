
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
  const { height } = useWindowDimensions();

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <StatusBar style="dark" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          { minHeight: height - 50 },
        ]}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.backgroundGlow} />
        <View style={styles.bottomGlow} />

        {/* Nutrak logo */}
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
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />

          <View style={styles.heroBlobOne} />
          <View style={styles.heroBlobTwo} />

          <View style={styles.leftPlant}>
            <View style={[styles.leaf, styles.leaf1]} />
            <View style={[styles.leaf, styles.leaf2]} />
            <View style={[styles.leaf, styles.leaf3]} />
          </View>

          <View style={styles.rightPlant}>
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

        {/* Supporting message */}
        <View style={styles.message}>
          <Text style={styles.messageText}>
            Personalized nutrition for your child’s
          </Text>
          <Text style={styles.messageText}>
            brighter and healthier tomorrow
          </Text>
        </View>

        {/* Get Started button */}
        <Pressable
          accessibilityRole="button"
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
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 14,
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
    bottom: -110,
    left: -80,
    width: 280,
    height: 240,
    borderRadius: 140,
    backgroundColor: "#E5F4DB",
  },

  /* Brand */
  brand: {
    alignItems: "center",
    marginBottom: 14,
    zIndex: 2,
  },
  logo: {
    height: 58,
    width: 66,
    position: "relative",
    marginBottom: 2,
  },
  logoStem: {
    position: "absolute",
    left: 32,
    bottom: 0,
    width: 3,
    height: 28,
    backgroundColor: COLORS.darkGreen,
    borderRadius: 2,
  },
  logoLeafLeft: {
    position: "absolute",
    left: 5,
    top: 10,
    width: 29,
    height: 41,
    backgroundColor: "#38B957",
    borderTopLeftRadius: 2,
    borderTopRightRadius: 28,
    borderBottomLeftRadius: 27,
    borderBottomRightRadius: 2,
    transform: [{ rotate: "-27deg" }],
  },
  logoLeafRight: {
    position: "absolute",
    right: 4,
    top: 10,
    width: 28,
    height: 40,
    backgroundColor: COLORS.darkGreen,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 2,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 27,
    transform: [{ rotate: "24deg" }],
  },
  logoDot: {
    position: "absolute",
    top: 0,
    left: 24,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.darkGreen,
  },
  brandName: {
    fontSize: 38,
    lineHeight: 43,
    fontWeight: "900",
    letterSpacing: -1.5,
    color: COLORS.darkGreen,
  },
  tagline: {
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.darkGreen,
    marginTop: 1,
  },

  /* Hero */
  hero: {
    width: "100%",
    aspectRatio: 0.92,
    maxHeight: 430,
    minHeight: 245,
    borderRadius: 25,
    overflow: "hidden",
    position: "relative",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  heroBlobOne: {
    position: "absolute",
    top: -15,
    right: -45,
    width: "95%",
    height: "67%",
    borderRadius: 150,
    backgroundColor: "#F7FAED",
  },
  heroBlobTwo: {
    position: "absolute",
    bottom: 15,
    left: -35,
    width: "80%",
    height: "45%",
    borderRadius: 130,
    backgroundColor: "#D0EDC5",
    opacity: 0.75,
  },
  child: {
    width: "112%",
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

  /* Supporting message */
  message: {
    alignItems: "center",
    marginTop: 12,
    marginBottom: 16,
    paddingHorizontal: 2,
  },
  messageText: {
    color: COLORS.textGreen,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    fontWeight: "500",
  },

  /* Button */
  buttonWrapper: {
    width: "100%",
    borderRadius: 22,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#15964B",
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
    minHeight: 51,
    borderRadius: 22,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  arrow: {
    color: "#FFFFFF",
    fontSize: 22,
    lineHeight: 25,
  },
});
