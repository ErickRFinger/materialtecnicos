# Portal Técnico VIGI Câmeras

## 1. Visão Geral e Objetivo
O **Portal Técnico VIGI Câmeras** é a central web/PWA interna de treinamento, padronização técnica, consulta de manuais, vídeos operacionais, tabelas comerciais e certificação para os técnicos e equipe operacional da **VIGI Câmeras**.

### Regras de Negócio Essenciais:
- **Acesso Restrito e Blindado:** Nenhum conteúdo técnico é renderizado no DOM antes da validação simultânea da sessão no **Supabase Auth** e da autorização explícita na tabela `vigi_access` (`granted = true`).
- **Controle de Sessão Única (Single-Session Lock):** Cada conta de técnico possui trava de dispositivo/sessão ativa via `vigi_sessions` (com heartbeat a cada 2 minutos e timeout de 8 horas), evitando compartilhamento indevido de credenciais.
- **Gestão Centralizada de Acessos e Mídias (Admin):** Administradores (`erick.finger123@gmail.com` e `daniellazzarottogba@gmail.com`) contam com o painel **Central de Acessos & Privacidade** (`#adminAccessModal`) para pré-autorizar e-mails, revogar acessos, encerrar sessões travadas e sincronizar miniaturas/mídias com o Supabase Storage (`vigi-midia`).
- **Miniaturas Studio HD (16:9) e Artes Nativas:** Todos os 24 vídeos contam com miniaturas 16:9 HD reais (`thumbs/*.jpg`) combinando a captura real do vídeo com a identidade visual oficial da VIGI Câmeras, e todas as 4 Artes Comerciais (`artes-img/*.jpg`) abrem em alta resolução no Lightbox nativo com Zoom & Pan e download direto.

---

## 2. Stack Tecnológica & Pré-requisitos
- **Frontend:** HTML5 Semântico, CSS3 Moderno (Custom Properties, Grid/Flexbox, Glassmorphism, Dark/Light Theme), JavaScript Vanilla (ES6+ modularizado).
- **PWA / Offline-First:** Service Worker (`sw.js` — `vigi-portal-cache-v12`) e Web App Manifest (`manifest.json`).
- **Backend & Autenticação (BaaS):** Supabase (`@supabase/supabase-js` v2):
  - **Auth:** Autenticação por E-mail/Senha + JWT.
  - **PostgreSQL + RLS:** Tabelas `vigi_access` (whitelist de técnicos), `vigi_sessions` (controle de sessão única) e `vigi_materiais` (catálogo dinâmico de vídeos e artes).
  - **Storage:** Bucket público `vigi-midia` para miniaturas HD, artes e vídeos `.mp4`, integrado ao acervo original no Google Drive (`VIDEOS E ARTES` — ID `1xOX1e0IQKu_C5EEWF-2UzShTGpoxvVuc`).
- **Hospedagem & Edge Security:** Vercel (com headers de segurança e anti-indexação `X-Robots-Tag: noindex, nofollow, noarchive` em `vercel.json`).

---

## 3. Mapa da Arquitetura & Estrutura de Arquivos
```text
MATERIAL TECNICOS/
├── index.html              # Shell principal da SPA, modais de Auth, Player, Lightbox e Painel Admin
├── styles.css              # Design System completo, temas Dark/Light, cards 16:9 HD e responsividade
├── supabase-config.js      # Configuração de conexão pública (URL, Anon Key e timeout de sessão)
├── auth.js                 # Autenticação Supabase, trava de sessão única e Central Admin de Acessos/Mídias
├── app.js                  # Lógica de abas, busca global, player híbrido HTML5/Drive, Lightbox e Slideshow
├── data.js                 # Catálogo estruturado (24 vídeos, 4 artes, manuais de bancada e 27 slides)
├── thumbs/                 # 24 Miniaturas Studio 16:9 HD (960x540) geradas a partir dos vídeos reais
│   └── raw/                # Capturas originais extraídas dos vídeos (ignoradas no deploy de produção)
├── artes-img/              # 4 Artes e Tabelas Comerciais em resolução original (1080x1350)
├── slides-img/             # Imagens técnicas da Apresentação de Certificação (27 slides)
├── sw.js                   # Service Worker (estratégia Network-First p/ código e Cache-First p/ imagens)
├── vercel.json             # Headers de segurança HTTP (CSP/XFO/NoIndex)
├── .vercelignore           # Filtro de arquivos excluídos do bundle público da Vercel
├── robots.txt              # Bloqueio total de crawlers e indexadores de busca
└── _interno/               # Scripts SQL (supabase-setup.sql) e utilitários internos de manutenção
```

---

## 4. Como Rodar & Como Publicar (Comandos Práticos)

### Execução Local (Desenvolvimento)
```bash
# Servir localmente na porta 3000 (via npx serve ou Python HTTP server)
python3 -m http.server 3000
```

### Deploy em Produção (Vercel)
```bash
# Publicar diretamente em produção (https://materialtecnicos.vercel.app)
npm run deploy
# ou:
npx vercel --prod --yes
```

---

