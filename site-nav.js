(() => {
  const el = document.getElementById("siteNav");
  if (!el) return;

  const root = (el.dataset.root || "./").replace(/\/?$/, "/");
  const concept = el.dataset.concept || "";
  const mode = el.dataset.mode || "gallery";

  const concepts = [
    {
      id: "slim",
      label: "Slim",
      look: `${root}handheld/`,
      inspect: `${root}handheld/assembly.html`,
      still: `${root}still.html?c=slim`,
    },
    {
      id: "eth",
      label: "POE",
      look: `${root}handheld-eth/`,
      inspect: `${root}handheld-eth/assembly.html`,
      eval: `${root}handheld-eth/fea/`,
      still: `${root}still.html?c=eth`,
    },
    {
      id: "eink-imx93",
      label: "Eink",
      look: `${root}eink-imx93/`,
      inspect: `${root}eink-imx93/assembly.html`,
      still: `${root}still.html?c=eink-imx93`,
    },
  ];

  const conceptHref = (c) => {
    if (mode === "inspect") return c.inspect;
    if (mode === "eval" && c.eval) return c.eval;
    if (mode === "still") return c.still;
    return c.look;
  };
  const modeHref = (m) => {
    const cur = concepts.find((c) => c.id === concept);
    if (!cur) return `${root}`;
    if (m === "inspect") return cur.inspect;
    if (m === "eval") return cur.eval || cur.look;
    if (m === "still") return cur.still;
    return cur.look;
  };

  const pill = (href, label, current) =>
    `<a class="site-nav__pill${current ? " is-current" : ""}" href="${href}"${current ? ' aria-current="page"' : ""}>${label}</a>`;

  const brandHref = `${root}`;
  const conceptPills = [
    pill(brandHref, "Gallery", mode === "gallery" || !concept),
    ...concepts.map((c) => pill(conceptHref(c), c.label, c.id === concept)),
  ].join("");

  const cur = concepts.find((c) => c.id === concept);
  // Order (Alex 2026-08-03): Still · Look · Inspect · Evaluate
  const modeBlock = concept
    ? `<div class="site-nav__modes" role="navigation" aria-label="Mode">${
        pill(modeHref("still"), "Still", mode === "still")
      }${
        pill(modeHref("look"), "Look", mode === "look")
      }${
        pill(modeHref("inspect"), "Inspect", mode === "inspect")
      }${
        cur?.eval
          ? pill(modeHref("eval"), "Evaluate", mode === "eval")
          : ""
      }</div>`
    : "";

  el.innerHTML = `
    <div class="site-nav__row">
      <a class="site-nav__brand" href="${brandHref}">
        <span class="site-nav__brand-full">Active-ESL <span>concepts</span></span>
        <span class="site-nav__brand-short">AESL <span>concepts</span></span>
      </a>
      <div class="site-nav__concepts" role="navigation" aria-label="Concepts">${conceptPills}</div>
    </div>
    ${modeBlock}
  `;
  document.body.classList.add("has-site-nav");
})();
