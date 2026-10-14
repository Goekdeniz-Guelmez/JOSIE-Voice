/* Hark: progressive-enhancement helpers */
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
