(() => {
  /**
   * Look-mode exit chrome: Esc / Back return to gallery (or history.back).
   * Keeps site-nav Look|Inspect|Still as the mode switcher — no duplicate Close.
   */
  const fallback =
    document.body?.dataset?.lookGallery ||
    document.querySelector("a[data-look-back]")?.getAttribute("href") ||
    "../";

  const canUseHistoryBack = () => {
    if (history.length < 2) return false;
    const ref = document.referrer;
    if (!ref) return false;
    try {
      const u = new URL(ref);
      if (u.origin !== location.origin) return false;
      // Don't bounce to Still / Look siblings — gallery (or prior content) is the exit.
      if (u.pathname.endsWith("/still.html")) return false;
      if (/\/handheld(-eth)?\/?$/.test(u.pathname)) return false;
      return true;
    } catch {
      return false;
    }
  };

  const goBack = () => {
    if (canUseHistoryBack()) {
      history.back();
      return;
    }
    location.href = fallback;
  };

  document.querySelectorAll("[data-look-back]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      goBack();
    });
    if (el.tagName === "A") el.setAttribute("href", fallback);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      goBack();
    }
  });
})();
