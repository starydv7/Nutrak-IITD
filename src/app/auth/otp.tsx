import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Redirect, router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View, type TextInputInstance } from "react-native";

import { PrimaryButton } from "@/components/nutrak/buttons";
import { OnboardingLayout } from "@/components/nutrak/onboarding-layout";
import {
  COLORS,
  DEMO_OTP,
  OTP_LENGTH,
  OTP_RESEND_SECONDS,
} from "@/constants/nutrak";
import { formatPhone, resumeRoute } from "@/lib/onboarding-flow";
import { useOnboarding } from "@/store/onboarding";

export default function OtpScreen() {
  const { phone, child, isLoggedIn, isOnboarded, verifyPhone } = useOnboarding();
  const inputRef = useRef<TextInputInstance>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(OTP_RESEND_SECONDS);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [secondsLeft]);

  // Navigate only once the store reflects the login, so route guards pass.
  useEffect(() => {
    if (verified && isLoggedIn) {
      router.replace(resumeRoute(child, isOnboarded));
    }
  }, [verified, isLoggedIn, child, isOnboarded]);

  if (!phone) {
    return <Redirect href="/auth/consent" />;
  }

  const verify = (value = code) => {
    if (value.length !== OTP_LENGTH || verifying) return;
    setVerifying(true);
    setNotice(null);
    setTimeout(async () => {
      if (value === DEMO_OTP) {
        setError(null);
        await verifyPhone();
        setVerifying(false);
        setVerified(true);
      } else {
        setVerifying(false);
        setError("Incorrect OTP. Please try again.");
        setCode("");
        inputRef.current?.focus();
      }
    }, 500);
  };

  const onChange = (text: string) => {
    const digits = text.replace(/\D/g, "").slice(0, OTP_LENGTH);
    setCode(digits);
    if (error) setError(null);
    if (digits.length === OTP_LENGTH) verify(digits);
  };

  const resend = () => {
    setSecondsLeft(OTP_RESEND_SECONDS);
    setCode("");
    setError(null);
    setNotice(`A new OTP has been sent to ${formatPhone(phone)}`);
    inputRef.current?.focus();
  };

  return (
    <OnboardingLayout
      icon="shield-checkmark"
      badge="Verify mobile"
      title="Enter the OTP"
      description={`We sent a ${OTP_LENGTH}-digit code to ${formatPhone(phone)} to confirm your consent.`}
      illustration={
        <View style={styles.art}>
          <MaterialCommunityIcons name="cellphone-message" size={78} color={COLORS.green} />
        </View>
      }
      footer={
        <PrimaryButton
          label={verified ? "VERIFIED" : "VERIFY & CONTINUE"}
          onPress={() => verify()}
          disabled={code.length !== OTP_LENGTH || verified}
          loading={verifying}
        />
      }
    >
      <Pressable
        accessibilityLabel={`One-time password, ${code.length} of ${OTP_LENGTH} digits entered`}
        onPress={() => inputRef.current?.focus()}
        style={styles.boxes}
      >
        {Array.from({ length: OTP_LENGTH }, (_, i) => {
          const filled = i < code.length;
          const active = i === code.length && !verified;
          return (
            <View
              key={i}
              style={[
                styles.box,
                filled && styles.boxFilled,
                active && styles.boxActive,
                error && styles.boxError,
                verified && styles.boxVerified,
              ]}
            >
              <Text style={styles.digit}>{code[i] ?? ""}</Text>
            </View>
          );
        })}
        <TextInput
          ref={inputRef}
          value={code}
          onChangeText={onChange}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          autoComplete="sms-otp"
          maxLength={OTP_LENGTH}
          autoFocus
          caretHidden
          style={styles.hiddenInput}
        />
      </Pressable>

      {error ? (
        <Text style={styles.error} accessibilityLiveRegion="assertive">
          {error}
        </Text>
      ) : notice ? (
        <Text style={styles.notice} accessibilityLiveRegion="polite">
          {notice}
        </Text>
      ) : null}

      <View style={styles.resendRow}>
        <Text style={styles.resendText}>Didn’t receive the code?</Text>
        {secondsLeft > 0 ? (
          <Text style={styles.timer}>
            Resend in 0:{String(secondsLeft).padStart(2, "0")}
          </Text>
        ) : (
          <Pressable accessibilityRole="button" onPress={resend} hitSlop={8}>
            <Text style={styles.resendLink}>Resend OTP</Text>
          </Pressable>
        )}
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={() => router.replace("/auth/consent")}
        style={styles.changeRow}
      >
        <Ionicons name="create-outline" size={16} color={COLORS.green} />
        <Text style={styles.changeText}>Change mobile number</Text>
      </Pressable>

      <View style={styles.demo}>
        <Ionicons name="information-circle" size={20} color={COLORS.green} />
        <Text style={styles.demoText}>
          Demo mode: use OTP <Text style={styles.demoCode}>{DEMO_OTP}</Text>
        </Text>
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  art: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  boxes: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginTop: 6,
  },
  box: {
    flex: 1,
    aspectRatio: 0.85,
    maxWidth: 56,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },
  boxFilled: {
    borderColor: "#9ED3AE",
    backgroundColor: "#F5FBF2",
  },
  boxActive: {
    borderColor: COLORS.green,
    borderWidth: 2,
  },
  boxError: {
    borderColor: COLORS.error,
  },
  boxVerified: {
    borderColor: COLORS.green,
    backgroundColor: "#E5F6E9",
  },
  digit: {
    color: COLORS.darkGreen,
    fontSize: 24,
    fontWeight: "800",
  },
  hiddenInput: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0.011,
    color: "transparent",
  },
  error: {
    color: COLORS.error,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  notice: {
    color: COLORS.green,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  resendRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  resendText: {
    color: COLORS.mutedGreen,
    fontSize: 13,
  },
  timer: {
    color: COLORS.darkGreen,
    fontSize: 13,
    fontWeight: "700",
  },
  resendLink: {
    color: COLORS.green,
    fontSize: 13,
    fontWeight: "800",
    textDecorationLine: "underline",
  },
  changeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  changeText: {
    color: COLORS.green,
    fontSize: 13,
    fontWeight: "700",
  },
  demo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 14,
    backgroundColor: "#EAF6E5",
  },
  demoText: {
    flex: 1,
    color: COLORS.textGreen,
    fontSize: 13,
  },
  demoCode: {
    fontWeight: "900",
    color: COLORS.darkGreen,
    letterSpacing: 2,
  },
});
