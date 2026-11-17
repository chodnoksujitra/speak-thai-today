/* Mini quiz — no server, no tracking. Data lives in <script type="application/json"> inside div.quiz

   STATE MACHINE
     quiz box   div.quiz[data-state]      answering --last question answered--> finished --tap "Try again"--> answering
     question   fieldset.q-item[data-state]  unanswered --tap an option--> correct | wrong   (locked: options are disabled)

   "finished" shows the score (role=status) and the Try again button.
   "Try again" rebuilds the questions, scrolls back to the top of the quiz and puts focus on the first option. */
(function () {
  document.querySelectorAll("div.quiz").forEach(function (box) {
    var node = box.querySelector("script[type='application/json']");
    if (!node) return;
    var data; try { data = JSON.parse(node.textContent); } catch (e) { return; }
    var qs = data.questions || [], done = 0, right = 0;
    var body = document.createElement("div");
    box.appendChild(body);
    function build() {
      done = 0; right = 0; body.innerHTML = ""; box.dataset.state = "answering";
      qs.forEach(function (q, i) {
        var f = document.createElement("fieldset"); f.className = "q-item"; f.dataset.state = "unanswered";
        var p = document.createElement("p"); p.className = "q-text";
        p.innerHTML = (i + 1) + ". " + q.q; f.appendChild(p);
        var opts = document.createElement("div"); opts.className = "q-opts";
        var why = document.createElement("p"); why.className = "q-why"; why.setAttribute("aria-live", "polite");
        q.a.forEach(function (txt, j) {
          var b = document.createElement("button"); b.type = "button"; b.className = "q-opt"; b.innerHTML = txt;
          b.addEventListener("click", function () {
            if (f.dataset.state !== "unanswered") return;
            var ok = j === q.c;
            f.dataset.state = ok ? "correct" : "wrong"; done++;
            var all = opts.querySelectorAll("button");
            all.forEach(function (x) { x.disabled = true; });
            all[q.c].classList.add("ok");
            if (ok) { right++; why.textContent = "✅ Correct! " + (q.why || ""); }
            else { b.classList.add("bad"); why.textContent = "Not quite. " + (q.why || ""); }
            if (done === qs.length) finish();
          });
          opts.appendChild(b);
        });
        f.appendChild(opts); f.appendChild(why); body.appendChild(f);
      });
    }
    function finish() {
      box.dataset.state = "finished";
      var s = document.createElement("div"); s.className = "q-score"; s.setAttribute("role", "status");
      s.innerHTML = "You got " + right + " out of " + qs.length + ". " + (right === qs.length ? "Perfect! 🎉" : "Watch the lesson once more and try again.") +
        (data.next ? ' <a href="' + data.next.href + '">' + data.next.label + "</a>" : "");
      body.appendChild(s);
      var r = document.createElement("button"); r.type = "button"; r.className = "q-again"; r.textContent = "Try again";
      r.addEventListener("click", function () {
        build();
        var first = body.querySelector("button.q-opt");
        if (first) first.focus({ preventScroll: true });
        var calm = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
        box.scrollIntoView({ block: "start", behavior: calm ? "auto" : "smooth" });
      });
      body.appendChild(r);
    }
    build();
  });
})();
