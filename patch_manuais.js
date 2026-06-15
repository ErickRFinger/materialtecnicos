const fs = require('fs');
const dataJsPath = "c:\\Users\\User\\Desktop\\HTML VIGI\\data.js";
let content = fs.readFileSync(dataJsPath, "utf-8");

const manuaisLinks = {
  "Atualizar DVR HIK": "https://drive.google.com/file/d/1lWQ2ToVeOqlgnuedD22OoV79DNZTE24p/view?usp=sharing",
  "Atualizar DVR UNV": "https://drive.google.com/file/d/1OHVbavKOUElRfxy9jQpBVZAjs0JQqSyz/view?usp=sharing",
  "Resetar e configurar DVR HIK": "https://drive.google.com/file/d/1SyTikSnxALHtISM7hqkmfb3b86m92Qdy/view?usp=sharing",
  "Resetar e configurar DVR UNV": "https://drive.google.com/file/d/1LIHO9l0y-iYzeqZC3K6iJgSStWzOjv2o/view?usp=sharing",
  "Baixar e Instalar o EZStation": "https://drive.google.com/file/d/1KF12LVypIxTR8LCjNIJnk2Nt9c1hN2Ua/view?usp=sharing",
  "Baixar e Instalar o IVMS": "https://drive.google.com/file/d/1GiFCbYd0CRqF7f9D7eNBGdei0jHJEWSn/view?usp=sharing"
};

// Varrer os dados em VIGI_DATA
const VIGI_DATA_STR = content.substring(content.indexOf("const VIGI_DATA = {"));
// Em vez de JSON parse, vamos fazer replace baseados no caminho
for (const [chave, link] of Object.entries(manuaisLinks)) {
    // Pega o bloco do objeto inteiro usando regex que bate no caminho
    const regex = new RegExp(`(caminho:\\s*"[^"]*?${chave}[^"]*?"[\\s\\S]*?driveUrl:\\s*")[^"]*(")`, 'i');
    content = content.replace(regex, `$1${link}$2`);
}

fs.writeFileSync(dataJsPath, content, "utf-8");
console.log("Manuais links injected!");
