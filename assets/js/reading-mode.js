/* Reading mode: фокус-режим для длинных постов.
   Активация — клавиша `f` (когда не в инпуте). Body получает класс
   `is-reading-mode`; всё, кроме контента поста, скрывается через CSS.

   Esc или повторное `f` — выйти. */
(function () {
  if (!document.querySelector('article.post')) return; // только на постах

  var body = document.body;
  var KEY = 'f';

  function isTyping(e) {
    var t = e.target;
    if (!t) return false;
    var tag = (t.tagName || '').toLowerCase();
    return tag === 'input' || tag === 'textarea' || tag === 'select' || t.isContentEditable;
  }

  function toggle() {
    body.classList.toggle('is-reading-mode');
  }

  function exit() {
    body.classList.remove('is-reading-mode');
  }

  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (isTyping(e)) return;
    var k = (e.key || '').toLowerCase();
    if (k === KEY) {
      e.preventDefault();
      toggle();
    } else if (k === 'escape' && body.classList.contains('is-reading-mode')) {
      exit();
    }
  });
})();
