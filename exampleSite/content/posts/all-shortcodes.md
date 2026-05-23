---
title: "Все шорткоды темы"
date: 2026-05-23T10:00:00+03:00
draft: false
description: "Демонстрация всех шорткодов темы Mishka в одном посте."
tags: ["demo", "shortcodes"]
categories: ["hugo"]
---

Этот пост — живая демонстрация всех шорткодов, которые предоставляет тема `mishka`.
Можно копировать markdown и использовать у себя.

## Callouts

{{< callout type="note" title="Заметка" >}}
Это обычная **заметка**. Поддерживает _markdown_ внутри.
{{< /callout >}}

{{< callout type="tip" title="Совет" >}}
Хороший совет: всегда коммить тестируемый код, а не «как сейчас работает».
{{< /callout >}}

{{< callout type="warn" title="Внимание" >}}
Не запускайте `rm -rf /` без понимания того, что это сделает.
{{< /callout >}}

{{< callout type="danger" title="Опасно" >}}
Это удалит ВСЁ. Серьёзно. Не делайте этого в проде.
{{< /callout >}}

## Callouts из markdown (GFM alerts)

То же самое можно писать в обычном markdown, без шорткода — render-blockquote подхватит GFM-синтаксис.

> [!NOTE]
> Обычная заметка через `> [!NOTE]`.

> [!TIP]
> Полезный совет — `> [!TIP]`. Подсветится зелёным.

> [!IMPORTANT]
> Что-то ключевое — `> [!IMPORTANT]`. Подсветится акцентом темы.

> [!WARNING]
> Предупреждение — `> [!WARNING]`. Жёлтая рамка.

> [!CAUTION]
> Опасно — `> [!CAUTION]`. Красная рамка.

Кастомный заголовок прямо после типа:

> [!TIP] Маленький совет
> Можно дописать свой заголовок прямо после типа.

## Клавиши

Чтобы открыть Spotlight: {{< kbd "Cmd+Space" >}}. Чтобы открыть Command Palette в VS Code: {{< kbd "Cmd+Shift+P" >}}.

## Audio / Video

Аудио (один источник):

{{< audio src="/media/sample.mp3" caption="Демо-эпизод" >}}

Аудио (несколько форматов от одного базового пути):

{{< audio src="/media/sample" sources="mp3,ogg" caption="Несколько форматов сразу" >}}

Видео с постером:

{{< video src="/media/sample.mp4" poster="/media/sample.jpg" caption="Демо-ролик" >}}

## Raw HTML

{{< rawhtml >}}
<div style="padding: 8px 12px; border: 1px dashed #888; border-radius: 6px;">
  Это <strong>сырой HTML</strong>, который не проходит через markdown.
</div>
{{< /rawhtml >}}

## Bidi (LTR / RTL)

Принудительный LTR-блок (полезно на RTL-сайтах для URL/кода):

{{< ltr >}}
https://example.com/very/long/path/that-should-stay-left-to-right
{{< /ltr >}}

Принудительный RTL-блок (арабский на LTR-сайте):

{{< rtl lang="ar" >}}
مرحبا بالعالم — это правый-в-левый текст внутри обычного русского поста.
{{< /rtl >}}

## Collapse

{{< collapse summary="Развернуть длинное объяснение" >}}
Содержимое внутри может быть **любым** markdown'ом. Например:

- список
- ещё один пункт
- и третий

```bash
echo "и код тоже работает"
```
{{< /collapse >}}

## Refresh-banner

{{< refresh-banner date="2026-05-20" >}}Добавили шорткоды `kbd`, `collapse`, `thin-place`.{{< /refresh-banner >}}

## Telegram CTA

{{< telegram-cta channel="@jtprog_blog" title="Канал автора" text="Записки из тонких мест разработки и SRE." >}}

## Thin-place

{{< thin-place author="Aristotle" >}}
We are what we repeatedly do. Excellence, then, is not an act, but a habit.
{{< /thin-place >}}

## Figure

{{< figure src="/images/avatar.svg" alt="Демо аватар" caption="Подпись к картинке" attr="Source: example" attrlink="https://example.org/" >}}

## Дальше

Ниже — обычный код-блок, чтобы проверить render-hook:

```python
def hello(name: str) -> str:
    return f"Привет, {name}!"

print(hello("мир"))
```
