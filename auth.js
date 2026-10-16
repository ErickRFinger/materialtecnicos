/* ==========================================================================
   AUTH.JS — AUTENTICAÇÃO COM SUPABASE, SESSÃO ÚNICA, BLINDAGEM DOM & PAINEL ADMIN
   Portal Técnico VIGI Câmeras
   ========================================================================== */

(function () {
  "use strict";

  // ── Inicialização do Supabase ─────────────────────────────────────────────
  if (!window.supabase) {
    console.error("SDK do Supabase não foi carregado!");
    return;
  }

  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);

  // ── Constantes & Armazenamento Local ───────────────────────────────────────
  const K_SESSION_TOKEN = "vigi_portal_session_token";
  const K_USER_CACHE    = "vigi_portal_user";
  const K_LAST_ACTIVE   = "vigi_portal_last_active";
  const ADMIN_EMAILS    = [
    "erick.finger123@gmail.com",
    "daniellazzarottogba@gmail.com"
  ];

  let heartbeatInterval = null;
  let currentUser       = null;

  // Garante estado bloqueado por padrão antes da verificação
  window.VIGI_AUTH_VERIFIED = false;

  // ── Elementos do DOM ──────────────────────────────────────────────────────
  const overlay           = document.getElementById("loginOverlay");
  const tabLoginBtn       = document.getElementById("tabLoginBtn");
  const tabSignupBtn      = document.getElementById("tabSignupBtn");
  const loginForm         = document.getElementById("loginForm");
  const signupForm        = document.getElementById("signupForm");

  // Campos de Login
  const loginEmail        = document.getElementById("loginEmail");
  const loginPass         = document.getElementById("loginPass");
  const loginBtn          = document.getElementById("loginBtn");
  const loginBtnText      = document.getElementById("loginBtnText");
  const loginSpinner      = document.getElementById("loginSpinner");
  const loginError        = document.getElementById("loginError");
  const togglePassLogin   = document.getElementById("togglePassLogin");

  // Campos de Cadastro
  const signupName        = document.getElementById("signupName");
  const signupEmail       = document.getElementById("signupEmail");
  const signupPass        = document.getElementById("signupPass");
  const signupBtn         = document.getElementById("signupBtn");
  const signupBtnText     = document.getElementById("signupBtnText");
  const signupSpinner     = document.getElementById("signupSpinner");
  const signupError       = document.getElementById("signupError");
  const signupSuccess     = document.getElementById("signupSuccess");
  const togglePassSignup  = document.getElementById("togglePassSignup");

  // Telas e Usuário
  const waitingOverlay    = document.getElementById("waitingOverlay");
  const waitingLogoutBtn  = document.getElementById("waitingLogoutBtn");
  const logoutBtn         = document.getElementById("logoutBtn");
  const userDisplayName   = document.getElementById("userDisplayName");
  const userRoleBadge     = document.getElementById("userRoleBadge");

  // Elementos Admin
  const openAdminModalBtn  = document.getElementById("openAdminModalBtn");
  const navAdminItem       = document.getElementById("navAdminItem");
  const sidebarAdminBtn    = document.getElementById("sidebarAdminBtn");
  const adminAccessModal   = document.getElementById("adminAccessModal");
  const closeAdminModalBtn = document.getElementById("closeAdminModalBtn");
  const adminRefreshBtn    = document.getElementById("adminRefreshBtn");
  const adminAddAccessForm = document.getElementById("adminAddAccessForm");
  const adminNewEmailInput = document.getElementById("adminNewEmailInput");
  const adminAccessList    = document.getElementById("adminAccessList");
  const adminSessionsList  = document.getElementById("adminSessionsList");
  const adminUsersCount    = document.getElementById("adminUsersCount");
  const adminSessionsCount = document.getElementById("adminSessionsCount");

  // ── SVGs para alternância de senha ────────────────────────────────────────
  const EYE_OPEN = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
  const EYE_CLOSED = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;

  // ── Utilitários ───────────────────────────────────────────────────────────
  function isAdminUser(user) {
    if (!user || !user.email) return false;
    return ADMIN_EMAILS.includes(user.email.toLowerCase().trim());
  }

  function getDeviceInfo() {
    const ua = navigator.userAgent;
    let b = "Navegador";
    if (ua.includes("Chrome") && !ua.includes("Edg")) b = "Chrome";
    else if (ua.includes("Firefox")) b = "Firefox";
    else if (ua.includes("Edg")) b = "Edge";
    else if (ua.includes("Safari") && !ua.includes("Chrome")) b = "Safari";
    return `${b} / ${/Mobi|Android|iPhone|iPad/i.test(ua) ? "Mobile" : "Desktop"}`;
  }

  function getSessionToken() {
    let t = localStorage.getItem(K_SESSION_TOKEN);
    if (!t) {
      t = (crypto.randomUUID ? crypto.randomUUID() : 'sess_' + Math.random().toString(36).substring(2) + Date.now().toString(36));
      localStorage.setItem(K_SESSION_TOKEN, t);
    }
    return t;
  }

  function renewSessionToken() {
    const t = (crypto.randomUUID ? crypto.randomUUID() : 'sess_' + Math.random().toString(36).substring(2) + Date.now().toString(36));
    localStorage.setItem(K_SESSION_TOKEN, t);
    localStorage.setItem(K_LAST_ACTIVE, String(Date.now()));
    return t;
  }

  function isSessionTimedOut() {
    const timeoutHours = (typeof SESSION_TIMEOUT_HOURS === "number" && SESSION_TIMEOUT_HOURS > 0) ? SESSION_TIMEOUT_HOURS : 8;
    const lastActive = parseInt(localStorage.getItem(K_LAST_ACTIVE) || "0", 10);
    if (!lastActive) {
      localStorage.setItem(K_LAST_ACTIVE, String(Date.now()));
      return false;
    }
    const elapsedMs = Date.now() - lastActive;
    return elapsedMs > timeoutHours * 3600 * 1000;
  }

  function touchActivity() {
    localStorage.setItem(K_LAST_ACTIVE, String(Date.now()));
  }

  function formatUserName(user) {
    if (!user) return "Técnico";
    const rawName = user.user_metadata?.full_name || 
                    user.user_metadata?.name || 
                    (user.email ? user.email.split("@")[0] : "Técnico");
    const clean = rawName.replace(/[._]/g, " ").trim();
    return clean.charAt(0).toUpperCase() + clean.slice(1);
  }

  function translateError(err) {
    if (!err || !err.message) return "Ocorreu um erro. Tente novamente.";
    const m = err.message.toLowerCase();
    if (m.includes("invalid login credentials")) return "E-mail ou senha incorretos.";
    if (m.includes("email not confirmed")) return "E-mail ainda não confirmado.";
    if (m.includes("user already registered")) return "Este e-mail já está cadastrado. Alterne para a aba 'Entrar'.";
    if (m.includes("password should be at least")) return "A senha deve ter pelo menos 6 caracteres.";
    if (m.includes("rate limit") || m.includes("too many requests")) return "Muitas tentativas. Aguarde alguns instantes.";
    if (m.includes("network") || m.includes("fetch")) return "Erro de conexão com o servidor. Verifique sua internet.";
    return err.message;
  }

  function showLoginError(msg) {
    if (!loginError) return;
    loginError.textContent = msg;
    loginError.classList.add("visible");
  }

  function hideLoginError() {
    if (!loginError) return;
    loginError.textContent = "";
    loginError.classList.remove("visible");
  }

  function showSignupError(msg) {
    if (!signupError) return;
    signupError.textContent = msg;
    signupError.classList.add("visible");
  }

  function hideSignupError() {
    if (!signupError) return;
    signupError.textContent = "";
    signupError.classList.remove("visible");
  }

  function setLoginLoading(loading) {
    if (!loginBtn) return;
    loginBtn.disabled = loading;
    if (loginBtnText) loginBtnText.textContent = loading ? "Entrando..." : "Entrar";
    if (loginSpinner) loginSpinner.style.display = loading ? "inline-block" : "none";
  }

  function setSignupLoading(loading) {
    if (!signupBtn) return;
    signupBtn.disabled = loading;
    if (signupBtnText) signupBtnText.textContent = loading ? "Cadastrando..." : "Criar Conta";
    if (signupSpinner) signupSpinner.style.display = loading ? "inline-block" : "none";
  }

  // ── Alternância de Abas (Entrar / Criar Conta) ────────────────────────────
  function setTab(tab) {
    hideLoginError();
    hideSignupError();
    if (signupSuccess) signupSuccess.style.display = "none";

    if (tab === "signup") {
      if (tabSignupBtn) tabSignupBtn.classList.add("active");
      if (tabLoginBtn) tabLoginBtn.classList.remove("active");
      if (loginForm) loginForm.style.display = "none";
      if (signupForm) signupForm.style.display = "flex";
      if (signupName) signupName.focus();
    } else {
      if (tabLoginBtn) tabLoginBtn.classList.add("active");
      if (tabSignupBtn) tabSignupBtn.classList.remove("active");
      if (signupForm) signupForm.style.display = "none";
      if (loginForm) loginForm.style.display = "flex";
      if (loginEmail) loginEmail.focus();
    }
  }

  if (tabLoginBtn) tabLoginBtn.addEventListener("click", () => setTab("login"));
  if (tabSignupBtn) tabSignupBtn.addEventListener("click", () => setTab("signup"));

  // ── Mostrar / Ocultar Senha ───────────────────────────────────────────────
  function setupPasswordToggle(btn, input) {
    if (!btn || !input) return;
    btn.addEventListener("click", () => {
      const isPass = input.type === "password";
      input.type = isPass ? "text" : "password";
      btn.innerHTML = isPass ? EYE_CLOSED : EYE_OPEN;
      btn.setAttribute("title", isPass ? "Ocultar senha" : "Mostrar senha");
    });
  }
  setupPasswordToggle(togglePassLogin, loginPass);
  setupPasswordToggle(togglePassSignup, signupPass);

  // ── Controle de Telas & Blindagem DOM ─────────────────────────────────────
  function hideAllOverlays() {
    if (overlay) {
      overlay.classList.add("hidden");
      setTimeout(() => {
        overlay.style.display = "none";
      }, 350);
    }
    if (waitingOverlay) {
      waitingOverlay.style.display = "none";
    }
  }

  function showLoginScreen(msg) {
    stopHeartbeat();
    currentUser = null;
    window.VIGI_AUTH_VERIFIED = false;
    localStorage.removeItem(K_USER_CACHE);
    localStorage.removeItem(K_LAST_ACTIVE);

    if (typeof window.VIGI_LOCK_PORTAL === "function") {
      window.VIGI_LOCK_PORTAL();
    }

    if (openAdminModalBtn) openAdminModalBtn.style.display = "none";
    if (navAdminItem) navAdminItem.style.display = "none";
    if (adminAccessModal) adminAccessModal.style.display = "none";

    if (waitingOverlay) waitingOverlay.style.display = "none";
    if (overlay) {
      overlay.classList.remove("hidden");
      overlay.style.display = "flex";
      overlay.style.opacity = "1";
    }
    setTab("login");
    if (msg) showLoginError(msg);
  }

  function showWaitingScreen() {
    stopHeartbeat();
    window.VIGI_AUTH_VERIFIED = false;

    if (typeof window.VIGI_LOCK_PORTAL === "function") {
      window.VIGI_LOCK_PORTAL();
    }

    if (openAdminModalBtn) openAdminModalBtn.style.display = "none";
    if (navAdminItem) navAdminItem.style.display = "none";
    if (adminAccessModal) adminAccessModal.style.display = "none";

    if (overlay) overlay.style.display = "none";
    if (waitingOverlay) {
      waitingOverlay.style.display = "flex";
    }
  }

  function showApp(user) {
    currentUser = user;
    window.VIGI_AUTH_VERIFIED = true;
    touchActivity();

    const name = formatUserName(user);
    const email = user.email || "";
    const isAdmin = isAdminUser(user);

    window.VIGI_USER_ROLE  = isAdmin ? "admin" : "tecnico";
    window.VIGI_USER_EMAIL = email;
    window.VIGI_USER_NAME  = name;

    localStorage.setItem(K_USER_CACHE, JSON.stringify({ email, name, id: user.id }));

    const initial = (name && name.length > 0) ? name.charAt(0).toUpperCase() : "T";

    if (userDisplayName) {
      userDisplayName.textContent = name;
    }

    if (userRoleBadge) {
      userRoleBadge.textContent = isAdmin ? "ADMIN VIGI" : "TÉCNICO VIGI";
      userRoleBadge.classList.toggle("is-admin", isAdmin);
    }

    if (openAdminModalBtn) {
      openAdminModalBtn.style.display = isAdmin ? "inline-flex" : "none";
    }
    if (navAdminItem) {
      navAdminItem.style.display = isAdmin ? "block" : "none";
    }

    const userAvatarInitial = document.getElementById("userAvatarInitial");
    if (userAvatarInitial) userAvatarInitial.textContent = initial;

    const sidebarUserName = document.getElementById("sidebarUserName");
    if (sidebarUserName) sidebarUserName.textContent = name;

    const sidebarUserAvatar = document.getElementById("sidebarUserAvatar");
    if (sidebarUserAvatar) sidebarUserAvatar.textContent = initial;

    // Inicializa e libera a renderização do Portal somente agora
    if (typeof window.VIGI_BOOT_PORTAL === "function") {
      window.VIGI_BOOT_PORTAL();
    }

    if (typeof window.VIGI_updateDashName === "function") {
      window.VIGI_updateDashName(name);
    } else {
      const dashName = document.getElementById("dashUserName");
      if (dashName) dashName.textContent = name.split(" ")[0];
    }

    hideAllOverlays();
    startHeartbeat(user);
  }

  // ── Verificação de Acesso (vigi_access) ────────────────────────────────────
  async function checkUserAccess(user) {
    if (!user) return false;
    try {
      const email = user.email ? user.email.toLowerCase().trim() : "";
      const { data, error } = await supabase
        .from("vigi_access")
        .select("id, user_id, granted")
        .or(`user_id.eq.${user.id},user_email.ilike.${email}`)
        .maybeSingle();

      if (error) {
        console.warn("Erro ao consultar vigi_access:", error);
        return false;
      }

      // Se o e-mail foi pré-autorizado pelo admin sem user_id vinculado, vincula agora
      if (data && !data.user_id && user.id) {
        try {
          await supabase
            .from("vigi_access")
            .update({ user_id: user.id })
            .eq("id", data.id);
        } catch (_) {}
      }

      return data && data.granted === true;
    } catch (err) {
      console.error("Falha ao checar vigi_access:", err);
      return false;
    }
  }

  // ── Sessão Única e Heartbeat (vigi_sessions) ───────────────────────────────
  async function registerDeviceSession(user) {
    const token = getSessionToken();
    const deviceInfo = getDeviceInfo();
    const now = new Date().toISOString();

    try {
      const { data: existing } = await supabase
        .from("vigi_sessions")
        .select("id, token")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existing && existing.id) {
        await supabase
          .from("vigi_sessions")
          .update({
            token: token,
            device_info: deviceInfo,
            last_seen: now,
            user_email: user.email
          })
          .eq("user_id", user.id);
      } else {
        await supabase
          .from("vigi_sessions")
          .insert([{
            user_id: user.id,
            user_email: user.email,
            token: token,
            device_info: deviceInfo,
            last_seen: now
          }]);
      }
    } catch (err) {
      console.warn("Não foi possível sincronizar vigi_sessions:", err);
    }
  }

  function startHeartbeat(user) {
    stopHeartbeat();
    heartbeatInterval = setInterval(async () => {
      if (!user || !user.id) return;

      // 1. Verifica expiração por inatividade prolongada (SESSION_TIMEOUT_HOURS)
      if (isSessionTimedOut()) {
        stopHeartbeat();
        await performLogout("⏰ Sua sessão expirou por inatividade. Faça login novamente.");
        return;
      }

      try {
        // 2. Verifica se o acesso continua concedido em vigi_access
        const stillGranted = await checkUserAccess(user);
        if (!stillGranted) {
          stopHeartbeat();
          showWaitingScreen();
          return;
        }

        // 3. Verifica sessão única por dispositivo em vigi_sessions
        const localToken = getSessionToken();
        const { data, error } = await supabase
          .from("vigi_sessions")
          .select("token")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) return; // falha transitória de rede

        // Se a sessão foi removida pelo Admin ou assumida por outro dispositivo
        if (!data || (data.token && data.token !== localToken)) {
          stopHeartbeat();
          await performLogout("⚠️ Esta conta foi conectada em outro dispositivo ou desconectada pelo administrador.");
          return;
        }

        // Mantém a sessão atualizada
        await supabase
          .from("vigi_sessions")
          .update({ last_seen: new Date().toISOString() })
          .eq("user_id", user.id);
      } catch (_) {}
    }, 45000);
  }

  function stopHeartbeat() {
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval);
      heartbeatInterval = null;
    }
  }

  // Atualiza timestamp de atividade em interações do usuário
  ["click", "keydown", "touchstart"].forEach(evt => {
    window.addEventListener(evt, () => {
      if (window.VIGI_AUTH_VERIFIED) touchActivity();
    }, { passive: true });
  });

  // ── Fluxo de Login ────────────────────────────────────────────────────────
  async function handleLogin(e) {
    e.preventDefault();
    hideLoginError();

    const email = loginEmail ? loginEmail.value.trim() : "";
    const password = loginPass ? loginPass.value : "";

    if (!email || !password) {
      showLoginError("Por favor, preencha o e-mail e a senha.");
      return;
    }

    try {
      setLoginLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        setLoginLoading(false);
        showLoginError(translateError(error));
        return;
      }

      const user = data.user;
      const isGranted = await checkUserAccess(user);

      if (!isGranted) {
        setLoginLoading(false);
        showWaitingScreen();
        return;
      }

      // Conexão concedida
      renewSessionToken();
      await registerDeviceSession(user);
      setLoginLoading(false);
      showApp(user);
    } catch (err) {
      setLoginLoading(false);
      showLoginError(translateError(err));
    }
  }

  // ── Fluxo de Cadastro ─────────────────────────────────────────────────────
  async function handleSignup(e) {
    e.preventDefault();
    hideSignupError();

    const name = signupName ? signupName.value.trim() : "";
    const email = signupEmail ? signupEmail.value.trim().toLowerCase() : "";
    const password = signupPass ? signupPass.value : "";

    if (!name) {
      showSignupError("Por favor, informe seu nome completo.");
      return;
    }
    if (!email) {
      showSignupError("Por favor, informe um e-mail válido.");
      return;
    }
    if (!password || password.length < 6) {
      showSignupError("A senha deve conter no mínimo 6 caracteres.");
      return;
    }

    try {
      setSignupLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name, name: name }
        }
      });

      if (error) {
        setSignupLoading(false);
        showSignupError(translateError(error));
        return;
      }

      setSignupLoading(false);
      if (signupSuccess) signupSuccess.style.display = "block";

      const user = data.user;
      if (user) {
        // Verifica se já havia sido pré-autorizado pelo Admin
        const alreadyGranted = await checkUserAccess(user);
        if (alreadyGranted) {
          renewSessionToken();
          await registerDeviceSession(user);
          showApp(user);
          return;
        }

        // Caso contrário, registra como pendente (granted: false) para aprovação do Admin
        try {
          await supabase.from("vigi_access").insert([{
            user_id: user.id,
            user_email: email,
            granted: false
          }]);
        } catch (_) {}

        setTimeout(() => {
          showWaitingScreen();
        }, 1200);
      }
    } catch (err) {
      setSignupLoading(false);
      showSignupError(translateError(err));
    }
  }

  // ── Logout ────────────────────────────────────────────────────────────────
  async function performLogout(forcedMsg) {
    stopHeartbeat();

    try {
      if (currentUser && currentUser.id && !forcedMsg) {
        await supabase
          .from("vigi_sessions")
          .delete()
          .eq("user_id", currentUser.id);
      }
    } catch (_) {}

    try {
      await supabase.auth.signOut();
    } catch (_) {}

    showLoginScreen(forcedMsg);
  }

  // ── Verificação de Sessão Inicial ─────────────────────────────────────────
  async function checkInitialSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session || !session.user) {
        showLoginScreen();
        return;
      }

      if (isSessionTimedOut()) {
        await performLogout("⏰ Sua sessão anterior expirou. Faça login novamente.");
        return;
      }

      const user = session.user;
      const isGranted = await checkUserAccess(user);

      if (!isGranted) {
        showWaitingScreen();
        return;
      }

      await registerDeviceSession(user);
      showApp(user);
    } catch (err) {
      console.warn("Falha ao checar sessão:", err);
      showLoginScreen();
    }
  }

  // ── Painel Admin: Controle de Acessos & Sessões ───────────────────────────
  function formatRelativeTime(isoStr) {
    if (!isoStr) return "—";
    const diffSec = Math.floor((Date.now() - new Date(isoStr).getTime()) / 1000);
    if (diffSec < 60) return "Agora mesmo";
    if (diffSec < 3600) return `há ${Math.floor(diffSec / 60)} min`;
    if (diffSec < 86400) return `há ${Math.floor(diffSec / 3600)}h`;
    return new Date(isoStr).toLocaleDateString("pt-BR");
  }

  async function loadAdminPanelData() {
    if (!currentUser || !isAdminUser(currentUser)) return;

    if (adminAccessList) adminAccessList.innerHTML = `<div class="admin-loading">Carregando acessos...</div>`;
    if (adminSessionsList) adminSessionsList.innerHTML = `<div class="admin-loading">Carregando sessões...</div>`;

    try {
      const [accessRes, sessionsRes] = await Promise.all([
        supabase.from("vigi_access").select("*").order("liberado_em", { ascending: false }),
        supabase.from("vigi_sessions").select("*").order("last_seen", { ascending: false })
      ]);

      const accessRows = accessRes.data || [];
      const sessionRows = sessionsRes.data || [];

      if (adminUsersCount) adminUsersCount.textContent = accessRows.length;
      if (adminSessionsCount) adminSessionsCount.textContent = sessionRows.length;

      // Renderizar Técnicos (vigi_access)
      if (adminAccessList) {
        if (accessRows.length === 0) {
          adminAccessList.innerHTML = `<div class="admin-empty">Nenhum técnico listado.</div>`;
        } else {
          adminAccessList.innerHTML = accessRows.map(row => {
            const email = (row.user_email || "").toLowerCase();
            const isSelf = currentUser.email && currentUser.email.toLowerCase() === email;
            const isRowAdmin = ADMIN_EMAILS.includes(email);
            const granted = row.granted === true;
            return `
              <div class="admin-item-row ${granted ? 'is-granted' : 'is-pending'}">
                <div class="admin-item-info">
                  <div class="admin-item-email">
                    <span>${email}</span>
                    ${isRowAdmin ? '<span class="admin-mini-tag tag-admin">ADMIN</span>' : ''}
                    <span class="admin-mini-tag ${granted ? 'tag-granted' : 'tag-pending'}">
                      ${granted ? '✓ Liberado' : '⏳ Bloqueado / Pendente'}
                    </span>
                  </div>
                  <span class="admin-item-meta">Registro: ${formatRelativeTime(row.liberado_em)}</span>
                </div>
                <div class="admin-item-actions">
                  ${isSelf ? `<span class="admin-self-note">Você</span>` : `
                    <button type="button" class="admin-action-btn ${granted ? 'btn-revoke' : 'btn-grant'}" data-toggle-access="${row.id}" data-current="${granted}">
                      ${granted ? 'Bloquear' : 'Liberar'}
                    </button>
                    <button type="button" class="admin-action-btn btn-del-row" data-delete-access="${row.id}" title="Remover registro">✕</button>
                  `}
                </div>
              </div>
            `;
          }).join("");

          adminAccessList.querySelectorAll("[data-toggle-access]").forEach(btn => {
            btn.addEventListener("click", async () => {
              const id = btn.getAttribute("data-toggle-access");
              const current = btn.getAttribute("data-current") === "true";
              btn.disabled = true;
              btn.textContent = "...";
              const { error } = await supabase
                .from("vigi_access")
                .update({ granted: !current, liberado_em: new Date().toISOString() })
                .eq("id", id);
              if (error) {
                if (window.showToast) window.showToast("Erro ao alterar permissão: " + error.message, "error");
              } else {
                if (window.showToast) window.showToast(!current ? "Acesso liberado com sucesso!" : "Acesso bloqueado!", !current ? "success" : "warning");
              }
              loadAdminPanelData();
            });
          });

          adminAccessList.querySelectorAll("[data-delete-access]").forEach(btn => {
            btn.addEventListener("click", async () => {
              const id = btn.getAttribute("data-delete-access");
              if (!confirm("Remover este e-mail da lista de controle de acesso?")) return;
              await supabase.from("vigi_access").delete().eq("id", id);
              if (window.showToast) window.showToast("Registro removido.", "info");
              loadAdminPanelData();
            });
          });
        }
      }

      // Renderizar Sessões (vigi_sessions)
      if (adminSessionsList) {
        if (sessionRows.length === 0) {
          adminSessionsList.innerHTML = `<div class="admin-empty">Nenhuma sessão ativa no momento.</div>`;
        } else {
          adminSessionsList.innerHTML = sessionRows.map(sess => {
            const email = (sess.user_email || "").toLowerCase();
            const isRecent = sess.last_seen && (Date.now() - new Date(sess.last_seen).getTime() < 5 * 60 * 1000);
            return `
              <div class="admin-item-row">
                <div class="admin-item-info">
                  <div class="admin-item-email">
                    <span class="sess-dot ${isRecent ? 'online' : 'idle'}"></span>
                    <span>${email}</span>
                  </div>
                  <span class="admin-item-meta">${sess.device_info || "Dispositivo"} · Visto ${formatRelativeTime(sess.last_seen)}</span>
                </div>
                <div class="admin-item-actions">
                  <button type="button" class="admin-action-btn btn-revoke" data-kill-session="${sess.id}" title="Encerrar e destravar sessão">
                    Desconectar
                  </button>
                </div>
              </div>
            `;
          }).join("");

          adminSessionsList.querySelectorAll("[data-kill-session]").forEach(btn => {
            btn.addEventListener("click", async () => {
              const id = btn.getAttribute("data-kill-session");
              btn.disabled = true;
              btn.textContent = "...";
              await supabase.from("vigi_sessions").delete().eq("id", id);
              if (window.showToast) window.showToast("Sessão encerrada com sucesso!", "info");
              loadAdminPanelData();
            });
          });
        }
      }
    } catch (err) {
      console.error("Erro ao carregar painel Admin:", err);
    }
  }

  function openAdminModal() {
    if (!adminAccessModal || !currentUser || !isAdminUser(currentUser)) return;
    adminAccessModal.style.display = "flex";
    loadAdminPanelData();
  }

  function closeAdminModal() {
    if (adminAccessModal) adminAccessModal.style.display = "none";
  }

  if (openAdminModalBtn) openAdminModalBtn.addEventListener("click", openAdminModal);
  if (sidebarAdminBtn) sidebarAdminBtn.addEventListener("click", () => {
    const sb = document.getElementById("sidebar");
    if (sb) sb.classList.remove("open");
    openAdminModal();
  });
  if (closeAdminModalBtn) closeAdminModalBtn.addEventListener("click", closeAdminModal);
  if (adminRefreshBtn) adminRefreshBtn.addEventListener("click", loadAdminPanelData);
  if (adminAccessModal) {
    adminAccessModal.addEventListener("click", (e) => {
      if (e.target === adminAccessModal) closeAdminModal();
    });
  }

  if (adminAddAccessForm) {
    adminAddAccessForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!adminNewEmailInput) return;
      const email = adminNewEmailInput.value.trim().toLowerCase();
      if (!email) return;

      const { data: existing } = await supabase
        .from("vigi_access")
        .select("id")
        .ilike("user_email", email)
        .maybeSingle();

      if (existing && existing.id) {
        await supabase
          .from("vigi_access")
          .update({ granted: true, liberado_em: new Date().toISOString() })
          .eq("id", existing.id);
      } else {
        await supabase
          .from("vigi_access")
          .insert([{ user_email: email, granted: true, liberado_em: new Date().toISOString() }]);
      }

      adminNewEmailInput.value = "";
      if (window.showToast) window.showToast(`E-mail ${email} autorizado!`, "success");
      loadAdminPanelData();
    });
  }

  // ── Event Listeners de Login / Logout ─────────────────────────────────────
  if (loginForm) loginForm.addEventListener("submit", handleLogin);
  if (signupForm) signupForm.addEventListener("submit", handleSignup);

  const logoutConfirmModal = document.getElementById("logoutConfirmModal");
  const cancelLogoutBtn    = document.getElementById("cancelLogoutBtn");
  const confirmLogoutBtn   = document.getElementById("confirmLogoutBtn");

  function openLogoutModal() {
    if (logoutConfirmModal) {
      logoutConfirmModal.style.display = "flex";
    } else {
      performLogout();
    }
  }

  function closeLogoutModal() {
    if (logoutConfirmModal) {
      logoutConfirmModal.style.display = "none";
    }
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      openLogoutModal();
    });
  }

  if (cancelLogoutBtn) {
    cancelLogoutBtn.addEventListener("click", closeLogoutModal);
  }

  if (confirmLogoutBtn) {
    confirmLogoutBtn.addEventListener("click", () => {
      closeLogoutModal();
      performLogout();
    });
  }

  if (logoutConfirmModal) {
    logoutConfirmModal.addEventListener("click", (e) => {
      if (e.target === logoutConfirmModal) closeLogoutModal();
    });
  }

  if (waitingLogoutBtn) waitingLogoutBtn.addEventListener("click", () => performLogout());

  // ── Inicialização ─────────────────────────────────────────────────────────
  checkInitialSession();

  // Exportar API do Auth no window para integração
  window.VIGI_AUTH = {
    supabase,
    performLogout,
    checkInitialSession,
    checkUserAccess,
    formatUserName,
    openAdminModal
  };

})();
