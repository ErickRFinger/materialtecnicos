const fs = require('fs');
const dataJsPath = "c:\\Users\\User\\Desktop\\HTML VIGI\\data.js";
let content = fs.readFileSync(dataJsPath, "utf-8");

const unvLinks = {
  "v-unv-2": "https://drive.google.com/file/d/1RQMcCI8qwu6JuKMNZBZxpqTgQ-8k2O_9/view?usp=sharing", // LOGAR UNV LINK
  "v-unv-3": "https://drive.google.com/file/d/1RRJXnYF_I3O68X7ZKPbW-I-hzNZvkG-p/view?usp=sharing", // Reiniciar DVR UNV
  "v-unv-4": "https://drive.google.com/file/d/1LhjjCDwBVi7JlWOQ-HmYJuIBWqk6PSaA/view?usp=sharing", // Troca de Senha UNV
  "v-unv-5": "https://drive.google.com/file/d/1xrGWJ8e_e_X7TE2hF7Gw-UWsNXMiZvp-/view?usp=sharing", // UTILIZAÇÃO UNV LINK
  "v-unv-6": "https://drive.google.com/file/d/1gS_Lk7e5u8Ut5VXle2C8rOt_5FgH12H0/view?usp=sharing"  // Utilização EZ Station
};

for (const [id, link] of Object.entries(unvLinks)) {
    const regex = new RegExp('(id:\\s*"' + id + '"[\\s\\S]*?driveUrl:\\s*")"', 'i');
    content = content.replace(regex, '$1' + link + '"');
}

fs.writeFileSync(dataJsPath, content, "utf-8");
console.log("Uniview links injected!");
