import { Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { useLearn } from "@/components/use-learn";
import { useStudent } from "@/lib/firebase-auth";
import { courses, findLesson, studyLessons } from "@/data/school";

export function Dashboard() {
  const { state, update, saveError, signedIn } = useLearn();
  const { user } = useStudent();
  const enrolled = courses.filter((course) => state.enrolled.includes(course.slug));

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="font-serif text-4xl text-fg">My courses</h1>
        <p className="mt-2 text-sm text-muted">
          {signedIn
            ? `Saved to ${user?.email || "your account"}.`
            : "Sign in to keep courses on your account. Right now they stay in this browser."}
        </p>
        {saveError ? <p className="mt-2 text-sm text-fg">{saveError}</p> : null}
        {!signedIn ? (
          <Link to="/sign-in" className="mt-4 inline-flex min-h-11 items-center rounded-lg bg-fg px-4 text-sm font-medium text-surface">
            Sign in
          </Link>
        ) : null}
        <label className="mt-6 block text-sm text-muted">
          Name on the completion card
          <input
            value={state.name}
            onChange={(event) => {
              const name = event.target.value;
              update((current) => ({ ...current, name }));
            }}
            className="mt-2 min-h-11 w-full rounded-lg border border-line bg-surface px-4 text-base text-fg outline-none"
          />
        </label>

        <section className="mt-8">
          <h2 className="text-sm font-medium text-fg">Enrolled</h2>
          {enrolled.length === 0 ? (
            <p className="mt-3 text-sm text-muted">
              You have not enrolled yet.{" "}
              <Link to="/" className="text-mark">
                Browse courses
              </Link>
            </p>
          ) : (
            <ul className="mt-3 space-y-3">
              {enrolled.map((course) => {
                const study = studyLessons(course);
                const finished = study.filter((lesson) => (state.done[course.slug] ?? []).includes(lesson.id)).length;
                const next = study.find((lesson) => !(state.done[course.slug] ?? []).includes(lesson.id)) ?? study[0];
                return (
                  <li key={course.slug} className="rounded-2xl border border-line bg-surface p-4">
                    <p className="text-xs text-muted">{course.category}</p>
                    <h3 className="mt-1 font-serif text-2xl text-fg">{course.title}</h3>
                    <p className="mt-1 text-sm tabular-nums text-dim">
                      {finished} of {study.length} lessons
                      {state.quizzes[course.slug]?.passed ? " · quiz passed" : ""}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-3">
                      <Link to="/course/$slug/lesson/$lessonId" params={{ slug: course.slug, lessonId: next.id }} className="inline-flex min-h-11 items-center rounded-lg bg-fg px-4 text-sm font-medium text-surface">
                        Continue
                      </Link>
                      <Link to="/certificate/$slug" params={{ slug: course.slug }} className="inline-flex min-h-11 items-center text-sm text-muted">
                        Completion card
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="mt-8">
          <h2 className="text-sm font-medium text-fg">Bookmarks</h2>
          {state.bookmarks.length === 0 ? (
            <p className="mt-3 text-sm text-muted">Bookmark a lesson from the player.</p>
          ) : (
            <ul className="mt-3 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
              {state.bookmarks.map((key) => {
                const [slug, lessonId] = key.split(":");
                const course = courses.find((item) => item.slug === slug);
                const lesson = course ? findLesson(course, lessonId) : undefined;
                if (!course || !lesson) return null;
                return (
                  <li key={key}>
                    <Link to="/course/$slug/lesson/$lessonId" params={{ slug, lessonId }} className="flex min-h-14 flex-col justify-center px-4 py-3">
                      <span className="text-sm text-fg">{lesson.title}</span>
                      <span className="text-xs text-dim">{course.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>
    </>
  );
}
