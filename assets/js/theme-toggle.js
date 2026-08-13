/* Theme toggle: 3-state (auto/light/dark) cycle with localStorage persistence.
   The initial state was already applied by the inline anti-FOUC script in <head>. */
(function () {
  var order = ['auto', 'light', 'dark'];
  var html = document.documentElement;
  var mq = window.matchMedia('(prefers-color-scheme: dark)');
  var button = document.querySelector('[data-theme-toggle]');

  /* Favicon'ы под светлый и тёмный интерфейс разводит media в <head> — то есть
     по системной схеме. Ручной выбор темы системную схему не меняет, поэтому
     при явном light/dark ссылки переписываются здесь, а в режиме auto media
     возвращается на место.

     Браузер пересобирает набор иконок лениво и правку media на живом узле может
     не заметить — поэтому узлы подменяются клонами. Если тёмных вариантов на
     сайте нет, функция не делает ничего. */
  function syncFavicons(pref, effective) {
    var links = document.querySelectorAll('link[data-icon-scheme]');
    if (!links.length) return;

    var changed = false;
    for (var i = 0; i < links.length; i++) {
      var link = links[i];
      var wanted = link.getAttribute('data-icon-scheme') === effective;
      var media = pref === 'auto' ? link.getAttribute('data-icon-media') : (wanted ? 'all' : 'not all');
      if (link.media !== media) { link.media = media; changed = true; }
    }
    /* Подмена узлов стоит перезапроса иконки, поэтому делается только когда
       media реально поменялась. Иначе каждая загрузка страницы в режиме auto
       дёргала бы favicon впустую. */
    if (!changed) return;
    var fresh = document.querySelectorAll('link[data-icon-scheme]');
    for (var j = 0; j < fresh.length; j++) {
      fresh[j].replaceWith(fresh[j].cloneNode(true));
    }
  }

  function apply(pref) {
    if (order.indexOf(pref) === -1) pref = 'auto';
    var effective = pref;
    if (pref === 'auto') {
      effective = mq.matches ? 'dark' : 'light';
    }
    html.setAttribute('data-theme', effective);
    html.setAttribute('data-theme-pref', pref);
    syncFavicons(pref, effective);
    try { localStorage.setItem('theme', pref); } catch (e) {}
    if (!button) return;
    var labels = { auto: 'Тема: авто', light: 'Тема: светлая', dark: 'Тема: тёмная' };
    button.setAttribute('aria-label', labels[pref] + ' — нажмите, чтобы переключить');
    button.setAttribute('title', labels[pref]);
  }

  /* Тему на старте проставил инлайн-скрипт в <head>, но иконки он не трогает:
     в <head> ещё нет разметки, которую надо переписывать. Досинхронизируем — без
     этого выбранная руками тёмная тема после перезагрузки жила бы со светлой
     иконкой до первого клика. */
  syncFavicons(
    html.getAttribute('data-theme-pref') || 'auto',
    html.getAttribute('data-theme') || 'light'
  );

  if (!button) return;

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
