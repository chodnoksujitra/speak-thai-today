/* Email signup — Speak Thai Today
   ต้อมต้องใส่ลิงก์ฟอร์มของบริการอีเมล (MailerLite / Kit / Buttondown) ที่ FORM_ACTION ครั้งเดียว
   - ว่างไว้ = โหมดสำรอง: เปิดอีเมลหา hello@myfirstthai.com (ยังไม่เก็บรายชื่ออัตโนมัติ)
   - ใส่แล้ว = ส่งอีเมลเข้าบริการ แล้วพาไปหน้า /thanks/ ที่มีไฟล์ใบงานให้ดาวน์โหลด

   The form state is written to data-state on <form data-signup> (data-state convention of Zag / Radix UI),
   and every allowed change is listed in MACHINE below (same shape as an XState config):
   state: { EVENT: next state }. An event that is not listed for the current state is ignored,
   so a second tap on the button while "sending" cannot send the email twice.

     idle     ready to type
     invalid  email looks wrong; the message shows and the email box is focused
     sending  email is on its way to Brevo; the button is disabled and says "Sending…", then the page goes to /thanks/ */
(function () {
  var MACHINE = {
    idle:    { BAD_EMAIL: "invalid", GOOD_EMAIL: "sending" },
    invalid: { BAD_EMAIL: "invalid", GOOD_EMAIL: "sending" },
    sending: { CAME_BACK: "idle" }      // CAME_BACK = Back button, or the mailto fallback opened
  };
  // Brevo form "Free Thai Worksheets" → list "Free Thai Worksheets" (ตั้งค่า 14 พ.ย. 2026)
  var FORM_ACTION = "https://85e2190f.sibforms.com/serve/MUIFAMK8w4Jo-ntfGTcWPMWOV4vHmYOWCSvpe83Ut6CzRT2mx8FO1OZxmXUxKVSru_2yDQh-tijt4hlTz-NXU43WOmSBnL8zA5gcymAL_Q1gfnCLcbvMP0v28h8tz078jMCfAFg0nLhdQVUp3Z0pznlr9qkI13fah2E1PvaWc7hhkSUoveViuH6eyvvpykszHfLp2aNC7wJVtJmQmA==";
  var EMAIL_FIELD = "EMAIL";       // ชื่อช่องอีเมลของ Brevo
  var FALLBACK_TO = "hello@myfirstthai.com";
  var SEND_TIMEOUT_MS = 8000;      // เน็ตค้าง: ไม่ให้ผู้ใช้รอเกินนี้ พาไป /thanks/ เหมือนกรณีส่งไม่สำเร็จ
  var SENDING_LABEL = "Sending…";

  function send(f, event) { var next = MACHINE[f.dataset.state][event]; if (next) render(f, next); return next; }
  function render(f, state) {
    var input = f.querySelector("input[type=email]"), btn = f.querySelector("button[type=submit]"), msg = f.querySelector(".msg");
    f.dataset.state = state;
    if (btn) {
      if (!btn.dataset.label) btn.dataset.label = btn.textContent;
      btn.disabled = state === "sending";
      btn.textContent = state === "sending" ? SENDING_LABEL : btn.dataset.label;
    }
    if (state === "sending") f.setAttribute("aria-busy", "true"); else f.removeAttribute("aria-busy");
    if (input) { if (state === "invalid") input.setAttribute("aria-invalid", "true"); else input.removeAttribute("aria-invalid"); }
    if (msg) {
      msg.textContent = state === "invalid" ? "Please enter a valid email address." : "";
      msg.style.display = state === "invalid" ? "block" : "none";
    }
    if (state === "invalid" && input) input.focus();
  }

  var forms = document.querySelectorAll("form[data-signup]");
  forms.forEach(function (f) {
    render(f, "idle");
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var hp = f.querySelector(".hp input");
      if (hp && hp.value) return;                       // บอตกรอกช่องซ่อน
      var mail = (f.querySelector("input[type=email]").value || "").trim();
      if (!send(f, /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(mail) ? "GOOD_EMAIL" : "BAD_EMAIL")) return;   // already sending
      if (f.dataset.state !== "sending") return;        // invalid: message is on screen
      if (FORM_ACTION) {
        var left = false, go = function () { if (left) return; left = true; location.href = "/thanks/"; };
        var body = new FormData(); body.append(EMAIL_FIELD, mail);
        body.append("email_address_check", ""); body.append("locale", "en");   // ช่องที่ Brevo ต้องการ
        setTimeout(go, SEND_TIMEOUT_MS);
        fetch(FORM_ACTION, { method: "POST", body: body, mode: "no-cors" }).then(go).catch(go);
      } else {
        send(f, "CAME_BACK");
        location.href = "mailto:" + FALLBACK_TO +
          "?subject=" + encodeURIComponent("Send me the free Thai worksheets") +
          "&body=" + encodeURIComponent("Please add me to the Speak Thai Today list: " + mail);
      }
    });
  });
  // Back button can restore this page from the browser's cache with the button still disabled
  window.addEventListener("pageshow", function (e) {
    if (e.persisted) forms.forEach(function (f) { send(f, "CAME_BACK"); });
  });
})();
