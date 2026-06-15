const fs = require('fs');
const dataJsPath = "c:\\Users\\User\\Desktop\\HTML VIGI\\data.js";
let content = fs.readFileSync(dataJsPath, 'utf8');
// Replace every "caminho" that points to a PNG inside ARTES CÂMERAS with the common logo
content = content.replace(/caminho:\s*"[^\"]*ARTES[^\"]*"/gi, 'caminho: "VIGI.png"');
fs.writeFileSync(dataJsPath, content, 'utf8');
console.log('All artes caminhos updated to VIGI.png');
