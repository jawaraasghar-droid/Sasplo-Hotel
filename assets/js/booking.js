(function () {
  function todayISO() {
    return new Date().toISOString().slice(0, 10);
  }

  function formatDateHuman(iso) {
    if (!iso) return "";
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  }

  function populateRoomOptions(select) {
    (window.HR_ROOMS || []).forEach(function (room) {
      const opt = document.createElement("option");
      opt.value = room.slug;
      opt.textContent = room.name;
      select.appendChild(opt);
    });
  }

  function preselectRoomFromQuery(select) {
    const params = new URLSearchParams(location.search);
    const roomParam = params.get("room");
    if (roomParam && select.querySelector('option[value="' + roomParam + '"]')) {
      select.value = roomParam;
    }
  }

  function showError(field, show) {
    const wrap = field.closest(".form-field");
    if (wrap) wrap.classList.toggle("has-error", show);
  }

  function validate(form) {
    let valid = true;
    const name = form.querySelector("#bf-name");
    const phone = form.querySelector("#bf-phone");
    const guests = form.querySelector("#bf-guests");
    const checkin = form.querySelector("#bf-checkin");
    const checkout = form.querySelector("#bf-checkout");

    [name, phone].forEach(function (field) {
      const ok = field.value.trim().length > 0;
      showError(field, !ok);
      if (!ok) valid = false;
    });

    const guestsOk = Number(guests.value) >= 1;
    showError(guests, !guestsOk);
    if (!guestsOk) valid = false;

    const checkinOk = !!checkin.value;
    showError(checkin, !checkinOk);
    if (!checkinOk) valid = false;

    let checkoutOk = !!checkout.value;
    if (checkinOk && checkoutOk) checkoutOk = checkout.value > checkin.value;
    showError(checkout, !checkoutOk);
    if (!checkoutOk) valid = false;

    return valid;
  }

  function buildMessage(form) {
    const getVal = function (id) { return form.querySelector(id).value.trim(); };
    const roomSelect = form.querySelector("#bf-room");
    const roomLabel = roomSelect.selectedIndex >= 0 ? roomSelect.options[roomSelect.selectedIndex].textContent : "";

    const lines = [
      "New Booking Request — Saspolo Hotel",
      "Name: " + getVal("#bf-name"),
      "Phone: " + getVal("#bf-phone")
    ];
    const email = getVal("#bf-email");
    if (email) lines.push("Email: " + email);
    lines.push("Check-in: " + formatDateHuman(getVal("#bf-checkin")));
    lines.push("Check-out: " + formatDateHuman(getVal("#bf-checkout")));
    if (roomLabel) lines.push("Room type: " + roomLabel);
    lines.push("Guests: " + getVal("#bf-guests"));
    const roomsCount = getVal("#bf-rooms");
    if (roomsCount) lines.push("Rooms needed: " + roomsCount);
    const notes = getVal("#bf-notes");
    if (notes) lines.push("Special requests: " + notes);
    lines.push("");
    lines.push("(Sent from the Saspolo Hotel website booking form)");
    return lines.join("\n");
  }

  document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("booking-form");
    if (!form) return;

    const checkinInput = form.querySelector("#bf-checkin");
    const checkoutInput = form.querySelector("#bf-checkout");
    const roomSelect = form.querySelector("#bf-room");

    checkinInput.min = todayISO();
    checkinInput.addEventListener("change", function () {
      const nextDay = new Date(checkinInput.value + "T00:00:00");
      nextDay.setDate(nextDay.getDate() + 1);
      const minCheckout = nextDay.toISOString().slice(0, 10);
      checkoutInput.min = minCheckout;
      if (checkoutInput.value && checkoutInput.value <= checkinInput.value) {
        checkoutInput.value = minCheckout;
      }
    });

    populateRoomOptions(roomSelect);
    preselectRoomFromQuery(roomSelect);

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate(form)) return;
      // The hotel's own number hasn't been provided yet (see site-config.js) —
      // show the translated "coming soon" notice instead of a broken wa.me link.
      if (!window.SITE_CONFIG.whatsappNumber) {
        window.HR_showContactSoonNotice(form);
        return;
      }
      const message = buildMessage(form);
      const url = "https://wa.me/" + window.SITE_CONFIG.whatsappNumber + "?text=" + encodeURIComponent(message);
      window.open(url, "_blank", "noopener");
    });
  });
})();
