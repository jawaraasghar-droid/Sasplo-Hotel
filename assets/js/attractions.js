(function () {
  function toCamel(slug) {
    return slug.replace(/-([a-z])/g, function (_, c) { return c.toUpperCase(); });
  }

  function renderTeaser() {
    const grid = document.getElementById("attractions-teaser-grid");
    if (!grid) return;
    const items = (window.HR_ATTRACTIONS || []).slice(0, 4);
    items.forEach(function (item) {
      const card = document.createElement("a");
      card.className = "card reveal";
      card.href = "attractions.html";

      const frame = window.HR_buildMediaFrame(item.image, item.name, item.name);
      card.appendChild(frame);

      const body = document.createElement("div");
      body.className = "card-body";
      const h4 = document.createElement("h4");
      h4.style.margin = "0";
      h4.textContent = item.name;
      body.appendChild(h4);
      card.appendChild(body);

      grid.appendChild(card);
    });
  }

  /* Card carousel: places shown with the name (and blurb) below each image;
     prev/next buttons and touch-swipe advance the deck one card at a time. */
  function renderCarousel() {
    const track = document.getElementById("carousel-track");
    if (!track) return;
    const viewport = track.parentElement;
    const prevBtn = document.querySelector(".carousel-prev");
    const nextBtn = document.querySelector(".carousel-next");
    const items = window.HR_ATTRACTIONS || [];
    const GAP = 24; // must match --space-5 used for the track gap

    items.forEach(function (item) {
      const card = document.createElement("div");
      card.className = "carousel-card";

      const frame = window.HR_buildMediaFrame(item.image, item.name, item.name);

      const name = document.createElement("h3");
      name.className = "carousel-card-name";
      name.setAttribute("data-i18n", "attractions." + toCamel(item.slug) + ".name");
      name.textContent = item.name;

      const blurb = document.createElement("p");
      blurb.className = "carousel-card-blurb";
      blurb.setAttribute("data-i18n", "attractions." + toCamel(item.slug) + ".blurb");
      blurb.textContent = item.blurb;

      card.appendChild(frame);
      card.appendChild(name);
      card.appendChild(blurb);
      track.appendChild(card);
    });

    let index = 0;

    function perView() {
      const w = window.innerWidth;
      if (w <= 639) return 1;
      if (w <= 959) return 2;
      return 3;
    }

    function maxIndex() {
      return Math.max(0, items.length - perView());
    }

    function update() {
      if (index > maxIndex()) index = maxIndex();
      if (index < 0) index = 0;
      const card = track.querySelector(".carousel-card");
      const cardWidth = card ? card.getBoundingClientRect().width : 0;
      const isRtl = document.documentElement.getAttribute("dir") === "rtl";
      const shift = index * (cardWidth + GAP);
      track.style.transform = "translateX(" + (isRtl ? shift : -shift) + "px)";
      prevBtn.disabled = index <= 0;
      nextBtn.disabled = index >= maxIndex();
    }

    prevBtn.addEventListener("click", function () { index--; update(); });
    nextBtn.addEventListener("click", function () { index++; update(); });

    // Touch swipe
    let startX = null;
    viewport.addEventListener("touchstart", function (e) {
      startX = e.touches[0].clientX;
    }, { passive: true });
    viewport.addEventListener("touchend", function (e) {
      if (startX === null) return;
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) {
        // swipe left -> next, swipe right -> prev (mirrored for RTL)
        const isRtl = document.documentElement.getAttribute("dir") === "rtl";
        const goNext = isRtl ? dx > 0 : dx < 0;
        index += goNext ? 1 : -1;
        update();
      }
      startX = null;
    }, { passive: true });

    let resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(update, 120);
    });

    // Re-align after images load (their height/layout can shift the row)
    window.addEventListener("load", update);
    update();
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderTeaser();
    renderCarousel();
  });
})();
