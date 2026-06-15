const fs = require('fs');
const dataJsPath = "c:\\Users\\User\\Desktop\\HTML VIGI\\data.js";
let content = fs.readFileSync(dataJsPath, "utf-8");

const hikLinks = {
  "v-hik-1": "https://drive.google.com/file/d/1UOfHK5oa3EjYuAr9lWheM8Wl6RkxsSzC/view?usp=sharing",
  "v-hik-2": "https://drive.google.com/file/d/1RDRzzsYLUZWWPOD2tb0tblbvvo1b-jWB/view?usp=sharing",
  "v-hik-3": "https://drive.google.com/file/d/1UjtKlzG_sgtD2RYit0LjLLroI8Jr6reH/view?usp=sharing",
  "v-hik-4": "https://drive.google.com/file/d/1B_1OWKM7-gsyQDg--MRt2Y_pczgWDqM0/view?usp=sharing",
  "v-hik-5": "https://drive.google.com/file/d/1xl0x7hNpHxPMeZGVnIKJwhX4RHMNaZ8P/view?usp=sharing",
  "v-hik-8": "https://drive.google.com/file/d/11dUpxFR9JGWXB5F1_xzahcssunQWTn58/view?usp=sharing",
  "v-hik-6": "https://drive.google.com/file/d/1KiTbnEBJ6GPoILaAj9S9tPVVThVTk6W9/view?usp=sharing",
  "v-hik-7": "https://drive.google.com/file/d/12qHaLDsgZq8tXvVEIE8VT1YXzhRbnTrA/view?usp=sharing",
  "v-hik-9": "https://drive.google.com/file/d/1sWJikfGy9S7X5cq35_Wm81PpEQORDT7z/view?usp=sharing"
};

for (const [id, link] of Object.entries(hikLinks)) {
    // Busca id: "v-hik-1" e então dá match até driveUrl: ""
    const regex = new RegExp('(id:\\s*"' + id + '"[\\s\\S]*?driveUrl:\\s*")"', 'i');
    content = content.replace(regex, '$1' + link + '"');
}

fs.writeFileSync(dataJsPath, content, "utf-8");
console.log("Hikvision links injected!");
