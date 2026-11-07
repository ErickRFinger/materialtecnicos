/* ==========================================================================
   CONFIGURAÇÃO DO SUPABASE — PORTAL TÉCNICO VIGI
   ========================================================================== */

const SUPABASE_URL  = "https://hnfhrjgzeivzrcpumkyk.supabase.co";
const SUPABASE_ANON = "COLE_AQUI_A_SB_PUBLISHABLE_KEY";
if (!SUPABASE_ANON.startsWith('sb_publishable_')) {
  console.error('[config] SUPABASE_ANON precisa ser a publishable key sb_publishable_...');
}

// Sessão expira se ficar mais de 8 horas sem atividade
const SESSION_TIMEOUT_HOURS = 8;
