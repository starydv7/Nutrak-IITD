import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { TextField } from "@/components/nutrak/form";
import { goBackOr } from "@/components/nutrak/onboarding-layout";
import { COLORS } from "@/constants/nutrak";
import { isValidIndianMobile } from "@/lib/onboarding-flow";
import { useOnboarding } from "@/store/onboarding";

type LegalDoc = "privacy" | "consent";

const LEGAL_TEXT: Record<LegalDoc, { title: string; body: string[] }> = {
  privacy: {
    title: "Privacy Policy",
    body: [
      "Nutrak collects the information you enter about your child — such as name, age, gender, height, weight, diet, health conditions and symptoms — only to provide nutrition assessment and personalised guidance.",
      "Your parent/guardian mobile number is used to verify your identity and record your consent.",
      "We do not sell your child's personal information. Data is shared only where required by law or where necessary to provide the requested service under applicable agreements.",
      "You may request access to, correction of, or deletion of your child's data at any time from the app settings or by contacting support.",
    ],
  },
  consent: {
    title: "Consent Declaration",
    body: [
      "I confirm that I am the parent or legal guardian of the child whose information I will provide.",
      "I give Nutrak permission to collect and process this information for nutrition assessment, personalised nutrition guidance, recommendations and health-related results.",
      "I understand that Nutrak's guidance does not replace advice from a qualified doctor or paediatrician.",
      "I can withdraw this consent at any time, subject to applicable legal requirements. Withdrawing consent will stop further processing of my child's data.",
    ],
  },
};

const FLOATING_ICONS: {
  name: keyof typeof MaterialCommunityIcons.glyphMap;
  top: string;
  left: string;
}[] = [
  { name: "food-apple-outline", top: "30%", left: "10%" },
  { name: "heart-pulse", top: "8%", left: "28%" },
  { name: "bowl-mix-outline", top: "10%", left: "62%" },
  { name: "shield-plus-outline", top: "30%", left: "80%" },
  { name: "carrot", top: "62%", left: "4%" },
  { name: "water-outline", top: "74%", left: "26%" },
  { name: "sprout-outline", top: "70%", left: "64%" },
  { name: "human-male-height", top: "60%", left: "86%" },
];

