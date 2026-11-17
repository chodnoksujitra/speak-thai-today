/* Hear and Learn pages (/k/, /k/all/, /k/NN/) — one shared audio player.

   MARKUP   any element with data-audio="…mp3" plays on tap · #playall and #stop exist on the grid pages only

   The player state is written to <html data-player="…"> (data-state convention of Zag / Radix UI),
   and every allowed change is listed in MACHINE below (same shape as an XState config):
   state: { EVENT: next state }. An event that is not listed for the current state is ignored.

     idle     nothing is playing
     single   one sound: a tapped letter, the Listen button, or the auto-play try when the page opens
     queue    "Play all" is running (GAP_MS pause between letters) · the Stop button shows only here
     error    the last sound did not load; a message is on screen

   The element that is sounding gets class "on" and data-state="playing". */
(function () {
  var MACHINE = {
    idle:   { TAP: "single", PLAY_ALL: "queue" },
    single: { TAP: "single", PLAY_ALL: "queue", ENDED: "idle", FAILED: "error", BLOCKED: "idle" },
    queue:  { TAP: "single", PLAY_ALL: "queue", NEXT: "queue", ENDED: "idle", FAILED: "error", STOP: "idle" },
    error:  { TAP: "single", PLAY_ALL: "queue" }
  };
  var GAP_MS = 700;
  var root = document.documentElement;
  var audio = new Audio(); audio.preload = "auto";
  var current = null, queue = [], timer = null;
  var stopBtn = document.getElementById("stop"), allBtn = document.getElementById("playall");

  function render(state) { root.dataset.player = state; if (stopBtn) stopBtn.hidden = state !== "queue"; }
  function send(event) {
    var next = MACHINE[root.dataset.player][event];
    if (next) render(next);
    return next;
  }
  function mark(el, on) {
    if (!el) return;
    el.classList.toggle("on", on);
    if (on) el.dataset.state = "playing"; else delete el.dataset.state;
  }
  function cancelNext() { clearTimeout(timer); timer = null; }   // a waiting "next letter" must never fire after a tap or Stop
  function clearMessage() { var e = document.querySelector(".err"); if (e) e.remove(); }
  function showMessage() {
    var box = document.querySelector(".card, .intro");
    if (!box || box.querySelector(".err")) return;
    var p = document.createElement("p"); p.className = "err"; p.setAttribute("role", "alert");
    p.textContent = box.classList.contains("card") ? "Sound didn't load. Tap Listen again." : "Sound didn't load. Tap the letter again.";
    box.appendChild(p);
  }
  function silence() { cancelNext(); queue = []; mark(current, false); current = null; }

  function start(src, el) {
    mark(current, false); current = el || null; mark(current, true);
    audio.src = src; audio.currentTime = 0;
    var p = audio.play();
    if (p && p.catch) p.catch(function (e) {
      // auto-play blocked by the browser: stay quiet, the buttons still work
      if (e && e.name === "NotAllowedError" && audio.paused && send("BLOCKED")) silence();
    });
    if (el && el.scrollIntoView && root.dataset.player === "queue") el.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }

  audio.addEventListener("playing", clearMessage);
  audio.addEventListener("error", function () { if (send("FAILED")) { silence(); showMessage(); } });
  audio.addEventListener("ended", function () {
    mark(current, false);
    if (queue.length && send("NEXT")) {
      var next = queue.shift();
      timer = setTimeout(function () { start(next.dataset.audio, next); }, GAP_MS);
    } else if (send("ENDED")) { current = null; }
  });

  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-audio]"); if (!el) return;
    cancelNext(); queue = []; send("TAP");
    start(el.dataset.audio, el);
  });
  document.addEventListener("keydown", function (e) {
    var el = e.target.closest && e.target.closest('[data-audio][role="button"]');
    if (el && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); el.click(); }
  });
  if (allBtn) allBtn.addEventListener("click", function () {
    var tiles = Array.prototype.slice.call(document.querySelectorAll(".tile"));
    if (!tiles.length) return;
    cancelNext(); queue = tiles.slice(1); send("PLAY_ALL");
    start(tiles[0].dataset.audio, tiles[0]);
  });
  if (stopBtn) stopBtn.addEventListener("click", function () { if (send("STOP")) { audio.pause(); silence(); } });

  render("idle");
  // Arriving from a QR scan: try to play once (browsers may block auto-play; the big button still works)
  var first = document.querySelector(".card [data-audio]");
  if (first) { send("TAP"); start(first.dataset.audio, null); }
})();
