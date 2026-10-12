import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';

export type AccountType = 'individual' | 'government' | 'business' | 'ngo';
export type User = {
  id: string;
  systemId: string;               // e.g. GT-48213907
  type: AccountType;
  mode: 'standard' | 'temporary';
  identifier?: string;            // IIN / BIN (standard only)
  name: string;
  password?: string;              // MOCK ONLY - plain text, replace with real auth
  verified: boolean;
  createdAt: number;
  expiresAt?: number;             // temporary accounts: createdAt + 2 years
};

const USERS_KEY = 'gt_users';
const SESSION_KEY = 'gt_session';
const TWO_YEARS = 2 * 365 * 24 * 3600 * 1000;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const genSystemId = () => 'GT-' + Math.floor(10000000 + Math.random() * 90000000);
const DEMO_IIN = '940613300127';   // passes the checksum
const DEMO_PASSWORD = 'test1234';

async function seedDemoUser() {
  const users = await loadUsers();
  if (users.some((u) => u.identifier === DEMO_IIN)) return;
  const demo: User = {
    id: 'demo-1', systemId: 'GT-00000001', type: 'individual', mode: 'standard',
    identifier: DEMO_IIN, name: 'Test User', password: DEMO_PASSWORD,
    verified: true, createdAt: Date.now(),
  };
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify([...users, demo]));
}


async function loadUsers(): Promise<User[]> {
  const raw = await AsyncStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

/** Stand-in for fingerprint scanning. Uses device biometrics; falls back to a
 *  pass in simulators without hardware. Replace with real biometric enrolment. */
export async function scanFingerprint(): Promise<boolean> {
  const hasHw = await LocalAuthentication.hasHardwareAsync();
  const enrolled = await LocalAuthentication.isEnrolledAsync();
  if (!hasHw || !enrolled) { await sleep(800); return true; }
  const res = await LocalAuthentication.authenticateAsync({ promptMessage: 'Green Titans' });
  return res.success;
}

export type ErrKey = 'errCreds' | 'errSysId' | 'errBio' | 'errExists';
type Result = { ok: true } | { ok: false; error: ErrKey };
type Ctx = {
  user: User | null; ready: boolean;
  signInStandard: (identifier: string, password: string) => Promise<Result>;
  signInTemporary: (systemId: string) => Promise<Result>;
  signUpStandard: (p: { type: AccountType; identifier: string; name: string; password: string }) => Promise<Result>;
  signUpTemporary: (p: { name: string }) => Promise<Result>;
  signOut: () => Promise<void>;
};
const AuthContext = createContext<Ctx>(null as unknown as Ctx);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      await seedDemoUser();
      const id = await AsyncStorage.getItem(SESSION_KEY);
      if (id) setUser((await loadUsers()).find((u) => u.id === id) ?? null);
      setReady(true);
    })();
  }, []);
  

  const start = async (u: User) => { await AsyncStorage.setItem(SESSION_KEY, u.id); setUser(u); };

  const value: Ctx = {
    user, ready,
    async signInStandard(identifier, password) {
      await sleep(400);
      const u = (await loadUsers()).find((x) => x.mode === 'standard' && x.identifier === identifier && x.password === password);
      if (!u) return { ok: false, error: 'errCreds' };
      await start(u); return { ok: true };
    },
    async signInTemporary(systemId) {
      const u = (await loadUsers()).find((x) => x.mode === 'temporary' && x.systemId === systemId.trim().toUpperCase());
      if (!u) return { ok: false, error: 'errSysId' };
      if (!(await scanFingerprint())) return { ok: false, error: 'errBio' };
      await start(u); return { ok: true };
    },
    async signUpStandard({ type, identifier, name, password }) {
      const users = await loadUsers();
      if (users.some((u) => u.identifier === identifier)) return { ok: false, error: 'errExists' };
      await sleep(1200); // pretend to verify through eGov / Digital ID
      const u: User = {
        id: String(Date.now()), systemId: genSystemId(), type, mode: 'standard',
        identifier, name, password, verified: true, createdAt: Date.now(),
      };
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify([...users, u]));
      await start(u); return { ok: true };
    },
    async signUpTemporary({ name }) {
      if (!(await scanFingerprint())) return { ok: false, error: 'errBio' };
      const users = await loadUsers();
      const now = Date.now();
      const u: User = {
        id: String(now), systemId: genSystemId(), type: 'individual', mode: 'temporary',
        name, verified: false, createdAt: now, expiresAt: now + TWO_YEARS,
      };
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify([...users, u]));
      await start(u); return { ok: true };
    },
    async signOut() { await AsyncStorage.removeItem(SESSION_KEY); setUser(null); },
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
