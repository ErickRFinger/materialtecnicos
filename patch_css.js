const fs = require('fs');
const cssPath = "c:\\Users\\User\\Desktop\\HTML VIGI\\styles.css";
const cssAppend = `
/* ----- BARRA DE PESQUISA (SIDEBAR) ----- */
.sidebar-search {
  padding: 0 1.5rem 1.5rem 1.5rem;
  position: relative;
}

.sidebar-search input {
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 2.5rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-color);
  font-family: var(--font-family);
  font-size: 0.9rem;
  outline: none;
  transition: all 0.3s ease;
}

.sidebar-search input:focus {
  border-color: var(--primary-color);
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.sidebar-search .search-icon {
  position: absolute;
  left: 2.2rem;
  top: 40%;
  transform: translateY(-50%);
  color: var(--text-muted);
  pointer-events: none;
}

/* Spinner no Iframe */
.iframe-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-left-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  z-index: -1;
}

@keyframes spin {
  to { transform: translate(-50%, -50%) rotate(360deg); }
}
`;
fs.appendFileSync(cssPath, cssAppend, "utf-8");
