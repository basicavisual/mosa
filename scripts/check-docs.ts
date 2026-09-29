import { fileURLToPath } from "node:url";
import { checkDocumentation } from "./lib/documentation";
import { repositoryFiles } from "./lib/repository-files";
import { runCommand } from "./lib/run-command";

async function main() {
  const root = fileURLToPath(new URL("../", import.meta.url));
  const files = (await repositoryFiles(root)).filter(
    (file) => file.endsWith(".md") && !file.startsWith("."),
  );
  const manifest = JSON.parse(
    await runCommand("just", ["--dump", "--dump-format", "json"], {
      cwd: root,
      captureOutput: true,
    }),
  );
  const recipes = new Set([...Object.keys(manifest.recipes), ...Object.keys(manifest.aliases)]);
  const { errors, linkCount, commandCount } = await checkDocumentation(root, files, recipes);
  if (errors.length) throw new Error(errors.join("\n"));
  console.log(
    `Checked ${linkCount} local links and ${commandCount} command references across ${files.length} documents.`,
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
