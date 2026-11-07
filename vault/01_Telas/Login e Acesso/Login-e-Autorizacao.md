---
tipo: workflow
tags: [acesso, auth, autorizacao]
caminho: auth.js
---

# Login e Autorização

O fluxo de entrada combina duas decisões: o Supabase Auth valida a identidade e `vigi_access` confirma que a conta pode usar o portal.

## Fluxo

1. O usuário entra ou se cadastra pelos formulários de `index.html`.
2. `auth.js` verifica a sessão e consulta a autorização.
3. O app é exibido somente com ambas válidas; caso contrário, permanece a tela de login ou espera.

## Atenção

Não renderizar o conteúdo técnico antes das duas validações. A trava de dispositivo é um conceito separado: [[01_Telas/Login e Acesso/Sessao-Unica|Sessão Única]].

## Doc canônico

[.clinerules](../../../.clinerules)

## Relacionado

[[01_Telas/Login e Acesso/_Overview|Visão geral]] · [[00_Core/Supabase|Supabase]]
