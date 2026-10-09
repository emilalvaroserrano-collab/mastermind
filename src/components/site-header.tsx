import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "@/components/theme-toggle";
import { useStudent } from "@/lib/firebase-auth";
import { signOutFirebase } from "@/lib/firebase";

export function SiteHeader() {
  const { user, ready } = useStudent();
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex min-h-14 max-w-6xl items-center justify-between gap-3 px-4">
        <Link to="/" className="inline-flex min-h-11 items-center font-serif text-lg text-fg">
          AI Agents
        </Link>
        <nav className="flex items-center gap-1">
          <Link to="/" className="hidden min-h-11 items-center px-2 text-sm text-muted sm:inline-flex">
            Courses
          </Link>
          <Link to="/dashboard" className="inline-flex min-h-11 items-center px-2 text-sm text-fg">
            My courses
          </Link>
          <ThemeToggle />
          {ready && user ? (
            <button type="button" onClick={() => void signOutFirebase()} className="inline-flex min-h-11 items-center px-2 text-sm text-muted">
              Sign out
            </button>
          ) : (
            <Link to="/sign-in" className="inline-flex min-h-11 items-center rounded-lg bg-fg px-3 text-sm font-medium text-surface">
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
