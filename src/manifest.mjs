import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

export async function writeEmptyManifest(outputPath) {
  const payload = {
    createdAt: new Date().toISOString(),
    status: "initialized",
    items: []
  };
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, JSON.stringify(payload, null, 2), "utf8");
  return payload;
}
