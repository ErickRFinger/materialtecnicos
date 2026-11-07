---
tipo: workflow
tags: [admin, acessos, sessoes]
caminho: auth.js
---

# Gestão de Acessos

O painel administrativo permite pré-autorizar contas, revogar acessos e encerrar sessões de dispositivos.

## Fluxo

`auth.js` carrega as listas de `vigi_access` e `vigi_sessions`, apresenta seus estados e executa inclusões, alterações ou remoções pelas ações do modal. A revogação também é percebida pela revalidação periódica da sessão.

## Atenção

O painel é uma função restrita; não expor nomes, e-mails, tokens ou políticas internas na documentação pública. A entrada comum segue [[01_Telas/Login e Acesso/Login-e-Autorizacao|Login e Autorização]].

## Doc canônico

[README.md](../../../README.md)

## Relacionado

[[01_Telas/Admin de Acessos/_Overview|Visão geral]] · [[01_Telas/Login e Acesso/Sessao-Unica|Sessão Única]]
