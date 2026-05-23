/* Theme toggle: 3-state (auto/light/dark) cycle with localStorage persistence.
   The initial state was already applied by the inline anti-FOUC script in <head>. */
(function () {
  var order = ['auto', 'light', 'dark'];
  var button = document.querySelector('[data-theme-toggle]');
  if (!button) return;

  var html = document.documentElement;
  var mq = window.matchMedia('(prefers-color-scheme: dark)');

  function apply(pref) {
    if (order.indexOf(pref) === -1) pref = 'auto';
    var effective = pref;
    if (pref === 'auto') {
      effective = mq.matches ? 'dark' : 'light';
    }
    html.setAttribute('data-theme', effective);
    html.setAttribute('data-theme-pref', pref);
    try { localStorage.setItem('theme', pref); } catch (e) {}
    var labels = { auto: 'Тема: авто', light: 'Тема: светлая', dark: 'Тема: тёмная' };
    button.setAttribute('aria-label', labels[pref] + ' — нажмите, чтобы переключить');
    button.setAttribute('title', labels[pref]);
  }

  button.addEventListener('click', function () {
    var current = html.getAttribute('data-theme-pref') || 'auto';
    var next = order[(order.indexOf(current) + 1) % order.length];
    apply(next);
  });

  // Если выбран `auto`, реагируем на смену системной темы.
  if (typeof mq.addEventListener === 'function') {
    mq.addEventListener('change', function () {
      if ((html.getAttribute('data-theme-pref') || 'auto') === 'auto') apply('auto');
    });
  } else if (typeof mq.addListener === 'function') {
    // Safari < 14
    mq.addListener(function () {
      if ((html.getAttribute('data-theme-pref') || 'auto') === 'auto') apply('auto');
    });
  }
})();
