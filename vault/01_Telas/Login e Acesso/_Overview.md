---
tipo: overview
tags: [overview, acesso, auth]
caminho: auth.js
---

# Login e Acesso

Controla a entrada no portal e impede que o conteúdo seja liberado antes da autenticação e da autorização.

## O que faz / onde vive

`index.html` contém os overlays de entrada e espera; `auth.js` coordena Auth, autorização, sessão por dispositivo e logout. A integração é descrita em [[00_Core/Supabase|Supabase]].

## Regras / atenção

- O app só aparece após sessão válida e acesso concedido.
- Cadastro ou autenticação não substituem a autorização.
- Não documentar contas, identificadores ou regras internas de segurança neste repo público.

## Notas atômicas

- [[01_Telas/Login e Acesso/Login-e-Autorizacao|Login e Autorização]] — portão de entrada.
- [[01_Telas/Login e Acesso/Sessao-Unica|Sessão Única]] — vínculo e renovação da sessão por dispositivo.

## Doc canônico

[README.md](../../../README.md) · [.clinerules](../../../.clinerules)
