import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/course/$slug")({
  component: () => <Outlet />,
});
