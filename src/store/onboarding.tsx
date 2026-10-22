import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  EMPTY_SESSION,
  deleteAccount,
  loadAccount,
  loadSession,
  saveAccount,
  saveSession,
  type Account,
  type Session,
} from "@/lib/local-db";

export type Gender = "boy" | "girl";
export type Relationship = "mother" | "father" | "guardian" | "other";
export type Diet =
  | "vegetarian"
  | "eggetarian"
  | "non_vegetarian"
  | "vegan"
  | "jain";
export type Activity = "sedentary" | "low" | "active" | "very_active";
export type Condition =
  | "food_allergy"
  | "asthma"
  | "digestive"
  | "chronic"
  | "skin"
  | "medication"
  | "none";
export type Goal =
  | "healthy_growth"
  | "weight_gain"
  | "weight_management"
  | "immunity"
  | "focus"
  | "picky_eating";
export type SymptomId =
  | "tiredness"
  | "infections"
  | "appetite"
  | "slow_growth"
  | "pale_skin"
  | "stomach"
  | "hair_fall"
  | "bone_pain"
  | "focus"
  | "weight_loss";
export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export type AgeInput =
  | { mode: "dob"; dob: string }
  | { mode: "age"; years: number; months: number };

export type ChildProfile = {
  name: string;
  relationship: Relationship | null;
  heightCm: number | null;
  weightKg: number | null;
  age: AgeInput | null;
  gender: Gender | null;
  diet: Diet | null;
  activity: Activity | null;
  conditions: Condition[];
  conditionNotes: string;
  goal: Goal | null;
  symptoms: SymptomId[];
};

export type FoodLogEntry = {
  id: string;
  meal: MealType;
  name: string;
  kcal: number;
  carbs: number;
  protein: number;
  fat: number;
};

type AccountData = {
  completedAt: string | null;
  child: ChildProfile;
  foodLog: Record<string, FoodLogEntry[]>;
};

type PersistedState = Session & AccountData;

const EMPTY_CHILD: ChildProfile = {
  name: "",
  relationship: null,
  heightCm: null,
  weightKg: null,
  age: null,
  gender: null,
  diet: null,
  activity: null,
  conditions: [],
  conditionNotes: "",
  goal: null,
  symptoms: [],
};

const EMPTY_ACCOUNT: AccountData = {
  completedAt: null,
  child: EMPTY_CHILD,
  foodLog: {},
};

const INITIAL_STATE: PersistedState = { ...EMPTY_SESSION, ...EMPTY_ACCOUNT };

function toAccountData(account: Account | null): AccountData {
  if (!account) return EMPTY_ACCOUNT;
  return {
    completedAt: account.completedAt ?? null,
    child: { ...EMPTY_CHILD, ...account.child },
    foodLog: account.foodLog ?? {},
  };
}

type OnboardingContextValue = PersistedState & {
  hydrated: boolean;
  isLoggedIn: boolean;
  isOnboarded: boolean;
  giveConsent: (phone: string) => void;
  verifyPhone: () => Promise<void>;
  updateChild: (patch: Partial<ChildProfile>) => void;
  completeOnboarding: () => void;
  addFood: (dateKey: string, entry: Omit<FoodLogEntry, "id">) => void;
  removeFood: (dateKey: string, id: string) => void;
  logout: () => void;
  deleteChildData: () => Promise<void>;
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(INITIAL_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      const session = await loadSession();
      const account =
        session.phone && session.verifiedAt ? await loadAccount(session.phone) : null;
      setState({ ...session, ...toAccountData(account) });
    })()
      .catch(() => {})
      .finally(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const { phone, consentAt, verifiedAt, lastPhone, completedAt, child, foodLog } = state;
    saveSession({ phone, consentAt, verifiedAt, lastPhone });
    if (phone && verifiedAt) {
      saveAccount({
        phone,
        consentAt,
        completedAt,
        child,
        foodLog,
        updatedAt: new Date().toISOString(),
      });
    }
  }, [state, hydrated]);

  const giveConsent = useCallback((phone: string) => {
    setState((s) => {
      const consentAt = new Date().toISOString();
      if (s.phone === phone) return { ...s, consentAt };
      return { ...s, ...EMPTY_ACCOUNT, phone, consentAt, verifiedAt: null };
    });
  }, []);

  const phone = state.phone;
  const verifyPhone = useCallback(async () => {
    if (!phone) return;
    const account = await loadAccount(phone);
    setState((s) =>
      s.phone === phone
        ? {
            ...s,
            ...toAccountData(account),
            verifiedAt: new Date().toISOString(),
            lastPhone: phone,
          }
        : s,
    );
  }, [phone]);

  const updateChild = useCallback((patch: Partial<ChildProfile>) => {
    setState((s) => ({ ...s, child: { ...s.child, ...patch } }));
  }, []);

  const completeOnboarding = useCallback(() => {
    setState((s) => ({ ...s, completedAt: new Date().toISOString() }));
  }, []);

  const addFood = useCallback(
    (dateKey: string, entry: Omit<FoodLogEntry, "id">) => {
      setState((s) => ({
        ...s,
        foodLog: {
          ...s.foodLog,
          [dateKey]: [
            ...(s.foodLog[dateKey] ?? []),
            { ...entry, id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}` },
          ],
        },
      }));
    },
    [],
  );

  const removeFood = useCallback((dateKey: string, id: string) => {
    setState((s) => ({
      ...s,
      foodLog: {
        ...s.foodLog,
        [dateKey]: (s.foodLog[dateKey] ?? []).filter((e) => e.id !== id),
      },
    }));
  }, []);

  const logout = useCallback(() => {
    setState((s) => ({ ...INITIAL_STATE, lastPhone: s.phone ?? s.lastPhone }));
  }, []);

  const deleteChildData = useCallback(async () => {
    setState(INITIAL_STATE);
    if (phone) await deleteAccount(phone);
  }, [phone]);

  const value = useMemo<OnboardingContextValue>(
    () => ({
      ...state,
      hydrated,
      isLoggedIn: Boolean(state.phone && state.verifiedAt && state.consentAt),
      isOnboarded: Boolean(state.completedAt),
      giveConsent,
      verifyPhone,
      updateChild,
      completeOnboarding,
      addFood,
      removeFood,
      logout,
      deleteChildData,
    }),
    [
      state,
      hydrated,
      giveConsent,
      verifyPhone,
      updateChild,
      completeOnboarding,
      addFood,
      removeFood,
      logout,
      deleteChildData,
    ],
  );

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) {
    throw new Error("useOnboarding must be used inside OnboardingProvider");
  }
  return ctx;
}
