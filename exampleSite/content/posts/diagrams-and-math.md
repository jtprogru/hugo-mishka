---
title: "Диаграммы и формулы"
date: 2026-05-23T11:00:00+03:00
description: "Демонстрация Mermaid-диаграмм и MathJax-формул."
tags: ["demo"]
categories: ["hugo"]
math: true
---

## Mermaid

Простой flowchart:

```mermaid
flowchart LR
    A[Идея] --> B{Подойдёт?}
    B -->|Да| C[Делаем]
    B -->|Нет| D[Думаем ещё]
    C --> E((Готово))
```

Sequence diagram:

```mermaid
sequenceDiagram
    User->>App: Открывает /search/
    App->>Server: GET /index.json
    Server-->>App: 200 OK + payload
    App-->>User: Результаты поиска
```

## Math

Формула Эйлера inline: $e^{i\pi} + 1 = 0$.

Полный display:

$$
\int_{-\infty}^{\infty} e^{-x^2} \, dx = \sqrt{\pi}
$$

Матрица:

$$
\begin{bmatrix}
a & b \\
c & d
\end{bmatrix}^{-1}
=
\frac{1}{ad-bc}
\begin{bmatrix}
d & -b \\
-c & a
\end{bmatrix}
$$
