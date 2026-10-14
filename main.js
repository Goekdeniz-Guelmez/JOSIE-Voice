/* progressive-enhancement helpers */
(function () {
  var root = document.documentElement;
  root.classList.add("js");

  // Close other FAQ items when one opens
  var faqs = document.querySelectorAll(".x-faq details");
  faqs.forEach(function (d) {
    d.addEventListener("toggle", function () {
      if (!d.open) return;
      faqs.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });

  // Screenshot lightbox: links still open the full image when <dialog> isn't supported
  var zooms = document.querySelectorAll("a.x-zoom");
  if (zooms.length && typeof HTMLDialogElement === "function") {
    var lb = document.createElement("dialog");
    lb.className = "x-lb";
    lb.innerHTML = '<button type="button" aria-label="Close">×</button><img alt="" /><p></p>';
    document.body.appendChild(lb);
    var lbImg = lb.querySelector("img"), lbCap = lb.querySelector("p");
    lb.querySelector("button").addEventListener("click", function () { lb.close(); });
    lb.addEventListener("click", function (e) { if (e.target === lb || e.target === lbImg) lb.close(); });
    lb.addEventListener("close", function () { lbImg.removeAttribute("src"); });
    zooms.forEach(function (a) {
      a.addEventListener("click", function (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        var img = a.querySelector("img"), fig = a.closest("figure"), cap = fig && fig.querySelector("figcaption");
        lbImg.src = a.getAttribute("href");
        lbImg.alt = img ? img.alt : "";
        lbCap.textContent = cap ? cap.textContent : "";
        lb.showModal();
      });
    });
  }

  // Mark the nav link for the section in view
  var links = document.querySelectorAll(".x-nav nav a");
  if (!links.length || !("IntersectionObserver" in window)) return;
  var map = {};
  links.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var a = map[e.target.id];
      if (!a) return;
      if (e.isIntersecting) {
        links.forEach(function (l) { l.removeAttribute("aria-current"); l.style.color = ""; });
        a.setAttribute("aria-current", "true");
        a.style.color = "#fff";
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  Object.keys(map).forEach(function (id) {
    var s = document.getElementById(id);
    if (s) io.observe(s);
  });
})();
