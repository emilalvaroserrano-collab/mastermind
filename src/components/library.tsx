import { useEffect, useRef, useState, type ReactNode } from "react";
import { Download, Headphones, Video } from "lucide-react";
import {
  audioFile,
  chapterIndexAt,
  chapters,
  formatClock,
  SESSION_SECONDS,
  videoFile,
} from "@/data/session";

type Deck = "audio" | "video";

function useFileSize(href: string) {
  const [label, setLabel] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    fetch(href, { method: "HEAD" })
      .then((response) => {
        const bytes = Number(response.headers.get("content-length"));
        if (!cancelled && Number.isFinite(bytes) && bytes > 0) {
          setLabel(`${Math.round(bytes / 1_000_000)} MB`);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [href]);
  return label;
}

function DownloadLink({ href, filename, format }: { href: string; filename: string; format: string }) {
  const size = useFileSize(href);
  return (
    <a
      href={href}
      download={filename}
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-gold px-5 text-sm font-medium text-ink transition-opacity hover:opacity-90"
    >
      <Download className="size-4" aria-hidden />
      Download {format}
      {size ? <span className="tabular-nums opacity-70">{size}</span> : null}
    </a>
  );
}

export function Library() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [deck, setDeck] = useState<Deck>("video");
  const [time, setTime] = useState(0);
  const active = chapterIndexAt(time);

  function seek(seconds: number) {
    const media = deck === "audio" ? audioRef.current : videoRef.current;
    if (!media) return;
    media.currentTime = seconds;
    setTime(seconds);
    void media.play().catch(() => {});
  }

  function onTime(next: number) {
    setTime(next);
  }

  return (
    <main className="mx-auto max-w-5xl px-5 py-10 md:px-8 md:py-16">
      <header className="max-w-3xl">
        <p className="text-sm font-medium tracking-widest text-gold">AI AGENTS MASTERCLASS</p>
        <h1 className="mt-4 font-serif text-5xl leading-none text-balance text-fg md:text-6xl">
          The full session, in one file.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-pretty text-muted">
          Emil Alvaro Serrano Danguilan walks from a chat box to an agent that can act.
          Listen to the merged recording, or watch the chaptered cut. Both are the same 81-minute session.
        </p>
        <p className="mt-4 text-sm tabular-nums text-dim">{formatClock(SESSION_SECONDS)} · 13 sections</p>
      </header>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        <MediaCard
          title="Watch"
          detail="Chapter cards over the full narration."
          icon={<Video className="size-5" aria-hidden />}
          selected={deck === "video"}
          onSelect={() => setDeck("video")}
          action={<DownloadLink {...videoFile} />}
        >
          <video
            ref={videoRef}
            className="aspect-video w-full bg-bg"
            controls
            preload="metadata"
            playsInline
            poster="/media/poster.png"
            src={videoFile.href}
            onPlay={() => setDeck("video")}
            onTimeUpdate={(event) => onTime(event.currentTarget.currentTime)}
          />
        </MediaCard>

        <MediaCard
          title="Listen"
          detail="The same merge as a single MP3."
          icon={<Headphones className="size-5" aria-hidden />}
          selected={deck === "audio"}
          onSelect={() => setDeck("audio")}
          action={<DownloadLink {...audioFile} />}
        >
          <div className="flex aspect-video flex-col justify-end bg-bg px-5 pb-5">
            <p className="font-serif text-3xl leading-tight text-balance text-fg">Audio only</p>
            <p className="mt-2 text-sm text-muted">Use the player, or take the file with you.</p>
            <audio
              ref={audioRef}
              className="mt-6 w-full"
              controls
              preload="metadata"
              src={audioFile.href}
              onPlay={() => setDeck("audio")}
              onTimeUpdate={(event) => onTime(event.currentTarget.currentTime)}
            />
          </div>
        </MediaCard>
      </div>

      <section className="mt-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-3xl text-fg">Sections</h2>
            <p className="mt-1 text-sm text-muted">Jump in the player you have selected.</p>
          </div>
          <p className="text-sm tabular-nums text-dim">{formatClock(time)}</p>
        </div>
        <ol className="mt-5 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
          {chapters.map((chapter, index) => {
            const on = index === active;
            return (
              <li key={chapter.id}>
                <button
                  type="button"
                  onClick={() => seek(chapter.start)}
                  className={`flex min-h-14 w-full items-center gap-4 px-4 py-3 text-left transition-colors ${
                    on ? "bg-raised" : "hover:bg-raised"
                  }`}
                >
                  <span className={`w-16 shrink-0 text-xs font-medium tracking-wide ${on ? "text-gold" : "text-dim"}`}>
                    {chapter.kicker}
                  </span>
                  <span className={`min-w-0 flex-1 text-sm md:text-base ${on ? "text-fg" : "text-muted"}`}>
                    {chapter.title}
                  </span>
                  <span className="shrink-0 text-sm tabular-nums text-dim">{formatClock(chapter.start)}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </section>
    </main>
  );
}

function MediaCard({
  title,
  detail,
  icon,
  selected,
  onSelect,
  action,
  children,
}: {
  title: string;
  detail: string;
  icon: ReactNode;
  selected: boolean;
  onSelect: () => void;
  action: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className={`overflow-hidden rounded-2xl border bg-surface ${selected ? "border-gold" : "border-line"}`}>
      <div className="flex items-start justify-between gap-3 px-4 py-4">
        <button type="button" onClick={onSelect} className="flex min-h-11 items-start gap-3 text-left">
          <span className="mt-0.5 text-gold">{icon}</span>
          <span>
            <span className="block font-medium text-fg">{title}</span>
            <span className="mt-1 block text-sm text-muted">{detail}</span>
          </span>
        </button>
      </div>
      {children}
      <div className="flex items-center justify-between gap-3 px-4 py-4">{action}</div>
    </section>
  );
}
