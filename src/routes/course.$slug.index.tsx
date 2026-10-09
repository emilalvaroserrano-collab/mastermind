import { createFileRoute } from "@tanstack/react-router";
import { CoursePage } from "@/components/course-page";

export const Route = createFileRoute("/course/$slug/")({
  component: function CourseIndex() {
    const { slug } = Route.useParams();
    return <CoursePage slug={slug} />;
  },
});
