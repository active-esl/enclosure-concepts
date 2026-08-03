(() => {
  /**
   * GitHub Pages/Fastly caches HTML+assets for max-age=600 and ignores client
   * revalidation. Unique ?_=… / ?v=… query strings miss the CDN cache.
   *
   * - On Look/Inspect: poll build.json; when id changes, soft-reload with ?v=.
   * - On any page: Look/Inspect navigations fetch build.json first and append ?v=.
   */
  const POLL_MS = 20000;
  const BUILD_META = 'aesl-build';

  const conceptDirFromPath = (pathname) => {
    const m = String(pathname || "").match(/^(.*\/(?:handheld-eth|handheld)\/)/);
    return m ? m[1] : null;
  };

  const isLookOrInspectPath = (pathname) => {
    const p = String(pathname || "");
    // Look / Inspect / Evaluate board (fea/) share concept build.json busting.
    return /\/(?:handheld-eth|handheld)\/(?:|assembly\.html|fea\/?|fea\/index\.html)$/.test(
      p
    );
  };

  const fetchBuild = async (dirUrl) => {
    const u = new URL("build.json", dirUrl);
    u.searchParams.set("_", String(Date.now()));
    const r = await fetch(u.href, { cache: "no-store" });
    if (!r.ok) throw new Error(`build.json ${r.status}`);
    return r.json();
  };

  const withBuildParam = (href, buildId) => {
    const u = new URL(href, location.href);
    if (buildId) u.searchParams.set("v", buildId);
    return u.href;
  };

  // Freshen Look/Inspect clicks so gallery / nav skips stale CDN HTML.
  document.addEventListener(
    "click",
    (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }
      const a = e.target?.closest?.("a[href]");
      if (!a) return;
      let abs;
      try {
        abs = new URL(a.getAttribute("href"), location.href);
      } catch {
        return;
      }
      if (abs.origin !== location.origin) return;
      if (!isLookOrInspectPath(abs.pathname)) return;
      // Already pinned to a build — leave alone (shareable deep links).
      if (abs.searchParams.has("v")) return;

      const dir = conceptDirFromPath(abs.pathname);
      if (!dir) return;
      e.preventDefault();
      const dirUrl = `${abs.origin}${dir}`;
      fetchBuild(dirUrl)
        .then((j) => {
          location.href = withBuildParam(abs.href, j.id);
        })
        .catch(() => {
          location.href = abs.href;
        });
    },
    true
  );

  // Open-tab updates: poll this concept's build.json.
  const dir = conceptDirFromPath(location.pathname);
  if (!dir) return;
  if (!isLookOrInspectPath(location.pathname)) return;

  const meta = document.querySelector(`meta[name="${BUILD_META}"]`);
  let current = meta?.content || new URL(location.href).searchParams.get("v") || "";
  const dirUrl = `${location.origin}${dir}`;

  const applyNewBuild = (j) => {
    if (!j?.id) return false;
    // Stale CDN HTML may lack meta — adopt first observed id without reload.
    if (!current) {
      current = j.id;
      if (meta) meta.content = j.id;
      return false;
    }
    if (j.id === current) return false;
    current = j.id;
    if (meta) meta.content = j.id;

    // Look: hot-swap model-viewer when only the beauty GLB fingerprinted.
    const mv = document.querySelector("model-viewer");
    const lookHash = j.assets && j.assets["handheld.glb"];
    if (mv && lookHash && /\/(?:handheld-eth|handheld)\/?$/.test(location.pathname)) {
      const next = `handheld.glb?v=${lookHash}`;
      const cur = mv.getAttribute("src") || "";
      if (!cur.includes(lookHash)) {
        mv.src = next;
      }
      const u = new URL(location.href);
      u.searchParams.set("v", j.id);
      history.replaceState(null, "", u.href);
      return true;
    }

    // Inspect (embedded MANIFEST) needs a full document load; ?v= busts CDN HTML.
    // Keep the outgoing paint dark — new HTML also has inline html/body bg.
    try {
      document.documentElement.style.backgroundColor = "#0b1220";
      document.documentElement.style.colorScheme = "dark";
      if (document.body) document.body.style.backgroundColor = "#0b1220";
    } catch {
      /* ignore */
    }
    location.replace(withBuildParam(location.href, j.id));
    return true;
  };

  const check = async () => {
    if (document.visibilityState === "hidden") return;
    try {
      const j = await fetchBuild(dirUrl);
      applyNewBuild(j);
    } catch {
      /* offline / first publish without build.json */
    }
  };

  setInterval(check, POLL_MS);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") check();
  });
  // First check shortly after load (catches deploy while tab was open on old HTML).
  setTimeout(check, 4000);
})();
