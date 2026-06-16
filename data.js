// Banco de dados de materiais do Portal VIGI
const VIGI_DATA = {
  videos: [
    // ALARME
    {
      id: "v-alarme-1",
      titulo: "Configurar Aplicativo de Alarme",
      categoria: "Alarme",
      marca: "Intelbras",
      caminho: "VIGI.png",
      descricao: "Tutorial detalhado para configuração inicial e pareamento do aplicativo de alarme no smartphone do cliente.",
      driveUrl: "https://drive.google.com/file/d/1QX_i-FzLbkKmK8kgMIdcIuQUc-EVTNYB/view"
    },
    {
      id: "v-alarme-2",
      titulo: "Reiniciar Central de Alarme Intelbras (Modelo Antigo)",
      categoria: "Alarme",
      marca: "Intelbras",
      caminho: "VIGI.png",
      descricao: "Procedimento passo a passo para reinicialização física e lógica das centrais de alarme Intelbras de modelos legados.",
      driveUrl: "https://drive.google.com/file/d/1Q5gyHFQhOczRlRySMgw4TCGHN1OSvI3k/view"
    },
    {
      id: "v-alarme-3",
      titulo: "Reiniciar Central de Alarme",
      categoria: "Alarme",
      marca: "Intelbras",
      caminho: "VIGI.png",
      descricao: "Como reiniciar com segurança a central de alarme padrão para restabelecimento de sinal ou limpeza de falhas.",
      driveUrl: "https://drive.google.com/file/d/1DqFJR9ylcVSpXHqSLpg1kgJ73SVvYzBA/view"
    },

    // HIKVISION
    {
      id: "v-hik-1",
      titulo: "Alterar Senha de Login Hik-Connect",
      categoria: "Hikvision",
      marca: "Hikvision",
      caminho: "VIGI.png",
      descricao: "Como proceder com a redefinição ou alteração de senha de uma conta no aplicativo Hik-Connect.",
      driveUrl: "https://drive.google.com/file/d/1UOfHK5oa3EjYuAr9lWheM8Wl6RkxsSzC/view?usp=sharing"
    },
    {
      id: "v-hik-2",
      titulo: "Como Aceitar Compartilhamento no Aplicativo Hik-Connect",
      categoria: "Hikvision",
      marca: "Hikvision",
      caminho: "VIGI.png",
      descricao: "Demonstração prática de como o cliente final aceita o compartilhamento de câmeras enviado pelo técnico.",
      driveUrl: "https://drive.google.com/file/d/1RDRzzsYLUZWWPOD2tb0tblbvvo1b-jWB/view?usp=sharing"
    },
    {
      id: "v-hik-3",
      titulo: "Desabilitar Modo Tablet no Aplicativo Hik-Connect",
      categoria: "Hikvision",
      marca: "Hikvision",
      caminho: "VIGI.png",
      descricao: "Como desativar a visualização em modo tablet para normalizar a interface em smartphones.",
      driveUrl: "https://drive.google.com/file/d/1UjtKlzG_sgtD2RYit0LjLLroI8Jr6reH/view?usp=sharing"
    },
    {
      id: "v-hik-4",
      titulo: "Como Logar no Hik-Connect",
      categoria: "Hikvision",
      marca: "Hikvision",
      caminho: "VIGI.png",
      descricao: "Guia básico de login, criação de conta e primeiro acesso no aplicativo Hik-Connect.",
      driveUrl: "https://drive.google.com/file/d/1B_1OWKM7-gsyQDg--MRt2Y_pczgWDqM0/view?usp=sharing"
    },
    {
      id: "v-hik-5",
      titulo: "Reiniciar DVR Hikvision",
      categoria: "Hikvision",
      marca: "Hikvision",
      caminho: "VIGI.png",
      descricao: "Procedimento correto de reinicialização do DVR Hikvision através do menu local ou web interface.",
      driveUrl: "https://drive.google.com/file/d/1xl0x7hNpHxPMeZGVnIKJwhX4RHMNaZ8P/view?usp=sharing"
    },
    {
      id: "v-hik-6",
      titulo: "Como Baixar Gravação de Vídeo no Hik-Connect",
      categoria: "Hikvision",
      marca: "Hikvision",
      caminho: "VIGI.png",
      descricao: "Como buscar, selecionar e baixar trechos de gravações diretamente para a memória do celular.",
      driveUrl: "https://drive.google.com/file/d/1KiTbnEBJ6GPoILaAj9S9tPVVThVTk6W9/view?usp=sharing"
    },
    {
      id: "v-hik-7",
      titulo: "Como Utilizar o Aplicativo Hik-Connect",
      categoria: "Hikvision",
      marca: "Hikvision",
      caminho: "VIGI.png",
      descricao: "Manual completo em vídeo de navegação, visualização ao vivo e reprodução no app Hik-Connect.",
      driveUrl: "https://drive.google.com/file/d/12qHaLDsgZq8tXvVEIE8VT1YXzhRbnTrA/view?usp=sharing"
    },
    {
      id: "v-hik-8",
      titulo: "Troca de Senha Hikvision (Vigi Câmeras)",
      categoria: "Hikvision",
      marca: "Hikvision",
      caminho: "VIGI.png",
      descricao: "Vídeo explicativo sobre a política e processo de alteração de senha de dispositivos físicos Hikvision.",
      driveUrl: "https://drive.google.com/file/d/11dUpxFR9JGWXB5F1_xzahcssunQWTn58/view?usp=sharing"
    },
    {
      id: "v-hik-9",
      titulo: "Guia Completo de Utilização do Software iVMS-4200",
      categoria: "Hikvision",
      marca: "Hikvision",
      caminho: "VIGI.png",
      descricao: "Treinamento detalhado para operação, visualização e extração de imagens através do software de monitoramento iVMS-4200.",
      driveUrl: "https://drive.google.com/file/d/1sWJikfGy9S7X5cq35_Wm81PpEQORDT7z/view?usp=sharing"
    },

    // UNIVIEW
    {
      id: "v-unv-1",
      titulo: "Alterar Senha de Login UNV Link",
      categoria: "Uniview",
      marca: "Uniview",
      caminho: "VIGI.png",
      descricao: "Como redefinir ou alterar a credencial de acesso no aplicativo UNV Link para clientes e técnicos.",
      driveUrl: "https://drive.google.com/file/d/1bXVGtuOC3eBUSMMQxnXD8xS8xz2gloGA/view?usp=sharing"
    },
    {
      id: "v-unv-2",
      titulo: "Como Logar no Aplicativo UNV Link",
      categoria: "Uniview",
      marca: "Uniview",
      caminho: "VIGI.png",
      descricao: "Processo de cadastro e login inicial na plataforma de monitoramento em nuvem da Uniview.",
      driveUrl: "https://drive.google.com/file/d/1RQMcCI8qwu6JuKMNZBZxpqTgQ-8k2O_9/view?usp=sharing"
    },
    {
      id: "v-unv-3",
      titulo: "Reiniciar DVR / NVR Uniview",
      categoria: "Uniview",
      marca: "Uniview",
      caminho: "VIGI.png",
      descricao: "Como reiniciar com segurança o gravador da Uniview (UNV) usando o sistema operacional integrado.",
      driveUrl: "https://drive.google.com/file/d/1RRJXnYF_I3O68X7ZKPbW-I-hzNZvkG-p/view?usp=sharing"
    },
    {
      id: "v-unv-4",
      titulo: "Guia de Utilização do Aplicativo UNV Link",
      categoria: "Uniview",
      marca: "Uniview",
      caminho: "VIGI.png",
      descricao: "Tour pelas funcionalidades principais do UNV Link, como visualização em tempo real e reprodução remota.",
      driveUrl: "https://drive.google.com/file/d/1LhjjCDwBVi7JlWOQ-HmYJuIBWqk6PSaA/view?usp=sharing"
    },
    {
      id: "v-unv-5",
      titulo: "Troca de Senha Uniview (Vigi Câmeras)",
      categoria: "Uniview",
      marca: "Uniview",
      caminho: "VIGI.png",
      descricao: "Como alterar a senha administrativa do DVR Uniview localmente de forma segura.",
      driveUrl: "https://drive.google.com/file/d/1xrGWJ8e_e_X7TE2hF7Gw-UWsNXMiZvp-/view?usp=sharing"
    },
    {
      id: "v-unv-6",
      titulo: "Guia Completo de Utilização do EZStation",
      categoria: "Uniview",
      marca: "Uniview",
      caminho: "VIGI.png",
      descricao: "Tutorial avançado sobre operação do software cliente EZStation para gerenciamento de câmeras e DVRs UNV em PCs.",
      driveUrl: "https://drive.google.com/file/d/1gS_Lk7e5u8Ut5VXle2C8rOt_5FgH12H0/view?usp=sharing"
    },

    // MATERIAL - TÉCNICOS
    {
      id: "v-tec-1",
      titulo: "Atualização de Firmware - DVR Hikvision",
      categoria: "Material Técnico",
      marca: "Hikvision",
      caminho: "VIGI.png",
      descricao: "Instruções técnicas para carregamento de firmware e atualização de DVRs Hikvision com segurança.",
      driveUrl: "https://drive.google.com/file/d/1lWQ2ToVeOqlgnuedD22OoV79DNZTE24p/view?usp=sharing"
    },
    {
      id: "v-tec-2",
      titulo: "Atualização de Firmware - DVR Uniview",
      categoria: "Material Técnico",
      marca: "Uniview",
      caminho: "VIGI.png",
      descricao: "Procedimento completo de atualização de firmware em gravadores Uniview usando pendrive ou rede.",
      driveUrl: "https://drive.google.com/file/d/1OHVbavKOUElRfxy9jQpBVZAjs0JQqSyz/view?usp=sharing"
    },
    {
      id: "v-tec-3",
      titulo: "Reset Físico e Configuração de Fábrica - DVR Hikvision",
      categoria: "Material Técnico",
      marca: "Hikvision",
      caminho: "VIGI.png",
      descricao: "Como resetar o DVR Hikvision e refazer a parametrização inicial recomendada pela Vigi Câmeras.",
      driveUrl: "https://drive.google.com/file/d/1SyTikSnxALHtISM7hqkmfb3b86m92Qdy/view?usp=sharing"
    },
    {
      id: "v-tec-4",
      titulo: "Reset Físico e Configuração de Fábrica - DVR Uniview",
      categoria: "Material Técnico",
      marca: "Uniview",
      caminho: "VIGI.png",
      descricao: "Passo a passo para redefinir as configurações do DVR Uniview e estruturar as definições do zero.",
      driveUrl: "https://drive.google.com/file/d/1LIHO9l0y-iYzeqZC3K6iJgSStWzOjv2o/view?usp=sharing"
    },
    {
      id: "v-tec-5",
      titulo: "Como Baixar e Instalar o EZStation",
      categoria: "Material Técnico",
      marca: "Uniview",
      caminho: "VIGI.png",
      descricao: "Link e demonstração de download do instalador oficial do EZStation e processo de instalação no Windows.",
      driveUrl: "https://drive.google.com/file/d/1KF12LVypIxTR8LCjNIJnk2Nt9c1hN2Ua/view?usp=sharing"
    },
    {
      id: "v-tec-6",
      titulo: "Como Baixar e Instalar o iVMS-4200",
      categoria: "Material Técnico",
      marca: "Hikvision",
      caminho: "VIGI.png",
      descricao: "Onde encontrar o iVMS-4200 oficial e os cuidados básicos durante a instalação do software.",
      driveUrl: "https://drive.google.com/file/d/1GiFCbYd0CRqF7f9D7eNBGdei0jHJEWSn/view?usp=sharing"
    }
  ],

  artes: [
    {
      id: "art-1",
      titulo: "Valores Extras",
      caminho: "https://drive.google.com/thumbnail?id=1G9w-bZMtF-v0_fAbi7sFofO6PeMkRlIP&sz=w800",
      categoria: "Tabelas e Valores",
      descricao: "Tabela com os valores de itens e serviços extras disponíveis para clientes VIGI.",
      driveUrl: "https://drive.google.com/file/d/1G9w-bZMtF-v0_fAbi7sFofO6PeMkRlIP/view?usp=drive_link"
    },
    {
      id: "art-2",
      titulo: "Valores Câmeras ColorVu",
      caminho: "https://drive.google.com/thumbnail?id=1SYeNWQbjc2du-SJCaKDLjsO4NNrarHxv&sz=w800",
      categoria: "Informativos e Vendas",
      descricao: "Tabela de preços e modelos das câmeras ColorVu com imagem colorida 24 horas.",
      driveUrl: "https://drive.google.com/file/d/1SYeNWQbjc2du-SJCaKDLjsO4NNrarHxv/view?usp=drive_link"
    },
    {
      id: "art-3",
      titulo: "Planos de Alarme",
      caminho: "https://drive.google.com/thumbnail?id=1nQ_aC2eYmSRxklmfuU5zm9OAg1RNS6pL&sz=w800",
      categoria: "Informativos e Vendas",
      descricao: "Grade dos planos mensais de monitoramento de alarme 24h disponíveis para clientes.",
      driveUrl: "https://drive.google.com/file/d/1nQ_aC2eYmSRxklmfuU5zm9OAg1RNS6pL/view?usp=drive_link"
    },
    {
      id: "art-4",
      titulo: "Planos VIGI Completo",
      caminho: "https://drive.google.com/thumbnail?id=12LBbHX5euX9ZizkthlSHyt2Y4aR3wsm6&sz=w800",
      categoria: "Tabelas e Valores",
      descricao: "Tabela completa de todos os planos e serviços oferecidos pela VIGI Câmeras.",
      driveUrl: "https://drive.google.com/file/d/12LBbHX5euX9ZizkthlSHyt2Y4aR3wsm6/view?usp=drive_link"
    }
  ],

  manuais: [
    {
      id: "man-1",
      titulo: "Procedimento Padrão para Reset e Configuração Básica de DVR",
      categoria: "Gravadores (DVR/NVR)",
      autor: "Engenharia de Suporte VIGI",
      descricao: "Evite retrabalho e o famoso 'jeitinho'. Siga esta lista de verificação passo a passo sempre que resetar um DVR Hikvision ou Uniview.",
      passos: [
        {
          titulo: "1. Reset Físico ou Padrão de Fábrica",
          detalhe: "Acesse o menu Manutenção > Padrão > Restaurar Padrão de Fábrica (Hikvision) ou Manutenção > Sistema > Reset Geral (Uniview). Aguarde o equipamento reiniciar totalmente."
        },
        {
          titulo: "2. Criação de Senha Forte Padrão VIGI",
          detalhe: "Não utilize senhas simples (ex: 12345, admin). Use o padrão da empresa: letras maiúsculas, minúsculas, números e caractere especial (@, #, $). Anote a senha na ficha técnica do cliente."
        },
        {
          titulo: "3. Ajuste de Data, Hora e Fuso Horário",
          detalhe: "Configure o fuso horário para GMT -03:00 (Brasília), ajuste a hora atual e ATIVE o horário de verão, se aplicável. Ative o protocolo NTP apontando para 'a.ntp.br' para sincronização automática."
        },
        {
          titulo: "4. Formatação dos HDs (Muito Importante!)",
          detalhe: "Acesse Armazenamento > Gerenciamento de HD. Selecione o HD instalado e clique em 'Inicializar' ou 'Formatar'. Confirme se o status mudou para 'Normal' e se a gravação está ativa."
        },
        {
          titulo: "5. Configuração de Rede (IP Estático vs DHCP)",
          detalhe: "Sempre configure um IP fixo fora da faixa do DHCP do roteador para o DVR (ex: final .200 ou superior). Defina o DNS primário como 8.8.8.8 e o secundário como 1.1.1.1."
        },
        {
          titulo: "6. Ativação da Nuvem (Hik-Connect / UNV Link)",
          detalhe: "Habilite o serviço de nuvem. Crie o código de verificação/criptografia (anote-o). Confirme se o status aparece como 'Online'. Faça o escaneamento do QR Code no celular do cliente usando o aplicativo oficial."
        },
        {
          titulo: "7. Ajuste de Resolução e Taxa de Quadros (Stream Principal/Sub)",
          detalhe: "Configure a gravação para resolução correta das câmeras. Ajuste o sub-stream para fluidez de dados móveis no celular do cliente (sugestão: CIF ou 2CIF a 10 ou 12 FPS)."
        }
      ],
      videosRelacionados: ["v-tec-3", "v-tec-4", "v-hik-5", "v-unv-3"]
    },
    {
      id: "man-2",
      titulo: "Guia de Atualização de Firmware Sem Riscos",
      categoria: "Manutenção Preventiva",
      autor: "Engenharia de Suporte VIGI",
      descricao: "Atualizações corrigem falhas de segurança e melhoram a estabilidade. Siga o guia para não corromper o equipamento (não dar brick).",
      passos: [
        {
          titulo: "1. Identificar o Modelo Exato",
          detalhe: "Verifique a etiqueta física na parte inferior do DVR ou na aba do sistema. Ex: DS-7208HGHI-M1 (Hikvision) ou NVR301-08LS3 (Uniview). Nunca tente instalar firmware de modelo aproximado."
        },
        {
          titulo: "2. Preparação do Pen Drive",
          detalhe: "Formate o pen drive em sistema de arquivos FAT32 usando um computador. Coloque o arquivo de firmware (.dav ou .bin) na raiz do pendrive (não coloque dentro de pastas)."
        },
        {
          titulo: "3. Alimentação Elétrica Estável",
          detalhe: "NUNCA atualize o DVR sem garantir que ele esteja ligado a um no-break ou fonte de alimentação confiável. Queda de energia durante a atualização queima a placa do gravador permanentemente."
        },
        {
          titulo: "4. Executar a Atualização",
          detalhe: "Insira o pen drive no DVR. Vá em Sistema/Manutenção > Atualizar. Selecione o arquivo e confirme. O processo levará de 3 a 5 minutos e o DVR reiniciará sozinho. NÃO desligue o cabo de energia."
        },
        {
          titulo: "5. Restauração Pós-Atualização (Recomendado)",
          detalhe: "Após atualizar, realize um reset básico para limpar caches antigos e reconfigure as opções conforme o manual de Reset Padrão."
        }
      ],
      videosRelacionados: ["v-tec-1", "v-tec-2"]
    },
    {
      id: "man-3",
      titulo: "SOP: Configuração e Entrega de Central de Alarme Intelbras",
      categoria: "Sistemas de Alarme",
      autor: "Setor de Qualidade VIGI",
      descricao: "Garanta que o cliente saiba operar o sistema e que a central esteja operando sem falhas de comunicação.",
      passos: [
        {
          titulo: "1. Reset Físico e Limpeza de Zonas",
          detalhe: "Realize o reset temporário/físico desligando a bateria e a rede elétrica, mantendo pressionado o botão de reset na placa enquanto religa o equipamento."
        },
        {
          titulo: "2. Cadastro de Senhas de Usuários",
          detalhe: "Configure a Senha Master do cliente e crie senhas individuais para cada membro da casa. Evite senhas fáceis e oriente sobre o sigilo das mesmas."
        },
        {
          titulo: "3. Teste de Sensores Sem Fio e Distâncias",
          detalhe: "Cadastre os sensores. Caminhe até cada ponto instalado, dispare-o e verifique se a central bipou ou reportou corretamente no teclado. Caso haja falha de sinal, mude a posição do sensor ou instale um repetidor."
        },
        {
          titulo: "4. Configuração de Comunicação (GPRS / Ethernet / Wi-Fi)",
          detalhe: "Insira as configurações de IP ou APN do chip de dados (GPRS). Teste o envio de eventos para a central de monitoramento VIGI ou teste a notificação no app do cliente."
        },
        {
          titulo: "5. Teste da Sirene (Com Moderação)",
          detalhe: "Dispare o alarme e confirme a intensidade sonora da sirene. Explique ao cliente o som de disparo e os bipes de ativação/desativação."
        },
        {
          titulo: "6. Treinamento Obrigatório do Usuário Final",
          detalhe: "Ensine o cliente a: ativar o sistema (total e parcial), desativar, visualizar falhas no teclado e utilizar o aplicativo móvel Intelbras."
        }
      ],
      videosRelacionados: ["v-alarme-1", "v-alarme-3"]
    },
    {
      id: "man-4",
      titulo: "Troubleshooting: Câmera Sem Imagem (Perda de Vídeo)",
      categoria: "Manutenção Corretiva",
      autor: "Engenharia de Suporte VIGI",
      descricao: "Passo a passo para diagnóstico rápido quando uma ou mais câmeras perdem o sinal de vídeo no DVR.",
      passos: [
        {
          titulo: "1. Verificação de Alimentação (Fonte)",
          detalhe: "Meça a tensão da fonte principal com um multímetro. Se a voltagem estiver abaixo de 11.5V na chegada da câmera, o infravermelho não vai acionar ou a imagem vai apagar à noite. Troque a fonte ou verifique mau contato no conector P4."
        },
        {
          titulo: "2. Teste de Conectores (BNC/Balun)",
          detalhe: "Refaça as pontas dos conectores BNC ou Baluns tanto no lado do DVR quanto no lado da câmera. Mau contato é a principal causa de perda de vídeo intermitente."
        },
        {
          titulo: "3. Teste em Porta Diferente do DVR",
          detalhe: "Conecte a câmera com defeito em um canal que esteja funcionando perfeitamente no DVR. Se a imagem abrir, o canal anterior do DVR pode estar queimado."
        },
        {
          titulo: "4. Teste com Cabo Auxiliar (Curto)",
          detalhe: "Leve a câmera até o DVR e conecte com um cabo curto de teste (patch cord BNC). Se funcionar, o problema está no cabeamento da infraestrutura do cliente."
        }
      ],
      videosRelacionados: []
    },
    {
      id: "man-5",
      titulo: "Guia de Configuração e Uso do App Hik-Connect",
      categoria: "Aplicativos Mobile",
      autor: "Engenharia de Suporte VIGI",
      descricao: "Procedimentos comuns e resolução de problemas no aplicativo do cliente final para sistemas Hikvision.",
      passos: [
        {
          titulo: "1. Login e Criação de Conta",
          detalhe: "Oriente o cliente a criar uma conta usando e-mail ou telefone. Guarde a senha criada na ordem de serviço. Acesse a conta e faça a leitura do QR Code do DVR."
        },
        {
          titulo: "2. Compartilhamento de Dispositivos",
          detalhe: "Nunca adicione o DVR escaneando o QR Code diretamente no celular de um segundo usuário. O primeiro usuário (Admin) deve compartilhar as câmeras pelo próprio aplicativo para os demais familiares."
        },
        {
          titulo: "3. Desabilitar Modo Tablet",
          detalhe: "Se o aplicativo do cliente estiver com a tela deformada ou ícones fora do lugar, vá em Mais > Configurações e desative a opção 'Modo Tablet'."
        },
        {
          titulo: "4. Busca e Download de Gravações",
          detalhe: "No menu de reprodução, selecione a data e a câmera. Use a ferramenta de 'Tesoura' para cortar o trecho exato e salve. O vídeo ficará na aba 'Imagens e Vídeos' do próprio app, de onde pode ser enviado por WhatsApp."
        }
      ],
      videosRelacionados: ["v-hik-1", "v-hik-2", "v-hik-3", "v-hik-6", "v-hik-7"]
    },
    {
      id: "man-6",
      titulo: "Boas Práticas de Cabeamento e Infraestrutura",
      categoria: "Instalação Física",
      autor: "Engenharia de Suporte VIGI",
      descricao: "Normas básicas para garantir a durabilidade e qualidade da imagem, evitando interferências no CFTV.",
      passos: [
        {
          titulo: "1. Separação de Cabos",
          detalhe: "Nunca passe o cabo de vídeo (coaxial ou UTP) na mesma tubulação de cabos de energia elétrica (110V/220V). O campo magnético da rede elétrica gera interferência, chuviscos e faixas rolando na imagem."
        },
        {
          titulo: "2. Emendas Adequadas",
          detalhe: "Evite emendas no cabo de vídeo. Se for inevitável, utilize conectores BNC fêmea-fêmea (emenda BNC) ou solda bem isolada. Emendas apenas torcidas com fita isolante oxidam rapidamente."
        },
        {
          titulo: "3. Distância Máxima do Cabeamento",
          detalhe: "Para cabos UTP (rede) usando Balun passivo de qualidade, o limite seguro para imagem HD é de 300 metros, e para energia (12V) evite ultrapassar 30 metros para evitar queda de tensão. Use fontes próximas às câmeras se a distância for maior."
        },
        {
          titulo: "4. Isolamento dos Conectores (Caixas de Passagem)",
          detalhe: "Sempre utilize caixas de passagem (condulete ou caixas VBOX) atrás das câmeras. Proteger os conectores balun/BNC da chuva e umidade evita 80% das chamadas de manutenção."
        }
      ],
      videosRelacionados: []
    },
    {
      id: "man-7",
      titulo: "Acesso Web via Navegador (IP Local)",
      categoria: "Redes e Acesso",
      autor: "Engenharia de Suporte VIGI",
      descricao: "Procedimento para acessar as configurações avançadas do DVR através do computador na rede local.",
      passos: [
        {
          titulo: "1. Descobrir o IP do Gravador",
          detalhe: "Conecte o notebook na mesma rede (Wi-Fi ou cabo) do DVR. Use o software SADP (Hikvision) ou EZTools (Uniview) para localizar o IP exato do gravador na rede."
        },
        {
          titulo: "2. Utilizar o Navegador Correto",
          detalhe: "A maioria dos DVRs exige o Microsoft Edge no 'Modo Internet Explorer' para exibir a imagem corretamente e baixar os plugins, ou um navegador atualizado dependendo da versão do firmware."
        },
        {
          titulo: "3. Instalação do Plugin",
          detalhe: "Ao acessar o IP, na tela de login será solicitado o download de um plugin (ex: WebComponents). Baixe, feche o navegador, instale o plugin e abra o navegador novamente."
        },
        {
          titulo: "4. Configurações Avançadas",
          detalhe: "Através do acesso Web é possível configurar eventos inteligentes de vídeo, exportar logs de sistema e ajustar parâmetros de rede que não estão disponíveis no app do celular."
        }
      ],
      videosRelacionados: []
    }
  ],

  slides: [
    {
      id: "slide-1",
      titulo: "CERTIFICAÇÃO TÉCNICA VIGI CÂMERAS",
      subtitulo: "Treinamento de Padronização para Técnicos de Campo",
      tipo: "capa",
      conteudo: [],
      imagens: ["VIDEOS E ARTES/IMAGENS_SLIDES/image1.jpeg"],
      detalhes: "Domínio completo de Redes, CFTV (Hikvision e Uniview), Softwares de Monitoramento e Centrais de Alarme. Siga o padrão de qualidade VIGI e evite retrabalhos."
    },
    {
      id: "slide-2",
      titulo: "SUMÁRIO DO TREINAMENTO",
      subtitulo: "4 Módulos de Excelência Profissional",
      tipo: "summary",
      conteudo: [
        { modulo: "Módulo 1: REDES", desc: "O alicerce de toda instalação IP. Conceitos vitais de roteamento, classes de IP e teste de tráfego de dados para CFTV e Alarme." },
        { modulo: "Módulo 2: CÂMERAS E DVRS", desc: "Domínio sobre o hardware de gravação. Padronização das etapas de setup inicial, garantindo segurança e previsibilidade." },
        { modulo: "Módulo 3: APLICATIVOS PC", desc: "Gestão profissional via software EZ-Station e iVMS-4200. Adicione dispositivos na nuvem e treine o cliente final." },
        { modulo: "Módulo 4: ALARMES", desc: "Instalação de centrais de intrusão, ligação física de sensores, programação de zonas e testes com sirene sem alarmes falsos." }
      ],
      imagens: ["VIDEOS E ARTES/IMAGENS_SLIDES/image10.jpeg"],
      detalhes: "Cada módulo representa um pilar essencial do trabalho do técnico VIGI no dia a dia. A certificação garante que todos usem o mesmo roteiro."
    },
    {
      id: "slide-3",
      titulo: "MÓDULO 1: REDES CFTV",
      subtitulo: "A base de toda comunicação IP",
      tipo: "module",
      conteudo: [
        "Como testar a rede de um DVR usando notebook (ping e acesso local).",
        "Diferença prática entre DHCP (atribuição dinâmica) e IP Fixo.",
        "Ajuste fino de DNS (8.8.8.8 / 1.1.1.1) e Gateway padrão.",
        "Como descobrir a classe de IP da rede local e fixar o IP do DVR na mesma faixa fora do DHCP.",
        "Conexão física correta de cabos em Roteadores e Switches/Hubs."
      ],
      imagens: ["VIDEOS E ARTES/IMAGENS_SLIDES/image11.png", "VIDEOS E ARTES/IMAGENS_SLIDES/image12.png", "VIDEOS E ARTES/IMAGENS_SLIDES/image13.png"],
      detalhes: "Problemas de visualização remota em 90% das vezes são falhas de configuração de rede básica do DVR. Sempre fixe o IP corretamante!"
    },
    {
      id: "slide-4",
      titulo: "MÓDULO 2: DVRs UNIVIEW",
      subtitulo: "Configuração Padrão UNV",
      tipo: "module",
      conteudo: [
        "Modelos Padrão: Séries F e Q3 (de 2 a 16 Canais).",
        "Setup inicial passo a passo e ativação de segurança.",
        "Configuração de Gravação: Stream principal (alta qualidade para o HD) e sub-stream (otimizado para 3G/4G no celular).",
        "Ativação de gravação por Movimento para economizar HD e facilitar buscas.",
        "Reset e inicialização do sistema operacional integrado."
      ],
      imagens: ["VIDEOS E ARTES/IMAGENS_SLIDES/image14.png", "VIDEOS E ARTES/IMAGENS_SLIDES/image15.png", "VIDEOS E ARTES/IMAGENS_SLIDES/image16.png"],
      detalhes: "A Uniview é reconhecida por sua estabilidade na nuvem. Siga a risca o procedimento padrão para inicializar o NVR/DVR."
    },
    {
      id: "slide-5",
      titulo: "MÓDULO 2: DVRs HIKVISION",
      subtitulo: "Configuração Padrão Hikvision & HiLook",
      tipo: "module",
      conteudo: [
        "Modelos M1 Hikvision Branco / Preto (com SSD embutido).",
        "Modelos M1 HiLook Branco / Preto (com SSD embutido).",
        "Passo a passo da ativação do DVR e definição da senha de administrador.",
        "Configuração de Gravação contínua vs. Detecção de Movimento (Smart Motion).",
        "Configuração de filtros inteligentes de humanos e veículos (evita disparos falsos)."
      ],
      imagens: ["VIDEOS E ARTES/IMAGENS_SLIDES/image17.png", "VIDEOS E ARTES/IMAGENS_SLIDES/image18.png"],
      detalhes: "Os gravadores com SSD embutido (série eDVR) possuem alto desempenho acústico e durabilidade, mas requerem atenção na configuração de compressão."
    },
    {
      id: "slide-6",
      titulo: "CHECKLIST DE EXECUÇÃO - DVR",
      subtitulo: "O que você não pode esquecer de fazer?",
      tipo: "questions",
      conteudo: [
        "Formatação do Disco: O disco novo ou SSD sempre deve ser inicializado antes de fechar o DVR.",
        "Troca de Disco: Como identificar barulhos ou lentidões no sistema que indicam falha física de HD.",
        "Configurar Áudio: Como habilitar nas câmeras com microfone embutido (mudar Stream de 'Vídeo' para 'Vídeo e Áudio').",
        "Atualização de Firmware: Quando e como fazer para corrigir falhas de nuvem ou bugs de interface."
      ],
      imagens: ["VIDEOS E ARTES/IMAGENS_SLIDES/image19.png", "VIDEOS E ARTES/IMAGENS_SLIDES/image20.png"],
      detalhes: "Antes de sair da casa do cliente, faça o checklist completo. O retrabalho custa caro e afeta nossa credibilidade."
    },
    {
      id: "slide-7",
      titulo: "MÓDULO 3: APLICATIVOS DE PC",
      subtitulo: "EZ-Station (Uniview) & iVMS-4200 (Hikvision)",
      tipo: "module",
      conteudoUniview: [
        "Como instalar o aplicativo.",
        "Como configurar um DVR por IP para acessar.",
        "Como configurar um DVR por cloud para acessar de outro local.",
        "Como configurar o aplicativo para ficar com a imagem melhor.",
        "Como utilizar o aplicativo.",
        "Dúvidas pertinentes dos clientes.",
        "Ajustar resolução de gravação (alguns casos)."
      ],
      conteudoHikvision: [
        "Como instalar o aplicativo.",
        "Como baixar extensão em português-BR.",
        "Como configurar um DVR por IP para acessar.",
        "Como configurar um DVR por cloud para acessar de outro local.",
        "Como utilizar o aplicativo.",
        "Dúvidas pertinentes dos clientes.",
        "Como ajustar em situações que o aplicativo fica somente carregando (BUG)."
      ],
      imagens: ["VIDEOS E ARTES/IMAGENS_SLIDES/image21.png", "VIDEOS E ARTES/IMAGENS_SLIDES/image22.png"],
      detalhes: "Oferecer o app de PC configurado para clientes comerciais e portarias é um grande diferencial do serviço VIGI."
    },
    {
      id: "slide-8",
      titulo: "MÓDULO 4: SISTEMAS DE ALARME",
      subtitulo: "Configuração e Instalação Física",
      tipo: "module",
      conteudo: [
        "Modelos: Com fio (resistores de fim de linha), Sem fio (pareamento RF).",
        "Sensores de Abertura (magnéticos) e Presença (infravermelho passivo - IVP).",
        "Ligação da bateria da central: cuidados com voltagem, amperagem e carga de flutuação.",
        "Configuração e particionamento de zonas de alarme no teclado.",
        "Configuração do aplicativo móvel Intelbras (AMT Mobile V3) e cadastro de controles remotos."
      ],
      imagens: ["VIDEOS E ARTES/IMAGENS_SLIDES/image23.png", "VIDEOS E ARTES/IMAGENS_SLIDES/image24.png", "VIDEOS E ARTES/IMAGENS_SLIDES/image25.png"],
      detalhes: "Central de alarme mal instalada causa disparos falsos de madrugada. Posicione os sensores longe de correntes de ar e portas soltas."
    },
    {
      id: "slide-9",
      titulo: "O NOVO PORTAL TÉCNICO VIGI",
      subtitulo: "Nossa Ferramenta contra o 'Jeitinho'",
      tipo: "module",
      conteudo: [
        "Central de Vídeos: Acesse tutoriais curtos direto de seu celular em campo.",
        "Artes e Tabelas: Consulte preços e modelos de câmeras em segundos na residência do cliente.",
        "Guias e Manuais: Siga a lista de verificação passo a passo para padronizar o serviço.",
        "Solicitação de Materiais: Peça novos vídeos ou manuais sempre que sentir necessidade."
      ],
      imagens: ["VIDEOS E ARTES/IMAGENS_SLIDES/image9.jpeg"],
      detalhes: "Mantenha o portal aberto no seu celular. É a VIGI facilitando o seu dia de trabalho e garantindo suporte instantâneo."
    },
    {
      id: "slide-10",
      titulo: "COM VIGI, EU FICO DE BOA!",
      subtitulo: "Treinamento Concluído com Sucesso",
      tipo: "ending",
      conteudo: [],
      imagens: [],
      detalhes: "Parabéns por concluir o roteiro de capacitação técnica! Agora coloque em prática a padronização e ajude a manter nosso material sempre atualizado. Bom trabalho em campo!"
    }
  ]
};

