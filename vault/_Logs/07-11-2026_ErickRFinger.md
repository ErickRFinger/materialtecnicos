---
tipo: log
data: 2026-11-07
autor: ErickRFinger
tags: [log, sessao]
---

# Log — 07/11/2026

## Sessão: chave publishable

### Resumo
A chave legada anon deu lugar à publishable, com placeholder até `npm run chave`. O supabase-js foi fixado em 2.118.0 e o cache do SW está em v18.

### Estado e pendências
- `.vercelignore` configurado sem documentos no deploy.
- Estado: commit local `0df0c11`, SEM push.
- Aguarda o Erick rodar `npm run chave`.
- O push leva junto 2 commits anteriores dele: correção do kanban/CSS e `.clinerules`.
- Push/deploy continuam condicionados ao OK do Erick, conforme [[00_Core/Deploy|Deploy]].

## Sessão: implantação do vault

### Resumo
Vault enxuto implantado com eixo por telas/áreas reais, três notas de Core, gatilhos na raiz e exclusão explícita de `vault/` no deploy.

### Arquivos / unidades afetados
- `vault/` — índices, contrato, visões gerais, notas atômicas e logs.
- `CLAUDE.md` e `AGENTS.md` — leitura obrigatória, regras de repo público, colmeia e autorização de push/deploy.
- `.vercelignore` — documentação do vault fora do bundle público.
- Nenhum código do app foi alterado.

### Decisões / contexto
- Alias `_Overview.md`; áreas: [[01_Telas/Login e Acesso/_Overview|Login e Acesso]], [[01_Telas/Biblioteca de Materiais/_Overview|Biblioteca de Materiais]] e [[01_Telas/Admin de Acessos/_Overview|Admin de Acessos]].
- `README.md` e `.clinerules` continuam canônicos e foram linkados, sem duplicação.
- Nenhum segredo, valor de conexão, conta ou detalhe interno de segurança foi registrado.
