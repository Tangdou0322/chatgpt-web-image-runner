# chatgpt-web-image-runner

Browser-based image generation automation for web chats when no official API is available.

## Problems this project helps solve

This project is for workflows like:

- uploading a source image to a web chat
- sending a fixed image-generation instruction
- polling the page until outputs are ready
- downloading and saving generated images automatically
- retrying when browser state, upload state, or partial output collection fails

Common search intents this repository targets:

- `chatgpt web image runner`
- `chatgpt web automation image generation`
- `no api image generation browser automation`
- `upload image send prompt poll download results`
- `files.oaiusercontent.com upload failed`
- `browser image generation pipeline`

## What this project does

`chatgpt-web-image-runner` provides a clean open-source baseline for browser-driven image generation pipelines.

The intended automation loop is:

1. start a dedicated Chrome profile
2. attach to a remote debugging port
3. open a fixed chat URL
4. clear composer leftovers
5. upload an input image
6. send a fixed instruction
7. poll the page state
8. collect image outputs
9. save outputs and a manifest
10. retry if the run partially fails

This repository is intentionally generic and does not contain any real chat URLs, real browser profiles, account credentials, business prompts, or local machine secrets.

## Scope

Current scope:

- reusable project structure for browser-based image pipelines
- typed config model and example config
- manifest writer
- generic polling and retry policy model
- redaction-safe documentation

Planned scope:

- CDP connection layer
- upload / send / poll / collect runner
- browser restart recovery helpers
- optional batch wrappers

## Install

```bash
npm install
```

## Usage

Validate a config:

```bash
npm run validate-config -- --config ./examples/sample-runner.config.json
```

Create an empty manifest:

```bash
npm run manifest -- --output ./tmp/manifest.json
```

## Repository rules

This project follows a strict publishing policy:

- no real secrets
- no real browser profiles
- no real chat URLs
- no local absolute paths
- no raw operational logs

Before any public push:

- scan for sensitive values
- keep all example configs redacted
- keep account and prompt data generic

## License

MIT
