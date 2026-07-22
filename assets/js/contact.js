(function () {
  function showError(field, show) {
    const wrap = field.closest(".form-field");
    if (wrap) wrap.classList.toggle("has-error", show);
  }

  document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("contact-form");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = form.querySelector("#cf-name");
      const contact = form.querySelector("#cf-contact");
      const message = form.querySelector("#cf-message");

      let valid = true;
      [name, contact, message].forEach(function (field) {
        const ok = field.value.trim().length > 0;
        showError(field, !ok);
        if (!ok) valid = false;
      });
      if (!valid) return;

      // Hotel's own number not provided yet — show notice instead of a broken link.
      if (!window.SITE_CONFIG.whatsappNumber) {
        window.HR_showContactSoonNotice(form);
        return;
      }

      const lines = [
        "New Message — Saspolo Hotel Website",
        "Name: " + name.value.trim(),
        "Contact info: " + contact.value.trim(),
        "Message: " + message.value.trim()
      ];
      const url = "https://wa.me/" + window.SITE_CONFIG.whatsappNumber + "?text=" + encodeURIComponent(lines.join("\n"));
      window.open(url, "_blank", "noopener");
    });
  });
})();
