/* Email signup — Speak Thai Today
   ต้อมต้องใส่ลิงก์ฟอร์มของบริการอีเมล (MailerLite / Kit / Buttondown) ที่ FORM_ACTION ครั้งเดียว
   - ว่างไว้ = โหมดสำรอง: เปิดอีเมลหา hello@myfirstthai.com (ยังไม่เก็บรายชื่ออัตโนมัติ)
   - ใส่แล้ว = ส่งอีเมลเข้าบริการ แล้วพาไปหน้า /thanks/ ที่มีไฟล์ใบงานให้ดาวน์โหลด */
(function () {
  // Brevo form "Free Thai Worksheets" → list "Free Thai Worksheets" (ตั้งค่า 14 พ.ย. 2026)
  var FORM_ACTION = "https://85e2190f.sibforms.com/serve/MUIFAMK8w4Jo-ntfGTcWPMWOV4vHmYOWCSvpe83Ut6CzRT2mx8FO1OZxmXUxKVSru_2yDQh-tijt4hlTz-NXU43WOmSBnL8zA5gcymAL_Q1gfnCLcbvMP0v28h8tz078jMCfAFg0nLhdQVUp3Z0pznlr9qkI13fah2E1PvaWc7hhkSUoveViuH6eyvvpykszHfLp2aNC7wJVtJmQmA==";
  var EMAIL_FIELD = "EMAIL";       // ชื่อช่องอีเมลของ Brevo
  var FALLBACK_TO = "hello@myfirstthai.com";

  document.querySelectorAll("form[data-signup]").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var hp = f.querySelector(".hp input");
      if (hp && hp.value) return;                       // บอตกรอกช่องซ่อน
      var mail = (f.querySelector("input[type=email]").value || "").trim();
      var msg = f.querySelector(".msg");
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(mail)) {
        msg.textContent = "Please enter a valid email address.";
        msg.style.display = "block"; return;
      }
      if (FORM_ACTION) {
        var body = new FormData(); body.append(EMAIL_FIELD, mail);
        body.append("email_address_check", ""); body.append("locale", "en");   // ช่องที่ Brevo ต้องการ
        fetch(FORM_ACTION, { method: "POST", body: body, mode: "no-cors" })
          .then(function () { location.href = "/thanks/"; })
          .catch(function () { location.href = "/thanks/"; });
      } else {
        location.href = "mailto:" + FALLBACK_TO +
          "?subject=" + encodeURIComponent("Send me the free Thai worksheets") +
          "&body=" + encodeURIComponent("Please add me to the Speak Thai Today list: " + mail);
      }
    });
  });
})();
