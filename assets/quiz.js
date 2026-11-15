/* Mini quiz — no server, no tracking. Data lives in <script type="application/json"> inside div.quiz */
(function () {
  document.querySelectorAll("div.quiz").forEach(function (box) {
    var node = box.querySelector("script[type='application/json']");
    if (!node) return;
    var data; try { data = JSON.parse(node.textContent); } catch (e) { return; }
    var qs = data.questions || [], done = 0, right = 0;
    var body = document.createElement("div");
    box.appendChild(body);
    function build() {
      done = 0; right = 0; body.innerHTML = "";
      qs.forEach(function (q, i) {
        var f = document.createElement("fieldset"); f.className = "q-item";
        var p = document.createElement("p"); p.className = "q-text";
        p.innerHTML = (i + 1) + ". " + q.q; f.appendChild(p);
        var opts = document.createElement("div"); opts.className = "q-opts";
        var why = document.createElement("p"); why.className = "q-why"; why.setAttribute("aria-live", "polite");
        q.a.forEach(function (txt, j) {
          var b = document.createElement("button"); b.type = "button"; b.className = "q-opt"; b.innerHTML = txt;
          b.addEventListener("click", function () {
            if (f.dataset.done) return; f.dataset.done = "1"; done++;
            var all = opts.querySelectorAll("button");
            all.forEach(function (x) { x.disabled = true; });
            all[q.c].classList.add("ok");
            if (j === q.c) { right++; why.textContent = "✅ Correct! " + (q.why || ""); }
            else { b.classList.add("bad"); why.textContent = "Not quite. " + (q.why || ""); }
            if (done === qs.length) finish();
          });
          opts.appendChild(b);
        });
        f.appendChild(opts); f.appendChild(why); body.appendChild(f);
      });
    }
    function finish() {
      var s = document.createElement("div"); s.className = "q-score"; s.setAttribute("role", "status");
      s.innerHTML = "You got " + right + " out of " + qs.length + ". " + (right === qs.length ? "Perfect! 🎉" : "Watch the lesson once more and try again.") +
        (data.next ? ' <a href="' + data.next.href + '">' + data.next.label + "</a>" : "");
      body.appendChild(s);
      var r = document.createElement("button"); r.type = "button"; r.className = "q-again"; r.textContent = "Try again";
      r.addEventListener("click", build); body.appendChild(r);
    }
    build();
  });
})();
