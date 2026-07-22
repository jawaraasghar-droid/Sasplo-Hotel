(function () {
  // Shared "contact details coming soon" notice, used by booking.js and
  // contact.js while the hotel's own phone/WhatsApp number is still pending
  // (see site-config.js). Lives here because main.js loads on every page.
  window.HR_showContactSoonNotice = function (form) {
    let notice = form.querySelector(".contact-soon-notice");
    if (!notice) {
      notice = document.createElement("p");
      notice.className = "contact-soon-notice";
      notice.setAttribute("role", "status");
      notice.style.cssText = "margin-top:var(--space-4);padding:var(--space-3) var(--space-4);background:var(--color-amber-100);border:1px solid var(--color-amber-400);border-radius:var(--radius-sm);font-size:var(--fs-sm);color:var(--color-ink-700);";
      form.appendChild(notice);
    }
    const lang = localStorage.getItem("hr_lang") || "en";
    const dict = (window.HR_I18N && (window.HR_I18N[lang] || window.HR_I18N.en)) || null;
    notice.textContent = (dict && dict.footer && dict.footer.phoneSoon) || "Phone & WhatsApp coming soon";
  };

  document.addEventListener("DOMContentLoaded", function () {
    const yearEl = document.getElementById("footer-year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    const toggle = document.getElementById("nav-toggle");
    const nav = document.getElementById("main-nav");
    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        const isOpen = nav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });
      nav.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
          nav.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
        });
      });
    }

    const header = document.getElementById("site-header");
    if (header) {
      const onScroll = function () {
        header.classList.toggle("is-scrolled", window.scrollY > 8);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }

    const revealEls = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window && revealEls.length) {
      const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
      revealEls.forEach(function (el) { observer.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add("is-visible"); });
    }
  });
})();
