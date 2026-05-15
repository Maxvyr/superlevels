# AGENTS.md

## Project Overview

SuperLevels is a Manifest V3 Chrome extension that bundles multiple browser utility features into one open-source, privacy-respecting package. The product promise is to replace many small extensions with one auditable extension.

Core feature areas:

- Tab cleanup and recently closed tab recovery
- Cookie editor for the current site
- Redirect tracing
- X/Twitter dim mode
- JavaScript per-site toggle
- GDPR cookie consent dismissal
- Live CSS editor
- YouTube dim mode and YouTube/X distraction removal
- Picture-in-picture
- Google Search Maps link restoration
- Google Images "View Image" restoration
- JSON response formatter

## Repository Shape

This repo is intentionally lightweight and has no build step.

- `manifest.json` defines permissions, content scripts, popup, icons, and the Manifest V3 service worker.
- `background.js` contains the service worker logic for tab cleanup, redirect tracing, closed tab history, and picture-in-picture execution.
- `popup.html` contains the popup UI, styles, and page markup.
- `popup.js` contains popup navigation, settings, feature controls, cookie editing, and messaging to content/background scripts.
- `nocookie.js`, `livecss.js`, and `jsonformat.js` run on all pages.
- `unhook.js` and `ytdim.js` run on YouTube.
- `xdim.js` and `xunhook.js` run on X/Twitter.
- `gmaps.js` and `viewimage.js` run on Google domains.
- `icon*.png`, `demo.gif`, and `demo.mp4` are static assets.

## Development Workflow

There is no package manager, bundler, transpiler, or automated test suite in this repo.

To test changes:

1. Open `chrome://extensions/`.
2. Enable Developer mode.
3. Click "Load unpacked" and select this repo folder.
4. After editing files, click the extension reload button in `chrome://extensions/`.
5. Re-test the affected feature in a normal browser tab.

Useful manual checks:

- Open the popup and verify the affected tab/page still renders.
- Check the extension service worker console from `chrome://extensions/` for background errors.
- Check the current page's DevTools console for content script errors.
- Confirm settings persist through `chrome.storage.local`.
- For content scripts, test both initial page load and toggling from the popup.

## Chrome Extension Constraints

- This is a Manifest V3 extension. Background code runs as a service worker and should not depend on long-lived DOM state.
- Content scripts communicate with the popup/background using `chrome.runtime.sendMessage` and `chrome.tabs.sendMessage`.
- Keep feature state in `chrome.storage.local` unless there is a clear reason not to.
- Avoid adding remote code, dynamic script loading, analytics, telemetry, or hidden network calls.
- Be careful when changing permissions. Any new permission must have a clear user-facing reason.
- Host permissions are broad because many features operate across arbitrary pages; do not broaden them further without a strong reason.

## Privacy And Security Principles

Privacy is central to the product. Preserve these guarantees:

- No analytics.
- No tracking.
- No silent data exfiltration.
- No remote code execution.
- Store user preferences locally.
- Treat cookie values, URLs, and custom CSS as sensitive user data.

When editing cookie features:

- Avoid logging cookie names or values.
- Be careful with domain/path/secure/httpOnly handling.
- Prefer explicit user actions for destructive operations.

## Product Guidance

This extension is best understood as a power-user browser control panel, not a single-purpose app. Product changes should reinforce:

- Trust: auditable, local-first, transparent behavior.
- Utility density: small features should be fast and practical.
- User control: feature toggles should be obvious and reversible.
- Browser calm: reduce distractions, clutter, and repetitive annoyances.

Avoid adding features that require accounts, background cloud services, or opaque data handling unless explicitly requested.

## Code Style

- Use plain JavaScript, HTML, and CSS.
- Match the existing file organization and feature-section comments.
- Keep changes scoped to the relevant feature file when possible.
- Prefer readable DOM and Chrome API code over clever abstractions.
- Use defensive checks around page-specific selectors; third-party sites change often.
- Escape user/page-provided strings before injecting them into popup HTML.
- Keep comments useful and concise.

## Feature-Specific Notes

### Tab Cleaner

Implemented mainly in `background.js` and configured from the popup. It should never close:

- The active tab in a window
- Pinned tabs
- The last tab in a window
- Tabs whose host matches exclusions

Closed tab history is stored locally and capped.

### Redirect Tracer

Uses `webNavigation` and `webRequest` in `background.js`. It tracks only main-frame navigation. Be careful not to retain unnecessary history after tabs close.

### Content-Script UI Features

Features such as GDPR dismissal, live CSS, YouTube unhook, X unhook, Maps links, View Image, and JSON formatting depend on injected CSS/DOM changes. Test on real target pages after selector changes.

### JSON Formatter

Should only activate for genuine JSON responses or simple text/pre pages containing valid JSON. Avoid formatting normal HTML pages.

### JS Toggle

Uses `chrome.contentSettings.javascript` for both `https` and `http` host patterns, then reloads the tab. Check behavior on both schemes if changing it.

## Release Checklist

Before considering work complete:

- Reload the unpacked extension.
- Exercise the affected popup page.
- Exercise the affected content script on a real page.
- Check popup, page, and service worker consoles for errors.
- Confirm `manifest.json` remains valid JSON.
- Confirm no new network calls or permissions were added unintentionally.
- Update `README.md` if user-facing behavior changes.
