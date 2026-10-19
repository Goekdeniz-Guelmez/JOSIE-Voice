/* Small, optional motion accents. Core page remains usable without them. */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('.pipeline-detail').forEach(function (detail) {
    detail.addEventListener('toggle', function () { window.dispatchEvent(new Event('resize')); });
  });
  var archive = document.querySelector('.gallery-archive');
  if (archive) {
    archive.addEventListener('toggle', function () {
      window.dispatchEvent(new Event('resize'));
    });
    // Deep links into the full gallery also open the archive.
    function revealLinkedScreen() {
      var target = document.getElementById(window.location.hash.slice(1));
      if (target && archive.contains(target)) {
        archive.open = true;
        requestAnimationFrame(function () { target.scrollIntoView(); });
      }
    }
    window.addEventListener('hashchange', revealLinkedScreen);
    revealLinkedScreen();
  }
  if (reduce.matches) return;

  var progress = document.createElement('div');
  progress.className = 'scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.appendChild(progress);
  var queued = false;
  function updateProgress() {
    queued = false;
    var distance = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = 'scaleX(' + (distance > 0 ? window.scrollY / distance : 0) + ')';
  }
  window.addEventListener('scroll', function () {
    if (!queued) { queued = true; requestAnimationFrame(updateProgress); }
  }, { passive: true });
  window.addEventListener('resize', updateProgress);

  var prompt = document.getElementById('conversation-prompt');
  var stage = document.querySelector('.hero-stage');
  var examples = ['“Remind me to slow down at seven.”', '“What does my day look like tomorrow?”', '“Find a quiet café nearby.”', '“Text Alex I’m ten minutes away.”'];
  var index = 0, visible = true;
  if ('IntersectionObserver' in window && stage) {
    new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; }).observe(stage);
  }
  if (prompt) setInterval(function () {
    if (!visible || document.hidden || reduce.matches) return;
    prompt.classList.add('is-changing');
    setTimeout(function () {
      index = (index + 1) % examples.length;
      prompt.textContent = examples[index];
      prompt.classList.remove('is-changing');
    }, 300);
  }, 5500);
})();
