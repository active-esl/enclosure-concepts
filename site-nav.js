(() => {
  const el = document.getElementById("siteNav");
  if (!el) return;

  const root = (el.dataset.root || "./").replace(/\/?$/, "/");
  const concept = el.dataset.concept || "";
  const mode = el.dataset.mode || "gallery";

  const concepts = [
    { id: "slim", label: "Slim", look: `${root}handheld/`, inspect: `${root}handheld/assembly.html` },
    { id: "eth", label: "Eth", look: `${root}handheld-eth/`, inspect: `${root}handheld-eth/assembly.html` },
  ];

  const conceptHref = (c) => (mode === "inspect" ? c.inspect : c.look);
  const modeHref = (m) => {
    const cur = concepts.find((c) => c.id === concept);
    if (!cur) return `${root}`;
    return m === "inspect" ? cur.inspect : cur.look;
  };

  const pill = (href, label, current) =>
    `<a class="site-nav__pill${current ? " is-current" : ""}" href="${href}"${current ? ' aria-current="page"' : ""}>${label}</a>`;

  const brandHref = `${root}`;
  const conceptPills = [
    pill(brandHref, "Gallery", mode === "gallery" || !concept),
    ...concepts.map((c) => pill(conceptHref(c), c.label, c.id === concept)),
  ].join("");

  const modePills = concept
    ? [
        pill(modeHref("look"), "Look", mode === "look"),
        pill(modeHref("inspect"), "Inspect", mode === "inspect"),
      ].join("")
    : "";

  el.innerHTML = `
    <a class="site-nav__brand" href="${brandHref}">Active-ESL <span>concepts</span></a>
    <div class="site-nav__concepts" role="navigation" aria-label="Concepts">${conceptPills}</div>
    <div class="site-nav__modes" role="navigation" aria-label="Mode"${concept ? "" : " hidden"}>${modePills}</div>
  `;
  document.body.classList.add("has-site-nav");
})();
