import { createFileRoute } from "@tanstack/react-router";
import { Player } from "@/components/player";

export const Route = createFileRoute("/course/$slug/lesson/$lessonId")({
  component: function LessonRoute() {
    const { slug, lessonId } = Route.useParams();
    return <Player slug={slug} lessonId={lessonId} />;
  },
});
