import type { ReactNode } from "react";
import { FirebaseAuthProvider } from "@/lib/firebase-auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  return <FirebaseAuthProvider>{children}</FirebaseAuthProvider>;
}
