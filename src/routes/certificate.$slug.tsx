import { createFileRoute } from "@tanstack/react-router";
import { Certificate } from "@/components/certificate";

export const Route = createFileRoute("/certificate/$slug")({
  component: function CertificateRoute() {
    const { slug } = Route.useParams();
    return <Certificate slug={slug} />;
  },
});
