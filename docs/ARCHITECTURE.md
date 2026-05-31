# Architecture

## Goal

Provide a reusable browser automation baseline for image-generation workflows that must run through a web chat instead of an official API.

## Layers

1. Account and browser profile layer
2. Browser launch and remote debugging layer
3. Web runner layer
4. Batch or business wrapper layer

## Core loop

1. Open dedicated browser context
2. Attach to remote debugging endpoint
3. Open the target chat
4. Clear leftover input state
5. Upload the source file
6. Send the fixed instruction
7. Poll page state
8. Collect generated images
9. Save outputs and manifest
10. Retry or restart browser if needed

## Open-source boundary

This repository must stay generic:

- no real prompts
- no real chat URLs
- no real accounts
- no real browser profiles
- no local business directories
