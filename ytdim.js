// ═══════════════════════════════════
//  superlevels: YouTube Dim Mode
// ═══════════════════════════════════
(() => {
  if (globalThis.__superlevelsYtDimLoaded) return;
  globalThis.__superlevelsYtDimLoaded = true;

  const STYLE_ID = "sl-ytdim";
  const DIM_CLASS = "sl-ytdim-active";

  const THEMES = {
    dim:   { hue: 210, sat: 34 },
    slate: { hue: 210, sat: 8  },
    jade:  { hue: 150, sat: 34 },
    plum:  { hue: 270, sat: 34 },
    dusk:  { hue: 330, sat: 34 },
    ember: { hue: 25,  sat: 34 },
  };

  let theme = "dim";
  let customHue = 210;
  let enabled = false;
  let observer = null;
  let hadHtmlDark = false;
  let hadAppDark = false;

  function getHueSat() {
    if (theme === "custom") return { hue: customHue, sat: 34 };
    return THEMES[theme] || THEMES.dim;
  }

  function paletteFromHue(h, s) {
    const bSat = Math.round(s * 0.47);
    return {
      bg: `hsl(${h}, ${s}%, 12%)`,
      bgSoft: `hsl(${h}, ${Math.round(s * 0.76)}%, 15%)`,
      bgElevated: `hsl(${h}, ${Math.round(s * 0.72)}%, 18%)`,
      chip: `hsl(${h}, ${bSat}%, 22%)`,
      border: `hsl(${h}, ${bSat}%, 26%)`,
      text: `hsl(${h}, ${Math.round(s * 0.28)}%, 82%)`,
      muted: `hsl(${h}, ${bSat}%, 60%)`,
    };
  }

  function buildCSS() {
    const { hue, sat } = getHueSat();
    const p = paletteFromHue(hue, sat);
    return `
      html.${DIM_CLASS} {
        color-scheme: dark !important;
        --sl-ytdim-bg: ${p.bg};
        --sl-ytdim-bg-soft: ${p.bgSoft};
        --sl-ytdim-bg-elevated: ${p.bgElevated};
        --sl-ytdim-chip: ${p.chip};
        --sl-ytdim-border: ${p.border};
        --sl-ytdim-text: ${p.text};
        --sl-ytdim-muted: ${p.muted};
        --yt-spec-base-background: ${p.bg} !important;
        --yt-spec-raised-background: ${p.bgSoft} !important;
        --yt-spec-menu-background: ${p.bgElevated} !important;
        --yt-spec-general-background-a: ${p.bg} !important;
        --yt-spec-general-background-b: ${p.bgSoft} !important;
        --yt-spec-brand-background-primary: ${p.bg} !important;
        --yt-spec-text-primary: ${p.text} !important;
        --yt-spec-text-secondary: ${p.muted} !important;
        --yt-spec-text-disabled: ${p.muted} !important;
        --yt-spec-icon-inactive: ${p.muted} !important;
        --yt-spec-button-chip-background-hover: ${p.chip} !important;
        --yt-spec-10-percent-layer: ${p.chip} !important;
        --yt-spec-touch-response: ${p.chip} !important;
        --yt-spec-filled-button-text: ${p.text} !important;
        --yt-spec-call-to-action: ${p.text} !important;
        --yt-spec-outline: ${p.border} !important;
      }

      html.${DIM_CLASS},
      html.${DIM_CLASS} body,
      html.${DIM_CLASS} ytd-app,
      html.${DIM_CLASS} #content,
      html.${DIM_CLASS} #page-manager,
      html.${DIM_CLASS} ytd-page-manager,
      html.${DIM_CLASS} ytd-browse,
      html.${DIM_CLASS} ytd-watch-flexy {
        background: var(--sl-ytdim-bg) !important;
        color: var(--sl-ytdim-text) !important;
      }

      html.${DIM_CLASS} #columns,
      html.${DIM_CLASS} #primary,
      html.${DIM_CLASS} #secondary,
      html.${DIM_CLASS} #contents,
      html.${DIM_CLASS} #items,
      html.${DIM_CLASS} #background,
      html.${DIM_CLASS} #container,
      html.${DIM_CLASS} #contentContainer,
      html.${DIM_CLASS} ytd-two-column-browse-results-renderer,
      html.${DIM_CLASS} ytd-rich-grid-renderer,
      html.${DIM_CLASS} ytd-section-list-renderer,
      html.${DIM_CLASS} ytd-item-section-renderer,
      html.${DIM_CLASS} ytd-playlist-panel-renderer,
      html.${DIM_CLASS} ytd-comments,
      html.${DIM_CLASS} ytd-comment-thread-renderer,
      html.${DIM_CLASS} ytd-watch-metadata,
      html.${DIM_CLASS} [style*="background: rgb(255, 255, 255)"],
      html.${DIM_CLASS} [style*="background-color: rgb(255, 255, 255)"] {
        background: var(--sl-ytdim-bg) !important;
        background-color: var(--sl-ytdim-bg) !important;
      }

      html.${DIM_CLASS} #masthead,
      html.${DIM_CLASS} ytd-masthead,
      html.${DIM_CLASS} #masthead-container,
      html.${DIM_CLASS} #guide-content,
      html.${DIM_CLASS} ytd-mini-guide-renderer,
      html.${DIM_CLASS} ytd-app[guide-persistent-and-visible] #guide,
      html.${DIM_CLASS} ytd-guide-renderer,
      html.${DIM_CLASS} tp-yt-app-drawer,
      html.${DIM_CLASS} tp-yt-paper-dialog,
      html.${DIM_CLASS} ytd-popup-container {
        background: var(--sl-ytdim-bg-soft) !important;
        border-color: var(--sl-ytdim-border) !important;
      }

      html.${DIM_CLASS} ytd-rich-item-renderer,
      html.${DIM_CLASS} ytd-video-renderer,
      html.${DIM_CLASS} ytd-compact-video-renderer,
      html.${DIM_CLASS} ytd-playlist-panel-renderer,
      html.${DIM_CLASS} ytd-comments,
      html.${DIM_CLASS} ytd-engagement-panel-section-list-renderer,
      html.${DIM_CLASS} ytd-live-chat-frame,
      html.${DIM_CLASS} ytd-reel-shelf-renderer,
      html.${DIM_CLASS} ytd-rich-shelf-renderer {
        background-color: transparent !important;
      }

      html.${DIM_CLASS} #chips ytd-chip-cloud-chip-renderer,
      html.${DIM_CLASS} yt-chip-cloud-chip-renderer,
      html.${DIM_CLASS} ytd-searchbox,
      html.${DIM_CLASS} #search-form,
      html.${DIM_CLASS} #container.ytd-searchbox,
      html.${DIM_CLASS} #description,
      html.${DIM_CLASS} ytd-metadata-row-container-renderer,
      html.${DIM_CLASS} ytd-watch-metadata,
      html.${DIM_CLASS} ytd-comment-thread-renderer,
      html.${DIM_CLASS} ytd-menu-popup-renderer,
      html.${DIM_CLASS} ytd-multi-page-menu-renderer,
      html.${DIM_CLASS} ytd-simple-menu-header-renderer {
        background-color: var(--sl-ytdim-bg-elevated) !important;
        border-color: var(--sl-ytdim-border) !important;
      }

      html.${DIM_CLASS} #chips ytd-chip-cloud-chip-renderer[chip-style="STYLE_DEFAULT"],
      html.${DIM_CLASS} yt-chip-cloud-chip-renderer[chip-style="STYLE_DEFAULT"] {
        background: var(--sl-ytdim-chip) !important;
        color: var(--sl-ytdim-text) !important;
      }

      html.${DIM_CLASS} a,
      html.${DIM_CLASS} #video-title,
      html.${DIM_CLASS} yt-formatted-string,
      html.${DIM_CLASS} h1,
      html.${DIM_CLASS} h2,
      html.${DIM_CLASS} h3,
      html.${DIM_CLASS} .title,
      html.${DIM_CLASS} .yt-core-attributed-string,
      html.${DIM_CLASS} .yt-core-attributed-string a,
      html.${DIM_CLASS} .yt-spec-button-shape-next__button-text-content {
        color: var(--sl-ytdim-text) !important;
      }

      html.${DIM_CLASS} #metadata-line,
      html.${DIM_CLASS} #byline,
      html.${DIM_CLASS} #description-text,
      html.${DIM_CLASS} #owner-sub-count,
      html.${DIM_CLASS} ytd-video-meta-block,
      html.${DIM_CLASS} .ytd-video-meta-block {
        color: var(--sl-ytdim-muted) !important;
      }

      html.${DIM_CLASS} svg,
      html.${DIM_CLASS} yt-icon {
        color: var(--sl-ytdim-muted) !important;
        fill: currentColor !important;
      }

      html.${DIM_CLASS} input,
      html.${DIM_CLASS} textarea,
      html.${DIM_CLASS} #search,
      html.${DIM_CLASS} #search-input,
      html.${DIM_CLASS} #search-icon-legacy {
        background-color: var(--sl-ytdim-bg) !important;
        color: var(--sl-ytdim-text) !important;
        border-color: var(--sl-ytdim-border) !important;
      }

      html.${DIM_CLASS} ytd-thumbnail,
      html.${DIM_CLASS} img,
      html.${DIM_CLASS} video {
        filter: brightness(0.92) saturate(0.94);
      }
    `;
  }

  function ensureCSS() {
    let style = document.getElementById(STYLE_ID);
    if (!style) {
      style = document.createElement("style");
      style.id = STYLE_ID;
      (document.head || document.documentElement).appendChild(style);
    }
    style.textContent = buildCSS();
  }

  function applyDim() {
    ensureCSS();
    forceYouTubeDarkAttrs();
    document.documentElement.classList.add(DIM_CLASS);
    startObserver();
  }

  function removeDim() {
    document.documentElement.classList.remove(DIM_CLASS);
    stopObserver();
    restoreYouTubeDarkAttrs();
  }

  function forceYouTubeDarkAttrs() {
    const app = document.querySelector("ytd-app");
    if (!document.documentElement.hasAttribute("dark")) {
      document.documentElement.setAttribute("dark", "");
      hadHtmlDark = false;
    } else {
      hadHtmlDark = true;
    }
    if (app) {
      if (!app.hasAttribute("dark")) {
        app.setAttribute("dark", "");
        hadAppDark = false;
      } else {
        hadAppDark = true;
      }
    }
  }

  function restoreYouTubeDarkAttrs() {
    const app = document.querySelector("ytd-app");
    if (!hadHtmlDark) document.documentElement.removeAttribute("dark");
    if (app && !hadAppDark) app.removeAttribute("dark");
  }

  function startObserver() {
    if (observer) return;
    observer = new MutationObserver(() => {
      if (!enabled || !document.documentElement.classList.contains(DIM_CLASS)) return;
      forceYouTubeDarkAttrs();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  function stopObserver() {
    if (!observer) return;
    observer.disconnect();
    observer = null;
  }

  chrome.storage.local.get(["ytdim_enabled", "ytdim_theme", "ytdim_customHue"], (data) => {
    enabled = !!data.ytdim_enabled;
    theme = data.ytdim_theme || "dim";
    customHue = data.ytdim_customHue || 210;
    ensureCSS();
    if (enabled) applyDim();
    else removeDim();
  });

  chrome.storage.onChanged.addListener((changes) => {
    if (changes.ytdim_theme) theme = changes.ytdim_theme.newValue || "dim";
    if (changes.ytdim_customHue) customHue = changes.ytdim_customHue.newValue || 210;
    if (changes.ytdim_theme || changes.ytdim_customHue) {
      ensureCSS();
    }
    if (changes.ytdim_enabled) {
      enabled = !!changes.ytdim_enabled.newValue;
      if (enabled) applyDim();
      else removeDim();
    }
  });

  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "ytdim_toggle") {
      enabled = msg.enabled;
      if (enabled) applyDim();
      else removeDim();
      sendResponse({ ok: true });
    }
  });
})();
