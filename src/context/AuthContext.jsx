import { createContext, useContext, useState, useCallback } from "react";
import { ALL_ACCOUNTS, DEMO_PASSWORD } from "../data/mockData";
import { uid } from "../utils/id";

const AuthContext = createContext(null);

const STORAGE_KEY = "campusfix.session";

export function AuthProvider({ children }) {
  const [accounts, setAccounts] = useState(ALL_ACCOUNTS);
  const [user, setUser] = useState(() => {
    const savedId = sessionStorage.getItem(STORAGE_KEY);
    return savedId ? ALL_ACCOUNTS.find((a) => a.id === savedId) || null : null;
  });
  const [authError, setAuthError] = useState("");

  const login = useCallback(
    ({ email, password }) => {
      setAuthError("");
      const account = accounts.find((a) => a.email.toLowerCase() === email.trim().toLowerCase());
      if (!account) {
        setAuthError("No account found with that email.");
        return { ok: false };
      }
      if (password !== DEMO_PASSWORD) {
        setAuthError("Incorrect password.");
        return { ok: false };
      }
      setUser(account);
      sessionStorage.setItem(STORAGE_KEY, account.id);
      return { ok: true, account };
    },
    [accounts]
  );

  const loginAs = useCallback((accountId) => {
    const account = accounts.find((a) => a.id === accountId);
    if (account) {
      setUser(account);
      sessionStorage.setItem(STORAGE_KEY, account.id);
    }
  }, [accounts]);

  const register = useCallback(
    ({ name, email, password, location, department }) => {
      setAuthError("");
      if (accounts.some((a) => a.email.toLowerCase() === email.trim().toLowerCase())) {
        setAuthError("An account with that email already exists.");
        return { ok: false };
      }
      const newUser = {
        id: uid("u"),
        role: "user",
        name,
        email,
        phone: "",
        location: location || "Not set",
        department: department || "Not set",
        joinedAt: new Date().toISOString().slice(0, 10),
        avatarColor: "#2563EB",
      };
      setAccounts((prev) => [...prev, newUser]);
      setUser(newUser);
      sessionStorage.setItem(STORAGE_KEY, newUser.id);
      return { ok: true };
    },
    [accounts]
  );

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  const updateProfile = useCallback((updates) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : prev));
    setAccounts((prev) => prev.map((a) => (a.id === updates.id ? { ...a, ...updates } : a)));
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, accounts, login, loginAs, register, logout, authError, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
