const fs = require('node:fs');
const path = require('node:path');
const readline = require('node:readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Cole a publishable key do Supabase: ', answer => {
  rl.close();
  const key = answer.trim();

  if (key.startsWith('sb_secret_')) {
    console.error('Erro: chave sb_secret_ recusada. Use somente a publishable key pública sb_publishable_....');
    process.exitCode = 1;
    return;
  }

  if (!/^sb_publishable_[A-Za-z0-9_-]{20,}$/.test(key)) {
    console.error('Erro: formato inválido. A chave deve começar com sb_publishable_ e ter ao menos 20 caracteres após o prefixo.');
    process.exitCode = 1;
    return;
  }

  const configPath = path.join(__dirname, '..', 'supabase-config.js');
  const config = fs.readFileSync(configPath, 'utf8');
  const constantPattern = /(^const SUPABASE_ANON\s*=\s*)(['"])[^'"]*\2/m;

  if (!constantPattern.test(config)) {
    console.error('Erro: constante SUPABASE_ANON não encontrada em supabase-config.js.');
    process.exitCode = 1;
    return;
  }

  const updated = config.replace(constantPattern, (_, prefix, quote) => `${prefix}${quote}${key}${quote}`);
  fs.writeFileSync(configPath, updated);
  console.log('✓ supabase-config.js atualizado');
});
