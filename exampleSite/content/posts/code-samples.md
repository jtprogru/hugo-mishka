---
title: "Подсветка кода и render-hooks"
date: 2026-05-15T09:00:00+03:00
draft: false
tags: ["code", "demo"]
categories: ["DevOps"]
description: "Демо разных языков для проверки Chroma-палитры и render-hooks."
summary: "Демо разных языков для проверки Chroma-палитры и render-hooks."
---

## Go

```go
package main

import (
    "context"
    "fmt"
)

func main() {
    ctx, cancel := context.WithCancel(context.Background())
    defer cancel()
    fmt.Println(ctx.Err())
}
```

## Shell

```bash
#!/usr/bin/env bash
set -euo pipefail

for f in *.md; do
  echo "processing $f"
done
```

## YAML

```yaml
version: "3.9"
services:
  app:
    image: ghcr.io/jtprogru/mishka:latest
    ports:
      - "8080:8080"
    env:
      - LOG_LEVEL=info
```

## JSON

```json
{
  "name": "mishka",
  "version": "0.1.0",
  "features": ["dark-mode", "search"]
}
```

## Python

```python
from typing import Iterable

def chunks(it: Iterable[int], n: int):
    buf: list[int] = []
    for x in it:
        buf.append(x)
        if len(buf) == n:
            yield buf
            buf = []
    if buf:
        yield buf
```
