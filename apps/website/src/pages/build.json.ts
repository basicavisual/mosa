import type { APIRoute } from "astro";
import { collectionObjects, collectionSources } from "../data/collection";

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify({
      commit: process.env.SOURCE_COMMIT ?? "unknown",
      objects: collectionObjects.length,
      sources: collectionSources.length,
    }),
    {
      headers: {
        "cache-control": "no-store",
        "content-type": "application/json; charset=utf-8",
      },
    },
  );
