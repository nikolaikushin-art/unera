import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/generated/HomePage";
import { HomeExtras } from "@/components/sections/sections";

function Home() {
  return (
    <>
      <HomePage />
      <HomeExtras />
    </>
  );
}

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "UNERA | Universal Economic Reform Alliance" }] }),
  component: Home,
});
