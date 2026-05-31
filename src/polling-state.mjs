function assertNumber(value, path) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new Error(`${path} must be a number`);
  }
}

function assertBoolean(value, path) {
  if (typeof value !== "boolean") {
    throw new Error(`${path} must be a boolean`);
  }
}

function assertOptionalString(value, path) {
  if (value == null) {
    return;
  }
  if (typeof value !== "string") {
    throw new Error(`${path} must be a string when present`);
  }
}

export function validatePollingSnapshot(snapshot) {
  if (typeof snapshot !== "object" || snapshot === null || Array.isArray(snapshot)) {
    throw new Error("snapshot must be an object");
  }

  assertNumber(snapshot.expectedImageCount, "snapshot.expectedImageCount");
  assertNumber(snapshot.latest, "snapshot.latest");
  assertNumber(snapshot.group, "snapshot.group");
  assertNumber(snapshot.viewer, "snapshot.viewer");
  assertNumber(snapshot.thumbs, "snapshot.thumbs");
  assertBoolean(snapshot.creating, "snapshot.creating");
  assertBoolean(snapshot.thinking, "snapshot.thinking");
  assertOptionalString(snapshot.completedThought, "snapshot.completedThought");
  assertOptionalString(snapshot.uploadError, "snapshot.uploadError");

  return snapshot;
}

function maxVisibleImages(snapshot) {
  return Math.max(snapshot.latest, snapshot.group, snapshot.viewer, snapshot.thumbs);
}

function hasCompletedThought(snapshot) {
  return typeof snapshot.completedThought === "string" && snapshot.completedThought.trim().length > 0;
}

function normalizeUploadError(snapshot) {
  return (snapshot.uploadError ?? "").toLowerCase();
}

export function evaluatePollingSnapshot(rawSnapshot) {
  const snapshot = validatePollingSnapshot(rawSnapshot);
  const visibleImages = maxVisibleImages(snapshot);
  const enoughImages = visibleImages >= snapshot.expectedImageCount;
  const uploadError = normalizeUploadError(snapshot);

  if (uploadError.includes("files.oaiusercontent.com") || uploadError.includes("upload blocked by network")) {
    return {
      status: "retryable_failure",
      reason: "upload_network_failure",
      visibleImages,
      nextAction: "refresh_chat_and_retry_upload",
      notes: [
        "The upload link looks broken for this turn.",
        "Do not keep waiting on the same page state.",
        "Refresh the chat, clear the composer, and upload again."
      ]
    };
  }

  if (enoughImages && !snapshot.creating && !snapshot.thinking) {
    return {
      status: "success",
      reason: "enough_images_and_generation_idle",
      visibleImages,
      nextAction: "collect_outputs",
      notes: [
        "The page is no longer generating.",
        "The expected image count is available.",
        "Proceed to collect and save outputs."
      ]
    };
  }

  if (enoughImages && hasCompletedThought(snapshot)) {
    return {
      status: "success",
      reason: "completed_thought_and_enough_images",
      visibleImages,
      nextAction: "collect_outputs",
      notes: [
        "A completion marker is visible.",
        "The expected image count is available.",
        "Proceed to collect and save outputs."
      ]
    };
  }

  if (visibleImages > 0 && !snapshot.creating && !snapshot.thinking && !enoughImages) {
    return {
      status: "retryable_failure",
      reason: "partial_images_after_idle",
      visibleImages,
      nextAction: "retry_same_run",
      notes: [
        "Some outputs are visible, but the expected set is incomplete.",
        "The page looks idle already.",
        "Retry the same run before escalating to a browser restart."
      ]
    };
  }

  if (snapshot.creating || snapshot.thinking) {
    return {
      status: "in_progress",
      reason: "generation_active",
      visibleImages,
      nextAction: "continue_polling",
      notes: [
        "The page still reports active generation state.",
        "Keep polling until the state becomes idle or enough outputs appear."
      ]
    };
  }

  return {
    status: "unknown",
    reason: "insufficient_signals",
    visibleImages,
    nextAction: "inspect_page_state",
    notes: [
      "The snapshot does not match a confident success or retry pattern.",
      "Inspect the page state and raw DOM signals before taking the next step."
    ]
  };
}
