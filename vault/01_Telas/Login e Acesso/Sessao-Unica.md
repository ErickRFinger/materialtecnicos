---
tipo: componente
tags: [acesso, sessao, heartbeat]
caminho: auth.js
---

# Sessão Única

A tabela `vigi_sessions` associa a sessão autenticada a um dispositivo para impedir o uso simultâneo indevido da mesma conta.

## Operação

`auth.js` registra o dispositivo, mantém heartbeat a cada dois minutos e aplica timeout de oito horas. O heartbeat também revalida o acesso; logout ou encerramento administrativo remove a sessão registrada.

## Atenção

Mudanças nesse fluxo afetam tanto a entrada quanto a [[01_Telas/Admin de Acessos/Gestao-de-Acessos|Gestão de Acessos]]. Não registrar tokens ou identificadores reais no vault.

## Doc canônico

[README.md](../../../README.md)

## Relacionado

[[01_Telas/Login e Acesso/_Overview|Visão geral]] · [[01_Telas/Login e Acesso/Login-e-Autorizacao|Login e Autorização]]
