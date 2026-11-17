/* Teacher Bua audio buttons — one shared player for every /b1 /b2 /b3 lesson page.

   MARKUP   <button class="tb-play" data-src="/b1/audio/B1-L01-T01.mp3" aria-label="Play …">▶</button>

   The state of each button is written to data-state (same convention as Zag / Radix UI),
   and every allowed change is listed in MACHINE below (same shape as an XState config):
   state: { EVENT: next state }. An event that is not listed for the current state is ignored.

   To change how a state looks: edit ICON below or .tb-play[data-state=…] in teacher-bua.css. */
(function () {
  var MACHINE = {
    idle:    { TAP: "loading" },
    loading: { PLAYING: "playing", TAP: "idle", OTHER_TAPPED: "idle", ENDED: "idle", FAILED: "error" },
    playing: {                     TAP: "idle", OTHER_TAPPED: "idle", ENDED: "idle", FAILED: "error" },
    error:   { TAP: "loading" }
  };
  var ICON = { idle: "▶", loading: "❚❚", playing: "❚❚", error: "!" };
  var ERROR_TIP = "Audio could not load. Check your connection and try again.";
  var audio = new Audio(), cur = null;   // cur = the one button that is loading or playing

  function render(b, state) {
    b.dataset.state = state;
    b.textContent = ICON[state];
    var active = state === "loading" || state === "playing";
    b.classList.toggle("on", active);
    b.setAttribute("aria-pressed", active ? "true" : "false");
    if (state === "error") b.title = ERROR_TIP; else b.removeAttribute("title");
  }
  function send(b, event) {
    var next = b && MACHINE[b.dataset.state][event];
    if (next) render(b, next);
    return next;
  }
  function isCurrentFile() { return cur && audio.src === new URL(cur.getAttribute("data-src"), location.href).href; }

  audio.addEventListener("playing", function () { send(cur, "PLAYING"); });
  audio.addEventListener("ended", function () { send(cur, "ENDED"); cur = null; });
  audio.addEventListener("error", function () { if (isCurrentFile()) { send(cur, "FAILED"); cur = null; } });

  document.querySelectorAll(".tb-play[data-src]").forEach(function (b) {
    render(b, "idle");
    b.addEventListener("click", function () {
      if (cur && cur !== b) { send(cur, "OTHER_TAPPED"); cur = null; }
      if (send(b, "TAP") === "loading") {
        cur = b;
        audio.src = b.getAttribute("data-src");
        var p = audio.play();
        if (p && p.catch) p.catch(function (e) {
          if (e && e.name === "AbortError") return;      // user tapped stop or another button — not a failure
          if (cur === b) { send(b, "FAILED"); cur = null; }
        });
      } else { audio.pause(); cur = null; }
    });
  });
})();
