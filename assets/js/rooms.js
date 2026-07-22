(function () {
  function renderRoomCard(room) {
    const card = document.createElement("article");
    card.className = "card reveal room-card";

    const frame = window.HR_buildMediaFrame(room.images[0], room.name, room.name);
    card.appendChild(frame);

    const body = document.createElement("div");
    body.className = "card-body";

    const badge = document.createElement("span");
    badge.className = "badge badge-amber";
    badge.setAttribute("data-i18n", "rooms." + room.tierKey);
    badge.textContent = room.tier;
    badge.style.marginBottom = "var(--space-3)";
    body.appendChild(badge);

    const title = document.createElement("h3");
    title.textContent = room.name;
    title.style.margin = "var(--space-2) 0";
    body.appendChild(title);

    const desc = document.createElement("p");
    desc.textContent = room.description;
    body.appendChild(desc);

    const rateRow = document.createElement("p");
    rateRow.className = "room-rate";
    rateRow.textContent = room.rateNote;
    body.appendChild(rateRow);

    const cta = document.createElement("a");
    cta.href = "booking.html?room=" + encodeURIComponent(room.slug);
    cta.className = "btn btn-primary btn-block";
    cta.setAttribute("data-i18n", "common.checkAvailability");
    cta.textContent = "Check Availability";
    body.appendChild(cta);

    card.appendChild(body);
    return card;
  }

  document.addEventListener("DOMContentLoaded", function () {
    const grid = document.getElementById("rooms-grid");
    if (!grid) return;
    (window.HR_ROOMS || []).forEach(function (room) {
      grid.appendChild(renderRoomCard(room));
    });
  });
})();
