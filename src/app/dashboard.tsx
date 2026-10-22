import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Redirect, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CalorieGauge } from "@/components/nutrak/calorie-gauge";
import { NutrakLogo } from "@/components/nutrak/nutrak-logo";
import { foodsFor } from "@/constants/foods";
import { DIET_LABEL, GOAL_LABEL } from "@/constants/labels";
import { COLORS, IMAGES } from "@/constants/nutrak";
import { confirmAction, showMessage } from "@/lib/dialog";
import { buildNutritionPlan, dateKey, formatAge } from "@/lib/nutrition";
import { formatPhone, resumeRoute } from "@/lib/onboarding-flow";
import { useOnboarding, type MealType } from "@/store/onboarding";

const MEALS: { key: MealType; label: string; image: ImageSourcePropType }[] = [
  { key: "breakfast", label: "Breakfast", image: IMAGES.breakfast },
  { key: "lunch", label: "Lunch", image: IMAGES.lunch },
  { key: "dinner", label: "Dinner", image: IMAGES.dinner },
  { key: "snack", label: "Snack", image: IMAGES.snack },
];

function mealForNow(): MealType {
  const hour = new Date().getHours();
  if (hour < 11) return "breakfast";
  if (hour < 16) return "lunch";
  if (hour < 18) return "snack";
  return "dinner";
}

function formatDay(date: Date) {
  const today = new Date();
  const label = date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
  if (dateKey(date) === dateKey(today)) return `Today, ${label}`;
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (dateKey(date) === dateKey(yesterday)) return `Yesterday, ${label}`;
  return date.toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short" });
}

