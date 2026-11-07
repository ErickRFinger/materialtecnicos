---
tipo: workflow
tags: [admin, storage, materiais]
caminho: auth.js
---

# Sincronização de Mídias

A ação administrativa envia miniaturas e artes locais ao Storage e atualiza o catálogo remoto de materiais.

## Fluxo

1. O navegador lê os arquivos locais selecionados pelo fluxo de sincronização.
2. `auth.js` envia os objetos ao bucket `vigi-midia` e obtém suas referências públicas.
3. Os metadados são gravados em `vigi_materiais` para consumo pelo catálogo.

## Atenção

Executar somente pelo painel autorizado e nunca usar chave secret no frontend. Não registrar URLs ou identificadores reais no vault.

## Doc canônico

[README.md](../../../README.md)

## Relacionado

[[01_Telas/Admin de Acessos/_Overview|Visão geral]] · [[00_Core/Supabase|Supabase]] · [[01_Telas/Biblioteca de Materiais/Catalogo-e-Busca|Catálogo e Busca]]
