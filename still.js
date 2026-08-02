(() => {
  /**
   * Beauty-still viewer: Esc / Back / Close return to Look (or history.back).
   * Query: ?c=slim|eth
   */
  const STILLS = {
    slim: {
      src: "handheld/beauty_raytrace_baseline.png",
      look: "handheld/",
      inspect: "handheld/assembly.html",
      title: "Handheld slim — beauty still",
      caption: "Cycles baseline · PLACEHOLDER · slim",
    },
    eth: {
      src: "handheld-eth/beauty_card.png",
      look: "handheld-eth/",
      inspect: "handheld-eth/assembly.html",
      title: "Handheld eth — beauty still",
      caption: "EEVEE card · PLACEHOLDER · eth",
    },
  };

  const params = new URLSearchParams(location.search);
  const concept = (params.get("c") || params.get("concept") || "").toLowerCase();
  const cfg = STILLS[concept];

  const img = document.getElementById("stillImg");
  const caption = document.getElementById("stillCaption");
  const titleEl = document.getElementById("stillTitle");
  const nav = document.getElementById("siteNav");
  const err = document.getElementById("stillError");

  if (!cfg) {
    if (err) {
      err.hidden = false;
      err.textContent = "Unknown still. Open from Look (Still) or gallery card.";
    }
    if (img) img.hidden = true;
    document.title = "Active-ESL — still";
    return;
  }

  if (nav) {
    nav.dataset.concept = concept;
    nav.dataset.mode = "still";
  }
  document.title = cfg.title;
  if (titleEl) titleEl.textContent = cfg.title;
  if (caption) caption.textContent = cfg.caption;
  if (img) {
    img.src = cfg.src;
    img.alt = cfg.title;
  }

  const lookHref = cfg.look;

  const canUseHistoryBack = () => {
    if (history.length < 2) return false;
    const ref = document.referrer;
    if (!ref) return false;
    try {
      const u = new URL(ref);
      if (u.origin !== location.origin) return false;
      // Don't bounce between still variants as "back to content".
      if (u.pathname.endsWith("/still.html")) return false;
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
    location.href = lookHref;
  };

  document.querySelectorAll("[data-still-back]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      goBack();
    });
    if (el.tagName === "A") el.setAttribute("href", lookHref);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      goBack();
    }
  });

  // Click dim frame (not the image) to leave.
  const stage = document.getElementById("stillStage");
  if (stage && img) {
    stage.addEventListener("click", (e) => {
      if (e.target === stage) goBack();
    });
  }
})();
