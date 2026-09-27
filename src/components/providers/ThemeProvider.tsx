"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import {
  applyTheme,
  getPreferenceSnapshot,
  getServerPreferenceSnapshot,
  getServerSystemSnapshot,
  getSystemSnapshot,
  resolveTheme,
  storePreference,
  subscribePreference,
  subscribeSystem,
  type ResolvedTheme,
  type ThemePreference,
} from "@/lib/theme";

type ThemeStore = {
  preference: ThemePreference;
  resolved: ResolvedTheme;
  setPreference: (preference: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeStore | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const preference = useSyncExternalStore(
    subscribePreference,
    getPreferenceSnapshot,
    getServerPreferenceSnapshot,
  );

  const systemPrefersDark = useSyncExternalStore(
    subscribeSystem,
    getSystemSnapshot,
    getServerSystemSnapshot,
  );

  const resolved = resolveTheme(preference, systemPrefersDark);

  useEffect(() => {
    applyTheme(resolved);
  }, [resolved]);

  const setPreference = useCallback((next: ThemePreference) => {
    storePreference(next);
  }, []);

  return (
    <ThemeContext.Provider value={{ preference, resolved, setPreference }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeStore {
  const store = useContext(ThemeContext);
  if (!store) throw new Error("useTheme must be used inside <ThemeProvider>.");
  return store;
}
