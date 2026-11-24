import { renderToString } from "react-dom/server";
import { RouterProvider, createMemoryHistory, createRouter } from "@tanstack/react-router";
import { routeTree } from "../src/routeTree.gen";

export async function render(url: string) {
  const router = createRouter({ routeTree, history: createMemoryHistory({ initialEntries: [url] }) });
  await router.load();
  const notFound = router.state.matches.some((m) => m.status === "notFound" || (m as { globalNotFound?: boolean }).globalNotFound === true);
  const html = renderToString(<RouterProvider router={router} />);
  const metas = router.state.matches.flatMap((m) => m.meta ?? []).filter(Boolean) as Record<string, string>[];
  return { html, metas, notFound };
}
