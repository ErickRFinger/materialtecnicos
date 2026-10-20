/* ==========================================================================
   PORTAL TÉCNICO VIGI - APLICATIVO LOGIC
   ========================================================================== */

/* ------------------------------------------------------------------
   LOGIN: Gerenciado por auth.js (Supabase)
   ------------------------------------------------------------------ */

document.addEventListener("DOMContentLoaded", () => {
  // ELEMENTOS DO DOM
  const navItems = document.querySelectorAll(".nav-item");
  const sections = document.querySelectorAll(".content-section");
  const mobileMenuToggle = document.getElementById("mobileMenuToggle");
  const sidebar = document.getElementById("sidebar");
  const globalSearch = document.getElementById("globalSearch");
  const sidebarSearch = document.getElementById("sidebarSearch");
  const searchClearBtn = document.getElementById("searchClearBtn");
  
  // Grids de renderização
  const videosGrid = document.getElementById("videos-grid");
  const artesGrid = document.getElementById("artes-grid");
  const manuaisContainer = document.getElementById("manuais-container");
  
  // Contadores do dashboard
  const countAlarme = document.getElementById("count-alarme");
  const countHik = document.getElementById("count-hik");
  const countUnv = document.getElementById("count-unv");
  const countTec = document.getElementById("count-tec");
  
  // Filtros de vídeo
  const videoFilterBar = document.getElementById("video-filters");
  
  // Formulário de Solicitação (gerenciado dentro de setupEventListeners)
  const tableEmptyState = document.getElementById("tableEmptyState");
  
  // Modal de Mídia
  const mediaModal = document.getElementById("mediaModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");
  const modalClose = document.getElementById("modalClose");

  // Elementos do Slideshow
  const slideDeck = document.getElementById("slideDeck");
  const prevSlideBtn = document.getElementById("prevSlideBtn");
  const nextSlideBtn = document.getElementById("nextSlideBtn");
  const slideProgressDots = document.getElementById("slideProgressDots");
  const slideCounterLabel = document.getElementById("slideCounterLabel");
  const btnFullscreenSlides = document.getElementById("btnFullscreenSlides");
  const slideshowWrapper = document.getElementById("slideshowWrapper");
  const btnCloseFullscreen = document.getElementById("btnCloseFullscreen");
  const slideProgressTopFill = document.getElementById("slideProgressTopFill");

  // ==========================================================================
  // SISTEMA DE TOASTS FLUTUANTES
  // ==========================================================================
  window.showToast = function(message, type = "info", icon = "") {
    const toastContainer = document.getElementById("toastContainer");
    if (!toastContainer) return;

    const toast = document.createElement("div");
    toast.className = `toast-item toast-${type}`;

    let defaultIcon = "ℹ️";
    if (type === "success") defaultIcon = "✅";
    else if (type === "warning") defaultIcon = "⚠️";
    else if (type === "error") defaultIcon = "❌";

    const displayIcon = icon || defaultIcon;

    toast.innerHTML = `
      <span class="toast-icon">${displayIcon}</span>
      <span class="toast-text">${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("toast-leaving");
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 260);
    }, 3200);
  };

  // ESTADO GLOBAL DO APP
  let currentActiveTab = "dashboard";
  let activeVideoFilter = "todos";
  let activeManualFilter = "todos";
  let currentSearchQuery = "";
  
  // Estado para visualizador de imagem (Lightbox Zoom & Pan)
  let zoomFactor = 1.0;
  let panX = 0;
  let panY = 0;
  let isPanning = false;
  let panStartX = 0;
  let panStartY = 0;
  let originalImgX = 0;
  let originalImgY = 0;

  // Estado para os Slides de Treinamento
  let currentSlideIndex = 0;
  const totalSlides = VIGI_DATA.slides.length;
  let isPortalInitialized = false;
  let datetimeInterval = null;

  // ==========================================================================
  // INICIALIZAÇÃO E BLINDAGEM DO PORTAL (SOMENTE APÓS AUTH + VIGI_ACCESS)
  // ==========================================================================
  // Sincronização dinâmica opcional com Supabase (tabela vigi_materiais + Storage vigi-midia)
  async function syncMediaFromSupabase() {
    try {
      const sb = window.VIGI_AUTH && window.VIGI_AUTH.supabase;
      if (!sb) return;
      const { data, error } = await sb.from("vigi_materiais").select("*");
      if (error || !Array.isArray(data) || data.length === 0) return;

      let updated = false;
      data.forEach(row => {
        if (row.tipo === "video") {
          const existing = VIGI_DATA.videos.find(v => v.id === row.id);
          if (existing) {
            if (row.capa_url) existing.capa = row.capa_url;
            if (row.video_url) existing.videoUrl = row.video_url;
            if (row.drive_url) existing.driveUrl = row.drive_url;
            if (row.titulo) existing.titulo = row.titulo;
            if (row.descricao) existing.descricao = row.descricao;
            updated = true;
          } else {
            VIGI_DATA.videos.push({
              id: row.id,
              titulo: row.titulo,
              categoria: row.categoria || "Material Técnico",
              marca: row.marca || "VIGI",
              capa: row.capa_url || "VIGI.png",
              caminho: "VIGI.png",
              videoUrl: row.video_url || "",
              driveUrl: row.drive_url || "",
              descricao: row.descricao || ""
            });
            updated = true;
          }
        } else if (row.tipo === "arte") {
          const existingArt = VIGI_DATA.artes.find(a => a.id === row.id);
          if (existingArt) {
            if (row.capa_url || row.video_url) existingArt.caminho = row.capa_url || row.video_url;
            if (row.drive_url) existingArt.driveUrl = row.drive_url;
            if (row.titulo) existingArt.titulo = row.titulo;
            if (row.descricao) existingArt.descricao = row.descricao;
            updated = true;
          }
        }
      });

      if (updated) {
        updateStats();
        updateFilterCounts();
        renderVideos(activeVideoFilter, currentSearchQuery);
        renderArtes(currentSearchQuery);
      }
    } catch (_) {
      // Silencioso caso a tabela vigi_materiais ainda não tenha sido criada no Supabase
    }
  }

  function init() {
    const appContainer = document.getElementById("appContainer");
    const mobileBottomNav = document.getElementById("mobileBottomNav");
    if (appContainer) {
      appContainer.style.display = "flex";
      appContainer.setAttribute("aria-hidden", "false");
    }
    if (mobileBottomNav) {
      mobileBottomNav.style.display = "";
    }

    updateStats();
    updateFilterCounts();
    renderFavorites();
    renderVideos(activeVideoFilter, currentSearchQuery);
    renderArtes(currentSearchQuery);
    renderManuais(currentSearchQuery);
    loadRequests();
    renderSlide(currentSlideIndex);
    setupSlideDots();
    initDashboardGreeting();
    initDashboardFeaturedVideos();
    initGoldChecklist();
    syncMediaFromSupabase();

    if (!isPortalInitialized) {
      initTipsCarousel();
      setupEventListeners();
      isPortalInitialized = true;
    }
  }

  function lockPortal() {
    const appContainer = document.getElementById("appContainer");
    const mobileBottomNav = document.getElementById("mobileBottomNav");
    if (appContainer) {
      appContainer.style.display = "none";
      appContainer.setAttribute("aria-hidden", "true");
    }
    if (mobileBottomNav) {
      mobileBottomNav.style.display = "none";
    }
    if (videosGrid) videosGrid.innerHTML = "";
    if (artesGrid) artesGrid.innerHTML = "";
    if (manuaisContainer) manuaisContainer.innerHTML = "";
    if (slideDeck) slideDeck.innerHTML = "";
    const favoritesList = document.getElementById("favoritesList");
    if (favoritesList) favoritesList.innerHTML = "";
    closeModal();
  }

  window.VIGI_BOOT_PORTAL = init;
  window.VIGI_LOCK_PORTAL = lockPortal;

  // ==========================================================================
  // COMPORTAMENTO DE NAVEGAÇÃO E ABAS
  // ==========================================================================
  function switchTab(tabId) {
    if (!tabId) return;
    currentActiveTab = tabId;
    navItems.forEach(item => {
      if (item.getAttribute("data-tab") === tabId) { item.classList.add("active"); }
      else { item.classList.remove("active"); }
    });
    sections.forEach(section => {
      if (section.getAttribute("id") === tabId) { section.classList.add("active"); }
      else { section.classList.remove("active"); }
    });
    // Sincronizar barra de navegação inferior (mobile)
    document.querySelectorAll(".mobile-nav-btn").forEach(btn => {
      if (btn.getAttribute("data-tab") === tabId) { btn.classList.add("active"); }
      else { btn.classList.remove("active"); }
    });
    sidebar.classList.remove("open");
    window.scrollTo({ top: 0, behavior: "smooth" });
    applyFiltersAndSearch();
  }

  // Eventos de clique na sidebar e atalhos
  function setupEventListeners() {
    // Menu Sidebar
    navItems.forEach(item => {
      item.addEventListener("click", () => {
        const tabId = item.getAttribute("data-tab");
        if (tabId) switchTab(tabId);
      });
    });

    // Hamburguer Mobile
    mobileMenuToggle.addEventListener("click", () => {
      sidebar.classList.toggle("open");
    });

    // Barra de navegação inferior (mobile)
    document.querySelectorAll(".mobile-nav-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const tabId = btn.getAttribute("data-tab");
        switchTab(tabId);
      });
    });

    // Fechar sidebar ao clicar fora em telas pequenas
    document.addEventListener("click", (e) => {
      if (window.innerWidth <= 768) {
        if (!sidebar.contains(e.target) && !mobileMenuToggle.contains(e.target) && sidebar.classList.contains("open")) {
          sidebar.classList.remove("open");
        }
      }
    });

    // ── BUSCA GLOBAL UNIFICADA ────────────────────────────────────────────────
    const searchContainer = globalSearch?.closest(".search-container") || document.querySelector(".search-container");
    const searchPanel     = document.getElementById("globalSearchPanel");

    // Função auxiliar: destaca o termo no texto
    function highlight(text, term) {
      if (!term) return text;
      const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return text.replace(new RegExp(`(${escaped})`, "gi"),
        '<span class="gsp-highlight">$1</span>');
    }

    function openSearchPanel() {
      if (!searchPanel) return;
      searchPanel.style.display = "block";
      searchContainer?.classList.add("panel-active");
    }

    function closeSearchPanel() {
      if (!searchPanel) return;
      searchPanel.style.display = "none";
      searchContainer?.classList.remove("panel-active");
    }

    function clearSearch() {
      if (globalSearch) globalSearch.value = "";
      if (sidebarSearch) sidebarSearch.value = "";
      if (searchClearBtn) searchClearBtn.style.display = "none";
      currentSearchQuery = "";
      closeSearchPanel();
      if (currentActiveTab !== "dashboard") applyFiltersAndSearch();
    }

    function runGlobalSearch(query) {
      if (!searchPanel) return;
      if (!query || query.length < 2) { closeSearchPanel(); return; }
      openSearchPanel();

      const q = query.toLowerCase();

      // ── Vídeos ──
      const vidResults = VIGI_DATA.videos.filter(v =>
        v.titulo.toLowerCase().includes(q) ||
        v.descricao.toLowerCase().includes(q) ||
        v.categoria.toLowerCase().includes(q)
      ).slice(0, 5);

      // ── Artes ──
      const artResults = VIGI_DATA.artes.filter(a =>
        a.titulo.toLowerCase().includes(q) ||
        a.descricao.toLowerCase().includes(q) ||
        a.categoria.toLowerCase().includes(q)
      ).slice(0, 4);

      // ── Manuais ──
      const manResults = VIGI_DATA.manuais.filter(m =>
        m.titulo.toLowerCase().includes(q) ||
        m.descricao.toLowerCase().includes(q) ||
        m.categoria.toLowerCase().includes(q)
      ).slice(0, 4);

      const total = vidResults.length + artResults.length + manResults.length;

      // ── Renderizar seção de vídeos ──
      const gspVideos = document.getElementById("gspVideos");
      const gspVideosList = document.getElementById("gspVideosList");
      const gspVideosCount = document.getElementById("gspVideosCount");
      if (gspVideos && gspVideosList) {
        gspVideos.style.display = vidResults.length ? "block" : "none";
        if (gspVideosCount) gspVideosCount.textContent = vidResults.length;
        gspVideosList.innerHTML = vidResults.map(v => `
          <button class="gsp-item" data-gsp-type="video" data-gsp-id="${v.id}">
            <span class="gsp-item-icon gsp-icon-video">🎬</span>
            <span class="gsp-item-info">
              <span class="gsp-item-title">${highlight(v.titulo, query)}</span>
              <span class="gsp-item-sub">${highlight(v.descricao.substring(0,60), query)}...</span>
            </span>
            <span class="gsp-item-tag tag-video">${v.categoria}</span>
            <span class="gsp-item-arrow">›</span>
          </button>
        `).join("");
      }

      // ── Renderizar seção de artes ──
      const gspArtes = document.getElementById("gspArtes");
      const gspArtesList = document.getElementById("gspArtesList");
      const gspArtesCount = document.getElementById("gspArtesCount");
      if (gspArtes && gspArtesList) {
        gspArtes.style.display = artResults.length ? "block" : "none";
        if (gspArtesCount) gspArtesCount.textContent = artResults.length;
        gspArtesList.innerHTML = artResults.map(a => `
          <button class="gsp-item" data-gsp-type="arte" data-gsp-id="${a.id}">
            <span class="gsp-item-icon gsp-icon-arte">🖼️</span>
            <span class="gsp-item-info">
              <span class="gsp-item-title">${highlight(a.titulo, query)}</span>
              <span class="gsp-item-sub">${highlight(a.categoria, query)}</span>
            </span>
            <span class="gsp-item-tag tag-arte">Arte</span>
            <span class="gsp-item-arrow">›</span>
          </button>
        `).join("");
      }

      // ── Renderizar seção de manuais ──
      const gspManuais = document.getElementById("gspManuais");
      const gspManuaisList = document.getElementById("gspManuaisList");
      const gspManuaisCount = document.getElementById("gspManuaisCount");
      if (gspManuais && gspManuaisList) {
        gspManuais.style.display = manResults.length ? "block" : "none";
        if (gspManuaisCount) gspManuaisCount.textContent = manResults.length;
        gspManuaisList.innerHTML = manResults.map(m => `
          <button class="gsp-item" data-gsp-type="manual" data-gsp-id="${m.id}">
            <span class="gsp-item-icon gsp-icon-manual">📋</span>
            <span class="gsp-item-info">
              <span class="gsp-item-title">${highlight(m.titulo, query)}</span>
              <span class="gsp-item-sub">${highlight(m.categoria, query)}</span>
            </span>
            <span class="gsp-item-tag tag-manual">Guia</span>
            <span class="gsp-item-arrow">›</span>
          </button>
        `).join("");
      }

      // ── Estado vazio ──
      const gspEmpty = document.getElementById("gspEmpty");
      if (gspEmpty) gspEmpty.style.display = total === 0 ? "flex" : "none";

      // ── Delegação de cliques nos itens ──
      searchPanel.querySelectorAll(".gsp-item").forEach(btn => {
        btn.addEventListener("click", () => {
          const type = btn.getAttribute("data-gsp-type");
          const id   = btn.getAttribute("data-gsp-id");
          clearSearch();

          if (type === "video") {
            switchTab("videos");
            const videoObj = VIGI_DATA.videos.find(v => v.id === id);
            if (videoObj) setTimeout(() => openVideoPlayer(videoObj), 200);
          } else if (type === "arte") {
            switchTab("artes");
            const artObj = VIGI_DATA.artes.find(a => a.id === id);
            if (artObj) setTimeout(() => openLightbox(artObj), 200);
          } else if (type === "manual") {
            switchTab("manuais");
            setTimeout(() => openGuide(id), 200);
          }
        });
      });
    }

    function handleSearchInput(value, source) {
      const q = value.trim();
      currentSearchQuery = q.toLowerCase();

      // Sincronizar campo alternativo
      if (source === globalSearch && sidebarSearch) sidebarSearch.value = value;
      if (source === sidebarSearch && globalSearch) globalSearch.value = value;

      // Exibir ou esconder botão de limpar
      if (searchClearBtn) {
        searchClearBtn.style.display = value.length > 0 ? "flex" : "none";
      }

      runGlobalSearch(q);
      if (currentActiveTab !== "dashboard") applyFiltersAndSearch();
    }

    if (globalSearch) {
      globalSearch.addEventListener("input", (e) => handleSearchInput(e.target.value, globalSearch));
      globalSearch.addEventListener("keydown", (e) => {
        if (e.key === "Escape") { closeSearchPanel(); globalSearch.blur(); }
      });
      globalSearch.addEventListener("focus", () => {
        if (globalSearch.value.trim().length >= 2) runGlobalSearch(globalSearch.value.trim());
      });
    }

    if (sidebarSearch) {
      sidebarSearch.addEventListener("input", (e) => handleSearchInput(e.target.value, sidebarSearch));
      sidebarSearch.addEventListener("keydown", (e) => {
        if (e.key === "Escape") { closeSearchPanel(); sidebarSearch.blur(); }
      });
    }

    if (searchClearBtn) {
      searchClearBtn.addEventListener("click", () => {
        clearSearch();
        globalSearch?.focus();
      });
    }

    // Atalho global Cmd+K / Ctrl+K
    document.addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (globalSearch) {
          globalSearch.focus();
          globalSearch.select();
        }
      }
    });

    // Fechar ao clicar fora
    document.addEventListener("click", (e) => {
      if (!searchContainer?.contains(e.target)) closeSearchPanel();
    });

    // ESC global também fecha
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && searchPanel?.style.display !== "none") {
        closeSearchPanel();
      }
    });

    // Filtros de Categoria de Vídeo
    if (videoFilterBar) {
      videoFilterBar.addEventListener("click", (e) => {
        const btn = e.target.closest(".filter-btn");
        if (!btn) return;
        
        // Remove active de todos
        videoFilterBar.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        
        activeVideoFilter = btn.getAttribute("data-filter");
        renderVideos(activeVideoFilter, currentSearchQuery);
      });
    }

    // Atalhos do Dashboard
    document.querySelectorAll("[data-target-tab]").forEach(btn => {
      btn.addEventListener("click", () => {
        const tab = btn.getAttribute("data-target-tab");
        const filter = btn.getAttribute("data-target-filter");
        switchTab(tab);
        if (filter && tab === "videos") {
          activeVideoFilter = filter.toLowerCase();
          const filterBtn = document.querySelector(`#video-filters [data-filter="${filter.toLowerCase()}"]`);
          if (filterBtn) {
            document.querySelectorAll("#video-filters .filter-btn").forEach(b => b.classList.remove("active"));
            filterBtn.classList.add("active");
          }
          renderVideos(activeVideoFilter, currentSearchQuery);
        }
      });
    });

    document.querySelectorAll("[data-target-guide]").forEach(btn => {
      btn.addEventListener("click", () => {
        const guideId = btn.getAttribute("data-target-guide");
        switchTab("manuais");
        openGuide(guideId);
      });
    });

    // Formulário de Solicitação (Kanban)
    const requestForm = document.getElementById("requestForm");
    if (requestForm) {
      requestForm.addEventListener("submit", handleRequestSubmit);
    }

    // Toggle do formulário de solicitação
    const toggleBtn  = document.getElementById("toggleKanbanForm");
    const cancelBtn  = document.getElementById("cancelKanbanForm");
    const formPanel  = document.getElementById("kanbanFormPanel");

    if (toggleBtn && formPanel) {
      toggleBtn.addEventListener("click", () => {
        const isOpen = formPanel.classList.contains("panel-open");
        if (isOpen) {
          formPanel.classList.remove("panel-open");
          formPanel.style.display = "";
          toggleBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>Nova Solicitação`;
          // Fechar via transição
          setTimeout(() => { formPanel.style.display = "none"; }, 400);
        } else {
          formPanel.style.display = "block";
          // Força reflow para iniciar a transição
          formPanel.getBoundingClientRect();
          formPanel.classList.add("panel-open");
          toggleBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>Fechar`;
          // Auto-preencher nome do usuário
          fillUserName();
        }
      });
    }
    if (cancelBtn && formPanel) {
      cancelBtn.addEventListener("click", () => {
        formPanel.classList.remove("panel-open");
        toggleBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>Nova Solicitação`;
        setTimeout(() => {
          formPanel.style.display = "none";
          if (requestForm) requestForm.reset();
          // Resetar contador
          const counter = document.getElementById("reqCharCounter");
          if (counter) { counter.textContent = "0 / 500"; counter.className = "req-char-counter"; }
        }, 400);
      });
    }

    // Contador de caracteres do textarea
    const reqDesc = document.getElementById("reqDesc");
    const reqCharCounter = document.getElementById("reqCharCounter");
    if (reqDesc && reqCharCounter) {
      reqDesc.addEventListener("input", () => {
        const len = reqDesc.value.length;
        reqCharCounter.textContent = `${len} / 500`;
        reqCharCounter.className = "req-char-counter";
        if (len >= 450) reqCharCounter.classList.add("danger");
        else if (len >= 350) reqCharCounter.classList.add("warn");
        if (len > 0) reqDesc.classList.add("valid");
        else reqDesc.classList.remove("valid");
      });
    }

    // Validação visual em tempo real nos campos do formulário
    ["reqTitle", "reqType", "reqUrgency"].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener("change", () => {
          if (el.value.trim()) el.classList.add("valid");
          else el.classList.remove("valid");
        });
        el.addEventListener("input", () => {
          if (el.value.trim()) el.classList.add("valid");
          else el.classList.remove("valid");
        });
      }
    });

    // Limpar todas as solicitações
    const clearAllBtn = document.getElementById("btnClearAll");
    if (clearAllBtn) {
      clearAllBtn.addEventListener("click", () => {
        if (!confirm("Deseja remover TODAS as solicitações? Esta ação não pode ser desfeita.")) return;
        localStorage.removeItem("vigi_requests");
        loadRequests();
      });
    }

    // Fechamento de Modal
    modalClose.addEventListener("click", closeModal);
    mediaModal.addEventListener("click", (e) => {
      if (e.target === mediaModal) closeModal();
    });

    // Fechar modal ou sair de tela cheia com tecla ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (slideshowWrapper && slideshowWrapper.classList.contains("fullscreen")) {
          slideshowWrapper.classList.remove("fullscreen");
          updateFullscreenBtnUI();
        } else {
          closeModal();
        }
      }
    });

    // Fechar tela cheia com botão flutuante
    if (btnCloseFullscreen) {
      btnCloseFullscreen.addEventListener("click", () => {
        if (slideshowWrapper) {
          slideshowWrapper.classList.remove("fullscreen");
          updateFullscreenBtnUI();
        }
      });
    }

    // Controles de Slides de Certificação
    if (prevSlideBtn) prevSlideBtn.addEventListener("click", prevSlide);
    if (nextSlideBtn) nextSlideBtn.addEventListener("click", nextSlide);
    
    // Atalhos de teclado para Slides (Seta Esquerda / Direita)
    document.addEventListener("keydown", (e) => {
      if (currentActiveTab === "treinamento") {
        if (e.key === "ArrowLeft") {
          prevSlide();
        } else if (e.key === "ArrowRight") {
          nextSlide();
        }
      }
    });

    // Gestos de deslize touch (Swipe) em dispositivos móveis
    if (slideshowWrapper) {
      let touchStartX = 0;
      let touchStartY = 0;

      slideshowWrapper.addEventListener("touchstart", (e) => {
        if (e.changedTouches && e.changedTouches.length > 0) {
          touchStartX = e.changedTouches[0].screenX;
          touchStartY = e.changedTouches[0].screenY;
        }
      }, { passive: true });

      slideshowWrapper.addEventListener("touchend", (e) => {
        if (e.changedTouches && e.changedTouches.length > 0) {
          const touchEndX = e.changedTouches[0].screenX;
          const touchEndY = e.changedTouches[0].screenY;
          const diffX = touchEndX - touchStartX;
          const diffY = touchEndY - touchStartY;

          // Limiar de 40px e movimento horizontal maior que vertical
          if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
            if (diffX < 0) {
              nextSlide();
            } else {
              prevSlide();
            }
          }
        }
      }, { passive: true });
    }

    // Tela cheia do Slideshow
    if (btnFullscreenSlides) {
      btnFullscreenSlides.addEventListener("click", () => {
        if (slideshowWrapper) {
          slideshowWrapper.classList.toggle("fullscreen");
          updateFullscreenBtnUI();
        }
      });
    }

    // Atualiza ícone/texto do botão de tela cheia
    function updateFullscreenBtnUI() {
      if (!btnFullscreenSlides || !slideshowWrapper) return;
      if (slideshowWrapper.classList.contains("fullscreen")) {
        btnFullscreenSlides.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 14h6v6m10-6h-6v6M4 10h6V4m10 6h-6V4"></path>
          </svg>
          Sair Tela Cheia
        `;
      } else {
        btnFullscreenSlides.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
          </svg>
          Tela Cheia
        `;
      }
    }

    // Filtros de Categoria de Manuais
    const manualFilters = document.getElementById("manual-filters");
    if (manualFilters) {
      manualFilters.addEventListener("click", (e) => {
        const btn = e.target.closest(".filter-btn");
        if (!btn) return;
        
        manualFilters.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        
        activeManualFilter = btn.getAttribute("data-filter");
        renderManuais(currentSearchQuery);
      });
    }

    // Limpar Checklists de Manuais
    const btnResetAllChecklists = document.getElementById("btnResetAllChecklists");
    if (btnResetAllChecklists) {
      btnResetAllChecklists.addEventListener("click", () => {
        const confirmClear = confirm("Deseja realmente limpar o progresso de todos os checklists?");
        if (!confirmClear) return;

        // Clear all keys starting with vigi_step_
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith("vigi_step_")) {
            localStorage.removeItem(key);
          }
        });

        // Feedback visual no botão
        const originalText = btnResetAllChecklists.innerHTML;
        btnResetAllChecklists.innerHTML = "🗑️ Limpo! ✓";
        btnResetAllChecklists.style.borderColor = "var(--color-success)";
        btnResetAllChecklists.style.color = "var(--color-success)";
        btnResetAllChecklists.style.backgroundColor = "rgba(16, 185, 129, 0.05)";

        setTimeout(() => {
          btnResetAllChecklists.innerHTML = originalText;
          btnResetAllChecklists.style.borderColor = "var(--color-danger)";
          btnResetAllChecklists.style.color = "var(--color-danger)";
          btnResetAllChecklists.style.backgroundColor = "rgba(239, 68, 68, 0.05)";
        }, 1500);

        // Re-render
        renderManuais(currentSearchQuery);
      });
    }

    // Event delegation para estrelas de favoritos nos grids
    if (videosGrid) {
      videosGrid.addEventListener("click", (e) => {
        const starBtn = e.target.closest(".favorite-star-btn");
        if (starBtn) {
          e.stopPropagation();
          const id = starBtn.getAttribute("data-id");
          toggleFavorite(id, "video");
        }
      });
    }

    if (artesGrid) {
      artesGrid.addEventListener("click", (e) => {
        const starBtn = e.target.closest(".favorite-star-btn");
        if (starBtn) {
          e.stopPropagation();
          const id = starBtn.getAttribute("data-id");
          toggleFavorite(id, "arte");
        }
      });
    }

    if (manuaisContainer) {
      manuaisContainer.addEventListener("click", (e) => {
        const starBtn = e.target.closest(".favorite-star-btn");
        if (starBtn) {
          e.stopPropagation();
          const id = starBtn.getAttribute("data-id");
          toggleFavorite(id, "manual");
        }
      });
    }

    // Event delegation para upvotes e acesso material no painel de solicitações
    const requestsCardsContainer = document.getElementById("requestsCardsContainer");
    if (requestsCardsContainer) {
      requestsCardsContainer.addEventListener("click", (e) => {
        const upvoteBtn = e.target.closest(".upvote-btn");
        if (upvoteBtn) {
          const reqId = upvoteBtn.getAttribute("data-id");
          toggleUpvote(reqId);
          return;
        }

        const accessBtn = e.target.closest(".access-material-btn");
        if (accessBtn) {
          const reqId = accessBtn.getAttribute("data-id");
          const requests = JSON.parse(localStorage.getItem("vigi_requests") || "[]");
          const reqObj = requests.find(r => r.id === reqId);
          if (reqObj && reqObj.linkMaterial) {
            handleAccessMaterial(reqObj.linkMaterial);
          }
          return;
        }
      });
    }
  }

  // ==========================================================================
  // FILTRAGEM E MOTOR DE BUSCA
  // ==========================================================================
  function applyFiltersAndSearch() {
    if (currentActiveTab === "videos") {
      renderVideos(activeVideoFilter, currentSearchQuery);
    } else if (currentActiveTab === "artes") {
      renderArtes(currentSearchQuery);
    } else if (currentActiveTab === "manuais") {
      renderManuais(currentSearchQuery);
    }
  }

  // ==========================================================================
  // DASHBOARD — SAUDAÇÃO PERSONALIZADA + DATA/HORA
  // ==========================================================================
  function initDashboardGreeting() {
    const emojiEl  = document.getElementById("dashGreetingEmoji");
    const labelEl  = document.getElementById("dashHelloLabel");
    const nameEl   = document.getElementById("dashUserName");
    const dtTextEl = document.getElementById("dashDatetimeText");

    // Saudação por horário
    const hour = new Date().getHours();
    let greeting = "Boa noite,", emoji = "🌙";
    if (hour >= 5  && hour < 12) { greeting = "Bom dia,";  emoji = "☀️"; }
    else if (hour >= 12 && hour < 18) { greeting = "Boa tarde,"; emoji = "🌤️"; }
    if (emojiEl) emojiEl.textContent = emoji;
    if (labelEl) labelEl.textContent = greeting;

    // Utilitário: nunca exibe email — extrai parte antes do @ e capitaliza
    function parseName(raw) {
      if (!raw || !raw.trim()) return null;
      const val = raw.includes("@") ? raw.split("@")[0] : raw.trim();
      // Remove pontos/underscores e capitaliza primeira letra
      const clean = val.replace(/[._]/g, " ").trim();
      return clean.charAt(0).toUpperCase() + clean.slice(1).split(" ")[0];
    }

    // Expõe função global para o auth.js atualizar o nome após login
    window.VIGI_updateDashName = function(rawName) {
      const firstName = parseName(rawName) || "Técnico";
      if (nameEl) nameEl.textContent = firstName;
    };

    // Só define o nome agora se o auth.js ainda não o definiu
    // (evita sobrescrever o valor correto já setado pelo showApp)
    if (!window.VIGI_USER_NAME) {
      // Tenta ler do sessionStorage (reloads)
      try {
        const userData = JSON.parse(sessionStorage.getItem("vigi_session_user") || "{}");
        const raw = userData.nome || userData.email || "";
        const fromSession = parseName(raw);
        if (nameEl && fromSession) nameEl.textContent = fromSession;
      } catch(e) { /* ignora */ }
    }
    // Se VIGI_USER_NAME já está set (auth foi rápido), garantir exibição correta
    else if (nameEl) {
      nameEl.textContent = parseName(window.VIGI_USER_NAME) || "Técnico";
    }

    // Data/hora em tempo real
    function updateDatetime() {
      const now = new Date();
      const datePart = now.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
      const dateFormatted = datePart.charAt(0).toUpperCase() + datePart.slice(1);
      const timePart = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
      if (dtTextEl) dtTextEl.textContent = `${dateFormatted} — ${timePart}`;
    }
    updateDatetime();
    if (datetimeInterval) clearInterval(datetimeInterval);
    datetimeInterval = setInterval(updateDatetime, 30000);
  }

  // ==========================================================================
  // RENDERIZADORES DE CONTEÚDO
  // ==========================================================================

  // Dashboard - Estatísticas Rápidas
  function updateStats() {
    const totalAlarme = VIGI_DATA.videos.filter(v => v.categoria === "Alarme").length;
    const totalHik = VIGI_DATA.videos.filter(v => v.categoria === "Hikvision").length;
    const totalUnv = VIGI_DATA.videos.filter(v => v.categoria === "Uniview").length;
    const totalProc = VIGI_DATA.videos.filter(v => v.categoria === "Procedimentos").length;
    const totalTec = VIGI_DATA.manuais.length;
    const totalArtes = VIGI_DATA.artes.length;

    if (countAlarme) countAlarme.textContent = totalAlarme;
    if (countHik) countHik.textContent = totalHik;
    if (countUnv) countUnv.textContent = totalUnv;
    if (countTec) countTec.textContent = totalTec;
    
    const countProcEl = document.getElementById("count-proc");
    if (countProcEl) countProcEl.textContent = totalProc;

    const countArtesEl = document.getElementById("count-artes");
    if (countArtesEl) countArtesEl.textContent = totalArtes;
  }

  // Atualizar contadores em badges nos filtros
  function updateFilterCounts() {
    // Filtros de vídeos
    const videoBtns = document.querySelectorAll("#video-filters .filter-btn");
    videoBtns.forEach(btn => {
      const f = btn.getAttribute("data-filter");
      let count = 0;
      if (f === "todos") {
        count = VIGI_DATA.videos.length;
      } else {
        count = VIGI_DATA.videos.filter(v => v.categoria.toLowerCase() === f.toLowerCase()).length;
      }
      let badge = btn.querySelector(".filter-count");
      if (!badge) {
        badge = document.createElement("span");
        badge.className = "filter-count";
        btn.appendChild(badge);
      }
      badge.textContent = count;
    });

    // Filtros de manuais
    const manualBtns = document.querySelectorAll("#manual-filters .filter-btn");
    manualBtns.forEach(btn => {
      const f = btn.getAttribute("data-filter");
      let count = 0;
      if (f === "todos") {
        count = VIGI_DATA.manuais.length;
      } else {
        count = VIGI_DATA.manuais.filter(m => m.categoria.toLowerCase() === f.toLowerCase()).length;
      }
      let badge = btn.querySelector(".filter-count");
      if (!badge) {
        badge = document.createElement("span");
        badge.className = "filter-count";
        btn.appendChild(badge);
      }
      badge.textContent = count;
    });
  }

  // Renderizar Vídeos
  function renderVideos(filter = "todos", search = "") {
    if (!videosGrid) return;
    videosGrid.innerHTML = "";

    // Filtra dados
    let filtered = VIGI_DATA.videos;
    
    if (filter !== "todos") {
      filtered = filtered.filter(v => v.categoria.toLowerCase() === filter);
    }

    if (search !== "") {
      filtered = filtered.filter(v => 
        v.titulo.toLowerCase().includes(search) || 
        v.descricao.toLowerCase().includes(search) ||
        v.marca.toLowerCase().includes(search)
      );
    }

    if (filtered.length === 0) {
      videosGrid.innerHTML = `
        <div class="empty-state" style="grid-column: 1/-1;">
          Nenhum vídeo explicativo encontrado para os filtros selecionados.
        </div>
      `;
      return;
    }

    const favorites = JSON.parse(localStorage.getItem("vigi_favorites") || "[]");

    filtered.forEach(video => {
      const card = document.createElement("div");
      card.className = "video-card";
      
      const tagClass = getBrandTagClass(video.categoria);
      const isFav = favorites.some(fav => fav.id === video.id);

      const categoryCovers = {
        "Alarme": "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80",
        "Hikvision": "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80",
        "Uniview": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
        "Material Técnico": "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=600&q=80",
        "Procedimentos": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80"
      };
      const defaultCover = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80";
      const capaUrl = video.capa || categoryCovers[video.categoria] || defaultCover;

      card.innerHTML = `
        <div class="video-thumbnail">
          <img src="${capaUrl}" alt="${video.titulo}" class="video-cover-img" loading="lazy" onerror="this.onerror=null;this.src='${defaultCover}';" />
          <div class="thumbnail-overlay"></div>
          <span class="video-brand-tag ${tagClass}">${video.categoria}</span>
          <span class="video-hd-badge">HD</span>
          <button class="play-overlay-btn" aria-label="Assistir Vídeo">▶</button>
        </div>
        <div class="video-card-body">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
            <h3 class="video-card-title">${video.titulo}</h3>
            <button class="favorite-star-btn ${isFav ? 'active' : ''}" data-id="${video.id}" title="Favoritar">
              ${isFav ? '★' : '☆'}
            </button>
          </div>
          <p class="video-card-desc">${video.descricao}</p>
          <div class="video-card-footer">
            <span class="video-duration">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21.2 15c.7-1.2 1-2.5.7-3.9-.6-2-2.4-3.5-4.4-3.5h-1.2c-.7-3-3.2-5.2-6.2-5.6-3-.3-5.9 1.3-7.3 4-1.2 2.5-1 5.4.5 7.6M22 10V6h-4"></path>
              </svg>
              Vídeo
            </span>
            <div class="card-quick-actions">
              <button class="card-action-icon-btn whatsapp-share" title="Enviar no WhatsApp" aria-label="Enviar no WhatsApp">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
              </button>
              <button class="card-action-icon-btn copy-link" title="Copiar Link" aria-label="Copiar Link">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              </button>
              <button class="watch-btn">Assistir</button>
            </div>
          </div>
        </div>
      `;

      // Evento para abrir o player de vídeo
      const actionBtn = card.querySelector(".watch-btn");
      const thumbBox = card.querySelector(".video-thumbnail");
      
      const triggerWatch = () => openVideoPlayer(video);
      actionBtn.addEventListener("click", triggerWatch);
      if (thumbBox) thumbBox.addEventListener("click", triggerWatch);

      // Ações de compartilhamento
      const waBtn = card.querySelector(".whatsapp-share");
      if (waBtn) {
        waBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          const shareUrl = video.driveUrl || window.location.href;
          const msg = `📹 *Suporte Técnico VIGI*\n*${video.titulo}*\nCategoria: ${video.categoria}\nAssista aqui: ${shareUrl}`;
          window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, "_blank");
        });
      }

      const cpBtn = card.querySelector(".copy-link");
      if (cpBtn) {
        cpBtn.addEventListener("click", async (e) => {
          e.stopPropagation();
          const shareUrl = video.driveUrl || window.location.href;
          try {
            await navigator.clipboard.writeText(shareUrl);
            if (typeof window.showToast === "function") {
              window.showToast(`Link de "${video.titulo}" copiado!`, "success", "📋");
            }
          } catch (err) {
            if (typeof window.showToast === "function") {
              window.showToast("Falha ao copiar link", "warning");
            }
          }
        });
      }

      videosGrid.appendChild(card);
    });
  }

  // Renderizar Galeria de Imagens/Artes
  function renderArtes(search = "") {
    if (!artesGrid) return;
    artesGrid.innerHTML = "";

    let filtered = VIGI_DATA.artes;

    if (search !== "") {
      filtered = filtered.filter(art => 
        art.titulo.toLowerCase().includes(search) || 
        art.descricao.toLowerCase().includes(search) ||
        art.categoria.toLowerCase().includes(search)
      );
    }

    if (filtered.length === 0) {
      artesGrid.innerHTML = `
        <div class="empty-state" style="grid-column: 1/-1;">
          Nenhuma arte ou tabela encontrada para essa busca.
        </div>
      `;
      return;
    }

    const favorites = JSON.parse(localStorage.getItem("vigi_favorites") || "[]");

    filtered.forEach(art => {
      const card = document.createElement("div");
      card.className = "art-card";
      
      const isFav = favorites.some(fav => fav.id === art.id);

      card.innerHTML = `
        <div class="art-thumbnail">
          <img src="${art.caminho}" alt="${art.titulo}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src=''; this.style.backgroundColor='#1a1c23';">
          <div class="art-zoom-overlay">
            <span class="zoom-icon-btn" style="font-size: 24px; color: white;">↗️</span>
          </div>
        </div>
        <div class="art-card-body">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
            <div style="flex-grow: 1;">
              <span class="art-card-category">${art.categoria}</span>
              <h3 class="art-card-title">${art.titulo}</h3>
            </div>
            <button class="favorite-star-btn ${isFav ? 'active' : ''}" data-id="${art.id}" title="Favoritar">
              ${isFav ? '★' : '☆'}
            </button>
          </div>
          <p class="art-card-desc">${art.descricao}</p>
          <div class="art-actions">
            <button class="art-btn-main view-art-btn">Ampliar Tabela</button>
            <div class="card-quick-actions">
              <button class="card-action-icon-btn whatsapp-share" title="Enviar no WhatsApp" aria-label="Enviar no WhatsApp">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
              </button>
              <button class="card-action-icon-btn copy-link" title="Copiar Informações" aria-label="Copiar Informações">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              </button>
            </div>
          </div>
        </div>
      `;

      const viewBtn = card.querySelector(".view-art-btn");
      const zoomOverlay = card.querySelector(".art-zoom-overlay");
      
      const triggerZoom = () => openLightbox(art);
      viewBtn.addEventListener("click", triggerZoom);
      zoomOverlay.addEventListener("click", triggerZoom);

      // Ações de compartilhamento da arte
      const waArtBtn = card.querySelector(".whatsapp-share");
      if (waArtBtn) {
        waArtBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          const msg = `📊 *Material Técnico VIGI*\n*${art.titulo}*\nCategoria: ${art.categoria}\n${art.descricao}`;
          window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, "_blank");
        });
      }

      const cpArtBtn = card.querySelector(".copy-link");
      if (cpArtBtn) {
        cpArtBtn.addEventListener("click", async (e) => {
          e.stopPropagation();
          try {
            await navigator.clipboard.writeText(`${art.titulo} - ${art.categoria}\n${art.descricao}`);
            if (typeof window.showToast === "function") {
              window.showToast(`Info de "${art.titulo}" copiada!`, "success", "📋");
            }
          } catch (err) {
            if (typeof window.showToast === "function") {
              window.showToast("Falha ao copiar", "warning");
            }
          }
        });
      }

      artesGrid.appendChild(card);
    });
  }

  // Renderizar Guias e Manuais (com Checklists)
  function renderManuais(search = "") {
    if (!manuaisContainer) return;
    manuaisContainer.innerHTML = "";

    let filtered = VIGI_DATA.manuais;

    if (activeManualFilter !== "todos") {
      filtered = filtered.filter(g => g.categoria === activeManualFilter);
    }

    if (search !== "") {
      filtered = filtered.filter(g => 
        g.titulo.toLowerCase().includes(search) || 
        g.descricao.toLowerCase().includes(search) ||
        g.categoria.toLowerCase().includes(search)
      );
    }

    if (filtered.length === 0) {
      manuaisContainer.innerHTML = `
        <div class="empty-state">
          Nenhum guia de processo encontrado para essa busca.
        </div>
      `;
      return;
    }

    const favorites = JSON.parse(localStorage.getItem("vigi_favorites") || "[]");

    filtered.forEach(guide => {
      const accordion = document.createElement("div");
      accordion.className = "guide-accordion";
      accordion.setAttribute("data-guide-id", guide.id);
      
      const isFav = favorites.some(fav => fav.id === guide.id);

      // Criar HTML dos passos
      let stepsHtml = "";
      guide.passos.forEach((passo, index) => {
        const stepStorageKey = `vigi_step_${guide.id}_${index}`;
        const isChecked = localStorage.getItem(stepStorageKey) === "true";
        const itemClass = isChecked ? "step-item checked" : "step-item";
        const checkedAttr = isChecked ? "checked" : "";
        
        stepsHtml += `
          <div class="${itemClass}" data-step-index="${index}">
            <div class="step-checkbox-container">
              <input type="checkbox" class="step-checkbox" id="chk-${guide.id}-${index}" ${checkedAttr}>
            </div>
            <div class="step-text-content">
              <label class="step-title" for="chk-${guide.id}-${index}">${passo.titulo}</label>
              <span class="step-details">${passo.detalhe}</span>
            </div>
          </div>
        `;
      });

      // Criar chips de vídeos relacionados
      let relatedChipsHtml = "";
      if (guide.videosRelacionados && guide.videosRelacionados.length > 0) {
        relatedChipsHtml += `
          <div class="related-videos-section">
            <h4 class="related-title">Vídeos Relacionados a este Guia:</h4>
            <div class="related-chips-grid">
        `;
        
        guide.videosRelacionados.forEach(vId => {
          const videoObj = VIGI_DATA.videos.find(v => v.id === vId);
          if (videoObj) {
            relatedChipsHtml += `
              <button class="related-video-chip" data-video-id="${videoObj.id}">
                🎬 ${videoObj.titulo} (${videoObj.categoria})
              </button>
            `;
          }
        });
        
        relatedChipsHtml += `
            </div>
          </div>
        `;
      }

      accordion.innerHTML = `
        <div class="guide-header">
          <div class="guide-header-info">
            <div class="guide-badge-row">
              <span class="guide-badge guide-badge-cat">${guide.categoria}</span>
              <span class="guide-badge guide-badge-author">${guide.autor}</span>
              <span class="guide-status-pill" style="display:none;"></span>
            </div>
            <div style="display: flex; align-items: center; gap: 10px; margin-top: 4px;">
              <button class="favorite-star-btn ${isFav ? 'active' : ''}" data-id="${guide.id}" title="Favoritar" style="width: 24px; height: 24px; font-size: 16px;">
                ${isFav ? '★' : '☆'}
              </button>
              <h3 class="guide-accordion-title" style="margin: 0;">${guide.titulo}</h3>
            </div>
          </div>
          <div class="guide-toggle-icon">▼</div>
        </div>
        <div class="guide-body" id="pdf-content-${guide.id}">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; margin-bottom: 16px;">
            <p class="guide-intro" style="margin-bottom: 0; flex-grow: 1;">${guide.descricao}</p>
            <button class="generate-pdf-btn ignore-pdf" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #fff; padding: 6px 12px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 6px; font-size: 0.85rem; white-space: nowrap; transition: 0.2s;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              PDF
            </button>
          </div>
          
          <div class="guide-progress-container ignore-pdf">
            <div class="guide-progress-text">
              <span>Progresso de Execução Segura</span>
              <span class="progress-percentage">0%</span>
            </div>
            <div class="guide-progress-bar-bg">
              <div class="guide-progress-bar-fill"></div>
            </div>
          </div>

          <div class="guide-quick-tools ignore-pdf">
            <span style="color:var(--text-muted); font-size:11.5px; font-weight:600;">Checklist Rápido:</span>
            <button class="guide-tool-btn btn-check-all" type="button">✓ Concluir Todos</button>
            <button class="guide-tool-btn btn-reset-guide" type="button">↺ Limpar Passos</button>
          </div>

          <div class="steps-checklist">
            ${stepsHtml}
          </div>

          ${relatedChipsHtml}
        </div>
      `;

      // Evento de abrir/fechar Accordion
      const header = accordion.querySelector(".guide-header");
      header.addEventListener("click", () => {
        const isOpen = accordion.classList.contains("open");
        if (isOpen) {
          accordion.classList.remove("open");
        } else {
          accordion.classList.add("open");
        }
      });

      // Lógica de cliques nos checkboxes do Checklist
      const checkboxes = accordion.querySelectorAll(".step-checkbox");
      checkboxes.forEach(chk => {
        chk.addEventListener("change", (e) => {
          const stepItem = e.target.closest(".step-item");
          const stepIdx = stepItem.getAttribute("data-step-index");
          const isChecked = e.target.checked;
          
          if (isChecked) {
            stepItem.classList.add("checked");
          } else {
            stepItem.classList.remove("checked");
          }
          
          // Persistir no localStorage
          localStorage.setItem(`vigi_step_${guide.id}_${stepIdx}`, isChecked);
          
          // Atualiza progresso do guia
          calculateGuideProgress(accordion, guide);
        });
      });

      // Ações rápidas de checklist
      const btnCheckAll = accordion.querySelector(".btn-check-all");
      if (btnCheckAll) {
        btnCheckAll.addEventListener("click", (e) => {
          e.stopPropagation();
          guide.passos.forEach((_, idx) => {
            localStorage.setItem(`vigi_step_${guide.id}_${idx}`, "true");
            const chk = accordion.querySelector(`#chk-${guide.id}-${idx}`);
            if (chk) chk.checked = true;
            const item = accordion.querySelector(`.step-item[data-step-index="${idx}"]`);
            if (item) item.classList.add("checked");
          });
          calculateGuideProgress(accordion, guide);
          if (typeof window.showToast === "function") {
            window.showToast(`Passos de "${guide.titulo}" concluídos!`, "success", "✓");
          }
        });
      }

      const btnResetGuide = accordion.querySelector(".btn-reset-guide");
      if (btnResetGuide) {
        btnResetGuide.addEventListener("click", (e) => {
          e.stopPropagation();
          guide.passos.forEach((_, idx) => {
            localStorage.removeItem(`vigi_step_${guide.id}_${idx}`);
            const chk = accordion.querySelector(`#chk-${guide.id}-${idx}`);
            if (chk) chk.checked = false;
            const item = accordion.querySelector(`.step-item[data-step-index="${idx}"]`);
            if (item) item.classList.remove("checked");
          });
          calculateGuideProgress(accordion, guide);
          if (typeof window.showToast === "function") {
            window.showToast(`Passos de "${guide.titulo}" desmarcados.`, "info", "↺");
          }
        });
      }

      // Evento de clique nos chips de vídeos associados
      accordion.querySelectorAll(".related-video-chip").forEach(chip => {
        chip.addEventListener("click", (e) => {
          e.stopPropagation(); // Evita abrir/fechar accordion
          const vId = chip.getAttribute("data-video-id");
          const videoObj = VIGI_DATA.videos.find(v => v.id === vId);
          if (videoObj) {
            openVideoPlayer(videoObj);
          }
        });
      });

      // Lógica do botão de Gerar PDF
      const pdfBtn = accordion.querySelector('.generate-pdf-btn');
      if (pdfBtn) {
        pdfBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const targetId = `pdf-content-${guide.id}`;
          const element = document.getElementById(targetId);
          if (!element || typeof html2pdf === 'undefined') return;
          
          const clone = element.cloneNode(true);
          const ignores = clone.querySelectorAll('.ignore-pdf, .related-videos-section, input[type="checkbox"]');
          ignores.forEach(el => el.remove());
          
          // Ajustes de estilo para leitura em papel/fundo claro e evitar corte (clipping)
          clone.style.padding = "20px";
          clone.style.backgroundColor = "#fff";
          clone.style.color = "#000";
          clone.style.maxHeight = "none";
          clone.style.overflow = "visible";
          clone.style.height = "auto";
          
          const title = document.createElement('h2');
          title.textContent = guide.titulo;
          title.style.marginBottom = "15px";
          title.style.color = "#000";
          clone.insertBefore(title, clone.firstChild);

          clone.querySelectorAll('.step-title').forEach(t => t.style.color = "#1a1c23");
          clone.querySelectorAll('.step-details').forEach(d => d.style.color = "#444");
          
          // Force elements inside to not be hidden
          clone.querySelectorAll('*').forEach(el => {
            el.style.overflow = "visible";
            el.style.maxHeight = "none";
          });
          
          const opt = {
            margin:       0.5,
            filename:     `VIGI_Manual_${guide.id}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true },
            jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
          };
          
          pdfBtn.textContent = 'Gerando...';
          html2pdf().set(opt).from(clone).save().then(() => {
            pdfBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> PDF';
          });
        });
      }

      // Inicializar barra de progresso individual do guia
      calculateGuideProgress(accordion, guide);

      manuaisContainer.appendChild(accordion);
    });
  }

  // Abre um guia específico (expandindo-o)
  function openGuide(guideId) {
    setTimeout(() => {
      const accordion = document.querySelector(`.guide-accordion[data-guide-id="${guideId}"]`);
      if (accordion) {
        accordion.classList.add("open");
        accordion.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 150);
  }

  // Calcular progresso do checklist do manual
  function calculateGuideProgress(accordionEl, guideData) {
    const totalSteps = guideData.passos.length;
    let checkedCount = 0;
    
    guideData.passos.forEach((_, idx) => {
      const isChecked = localStorage.getItem(`vigi_step_${guideData.id}_${idx}`) === "true";
      if (isChecked) checkedCount++;
    });

    const percent = totalSteps > 0 ? Math.round((checkedCount / totalSteps) * 100) : 0;
    
    // Atualizar UI do progresso
    const progressFill = accordionEl.querySelector(".guide-progress-bar-fill");
    const progressText = accordionEl.querySelector(".progress-percentage");
    const pill = accordionEl.querySelector(".guide-status-pill");
    
    if (progressFill) {
      progressFill.style.width = `${percent}%`;
      if (percent === 100) {
        progressFill.style.background = "#10b981";
      } else {
        progressFill.style.background = "";
      }
    }
    if (progressText) progressText.textContent = `${percent}% (${checkedCount}/${totalSteps})`;

    if (pill) {
      if (percent === 100) {
        pill.textContent = "✓ 100% Concluído";
        pill.className = "guide-status-pill completed";
        pill.style.display = "inline-flex";
      } else if (percent > 0) {
        pill.textContent = `${percent}% Em andamento`;
        pill.className = "guide-status-pill in-progress";
        pill.style.display = "inline-flex";
      } else {
        pill.style.display = "none";
      }
    }
  }

  // Auxiliar para classes CSS de categoria
  function getBrandTagClass(category) {
    switch (category.toLowerCase()) {
      case "hikvision": return "tag-hik";
      case "uniview": return "tag-unv";
      case "alarme": return "tag-alarme";
      case "procedimentos": return "tag-proc";
      default: return "tag-tec";
    }
  }

  // ==========================================================================
  // SOLICITAÇÃO DE MATERIAIS (PERSISTÊNCIA LOCAL)
  // ==========================================================================
  // ==========================================================================
  // KANBAN - SISTEMA DE SOLICITAÇÕES
  // ==========================================================================

  const KANBAN_KEY = "vigi_requests";
  const STATUSES   = ["Pendente", "Em Gravação", "Pronto"];

  // Mapa de ícone e classe CSS por tipo de conteúdo
  const TYPE_CONFIG = {
    "Vídeo Tutorial":              { icon: "🎬", cssClass: "type-video",   iconClass: "icon-video" },
    "Manual / Guia Escrito":       { icon: "📋", cssClass: "type-manual",  iconClass: "icon-manual" },
    "Tabela / Imagem Informativa": { icon: "🖼️", cssClass: "type-tabela", iconClass: "icon-tabela" },
  };

  // Auto-preencher nome do usuário logado no formulário
  function fillUserName() {
    const hiddenInput = document.getElementById("reqName");
    const nameDisplay = document.getElementById("reqNameText");
    if (!hiddenInput || !nameDisplay) return;

    function safeNameFrom(raw) {
      if (!raw || !raw.trim()) return null;
      const val = raw.includes("@") ? raw.split("@")[0] : raw.trim();
      return val.charAt(0).toUpperCase() + val.slice(1);
    }

    const nome =
      safeNameFrom(window.VIGI_USER_NAME) ||
      (() => {
        try {
          const ud = JSON.parse(sessionStorage.getItem("vigi_session_user") || "{}");
          return safeNameFrom(ud.nome || ud.email);
        } catch(e) { return null; }
      })() ||
      safeNameFrom(document.getElementById("userDisplayName")?.textContent?.replace("ADMIN","").trim()) ||
      "Técnico VIGI";

    hiddenInput.value = nome;
    nameDisplay.textContent = nome;
  }



  // Mock inicial para primeira visita
  function seedMocks() {
    return [];
  }

  function getRequests() {
    const raw = localStorage.getItem(KANBAN_KEY);
    if (!raw) {
      const mocks = seedMocks();
      localStorage.setItem(KANBAN_KEY, JSON.stringify(mocks));
      return mocks;
    }
    return JSON.parse(raw);
  }

  function saveRequests(list) {
    localStorage.setItem(KANBAN_KEY, JSON.stringify(list));
  }

  function handleRequestSubmit(e) {
    e.preventDefault();
    // Garante que o nome está preenchido antes de submeter
    fillUserName();
    const name    = document.getElementById("reqName").value.trim();
    const title   = document.getElementById("reqTitle").value.trim();
    const type    = document.getElementById("reqType").value;
    const urgency = document.getElementById("reqUrgency").value;
    const desc    = document.getElementById("reqDesc").value.trim();
    if (!name || !title || !type || !urgency || !desc) { alert("Preencha todos os campos."); return; }

    const newReq = { id:"req-"+Date.now(), nome:name, titulo:title, tipo:type, urgencia:urgency, descricao:desc, status:"Pendente", data:new Date().toLocaleDateString("pt-BR"), upvotes:0 };
    const list = getRequests();
    list.unshift(newReq);
    saveRequests(list);

    const submitBtn = requestForm.querySelector(".submit-btn");
    const orig = submitBtn.textContent;
    submitBtn.textContent = "Enviado! ✓";
    submitBtn.style.background = "var(--color-success)";
    submitBtn.disabled = true;
    setTimeout(() => { submitBtn.textContent = orig; submitBtn.style.background = ""; submitBtn.disabled = false; }, 2000);

    requestForm.reset();
    // Resetar contador de caracteres
    const counter = document.getElementById("reqCharCounter");
    if (counter) { counter.textContent = "0 / 500"; counter.className = "req-char-counter"; }
    // Fechar formulário com animação
    const panel = document.getElementById("kanbanFormPanel");
    const toggleBtn = document.getElementById("toggleKanbanForm");
    if (panel) {
      panel.classList.remove("panel-open");
      if (toggleBtn) toggleBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>Nova Solicitação`;
      setTimeout(() => { panel.style.display = "none"; }, 400);
    }
    loadRequests();
  }

  function loadRequests() {
    const list = getRequests();

    // Atualizar stats na barra
    const totalEl    = document.getElementById("req-count-total");
    const progressEl = document.getElementById("req-count-progress");
    const readyEl    = document.getElementById("req-count-ready");
    if (totalEl)    totalEl.textContent    = list.length + " total";
    if (progressEl) progressEl.textContent = list.filter(r=>r.status==="Em Gravação").length + " em produção";
    if (readyEl)    readyEl.textContent    = list.filter(r=>r.status==="Pronto").length + " concluídos";

    // Limpar colunas
    STATUSES.forEach(s => {
      const col = document.getElementById("col-"+s);
      if (col) col.innerHTML = "";
      const cnt = document.getElementById("count-"+s);
      if (cnt) cnt.textContent = list.filter(r=>r.status===s).length;
    });

    if (list.length === 0) {
      const empty = document.getElementById("tableEmptyState");
      if (empty) empty.style.display = "block";
      return;
    }
    const empty = document.getElementById("tableEmptyState");
    if (empty) empty.style.display = "none";

    // Renderizar cada card na coluna correta
    list.forEach(req => {
      const col = document.getElementById("col-"+req.status);
      if (!col) return;

      const urgClass = { Alta:"urg-alta", Média:"urg-media", Media:"urg-media", Baixa:"urg-baixa" }[req.urgencia] || "urg-media";
      const isVoted  = localStorage.getItem("vigi_voted_"+req.id) === "true";

      // Config visual por tipo
      const typeCfg = TYPE_CONFIG[req.tipo] || { icon: "📄", cssClass: "", iconClass: "" };

      // Botões de mover
      const statusIdx = STATUSES.indexOf(req.status);
      const movePrev  = statusIdx > 0 ? `<button class="kanban-move-btn" data-move="${req.id}" data-dir="-1">← Voltar</button>` : "";
      const moveNext  = statusIdx < STATUSES.length-1 ? `<button class="kanban-move-btn" data-move="${req.id}" data-dir="1">Avançar →</button>` : "";

      const card = document.createElement("div");
      card.className = `kanban-card ${typeCfg.cssClass}`;
      card.setAttribute("draggable", "true");
      card.setAttribute("data-id", req.id);
      card.setAttribute("data-status", req.status);

      card.innerHTML = `
        <div class="kanban-card-header">
          <div style="display:flex; align-items:center; gap:8px;">
            <span class="kanban-type-icon ${typeCfg.iconClass}">${typeCfg.icon}</span>
            <span class="kanban-card-type">${req.tipo}</span>
          </div>
          <div style="display:flex; align-items:center; gap:6px;">
            <span class="kanban-urgency ${urgClass}">${req.urgencia}</span>
            <button class="kanban-delete-btn" data-delete="${req.id}" title="Excluir">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>
        <h4 class="kanban-card-title">${req.titulo}</h4>
        <p class="kanban-card-desc">${req.descricao}</p>
        ${req.adminReply ? `<div class="kanban-admin-reply"><strong>VIGI:</strong> ${req.adminReply}</div>` : ""}
        <div class="kanban-card-footer">
          <div class="kanban-move-btns">${movePrev}${moveNext}</div>
          <button class="kanban-upvote-btn ${isVoted?'active':''}" data-upvote="${req.id}">
            👍 <span>${req.upvotes||0}</span>
          </button>
        </div>
        <div class="kanban-card-user">Por ${req.nome} · ${req.data}</div>
      `;

      // Drag & Drop
      card.addEventListener("dragstart", e => {
        e.dataTransfer.setData("text/plain", req.id);
        setTimeout(()=>card.classList.add("dragging"), 0);
      });
      card.addEventListener("dragend", () => card.classList.remove("dragging"));

      col.appendChild(card);
    });

    // Drag & Drop nas colunas (bind único por zona)
    document.querySelectorAll(".kanban-cards").forEach(zone => {
      if (zone.dataset.dragBound === "true") return;
      zone.dataset.dragBound = "true";
      zone.addEventListener("dragover", e => { e.preventDefault(); zone.classList.add("drag-over"); });
      zone.addEventListener("dragleave", () => zone.classList.remove("drag-over"));
      zone.addEventListener("drop", e => {
        e.preventDefault();
        zone.classList.remove("drag-over");
        const id = e.dataTransfer.getData("text/plain");
        const newStatus = zone.getAttribute("data-status");
        moveCard(id, newStatus);
      });
    });

    // Botões: mover, upvote, deletar
    document.querySelectorAll("[data-move]").forEach(btn => {
      btn.addEventListener("click", e => {
        e.stopPropagation();
        const id  = btn.getAttribute("data-move");
        const dir = parseInt(btn.getAttribute("data-dir"));
        const list2 = getRequests();
        const req2  = list2.find(r=>r.id===id);
        if (!req2) return;
        const idx = STATUSES.indexOf(req2.status);
        const newIdx = idx + dir;
        if (newIdx >= 0 && newIdx < STATUSES.length) {
          req2.status = STATUSES[newIdx];
          saveRequests(list2);
          loadRequests();
        }
      });
    });

    document.querySelectorAll("[data-upvote]").forEach(btn => {
      btn.addEventListener("click", e => {
        e.stopPropagation();
        const id = btn.getAttribute("data-upvote");
        const alreadyVoted = localStorage.getItem("vigi_voted_"+id) === "true";
        const list2 = getRequests();
        const req2  = list2.find(r=>r.id===id);
        if (!req2) return;
        if (!alreadyVoted) {
          req2.upvotes = (req2.upvotes||0) + 1;
          localStorage.setItem("vigi_voted_"+id, "true");
        } else {
          req2.upvotes = Math.max(0, (req2.upvotes||1) - 1);
          localStorage.removeItem("vigi_voted_"+id);
        }
        saveRequests(list2);
        // Animação de pulso
        btn.classList.remove("pulse");
        void btn.offsetWidth; // reflow para resetar animação
        btn.classList.add("pulse");
        loadRequests();
      });
    });

    document.querySelectorAll("[data-delete]").forEach(btn => {
      btn.addEventListener("click", e => {
        e.stopPropagation();
        const id = btn.getAttribute("data-delete");
        if (!confirm("Remover esta solicitação?")) return;
        const list2 = getRequests().filter(r=>r.id!==id);
        saveRequests(list2);
        loadRequests();
      });
    });
  }

  function moveCard(id, newStatus) {
    const list = getRequests();
    const req = list.find(r=>r.id===id);
    if (req && STATUSES.includes(newStatus)) {
      req.status = newStatus;
      saveRequests(list);
      loadRequests();
    }
  }

  // Abrir o Player de Vídeo no Modal (Suporte Híbrido: HTML5 / Supabase Storage + Google Drive Preview)
  function openVideoPlayer(videoData) {
    modalTitle.textContent = videoData.titulo;
    modalBody.innerHTML = "";
    
    const container = document.createElement("div");
    container.className = "video-player-container";
    const directVideoUrl = videoData.videoUrl || (videoData.driveUrl && /\.(mp4|webm|mov)(\?|$)/i.test(videoData.driveUrl) ? videoData.driveUrl : "");

    if (directVideoUrl) {
      // Player Nativo HTML5 (Supabase Storage / MP4 direto)
      const videoEl = document.createElement("video");
      videoEl.src = directVideoUrl;
      if (videoData.capa) videoEl.poster = videoData.capa;
      videoEl.controls = true;
      videoEl.autoplay = true;
      videoEl.playsInline = true;
      videoEl.style.width = "100%";
      videoEl.style.height = "100%";
      videoEl.style.background = "#000";
      videoEl.id = "nativeVigiVideoPlayer";
      container.appendChild(videoEl);
    } else if (videoData.driveUrl && videoData.driveUrl.trim() !== "") {
      // Backdrop com a miniatura real enquanto o player carrega
      if (videoData.capa) {
        container.style.backgroundImage = `linear-gradient(rgba(6,13,34,0.72), rgba(6,13,34,0.85)), url('${videoData.capa}')`;
        container.style.backgroundSize = "cover";
        container.style.backgroundPosition = "center";
      }

      const spinner = document.createElement("div");
      spinner.className = "iframe-spinner";
      container.appendChild(spinner);
      
      const iframe = document.createElement("iframe");
      let embedUrl = videoData.driveUrl;
      if (embedUrl.includes("/view")) {
        embedUrl = embedUrl.replace("/view", "/preview");
      }
      
      iframe.src = embedUrl;
      iframe.width = "100%";
      iframe.height = "100%";
      iframe.style.border = "none";
      iframe.allow = "autoplay; fullscreen";
      iframe.onload = () => {
        if (container.contains(spinner)) container.removeChild(spinner);
      };
      
      container.appendChild(iframe);
    } else {
      container.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: white; padding: 20px; text-align: center;">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 16px; color: var(--color-danger);">
            <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <h3 style="margin-bottom: 8px;">Vídeo não configurado</h3>
          <p style="color: var(--text-muted); font-size: 14px; max-width: 400px; line-height: 1.5;">
            Este vídeo ainda não possui um link configurado para reprodução.
          </p>
        </div>
      `;
    }

    const customControls = document.createElement("div");
    customControls.className = "video-custom-controls";
    const externalUrl = directVideoUrl || videoData.driveUrl || "";
    customControls.innerHTML = `
      <div class="video-controls-left">
        <span>Categoria: <strong>${videoData.categoria}</strong></span>
        <span>Marca: <strong>${videoData.marca}</strong></span>
      </div>
      <div class="video-controls-right" style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
        ${directVideoUrl ? `
          <div style="display:flex; gap:4px; align-items:center;">
            <button class="zoom-btn" data-speed="1" style="font-size:11px; padding:4px 8px;">1x</button>
            <button class="zoom-btn" data-speed="1.25" style="font-size:11px; padding:4px 8px;">1.25x</button>
            <button class="zoom-btn" data-speed="1.5" style="font-size:11px; padding:4px 8px;">1.5x</button>
            <button class="zoom-btn" data-speed="2" style="font-size:11px; padding:4px 8px;">2x</button>
          </div>
        ` : `<span style="font-size: 12px; color: var(--text-muted);">Player Integrado VIGI HD</span>`}
        ${externalUrl ? `<a href="${externalUrl}" target="_blank" rel="noopener noreferrer" class="watch-btn" style="text-decoration:none; padding:6px 12px; font-size:12px;">↗ Abrir em Nova Aba</a>` : ""}
      </div>
    `;

    customControls.querySelectorAll("[data-speed]").forEach(btn => {
      btn.addEventListener("click", () => {
        const v = container.querySelector("video");
        if (v) v.playbackRate = parseFloat(btn.getAttribute("data-speed"));
      });
    });

    modalBody.appendChild(container);
    modalBody.appendChild(customControls);

    openModal();
  }

  // Abrir Zoom de Imagens no Modal (Prioriza Lightbox Nativo de Alta Resolução com Zoom & Pan)
  function openLightbox(artData) {
    modalTitle.textContent = artData.titulo;
    modalBody.innerHTML = "";

    const hasDirectImg = artData.caminho && !artData.caminho.includes("drive.google.com/file/");

    // Só usa iframe do Google Drive caso não exista imagem local/Supabase em artData.caminho
    if (!hasDirectImg && artData.driveUrl && artData.driveUrl.trim() !== "") {
      const container = document.createElement("div");
      container.className = "video-player-container";

      const spinner = document.createElement("div");
      spinner.className = "iframe-spinner";
      container.appendChild(spinner);

      const iframe = document.createElement("iframe");
      let embedUrl = artData.driveUrl;
      if (embedUrl.includes("/view")) {
        embedUrl = embedUrl.replace("/view", "/preview");
      }
      iframe.src = embedUrl;
      iframe.width = "100%";
      iframe.height = "100%";
      iframe.style.border = "none";
      iframe.allow = "autoplay";
      iframe.onload = () => {
        if (container.contains(spinner)) container.removeChild(spinner);
      };
      container.appendChild(iframe);

      const caption = document.createElement("div");
      caption.className = "lightbox-caption";
      caption.innerHTML = `<p>${artData.descricao}</p><small style="color:var(--text-muted); display:block; margin-top:4px;">* Use os botões de zoom do próprio visualizador para ampliar a imagem.</small>`;

      modalBody.appendChild(container);
      modalBody.appendChild(caption);
      openModal();
      return;
    }

    // Lightbox Nativo de Alta Velocidade com Zoom & Pan + Download Direto
    zoomFactor = 1.0;
    panX = 0;
    panY = 0;
    isPanning = false;

    const container = document.createElement("div");
    container.className = "lightbox-container";
    container.id = "lightboxContainer";

    const img = document.createElement("img");
    img.src = artData.caminho;
    img.className = "lightbox-img";
    img.id = "lightboxImg";
    img.draggable = false;
    
    const controls = document.createElement("div");
    controls.className = "lightbox-controls";
    controls.innerHTML = `
      <button class="zoom-btn" id="zoomOut" title="Reduzir Zoom">−</button>
      <span class="zoom-factor-label" id="zoomLabel">100%</span>
      <button class="zoom-btn" id="zoomIn" title="Aumentar Zoom">+</button>
      <button class="zoom-btn" id="zoomReset" title="Ajustar" style="font-size: 13px; font-weight:bold;">1:1</button>
      <a href="${artData.caminho}" download="${artData.id || 'arte-vigi'}.jpg" class="zoom-btn" title="Baixar Arte em Alta Resolução" style="text-decoration:none; width:auto; padding:0 12px; font-size:12px; font-weight:700; display:inline-flex; align-items:center; gap:5px;">⬇ Baixar</a>
    `;

    const caption = document.createElement("div");
    caption.className = "lightbox-caption";
    caption.innerHTML = `<p>${artData.descricao}</p><small style="color:var(--text-muted); display:block; margin-top:4px;">* Dica: Use a roda do mouse ou os botões acima para ampliar, e arraste a imagem para navegar nos detalhes.</small>`;

    container.appendChild(img);
    modalBody.appendChild(container);
    modalBody.appendChild(controls);
    modalBody.appendChild(caption);

    // Seletores locais
    const zoomInBtn = controls.querySelector("#zoomIn");
    const zoomOutBtn = controls.querySelector("#zoomOut");
    const zoomResetBtn = controls.querySelector("#zoomReset");
    const zoomLabel = controls.querySelector("#zoomLabel");

    // Atualiza transformação na tela
    function updateImageTransform() {
      img.style.transform = `scale(${zoomFactor}) translate(${panX}px, ${panY}px)`;
      zoomLabel.textContent = `${Math.round(zoomFactor * 100)}%`;

    }

    // Ações de Clique de Zoom
    zoomInBtn.addEventListener("click", () => {
      if (zoomFactor < 4.0) {
        zoomFactor += 0.25;
        updateImageTransform();
      }
    });

    zoomOutBtn.addEventListener("click", () => {
      if (zoomFactor > 0.5) {
        zoomFactor -= 0.25;
        updateImageTransform();
      }
    });

    zoomResetBtn.addEventListener("click", () => {
      zoomFactor = 1.0;
      panX = 0;
      panY = 0;
      updateImageTransform();
    });

    // LÓGICA DE ARRASTAR E NAVEGAR (DRAG & PAN)
    const handleDragStart = (clientX, clientY) => {
      isPanning = true;
      panStartX = clientX - panX * zoomFactor;
      panStartY = clientY - panY * zoomFactor;
      container.style.cursor = "grabbing";
    };

    const handleDragMove = (clientX, clientY) => {
      if (!isPanning) return;
      // Calcula deslocamento relativo compensando o fator de zoom
      panX = (clientX - panStartX) / zoomFactor;
      panY = (clientY - panStartY) / zoomFactor;
      updateImageTransform();
    };

    const handleDragEnd = () => {
      isPanning = false;
      container.style.cursor = "grab";
    };

    // Eventos Mouse
    container.addEventListener("mousedown", (e) => {
      handleDragStart(e.clientX, e.clientY);
    });

    window.addEventListener("mousemove", (e) => {
      if (isPanning) handleDragMove(e.clientX, e.clientY);
    });

    window.addEventListener("mouseup", handleDragEnd);

    // Eventos Touch (Celular)
    container.addEventListener("touchstart", (e) => {
      if (e.touches.length === 1) {
        handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    container.addEventListener("touchmove", (e) => {
      if (isPanning && e.touches.length === 1) {
        handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    container.addEventListener("touchend", handleDragEnd);

    openModal();
  }

  // Abertura e Fechamento Geral
  function openModal() {
    mediaModal.classList.add("active");
    document.body.style.overflow = "hidden"; // Desativa scroll da página
  }

  function closeModal() {
    // Parar vídeos caso estejam rodando para evitar som tocando ao fundo
    const video = modalBody.querySelector("video");
    if (video) {
      video.pause();
      video.src = "";
      video.load();
    }
    
    mediaModal.classList.remove("active");
    document.body.style.overflow = ""; // Ativa scroll da página
    
    // Limpar body pós transição
    setTimeout(() => {
      if (!mediaModal.classList.contains("active")) {
        modalBody.innerHTML = "";
      }
    }, 300);
  }

  // ==========================================================================
  // LÓGICA E RENDERIZAÇÃO DE SLIDES DE TREINAMENTO
  // ==========================================================================
  function setupSlideDots() {
    if (!slideProgressDots) return;
    slideProgressDots.innerHTML = "";
    
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement("button");
      dot.className = i === 0 ? "slide-dot active" : "slide-dot";
      dot.setAttribute("data-slide-index", i);
      dot.setAttribute("aria-label", `Ir para Slide ${i + 1}`);
      
      dot.addEventListener("click", () => {
        currentSlideIndex = i;
        renderSlide(currentSlideIndex);
      });
      
      slideProgressDots.appendChild(dot);
    }
  }

  function renderSlide(index) {
    if (!slideDeck) return;
    slideDeck.innerHTML = "";
    
    const slide = VIGI_DATA.slides[index];
    if (!slide) return;
    
    // Configurar imagem de fundo do slide deck
    if (index === 0 && slide.imagens && slide.imagens[0]) {
      slideDeck.style.backgroundImage = `linear-gradient(rgba(9, 13, 22, 0.75), rgba(9, 13, 22, 0.85)), url('${slide.imagens[0]}')`;
    } else if (index === 8 && slide.imagens && slide.imagens[0]) {
      slideDeck.style.backgroundImage = `linear-gradient(rgba(9, 13, 22, 0.88), rgba(9, 13, 22, 0.92)), url('${slide.imagens[0]}')`;
    } else if (index === totalSlides - 1) {
      slideDeck.style.backgroundImage = "linear-gradient(rgba(9, 13, 22, 0.85), rgba(9, 13, 22, 0.85))";
    } else {
      slideDeck.style.backgroundImage = "linear-gradient(rgba(9, 13, 22, 0.95), rgba(9, 13, 22, 0.95))";
    }
    slideDeck.style.backgroundSize = "cover";
    slideDeck.style.backgroundPosition = "center";
    
    // Criar container do slide
    const slideCard = document.createElement("div");
    slideCard.className = `slide-card slide-layout-${slide.tipo}`;
    
    // Renderização com base no slide específico (index de 0 a 9)
    if (index === 0) {
      // Slide 1: Capa
      slideCard.innerHTML = `
        <div class="slide-layout-capa" style="padding: 60px 20px;">
          <span class="slide-badge" style="animation: pulse 2s infinite;">VIGI CÂMERAS</span>
          <h2 style="font-size: 46px; font-weight: 800; text-transform: uppercase; line-height: 1.1; margin-bottom: 20px; text-shadow: 0 4px 10px rgba(0,0,0,0.8);">${slide.titulo}</h2>
          <p style="font-size: 18px; font-weight: 500; color: var(--color-primary); margin-bottom: 24px; text-shadow: 0 2px 4px rgba(0,0,0,0.8);">${slide.subtitulo}</p>
          <div style="font-size: 15px; color: var(--text-muted); max-width: 650px; line-height: 1.6; background: rgba(9, 13, 22, 0.65); padding: 20px; border-radius: var(--radius-md); border: 1px solid var(--border-color); backdrop-filter: blur(5px); margin: 0 auto;">
            ${slide.detalhes}
          </div>
        </div>
      `;
    } else if (index === 1) {
      // Slide 2: Sumário (Imagem à esquerda, Módulos à direita)
      let gridHtml = "";
      slide.conteudo.forEach(item => {
        gridHtml += `
          <div class="slide-summary-item" style="background: rgba(9, 13, 22, 0.65); backdrop-filter: blur(5px); padding: 16px;">
            <h4 class="slide-summary-title" style="font-size:13px;">${item.modulo}</h4>
            <p class="slide-summary-desc" style="font-size:12px; line-height:1.4;">${item.desc}</p>
          </div>
        `;
      });
      
      slideCard.innerHTML = `
        <div class="slide-inner-header">
          <h2 class="slide-title-main">${slide.titulo}</h2>
          <span class="slide-title-sub">${slide.subtitulo}</span>
        </div>
        <div class="slide-module-cols" style="grid-template-columns: 1fr 1.65fr; align-items: stretch; gap: 28px;">
          <div class="slide-thumbnail" data-img-path="${slide.imagens[0]}" style="width: 100%; height: 100%; min-height: 280px; border-radius: var(--radius-md); margin:0;">
            <img src="${slide.imagens[0]}" alt="Sumário" style="width:100%; height:100%; object-fit:cover;">
            <div class="slide-thumbnail-overlay">🔍 Expandir Sumário</div>
          </div>
          <div style="display:flex; flex-direction:column; justify-content:space-between; gap: 16px;">
            <div class="slide-summary-grid" style="grid-template-columns: repeat(2, 1fr); gap: 16px; margin: 0;">
              ${gridHtml}
            </div>
            <div class="slide-detail-card" style="margin: 0; padding: 14px 20px; background: rgba(59, 130, 246, 0.08);">
              <p style="font-size: 13.5px; line-height:1.5;">${slide.detalhes}</p>
            </div>
          </div>
        </div>
      `;
    } else if (index === 2) {
      // Slide 3: Redes (Texto à esquerda, todas as 3 fotos à direita)
      let bulletsHtml = "";
      slide.conteudo.forEach(item => {
        bulletsHtml += `
          <li class="slide-bullet-item">
            <span class="slide-bullet-icon">✦</span>
            <span>${item}</span>
          </li>
        `;
      });
      
      slideCard.innerHTML = `
        <div class="slide-inner-header">
          <h2 class="slide-title-main">${slide.titulo}</h2>
          <span class="slide-title-sub">${slide.subtitulo}</span>
        </div>
        <div class="slide-module-cols" style="grid-template-columns: 1.2fr 1fr; gap: 28px;">
          <div>
            <ul class="slide-bullet-list">
              ${bulletsHtml}
            </ul>
            <div class="slide-detail-card" style="margin-top: 24px; background: rgba(59, 130, 246, 0.08);">
              <h4 class="slide-detail-title">Observação de Campo</h4>
              <p>${slide.detalhes}</p>
            </div>
          </div>
          <div style="display:flex; flex-direction:column; gap: 12px; justify-content:center;">
            <div style="display:flex; gap: 10px;">
              <div class="slide-thumbnail" data-img-path="${slide.imagens[0]}" style="flex: 1; height: 140px; border-radius: var(--radius-md); margin:0;">
                <img src="${slide.imagens[0]}" alt="Teste de Rede / Ping" style="width:100%; height:100%; object-fit:cover;">
                <div class="slide-thumbnail-overlay">🔍 Ping & Diagnóstico</div>
              </div>
              <div class="slide-thumbnail" data-img-path="${slide.imagens[1]}" style="flex: 1; height: 140px; border-radius: var(--radius-md); margin:0;">
                <img src="${slide.imagens[1]}" alt="Esquema Rede CFTV" style="width:100%; height:100%; object-fit:cover;">
                <div class="slide-thumbnail-overlay">🔍 Diagrama Ping</div>
              </div>
            </div>
            <div class="slide-thumbnail" data-img-path="${slide.imagens[2]}" style="width: 100%; height: 130px; border-radius: var(--radius-md); margin:0;">
              <img src="${slide.imagens[2]}" alt="Ligações Switch e Roteador" style="width:100%; height:100%; object-fit:cover;">
              <div class="slide-thumbnail-overlay">🔍 Ampliar Ligações Hub</div>
            </div>
          </div>
        </div>
      `;
    } else if (index === 3) {
      // Slide 4: DVRs Uniview (Texto à esquerda, layout 3 imagens à direita)
      let bulletsHtml = "";
      slide.conteudo.forEach(item => {
        bulletsHtml += `
          <li class="slide-bullet-item">
            <span class="slide-bullet-icon">✦</span>
            <span>${item}</span>
          </li>
        `;
      });
      
      slideCard.innerHTML = `
        <div class="slide-inner-header">
          <h2 class="slide-title-main">${slide.titulo}</h2>
          <span class="slide-title-sub">${slide.subtitulo}</span>
        </div>
        <div class="slide-module-cols" style="grid-template-columns: 1.15fr 1fr; gap: 28px;">
          <div>
            <ul class="slide-bullet-list">
              ${bulletsHtml}
            </ul>
            <div class="slide-detail-card" style="margin-top: 24px; background: rgba(16, 185, 129, 0.08); border-left-color: var(--color-unv);">
              <h4 class="slide-detail-title" style="color:var(--color-unv);">Observação de Campo</h4>
              <p>${slide.detalhes}</p>
            </div>
          </div>
          <div style="display:flex; flex-direction:column; gap: 12px; justify-content:center;">
            <div class="slide-thumbnail" data-img-path="${slide.imagens[0]}" style="width: 100%; height: 160px; border-radius: var(--radius-md); margin:0;">
              <img src="${slide.imagens[0]}" alt="Interface UNV Setup">
              <div class="slide-thumbnail-overlay">🔍 Ver Configurações UNV</div>
            </div>
            <div style="display:flex; gap: 12px; height: 120px;">
              <div class="slide-thumbnail" data-img-path="${slide.imagens[1]}" style="flex: 1; height: 100%; border-radius: var(--radius-md); margin:0;">
                <img src="${slide.imagens[1]}" alt="Interface UNV Gravação">
                <div class="slide-thumbnail-overlay">🔍 Grade Gravação</div>
              </div>
              <div class="slide-thumbnail" data-img-path="${slide.imagens[2]}" style="flex: 1; height: 100%; border-radius: var(--radius-md); margin:0;">
                <img src="${slide.imagens[2]}" alt="Interface UNV Movimento">
                <div class="slide-thumbnail-overlay">🔍 Grade Movimento</div>
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (index === 4) {
      // Slide 5: DVRs Hikvision (Texto à esquerda, duas imagens empilhadas à direita)
      let bulletsHtml = "";
      slide.conteudo.forEach(item => {
        bulletsHtml += `
          <li class="slide-bullet-item">
            <span class="slide-bullet-icon">✦</span>
            <span>${item}</span>
          </li>
        `;
      });
      
      slideCard.innerHTML = `
        <div class="slide-inner-header">
          <h2 class="slide-title-main">${slide.titulo}</h2>
          <span class="slide-title-sub">${slide.subtitulo}</span>
        </div>
        <div class="slide-module-cols" style="grid-template-columns: 1.2fr 1fr; gap: 28px;">
          <div>
            <ul class="slide-bullet-list">
              ${bulletsHtml}
            </ul>
            <div class="slide-detail-card" style="margin-top: 24px; background: rgba(239, 68, 68, 0.08); border-left-color: var(--color-hik);">
              <h4 class="slide-detail-title" style="color:var(--color-hik);">Observação de Campo</h4>
              <p>${slide.detalhes}</p>
            </div>
          </div>
          <div style="display:flex; flex-direction:column; gap: 16px; justify-content:center;">
            <div class="slide-thumbnail" data-img-path="${slide.imagens[0]}" style="width: 100%; height: 145px; border-radius: var(--radius-md); margin:0;">
              <img src="${slide.imagens[0]}" alt="Interface Hikvision Setup">
              <div class="slide-thumbnail-overlay">🔍 Ver Interface Hikvision</div>
            </div>
            <div class="slide-thumbnail" data-img-path="${slide.imagens[1]}" style="width: 100%; height: 145px; border-radius: var(--radius-md); margin:0;">
              <img src="${slide.imagens[1]}" alt="Interface Hikvision Movimento">
              <div class="slide-thumbnail-overlay">🔍 Ver Configuração Movimento</div>
            </div>
          </div>
        </div>
      `;
    } else if (index === 5) {
      // Slide 6: Checklist DVR (Texto à esquerda, layout 2 imagens à direita: banner + vertical)
      let bulletsHtml = "";
      slide.conteudo.forEach(item => {
        bulletsHtml += `
          <li class="slide-bullet-item">
            <span class="slide-bullet-icon">✦</span>
            <span>${item}</span>
          </li>
        `;
      });
      
      slideCard.innerHTML = `
        <div class="slide-inner-header">
          <h2 class="slide-title-main">${slide.titulo}</h2>
          <span class="slide-title-sub">${slide.subtitulo}</span>
        </div>
        <div class="slide-module-cols" style="grid-template-columns: 1.25fr 1fr; gap: 28px;">
          <div>
            <ul class="slide-bullet-list">
              ${bulletsHtml}
            </ul>
            <div class="slide-detail-card" style="margin-top: 24px; background: rgba(245, 158, 11, 0.08); border-left-color: var(--color-tec);">
              <h4 class="slide-detail-title" style="color:var(--color-tec);">Observação de Campo</h4>
              <p>${slide.detalhes}</p>
            </div>
          </div>
          <div style="display:flex; flex-direction:column; gap: 16px; justify-content:center;">
            <div class="slide-thumbnail" data-img-path="${slide.imagens[0]}" style="width: 100%; height: 60px; border-radius: var(--radius-md); margin:0;">
              <img src="${slide.imagens[0]}" alt="Banner Checklist">
              <div class="slide-thumbnail-overlay">🔍 Ampliar Logotipos</div>
            </div>
            <div class="slide-thumbnail" data-img-path="${slide.imagens[1]}" style="width: 100%; height: 210px; border-radius: var(--radius-md); margin:0;">
              <img src="${slide.imagens[1]}" alt="Guia Técnico Completo">
              <div class="slide-thumbnail-overlay">🔍 Ampliar Checklist DVR</div>
            </div>
          </div>
        </div>
      `;
    } else if (index === 7) {
      // Slide 8: Alarmes (Texto à esquerda, layout 3 imagens à direita)
      let bulletsHtml = "";
      slide.conteudo.forEach(item => {
        bulletsHtml += `
          <li class="slide-bullet-item">
            <span class="slide-bullet-icon">✦</span>
            <span>${item}</span>
          </li>
        `;
      });
      
      slideCard.innerHTML = `
        <div class="slide-inner-header">
          <h2 class="slide-title-main">${slide.titulo}</h2>
          <span class="slide-title-sub">${slide.subtitulo}</span>
        </div>
        <div class="slide-module-cols" style="grid-template-columns: 1.15fr 1fr; gap: 28px;">
          <div>
            <ul class="slide-bullet-list">
              ${bulletsHtml}
            </ul>
            <div class="slide-detail-card" style="margin-top: 24px; background: rgba(139, 92, 246, 0.08); border-left-color: var(--color-alarme);">
              <h4 class="slide-detail-title" style="color:var(--color-alarme);">Observação de Campo</h4>
              <p>${slide.detalhes}</p>
            </div>
          </div>
          <div style="display:flex; flex-direction:column; gap: 12px; justify-content:center;">
            <div style="display:flex; justify-content:center;">
              <div class="slide-thumbnail" data-img-path="${slide.imagens[0]}" style="width: 90px; height: 90px; border-radius: 50%; margin: 0;">
                <img src="${slide.imagens[0]}" alt="Central" style="object-fit: contain; background: white; padding: 4px;">
                <div class="slide-thumbnail-overlay" style="border-radius: 50%;">🔍 Central</div>
              </div>
            </div>
            <div style="display:flex; gap: 12px; height: 180px;">
              <div class="slide-thumbnail" data-img-path="${slide.imagens[1]}" style="flex: 1; height: 100%; border-radius: var(--radius-md); margin:0;">
                <img src="${slide.imagens[1]}" alt="Diagrama Zonas">
                <div class="slide-thumbnail-overlay">🔍 Ver Resistores</div>
              </div>
              <div class="slide-thumbnail" data-img-path="${slide.imagens[2]}" style="flex: 1; height: 100%; border-radius: var(--radius-md); margin:0;">
                <img src="${slide.imagens[2]}" alt="Instalação Sensor">
                <div class="slide-thumbnail-overlay">🔍 Ver Cabos</div>
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (index === 6) {
      // Slide 7: Aplicativos (Duas colunas com logos no cabeçalho)
      let listLeftHtml = "";
      slide.conteudoUniview.forEach(item => {
        listLeftHtml += `<li style="font-size: 15px; color: #ffffff; line-height: 1.8; margin-bottom: 12px; font-weight: 500; list-style: none; padding-left: 0;">${item}</li>`;
      });
      
      let listRightHtml = "";
      slide.conteudoHikvision.forEach(item => {
        listRightHtml += `<li style="font-size: 15px; color: #ffffff; line-height: 1.8; margin-bottom: 12px; font-weight: 500; list-style: none; padding-left: 0;">${item}</li>`;
      });
      
      slideCard.innerHTML = `
        <div class="slide-inner-header" style="border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 16px; margin-bottom: 28px;">
          <h2 class="slide-title-main" style="font-size: 26px; font-weight: 800; text-transform: uppercase;">${slide.titulo}</h2>
          <span class="slide-title-sub" style="font-size: 14px; color: var(--text-muted);">${slide.subtitulo}</span>
        </div>
        
        <div class="slide-module-cols" style="grid-template-columns: 1fr 1fr; gap: 48px; align-items: start;">
          <!-- EZ-Station Column -->
          <div style="display: flex; flex-direction: column; gap: 20px;">
            <div style="display: flex; align-items: center; gap: 14px;">
              <h3 style="font-size: 24px; font-weight: 800; color: #ff9e0b; text-shadow: 0 0 10px rgba(255, 158, 11, 0.4); margin: 0; font-family: var(--font-family); letter-spacing: 0.5px; text-transform: uppercase;">EZ-STATION (UNIVIEW)</h3>
              <div class="slide-thumbnail" data-img-path="${slide.imagens[1]}" style="width: 44px; height: 44px; border-radius: 8px; margin: 0; flex-shrink: 0; background: none; border: none; cursor: pointer; display: inline-block;">
                <img src="${slide.imagens[1]}" alt="EZ logo" style="width: 100%; height: 100%; object-fit: contain;">
              </div>
            </div>
            <ul style="list-style: none; padding-left: 0; margin: 0; display: flex; flex-direction: column;">
              ${listLeftHtml}
            </ul>
          </div>
          
          <!-- iVMS-4200 Column -->
          <div style="display: flex; flex-direction: column; gap: 20px;">
            <div style="display: flex; align-items: center; gap: 14px;">
              <h3 style="font-size: 24px; font-weight: 800; color: #ff9e0b; text-shadow: 0 0 10px rgba(255, 158, 11, 0.4); margin: 0; font-family: var(--font-family); letter-spacing: 0.5px; text-transform: uppercase;">IVMS 4200 (HIKVISION)</h3>
              <div class="slide-thumbnail" data-img-path="${slide.imagens[0]}" style="width: 44px; height: 44px; border-radius: 8px; margin: 0; flex-shrink: 0; background: none; border: none; cursor: pointer; display: inline-block;">
                <img src="${slide.imagens[0]}" alt="iVMS logo" style="width: 100%; height: 100%; object-fit: contain;">
              </div>
            </div>
            <ul style="list-style: none; padding-left: 0; margin: 0; display: flex; flex-direction: column;">
              ${listRightHtml}
            </ul>
          </div>
        </div>
      `;
    } else if (index === 8) {
      // Slide 9: O Portal Técnico (Duas colunas de texto)
      let listLeftHtml = "";
      slide.conteudo.slice(0, 2).forEach(item => {
        listLeftHtml += `<li class="slide-bullet-item"><span class="slide-bullet-icon">✦</span><span>${item}</span></li>`;
      });
      
      let listRightHtml = "";
      slide.conteudo.slice(2).forEach(item => {
        listRightHtml += `<li class="slide-bullet-item"><span class="slide-bullet-icon">✦</span><span>${item}</span></li>`;
      });
      
      slideCard.innerHTML = `
        <div class="slide-inner-header">
          <h2 class="slide-title-main">${slide.titulo}</h2>
          <span class="slide-title-sub">${slide.subtitulo}</span>
        </div>
        <div style="display:flex; flex-direction:column; justify-content:space-between; height: 100%; gap: 20px;">
          <div class="slide-module-cols" style="grid-template-columns: 1fr 1fr; gap: 24px;">
            <div class="slide-detail-card" style="margin: 0; background: rgba(255,255,255,0.02);">
              <h4 class="slide-detail-title" style="color:var(--color-primary)">Suporte Audiovisual</h4>
              <ul class="slide-bullet-list">
                ${listLeftHtml}
              </ul>
            </div>
            <div class="slide-detail-card" style="margin: 0; background: rgba(255,255,255,0.02);">
              <h4 class="slide-detail-title" style="color:var(--color-success)">Padrões e Checklists</h4>
              <ul class="slide-bullet-list">
                ${listRightHtml}
              </ul>
            </div>
          </div>
          <div class="slide-detail-card" style="margin: 0; text-align:center; padding: 16px; background: rgba(59, 130, 246, 0.06); display:flex; flex-direction:column; align-items:center; gap: 10px;">
            <p style="font-size: 14px; margin: 0;">${slide.detalhes}</p>
            <a href="https://materialtecnicos.vercel.app" target="_blank" class="filter-btn active" style="text-decoration:none; margin-top:4px; display:inline-flex; align-items:center; gap:8px;">
              🌐 Acessar Portal Técnico VIGI
            </a>
          </div>
        </div>
      `;
    } else if (index === 9) {
      // Slide 10: Encerramento
      slideCard.innerHTML = `
        <div class="slide-layout-ending" style="padding: 50px 20px;">
          <div class="ending-trophy" style="font-size: 80px; text-shadow: 0 0 20px rgba(16, 185, 129, 0.4);">🏆</div>
          <h2 style="font-size: 44px; font-weight: 800; text-shadow: 0 4px 12px rgba(0,0,0,0.8);">${slide.titulo}</h2>
          <p style="font-size: 18px; color: var(--text-muted); margin-bottom: 30px; text-shadow: 0 2px 4px rgba(0,0,0,0.8);">${slide.subtitulo}</p>
          <div class="slide-detail-card" style="max-width: 600px; text-align:center; font-style: italic; margin: 0 auto; background: rgba(9, 13, 22, 0.65); backdrop-filter: blur(5px);">
            "${slide.detalhes}"
          </div>
        </div>
      `;
    }
    
    slideDeck.appendChild(slideCard);
    
    // Adicionar eventos de clique nas miniaturas dos slides para abrir no lightbox integrado
    slideCard.querySelectorAll(".slide-thumbnail").forEach(thumb => {
      thumb.addEventListener("click", (e) => {
        e.stopPropagation();
        const imgPath = thumb.getAttribute("data-img-path");
        const imgAlt = thumb.querySelector("img")?.alt || slide.titulo;
        if (imgPath) {
          openLightbox({
            titulo: imgAlt,
            caminho: imgPath,
            descricao: slide.subtitulo || slide.titulo
          });
        }
      });
    });
    
    // Atualizar botões
    if (prevSlideBtn) prevSlideBtn.disabled = index === 0;
    if (nextSlideBtn) nextSlideBtn.disabled = index === totalSlides - 1;
    
    // Atualizar Dots ativos
    if (slideProgressDots) {
      const dots = slideProgressDots.querySelectorAll(".slide-dot");
      dots.forEach((dot, i) => {
        if (i === index) {
          dot.classList.add("active");
        } else {
          dot.classList.remove("active");
        }
      });
    }
    
    // Atualizar texto contador
    if (slideCounterLabel) {
      slideCounterLabel.textContent = `Slide ${index + 1} de ${totalSlides}`;
    }

    // Atualizar barra de progresso superior
    if (slideProgressTopFill) {
      const pct = Math.round(((index + 1) / totalSlides) * 100);
      slideProgressTopFill.style.width = `${pct}%`;
    }
  }

  function nextSlide() {
    if (currentSlideIndex < totalSlides - 1) {
      currentSlideIndex++;
      renderSlide(currentSlideIndex);
    }
  }

  function prevSlide() {
    if (currentSlideIndex > 0) {
      currentSlideIndex--;
      renderSlide(currentSlideIndex);
    }
  }

  // ==========================================================================
  // FUNÇÕES DE UPGRADES GERAIS (FAVORITOS & SOLICITAÇÕES)
  // ==========================================================================

  function toggleFavorite(id, type) {
    let favorites = JSON.parse(localStorage.getItem("vigi_favorites") || "[]");
    const index = favorites.findIndex(fav => fav.id === id);

    if (index === -1) {
      let title = "";
      if (type === "video") {
        const item = VIGI_DATA.videos.find(v => v.id === id);
        title = item ? item.titulo : "";
      } else if (type === "arte") {
        const item = VIGI_DATA.artes.find(a => a.id === id);
        title = item ? item.titulo : "";
      } else if (type === "manual") {
        const item = VIGI_DATA.manuais.find(m => m.id === id);
        title = item ? item.titulo : "";
      }
      favorites.push({ id, type, title });
    } else {
      favorites.splice(index, 1);
    }

    localStorage.setItem("vigi_favorites", JSON.stringify(favorites));

    // Re-render
    renderFavorites();
    applyFiltersAndSearch();
  }

  function renderFavorites() {
    const favoritesList = document.getElementById("favoritesList");
    const favoritesPanel = document.getElementById("favoritesPanel");
    if (!favoritesList) return;
    favoritesList.innerHTML = "";

    const favorites = JSON.parse(localStorage.getItem("vigi_favorites") || "[]");

    // Mostrar/ocultar painel no dashboard mobile
    if (favoritesPanel) {
      favoritesPanel.style.display = favorites.length > 0 ? "block" : "none";
    }

    if (favorites.length === 0) return;

    favorites.forEach(fav => {
      let icon = "⚙️";
      let typeLabel = "Material";
      if (fav.type === "video") {
        icon = "🎬";
        typeLabel = "Vídeo Explicativo";
      } else if (fav.type === "arte") {
        icon = "📊";
        typeLabel = "Arte / Tabela";
      } else if (fav.type === "manual") {
        icon = "📋";
        typeLabel = "Guia / Checklist";
      }

      const card = document.createElement("div");
      card.className = "favorites-card";
      card.setAttribute("data-id", fav.id);
      card.setAttribute("data-type", fav.type);

      card.innerHTML = `
        <div class="favorites-info">
          <h4 class="favorites-title" title="${fav.title}">${fav.title}</h4>
          <span class="favorites-meta">${typeLabel}</span>
        </div>
        <span class="favorites-icon">${icon}</span>
      `;

      card.addEventListener("click", () => {
        handleAccessMaterial(fav);
      });

      favoritesList.appendChild(card);
    });
  }

  function toggleUpvote(reqId) {
    const requests = JSON.parse(localStorage.getItem("vigi_requests") || "[]");
    const reqIndex = requests.findIndex(r => r.id === reqId);
    if (reqIndex === -1) return;

    const storageKey = `vigi_voted_${reqId}`;
    const hasVoted = localStorage.getItem(storageKey) === "true";

    if (!hasVoted) {
      requests[reqIndex].upvotes = (requests[reqIndex].upvotes || 0) + 1;
      localStorage.setItem(storageKey, "true");
    } else {
      requests[reqIndex].upvotes = Math.max(0, (requests[reqIndex].upvotes || 0) - 1);
      localStorage.removeItem(storageKey);
    }

    localStorage.setItem("vigi_requests", JSON.stringify(requests));
    loadRequests();
  }

  function handleAccessMaterial(link) {
    if (!link) return;
    
    if (link.type === "video") {
      switchTab("videos");
      const videoData = VIGI_DATA.videos.find(v => v.id === link.id);
      if (videoData) {
        setTimeout(() => openVideoPlayer(videoData), 200);
      }
    } else if (link.type === "arte") {
      switchTab("artes");
      const artData = VIGI_DATA.artes.find(a => a.id === link.id);
      if (artData) {
        setTimeout(() => openLightbox(artData), 200);
      }
    } else if (link.type === "manual") {
      switchTab("manuais");
      setTimeout(() => openGuide(link.id), 200);
    }
  }

  // ==========================================================================
  // DASHBOARD: TUTORIAIS EM DESTAQUE E CHECKLIST DE OURO
  // ==========================================================================
  function initDashboardFeaturedVideos() {
    const container = document.getElementById("dashFeaturedVideos");
    if (!container) return;
    container.innerHTML = "";

    const featuredIds = ["v-proc-1", "v-proc-4", "v-hik-1", "v-unv-1", "v-alarme-1", "v-tec-3"];
    const featuredVideos = featuredIds.map(id => VIGI_DATA.videos.find(v => v.id === id)).filter(Boolean);

    featuredVideos.forEach(v => {
      const card = document.createElement("div");
      card.className = "featured-video-card";
      const tagClass = getBrandTagClass(v.categoria);
      const capa = v.capa || "VIGI.png";

      card.innerHTML = `
        <div class="featured-video-thumb">
          <img src="${capa}" alt="${v.titulo}" loading="lazy" onerror="this.src='VIGI.png';">
          <div class="featured-play-badge">
            <span>▶</span>
          </div>
        </div>
        <div class="featured-video-body">
          <h4 class="featured-video-title">${v.titulo}</h4>
          <div class="featured-video-footer">
            <span class="video-brand-tag ${tagClass}">${v.categoria}</span>
            <span style="font-size: 11px; color: var(--color-primary); font-weight: 700;">Assistir →</span>
          </div>
        </div>
      `;

      card.addEventListener("click", () => {
        openVideoPlayer(v);
      });

      container.appendChild(card);
    });
  }

  function initGoldChecklist() {
    const container = document.getElementById("goldChecklistItems");
    const counterEl = document.getElementById("goldChecklistCounter");
    if (!container) return;

    const checkboxes = container.querySelectorAll(".dash-check-input");
    const STORAGE_KEY = "vigi_gold_checklist";
    let state = {};
    try {
      state = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch (_) {
      state = {};
    }

    function updateCounter() {
      const total = checkboxes.length;
      let checked = 0;
      checkboxes.forEach(chk => {
        const id = chk.getAttribute("data-check-id");
        if (state[id]) {
          chk.checked = true;
          checked++;
        } else {
          chk.checked = false;
        }
      });

      if (counterEl) {
        if (checked === total) {
          counterEl.textContent = "🎉 5/5 Tudo Pronto para Entrega!";
          counterEl.style.background = "rgba(16, 185, 129, 0.2)";
          counterEl.style.color = "#34d399";
        } else {
          counterEl.textContent = `${checked}/${total} Concluídos`;
          counterEl.style.background = "rgba(16, 185, 129, 0.12)";
          counterEl.style.color = "#10b981";
        }
      }
    }

    checkboxes.forEach(chk => {
      chk.addEventListener("change", (e) => {
        const id = e.target.getAttribute("data-check-id");
        state[id] = e.target.checked;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        updateCounter();
        if (state[id] && typeof window.showToast === "function") {
          window.showToast("Item verificado com sucesso!", "success", "✓");
        }
      });
    });

    updateCounter();
  }

  // ==========================================================================
  // CARROSSEL DE DICAS ROTATIVAS
  // ==========================================================================
  const TIPS = [
    { icon: "💡", text: "<strong>Fuso Horário:</strong> Nunca saia do cliente sem conferir se o gravador está em <strong>GMT -03:00 Brasília</strong>. Hora errada = cliente sem conseguir buscar gravação!" },
    { icon: "🔒", text: "<strong>Senha Forte:</strong> Use sempre letras maiúsculas, minúsculas, números e caractere especial (@, #, $). Anote na ficha técnica do cliente sem exceção." },
    { icon: "📡", text: "<strong>IP Fixo:</strong> Sempre configure um IP estático para o DVR fora da faixa DHCP do roteador (ex: final .200). IP dinâmico = câmera sumindo na nuvem." },
    { icon: "💾", text: "<strong>Formatar HD:</strong> Todo HD novo ou após reset deve ser inicializado no menu do DVR antes de fechar o rack. Sem formatação, o gravador não grava." },
    { icon: "⚡", text: "<strong>No-break:</strong> Nunca atualize firmware sem garantir alimentação estável. Queda de energia durante update queima a placa permanentemente." },
    { icon: "📶", text: "<strong>Sub-stream:</strong> Configure o sub-stream do DVR para CIF ou 2CIF a 10-12 FPS. Fluidez no celular 3G/4G do cliente depende disso." },
    { icon: "🌐", text: "<strong>DNS:</strong> Sempre configure DNS primário <strong>8.8.8.8</strong> e secundário <strong>1.1.1.1</strong> no DVR. DNS incorreto impede a sincronização de nuvem." },
    { icon: "🔌", text: "<strong>Separação de Cabos:</strong> Nunca passe cabo de vídeo na mesma tubulação de cabos de energia 110V/220V. Isso causa chuviscos e faixas na imagem." },
    { icon: "📱", text: "<strong>Compartilhamento Hik-Connect:</strong> O admin deve compartilhar pelo app para os demais usuários. Nunca adicione o DVR direto no celular de um segundo usuário." },
    { icon: "🛠️", text: "<strong>Balun / BNC:</strong> Refaça sempre as pontas dos conectores. Mau contato é a principal causa de perda de vídeo intermitente em campo." }
  ];

  let currentTipIndex = 0;
  let tipAutoInterval = null;

  function initTipsCarousel() {
    const track = document.getElementById("dashTipsTrack");
    const dotsContainer = document.getElementById("dashTipsDots");
    const prevBtn = document.getElementById("tipPrevBtn");
    const nextBtn = document.getElementById("tipNextBtn");
    if (!track || !dotsContainer) return;

    // Renderizar todas as dicas
    track.innerHTML = TIPS.map((tip, i) => `
      <div class="dash-tip-slide ${i === 0 ? 'active' : ''}" data-tip-idx="${i}">
        <span class="dash-tip-icon">${tip.icon}</span>
        <p>${tip.text}</p>
      </div>
    `).join("");

    // Criar dots
    dotsContainer.innerHTML = TIPS.map((_, i) =>
      `<button class="dash-tip-dot ${i === 0 ? 'active' : ''}" data-dot="${i}" aria-label="Dica ${i+1}"></button>`
    ).join("");

    function goToTip(idx) {
      const slides = track.querySelectorAll(".dash-tip-slide");
      const dots = dotsContainer.querySelectorAll(".dash-tip-dot");
      slides.forEach(s => s.classList.remove("active", "exit"));
      dots.forEach(d => d.classList.remove("active"));
      currentTipIndex = (idx + TIPS.length) % TIPS.length;
      slides[currentTipIndex].classList.add("active");
      dots[currentTipIndex].classList.add("active");
    }

    // Auto-avanço a cada 6 segundos
    function startAuto() {
      tipAutoInterval = setInterval(() => goToTip(currentTipIndex + 1), 6000);
    }
    function resetAuto() {
      clearInterval(tipAutoInterval);
      startAuto();
    }

    if (prevBtn) prevBtn.addEventListener("click", () => { goToTip(currentTipIndex - 1); resetAuto(); });
    if (nextBtn) nextBtn.addEventListener("click", () => { goToTip(currentTipIndex + 1); resetAuto(); });
    dotsContainer.addEventListener("click", (e) => {
      const dot = e.target.closest(".dash-tip-dot");
      if (dot) { goToTip(parseInt(dot.getAttribute("data-dot"))); resetAuto(); }
    });

    // Pausa ao passar o mouse
    const carousel = document.getElementById("dashTipsCarousel");
    if (carousel) {
      carousel.addEventListener("mouseenter", () => clearInterval(tipAutoInterval));
      carousel.addEventListener("mouseleave", () => startAuto());
    }

    startAuto();
  }

  // DISPARO PROTEGIDO: Só renderiza se o auth.js já tiver validado sessão + vigi_access
  if (window.VIGI_AUTH_VERIFIED === true) {
    init();
  } else {
    lockPortal();
  }

});