## 5. Configurações & Variáveis de Ambiente
A conexão client-side com o Supabase fica centralizada em [`supabase-config.js`](file:///Users/erickruanfinger/Desktop/MATERIAL%20TECNICOS/supabase-config.js) (utilizando exclusivamente a chave pública `anon` protegida por políticas **Row Level Security — RLS** no banco). Veja o modelo em [`.env.example`](file:///Users/erickruanfinger/Desktop/MATERIAL%20TECNICOS/.env.example):

```env
SUPABASE_URL=https://hnfhrjgzeivzrcpumkyk.supabase.co
SUPABASE_ANON_KEY=sua_chave_anon_publica_aqui
SESSION_TIMEOUT_HOURS=8
```

Para aplicar/atualizar as políticas de segurança RLS, tabela `vigi_materiais` e bucket `vigi-midia`, execute o script [`_interno/supabase-setup.sql`](file:///Users/erickruanfinger/Desktop/MATERIAL%20TECNICOS/_interno/supabase-setup.sql) no SQL Editor do Supabase.

---

## 6. Histórico de Evolução & Decisões Técnicas
- **v1.0 – v1.8:** Estruturação inicial do Portal Técnico, manuais interativos com checklist, mural Kanban de solicitações e apresentação de certificação de 27 slides.
- **v2.0 (Blindagem de Segurança & Privacidade):**
  - Bloqueio de renderização pré-autenticação no DOM (`appContainer` oculto até validação completa de `vigi_access`).
  - Painel **Central de Acessos & Privacidade** (`#adminAccessModal`) integrado para aprovação de técnicos e desconexão remota de sessões.
  - Hardening de deploy com `.vercelignore`, `robots.txt` e headers HTTP de privacidade em `vercel.json`.
- **v2.1 (Miniaturas Studio 16:9 HD, Artes Nativas & Integração Supabase Midia):**
  - Extração dos frames reais dos 24 vídeos e geração automatizada de **24 Miniaturas Studio 16:9 HD (`thumbs/*.jpg`)** padronizadas com a identidade visual VIGI Câmeras.
  - Migração das **4 Artes Comerciais (`artes-img/*.jpg`)** para carregamento nativo instantâneo em alta resolução (`1080x1350`) no Lightbox com Zoom & Pan e botão de download direto.
  - Player de Vídeo Híbrido (suporte a `<video>` nativo HTML5 com controle de velocidade `1x–2x` via Supabase Storage `vigi-midia` + fallback integrado Google Drive HD).
- **v2.2 (Expansão de Vídeos de Procedimentos Operacionais & Atualização Geral de Artes):**
  - Adição de **9 novos vídeos de Procedimentos Operacionais VIGI** (`v-proc-1` a `v-proc-9`) com miniaturas Studio HD padronizadas, totalizando **33 vídeos tutoriais**.
  - Criação da categoria e filtro dinâmico **"Procedimentos VIGI"** no catálogo de vídeos.
  - Substituição completa do acervo de fotos pelas **8 novas Artes Oficiais de Planos e Produtos** (Câmeras por assinatura, Alarme 24h, Câmeras Wi-Fi, Solar, 360º IA e Roteador) diretamente da pasta local, otimizadas para carregamento rápido e zoom de alta fidelidade.
- **v2.3 (Redesign da Tela Inicial / Dashboard & Expansão para 14 Manuais Técnicos):**
  - **Dashboard Modernizado:** Redesign completo do Banner Hero com status operacional em tempo real, novos cards de acesso rápido com tags de contagem dinâmica, grid de **Tutoriais em Alta no Campo** com reprodução direta e **Checklist de Ouro do Técnico em Campo** (5 validações essenciais antes de finalizar a OS com persistência local).
  - **Expansão de Manuais (de 7 para 14):** Criação de 7 novos guias práticos cobrindo Ativação sem Relato, Conferência com Planos Especiais, Homologação de Câmeras do Cliente, Retirada de Equipamentos/Termo Aditivo, Substituição de DVR, Manual do UNV-Link e Operação Desktop (iVMS/EZStation), com barra de progresso visual e filtros por categoria.
- **v2.4 (Central de Sugestões de Conteúdo Técnico & Tutoriais):**
  - **Foco Técnico Exclusivo:** Reformulação completa da aba **"Solicitar Material"** com foco 100% em conteúdo pedagógico e prático para capacitação dos técnicos (Vídeos de Bancada/Campo, Artes/Tabelas Comerciais, Manuais Escritos e Diagramas Elétricos/Esquemas de Ligação).
  - **Chips de Inspiração Rápida:** Botões de preenchimento em 1 clique para dúvidas comuns de campo (Reset de DVR, Ligação de Sirene no Alarme, Tabela de Planos Atualizada, Homologação Onvif e Bornes de Fonte Chaveada).
  - **Filtros por Formato & Busca em Tempo Real:** Barra interativa de filtros (*Todos, 🎬 Vídeos, 🎨 Artes, 📋 Manuais, ⚡ Diagramas*) e campo de busca para evitar solicitações duplicadas no mural Kanban.
  - **Notificação Direta no WhatsApp:** Botão em cada card para transmitir a sugestão formatada diretamente para a equipe técnica de produção/administração no WhatsApp.
