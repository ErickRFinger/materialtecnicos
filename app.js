/* ==========================================================================
   PORTAL TÉCNICO VIGI - APLICATIVO LOGIC
   ========================================================================== */

/* ------------------------------------------------------------------
   CONTROLE DE LOGIN
   ------------------------------------------------------------------ */
(function () {
  const LOGIN_USER = "admin";
  const LOGIN_PASS = "clic3369";
  const SESSION_KEY = "vigi_auth";

  const overlay = document.getElementById("loginOverlay");
  const form    = document.getElementById("loginForm");
  const userInp = document.getElementById("loginUser");
  const passInp = document.getElementById("loginPass");
  const errEl   = document.getElementById("loginError");
  const togglePassBtn = document.getElementById("togglePass");
  const loginBtn = document.getElementById("loginBtn");

  // Se já autenticado nesta sessão, esconde o overlay imediatamente
  if (sessionStorage.getItem(SESSION_KEY) === "ok") {
    overlay.style.display = "none";
    return; // Nada mais a fazer
  }

  // Mostrar/esconder senha
  if (togglePassBtn) {
    togglePassBtn.addEventListener("click", () => {
      const isPass = passInp.type === "password";
      passInp.type = isPass ? "text" : "password";
    });
  }

  // Submissão do formulário
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const user = userInp.value.trim();
    const pass = passInp.value;

    if (user === LOGIN_USER && pass === LOGIN_PASS) {
      // Credenciais corretas
      errEl.classList.remove("visible");
      loginBtn.disabled = true;
      loginBtn.textContent = "Entrando…";

      // Salvar sessão e animar saída
      sessionStorage.setItem(SESSION_KEY, "ok");
      overlay.classList.add("hidden");

      // Remover do DOM após animação
      overlay.addEventListener("animationend", () => {
        overlay.style.display = "none";
      }, { once: true });

    } else {
      // Credenciais erradas — shake + mensagem
      errEl.classList.remove("visible");
      // Força re-flow para reiniciar animação
      void errEl.offsetWidth;
      errEl.classList.add("visible");
      passInp.value = "";
      passInp.focus();
    }
  });
})();

