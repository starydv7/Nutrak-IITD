
import { Image, View, StyleSheet } from "react-native";
import { images } from "../assets/imageAssets";

export default function NutritionImageExamples() {
  return (
    <View style={styles.container}>
      {/* Landing page illustration */}
      <Image
        source={images.child}
        style={styles.hero}
        resizeMode="contain"
      />

      {/* Onboarding artwork */}
      <Image
        source={images.onboardingFamily}
        style={styles.banner}
        resizeMode="cover"
      />

      {/* Boy and girl selection images */}
      <View style={styles.row}>
        <Image
          source={images.boyAvatar}
          style={styles.avatar}
          resizeMode="cover"
        />
        <Image
          source={images.girlAvatar}
          style={styles.avatar}
          resizeMode="cover"
        />
      </View>

      {/* Food image */}
      <Image
        source={images.breakfast}
        style={styles.food}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  hero: {
    width: "100%",
    height: 300,
  },
  banner: {
    width: "100%",
    height: 180,
    borderRadius: 24,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  avatar: {
    flex: 1,
    height: 160,
    borderRadius: 20,
  },
  food: {
    width: "100%",
    height: 180,
    borderRadius: 20,
  },
});