export default function DashboardScreen() {
  const {
    isOnboarded,
    child,
    phone,
    foodLog,
    addFood,
    removeFood,
    logout,
    deleteChildData,
  } = useOnboarding();
  const [date, setDate] = useState(() => new Date());
  const [addingTo, setAddingTo] = useState<MealType | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  if (!isOnboarded) {
    return <Redirect href={loggingOut ? "/" : resumeRoute(child, false)} />;
  }

  const plan = buildNutritionPlan(child);
  if (!plan) return <Redirect href={resumeRoute(child, false)} />;

  const key = dateKey(date);
  const isToday = key === dateKey(new Date());
  const entries = foodLog[key] ?? [];
  const totals = entries.reduce(
    (acc, e) => ({
      kcal: acc.kcal + e.kcal,
      carbs: acc.carbs + e.carbs,
      protein: acc.protein + e.protein,
      fat: acc.fat + e.fat,
    }),
    { kcal: 0, carbs: 0, protein: 0, fat: 0 },
  );
  const burned = 0;
  const remaining = plan.calories - totals.kcal + burned;

  const shiftDay = (days: number) => {
    const next = new Date(date);
    next.setDate(date.getDate() + days);
    setDate(next);
  };

  const comingSoon = (feature: string) =>
    showMessage(feature, "This section is coming soon.");

  const confirmLogout = () => {
    setSettingsOpen(false);
    confirmAction({
      title: "Log out?",
      message: `${child.name}’s profile stays saved on this device. Log in with the same mobile number to continue.`,
      confirmLabel: "Log out",
      onConfirm: () => {
        if (router.canDismiss()) router.dismissAll();
        setLoggingOut(true);
        logout();
      },
    });
  };

  const confirmDelete = () => {
    setSettingsOpen(false);
    confirmAction({
      title: "Delete child data?",
      message: `This permanently removes ${child.name}’s profile and food log from this device.`,
      confirmLabel: "Delete",
      destructive: true,
      onConfirm: () => {
        if (router.canDismiss()) router.dismissAll();
        setLoggingOut(true);
        deleteChildData();
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar style="dark" />
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={["#DDF1CC", "#E9F6DE", "#F7FAF1"]}
          style={styles.hero}
        >
          <View pointerEvents="none" style={[styles.leaf, styles.leafA]} />
          <View pointerEvents="none" style={[styles.leaf, styles.leafB]} />
          <View pointerEvents="none" style={[styles.leaf, styles.leafC]} />
          <View pointerEvents="none" style={[styles.leaf, styles.leafD]} />

          <View style={styles.topRow}>
            <NutrakLogo size={38} tagline="Healthy Choices ♥ Happier You" />
            <View style={styles.topIcons}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Notifications"
                hitSlop={8}
                onPress={() => comingSoon("Notifications")}
              >
                <Ionicons name="notifications-outline" size={26} color={COLORS.darkGreen} />
                <View style={styles.badgeDot} />
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Settings"
                hitSlop={8}
                onPress={() => setSettingsOpen(true)}
              >
                <Ionicons name="settings-outline" size={26} color={COLORS.darkGreen} />
              </Pressable>
            </View>
          </View>

          <Text style={styles.childLine}>
            Tracking for <Text style={styles.childName}>{child.name}</Text> ·{" "}
            {formatAge(child.age)}
          </Text>

          <View style={styles.dateRow}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Previous day"
              hitSlop={10}
              onPress={() => shiftDay(-1)}
            >
              <Ionicons name="chevron-back" size={22} color={COLORS.darkGreen} />
            </Pressable>
            <View style={styles.dateLabel}>
              <Ionicons name="calendar" size={16} color={COLORS.darkGreen} />
              <Text style={styles.dateText}>{formatDay(date)}</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Next day"
              accessibilityState={{ disabled: isToday }}
              disabled={isToday}
              hitSlop={10}
              onPress={() => shiftDay(1)}
            >
              <Ionicons
                name="chevron-forward"
                size={22}
                color={isToday ? "#B5C9B9" : COLORS.darkGreen}
              />
            </Pressable>
          </View>

          <View style={styles.gaugeRow}>
            <SideStat icon="silverware-fork-knife" label="Consumed" value={totals.kcal} />
            <CalorieGauge size={190} remaining={remaining} goal={plan.calories} />
            <SideStat icon="fire" label="Burned" value={burned} />
          </View>
        </LinearGradient>

        <View style={styles.body}>
          <View style={styles.macros}>
            <MacroCard label="Carbs" icon="barley" value={totals.carbs} goal={plan.carbsG} accent="#E8505B" bg="#FDECEF" />
            <MacroCard label="Protein" icon="food-steak" value={totals.protein} goal={plan.proteinG} accent="#8E5BD0" bg="#F1EAFB" />
            <MacroCard label="Fat" icon="water-outline" value={totals.fat} goal={plan.fatG} accent="#E5A00D" bg="#FDF5E1" />
          </View>

          <SectionHeader icon="leaf" title="MEALS LOGGED" />
          <View style={styles.meals}>
            {MEALS.map((meal) => {
              const logged = entries.filter((e) => e.meal === meal.key);
              const kcal = logged.reduce((sum, e) => sum + e.kcal, 0);
              const [lo, hi] = plan.meals[meal.key];
              return (
                <Pressable
                  key={meal.key}
                  accessibilityRole="button"
                  accessibilityLabel={`Add food to ${meal.label}`}
                  onPress={() => setAddingTo(meal.key)}
                  style={styles.mealCard}
                >
                  <Image source={meal.image} style={styles.mealImage} resizeMode="contain" />
                  <View style={styles.flex}>
                    <Text style={styles.mealTitle}>{meal.label}</Text>
                    <Text style={styles.mealSub} numberOfLines={1}>
                      {logged.length > 0
                        ? `${kcal} kcal · ${logged.map((e) => e.name).join(", ")}`
                        : `Recommended: ${lo === hi ? lo : `${lo} - ${hi}`} kcal`}
                    </Text>
                  </View>
                  <View style={styles.plus}>
                    <Ionicons name="add" size={24} color="#6B4FA0" />
                  </View>
                </Pressable>
              );
            })}
          </View>

          <SectionHeader icon="run" title="ACTIVITY" />
          <View style={styles.activity}>
            <ActivityStat icon="shoe-sneaker" value="0" label="Steps" />
            <ActivityStat icon="signal-cellular-3" value="0" label="Active Minutes" />
            <ActivityStat icon="fire" value={String(burned)} label="Calories Burned" />
            <ActivityStat icon="bullseye-arrow" value="0%" label="Daily Goal" />
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={() => router.push("/onboarding/summary")}
            style={styles.planBanner}
          >
            <Image source={IMAGES.mealPlan} style={styles.planImage} resizeMode="cover" />
          </Pressable>
        </View>
      </ScrollView>

      <SafeAreaView edges={["bottom"]} style={styles.tabBar}>
        <TabItem icon="home" label="Dashboard" active onPress={() => {}} />
        <TabItem icon="chart-bar" label="Progress" onPress={() => comingSoon("Progress")} />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Log food"
          onPress={() => setAddingTo(mealForNow())}
          style={styles.fab}
        >
          <Ionicons name="add" size={34} color={COLORS.white} />
        </Pressable>
        <TabItem icon="dumbbell" label="Programs" onPress={() => comingSoon("Programs")} />
        <TabItem icon="book-open-page-variant-outline" label="Recipes" onPress={() => comingSoon("Recipes")} />
      </SafeAreaView>

      <AddFoodSheet
        meal={addingTo}
        onChangeMeal={setAddingTo}
        onClose={() => setAddingTo(null)}
        entries={entries}
        diet={child.diet}
        onAdd={(food) => addingTo && addFood(key, { meal: addingTo, ...food })}
        onRemove={(id) => removeFood(key, id)}
      />

      <Modal
        visible={settingsOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setSettingsOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setSettingsOpen(false)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <View style={styles.sheetHandle} />
            <View style={styles.profileHead}>
              <Image
                source={child.gender === "girl" ? IMAGES.girl : IMAGES.boy}
                style={styles.profileAvatar}
                resizeMode="contain"
              />
              <View style={styles.flex}>
                <Text style={styles.sheetTitle}>{child.name}</Text>
                <Text style={styles.sheetSub}>
                  {formatAge(child.age)} · {child.heightCm} cm · {child.weightKg} kg
                </Text>
                <Text style={styles.sheetSub}>
                  {child.diet ? DIET_LABEL[child.diet] : ""}
                  {child.goal ? ` · ${GOAL_LABEL[child.goal]}` : ""}
                </Text>
              </View>
            </View>
            <Text style={styles.sheetSub}>
              Parent mobile: {phone ? formatPhone(phone) : "—"} (verified)
            </Text>
            <SheetButton
              icon="create-outline"
              label="View or edit child profile"
              onPress={() => {
                setSettingsOpen(false);
                router.push("/onboarding/summary");
              }}
            />
            <SheetButton
              icon="pulse-outline"
              label="Retake symptom check"
              onPress={() => {
                setSettingsOpen(false);
                router.push("/onboarding/symptoms");
              }}
            />
            <SheetButton icon="log-out-outline" label="Log out" onPress={confirmLogout} />
            <SheetButton
              icon="trash-outline"
              label="Delete child data from this device"
              danger
              onPress={confirmDelete}
            />
            <View style={styles.storageNote}>
              <Ionicons name="phone-portrait-outline" size={16} color={COLORS.mutedGreen} />
              <Text style={styles.storageNoteText}>
                Profile and food log are saved on this device. Log in again with the same mobile
                number to continue where you left off.
              </Text>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

function SideStat({
  icon,
  label,
  value,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  value: number;
}) {
  return (
    <View style={styles.sideStat}>
      <View style={styles.sideIcon}>
        <MaterialCommunityIcons name={icon} size={20} color={COLORS.darkGreen} />
      </View>
      <Text style={styles.sideLabel}>{label}</Text>
      <Text style={styles.sideValue}>{value}</Text>
      <Text style={styles.sideUnit}>kcal</Text>
    </View>
  );
}

function MacroCard({
  label,
  icon,
  value,
  goal,
  accent,
  bg,
}: {
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  value: number;
  goal: number;
  accent: string;
  bg: string;
}) {
  const pct = goal > 0 ? Math.round((value / goal) * 100) : 0;
  return (
    <View style={[styles.macroCard, { backgroundColor: bg }]}>
      <View style={styles.macroHead}>
        <View style={[styles.macroIcon, { backgroundColor: `${accent}22` }]}>
          <MaterialCommunityIcons name={icon} size={16} color={accent} />
        </View>
        <View style={styles.flex}>
          <Text style={styles.macroLabel}>{label}</Text>
          <Text style={styles.macroValue}>
            {value} / {goal}g
          </Text>
        </View>
      </View>
      <View style={styles.bar}>
        <View
          style={[
            styles.barFill,
            { width: `${Math.min(100, pct)}%`, backgroundColor: accent },
          ]}
        />
      </View>
      <Text style={styles.macroPct}>{pct}%</Text>
    </View>
  );
}

function SectionHeader({
  icon,
  title,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
}) {
  return (
    <View style={styles.sectionHeader}>
      <MaterialCommunityIcons name={icon} size={18} color={COLORS.brightGreen} />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

function ActivityStat({
  icon,
  value,
  label,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  value: string;
  label: string;
}) {
  return (
    <View style={styles.activityStat}>
      <MaterialCommunityIcons name={icon} size={24} color="#6B4FA0" />
      <Text style={styles.activityValue}>{value}</Text>
      <Text style={styles.activityLabel}>{label}</Text>
    </View>
  );
}

function TabItem({
  icon,
  label,
  active,
  onPress,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  active?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={styles.tab}
    >
      <MaterialCommunityIcons
        name={icon}
        size={24}
        color={active ? COLORS.darkGreen : "#8A6FB5"}
      />
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text>
    </Pressable>
  );
}

function SheetButton({
  icon,
  label,
  onPress,
  danger,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.sheetButton}>
      <Ionicons name={icon} size={20} color={danger ? COLORS.error : COLORS.green} />
      <Text style={[styles.sheetButtonText, danger && { color: COLORS.error }]}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color="#B5C0B8" />
    </Pressable>
  );
}

function AddFoodSheet({
  meal,
  onChangeMeal,
  onClose,
  entries,
  diet,
  onAdd,
  onRemove,
}: {
  meal: MealType | null;
  onChangeMeal: (meal: MealType) => void;
  onClose: () => void;
  entries: ReturnType<typeof useOnboarding>["foodLog"][string];
  diet: ReturnType<typeof useOnboarding>["child"]["diet"];
  onAdd: (food: { name: string; kcal: number; carbs: number; protein: number; fat: number }) => void;
  onRemove: (id: string) => void;
}) {
  const logged = meal ? entries.filter((e) => e.meal === meal) : [];

  return (
    <Modal visible={meal != null} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={[styles.sheet, styles.foodSheet]} onPress={() => {}}>
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>Log food</Text>
          <View style={styles.mealTabs}>
            {MEALS.map((m) => (
              <Pressable
                key={m.key}
                accessibilityRole="tab"
                accessibilityState={{ selected: meal === m.key }}
                onPress={() => onChangeMeal(m.key)}
                style={[styles.mealTab, meal === m.key && styles.mealTabActive]}
              >
                <Text style={[styles.mealTabText, meal === m.key && styles.mealTabTextActive]}>
                  {m.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <ScrollView style={styles.foodList} contentContainerStyle={{ gap: 8 }}>
            {logged.length > 0 && (
              <>
                <Text style={styles.foodGroup}>Logged</Text>
                {logged.map((e) => (
                  <View key={e.id} style={[styles.foodRow, styles.foodRowLogged]}>
                    <View style={styles.flex}>
                      <Text style={styles.foodName}>{e.name}</Text>
                      <Text style={styles.foodMeta}>
                        {e.kcal} kcal · C {e.carbs}g · P {e.protein}g · F {e.fat}g
                      </Text>
                    </View>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`Remove ${e.name}`}
                      hitSlop={8}
                      onPress={() => onRemove(e.id)}
                    >
                      <Ionicons name="trash-outline" size={20} color={COLORS.error} />
                    </Pressable>
                  </View>
                ))}
              </>
            )}
            <Text style={styles.foodGroup}>
              Suggestions{diet ? ` · ${DIET_LABEL[diet]}` : ""}
            </Text>
            {meal &&
              foodsFor(meal, diet).map((food) => (
                <Pressable
                  key={food.name}
                  accessibilityRole="button"
                  accessibilityLabel={`Add ${food.name}, ${food.kcal} kilocalories`}
                  onPress={() => onAdd(food)}
                  style={({ pressed }) => [styles.foodRow, pressed && { opacity: 0.8 }]}
                >
                  <View style={styles.flex}>
                    <Text style={styles.foodName}>{food.name}</Text>
                    <Text style={styles.foodMeta}>
                      {food.portion} · {food.kcal} kcal · P {food.protein}g
                    </Text>
                  </View>
                  <Ionicons name="add-circle" size={28} color={COLORS.green} />
                </Pressable>
              ))}
          </ScrollView>

          <Pressable accessibilityRole="button" onPress={onClose} style={styles.doneButton}>
            <Text style={styles.doneText}>Done</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#E3F3D6",
  },
  flex: {
    flex: 1,
  },
  scroll: {
    backgroundColor: "#F8F5FB",
    paddingBottom: 24,
  },
  hero: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 14,
    overflow: "hidden",
  },
  leaf: {
    position: "absolute",
    width: 26,
    height: 54,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 2,
    backgroundColor: "#9CD47F",
    opacity: 0.55,
  },
  leafA: { left: -6, top: 150, transform: [{ rotate: "-30deg" }] },
  leafB: { left: 14, top: 220, transform: [{ rotate: "25deg" }, { scale: 0.8 }] },
  leafC: { right: -6, top: 140, transform: [{ rotate: "30deg" }] },
  leafD: { right: 16, top: 230, transform: [{ rotate: "-25deg" }, { scale: 0.8 }] },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  topIcons: {
    flexDirection: "row",
    gap: 18,
  },
  badgeDot: {
    position: "absolute",
    top: 1,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#F2557A",
  },
  childLine: {
    marginTop: 6,
    color: COLORS.textGreen,
    fontSize: 13,
  },
  childName: {
    fontWeight: "800",
    color: COLORS.darkGreen,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
    marginTop: 10,
  },
  dateLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dateText: {
    color: COLORS.darkGreen,
    fontSize: 16,
    fontWeight: "700",
  },
  gaugeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
  },
  sideStat: {
    flex: 1,
    alignItems: "center",
  },
  sideIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.75)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  sideLabel: {
    color: COLORS.darkGreen,
    fontSize: 14,
    fontWeight: "600",
  },
  sideValue: {
    color: COLORS.darkGreen,
    fontSize: 26,
    fontWeight: "900",
  },
  sideUnit: {
    color: COLORS.darkGreen,
    fontSize: 13,
  },
  body: {
    paddingHorizontal: 14,
    paddingTop: 14,
    gap: 12,
  },
  macros: {
    flexDirection: "row",
    gap: 8,
  },
  macroCard: {
    flex: 1,
    padding: 10,
    borderRadius: 14,
    gap: 8,
  },
  macroHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  macroIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  macroLabel: {
    color: "#3A2A55",
    fontSize: 13,
    fontWeight: "600",
  },
  macroValue: {
    color: "#3A2A55",
    fontSize: 12,
    fontWeight: "700",
  },
  bar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(0,0,0,0.07)",
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 3,
  },
  macroPct: {
    alignSelf: "flex-end",
    color: "#55616D",
    fontSize: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  sectionTitle: {
    color: "#2E2347",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.6,
  },
  meals: {
    gap: 8,
  },
  mealCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 10,
    borderRadius: 16,
    backgroundColor: "#EFE8F8",
  },
  mealImage: {
    width: 72,
    height: 52,
  },
  mealTitle: {
    color: "#3A2470",
    fontSize: 17,
    fontWeight: "700",
  },
  mealSub: {
    color: "#5D5170",
    fontSize: 13,
    marginTop: 2,
  },
  plus: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E2D6F3",
    alignItems: "center",
    justifyContent: "center",
  },
  activity: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 16,
    backgroundColor: "#EFE8F8",
  },
  activityStat: {
    flex: 1,
    alignItems: "center",
    gap: 2,
  },
  activityValue: {
    color: "#2E2347",
    fontSize: 17,
    fontWeight: "800",
  },
  activityLabel: {
    color: "#5D5170",
    fontSize: 11,
    textAlign: "center",
  },
  planBanner: {
    borderRadius: 18,
    overflow: "hidden",
  },
  planImage: {
    width: "100%",
    height: undefined,
    aspectRatio: 563 / 226,
  },
  tabBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: 8,
    paddingHorizontal: 6,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    gap: 2,
    paddingBottom: 6,
  },
  tabLabel: {
    color: "#8A6FB5",
    fontSize: 12,
  },
  tabLabelActive: {
    color: COLORS.darkGreen,
    fontWeight: "800",
  },
  fab: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#3D9B34",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -26,
    borderWidth: 4,
    borderColor: COLORS.white,
  },
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  sheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 34,
    gap: 12,
  },
  foodSheet: {
    maxHeight: "85%",
  },
  sheetHandle: {
    alignSelf: "center",
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#DDD",
  },
  sheetTitle: {
    color: COLORS.darkGreen,
    fontSize: 20,
    fontWeight: "900",
  },
  sheetSub: {
    color: COLORS.mutedGreen,
    fontSize: 13,
  },
  profileHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  profileAvatar: {
    width: 60,
    height: 70,
  },
  sheetButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  sheetButtonText: {
    flex: 1,
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "700",
  },
  storageNote: {
    flexDirection: "row",
    gap: 8,
    marginTop: 6,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#F2F8EF",
  },
  storageNoteText: {
    flex: 1,
    color: COLORS.mutedGreen,
    fontSize: 12,
    lineHeight: 17,
  },
  mealTabs: {
    flexDirection: "row",
    gap: 6,
  },
  mealTab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 999,
    alignItems: "center",
    backgroundColor: "#F1F4EF",
  },
  mealTabActive: {
    backgroundColor: COLORS.green,
  },
  mealTabText: {
    color: COLORS.textGreen,
    fontSize: 12,
    fontWeight: "700",
  },
  mealTabTextActive: {
    color: COLORS.white,
  },
  foodList: {
    flexGrow: 0,
  },
  foodGroup: {
    color: COLORS.mutedGreen,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.5,
    marginTop: 4,
  },
  foodRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: 14,
    backgroundColor: "#F6FAF3",
  },
  foodRowLogged: {
    backgroundColor: "#EAF6E5",
  },
  foodName: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "700",
  },
  foodMeta: {
    color: COLORS.mutedGreen,
    fontSize: 12,
    marginTop: 2,
  },
  doneButton: {
    minHeight: 48,
    borderRadius: 999,
    backgroundColor: COLORS.green,
    alignItems: "center",
    justifyContent: "center",
  },
  doneText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "800",
  },
});
