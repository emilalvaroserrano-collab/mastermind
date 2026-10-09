import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { SiteHeader } from "@/components/site-header";
import { authErrorMessage, signInEmail, signInGoogle, signUpEmail } from "@/lib/firebase";
import { useStudent } from "@/lib/firebase-auth";

export const Route = createFileRoute("/sign-in")({ component: SignInPage });

function SignInPage() {
  const { user, ready } = useStudent();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (ready && user) void navigate({ to: "/dashboard" });
  }, [ready, user, navigate]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setPending(true);
    try {
      if (mode === "up") await signUpEmail(email, password);
      else await signInEmail(email, password);
      void navigate({ to: "/dashboard" });
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setPending(false);
    }
  }

  async function onGoogle() {
    setError("");
    setPending(true);
    try {
      await signInGoogle();
      void navigate({ to: "/dashboard" });
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-md px-4 py-10 sm:py-16">
        <div className="rounded-2xl border border-line bg-surface p-5 sm:p-8">
          <h1 className="font-serif text-4xl text-fg">{mode === "in" ? "Sign in" : "Create account"}</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">Courses, notes, and progress stay on this account.</p>
          <button
            type="button"
            onClick={() => void onGoogle()}
            disabled={pending}
            className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-line bg-bg text-sm font-medium text-fg disabled:opacity-50"
          >
            Continue with Google
          </button>
          <p className="my-5 text-center text-xs text-dim">or use email</p>
          <form onSubmit={(event) => void onSubmit(event)} className="space-y-3">
            <label className="block text-sm text-muted">
              Email
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-1 min-h-11 w-full rounded-lg border border-line bg-bg px-3 text-base text-fg outline-none"
              />
            </label>
            <label className="block text-sm text-muted">
              Password
              <input
                type="password"
                autoComplete={mode === "up" ? "new-password" : "current-password"}
                required
                minLength={6}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-1 min-h-11 w-full rounded-lg border border-line bg-bg px-3 text-base text-fg outline-none"
              />
            </label>
            {error ? <p className="text-sm text-fg">{error}</p> : null}
            <button type="submit" disabled={pending} className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-fg text-sm font-medium text-surface disabled:opacity-50">
              {pending ? "Please wait" : mode === "in" ? "Sign in" : "Create account"}
            </button>
          </form>
          <button
            type="button"
            onClick={() => {
              setMode(mode === "in" ? "up" : "in");
              setError("");
            }}
            className="mt-4 min-h-11 text-sm text-fg"
          >
            {mode === "in" ? "Need an account? Create one" : "Already have an account? Sign in"}
          </button>
        </div>
      </main>
    </>
  );
}
