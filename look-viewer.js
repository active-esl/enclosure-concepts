(() => {
  /**
   * Look-mode model-viewer: page scroll wins over dolly/orbit.
   * - Wheel / trackpad two-finger scroll → browser page scroll (not zoom).
   * - Ctrl/⌘ + wheel → still zoom (model-viewer default).
   * - Pinch zoom unchanged.
   * - Orbit stays on intentional pointer drag (camera-controls).
   * Pair with touch-action="pan-y" so one-finger vertical pans scroll the page.
   */
  const bind = (mv) => {
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

  const scan = () => {
    document.querySelectorAll("model-viewer").forEach(bind);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scan, { once: true });
  } else {
    scan();
  }
})();
