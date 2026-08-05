(() => {
  /**
   * Look-mode model-viewer:
   * 1) Page scroll wins over dolly/orbit (wheel / trackpad); Ctrl/⌘+wheel zooms.
   * 2) Stage the viewer in the clear viewport (below site-nav + look-bar, above
   *    hint) so the model is centred on load — not under the chrome.
   * Pair with touch-action="pan-y" so one-finger vertical pans scroll the page.
   */
  const bindScroll = (mv) => {
    if (!(mv instanceof HTMLElement) || mv.dataset.lookScrollBound === "1") return;
    mv.dataset.lookScrollBound = "1";
    mv.addEventListener(
      "wheel",
      (event) => {
        if (event.ctrlKey || event.metaKey) return;
        event.stopPropagation();
      },
      { capture: true, passive: true }
    );
  };

  const stageClear = (mv) => {
    if (!(mv instanceof HTMLElement)) return;
    const nav = document.getElementById("siteNav");
    const bar = document.querySelector(".look-bar");
    const hint = document.querySelector(".look-hint");
    let top = 0;
    let bottomGap = 0;
    if (nav) top = Math.max(top, nav.getBoundingClientRect().bottom);
    if (bar) top = Math.max(top, bar.getBoundingClientRect().bottom);
    top = Math.max(0, Math.round(top + 6));
    if (hint) {
      const hr = hint.getBoundingClientRect();
      bottomGap = Math.max(0, Math.round(innerHeight - hr.top + 6));
    } else {
      bottomGap = 48;
    }
    // Keep a usable stage; fall back to full-bleed if chrome measurement is odd.
    if (innerHeight - top - bottomGap < 160) {
      mv.style.top = "0";
      mv.style.bottom = "0";
      return;
    }
    mv.style.position = "fixed";
    mv.style.left = "0";
    mv.style.right = "0";
    mv.style.width = "auto";
    mv.style.height = "auto";
    mv.style.top = `${top}px`;
    mv.style.bottom = `${bottomGap}px`;
  };

  const layoutAll = () => {
    document.querySelectorAll("model-viewer").forEach((mv) => {
      bindScroll(mv);
      stageClear(mv);
    });
  };

  const scan = () => {
    layoutAll();
    // Re-stage after fonts/nav wrap and after the GLB loads (auto framing).
    addEventListener("resize", layoutAll);
    if (window.ResizeObserver) {
      const ro = new ResizeObserver(() => layoutAll());
      const nav = document.getElementById("siteNav");
      const bar = document.querySelector(".look-bar");
      if (nav) ro.observe(nav);
      if (bar) ro.observe(bar);
    }
    document.querySelectorAll("model-viewer").forEach((mv) => {
      mv.addEventListener("load", layoutAll);
      // model-viewer may bump FOV after first layout — restage once more.
      mv.addEventListener("camera-change", () => {
        if (mv.dataset.lookStagedOnce === "1") return;
        mv.dataset.lookStagedOnce = "1";
        layoutAll();
      }, { once: true });
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scan, { once: true });
  } else {
    scan();
  }
})();
