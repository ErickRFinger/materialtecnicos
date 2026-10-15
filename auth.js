/* ==========================================================================
   AUTH.JS — AUTENTICAÇÃO COM SUPABASE & CONTROLE DE SESSÃO ÚNICA
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
  let heartbeatInterval = null;
  let currentUser       = null;

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

  // ── SVGs para alternância de senha ────────────────────────────────────────
  const EYE_OPEN = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
  const EYE_CLOSED = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;

  // ── Utilitários ───────────────────────────────────────────────────────────
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
    return t;
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

  // ── Controle de Telas ─────────────────────────────────────────────────────
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
    localStorage.removeItem(K_USER_CACHE);

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
    if (overlay) overlay.style.display = "none";
    if (waitingOverlay) {
      waitingOverlay.style.display = "flex";
    }
  }

  function showApp(user) {
    currentUser = user;
    const name = formatUserName(user);
    const email = user.email || "";

    window.VIGI_USER_ROLE  = "tecnico";
    window.VIGI_USER_EMAIL = email;
    window.VIGI_USER_NAME  = name;

    localStorage.setItem(K_USER_CACHE, JSON.stringify({ email, name, id: user.id }));

    const initial = (name && name.length > 0) ? name.charAt(0).toUpperCase() : "T";

    if (userDisplayName) {
      userDisplayName.textContent = name;
    }

    const userAvatarInitial = document.getElementById("userAvatarInitial");
    if (userAvatarInitial) userAvatarInitial.textContent = initial;

    const sidebarUserName = document.getElementById("sidebarUserName");
    if (sidebarUserName) sidebarUserName.textContent = name;

    const sidebarUserAvatar = document.getElementById("sidebarUserAvatar");
    if (sidebarUserAvatar) sidebarUserAvatar.textContent = initial;

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
        .select("granted")
        .or(`user_id.eq.${user.id},user_email.ilike.${email}`)
        .maybeSingle();

      if (error) {
        console.warn("Erro ao consultar vigi_access:", error);
        return false;
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
      try {
        const localToken = getSessionToken();
        const { data, error } = await supabase
          .from("vigi_sessions")
          .select("token")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) return; // falha transitória de rede

        // Se outro dispositivo assumiu o registro com um token diferente
        if (data && data.token && data.token !== localToken) {
          stopHeartbeat();
          await performLogout("⚠️ Esta conta foi conectada em outro dispositivo. Você foi desconectado.");
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
    const email = signupEmail ? signupEmail.value.trim() : "";
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
        // Tenta registrar na tabela de acesso para facilitar a aprovação
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
    const token = getSessionToken();

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

  // ── Event Listeners ───────────────────────────────────────────────────────
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
    formatUserName
  };

})();
