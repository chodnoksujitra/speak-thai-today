(function () {
  var audio = new Audio(); audio.preload = "auto";
  var current = null, queue = [], stopBtn = document.getElementById("stop"), allBtn = document.getElementById("playall");
  function mark(el, on) { if (el) el.classList.toggle("on", on); }
  function play(src, el) {
    mark(current, false); current = el || null; mark(current, true);
    audio.src = src; audio.currentTime = 0;
    var p = audio.play(); if (p && p.catch) p.catch(function () {});
    if (el && el.scrollIntoView && queue.length) el.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }
  audio.addEventListener("error", function () {
    mark(current, false);
    var box = document.querySelector(".card");
    if (box && !box.querySelector(".err")) { var p = document.createElement("p"); p.className = "err"; p.textContent = "Sound didn't load. Tap Listen again."; box.appendChild(p); }
  });
  audio.addEventListener("playing", function () { var e = document.querySelector(".err"); if (e) e.remove(); });
  audio.addEventListener("ended", function () {
    mark(current, false);
    if (queue.length) { var next = queue.shift(); setTimeout(function () { play(next.dataset.audio, next); }, 700); }
    else if (stopBtn) { stopBtn.hidden = true; }
  });
  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-audio]"); if (!el) return;
    queue = []; if (stopBtn) stopBtn.hidden = true;
    play(el.dataset.audio, el);
  });
  document.addEventListener("keydown", function (e) {
    var el = e.target.closest && e.target.closest('[data-audio][role="button"]');
    if (el && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); el.click(); }
  });
  if (allBtn) allBtn.addEventListener("click", function () {
    var tiles = Array.prototype.slice.call(document.querySelectorAll(".tile"));
    queue = tiles.slice(1); stopBtn.hidden = false; play(tiles[0].dataset.audio, tiles[0]);
  });
  if (stopBtn) stopBtn.addEventListener("click", function () { queue = []; audio.pause(); mark(current, false); stopBtn.hidden = true; });
  // ?play=1 or arriving from a QR scan: try to play once (browsers may block autoplay; the big button still works)
  var first = document.querySelector(".card [data-audio]");
  if (first) play(first.dataset.audio, null);
})();
