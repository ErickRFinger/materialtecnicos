---
tipo: overview
tags: [overview, materiais, catalogo]
caminho: app.js
---

# Biblioteca de Materiais

Reúne as áreas de consumo do acervo: dashboard, vídeos, artes, manuais, treinamento em slides e solicitações de novos materiais.

## O que faz / onde vive

`index.html` define as seções e modais; `app.js` controla navegação, busca, filtros e visualização; `data.js` organiza o catálogo estático. A tabela e o Storage descritos em [[00_Core/Supabase|Supabase]] complementam as mídias.

## Regras / atenção

- A biblioteca só é acessível após [[01_Telas/Login e Acesso/Login-e-Autorizacao|Login e Autorização]].
- Preservar navegação responsiva, filtros e delegação de eventos do mural de solicitações.
- Detalhes e quantitativos do acervo pertencem ao doc canônico, não às notas.

## Notas atômicas

- [[01_Telas/Biblioteca de Materiais/Catalogo-e-Busca|Catálogo e Busca]] — descoberta de conteúdo.
- [[01_Telas/Biblioteca de Materiais/Visualizacao-de-Midias|Visualização de Mídias]] — player e lightbox.

## Docs canônicos

[README.md](../../../README.md) · [.clinerules](../../../.clinerules)
