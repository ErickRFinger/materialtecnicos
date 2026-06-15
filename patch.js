const fs = require('fs');

const dataJsPath = "c:\\Users\\User\\Desktop\\HTML VIGI\\data.js";
let content = fs.readFileSync(dataJsPath, "utf-8");

content = content.replace(/(descricao:\s*".*?")\n\s*\}/g, '$1,\n      driveUrl: ""\n    }');

fs.writeFileSync(dataJsPath, content, "utf-8");
console.log("Done");
