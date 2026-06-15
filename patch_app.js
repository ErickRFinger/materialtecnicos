const fs = require('fs');

const appJsPath = "c:\\Users\\User\\Desktop\\HTML VIGI\\app.js";
let content = fs.readFileSync(appJsPath, "utf-8");

// Adicionar a lógica do spinner na criação do iframe
const iframeTarget = `const iframe = document.createElement("iframe");`;
const spinnerInjection = `
      const spinner = document.createElement("div");
      spinner.className = "iframe-spinner";
      container.appendChild(spinner);
      
      const iframe = document.createElement("iframe");
`;
content = content.replace(iframeTarget, spinnerInjection);

// Adicionar o iframe.onload para remover o spinner
const iframeAllowTarget = `iframe.allow = "autoplay";`;
const onloadInjection = `iframe.allow = "autoplay";
      iframe.onload = () => {
        if(container.contains(spinner)) container.removeChild(spinner);
      };`;
content = content.replace(iframeAllowTarget, onloadInjection);

// Adicionar a lógica da busca global no final do DOMContentLoaded
const domEndTarget = `}); // Fechamento do DOMContentLoaded`;
const searchLogic = `
  // --- LÓGICA DA BUSCA GLOBAL ---
  const globalSearch = document.getElementById("globalSearch");
  if (globalSearch) {
    globalSearch.addEventListener("input", (e) => {
      const termo = e.target.value.toLowerCase().trim();
      
      const videoCards = document.querySelectorAll(".video-card");
      videoCards.forEach(card => {
        const title = card.querySelector(".video-title").textContent.toLowerCase();
        const desc = card.querySelector(".video-desc").textContent.toLowerCase();
        if (title.includes(termo) || desc.includes(termo)) card.style.display = "flex";
        else card.style.display = "none";
      });

      const arteCards = document.querySelectorAll(".art-card");
      arteCards.forEach(card => {
        const title = card.querySelector(".art-title").textContent.toLowerCase();
        if (title.includes(termo)) card.style.display = "flex";
        else card.style.display = "none";
      });

      const guideCards = document.querySelectorAll(".guide-card");
      guideCards.forEach(card => {
        const title = card.querySelector(".guide-title").textContent.toLowerCase();
        const desc = card.querySelector(".guide-desc") ? card.querySelector(".guide-desc").textContent.toLowerCase() : "";
        if (title.includes(termo) || desc.includes(termo)) card.style.display = "flex";
        else card.style.display = "none";
      });
    });
  }

}); // Fechamento do DOMContentLoaded`;

if(content.includes(domEndTarget)) {
    content = content.replace(domEndTarget, searchLogic);
} else {
    // If not found exactly like that, just append before the last line
    const lastBrace = content.lastIndexOf("});");
    content = content.substring(0, lastBrace) + searchLogic.replace("}); // Fechamento do DOMContentLoaded", "});") + content.substring(lastBrace + 3);
}

fs.writeFileSync(appJsPath, content, "utf-8");
console.log("Done app.js");
