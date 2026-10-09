import type { LearnState } from "@/lib/learn";
import { emptyLearn } from "@/lib/learn";

const firebaseConfig = {
  apiKey: "AIzaSyC8k-Urv_CEQSuJFSEojh_aU9ur3LijXOA",
  authDomain: "masterplan-1cd65.firebaseapp.com",
  databaseURL: "https://masterplan-1cd65-default-rtdb.firebaseio.com",
  projectId: "masterplan-1cd65",
  storageBucket: "masterplan-1cd65.firebasestorage.app",
  messagingSenderId: "737894267682",
  appId: "1:737894267682:web:26d96704580c32222d037b",
  measurementId: "G-F8G60GBV0S",
};

async function app() {
  const { getApps, initializeApp } = await import("firebase/app");
  return getApps()[0] ?? initializeApp(firebaseConfig);
}

export async function firebaseAuth() {
  const { getAuth } = await import("firebase/auth");
  return getAuth(await app());
}

export async function signInEmail(email: string, password: string) {
  const { signInWithEmailAndPassword } = await import("firebase/auth");
  await signInWithEmailAndPassword(await firebaseAuth(), email.trim(), password);
}

export async function signUpEmail(email: string, password: string) {
  const { createUserWithEmailAndPassword } = await import("firebase/auth");
  await createUserWithEmailAndPassword(await firebaseAuth(), email.trim(), password);
}

export async function signInGoogle() {
  const { GoogleAuthProvider, signInWithPopup } = await import("firebase/auth");
  await signInWithPopup(await firebaseAuth(), new GoogleAuthProvider());
}

export async function signOutFirebase() {
  const { signOut } = await import("firebase/auth");
  await signOut(await firebaseAuth());
}

export function watchAuth(onUser: (user: { uid: string; email: string; name: string } | null) => void) {
  let stop = () => {};
  let alive = true;
  void (async () => {
    try {
      const { onAuthStateChanged } = await import("firebase/auth");
      const auth = await firebaseAuth();
      if (!alive) return;
      stop = onAuthStateChanged(auth, (user) => {
        onUser(user ? { uid: user.uid, email: user.email ?? "", name: user.displayName ?? "" } : null);
      });
    } catch {
      onUser(null);
    }
  })();
  return () => {
    alive = false;
    stop();
  };
}

export async function readLearnRemote(uid: string): Promise<LearnState | null> {
  const { get, ref } = await import("firebase/database");
  const { getDatabase } = await import("firebase/database");
  const snap = await get(ref(getDatabase(await app()), `users/${uid}/learn`));
  if (!snap.exists()) return null;
  const value = snap.val();
  if (!value || typeof value !== "object") return null;
  return { ...emptyLearn(), ...(value as LearnState) };
}

export async function writeLearnRemote(uid: string, state: LearnState) {
  const { ref, set } = await import("firebase/database");
  const { getDatabase } = await import("firebase/database");
  await set(ref(getDatabase(await app()), `users/${uid}/learn`), state);
}

export function authErrorMessage(error: unknown) {
  const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
  if (code.includes("invalid-email")) return "That email does not look right.";
  if (code.includes("invalid-credential") || code.includes("wrong-password") || code.includes("user-not-found")) {
    return "Email or password does not match.";
  }
  if (code.includes("email-already-in-use")) return "That email already has an account. Sign in instead.";
  if (code.includes("weak-password")) return "Use at least 6 characters.";
  if (code.includes("popup-closed")) return "The Google window was closed.";
  if (code.includes("unauthorized-domain")) return "This site is not on the Firebase authorized domains list yet.";
  if (code.includes("operation-not-allowed")) return "Turn on Email and Google sign-in in the Firebase console.";
  if (code.includes("permission-denied")) return "Firebase refused the save.";
  return "Sign-in did not finish. Try again.";
}
