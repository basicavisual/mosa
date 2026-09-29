import { runCommand } from "./run-command";

export async function repositoryFiles(root: string): Promise<string[]> {
  const output = await runCommand(
    "git",
    ["ls-files", "--cached", "--others", "--exclude-standard", "-z"],
    { cwd: root, captureOutput: true },
  );
  return [...new Set(output.split("\0").filter(Boolean))];
}
