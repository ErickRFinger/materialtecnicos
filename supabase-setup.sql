-- ============================================================
-- VIGI PORTAL — SQL para executar no Supabase
-- Painel: https://supabase.com/dashboard/project/hnfhrjgzeivzrcpumkyk/sql/new
-- ============================================================

-- 1. Tabela de sessões únicas por dispositivo
CREATE TABLE IF NOT EXISTS public.vigi_sessions (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID        REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  user_email  TEXT        NOT NULL,
  token       TEXT        NOT NULL,
  device_info TEXT,
  last_seen   TIMESTAMPTZ DEFAULT NOW(),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.vigi_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated own session"
  ON public.vigi_sessions FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anon read sessions"
  ON public.vigi_sessions FOR SELECT TO anon USING (true);

CREATE POLICY "Anon insert sessions"
  ON public.vigi_sessions FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Anon update sessions"
  ON public.vigi_sessions FOR UPDATE TO anon USING (true);

-- ============================================================
-- 2. Tabela de controle de acesso (quem o admin liberou)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.vigi_access (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID        REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  user_email TEXT        NOT NULL,
  granted    BOOLEAN     DEFAULT true,
  liberado_em TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.vigi_access ENABLE ROW LEVEL SECURITY;

-- Qualquer usuário pode ler sua própria linha de acesso
CREATE POLICY "Users read own access"
  ON public.vigi_access FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Anon também pode ler (para verificar antes do auth completo)
CREATE POLICY "Anon read access"
  ON public.vigi_access FOR SELECT
  TO anon
  USING (true);


-- ============================================================
-- COMO LIBERAR ACESSO PARA UM TÉCNICO
-- ============================================================
-- Quando um técnico se cadastrar, ele verá a tela de "aguardando".
-- Para liberar o acesso, cole e execute o SQL abaixo substituindo
-- o e-mail do técnico:

-- Passo 1: descobrir o user_id pelo e-mail
-- SELECT id, email FROM auth.users WHERE email = 'tecnico@email.com';

-- Passo 2: liberar o acesso (substitua o UUID e o e-mail)
-- INSERT INTO public.vigi_access (user_id, user_email, granted)
-- VALUES ('UUID-DO-USUARIO-AQUI', 'tecnico@email.com', true)
-- ON CONFLICT (user_id) DO UPDATE SET granted = true;


-- ============================================================
-- ATALHO: Liberar por e-mail diretamente (mais fácil)
-- ============================================================
-- Cole o e-mail do técnico abaixo e execute:

-- INSERT INTO public.vigi_access (user_id, user_email, granted)
-- SELECT id, email, true FROM auth.users
-- WHERE email = 'tecnico@email.com'
-- ON CONFLICT (user_id) DO UPDATE SET granted = true;


-- ============================================================
-- REVOGAR ACESSO de um técnico
-- ============================================================
-- UPDATE public.vigi_access SET granted = false
-- WHERE user_email = 'tecnico@email.com';


-- ============================================================
-- VER TODOS OS USUÁRIOS E STATUS DE ACESSO
-- ============================================================
-- SELECT 
--   u.email,
--   u.created_at AS cadastro,
--   COALESCE(a.granted, false) AS acesso_liberado,
--   a.liberado_em
-- FROM auth.users u
-- LEFT JOIN public.vigi_access a ON a.user_id = u.id
-- ORDER BY u.created_at DESC;
