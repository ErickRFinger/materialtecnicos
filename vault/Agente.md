---
tipo: index
tags: [agente, contrato, memoria]
---

# Contrato de manutenção do vault

Este vault documenta somente o Portal Técnico VIGI Câmeras. Seu objetivo é orientar a leitura sem substituir os docs canônicos.

## Repo público: nada sensível

Nunca grave chaves (inclusive publishable), URLs ou IDs de serviços, e-mails, nomes de usuários/técnicos, tokens, senhas, detalhes internos de RLS ou outros dados operacionais sensíveis. Descreva conceitos e aponte para arquivos, sem copiar valores de configuração.

## Hierarquia e nomes

- `_Index.md`: entrada de cada pasta navegável.
- `01_Telas/{Área}/_Overview.md`: visão geral de uma área real.
- `{Conceito}.md`: uma nota atômica por conceito, com frontmatter `tipo`/`tags` e wikilinks.
- `00_Core/`: integrações e funcionamento transversal.
- `_Logs/DD-MM-AAAA_<usuario>.md`: um log por autor e data.

## Antes de agir

1. Leia [[_Index]] e localize a área.
2. Leia o `_Overview.md` da área e só as notas atômicas relevantes.
3. Consulte [[00_Core/_Index|Core]] para assuntos compartilhados.
4. Leia os logs recentes quando precisar do estado das últimas sessões.

## Ao alterar código, configuração ou estado

- Atualize as notas afetadas e os índices quando criar/remover áreas ou conceitos.
- Mantenha detalhes exaustivos no `README.md` e nas `.clinerules`; linke, não duplique.
- Não atualize notas para typo, mudança cosmética ou refactor sem mudança de comportamento.
- Crie/atualize `_Logs/DD-MM-AAAA_<usuario>.md`, usando `git config user.name` em CamelCase (ou `agente_ia` se vazio) no nome e em `autor`.
- No mesmo autor e data, acrescente uma seção `## Sessão HH:MM`; não crie outro arquivo.

## Checklist de saída

- [ ] Índice mestre e índices afetados navegam até todas as unidades.
- [ ] Toda área tem `_Overview.md`; notas novas são atômicas e têm links válidos.
- [ ] Docs canônicos estão linkados e continuam sendo a fonte completa.
- [ ] Log da sessão foi criado/atualizado.
- [ ] Divergências foram sinalizadas com ⚠️, sem adivinhações.
- [ ] Nenhum dado sensível foi incluído.