export default function ConsentScreen() {
  const { phone: savedPhone, lastPhone, giveConsent } = useOnboarding();
  const [phone, setPhone] = useState(savedPhone ?? lastPhone ?? "");
  const [agreed, setAgreed] = useState(false);
  const [touched, setTouched] = useState(false);
  const [doc, setDoc] = useState<LegalDoc | null>(null);
  const [sending, setSending] = useState(false);

  const validPhone = isValidIndianMobile(phone);
  const canSubmit = validPhone && agreed && !sending;
  const phoneError =
    touched && phone.length > 0 && !validPhone
      ? "Enter a valid 10-digit Indian mobile number"
      : null;

  const submit = () => {
    setTouched(true);
    if (!canSubmit) return;
    setSending(true);
    giveConsent(phone);
    // Simulates the SMS request; the OTP is hardcoded for now.
    setTimeout(() => {
      setSending(false);
      router.push("/auth/otp");
    }, 600);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.topBar}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={12}
            onPress={() => goBackOr("/")}
          >
            <Ionicons name="chevron-back" size={28} color={COLORS.text} />
          </Pressable>
          <View style={styles.topTrack}>
            <View style={[styles.topFill, { width: "20%" }]} />
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.hero} accessible={false}>
            <View style={styles.glowOuter} />
            <View style={styles.glowInner} />
            {FLOATING_ICONS.map((icon) => (
              <MaterialCommunityIcons
                key={icon.name}
                name={icon.name}
                size={30}
                color={COLORS.darkGreen}
                style={[
                  styles.floatingIcon,
                  { top: icon.top as `${number}%`, left: icon.left as `${number}%` },
                ]}
              />
            ))}
            <View style={styles.face}>
              <MaterialCommunityIcons
                name="face-woman-shimmer-outline"
                size={54}
                color={COLORS.darkGreen}
              />
            </View>
          </View>

          <Text style={styles.title} accessibilityRole="header">
            We need your consent for your child
          </Text>

          <Text style={styles.lead}>
            Before you proceed, we need a parent/guardian’s consent:
          </Text>

          <Text style={styles.paragraph}>
            I am the parent/legal guardian of this child and give Nutrak
            permission to collect and process my child’s information to provide
            nutrition assessment, personalized nutrition guidance,
            recommendations, and health-related results.
          </Text>

          <Text style={styles.paragraph}>
            I understand that Nutrak will process the information only for
            providing these services and as described in the{" "}
            <Text style={styles.link} onPress={() => setDoc("privacy")}>
              Privacy Policy
            </Text>{" "}
            and{" "}
            <Text style={styles.link} onPress={() => setDoc("consent")}>
              Consent Declaration
            </Text>
            .
          </Text>

          <Text style={styles.paragraph}>
            Nutrak does not sell or share my child’s personal information with
            third parties, except where required by law or as necessary to
            provide the requested service under applicable agreements.
          </Text>

          <Text style={styles.paragraph}>
            I can withdraw my consent at any time, subject to applicable legal
            requirements.
          </Text>

          <Text style={styles.privacy}>
            <Text style={styles.privacyBold}>Privacy & security: </Text>
            Nutrak applies appropriate safeguards to protect personal
            information and is designed to support applicable privacy
            requirements, including HIPAA requirements where HIPAA applies.
            HIPAA may not apply to every Nutrak user or service.
          </Text>

          <Pressable
            accessibilityRole="checkbox"
            accessibilityState={{ checked: agreed }}
            onPress={() => setAgreed((v) => !v)}
            style={styles.agreeRow}
          >
            <View style={[styles.checkbox, agreed && styles.checkboxOn]}>
              {agreed && <Ionicons name="checkmark" size={16} color={COLORS.white} />}
            </View>
            <Text style={styles.agreeText}>
              I am the parent/legal guardian and I agree to the above.
            </Text>
          </Pressable>

          <TextField
            label="Parent/Guardian mobile number"
            icon="phone-portrait-outline"
            placeholder="Enter mobile number"
            keyboardType="number-pad"
            textContentType="telephoneNumber"
            autoComplete="tel"
            maxLength={10}
            value={phone}
            onChangeText={(text) => setPhone(text.replace(/\D/g, ""))}
            onBlur={() => setTouched(true)}
            onSubmitEditing={submit}
            error={phoneError}
            hint="We’ll send an OTP to confirm your consent."
            prefix="+91"
          />
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: !canSubmit, busy: sending }}
            disabled={!canSubmit}
            onPress={submit}
            style={({ pressed }) => [
              styles.otpButton,
              !canSubmit && styles.otpButtonDisabled,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.otpButtonText}>
              {sending ? "SENDING OTP…" : "SEND OTP & CONTINUE"}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>

      <Modal
        visible={doc != null}
        animationType="slide"
        transparent
        onRequestClose={() => setDoc(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{doc && LEGAL_TEXT[doc].title}</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close"
                hitSlop={12}
                onPress={() => setDoc(null)}
              >
                <Ionicons name="close" size={26} color={COLORS.text} />
              </Pressable>
            </View>
            <ScrollView contentContainerStyle={styles.modalBody}>
              {doc &&
                LEGAL_TEXT[doc].body.map((p) => (
                  <Text key={p} style={styles.paragraph}>
                    {p}
                  </Text>
                ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FAF8F2",
  },
  flex: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  topTrack: {
    flex: 1,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#D9E0DB",
    overflow: "hidden",
  },
  topFill: {
    height: "100%",
    backgroundColor: "#2E6B5A",
    borderRadius: 3,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  hero: {
    height: 210,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  glowOuter: {
    position: "absolute",
    width: 300,
    height: 200,
    borderRadius: 150,
    backgroundColor: "#EEF9C8",
    opacity: 0.8,
  },
  glowInner: {
    position: "absolute",
    width: 150,
    height: 130,
    borderRadius: 75,
    backgroundColor: "#E2F78C",
    opacity: 0.85,
  },
  face: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "#FBD9B8",
    borderWidth: 3,
    borderColor: COLORS.darkGreen,
    alignItems: "center",
    justifyContent: "center",
  },
  floatingIcon: {
    position: "absolute",
  },
  title: {
    color: "#111",
    fontSize: 30,
    lineHeight: 35,
    fontWeight: "900",
    letterSpacing: -0.8,
    marginBottom: 12,
  },
  lead: {
    color: "#111",
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 10,
  },
  paragraph: {
    color: "#2B2F2C",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  link: {
    color: "#2B2F2C",
    textDecorationLine: "underline",
    fontWeight: "600",
  },
  privacy: {
    color: "#6B726D",
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 14,
  },
  privacyBold: {
    fontWeight: "800",
  },
  agreeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: COLORS.green,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
  },
  checkboxOn: {
    backgroundColor: COLORS.green,
  },
  agreeText: {
    flex: 1,
    color: "#2B2F2C",
    fontSize: 13,
    fontWeight: "600",
  },
  footer: {
    paddingHorizontal: 22,
    paddingTop: 8,
    paddingBottom: 12,
  },
  otpButton: {
    minHeight: 52,
    borderRadius: 14,
    backgroundColor: "#5EDB6B",
    alignItems: "center",
    justifyContent: "center",
  },
  otpButtonDisabled: {
    backgroundColor: "#B9EDBE",
  },
  otpButtonText: {
    color: "#123B22",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 1,
  },
  pressed: {
    opacity: 0.85,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  modalSheet: {
    maxHeight: "80%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: COLORS.white,
    paddingBottom: 24,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
  },
  modalBody: {
    padding: 20,
  },
});
