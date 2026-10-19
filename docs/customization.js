/* Progressive tabs: without JavaScript all customization panels remain readable. */
(function () {
  var explorer = document.querySelector('.custom-explorer');
  if (!explorer) return;
  // Keep every panel readable if the component stylesheet did not arrive.
  if (window.getComputedStyle(explorer).getPropertyValue('--customization-ready').trim() !== '1') return;
  explorer.querySelectorAll('.custom-more').forEach(function (detail) {
    detail.addEventListener('toggle', function () { window.dispatchEvent(new Event('resize')); });
  });
  var tabs = Array.from(explorer.querySelectorAll('[role="tab"]'));
  var panels = tabs.map(function (tab) { return document.getElementById(tab.getAttribute('aria-controls')); });
  if (!tabs.length || panels.some(function (panel) { return !panel; })) return;

  function select(index, focus) {
    tabs.forEach(function (tab, i) {
      tab.setAttribute('aria-selected', String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
      panels[i].hidden = i !== index;
    });
    if (focus) tabs[index].focus();
    // Recalculate scroll extent when a panel changes height.
    window.dispatchEvent(new Event('resize'));
  }
  tabs.forEach(function (tab, index) {
    tab.addEventListener('click', function () { select(index, false); });
    tab.addEventListener('keydown', function (event) {
      var next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault();
      select(next, true);
    });
  });
  explorer.classList.add('is-enhanced');
  select(0, false);
})();
