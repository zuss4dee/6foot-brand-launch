import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import {
  getCustomerSession,
  loginCustomer,
  logoutCustomer,
  signupCustomer,
} from "./customer-auth.functions";

export type CustomerSession =
  | { authenticated: false }
  | {
      authenticated: true;
      email: string;
      firstName: string | null;
      lastName: string | null;
    };

type CustomerAuthContextValue = {
  session: CustomerSession;
  loading: boolean;
  refresh: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const CustomerAuthContext = createContext<CustomerAuthContextValue | null>(null);

export function CustomerAuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<CustomerSession>({ authenticated: false });
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const next = await getCustomerSession();
      setSession(next);
    } catch {
      setSession({ authenticated: false });
    }
  }, []);

  useEffect(() => {
    void refresh().finally(() => setLoading(false));
  }, [refresh]);

  const login = useCallback(
    async (email: string, password: string) => {
      const profile = await loginCustomer({ data: { email, password } });
      setSession({
        authenticated: true,
        email: profile.email,
        firstName: profile.firstName,
        lastName: profile.lastName,
      });
    },
    [],
  );

  const signup = useCallback(
    async (email: string, password: string) => {
      const profile = await signupCustomer({ data: { email, password } });
      setSession({
        authenticated: true,
        email: profile.email,
        firstName: profile.firstName,
        lastName: profile.lastName,
      });
    },
    [],
  );

  const logout = useCallback(async () => {
    await logoutCustomer();
    setSession({ authenticated: false });
  }, []);

  const value = useMemo(
    () => ({ session, loading, refresh, login, signup, logout }),
    [session, loading, refresh, login, signup, logout],
  );

  return <CustomerAuthContext.Provider value={value}>{children}</CustomerAuthContext.Provider>;
}

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error("useCustomerAuth must be used within CustomerAuthProvider.");
  }
  return context;
}
