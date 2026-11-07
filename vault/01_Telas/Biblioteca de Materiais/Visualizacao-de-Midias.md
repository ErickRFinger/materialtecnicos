---
tipo: componente
tags: [materiais, player, lightbox]
caminho: app.js
---

# Visualização de Mídias

Os modais de visualização apresentam vídeos e artes sem tirar o usuário da biblioteca.

## Operação

O player usa vídeo HTML5 com fonte remota e fallback integrado; o lightbox abre artes em alta resolução com zoom, pan e download. `app.js` recebe o item selecionado no catálogo e controla ambos os modais definidos em `index.html`.

## Atenção

Preservar controles móveis, proporções das mídias e fechamento dos modais. Os arquivos remotos usam o Storage conceitual descrito em [[00_Core/Supabase|Supabase]].

## Doc canônico

[README.md](../../../README.md)

## Relacionado

[[01_Telas/Biblioteca de Materiais/_Overview|Visão geral]] · [[01_Telas/Biblioteca de Materiais/Catalogo-e-Busca|Catálogo e Busca]]
