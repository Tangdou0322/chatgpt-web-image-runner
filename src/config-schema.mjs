export const runnerConfigShape = {
  account: {
    profileName: "string",
    remoteDebuggingPort: "number",
    chatUrl: "string"
  },
  run: {
    commandName: "string",
    promptTemplatePath: "string",
    expectedImageCount: "number"
  },
  paths: {
    workDir: "string",
    outputDir: "string"
  },
  polling: {
    initialWaitSeconds: "number",
    intervalSeconds: "number",
    maxPollRounds: "number"
  },
  retries: {
    inlineRetryPrompt: "string",
    maxInlineRetries: "number",
    maxBrowserRestarts: "number"
  }
};

function assertType(value, expected, path) {
  if (expected === "string" && typeof value !== "string") {
    throw new Error(`${path} must be a string`);
  }
  if (expected === "number" && (typeof value !== "number" || Number.isNaN(value))) {
    throw new Error(`${path} must be a number`);
  }
}

function validateObject(shape, value, path = "config") {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`${path} must be an object`);
  }
  for (const [key, nested] of Object.entries(shape)) {
    if (!(key in value)) {
      throw new Error(`${path}.${key} is required`);
    }
    const nextPath = `${path}.${key}`;
    if (typeof nested === "string") {
      assertType(value[key], nested, nextPath);
    } else {
      validateObject(nested, value[key], nextPath);
    }
  }
}

export function validateRunnerConfig(config) {
  validateObject(runnerConfigShape, config);
  return config;
}
