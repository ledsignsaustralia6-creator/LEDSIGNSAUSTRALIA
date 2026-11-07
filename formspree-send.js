/* ============================================================
   LED Signs Australia - shared Formspree sender
   1. Create a form at https://formspree.io and copy its ID
      (the part after /f/ in the endpoint URL).
   2. Paste it below. All four product pages use this one file.
   ============================================================ */
var FORMSPREE_ENDPOINT = "https://formspree.io/f/xyeeabvw";

(function () {
  // ---------- styles for the confirm / result popup ----------
  var css = "\
  .lsa-overlay{position:fixed;inset:0;background:rgba(10,12,16,.6);display:none;align-items:center;justify-content:center;z-index:10000;padding:20px}\
  .lsa-overlay.open{display:flex}\
  .lsa-modal{background:#fff;border-radius:14px;max-width:520px;width:100%;max-height:85vh;overflow:auto;padding:26px;box-shadow:0 20px 60px rgba(0,0,0,.35)}\
  .lsa-modal h3{margin:0 0 10px;font-size:20px;color:#1a1a1a}\
  .lsa-modal p{margin:0 0 14px;color:#555;font-size:14.5px;line-height:1.55}\
  .lsa-summary{background:#f7f8fa;border:1px solid #e6e8ec;border-radius:8px;padding:12px 14px;font-size:13px;color:#333;white-space:pre-wrap;max-height:240px;overflow:auto;margin-bottom:16px}\
  .lsa-actions{display:flex;gap:10px;flex-wrap:wrap}\
  .lsa-btn{flex:1;min-width:120px;border:none;border-radius:8px;padding:12px 16px;font-size:15px;font-weight:700;cursor:pointer}\
  .lsa-yes{background:#00AFEF;color:#fff}.lsa-yes:hover{background:#0090C5}\
  .lsa-yes:disabled{opacity:.6;cursor:wait}\
  .lsa-no{background:#eef0f3;color:#333}.lsa-no:hover{background:#e1e4e8}";
  var st = document.createElement("style");
  st.textContent = css;
  document.head.appendChild(st);

  var overlay, modal;
  function ensureModal() {
    if (overlay) return;
    overlay = document.createElement("div");
    overlay.className = "lsa-overlay";
    modal = document.createElement("div");
    modal.className = "lsa-modal";
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function close() { overlay.classList.remove("open"); }

  // ---------- validation helpers ----------
  window.LSA_validPhone = function (v) {
    return (v || "").replace(/\D/g, "").length >= 8;
  };
  window.LSA_validEmail = function (v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((v || "").trim());
  };

  // Shows field errors for name / email / phone (all compulsory).
  // Expects inputs #custName, #custEmail, #custPhone and error spans
  // #custNameError, #custEmailError, #custPhoneError.
  window.LSA_validateContact = function () {
    var ok = true;
    function flag(id, msg) {
      var el = document.getElementById(id);
      var err = document.getElementById(id + "Error");
      var bad = msg !== "";
      if (el && el.closest(".field")) el.closest(".field").classList.toggle("has-error", bad);
      if (err) err.textContent = msg;
      if (bad) ok = false;
    }
    var name = document.getElementById("custName").value.trim();
    var email = document.getElementById("custEmail").value.trim();
    var phone = document.getElementById("custPhone").value.trim();
    flag("custName", name ? "" : "Please enter your name.");
    flag("custEmail", !email ? "Please enter your email." : (LSA_validEmail(email) ? "" : "That email address doesn't look right."));
    flag("custPhone", !phone ? "Please enter your phone number." : (LSA_validPhone(phone) ? "" : "That phone number doesn't look right."));
    return ok;
  };

  // ---------- confirm, then send to Formspree ----------
  // subject: email subject; message: full enquiry text;
  // contact: {name, email, phone}; pageName: label for the page
  window.LSA_confirmAndSend = function (subject, message, contact, pageName) {
    ensureModal();
    modal.innerHTML =
      "<h3>Send your enquiry?</h3>" +
      "<p>Please check the details below. Press <strong>Yes, send</strong> to send them to LED Signs Australia.</p>" +
      '<div class="lsa-summary">' + esc(message) + "</div>" +
      '<div class="lsa-actions">' +
      '<button type="button" class="lsa-btn lsa-yes" id="lsaYes">Yes, send</button>' +
      '<button type="button" class="lsa-btn lsa-no" id="lsaNo">Cancel</button>' +
      "</div>";
    overlay.classList.add("open");

    document.getElementById("lsaNo").onclick = close;
    document.getElementById("lsaYes").onclick = function () {
      var btn = this;
      btn.disabled = true;
      btn.textContent = "Sending...";

      var payload = {
        _subject: subject,
        page: pageName,
        name: contact.name,
        email: contact.email,
        _replyto: contact.email,
        phone: contact.phone,
        message: message
      };

      fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload)
      })
        .then(function (res) {
          if (res.ok) return true;
          throw new Error("Formspree error " + res.status);
        })
        .then(function () {
          modal.innerHTML =
            "<h3>Thanks, we've got it!</h3>" +
            "<p>Your enquiry has been sent. We'll be in touch on the phone number or email you gave us.</p>" +
            '<div class="lsa-actions"><button type="button" class="lsa-btn lsa-yes" id="lsaDone">Close</button></div>';
          document.getElementById("lsaDone").onclick = close;
        })
        .catch(function () {
          modal.innerHTML =
            "<h3>Sorry, that didn't send</h3>" +
            "<p>Something went wrong. Please try again, or call us on +61 481 308 955 or email info@ledsignsaustralia.com.au.</p>" +
            '<div class="lsa-actions"><button type="button" class="lsa-btn lsa-yes" id="lsaClose">Close</button></div>';
          document.getElementById("lsaClose").onclick = close;
        });
    };
  };
})();