document.addEventListener("DOMContentLoaded", () => {
  // ELEMENTOS DO DOM
  const navItems = document.querySelectorAll(".nav-item");
  const sections = document.querySelectorAll(".content-section");
  const mobileMenuToggle = document.getElementById("mobileMenuToggle");
  const sidebar = document.getElementById("sidebar");
  const globalSearch = document.getElementById("globalSearch");
  
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
  
  // Formulário de Solicitação
  const requestForm = document.getElementById("requestForm");
  const requestsTableBody = document.getElementById("requestsTableBody");
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

  // ==========================================================================
  // INICIALIZAÇÃO
  // ==========================================================================
  function init() {
    updateStats();
    renderFavorites();
    renderVideos();
    renderArtes();
    renderManuais();
    loadRequests();
    renderSlide(currentSlideIndex);
    setupSlideDots();
    setupEventListeners();
  }

  // ==========================================================================
  // COMPORTAMENTO DE NAVEGAÇÃO E ABAS
  // ==========================================================================
  function switchTab(tabId) {
    currentActiveTab = tabId;
    
    // Atualizar classe ativa na Sidebar
    navItems.forEach(item => {
      if (item.getAttribute("data-tab") === tabId) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });

    // Exibir seção correspondente
    sections.forEach(section => {
      if (section.getAttribute("id") === tabId) {
        section.classList.add("active");
      } else {
        section.classList.remove("active");
      }
    });

    // Fechar menu mobile se estiver aberto
    sidebar.classList.remove("open");
    
    // Rolar para o topo ao trocar de aba
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Filtrar conteúdo de acordo com a aba e busca
    applyFiltersAndSearch();
  }

  // Eventos de clique na sidebar e atalhos
  function setupEventListeners() {
    // Menu Sidebar
    navItems.forEach(item => {
      item.addEventListener("click", () => {
        const tabId = item.getAttribute("data-tab");
        switchTab(tabId);
      });
    });

    // Hamburguer Mobile
    mobileMenuToggle.addEventListener("click", () => {
      sidebar.classList.toggle("open");
    });

    // Fechar sidebar ao clicar fora em telas pequenas
    document.addEventListener("click", (e) => {
      if (window.innerWidth <= 768) {
        if (!sidebar.contains(e.target) && !mobileMenuToggle.contains(e.target) && sidebar.classList.contains("open")) {
          sidebar.classList.remove("open");
        }
      }
    });

    // Busca Global
    if (globalSearch) {
      globalSearch.addEventListener("input", (e) => {
        currentSearchQuery = e.target.value.toLowerCase().trim();
        
        // Se o usuário começar a digitar na Dashboard, muda para a aba de Vídeos automaticamente
        if (currentActiveTab === "dashboard" && currentSearchQuery.length > 0) {
          switchTab("videos");
        } else {
          applyFiltersAndSearch();
        }
      });
    }

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
        switchTab(tab);
      });
    });

    document.querySelectorAll("[data-target-guide]").forEach(btn => {
      btn.addEventListener("click", () => {
        const guideId = btn.getAttribute("data-target-guide");
        switchTab("manuais");
        openGuide(guideId);
      });
    });

    // Formulário de Solicitação
    if (requestForm) {
      requestForm.addEventListener("submit", handleRequestSubmit);
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
  // RENDERIZADORES DE CONTEÚDO
  // ==========================================================================

  // Dashboard - Estatísticas Rápidas
  function updateStats() {
    const totalAlarme = VIGI_DATA.videos.filter(v => v.categoria === "Alarme").length;
    const totalHik = VIGI_DATA.videos.filter(v => v.categoria === "Hikvision").length;
    const totalUnv = VIGI_DATA.videos.filter(v => v.categoria === "Uniview").length;
    const totalTec = VIGI_DATA.manuais.length;

    if (countAlarme) countAlarme.textContent = totalAlarme;
    if (countHik) countHik.textContent = totalHik;
    if (countUnv) countUnv.textContent = totalUnv;
    if (countTec) countTec.textContent = totalTec;
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

      card.innerHTML = `
        <div class="video-thumbnail">
          <span class="video-brand-tag ${tagClass}">${video.categoria}</span>
          <div class="thumbnail-pattern"></div>
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
              Vídeo em Nuvem
            </span>
            <button class="watch-btn">Assistir</button>
          </div>
        </div>
      `;

      // Evento para abrir o player de vídeo
      const actionBtn = card.querySelector(".watch-btn");
      const playBtn = card.querySelector(".play-overlay-btn");
      
      const triggerWatch = () => openVideoPlayer(video);
      actionBtn.addEventListener("click", triggerWatch);
      playBtn.addEventListener("click", triggerWatch);

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
          </div>
        </div>
      `;

      const viewBtn = card.querySelector(".view-art-btn");
      const zoomOverlay = card.querySelector(".art-zoom-overlay");
      
      const triggerZoom = () => openLightbox(art);
      viewBtn.addEventListener("click", triggerZoom);
      zoomOverlay.addEventListener("click", triggerZoom);

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
        <div class="guide-body">
          <p class="guide-intro">${guide.descricao}</p>
          
          <div class="guide-progress-container">
            <div class="guide-progress-text">
              <span>Progresso de Execução Segura</span>
              <span class="progress-percentage">0%</span>
            </div>
            <div class="guide-progress-bar-bg">
              <div class="guide-progress-bar-fill"></div>
            </div>
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
    
    if (progressFill) progressFill.style.width = `${percent}%`;
    if (progressText) progressText.textContent = `${percent}% (${checkedCount}/${totalSteps})`;
  }

  // Auxiliar para classes CSS de categoria
  function getBrandTagClass(category) {
    switch (category.toLowerCase()) {
      case "hikvision": return "tag-hik";
      case "uniview": return "tag-unv";
      case "alarme": return "tag-alarme";
      default: return "tag-tec";
    }
  }

  // ==========================================================================
  // SOLICITAÇÃO DE MATERIAIS (PERSISTÊNCIA LOCAL)
  // ==========================================================================
  function handleRequestSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById("reqName").value.trim();
    const title = document.getElementById("reqTitle").value.trim();
    const type = document.getElementById("reqType").value;
    const urgency = document.getElementById("reqUrgency").value;
    const desc = document.getElementById("reqDesc").value.trim();

    if (!name || !title || !type || !urgency || !desc) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const newRequest = {
      id: "req-" + Date.now(),
      nome: name,
      titulo: title,
      tipo: type,
      urgencia: urgency,
      descricao: desc,
      status: "Pendente", // Pendente -> Em Gravação -> Pronto
      data: new Date().toLocaleDateString("pt-BR")
    };

    // Salvar no localstorage
    const currentRequests = JSON.parse(localStorage.getItem("vigi_requests") || "[]");
    currentRequests.unshift(newRequest); // Inserir no topo
    localStorage.setItem("vigi_requests", JSON.stringify(currentRequests));

    // Feedback visual
    const submitBtn = requestForm.querySelector(".submit-btn");
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Solicitado com Sucesso! ✓";
    submitBtn.style.backgroundColor = "var(--color-success)";
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.textContent = originalText;
      submitBtn.style.backgroundColor = "var(--color-primary)";
      submitBtn.disabled = false;
    }, 2000);

    // Reset do form e recarregar lista
    requestForm.reset();
    loadRequests();
  }

  function loadRequests() {
    const requestsCardsContainer = document.getElementById("requestsCardsContainer");
    if (!requestsCardsContainer) return;
    requestsCardsContainer.innerHTML = "";

    const requests = JSON.parse(localStorage.getItem("vigi_requests") || "[]");

    // Adiciona alguns mocks de requisições iniciais caso esteja vazio, para simular realismo no portal
    if (requests.length === 0) {
      const defaultMocks = [
        {
          id: "req-mock-1",
          nome: "Guilherme Silva",
          titulo: "Reset físico central Intelbras ANM 24 NET",
          tipo: "Vídeo Tutorial",
          urgencia: "Alta",
          status: "Em Gravação",
          data: "05/06/2026",
          upvotes: 24,
          descricao: "Procedimento passo a passo para fazer o reset físico da central Intelbras modelo ANM 24 NET em campo.",
          adminReply: "Material em produção na bancada técnica. Previsão de publicação: Quarta-feira (10/06)."
        },
        {
          id: "req-mock-2",
          nome: "Diego Souza",
          titulo: "Esquema de ligação de sensores de alarme sem fio",
          tipo: "Tabela / Imagem Informativa",
          urgencia: "Média",
          status: "Pronto",
          data: "01/06/2026",
          upvotes: 12,
          descricao: "Tabela contendo os valores e especificações técnicas de distância de cada sensor de presença sem fio.",
          adminReply: "Tabela oficial disponível na aba Artes & Tabelas com o nome de Valores de Sensores de Alarme Sem Fio.",
          linkMaterial: { type: "arte", id: "art-9" }
        },
        {
          id: "req-mock-3",
          nome: "Carlos Oliveira",
          titulo: "Como configurar fuso horário e NTP no DVR Uniview",
          tipo: "Vídeo Tutorial",
          urgencia: "Alta",
          status: "Pronto",
          data: "07/06/2026",
          upvotes: 18,
          descricao: "Muitos clientes reclamam de fuso horário incorreto em Uniview, causando falhas na busca de gravações remota.",
          adminReply: "Passo a passo disponível no Guia de Reset e Configuração Básica de DVR (Passo 3: Ajuste de Data/Hora/NTP).",
          linkMaterial: { type: "manual", id: "man-1" }
        },
        {
          id: "req-mock-4",
          nome: "Felipe Rodrigues",
          titulo: "Como utilizar o aplicativo Hik-Connect",
          tipo: "Vídeo Tutorial",
          urgencia: "Alta",
          status: "Pronto",
          data: "04/06/2026",
          upvotes: 31,
          descricao: "Passo a passo completo mostrando o download, criação da conta e adição de dispositivo por QR Code no aplicativo Hik-Connect.",
          adminReply: "Vídeo tutorial publicado com sucesso! Acesse a aba de vídeos para assistir.",
          linkMaterial: { type: "video", id: "v-hik-7" }
        }
      ];
      localStorage.setItem("vigi_requests", JSON.stringify(defaultMocks));
      loadRequests();
      return;
    }

    // Ordenar por upvotes decrescente
    requests.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));

    // Atualizar Dashboard de Métricas
    const totalCount = requests.length;
    const progressCount = requests.filter(r => r.status === "Em Gravação").length;
    const readyCount = requests.filter(r => r.status === "Pronto").length;
    
    let mostUpvotedTitle = "-";
    if (requests.length > 0) {
      mostUpvotedTitle = requests[0].titulo;
      if (mostUpvotedTitle.length > 25) {
        mostUpvotedTitle = mostUpvotedTitle.substring(0, 25) + "...";
      }
    }

    const reqTotalEl = document.getElementById("req-count-total");
    const reqProgressEl = document.getElementById("req-count-progress");
    const reqReadyEl = document.getElementById("req-count-ready");
    const reqUpvotedEl = document.getElementById("req-count-upvoted");

    if (reqTotalEl) reqTotalEl.textContent = totalCount;
    if (reqProgressEl) reqProgressEl.textContent = progressCount;
    if (reqReadyEl) reqReadyEl.textContent = readyCount;
    if (reqUpvotedEl) {
      reqUpvotedEl.textContent = mostUpvotedTitle;
      reqUpvotedEl.title = requests[0] ? requests[0].titulo : "";
      reqUpvotedEl.style.fontSize = "14px";
      reqUpvotedEl.style.whiteSpace = "nowrap";
      reqUpvotedEl.style.overflow = "hidden";
      reqUpvotedEl.style.textOverflow = "ellipsis";
    }

    tableEmptyState.style.display = requests.length > 0 ? "none" : "block";

    requests.forEach(req => {
      const card = document.createElement("div");
      card.className = "request-card";
      
      const isVoted = localStorage.getItem(`vigi_voted_${req.id}`) === "true";
      const urgencyClass = req.urgencia.toLowerCase().replace("é", "e");

      // Timeline HTML
      let timelineHtml = "";
      if (req.status === "Pendente") {
        timelineHtml = `
          <div class="status-timeline">
            <div class="timeline-step active"><span class="timeline-dot"></span>Recebido</div>
            <div class="timeline-step"><span class="timeline-dot"></span>Produção</div>
            <div class="timeline-step"><span class="timeline-dot"></span>Publicado</div>
          </div>
        `;
      } else if (req.status === "Em Gravação") {
        timelineHtml = `
          <div class="status-timeline">
            <div class="timeline-step completed"><span class="timeline-dot"></span>Recebido</div>
            <div class="timeline-step active"><span class="timeline-dot"></span>Produção</div>
            <div class="timeline-step"><span class="timeline-dot"></span>Publicado</div>
          </div>
        `;
      } else if (req.status === "Pronto") {
        timelineHtml = `
          <div class="status-timeline">
            <div class="timeline-step completed"><span class="timeline-dot"></span>Recebido</div>
            <div class="timeline-step completed"><span class="timeline-dot"></span>Produção</div>
            <div class="timeline-step completed"><span class="timeline-dot"></span>Publicado</div>
          </div>
        `;
      }

      card.innerHTML = `
        <div class="request-card-header">
          <span class="request-card-type-tag">${req.tipo}</span>
          <span class="urgency-badge urgency-${urgencyClass}">${req.urgencia}</span>
        </div>
        <h4 class="request-card-title">${req.titulo}</h4>
        <p class="request-card-desc">${req.descricao}</p>
        ${req.adminReply ? `
          <div class="admin-reply-bubble">
            <strong>Suporte VIGI:</strong> ${req.adminReply}
          </div>
        ` : ""}
        <div class="request-card-footer">
          <div style="display: flex; gap: 10px;">
            <button class="upvote-btn ${isVoted ? 'active' : ''}" data-id="${req.id}">
              👍 <span>${req.upvotes || 0}</span> Apoiar
            </button>
            ${req.status === "Pronto" && req.linkMaterial ? `
              <button class="access-material-btn" data-id="${req.id}">
                Acessar Material
              </button>
            ` : ""}
          </div>
          ${timelineHtml}
        </div>
        <div class="request-card-user">Solicitado por ${req.nome} em ${req.data}</div>
      `;

      requestsCardsContainer.appendChild(card);
    });
  }

  // Abrir o Player de Vídeo no Modal
  function openVideoPlayer(videoData) {
    modalTitle.textContent = videoData.titulo;
    modalBody.innerHTML = "";
    
    const container = document.createElement("div");
    container.className = "video-player-container";
    
    // Verifica se possui o link do drive
    if (videoData.driveUrl && videoData.driveUrl.trim() !== "") {
      
      const spinner = document.createElement("div");
      spinner.className = "iframe-spinner";
      container.appendChild(spinner);
      
      const iframe = document.createElement("iframe");

      
      // Converte o link de "view" do Google Drive para "preview" para forçar o player embutido
      let embedUrl = videoData.driveUrl;
      if (embedUrl.includes("/view")) {
        embedUrl = embedUrl.replace("/view", "/preview");
      }
      
      iframe.src = embedUrl;
      iframe.width = "100%";
      iframe.height = "100%";
      iframe.style.border = "none";
      iframe.allow = "autoplay";
      iframe.onload = () => {
        if(container.contains(spinner)) container.removeChild(spinner);
      };
      
      container.appendChild(iframe);
    } else {
      // Mensagem de fallback caso não tenha a URL cadastrada no data.js
      container.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: white; padding: 20px; text-align: center;">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 16px; color: var(--color-danger);">
            <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <h3 style="margin-bottom: 8px;">Vídeo não configurado</h3>
          <p style="color: var(--text-muted); font-size: 14px; max-width: 400px; line-height: 1.5;">
            Este vídeo ainda não possui um link individual do Google Drive configurado no arquivo <code>data.js</code>. <br><br>
            Edite a propriedade <code>driveUrl</code> do vídeo <b>${videoData.id}</b> para habilitar o reprodutor.
          </p>
        </div>
      `;
    }

    const customControls = document.createElement("div");
    customControls.className = "video-custom-controls";
    customControls.innerHTML = `
      <div class="video-controls-left">
        <span>Categoria: <strong>${videoData.categoria}</strong></span>
        <span>Marca: <strong>${videoData.marca}</strong></span>
      </div>
      <div class="video-controls-right" style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
         <span style="font-size: 12px; color: var(--text-muted);">Reprodutor Integrado do Google Drive</span>
      </div>
    `;

    modalBody.appendChild(container);
    modalBody.appendChild(customControls);

    openModal();
  }

  // Abrir Zoom de Imagens no Modal
  function openLightbox(artData) {
    modalTitle.textContent = artData.titulo;
    modalBody.innerHTML = "";

    // Se tiver driveUrl, abre como iframe do Google Drive (igual ao player de vídeo)
    if (artData.driveUrl && artData.driveUrl.trim() !== "") {
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

    // Fallback: lightbox local com zoom & pan
    // Resetar variáveis de zoom & pan
    zoomFactor = 1.0;
    panX = 0;
    panY = 0;
    isPanning = false;

    // Criar contêiner
    const container = document.createElement("div");
    container.className = "lightbox-container";
    container.id = "lightboxContainer";

    // Criar imagem
    const img = document.createElement("img");
    img.src = artData.caminho;
    img.className = "lightbox-img";
    img.id = "lightboxImg";
    img.draggable = false; // Evita arraste padrão do browser
    
    // Controles de zoom
    const controls = document.createElement("div");
    controls.className = "lightbox-controls";
    controls.innerHTML = `
      <button class="zoom-btn" id="zoomOut" title="Reduzir Zoom">−</button>
      <span class="zoom-factor-label" id="zoomLabel">100%</span>
      <button class="zoom-btn" id="zoomIn" title="Aumentar Zoom">+</button>
      <button class="zoom-btn" id="zoomReset" title="Ajustar" style="font-size: 13px; font-weight:bold;">1:1</button>
    `;

    // Legenda inferior
    const caption = document.createElement("div");
    caption.className = "lightbox-caption";
    caption.innerHTML = `<p>${artData.descricao}</p><small style="color:var(--text-muted); display:block; margin-top:4px;">* Dica: Arraste a imagem com o mouse/dedo para navegar nos detalhes quando estiver com zoom.</small>`;

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
    if (index === 0 || index === totalSlides - 1) {
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
      // Slide 3: Redes (Texto à esquerda, duas imagens empilhadas à direita)
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
          <div style="display:flex; flex-direction:column; gap: 16px; justify-content:center;">
            <div class="slide-thumbnail" data-img-path="${slide.imagens[1]}" style="width: 100%; height: 160px; border-radius: var(--radius-md); margin:0;">
              <img src="${slide.imagens[1]}" alt="Esquema Rede 1">
              <div class="slide-thumbnail-overlay">🔍 Ampliar Diagrama Ping</div>
            </div>
            <div class="slide-thumbnail" data-img-path="${slide.imagens[2]}" style="width: 100%; height: 130px; border-radius: var(--radius-md); margin:0;">
              <img src="${slide.imagens[2]}" alt="Esquema Rede 2">
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
            <a href="http://192.168.10.211:8080" target="_blank" class="filter-btn active" style="text-decoration:none; margin-top:4px; display:inline-flex; align-items:center; gap:8px;">
              🌐 Acessar Portal Local: http://192.168.10.211:8080
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
    
    // Adicionar eventos de clique nas miniaturas dos slides para abrir no Drive
    slideCard.querySelectorAll(".slide-thumbnail").forEach(thumb => {
      thumb.addEventListener("click", () => {
        window.open("https://drive.google.com/drive/folders/1xOX1e0IQKu_C5EEWF-2UzShTGpoxvVuc?usp=sharing", "_blank");
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
    if (!favoritesList) return;
    favoritesList.innerHTML = "";

    const favorites = JSON.parse(localStorage.getItem("vigi_favorites") || "[]");

    if (favorites.length === 0) {
      favoritesList.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); font-size: 13px; padding: 20px;">
          Nenhum material favoritado ainda. Toque na estrela de qualquer vídeo, tabela ou manual para fixar atalhos aqui!
        </div>
      `;
      return;
    }

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

  // DISPARO
  init();

});
