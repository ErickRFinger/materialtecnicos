---
tipo: integracao
tags: [core, supabase, backend]
caminho: supabase-config.js
---

# Supabase

O backend reúne Auth para identidade, as tabelas `vigi_access` (autorização), `vigi_sessions` (sessão por dispositivo) e `vigi_materiais` (catálogo), além do Storage `vigi-midia` para mídias. O acesso ao portal combina autenticação e autorização; veja [[01_Telas/Login e Acesso/Login-e-Autorizacao|Login e Autorização]].

## Configuração pública

A conexão do navegador fica em `supabase-config.js`. Somente a chave publishable pode ir ao código; o arquivo começa com placeholder e `npm run chave` faz sua configuração local. Nunca usar a chave secret no frontend nem neste vault.

## Atenção

Não registrar URLs, IDs, chaves, e-mails ou regras internas de segurança. Após mudar a configuração, aplique [[00_Core/PWA-e-Cache|o versionamento do cache]] e respeite [[00_Core/Deploy|a autorização de deploy]].

## Docs canônicos

[README.md](../../README.md) · [.clinerules](../../.clinerules)
