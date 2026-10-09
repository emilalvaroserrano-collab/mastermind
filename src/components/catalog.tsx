import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { fields, professions } from "@/data/professions";
import { guideFor } from "@/data/walkthrough";
import { readGuide } from "@/lib/progress";
import { SiteHeader } from "@/components/site-header";

export function Catalog() {
  const [query, setQuery] = useState("");
  const [field, setField] = useState<(typeof fields)[number]>("All");
  const [done, setDone] = useState<Record<string, number>>({});

  useEffect(() => {
    setDone(readGuide());
  }, []);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return professions.filter((course) => {
      if (field !== "All" && course.field !== field) return false;
      if (!q) return true;
      const hay = `${course.name} ${course.apps.join(" ")} ${course.field}`.toLowerCase();
      return hay.includes(q);
    });
  }, [query, field]);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <p className="text-sm font-medium text-mark">Applied courses</p>
        <h1 className="mt-2 max-w-xl font-serif text-4xl leading-tight text-balance text-fg">
          An AI layer for the software you already run.
        </h1>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-pretty text-muted">
          Pick your profession. Each path starts by telling you what you will finish with, then shows the real clicks, one picture at a time. Gmail is included, from the first sign-in.
        </p>

        <label className="mt-6 block">
          <span className="sr-only">Search professions or software</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search a profession or app"
            suppressHydrationWarning
            className="min-h-11 w-full rounded-xl border border-line bg-surface px-4 text-base text-fg outline-none"
          />
        </label>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {fields.map((item) => {
            const on = item === field;
            return (
              <button
                key={item}
                type="button"
                onClick={() => setField(item)}
                className={`min-h-11 shrink-0 rounded-full px-4 text-sm ${on ? "bg-fg text-bg" : "border border-line bg-surface text-muted"}`}
              >
                {item}
              </button>
            );
          })}
        </div>

        <p className="mt-4 text-sm tabular-nums text-dim">{shown.length} courses</p>

        {shown.length === 0 ? (
          <p className="mt-8 text-muted">Nothing matches that search.</p>
        ) : (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {shown.map((course) => {
              const total = guideFor(course).length;
              const at = done[course.slug] ?? 0;
              const finished = at >= total - 1 && at > 0;
              return (
                <li key={course.slug}>
                  <Link
                    to="/course/$slug"
                    params={{ slug: course.slug }}
                    className="flex h-full flex-col rounded-2xl border border-line bg-surface p-4"
                  >
                    <p className="text-xs font-medium text-mark">{course.field}</p>
                    <h2 className="mt-2 text-lg leading-snug text-fg">{course.name}</h2>
                    <p className="mt-2 text-sm text-muted">
                      {course.apps[0]} · {course.apps[1]}
                    </p>
                    <p className="mt-4 text-sm tabular-nums text-dim">
                      {finished ? "Finished" : at > 0 ? `Step ${at + 1} of ${total}` : `${total} picture steps`}
                    </p>
                    <span className="mt-3 block h-1 overflow-hidden rounded-full bg-line">
                      <span className="block h-full bg-mark" style={{ width: `${(at / (total - 1)) * 100}%` }} />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </>
  );
}
