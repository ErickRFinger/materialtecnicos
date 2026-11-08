---
tipo: componente
tags: [core, design-system, temas, acessibilidade]
caminho: styles.css
---

# Design System

O portal usa o padrão visual VIGI compartilhado com NETSCAN e VMS, sem alterar autenticação, catálogo ou comportamento funcional. Referência somente leitura: `NETSCAN_CCTV/public/index.html`.

## Temas e tokens

- `styles.css` concentra os tokens escuros em `:root` e os claros em `html.light`.
- Base escura: `--bg #030610`, painel navy translúcido, texto `#f1f5f9`, marca `#ea580c → #d97706` e `--brand-text #fb923c`.
- Base clara: `--bg #eef2f6`, painéis brancos, texto `#0f172a` e `--brand-text #c2410c`.
- Status usam `--ok`, `--warn`, `--bad` e `--info` com variantes `-soft`/`-line`; legados apontam para aliases semânticos.
- Tipografia Inter, dados técnicos em JetBrains Mono, raio `--radius: 12px` e scrollbar laranja.
- `index.html` aplica antes da pintura a preferência `vigi_material_theme`; lua/sol aparecem no login e no cabeçalho.

## Componentes

Botões primários, secundários, perigo e fantasma; campos; cards; filtros pill; badges; modais; toasts e estados de feedback seguem os mesmos tokens. O logo fica sobre selo navy nos dois temas.

## Acessibilidade e PWA

- Foco visível com outline de 2 px, texto mínimo de 11 px e alvos de toque de pelo menos 44 px.
- `html.lite`, ativado por `prefers-reduced-motion` ou `?lite=1`, remove animações, transições, filtros e sombras.
- O gradiente laranja usa texto navy para manter contraste AA; texto e marca sobre painéis também foram medidos nos dois temas.
- Mudanças no shell exigem incremento do cache, conforme [[00_Core/PWA-e-Cache|PWA e Cache]].

## Relacionado

[[01_Telas/Login e Acesso/_Overview|Login e Acesso]] · [[01_Telas/Biblioteca de Materiais/_Overview|Biblioteca de Materiais]] · [[01_Telas/Admin de Acessos/_Overview|Admin de Acessos]]
