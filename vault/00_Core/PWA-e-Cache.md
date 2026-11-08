---
tipo: gotcha
tags: [core, pwa, cache]
caminho: sw.js
---

# PWA e Cache

O `sw.js` precacheia o shell do app, incluindo `supabase-config.js`. Assim, alterar a configuração sem trocar a versão do cache pode deixar clientes com o arquivo antigo.

## Regra

Suba `CACHE_NAME` a cada mudança de configuração ou do shell (HTML/CSS/JS). Na ativação, o worker remove caches antigos; HTML/JS/CSS usam Network-First, enquanto imagens e fontes usam Cache-First. Chamadas externas não passam pelo cache do worker. O shell visual de novembro de 2026 usa v19; tokens e temas estão em [[00_Core/Design-System|Design System]].

## Atenção

O precache do config não torna seu conteúdo secreto: somente a publishable pertence ao frontend, conforme [[00_Core/Supabase|Supabase]]. Publicação depende de [[00_Core/Deploy|Deploy]].

## Doc canônico

[README.md](../../README.md)
