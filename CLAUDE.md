# Memória / contexto — leia o vault ANTES de agir

Este repo tem um **vault** em [`vault/`](vault/) com notas atômicas e `[[links]]`. Antes de mexer em qualquer parte do projeto, busque contexto nesta ordem:

1. [`vault/_Index.md`](vault/_Index.md) — mapa-mestre.
2. `_Overview.md` da unidade afetada em `vault/01_Telas/`.
3. Notas atômicas específicas do que vai tocar.
4. `vault/00_Core/` se envolver algo compartilhado.
5. Logs recentes em `vault/_Logs/`.

**Ao finalizar qualquer sessão que altere código/config/estado**, crie log em `vault/_Logs/` e atualize as notas afetadas. Regras completas em [`vault/Agente.md`](vault/Agente.md).

## Regras deste repo

- Repo público: nunca commitar segredos; só a publishable pode ir ao código.
- Trabalho braçal vai para a colmeia (MCP `colmeia`, `pasta` absoluta `/Users/erickruanfinger/Desktop/MATERIAL TECNICOS`).
- Push/deploy só com OK do Erick.
- Detalhes canônicos permanecem no `README.md` e nas `.clinerules`; não duplicá-los no vault.
