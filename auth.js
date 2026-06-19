/* ==========================================================================
   AUTH.JS — "ENTRAR COM VIGI" (SSO OAuth2 + PKCE)
   Portal Técnico VIGI Câmeras

   Os técnicos entram com o MESMO login/senha do sistema VIGI. A autenticação
   é delegada ao provedor SSO do backend VIGI (Authorization Code + PKCE, sem
   client_secret — este é um app estático/público). Nada de senha passa por
   aqui: ela é digitada na página da VIGI. Recebemos um token assinado (RS256)
   e usamos seus claims (sub/email/name).

   Trava de 1 dispositivo: heartbeat contra /oauth/session/heartbeat (chaveada
   pelo usuário VIGI). Conteúdo do portal é estático (não depende de Supabase).
   ========================================================================== */

(function () {
  "use strict";

  // ── Config ────────────────────────────────────────────────────────────────
  const SSO_BASE     = "https://backend.vigicameras.com.br/oauth";
  const CLIENT_ID    = "treinamento-tecnicos";
  const REDIRECT_URI = location.origin + "/";
  const SCOPE        = "openid profile email";

  const K_TOKEN   = "vigi_sso_token";
  const K_USER    = "vigi_sso_user";
  const K_DEVICE  = "vigi_device_token";
  const SS_VERIF  = "vigi_pkce_verifier";
  const SS_STATE  = "vigi_oauth_state";

  let heartbeatInterval = null;

  // ── Elementos DOM ─────────────────────────────────────────────────────────
  const overlay         = document.getElementById("loginOverlay");
  const loginForm       = document.getElementById("loginForm");
  const signupForm      = document.getElementById("signupForm");
  const waitingOverlay  = document.getElementById("waitingOverlay");
  const vigiLoginBtn    = document.getElementById("vigiLoginBtn");
  const vigiError       = document.getElementById("vigiError");
  const logoutBtn       = document.getElementById("logoutBtn");
  const userDisplayName = document.getElementById("userDisplayName");

  // ── Utils ─────────────────────────────────────────────────────────────────
  function b64url(buf) {
    return btoa(String.fromCharCode.apply(null, new Uint8Array(buf)))
      .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  function randomStr(len) {
    const a = new Uint8Array(len);
    crypto.getRandomValues(a);
    return b64url(a.buffer).slice(0, len);
  }
  async function sha256b64url(str) {
    const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
    return b64url(hash);
  }
  function decodeJwt(token) {
    let p = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    while (p.length % 4) p += "=";
    const json = decodeURIComponent(
      atob(p).split("").map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join("")
    );
    return JSON.parse(json);
  }
  function tokenExpired(token) {
    try { return (decodeJwt(token).exp * 1000) < (Date.now() + 5000); }
    catch (_) { return true; }
  }
  function getDeviceInfo() {
    const ua = navigator.userAgent;
    let browser = "Navegador";
    if (ua.includes("Chrome") && !ua.includes("Edg")) browser = "Chrome";
    else if (ua.includes("Firefox")) browser = "Firefox";
    else if (ua.includes("Edg")) browser = "Edge";
    else if (ua.includes("Safari")) browser = "Safari";
    return `${browser} / ${/Mobi|Android/i.test(ua) ? "Mobile" : "Desktop"}`;
  }
  function getDeviceToken() {
    let dt = localStorage.getItem(K_DEVICE);
    if (!dt) {
      dt = (crypto.randomUUID ? crypto.randomUUID() : randomStr(32));
      localStorage.setItem(K_DEVICE, dt);
    }
    return dt;
  }
  function showError(msg) {
    if (!vigiError) return;
    vigiError.textContent = msg;
    vigiError.classList.add("visible");
  }
  function setBtnLoading(loading) {
    if (!vigiLoginBtn) return;
    vigiLoginBtn.disabled = loading;
    const t = document.getElementById("vigiLoginBtnText");
    const s = document.getElementById("vigiLoginSpinner");
    if (t) t.textContent = loading ? "Redirecionando…" : "Entrar com Vigi";
    if (s) s.style.display = loading ? "inline" : "none";
  }
  function clearSession() {
    localStorage.removeItem(K_TOKEN);
    localStorage.removeItem(K_USER);
  }

  // ── Telas ─────────────────────────────────────────────────────────────────
  function hideAll() {
    if (overlay) overlay.style.display = "none";
    if (waitingOverlay) waitingOverlay.style.display = "none";
  }
  function showLoginScreen(msg) {
    hideAll();
    if (overlay) {
      overlay.style.display = "flex";
      overlay.style.opacity = "1";
      overlay.classList.remove("hidden");
    }
    if (msg) showError(msg);
  }
  function showForceLogout() {
    showLoginScreen("⚠️ Esta conta está sendo usada em outro dispositivo. Você foi desconectado.");
  }
  function showApp(user) {
    const name = user.name || (user.email || "").split("@")[0] || "Técnico";
    if (userDisplayName) userDisplayName.textContent = name;
    hideAll();
    window.VIGI_USER_ROLE  = "tecnico";
    window.VIGI_USER_EMAIL = user.email || "";
    window.VIGI_USER_NAME  = name;
    if (typeof window.VIGI_updateDashName === "function") {
      window.VIGI_updateDashName(name);
    } else {
      const el = document.getElementById("dashUserName");
      if (el) el.textContent = name.split(" ")[0];
    }
  }

  // ── Heartbeat (trava de 1 dispositivo) ────────────────────────────────────
  // Retorna { owner:bool } | { expired:true } | { neterror:true }
  async function heartbeat(token) {
    try {
      const resp = await fetch(SSO_BASE + "/session/heartbeat", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
        body: JSON.stringify({ device_token: getDeviceToken(), device_info: getDeviceInfo() }),
      });
      if (resp.status === 401) return { expired: true };
      if (!resp.ok) return { neterror: true };
      const j = await resp.json();
      return { owner: j.owner === true };
    } catch (_) {
      return { neterror: true }; // blip de rede não desconecta
    }
  }
  function startHeartbeat() {
    clearInterval(heartbeatInterval);
    heartbeatInterval = setInterval(async () => {
      const token = localStorage.getItem(K_TOKEN);
      if (!token || tokenExpired(token)) { stopHeartbeat(); clearSession(); showLoginScreen("Sua sessão expirou. Entre novamente."); return; }
      const hb = await heartbeat(token);
      if (hb.expired) { stopHeartbeat(); clearSession(); showLoginScreen("Sua sessão expirou. Entre novamente."); }
      else if (hb.owner === false) { stopHeartbeat(); clearSession(); showForceLogout(); }
    }, 60_000);
  }
  function stopHeartbeat() { clearInterval(heartbeatInterval); }

  // ── Início do login (redirect PKCE) ───────────────────────────────────────
  async function startLogin() {
    try {
      setBtnLoading(true);
      const verifier  = randomStr(64);
      const challenge = await sha256b64url(verifier);
      const state     = randomStr(24);
      sessionStorage.setItem(SS_VERIF, verifier);
      sessionStorage.setItem(SS_STATE, state);
      const url = new URL(SSO_BASE + "/authorize");
      url.searchParams.set("response_type", "code");
      url.searchParams.set("client_id", CLIENT_ID);
      url.searchParams.set("redirect_uri", REDIRECT_URI);
      url.searchParams.set("scope", SCOPE);
      url.searchParams.set("state", state);
      url.searchParams.set("code_challenge", challenge);
      url.searchParams.set("code_challenge_method", "S256");
      location.assign(url.toString());
    } catch (e) {
      setBtnLoading(false);
      showError("Não foi possível iniciar o login. Tente novamente.");
      console.error(e);
    }
  }

  // ── Pós-token (claims + claim de dispositivo + abrir app) ─────────────────
  async function onAuthenticated(token) {
    const claims = decodeJwt(token);
    const user = {
      sub: claims.sub,
      email: claims.email || "",
      name: claims.name || (claims.email || "").split("@")[0],
    };
    localStorage.setItem(K_TOKEN, token);
    localStorage.setItem(K_USER, JSON.stringify(user));
    const hb = await heartbeat(token);
    if (hb.owner === false) { clearSession(); showForceLogout(); return; }
    startHeartbeat();
    showApp(user);
  }

  // ── Callback do OAuth (?code=) ────────────────────────────────────────────
  async function handleCallback() {
    const params = new URLSearchParams(location.search);
    const code  = params.get("code");
    const state = params.get("state");
    if (!code) return false;

    const savedState = sessionStorage.getItem(SS_STATE);
    const verifier   = sessionStorage.getItem(SS_VERIF);
    history.replaceState({}, document.title, REDIRECT_URI); // limpa o ?code da URL

    if (!verifier || !savedState || state !== savedState) {
      showLoginScreen("Sessão de login inválida. Tente novamente.");
      return true;
    }
    try {
      const resp = await fetch(SSO_BASE + "/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri: REDIRECT_URI,
          client_id: CLIENT_ID,
          code_verifier: verifier,
        }),
      });
      sessionStorage.removeItem(SS_VERIF);
      sessionStorage.removeItem(SS_STATE);
      if (!resp.ok) { showLoginScreen("Falha ao autenticar. Tente novamente."); return true; }
      const data = await resp.json();
      await onAuthenticated(data.access_token);
    } catch (e) {
      showLoginScreen("Erro de conexão ao autenticar.");
      console.error(e);
    }
    return true;
  }

  // ── Sessão existente (reload) ─────────────────────────────────────────────
  async function checkExistingSession() {
    const token = localStorage.getItem(K_TOKEN);
    if (!token || tokenExpired(token)) { clearSession(); showLoginScreen(); return; }
    const hb = await heartbeat(token);
    if (hb.expired) { clearSession(); showLoginScreen("Sua sessão expirou. Entre novamente."); return; }
    if (hb.owner === false) { clearSession(); showForceLogout(); return; }
    const user = JSON.parse(localStorage.getItem(K_USER) || "{}");
    startHeartbeat();
    showApp(user);
  }

  // ── Logout ────────────────────────────────────────────────────────────────
  async function performLogout() {
    stopHeartbeat();
    // Libera a trava de dispositivo no servidor (senão o slot fica preso até expirar).
    const token = localStorage.getItem(K_TOKEN);
    if (token) {
      try {
        await fetch(SSO_BASE + "/session/logout", {
          method: "POST",
          headers: { "Authorization": "Bearer " + token },
        });
      } catch (_) { /* best effort */ }
    }
    clearSession();
    showLoginScreen();
  }

  // ── Wiring ────────────────────────────────────────────────────────────────
  if (vigiLoginBtn) vigiLoginBtn.addEventListener("click", startLogin);
  if (logoutBtn) logoutBtn.addEventListener("click", performLogout);

  // ── Inicialização ─────────────────────────────────────────────────────────
  // Esconde os formulários legados de e-mail/senha e cadastro (substituídos
  // pelo botão "Entrar com Vigi"); o conteúdo HTML permanece, só não é usado.
  if (loginForm) loginForm.style.display = "none";
  if (signupForm) signupForm.style.display = "none";

  if (overlay) {
    overlay.style.display = "flex";
    overlay.style.opacity = "0";
    overlay.style.transition = "opacity 0.4s";
  }
  (async () => {
    const wasCallback = await handleCallback();
    if (!wasCallback) await checkExistingSession();
    if (overlay) overlay.style.opacity = "1";
  })();

})();
