---
tipo: overview
tags: [overview, admin, acessos]
caminho: auth.js
---

# Admin de Acessos

Área restrita para administrar autorizações, sessões de dispositivos e a sincronização de mídias do portal.

## O que faz / onde vive

O modal `#adminAccessModal` em `index.html` concentra as ações; `auth.js` carrega os dados e executa as operações nas tabelas e no Storage descritos em [[00_Core/Supabase|Supabase]].

## Regras / atenção

- Os atalhos administrativos só aparecem para contas autorizadas como administradoras.
- Nunca registrar contas de administradores ou técnicos, nem detalhes internos de segurança, no vault público.
- Alterações de sessão devem preservar [[01_Telas/Login e Acesso/Sessao-Unica|Sessão Única]].

## Notas atômicas

- [[01_Telas/Admin de Acessos/Gestao-de-Acessos|Gestão de Acessos]] — autorizações e dispositivos.
- [[01_Telas/Admin de Acessos/Sincronizacao-de-Midias|Sincronização de Mídias]] — Storage e catálogo.

## Docs canônicos

[README.md](../../../README.md) · [.clinerules](../../../.clinerules)
