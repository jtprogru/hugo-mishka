# Changelog

Все заметные изменения в `hugo-mishka` фиксируются здесь.
Формат — [Keep a Changelog](https://keepachangelog.com/ru/1.1.0/), версии — [Semantic Versioning](https://semver.org/lang/ru/).

## [Unreleased]

### Added

- Логотип и favicon умеют разные варианты для светлой и тёмной темы. Логотип — через `params.label.iconDark`: в разметку идут обе картинки, лишнюю прячет CSS по `data-theme`, потому что подмена `src` по событию моргала бы не тем логотипом, пока не отработает JS. Favicon — через парные параметры с суффиксом `_dark` (`favicon_dark`, `favicon16x16_dark`, `favicon32x32_dark`), которые разводятся по `prefers-color-scheme`. Пары независимы, иконка без пары выводится как раньше. `apple-touch-icon` и `mask-icon` пар не имеют: iOS media у иконки не читает, а `mask-icon` одноцветный по устройству — его цвет теперь настраивается через `assets.safari_pinned_tab_color` вместо захардкоженного.
- `theme-toggle.js` синхронизирует favicon с выбранной темой: `media` знает про системную схему, а не про переключатель в шапке, поэтому при явном light/dark ссылки переписываются, а в `auto` управление возвращается media-запросу. Сверка делается и на старте — иначе выбранная тёмная тема после перезагрузки жила бы со светлой иконкой до первого клика.
- Favicon'ы вынесены из `head.html` в отдельный партиал `_partials/head_favicons.html`.

### Changed

- **Тема переехала на дизайн-систему [`@jtprogru/mishka-ds`](https://github.com/jtprogru/mishka-ds).** Цвет, типографика, каркас, компоненты и обвязка сайта больше не объявляются в теме: собранные слои системы лежат вендорной копией в `assets/css/vendor/mishka-ds/` и обновляются `./scripts/sync-ds.sh`. Раньше одно и то же жило копиями в блоге, резюме и презентациях, и копии расходились. Разметку править не пришлось: имена классов в системе совпадают с шаблонами один-в-один.
- Удалены модули, чью роль взял пакет: `00-vars`, `01-reset`, `02-fonts`, `02-typography`, `03-layout`, `03-page-header`, `04-header`, `05-footer`, `06-profile`, `07-post-card`, `08-post-single`, `10-callouts`, `11-code`, `13-kbd`, `14-footnotes`, `15-tags`, `17-mermaid`, `30-related`, `35-post-endnote`, `90-utilities`, `95-print`, `99-a11y`. В `css/modules/` осталась Hugo-специфика: TOC, поиск, chroma, формулы, архив, 404, действия над постом, перевод, режим чтения.
- **Шрифты: PT Sans → IBM Plex Sans, плюс self-hosted Iosevka на код.** Моноширинный раньше был объявлен в `--font-mono`, но не хостился — код показывался системным SF Mono. Оба начертания в 400 и 700, курсив настоящий. Метрики другие: строки в колонке 720px переносятся иначе, чем раньше.
- Локальные модули переведены на канонические имена токенов (`--fg`, `--bg-elev`, `--c-tip` вместо `--text`, `--bg-elevated`, `--success`), поэтому слой совместимости из пакета не подключается. Вместе с ненужным теме `themes-scoped.css` это минус 11 КБ инлайн-CSS.
- Mermaid рисуется палитрой системы: `_partials/mermaid_init.html` берёт `themeVariables` из `assets/mermaid/*.json` вместо встроенных тем `default` / `dark`.
- Два значения изменились по существу — обе правки исправляют проваленный контраст: `--accent-600` на светлой теме затемнён `#209fb5` → `#1c8a9d` (было 2.78:1, не проходило AA large), `--fg-subtle` на тёмной поднят `#8087a2` → `#939ab7` (было 4.14:1).
- **Лицензия: MIT → PolyForm Noncommercial 1.0.0.** Стили системы распространяются под PolyForm, и раздавать их под MIT в составе темы нельзя. Теги, выпущенные до перехода, остаются под MIT. Шрифты — SIL OFL 1.1, тексты лицензий лежат рядом с бинарниками в `static/fonts/`.
- `BRANDING.md` перестал быть источником правды: значения живут в токенах пакета, документ остаётся как история решений с пометкой о трёх местах, где он разошёлся с системой.

### Fixed

- `--section-gap` переехала из `.home` в `:root`. Переменная объявлялась только на главной, а `.section-title` используется ещё и на `/projects/` — там `var(--section-gap)` не резолвился, всё объявление `margin` становилось invalid at computed-value time и схлопывалось в `0`, забирая с собой и валидный нижний отступ. Заголовки групп проектов сидели вплотную к своим сеткам.
- `.taxonomy` больше не объявлялся дважды в `07-post-card.css`.

- Search: `indexUrl` в `<script id="search-config">` больше не получает двойной JSON-escape — внутри `<script type="application/json">` Go html/template сам JSON-escape'ит значения, а отдельные `jsonify` поверх давали `"indexUrl":"\"/index.json\""`. После `JSON.parse` получалась строка с кавычками внутри, fetch шёл на `/search/%22/index.json%22` → 404. Чиним: dict собирается один раз и отдаётся через `jsonify | safeJS`.
- Search: опции Fuse.js теперь читаются из `site.Data.fuse` (приоритет) с fallback на `site.Params.fuseOpts`. Hugo lower-case'ит ключи в Params (`isCaseSensitive` → `iscasesensitive`), и Fuse такие ключи игнорировал — поиск работал на дефолтах. Data-файлы сохраняют case как написано. Пример — `exampleSite/data/fuse.yaml`.
- PWA: `_partials/pwa_register.html` обёрнут в `{{- if $enabled -}}…{{- end -}}` — `{{ return }}` в Hugo не делает early-exit (только задаёт возвращаемое значение partial'а), поэтому при `params.PWA.enabled: false` partial всё равно выводил `<link rel=manifest>` и `<script>register>` и копировал `sw.js` в output. Теперь без PWA partial действительно ничего не выводит.

### Added

- Footer: блок навигации в средней колонке отключается через `params.ShowFooterNav: false` (дефолт `true`, поведение не меняется). При выключении колонка не рендерится вовсе — не пустой `<div>`, — а `.footer__inner` получает модификатор `--no-nav` и на десктопе становится двухколоночным (`2fr 1fr`: copyright | social).
- Post endnote: партиал `_partials/post_endnote.html` + CSS-модуль `35-post-endnote.css` — авторская приписка под текстом поста (подписка, закрытый проект, курс, сбор). Содержимое целиком из конфига `params.postEndnote.{enabled,icon,title,text,url,linkText,nofollow,note}` (`note` — вторая строка под чертой, для служебных ссылок вроде чата и канала), тема ничего не зашивает; `text` проходит через `markdownify`. Рендерится только на постах (`Type == "post"` или `Section ∈ mainSections`), per-page выключение — фронтматтер `endnote: false`; без `url` блок не выводится. Имена классов нейтральные (`post-endnote`, а не promo/cta/sponsor) — cosmetic-фильтры адблокеров режут такие селекторы вместе с содержимым, та же логика, что в `post_share.html`. Блок скрыт в reading-mode и в печати. Новые SVG-иконки `lock` и `sponsr`.
- Projects: отдельная страница `/projects/` и опциональный блок «Мои проекты» на главной. Новый layout `layouts/projects.html` — полная сетка из `data/projects.yaml` с группировкой по `status` (`active` / `maintenance` / `archived`) и фильтром по языку (чипы + inline-JS, скрывает пустые группы). Партиал `_partials/projects.html` для главной респектит лимит и сортирует `featured` → `active` → остальное, рисует ссылку «Все проекты →». Карточка вынесена в `_partials/proj_card.html` и переиспользуется обоими местами; новые модификаторы `.proj-card--featured` (accent-полоска слева), `.proj-card--archived` (приглушённая), `.proj-card__badge--{featured,maintenance,archived}`. Конфиг блока на главной — `params.homeSections.projects.{enabled,featuredOnly,limit,moreLink}`: `enabled` (дефолт `true`) включает блок, `featuredOnly: true` показывает только `featured: true` (иначе featured→active→остальное), `limit` (дефолт 6) — потолок карточек, `moreLink` — ссылка под сеткой. Расширенная schema yaml: `status`, `featured: true`, `tags: [...]` (все опциональны, обратно-совместимо). i18n-строки `projects_*` (ru/en) с плюрализацией для счётчика. exampleSite дополнен `content/projects.md` и конфигом.
- RSS full-text: свой `layouts/index.rss.xml` отдаёт `.Content` целиком вместо `.Summary`, с inline-CSS (типографика, code, blockquote, картинки), `<dc:creator>`, `<media:thumbnail>` для cover, `<category>` из тегов и категорий, `<content:encoded>` в CDATA. Опции: `params.rssFullContent` (по умолчанию true) — false возвращает дефолтное поведение, `params.rssLimit` (по умолчанию 20).
- PWA (manifest + service worker + offline): `assets/js/sw.js` с network-first для HTML и cache-first для статики, `layouts/offline.html` страница-fallback, partial `_partials/pwa_register.html` — регистрация SW и подключение manifest. Опт-ин через `params.PWA.enabled: true` + `params.PWA.manifestPath` + `params.PWA.themeColor`. Manifest пользователь кладёт в `static/manifest.json` (пример в exampleSite). SW отдаётся по стабильному `/sw.js` без minify/fingerprint, чтобы scope `'/'` не ломался между релизами. i18n `offline_*` (ru/en).
- High-contrast палитра: `@media (prefers-contrast: more)` в `00-vars.css` для обеих тем — чистый чёрный/белый, усиленные границы, без полупрозрачности. Срабатывает автоматически у пользователей с системной настройкой high-contrast.
- Pinned posts: фронтматтер `pinned: true` поднимает пост наверх в `latest_posts` на главной и в `list.html` (на текущей странице пагинации). Карточки получают `.post-card--pinned` (тонкая accent-полоска слева) и `★`-badge в заголовке. CSS `.badge` / `.badge--pinned` в `15-tags.css`. i18n `pinned` (ru/en).
- Reading mode: клавиша `f` переключает body-класс `is-reading-mode`, скрывающий header/footer/share/related/edit/toc/cover/nav. Esc выходит. `assets/js/reading-mode.js` (~30 строк) + CSS `34-reading-mode.css`. Подсказка `f / esc` появляется в углу при hover. Активируется только на single-страницах поста.
- AVIF в render-image: render-hook теперь умеет генерировать `<source type="image/avif">` как первый источник в `<picture>`, перед WebP и оригинальным JPG/PNG. Опт-ин через `params.renderImageAvif: true` (по умолчанию off — Hugo Extended на некоторых платформах кодирует AVIF в 0-байтные файлы). Качество и max-width настраиваются: `renderImageAvifQ` (60), `renderImageWebpQ` (85), `renderImageMaxW` (1200).
- Шорткоды `audio`, `video`, `rawhtml`, `ltr`, `rtl`. `audio`/`video` оборачивают HTML5-плееры в `<figure class="media">` с подписью; поддержка нескольких форматов через `sources="mp3,ogg"` или `sources="mp4,webm"`. `rawhtml` — passthrough `safeHTML`. `ltr`/`rtl` — обёртки `<div dir="...">` с `lang`. CSS `.media` в `08-post-single.css`; i18n `audio_unsupported` / `video_unsupported` (ru/en). Демо: `exampleSite/content/posts/all-shortcodes.md`.
- Footer git-commit info: `footer_copyright.html` опционально выводит короткий SHA текущей сборки. Источник: ENV `HUGO_COMMIT` (приоритет, в whitelist Hugo по умолчанию) или `params.commit`. Если задан `params.commitURL` (printf-шаблон с `%s`) — SHA становится ссылкой. CSS-стили в `05-footer.css`. i18n `footer_commit_title` (ru/en).
- Comments hook: партиал `_partials/comments.html` — пустой stub по умолчанию. Опт-ин через `params.ShowComments: true` или frontmatter `comments: true`. Тема не привязана к комментарной системе — переопредели partial в проекте под Giscus/Disqus/commento. i18n `comments_label` (ru/en). README дополнен примером переопределения и описанием всех extend-хуков (`extend_head`, `extend_footer`, `extend_post_content`, `comments`).
- OpenGraph и Twitter cards вынесены в отдельные partials темы (`_partials/opengraph.html`, `_partials/twitter_cards.html`). Проект может переопределить любой из них. Фиксы поверх builtin: `og:locale` в формате `ll_CC` (например `ru_RU` вместо `ru`), `og:image:alt` / `og:image:width` / `og:image:height` из `cover`, `article:author`, динамический `twitter:card` (`summary_large_image` при наличии cover).
- Archives page: `layouts/archives.html` + CSS-модуль `19-archive.css`. Подключается через `layout: "archives"` на контентной странице. Группирует посты из `mainSections` по году; на десктопе год прилипает слева sticky, посты идут справа. Поддержка i18n-плюрализации (`archives_total`). Демо: `exampleSite/content/archives.md`.
- Шесть новых CSS-модулей: `13-kbd.css`, `14-footnotes.css`, `15-tags.css`, `20-404.css`, `90-utilities.css` (с `.visually-hidden` и базовыми утилитами), `95-print.css` (печатные стили — скрывает интерактив, разворачивает контент во всю ширину, добавляет URL ссылок после текста). Существующие правила вынесены из `07-post-card.css`, `08-post-single.css`, `10-callouts.css`, `31-share.css` без визуальных изменений.
- 404-страница перерисована: `not-found__code` (крупный «404»), заголовок и текст из i18n, кнопки «Главная» / «Поиск». Без `style=""` в HTML.
- KaTeX как альтернативный рендерер математики. `_partials/math.html` стал диспетчером, вызывающим `_partials/mathjax.html` или `_partials/katex.html` по `params.mathRenderer` ("mathjax" | "katex"). По умолчанию — `mathjax` (без breaking change). KaTeX подключается с jsDelivr (CSS + JS + contrib/auto-render) с возможностью переопределить версию (`params.katexVersion`) или адреса (`params.katex{Css,Js,AutoRender}Src`).
- Translation list: партиал `_partials/translation_list.html` + CSS-модуль `33-translation.css`. Показывает ссылки на переводы текущей страницы (из `.Translations`), если они есть — для моноязычных сайтов ничего не рендерит. Интегрирован в шапку single. i18n-строка `translations_label` (ru/en).
- Telegram Instant View support: новые мета-теги в `head_meta.html` — `article:author`, `og:image:alt` / `og:image:width` / `og:image:height` (если заданы в `cover`), и опциональный `te:channel` (из `params.telegramChannel`). Стартовый IV-template для Telegram IV Editor лежит в `docs/telegram-instant-view.iv` — копируется в редактор и адаптируется под путь постов сайта. В README добавлен раздел «Telegram Instant View» с инструкцией.
- GFM-style alerts в markdown: `> [!NOTE]`, `> [!TIP]`, `> [!IMPORTANT]`, `> [!WARNING]`, `> [!CAUTION]` рендерятся через `layouts/_default/_markup/render-blockquote.html` в тот же стиль `.callout`, что и shortcode `{{< callout >}}`. Опциональный кастомный заголовок: `> [!TIP] My title`. Дефолтные заголовки локализованы (i18n `alert_*`).
- Новый тип callout `important` (акцентный цвет темы) + иконка `zap` в `_partials/svg.html`. Доступен и через shortcode (`type="important"`), и через GFM-alert (`> [!IMPORTANT]`).
- Related posts: партиал `_partials/related.html` + CSS-модуль `30-related.css`. Использует встроенный Hugo-механизм `site.RegularPages.Related` поверх `related:` конфига сайта. Опции: `params.ShowRelatedPosts` (по умолчанию `true`), `params.relatedMax` (по умолчанию `4`), per-page переопределение через frontmatter `related: false`.
- Share buttons: партиал `_partials/post_share.html` + CSS `31-share.css`. Каналы: Telegram, X (Twitter), LinkedIn, Email, copy-link. Опт-ин через `params.ShowShareButtons`, выбор каналов — `params.ShareButtons`, per-page выкл — `share: false`. Copy-link использует общий clipboard-handler из `code-copy.js`. i18n-строки `share_*` (ru/en) и `data-share-copy-done` на `<html>`.
- Edit-on link: партиал `_partials/edit_post.html` + CSS `32-edit-post.css`. Конфиг через `params.editPost.{URL, Text, appendFilePath}` в духе PaperMod. Per-page override через `editPostURL`, выкл через `editPost: false`.
- SVG-иконки `mail`, `share`, `edit`, `link` в `_partials/svg.html`.

### Changed

- Единая шапка страницы: новый партиал `_partials/page_header.html` и CSS-модуль `03-page-header.css`. Раньше `list`, `term`, `taxonomy`, `archives`, `projects` и `search` рисовали шапку каждый своим классом со своим размером `h1` — на соседних пунктах меню заголовки отличались (48 / 36 / 36 / 30 / 30px), состав шапки тоже плавал. Теперь один компонент: `.page-header` с опциональными `kicker` / `lede` / `intro` / `meta`. Размер h1 задаётся токеном `--page-title-size` (`--fs-3xl`, на ≥768px `--fs-4xl`) и общий для поста и хаб-страниц. `.post__title` намеренно оставлен отдельным именем класса в том же правиле — на него завязан селектор в `docs/telegram-instant-view.iv`. Удалены `.list__header/__title/__kicker/__count`, `.taxonomy__header/__title/__count`, `.search__header/__title`, `.archives__header/__title/__intro/__count`, `.projects-page__header/__title/__lede/__intro/__count`.
- `--container-width` поднят с 1100px до 1200px, локальные `max-width: 1200px` на `.home--profile`, `.home--list` и `.projects-page` удалены. Ширина у всех страниц теперь одна и задаётся одним токеном.
- Вертикальный отступ корневого блока страницы вынесен в токен `--page-pad-block` и применён к `.post`, `.list`, `.archives`, `.search`, `.projects-page`, `.taxonomy`, `.home`. Раньше `.post` и `.archives` брали `padding-block: var(--gap-lg) var(--gap-xl)`, остальные — `var(--gap-xl)`, и заголовки на соседних страницах стояли на разной высоте.
- `breadcrumbs.html` вызывается теперь во всех хаб-шаблонах — `list`, `term`, `taxonomy` и `search` его не звали. Гейт прежний (`site.Params.ShowBreadCrumbs`), поведение по умолчанию не меняется.
- Single-страница больше не ограничена `main--narrow` (узкая колонка `--content-width`) — пост рендерится во всю ширину `.container` (как шапка сайта).
- TOC растягивается на полную ширину контейнера — раньше на десктопе принудительно ограничивался `--content-width` (720px), что после расширения single-страницы выглядело обрезанным.
- Share-блок теперь icon-only: круглые 40×40 кнопки без подписи каналов, `title` и `aria-label` остались. Copy-кнопка хранит обновляемую sr-only-строку для скринридеров через `.visually-hidden`.
- Edit-link перенесён из подвала поста в шапку — рядом с `post_meta`. На десктопе выровнен справа от мета-строки, на мобиле — на новой строке.
- `.Description` больше не рендерится в шапке single-страницы — она остаётся только в `<meta name="description">`, `og:description`, `twitter:description`. Хабит — единый источник правды для SEO/OG, без визуального дублирования.

### Fixed

- `svg.html`: корректная обработка вызовов без `label` — раньше из-за `printf "%q"` на `nil` в HTML попадал мусор вида `aria-label=%!q(<nil>)`.

## [0.1.0] — 2026-05-23

Первый публичный релиз.

### Added

- Каркас темы: `baseof`, `home`, `list`, `single`, `404`, `search`, `taxonomy`, `term`.
- Mobile-first вёрстка от 320px до широких десктопов, type scale 1.250.
- Дизайн-система через CSS-переменные: тёплая «бумажная» палитра, ржавый акцент, переменные размеров/отступов/радиусов в `modules/00-vars.css`.
- Светлая/тёмная тема: авто по `prefers-color-scheme` + 3-state-тогглер `auto/light/dark` с `localStorage` и anti-FOUC (inline `<script>` до CSS).
- Главная: `profile-mode` с аватаром, hero-блоком, сеткой проектов из `data/projects.yaml`, сеткой свежих постов.
- Render-hooks:
  - `render-codeblock.html` — обёртка с лэйблом языка и кнопкой «копировать».
  - `render-codeblock-mermaid.html` — превращает блок с языком `mermaid` в `<pre class="mermaid">` и помечает страницу для подгрузки библиотеки.
  - `render-image.html` — `<picture>` с WebP, lazy-loading, явные `width`/`height` из page-bundle resource.
  - `render-link.html` — external-ссылкам `rel="noopener noreferrer" target="_blank"`.
- Подсветка кода — chroma, цвета сгенерены из `catppuccin-latte` / `catppuccin-mocha`, переключаются через `:root[data-theme="..."]`.
- TOC: рендерится автоматически для постов (Page.Type == "post" или Section ∈ mainSections), на «обычных» страницах выключен. Управление per-page через `toc: true|false`, глобально — `params.ShowToc`. Sticky на десктопе, collapsible по умолчанию, scroll-spy через IntersectionObserver.
- Шорткоды: `callout` (note/tip/warn/danger), `kbd`, `collapse`, `refresh-banner`, `telegram-cta`, `thin-place`, `figure`.
- Cover-картинки: поддержка page-bundle resource, относительных и абсолютных путей; `cover.relative: true|false` по PaperMod-семантике. Caption обрабатывается через `RenderString` — markdown внутри подписи работает.
- Карточки списка постов — `position: relative` + stretched-link, на десктопе cover слева.
- Таксономии: `/tags/`, `/categories/` — облако с счётчиками постов; одна страница тега/категории — список постов и пагинация. Поддержка `data/category_colors.yaml` для покраски пилюль категорий.
- Поиск: `/index.json` + `layouts/search.html` + Fuse.js (basic, v7) + ленивая загрузка только на странице `/search/`. Поддержка `?q=...` в URL.
- Mermaid: опт-ин — диаграмма на странице или `params.mermaid: true`. Тема Mermaid синхронизируется со светлой/тёмной темой сайта.
- MathJax 4: опт-ин через `params.math: true` (per-page или глобально), CDN.
- Трёхколоночный footer: copyright/nav/social, стек на мобиле. Партиалы `footer_copyright`, `footer_nav`, `footer_social` — для оверрайдов в проекте.
- i18n: `ru`, `en` (строки заголовков, тогглера, TOC, поиска, footer'а).
- Хуки расширения: `extend_head`, `extend_footer`, `extend_post_content` — пустые, можно переопределить в проекте.
- Поддержка установки и как git-submodule, и как Hugo Module (`go.mod` в корне темы).
- README с обоими сценариями установки + минимальным конфигом.

### Build

- Hugo Extended `>= 0.146.0` (используется новый layout v0.146+ с `_partials`/`_shortcodes`/`_markup`).
- Без сборщиков (нет `node_modules`), только Hugo Pipes (`resources.Match`/`Concat`/`Minify`/`Fingerprint`).

[Unreleased]: https://github.com/jtprogru/hugo-mishka/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/jtprogru/hugo-mishka/releases/tag/v0.1.0
