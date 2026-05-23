/* Code-copy: кнопка «скопировать» на каждом codeblock.
   Слушает клики через делегирование, чтобы работать с динамически
   добавленными блоками (если такие появятся). */
(function () {
  var doneLabel = (document.documentElement.dataset.copyCodeDone) || 'Скопировано';
  var copyLabel = (document.documentElement.dataset.copyCode) || 'Скопировать';

  function getCode(button) {
    var wrap = button.closest('.codeblock');
    if (!wrap) return null;
    var code = wrap.querySelector('pre code') || wrap.querySelector('pre');
    return code ? code.innerText : null;
  }

  function flash(button) {
    var prev = button.getAttribute('aria-label');
    button.classList.add('is-done');
    button.setAttribute('aria-label', doneLabel);
    button.setAttribute('title', doneLabel);
    setTimeout(function () {
      button.classList.remove('is-done');
      if (prev) {
        button.setAttribute('aria-label', prev);
        button.setAttribute('title', prev);
      }
    }, 1500);
  }

  document.addEventListener('click', function (e) {
    var button = e.target.closest && e.target.closest('[data-copy]');
    if (!button) return;
    var text = getCode(button);
    if (text == null) return;
    var done = function () { flash(button); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () {
        /* fallback */
        var ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch (_) {}
        document.body.removeChild(ta);
        done();
      });
    } else {
      var ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch (_) {}
      document.body.removeChild(ta);
      done();
    }
  });
})();
