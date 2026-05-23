/* Search.js — Fuse.js обёртка для страницы /search/.
   Грузит /index.json, инициализирует Fuse, рендерит результаты.
   Зависит от vendor/fuse.basic.min.js (определяет window.Fuse). */
(function () {
  var configEl = document.getElementById('search-config');
  if (!configEl) return; // не страница поиска
  var input = document.getElementById('search-input');
  var resultsEl = document.getElementById('search-results');
  var metaEl = document.getElementById('search-meta');
  if (!input || !resultsEl) return;

  var cfg;
  try { cfg = JSON.parse(configEl.textContent || '{}'); } catch (e) { cfg = {}; }

  var fuseDefaults = {
    isCaseSensitive: false,
    shouldSort: true,
    threshold: 0.35,
    minMatchCharLength: 2,
    ignoreLocation: true,
    includeMatches: false,
    includeScore: false,
    keys: [
      { name: 'title', weight: 0.6 },
      { name: 'summary', weight: 0.2 },
      { name: 'tags', weight: 0.15 },
      { name: 'content', weight: 0.05 }
    ]
  };
  var fuseOpts = Object.assign({}, fuseDefaults, cfg.fuse || {});

  function setMeta(text) { metaEl && (metaEl.textContent = text || ''); }

  function escape(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function render(items, query) {
    if (!items.length) {
      resultsEl.innerHTML = '';
      setMeta(query ? 'Ничего не найдено по запросу «' + query + '».' : '');
      return;
    }
    setMeta('Найдено: ' + items.length);
    var html = items.slice(0, 100).map(function (it) {
      var p = it.item || it; // Fuse 7 c/без includeScore возвращает разную форму
      var tags = (p.tags || []).slice(0, 3).map(function (t) {
        return '<span class="search-result__tag">#' + escape(t) + '</span>';
      }).join('');
      return [
        '<li class="search-result">',
        '  <a class="search-result__link" href="' + escape(p.url) + '">',
        '    <h3 class="search-result__title">' + escape(p.title) + '</h3>',
        (p.summary ? '    <p class="search-result__summary">' + escape(p.summary) + '</p>' : ''),
        (tags ? '    <div class="search-result__tags">' + tags + '</div>' : ''),
        '  </a>',
        '</li>'
      ].filter(Boolean).join('\n');
    }).join('');
    resultsEl.innerHTML = html;
  }

  var fuse = null;
  var data = null;

  function ensureFuse(cb) {
    if (fuse) return cb();
    setMeta('Загружаю индекс…');
    fetch(cfg.indexUrl || '/index.json', { credentials: 'same-origin' })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (json) {
        data = json;
        if (typeof window.Fuse !== 'function') {
          throw new Error('Fuse.js не загружен');
        }
        fuse = new window.Fuse(data, fuseOpts);
        setMeta('Индекс готов: ' + data.length + ' постов.');
        cb();
      })
      .catch(function (err) {
        setMeta('Не удалось загрузить индекс: ' + err.message);
      });
  }

  function runSearch(query) {
    query = (query || '').trim();
    if (!query) { render([], ''); return; }
    ensureFuse(function () {
      var results = fuse.search(query);
      render(results, query);
    });
  }

  // debounce
  var t;
  input.addEventListener('input', function () {
    clearTimeout(t);
    var q = input.value;
    t = setTimeout(function () { runSearch(q); }, 120);
  });

  // Поддержка ?q=... в URL
  var params = new URLSearchParams(window.location.search);
  var q0 = params.get('q');
  if (q0) {
    input.value = q0;
    runSearch(q0);
  } else {
    // Прогреем индекс заранее, пока юзер пишет
    ensureFuse(function () { /* idle */ });
  }
})();
