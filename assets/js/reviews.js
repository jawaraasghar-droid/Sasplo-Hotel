(function () {
  function renderStars(rating, container) {
    container.innerHTML = "";
    const full = Math.floor(rating);
    const hasHalf = rating - full >= 0.5;
    for (let i = 0; i < 5; i++) {
      const span = document.createElement("span");
      span.textContent = "★";
      if (i < full) {
        // filled
      } else if (i === full && hasHalf) {
        span.className = "star-half";
      } else {
        span.className = "star-empty";
      }
      container.appendChild(span);
    }
  }

  function renderReviewCard(review) {
    const card = document.createElement("article");
    card.className = "card reveal";

    const body = document.createElement("div");
    body.className = "card-body";

    const stars = document.createElement("span");
    stars.className = "stars review-stars";
    renderStars(review.rating, stars);

    const quote = document.createElement("p");
    quote.style.marginTop = "var(--space-3)";
    quote.style.fontStyle = "italic";
    quote.textContent = "“" + review.quote + "”";

    const name = document.createElement("p");
    name.style.margin = "0";
    name.style.fontWeight = "700";
    name.style.color = "var(--color-forest-900)";
    name.textContent = review.name;

    const context = document.createElement("p");
    context.style.margin = "0";
    context.style.fontSize = "var(--fs-sm)";
    context.textContent = review.context;

    body.appendChild(stars);
    body.appendChild(quote);
    body.appendChild(name);
    body.appendChild(context);
    card.appendChild(body);
    return card;
  }

  document.addEventListener("DOMContentLoaded", function () {
    const reviews = window.HR_REVIEWS || [];

    const grid = document.getElementById("reviews-grid");
    if (grid) {
      reviews.forEach(function (review) {
        grid.appendChild(renderReviewCard(review));
      });
    }

    const starsEl = document.getElementById("rating-stars");
    const numberEl = document.getElementById("rating-number");
    if (starsEl && reviews.length) {
      const avg = reviews.reduce(function (sum, r) { return sum + r.rating; }, 0) / reviews.length;
      renderStars(avg, starsEl);
      if (numberEl) numberEl.textContent = avg.toFixed(1);
    }
  });

  window.HR_renderStars = renderStars;
})();
