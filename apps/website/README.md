# MoSA public website

This is a server-rendered Astro website with Chilean Spanish (`/es/`,
`es-CL`) and British English (`/en/`, `en-GB`). Spanish is the default
entry. Collection records and editorials are bundled from the repository during
the build, so the running website has no database or collection-service
dependency.

## Develop and verify

Run from the repository root after [setup](../../README.md#start-development):

```sh
mise exec -- just website-dev
mise exec -- just collection-check
mise exec -- just website-check
mise exec -- pnpm --filter @mosa/website test
mise exec -- just website-build
```

The production server listens on port 8080.

## Code entry points

| Path | Purpose |
| --- | --- |
| `src/content/pages/` | Page and shared copy, with both languages in each JSON file |
| `src/content/events/` | One bilingual JSON file per event |
| `src/data/collection-model.ts` | Reduced collection contract and cross-file validation |
| `src/data/collection.ts` | Build-time loading and object-page projection |
| `src/templates/` | Shared templates for both languages |
| `src/i18n/routes.ts` | Page IDs, paths, locale tags and fragment identifiers |
| `src/pages/build.json.ts` | Deployed commit and collection counts for release verification |
| `src/pages/sitemap-index.xml.ts` | Sitemap generated from local object records |
| `src/middleware.ts` | Legacy redirects and cache behaviour |

Use [collection authoring](../../docs/collection-publication.md) for public
records and [website content](../../docs/website-content.md) for copy.

## Production HTTP checks

Build the production image with `just website-image`. A normal Git LFS checkout
must hydrate collection images before Docker runs. The root and legacy paths
redirect permanently to Spanish equivalents while preserving query strings.
Unknown paths return 404.
