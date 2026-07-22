/* Shared image-slot builder used by rooms/gallery/attractions rendering.
   Ships a real <img> pointed at the documented file path; if the file 404s
   (nothing dropped in yet), onerror swaps in a styled placeholder — so every
   photo slot works today and needs zero code changes once a real photo lands. */
(function () {
  function buildMediaFrame(src, alt, placeholderLabel, tag) {
    const wrap = document.createElement(tag || "div");
    wrap.className = "media-frame";
    if (wrap.tagName === "BUTTON") wrap.type = "button";

    const img = document.createElement("img");
    img.alt = alt || "";
    img.loading = "lazy";

    // The owner drops photos in by hand and phones often save them as
    // .jpeg/.png/.webp instead of the documented .jpg — try those variants
    // before falling back to the "Photo coming soon" placeholder.
    const base = src.replace(/\.[a-z0-9]+$/i, "");
    const candidates = [src, base + ".jpeg", base + ".png", base + ".webp"];
    let attempt = 0;
    img.onerror = function () {
      attempt++;
      if (attempt < candidates.length) {
        img.src = candidates[attempt];
      } else {
        wrap.classList.add("img-missing");
      }
    };
    img.src = candidates[0];

    const fallback = document.createElement("div");
    fallback.className = "placeholder-fallback placeholder-photo";
    fallback.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M3 17l5-6 4 4 3-4 6 7H3z"></path><circle cx="8" cy="8" r="2"></circle></svg>' +
      "<span>" + (placeholderLabel || "Photo coming soon") + "</span>";

    wrap.appendChild(img);
    wrap.appendChild(fallback);
    return wrap;
  }

  window.HR_buildMediaFrame = buildMediaFrame;
})();
