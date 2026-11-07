---
tipo: runbook
tags: [core, vercel, deploy]
caminho: package.json
---

# Deploy

A Vercel está ligada ao git na branch `main`. O script `npm run deploy` publica em produção e seu `predeploy` bloqueia o deploy se o placeholder da configuração ainda estiver presente.

## Regras

1. Confirme que a configuração pública foi aplicada conforme [[00_Core/Supabase|Supabase]].
2. Verifique o versionamento descrito em [[00_Core/PWA-e-Cache|PWA e Cache]].
3. Faça push ou deploy somente com OK explícito do Erick.

Documentação Markdown, arquivos internos e credenciais não devem integrar o bundle público; o filtro fica em `.vercelignore`.

## Docs canônicos

[README.md](../../README.md) · [package.json](../../package.json)
