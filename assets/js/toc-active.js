/* TOC scroll-spy: подсвечивает ссылку в .toc для текущего видимого заголовка. */
(function () {
  var toc = document.querySelector('.toc');
  if (!toc) return;
  var content = document.querySelector('.post__content');
  if (!content) return;

  var headings = content.querySelectorAll('h2[id], h3[id], h4[id]');
  if (!headings.length) return;

  var links = toc.querySelectorAll('a[href^="#"]');
  if (!links.length) return;

  var byId = new Map();
  links.forEach(function (a) {
    var id = decodeURIComponent((a.getAttribute('href') || '').replace(/^#/, ''));
    if (id) byId.set(id, a);
  });

  function setActive(id) {
    links.forEach(function (a) { a.classList.remove('is-active'); });
    var link = byId.get(id);
    if (link) {
      link.classList.add('is-active');
      // Прокручиваем список TOC к активной ссылке (если он скроллится)
      var rect = link.getBoundingClientRect();
      var tocRect = toc.getBoundingClientRect();
      if (rect.top < tocRect.top || rect.bottom > tocRect.bottom) {
        link.scrollIntoView({ block: 'nearest' });
      }
    }
  }

  if (typeof IntersectionObserver === 'undefined') return;

  var visible = new Set();
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) visible.add(e.target.id);
      else visible.delete(e.target.id);
    });
    // Берём «первый по DOM» из видимых
    var firstId = null;
    headings.forEach(function (h) { if (!firstId && visible.has(h.id)) firstId = h.id; });
    if (firstId) setActive(firstId);
  }, { rootMargin: '-80px 0px -65% 0px', threshold: [0, 1] });

  headings.forEach(function (h) { observer.observe(h); });
})();
