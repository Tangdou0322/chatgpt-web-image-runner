#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { validateRunnerConfig } from "./config-schema.mjs";
import { writeEmptyManifest } from "./manifest.mjs";

function readFlag(args, name) {
  const index = args.indexOf(name);
  if (index === -1) {
    return null;
  }
  return args[index + 1] ?? null;
}

function usage() {
  console.log(`chatgpt-web-image-runner

Commands:
  validate-config --config <path>
  manifest --output <path>
`);
}

async function handleValidateConfig(args) {
  const configPath = readFlag(args, "--config");
  if (!configPath) {
    throw new Error("--config is required");
  }
  const raw = await readFile(resolve(configPath), "utf8");
  const parsed = JSON.parse(raw);
  validateRunnerConfig(parsed);
  console.log(`config ok: ${resolve(configPath)}`);
}

async function handleManifest(args) {
  const outputPath = readFlag(args, "--output");
  if (!outputPath) {
    throw new Error("--output is required");
  }
  const payload = await writeEmptyManifest(resolve(outputPath));
  console.log(JSON.stringify(payload, null, 2));
}

async function main() {
  const [, , command, ...args] = process.argv;
  if (!command || command === "--help" || command === "-h") {
    usage();
    return;
  }
  if (command === "validate-config") {
    await handleValidateConfig(args);
    return;
  }
  if (command === "manifest") {
    await handleManifest(args);
    return;
  }
  throw new Error(`unknown command: ${command}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
