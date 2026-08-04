/* Renders the "Notes from Saspolo" posts page.
   Post text is written by the owner through the admin panel, so everything
   is inserted with textContent — never innerHTML — to keep stray angle
   brackets or pasted markup from becoming live HTML. */
(function () {
  function formatDate(iso) {
    var d = new Date(iso + "T00:00:00");
    if (isNaN(d.getTime())) return iso || "";
    try {
      return d.toLocaleDateString(document.documentElement.lang || "en", {
        year: "numeric", month: "long", day: "numeric"
      });
    } catch (e) {
      return iso;
    }
  }

  function buildImages(post) {
    var srcs = (post.images || []).filter(Boolean);
    if (!srcs.length) return null;

    var wrap = document.createElement("div");
    wrap.className = "post-images" + (srcs.length > 1 ? " post-images-multi" : "");

    srcs.forEach(function (src) {
      var fig = document.createElement("div");
      fig.className = "post-image";
      var img = document.createElement("img");
      img.loading = "lazy";
      img.alt = post.title || "Photo from Saspolo Hotel";
      // A post whose photo is missing should still show its words.
      img.onerror = function () { fig.remove(); };
      img.src = src;
      fig.appendChild(img);
      wrap.appendChild(fig);
    });
    return wrap;
  }

  function buildPost(post) {
    var article = document.createElement("article");
    article.className = "post reveal";

    var imgs = buildImages(post);
    if (imgs) article.appendChild(imgs);

    var body = document.createElement("div");
    body.className = "post-body";

    if (post.date) {
      var time = document.createElement("time");
      time.className = "post-date";
      time.setAttribute("datetime", post.date);
      time.textContent = formatDate(post.date);
      body.appendChild(time);
    }

    if (post.title) {
      var h2 = document.createElement("h2");
      h2.className = "post-title";
      h2.textContent = post.title;
      body.appendChild(h2);
    }

    // Blank lines separate paragraphs; single newlines stay inside one.
    String(post.body || "")
      .split(/\n\s*\n/)
      .map(function (p) { return p.trim(); })
      .filter(Boolean)
      .forEach(function (para) {
        var p = document.createElement("p");
        p.textContent = para;
        body.appendChild(p);
      });

    article.appendChild(body);
    return article;
  }

  document.addEventListener("DOMContentLoaded", function () {
    var list = document.getElementById("journal-list");
    if (!list) return;

    var posts = (window.HR_POSTS || []).slice().sort(function (a, b) {
      return String(b.date || "").localeCompare(String(a.date || ""));
    });

    if (!posts.length) {
      var empty = document.getElementById("journal-empty");
      if (empty) empty.style.display = "";
      return;
    }

    posts.forEach(function (post) {
      list.appendChild(buildPost(post));
    });

    // Let the shared scroll-reveal animation pick up the new cards.
    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
      list.querySelectorAll(".reveal").forEach(function (el) { observer.observe(el); });
    } else {
      list.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("is-visible"); });
    }
  });
})();
