/* Resolve on click so new releases need no website update or hard-coded filename. */
(function () {
  var buttons = document.querySelectorAll('[data-download]');
  var status = document.getElementById('download-status');
  var releasesUrl = 'https://github.com/Goekdeniz-Guelmez/JOSIE-Voice/releases';
  var assetPrefix = releasesUrl + '/download/';
  var busy = false;

  function announce(message, fallback) {
    status.textContent = message;
    if (fallback) {
      var link = document.createElement('a');
      link.href = releasesUrl;
      link.textContent = 'View GitHub Releases ↗';
      status.appendChild(link);
    }
    status.hidden = false;
  }

  buttons.forEach(function (button) {
    button.addEventListener('click', async function (event) {
      // Preserve normal open-in-new-tab behavior and the no-JavaScript link.
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault();
      if (busy) return;
      busy = true;
      buttons.forEach(function (b) { b.setAttribute('aria-disabled', 'true'); b.setAttribute('aria-busy', 'true'); });
      announce('Finding the latest Mac download…');
      var controller = new AbortController();
      var timeout = setTimeout(function () { controller.abort(); }, 10000);
      try {
        // The list includes prereleases, which are used for JOSIE preview builds.
        var response = await fetch('https://api.github.com/repos/Goekdeniz-Guelmez/JOSIE-Voice/releases?per_page=100', {
          headers: { Accept: 'application/vnd.github+json' },
          cache: 'no-store', signal: controller.signal
        });
        if (!response.ok) throw new Error('Release lookup failed');
        var releases = await response.json();
        if (!Array.isArray(releases)) throw new Error('Invalid release list');
        releases = releases.filter(function (r) { return !r.draft && r.published_at; }).sort(function (a, b) {
          return Date.parse(b.published_at) - Date.parse(a.published_at);
        });
        var asset;
        for (var i = 0; i < releases.length && !asset; i++) {
          var dmgs = (releases[i].assets || []).filter(function (a) {
            return /\.dmg$/i.test(a.name) && !/(?:x64|x86|intel|amd64)/i.test(a.name) &&
              typeof a.browser_download_url === 'string' && a.browser_download_url.startsWith(assetPrefix);
          });
          asset = dmgs.find(function (a) { return /arm64|aarch64|universal|apple.?silicon/i.test(a.name); }) || dmgs[0];
        }
        if (!asset) {
          announce('No Mac DMG is published yet. ', true);
          return;
        }
        announce('Starting download: ' + asset.name + '. ', true);
        window.location.assign(asset.browser_download_url);
      } catch (error) {
        announce('Couldn’t reach the download right now. ', true);
      } finally {
        clearTimeout(timeout);
        busy = false;
        buttons.forEach(function (b) { b.removeAttribute('aria-disabled'); b.removeAttribute('aria-busy'); });
      }
    });
  });
})();
