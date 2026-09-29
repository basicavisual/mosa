import { defineConfig } from "astro/config";
import { validateLocalisation } from "./scripts/validate-localisation.ts";
import { siteURL } from "./src/i18n/routes.ts";
export default defineConfig({
  site: siteURL,
  output: "static",
  trailingSlash: "ignore",
  i18n: {
    defaultLocale: "es",
    locales: ["es", "en"],
    routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false },
  },
  integrations: [
    { name: "localisation-checks", hooks: { "astro:build:start": () => validateLocalisation() } },
  ],
  server: { host: "0.0.0.0", port: 4322 },
  preview: { host: "0.0.0.0", port: 4322 },
});
