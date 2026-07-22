(function () {
  let activeImages = [];
  let activeIndex = 0;

  function openLightbox(images, index) {
    activeImages = images;
    activeIndex = index;
    updateLightboxImage();
    document.getElementById("lightbox").classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    document.getElementById("lightbox").classList.remove("is-open");
    document.body.style.overflow = "";
  }

  function updateLightboxImage() {
    const img = document.getElementById("lightbox-img");
    const placeholder = document.getElementById("lightbox-placeholder");
    const placeholderLabel = document.getElementById("lightbox-placeholder-label");
    const captionEl = document.getElementById("lightbox-caption");
    const current = activeImages[activeIndex];

    img.style.display = "";
    placeholder.style.display = "none";
    placeholderLabel.textContent = current.alt || "Photo coming soon";
    if (captionEl) {
      captionEl.textContent = current.caption || "";
      captionEl.style.display = current.caption ? "" : "none";
    }

    img.onerror = function () {
      img.style.display = "none";
      placeholder.style.display = "flex";
    };
    img.src = current.src;
    img.alt = current.alt;
  }

  function showNext() {
    activeIndex = (activeIndex + 1) % activeImages.length;
    updateLightboxImage();
  }

  function showPrev() {
    activeIndex = (activeIndex - 1 + activeImages.length) % activeImages.length;
    updateLightboxImage();
  }

  function renderGrid(category) {
    const grid = document.getElementById("gallery-grid");
    grid.innerHTML = "";
    category.images.forEach(function (img, index) {
      const btn = window.HR_buildMediaFrame(img.src, img.alt, img.alt, "button");
      btn.setAttribute("aria-label", "Open photo: " + (img.caption || img.alt));
      btn.addEventListener("click", function () {
        openLightbox(category.images, index);
      });

      if (img.caption) {
        const item = document.createElement("div");
        item.className = "gallery-item";
        const cap = document.createElement("p");
        cap.className = "gallery-caption";
        cap.textContent = img.caption;
        item.appendChild(btn);
        item.appendChild(cap);
        grid.appendChild(item);
      } else {
        grid.appendChild(btn);
      }
    });
  }

  function renderTabs(categories) {
    const tabsWrap = document.getElementById("gallery-tabs");
    categories.forEach(function (cat, i) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "gallery-tab";
      btn.setAttribute("aria-pressed", i === 0 ? "true" : "false");
      btn.textContent = cat.label;
      btn.addEventListener("click", function () {
        tabsWrap.querySelectorAll(".gallery-tab").forEach(function (b) {
          b.setAttribute("aria-pressed", "false");
        });
        btn.setAttribute("aria-pressed", "true");
        renderGrid(cat);
      });
      tabsWrap.appendChild(btn);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    const categories = window.HR_GALLERY || [];
    if (!categories.length || !document.getElementById("gallery-grid")) return;

    renderTabs(categories);
    renderGrid(categories[0]);

    document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
    document.getElementById("lightbox-next").addEventListener("click", showNext);
    document.getElementById("lightbox-prev").addEventListener("click", showPrev);
    document.getElementById("lightbox").addEventListener("click", function (e) {
      if (e.target.id === "lightbox") closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if (!document.getElementById("lightbox").classList.contains("is-open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
    });
  });
})();
