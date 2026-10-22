import AsyncStorage from "@react-native-async-storage/async-storage";

import type { ChildProfile, FoodLogEntry } from "@/store/onboarding";

// Device-local persistence (localStorage on web, app storage on Android/iOS).
// Keep this async API stable so it can later be swapped for backend calls.

export type Session = {
  phone: string | null;
  consentAt: string | null;
  verifiedAt: string | null;
  lastPhone: string | null;
};

export type Account = {
  phone: string;
  consentAt: string | null;
  completedAt: string | null;
  child: ChildProfile;
  foodLog: Record<string, FoodLogEntry[]>;
  updatedAt: string;
};

const SESSION_KEY = "nutrak:session:v2";
const ACCOUNT_PREFIX = "nutrak:account:v2:";
const LEGACY_KEY = "nutrak:onboarding:v1";

export const EMPTY_SESSION: Session = {
  phone: null,
  consentAt: null,
  verifiedAt: null,
  lastPhone: null,
};

const accountKey = (phone: string) => `${ACCOUNT_PREFIX}${phone}`;

async function readJson<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

async function writeJson(key: string, value: unknown) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

async function migrateLegacy() {
  const legacy = await readJson<{
    phone?: string | null;
    consentAt?: string | null;
    verifiedAt?: string | null;
    completedAt?: string | null;
    child?: ChildProfile;
    foodLog?: Record<string, FoodLogEntry[]>;
  }>(LEGACY_KEY);
  if (!legacy) return null;

  const session: Session = { ...EMPTY_SESSION };
  if (legacy.phone && legacy.verifiedAt && legacy.child) {
    await saveAccount({
      phone: legacy.phone,
      consentAt: legacy.consentAt ?? null,
      completedAt: legacy.completedAt ?? null,
      child: legacy.child,
      foodLog: legacy.foodLog ?? {},
      updatedAt: new Date().toISOString(),
    });
    session.phone = legacy.phone;
    session.consentAt = legacy.consentAt ?? null;
    session.verifiedAt = legacy.verifiedAt;
    session.lastPhone = legacy.phone;
  }
  await saveSession(session);
  await AsyncStorage.removeItem(LEGACY_KEY).catch(() => {});
  return session;
}

export async function loadSession(): Promise<Session> {
  const session = await readJson<Session>(SESSION_KEY);
  if (session) return { ...EMPTY_SESSION, ...session };
  return (await migrateLegacy()) ?? { ...EMPTY_SESSION };
}

export function saveSession(session: Session) {
  return writeJson(SESSION_KEY, session);
}

export function loadAccount(phone: string) {
  return readJson<Account>(accountKey(phone));
}

export function saveAccount(account: Account) {
  return writeJson(accountKey(account.phone), account);
}

export async function deleteAccount(phone: string) {
  await AsyncStorage.removeItem(accountKey(phone)).catch(() => {});
}
