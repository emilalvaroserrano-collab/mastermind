import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { watchAuth } from "@/lib/firebase";

export type Student = { uid: string; email: string; name: string };

type AuthValue = { user: Student | null; ready: boolean };

const AuthContext = createContext<AuthValue>({ user: null, ready: false });

export function FirebaseAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Student | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => watchAuth((next) => {
    setUser(next);
    setReady(true);
  }), []);

  return <AuthContext.Provider value={{ user, ready }}>{children}</AuthContext.Provider>;
}

export function useStudent() {
  return useContext(AuthContext);
}
