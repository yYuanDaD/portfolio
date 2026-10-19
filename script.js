(() => {
  "use strict";

  const config = window.PORTFOLIO_CONFIG || {};
  const status = document.getElementById("download-status");
  const linkLabels = {
    elementaryDownload: "Download game",
    p1Download: "P1 Gold downloads"
  };

  function usableLink(value) {
    if (typeof value !== "string" || !value.trim()) return null;
    const candidate = value.trim();
    try {
      const parsed = new URL(candidate, window.location.href);
      if (!["https:", "http:", "file:"].includes(parsed.protocol)) return null;
      return candidate;
    } catch (_) {
      return null;
    }
  }

  for (const key of ["elementaryDownload", "p1Download"]) {
    const destination = usableLink(config[key]);
    document.querySelectorAll(`[data-config-link="${key}"]`).forEach(link => {
      if (destination) {
        link.href = destination;
        link.removeAttribute("aria-disabled");
        link.classList.remove("is-pending");
        const label = link.querySelector("[data-link-label]");
        if (label) label.textContent = linkLabels[key];
      } else {
        link.addEventListener("click", event => {
          event.preventDefault();
          if (key === "elementaryDownload" && status) {
            status.textContent = "The public download link is being prepared.";
            document.getElementById("download").scrollIntoView({ block: "start" });
          }
        });
      }
    });
    if (key === "elementaryDownload" && destination && status) {
      status.textContent = "Windows + macOS · Complete playable package";
    }
  }

  const credits = usableLink(config.creditsUrl);
  if (credits) document.querySelectorAll('[data-config-link="creditsUrl"]').forEach(link => { link.href = credits; });

  document.querySelectorAll(".game-image").forEach(image => {
    const frame = image.closest(".image-frame");
    const update = () => frame.classList.toggle("is-loaded", image.complete && image.naturalWidth > 0);
    image.addEventListener("load", update);
    image.addEventListener("error", update);
    update();
  });
})();
