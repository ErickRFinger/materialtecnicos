/* ==========================================================================
   AUTH.JS — SISTEMA DE AUTENTICAÇÃO SUPABASE
   Portal Técnico VIGI Câmeras
   ========================================================================== */

(function () {
  "use strict";

  // ── Inicializa cliente Supabase ──────────────────────────────────────────
  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);

  // ── Constantes ───────────────────────────────────────────────────────────
  const SESSION_TOKEN_KEY = "vigi_session_token";
  const SESSION_USER_KEY  = "vigi_session_user";
  const TIMEOUT_MS        = SESSION_TIMEOUT_HOURS * 60 * 60 * 1000;
  let   heartbeatInterval = null;

  // ── Elementos DOM ────────────────────────────────────────────────────────
  const overlay          = document.getElementById("loginOverlay");
  const waitingOverlay   = document.getElementById("waitingOverlay");
  const loginForm        = document.getElementById("loginForm");
  const signupForm       = document.getElementById("signupForm");
  const tabLogin         = document.getElementById("tabLogin");
  const tabSignup        = document.getElementById("tabSignup");
  const loginError       = document.getElementById("loginError");
  const signupError      = document.getElementById("signupError");
  const signupSuccess    = document.getElementById("signupSuccess");
  const loginBtn         = document.getElementById("loginBtn");
  const loginBtnText     = document.getElementById("loginBtnText");
  const loginSpinner     = document.getElementById("loginSpinner");
  const signupBtn        = document.getElementById("signupBtn");
  const signupBtnText    = document.getElementById("signupBtnText");
  const signupSpinner    = document.getElementById("signupSpinner");
  const logoutBtn        = document.getElementById("logoutBtn");
  const waitingLogoutBtn = document.getElementById("waitingLogoutBtn");
  const userDisplayName  = document.getElementById("userDisplayName");

  // ── Utils ────────────────────────────────────────────────────────────────
  function generateToken() {
    return crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2) + Date.now().toString(36);
  }

  function getDeviceInfo() {
    const ua = navigator.userAgent;
    let browser = "Navegador";
    if (ua.includes("Chrome") && !ua.includes("Edg")) browser = "Chrome";
    else if (ua.includes("Firefox")) browser = "Firefox";
    else if (ua.includes("Edg")) browser = "Edge";
    else if (ua.includes("Safari")) browser = "Safari";
    const isMobile = /Mobi|Android/i.test(ua);
    return `${browser} / ${isMobile ? "Mobile" : "Desktop"}`;
  }

  function showError(el, msg) {
    el.textContent = msg;
    el.classList.add("visible");
    setTimeout(() => el.classList.remove("visible"), 6000);
  }

  function setLoginLoading(loading) {
    loginBtn.disabled = loading;
    loginBtnText.textContent = loading ? "Entrando…" : "Entrar";
    loginSpinner.style.display = loading ? "inline" : "none";
  }

  function setSignupLoading(loading) {
    signupBtn.disabled = loading;
    signupBtnText.textContent = loading ? "Criando conta…" : "Criar Conta";
    signupSpinner.style.display = loading ? "inline" : "none";
  }

  // ── Verificar se usuário tem acesso liberado ──────────────────────────────
  async function checkUserAccess(userId) {
    const { data, error } = await supabase
      .from("vigi_access")
      .select("granted")
      .eq("user_id", userId)
      .single();

    if (error) return false; // sem registro = sem acesso
    return data?.granted === true;
  }

  // ── Verificar sessão única por dispositivo ────────────────────────────────
  async function checkSingleDevice(userId, localToken) {
    const { data, error } = await supabase
      .from("vigi_sessions")
      .select("token, last_seen")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      console.warn("Erro ao verificar sessão:", error.message);
      return { allowed: true };
    }

    if (!data) return { allowed: true };

    if (data.token === localToken) return { allowed: true };

    const lastSeen = new Date(data.last_seen).getTime();
    if (Date.now() - lastSeen > TIMEOUT_MS) return { allowed: true };

    return { allowed: false };
  }

  // ── Criar/atualizar sessão no Supabase ────────────────────────────────────
  async function upsertSession(userId, email, token) {
    const { error } = await supabase
      .from("vigi_sessions")
      .upsert(
        {
          user_id:     userId,
          user_email:  email,
          token:       token,
          device_info: getDeviceInfo(),
          last_seen:   new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );
    if (error) console.warn("Erro ao salvar sessão:", error.message);
  }

  // ── Remover sessão ────────────────────────────────────────────────────────
  async function deleteSession(userId) {
    await supabase.from("vigi_sessions").delete().eq("user_id", userId);
  }

  // ── Heartbeat ─────────────────────────────────────────────────────────────
  function startHeartbeat(userId, localToken) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = setInterval(async () => {
      const check = await checkSingleDevice(userId, localToken);
      if (!check.allowed) {
        stopHeartbeat();
        await supabase.auth.signOut();
        sessionStorage.clear();
        showForceLogout();
        return;
      }
      await supabase
        .from("vigi_sessions")
        .update({ last_seen: new Date().toISOString() })
        .eq("user_id", userId);
    }, 60_000);
  }

  function stopHeartbeat() {
    clearInterval(heartbeatInterval);
  }

  // ── Telas ─────────────────────────────────────────────────────────────────
  function hideAll() {
    overlay.style.display = "none";
    if (waitingOverlay) waitingOverlay.style.display = "none";
  }

  function showLoginScreen() {
    hideAll();
    overlay.style.display = "flex";
    overlay.style.opacity = "1";
    overlay.classList.remove("hidden");
    tabLogin.click();
  }

  function showForceLogout() {
    hideAll();
    overlay.style.display = "flex";
    overlay.style.opacity = "1";
    overlay.classList.remove("hidden");
    loginError.textContent = "⚠️ Esta conta foi acessada em outro dispositivo. Você foi desconectado.";
    loginError.classList.add("visible");
    tabLogin.click();
  }

  function showWaitingScreen() {
    hideAll();
    if (waitingOverlay) waitingOverlay.style.display = "flex";
  }

  function showApp(user) {
    const name = user.user_metadata?.nome || user.email.split("@")[0];
    if (userDisplayName) userDisplayName.textContent = name;
    hideAll();
    // O app-container fica visível (nunca foi ocultado, só o overlay cobre)
  }

  // ── Tabs ──────────────────────────────────────────────────────────────────
  tabLogin.addEventListener("click", () => {
    tabLogin.classList.add("active");
    tabSignup.classList.remove("active");
    loginForm.style.display = "";
    signupForm.style.display = "none";
    loginError.classList.remove("visible");
  });

  tabSignup.addEventListener("click", () => {
    tabSignup.classList.add("active");
    tabLogin.classList.remove("active");
    signupForm.style.display = "";
    loginForm.style.display = "none";
    signupError.classList.remove("visible");
    signupSuccess.style.display = "none";
  });

  // ── Toggle senha ──────────────────────────────────────────────────────────
  function setupToggle(btnId, inputId) {
    const btn = document.getElementById(btnId);
    const inp = document.getElementById(inputId);
    if (btn && inp) btn.addEventListener("click", () => {
      inp.type = inp.type === "password" ? "text" : "password";
    });
  }
  setupToggle("togglePassLogin", "loginPass");
  setupToggle("togglePassSignup", "signupPass");

  // ── Lógica pós-autenticação (shared entre login e reload) ─────────────────
  async function handleAuthSuccess(user) {
    // 1. Verificar sessão única
    const localToken = sessionStorage.getItem(SESSION_TOKEN_KEY);
    const check = await checkSingleDevice(user.id, localToken);

    if (!check.allowed) {
      await supabase.auth.signOut();
      showError(loginError, "🔒 Este login já está sendo usado em outro dispositivo. Peça ao técnico para sair primeiro.");
      showLoginScreen();
      return;
    }

    // 2. Gerar/manter token e salvar sessão
    const token = localToken || generateToken();
    sessionStorage.setItem(SESSION_TOKEN_KEY, token);
    sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify({
      id: user.id, email: user.email,
      nome: user.user_metadata?.nome || user.email
    }));

    await upsertSession(user.id, user.email, token);

    // 3. Verificar acesso liberado
    const hasAccess = await checkUserAccess(user.id);

    if (!hasAccess) {
      // Usuário logado mas sem acesso liberado → tela de espera
      showWaitingScreen();
      // Fica verificando a cada 30s se o acesso foi liberado
      const accessCheckInterval = setInterval(async () => {
        const granted = await checkUserAccess(user.id);
        if (granted) {
          clearInterval(accessCheckInterval);
          startHeartbeat(user.id, token);
          showApp(user);
        }
      }, 30_000);
      return;
    }

    // 4. Acesso OK — iniciar heartbeat e mostrar app
    startHeartbeat(user.id, token);
    showApp(user);
  }

  // ── FLUXO DE LOGIN ────────────────────────────────────────────────────────
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    loginError.classList.remove("visible");

    const email = document.getElementById("loginEmail").value.trim();
    const pass  = document.getElementById("loginPass").value;
    if (!email || !pass) { showError(loginError, "Preencha e-mail e senha."); return; }

    setLoginLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password: pass });

      if (authError) {
        const msg = authError.message;
        if (msg.includes("Email not confirmed")) {
          showError(loginError, "Confirme seu e-mail antes de acessar. Verifique sua caixa de entrada.");
        } else if (msg.includes("Invalid login credentials")) {
          showError(loginError, "E-mail ou senha incorretos.");
        } else {
          showError(loginError, msg);
        }
        setLoginLoading(false);
        return;
      }

      await handleAuthSuccess(authData.user);

    } catch (err) {
      showError(loginError, "Erro de conexão. Verifique sua internet.");
      console.error(err);
    }

    setLoginLoading(false);
  });

  // ── FLUXO DE CADASTRO ─────────────────────────────────────────────────────
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    signupError.classList.remove("visible");
    signupSuccess.style.display = "none";

    const nome  = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const pass  = document.getElementById("signupPass").value;

    if (!nome || !email || !pass) { showError(signupError, "Preencha todos os campos."); return; }
    if (pass.length < 6) { showError(signupError, "A senha deve ter pelo menos 6 caracteres."); return; }

    setSignupLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: { data: { nome } },
      });

      if (error) {
        if (error.message.includes("already registered")) {
          showError(signupError, "Este e-mail já está cadastrado. Faça login.");
        } else {
          showError(signupError, error.message);
        }
        setSignupLoading(false);
        return;
      }

      // Se Supabase retornou sessão (email confirmations desativado), já entra
      if (data.session) {
        await handleAuthSuccess(data.user);
        return;
      }

      // Senão mostra mensagem de confirmação
      signupSuccess.style.display = "block";
      signupSuccess.textContent = "✅ Cadastro realizado! Verifique seu e-mail para confirmar a conta e então faça login.";
      signupForm.reset();

    } catch (err) {
      showError(signupError, "Erro de conexão. Verifique sua internet.");
      console.error(err);
    }

    setSignupLoading(false);
  });

  // ── LOGOUT (header) ───────────────────────────────────────────────────────
  async function performLogout() {
    stopHeartbeat();
    const userData = JSON.parse(sessionStorage.getItem(SESSION_USER_KEY) || "{}");
    if (userData.id) await deleteSession(userData.id);
    await supabase.auth.signOut();
    sessionStorage.clear();
    showLoginScreen();
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      logoutBtn.disabled = true;
      logoutBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg> Saindo…`;
      await performLogout();
      logoutBtn.disabled = false;
      logoutBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg> Sair`;
    });
  }

  // ── LOGOUT (tela de espera) ───────────────────────────────────────────────
  if (waitingLogoutBtn) {
    waitingLogoutBtn.addEventListener("click", performLogout);
  }

  // ── VERIFICAR SESSÃO EXISTENTE (reload da página) ─────────────────────────
  async function checkExistingSession() {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) { showLoginScreen(); return; }

      const localToken = sessionStorage.getItem(SESSION_TOKEN_KEY);
      if (!localToken) {
        // Abriu nova aba sem sessionStorage → forçar login
        await supabase.auth.signOut();
        showLoginScreen();
        return;
      }

      await handleAuthSuccess(session.user);

    } catch (err) {
      console.error("Erro ao verificar sessão:", err);
      showLoginScreen();
    }
  }

  // ── INICIALIZAÇÃO ─────────────────────────────────────────────────────────
  overlay.style.display = "flex";
  overlay.style.opacity = "0";
  overlay.style.transition = "opacity 0.4s";
  if (waitingOverlay) waitingOverlay.style.display = "none";

  checkExistingSession().then(() => {
    overlay.style.opacity = "1";
  });

})();
