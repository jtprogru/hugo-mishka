/* Clipboard-помощники темы:
   - кнопка «скопировать код» внутри .codeblock ([data-copy])
   - кнопка «скопировать ссылку» внутри post_share ([data-share-copy])
   Используется одна универсальная writeText с fallback на execCommand. */
(function () {
  var doneLabel = (document.documentElement.dataset.copyCodeDone) || 'Скопировано';

  function getCode(button) {
    var wrap = button.closest('.codeblock');
    if (!wrap) return null;
    var code = wrap.querySelector('pre code') || wrap.querySelector('pre');
    return code ? code.innerText : null;
  }

  function legacyCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (_) {}
    document.body.removeChild(ta);
  }

  function writeText(text, done) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () {
        legacyCopy(text);
        done();
      });
    } else {
      legacyCopy(text);
      done();
    }
  }

  function flashCode(button) {
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
    /* Code-copy внутри codeblock */
    var codeBtn = e.target.closest && e.target.closest('[data-copy]');
    if (codeBtn) {
      var text = getCode(codeBtn);
      if (text == null) return;
      writeText(text, function () { flashCode(codeBtn); });
      return;
    }

    /* Share-copy: «скопировать ссылку» в post_share */
    var shareBtn = e.target.closest && e.target.closest('[data-share-copy]');
    if (shareBtn) {
      var url = shareBtn.getAttribute('data-url') || window.location.href;
      var label = shareBtn.querySelector('[data-share-copy-label]');
      var shareDone = document.documentElement.dataset.shareCopyDone || 'Скопировано';
      var prevText = label ? label.textContent : null;
      writeText(url, function () {
        shareBtn.classList.add('is-done');
        if (label) label.textContent = shareDone;
        setTimeout(function () {
          shareBtn.classList.remove('is-done');
          if (label && prevText !== null) label.textContent = prevText;
        }, 1500);
      });
    }
  });
})();
