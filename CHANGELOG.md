# Changelog

Все заметные изменения в `hugo-mishka` фиксируются здесь.
Формат — [Keep a Changelog](https://keepachangelog.com/ru/1.1.0/), версии — [Semantic Versioning](https://semver.org/lang/ru/).

## [Unreleased]

### Added

- GFM-style alerts в markdown: `> [!NOTE]`, `> [!TIP]`, `> [!IMPORTANT]`, `> [!WARNING]`, `> [!CAUTION]` рендерятся через `layouts/_default/_markup/render-blockquote.html` в тот же стиль `.callout`, что и shortcode `{{< callout >}}`. Опциональный кастомный заголовок: `> [!TIP] My title`. Дефолтные заголовки локализованы (i18n `alert_*`).
- Новый тип callout `important` (акцентный цвет темы) + иконка `zap` в `_partials/svg.html`. Доступен и через shortcode (`type="important"`), и через GFM-alert (`> [!IMPORTANT]`).
- Related posts: партиал `_partials/related.html` + CSS-модуль `30-related.css`. Использует встроенный Hugo-механизм `site.RegularPages.Related` поверх `related:` конфига сайта. Опции: `params.ShowRelatedPosts` (по умолчанию `true`), `params.relatedMax` (по умолчанию `4`), per-page переопределение через frontmatter `related: false`.
- Share buttons: партиал `_partials/post_share.html` + CSS `31-share.css`. Каналы: Telegram, X (Twitter), LinkedIn, Email, copy-link. Опт-ин через `params.ShowShareButtons`, выбор каналов — `params.ShareButtons`, per-page выкл — `share: false`. Copy-link использует общий clipboard-handler из `code-copy.js`. i18n-строки `share_*` (ru/en) и `data-share-copy-done` на `<html>`.
- Edit-on link: партиал `_partials/edit_post.html` + CSS `32-edit-post.css`. Конфиг через `params.editPost.{URL, Text, appendFilePath}` в духе PaperMod. Per-page override через `editPostURL`, выкл через `editPost: false`.
- SVG-иконки `mail`, `share`, `edit`, `link` в `_partials/svg.html`.

### Changed

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
