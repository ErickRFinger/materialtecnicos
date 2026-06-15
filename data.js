// Banco de dados de materiais do Portal VIGI
const VIGI_DATA = {
  videos: [
    // ALARME
    {
      id: "v-alarme-1",
      titulo: "Configurar Aplicativo de Alarme",
      categoria: "Alarme",
      marca: "Intelbras",
      caminho: "VIDEOS E ARTES/ALARME/Configurar aplicativo Alarme.mp4",
      descricao: "Tutorial detalhado para configuração inicial e pareamento do aplicativo de alarme no smartphone do cliente."
    },
    {
      id: "v-alarme-2",
      titulo: "Reiniciar Central de Alarme Intelbras (Modelo Antigo)",
      categoria: "Alarme",
      marca: "Intelbras",
      caminho: "VIDEOS E ARTES/ALARME/REINICIAR CENTRAL DE ALARME INTELBRAS antigo.mp4",
      descricao: "Procedimento passo a passo para reinicialização física e lógica das centrais de alarme Intelbras de modelos legados."
    },
    {
      id: "v-alarme-3",
      titulo: "Reiniciar Central de Alarme",
      categoria: "Alarme",
      marca: "Intelbras",
      caminho: "VIDEOS E ARTES/ALARME/Reiniciar Central de Alarme.mp4",
      descricao: "Como reiniciar com segurança a central de alarme padrão para restabelecimento de sinal ou limpeza de falhas."
    },

    // HIKVISION
    {
      id: "v-hik-1",
      titulo: "Alterar Senha de Login Hik-Connect",
      categoria: "Hikvision",
      marca: "Hikvision",
      caminho: "VIDEOS E ARTES/HIKVISION/ALTERAR SENHA DE LOGIN HIKCONNECT.mp4",
      descricao: "Como proceder com a redefinição ou alteração de senha de uma conta no aplicativo Hik-Connect."
    },
    {
      id: "v-hik-2",
      titulo: "Como Aceitar Compartilhamento no Aplicativo Hik-Connect",
      categoria: "Hikvision",
      marca: "Hikvision",
      caminho: "VIDEOS E ARTES/HIKVISION/COMO ACEITAR NO APLICATIVO HIK (1).mp4",
      descricao: "Demonstração prática de como o cliente final aceita o compartilhamento de câmeras enviado pelo técnico."
    },
    {
      id: "v-hik-3",
      titulo: "Desabilitar Modo Tablet no Aplicativo Hik-Connect",
      categoria: "Hikvision",
      marca: "Hikvision",
      caminho: "VIDEOS E ARTES/HIKVISION/COMO DESABILTAR MODO TABLET NO APLICATIVO.mp4",
      descricao: "Como desativar a visualização em modo tablet para normalizar a interface em smartphones."
    },
    {
      id: "v-hik-4",
      titulo: "Como Logar no Hik-Connect",
      categoria: "Hikvision",
      marca: "Hikvision",
      caminho: "VIDEOS E ARTES/HIKVISION/LOGAR HIKCONNECT.mp4",
      descricao: "Guia básico de login, criação de conta e primeiro acesso no aplicativo Hik-Connect."
    },
    {
      id: "v-hik-5",
      titulo: "Reiniciar DVR Hikvision",
      categoria: "Hikvision",
      marca: "Hikvision",
      caminho: "VIDEOS E ARTES/HIKVISION/Reiniciar DVR HIK.mp4",
      descricao: "Procedimento correto de reinicialização do DVR Hikvision através do menu local ou web interface."
    },
    {
      id: "v-hik-6",
      titulo: "Como Baixar Gravação de Vídeo no Hik-Connect",
      categoria: "Hikvision",
      marca: "Hikvision",
      caminho: "VIDEOS E ARTES/HIKVISION/VIDEO COMO BAIXAR UMA GRAVAÇÃO  NO HIKCONNECT - VIGI.mp4",
      descricao: "Como buscar, selecionar e baixar trechos de gravações diretamente para a memória do celular."
    },
    {
      id: "v-hik-7",
      titulo: "Como Utilizar o Aplicativo Hik-Connect",
      categoria: "Hikvision",
      marca: "Hikvision",
      caminho: "VIDEOS E ARTES/HIKVISION/VIDEO COMO USAR O APLICATIVO HIKCONNECT - VIGI.mp4",
      descricao: "Manual completo em vídeo de navegação, visualização ao vivo e reprodução no app Hik-Connect."
    },
    {
      id: "v-hik-8",
      titulo: "Troca de Senha Hikvision (Vigi Câmeras)",
      categoria: "Hikvision",
      marca: "Hikvision",
      caminho: "VIDEOS E ARTES/HIKVISION/VÍDEO 2 - Tutorial para Troca de Senha HIK - Vigi Câmeras.mp4",
      descricao: "Vídeo explicativo sobre a política e processo de alteração de senha de dispositivos físicos Hikvision."
    },
    {
      id: "v-hik-9",
      titulo: "Guia Completo de Utilização do Software iVMS-4200",
      categoria: "Hikvision",
      marca: "Hikvision",
      caminho: "VIDEOS E ARTES/HIKVISION/VÍDEO EXPLICATIVO_Utilização IVMS.mp4",
      descricao: "Treinamento detalhado para operação, visualização e extração de imagens através do software de monitoramento iVMS-4200."
    },

    // UNIVIEW
    {
      id: "v-unv-1",
      titulo: "Alterar Senha de Login UNV Link",
      categoria: "Uniview",
      marca: "Uniview",
      caminho: "VIDEOS E ARTES/UNIVIEW/ALTERAR SENHA DE LOGIN UNV LINK.mp4",
      descricao: "Como redefinir ou alterar a credencial de acesso no aplicativo UNV Link para clientes e técnicos."
    },
    {
      id: "v-unv-2",
      titulo: "Como Logar no Aplicativo UNV Link",
      categoria: "Uniview",
      marca: "Uniview",
      caminho: "VIDEOS E ARTES/UNIVIEW/LOGAR UNV LINK.mp4",
      descricao: "Processo de cadastro e login inicial na plataforma de monitoramento em nuvem da Uniview."
    },
    {
      id: "v-unv-3",
      titulo: "Reiniciar DVR / NVR Uniview",
      categoria: "Uniview",
      marca: "Uniview",
      caminho: "VIDEOS E ARTES/UNIVIEW/Reiniciar DVR  UNV.mp4",
      descricao: "Como reiniciar com segurança o gravador da Uniview (UNV) usando o sistema operacional integrado."
    },
    {
      id: "v-unv-4",
      titulo: "Guia de Utilização do Aplicativo UNV Link",
      categoria: "Uniview",
      marca: "Uniview",
      caminho: "VIDEOS E ARTES/UNIVIEW/VIDEO EXPLICATIVO UTILIZAÇÃO UNV LINK.mp4",
      descricao: "Tour pelas funcionalidades principais do UNV Link, como visualização em tempo real e reprodução remota."
    },
    {
      id: "v-unv-5",
      titulo: "Troca de Senha Uniview (Vigi Câmeras)",
      categoria: "Uniview",
      marca: "Uniview",
      caminho: "VIDEOS E ARTES/UNIVIEW/VÍDEO 1 - Tutorial para Troca de Senha UNV - Vigi Câmeras.mp4",
      descricao: "Como alterar a senha administrativa do DVR Uniview localmente de forma segura."
    },
    {
      id: "v-unv-6",
      titulo: "Guia Completo de Utilização do EZStation",
      categoria: "Uniview",
      marca: "Uniview",
      caminho: "VIDEOS E ARTES/UNIVIEW/VÍDEO EXPLICATIVO_Utilização EZ Station.mp4",
      descricao: "Tutorial avançado sobre operação do software cliente EZStation para gerenciamento de câmeras e DVRs UNV em PCs."
    },

    // MATERIAL - TÉCNICOS
    {
      id: "v-tec-1",
      titulo: "Atualização de Firmware - DVR Hikvision",
      categoria: "Material Técnico",
      marca: "Hikvision",
      caminho: "VIDEOS E ARTES/MATERIAL - TÉCNICOS/Atualizar DVR HIK.mp4",
      descricao: "Instruções técnicas para carregamento de firmware e atualização de DVRs Hikvision com segurança."
    },
    {
      id: "v-tec-2",
      titulo: "Atualização de Firmware - DVR Uniview",
      categoria: "Material Técnico",
      marca: "Uniview",
      caminho: "VIDEOS E ARTES/MATERIAL - TÉCNICOS/Atualizar DVR UNV.mp4",
      descricao: "Procedimento completo de atualização de firmware em gravadores Uniview usando pendrive ou rede."
    },
    {
      id: "v-tec-3",
      titulo: "Reset Físico e Configuração de Fábrica - DVR Hikvision",
      categoria: "Material Técnico",
      marca: "Hikvision",
      caminho: "VIDEOS E ARTES/MATERIAL - TÉCNICOS/Resetar e configurar DVR HIK.mp4",
      descricao: "Como resetar o DVR Hikvision e refazer a parametrização inicial recomendada pela Vigi Câmeras."
    },
    {
      id: "v-tec-4",
      titulo: "Reset Físico e Configuração de Fábrica - DVR Uniview",
      categoria: "Material Técnico",
      marca: "Uniview",
      caminho: "VIDEOS E ARTES/MATERIAL - TÉCNICOS/Resetar e configurar DVR UNV.mp4",
      descricao: "Passo a passo para redefinir as configurações do DVR Uniview e estruturar as definições do zero."
    },
    {
      id: "v-tec-5",
      titulo: "Como Baixar e Instalar o EZStation",
      categoria: "Material Técnico",
      marca: "Uniview",
      caminho: "VIDEOS E ARTES/MATERIAL - TÉCNICOS/VÍDEO_Como Baixar e Instalar o EZStation.mp4",
      descricao: "Link e demonstração de download do instalador oficial do EZStation e processo de instalação no Windows."
    },
    {
      id: "v-tec-6",
      titulo: "Como Baixar e Instalar o iVMS-4200",
      categoria: "Material Técnico",
      marca: "Hikvision",
      caminho: "VIDEOS E ARTES/MATERIAL - TÉCNICOS/VÍDEO_Como Baixar e Instalar o IVMS.mp4",
      descricao: "Onde encontrar o iVMS-4200 oficial e os cuidados básicos durante a instalação do software."
    }
  ],

  artes: [
    {
      id: "art-1",
      titulo: "Acréscimos de Valor por Modelo de Câmeras",
      caminho: "VIDEOS E ARTES/ARTES CÂMERAS/ACRÉSCIMOS DE VALOR POR MODELO DE CÂMERAS.png",
      categoria: "Tabelas e Valores",
      descricao: "Tabela informativa detalhando os valores adicionais cobrados de acordo com o modelo de câmera escolhido pelo cliente."
    },
    {
      id: "art-2",
      titulo: "Câmeras ColorVu - Vantagens e Modelos",
      caminho: "VIDEOS E ARTES/ARTES CÂMERAS/CAMERAS COLOR VU.png",
      categoria: "Informativos e Vendas",
      descricao: "Material demonstrativo sobre a tecnologia ColorVu (colorido 24 horas) para apoiar o técnico no argumento de venda ou explicação."
    },
    {
      id: "art-3",
      titulo: "Câmeras com Acréscimo (Modelos Especiais)",
      caminho: "VIDEOS E ARTES/ARTES CÂMERAS/CAMERAS COM ACRESCIMO.png",
      categoria: "Tabelas e Valores",
      descricao: "Lista rápida de câmeras especiais que possuem variação de custo para instalação ou upgrade."
    },
    {
      id: "art-4",
      titulo: "Catálogo de Câmeras e Alarmes",
      caminho: "VIDEOS E ARTES/ARTES CÂMERAS/CAMERAS E ALARMES.png",
      categoria: "Informativos e Vendas",
      descricao: "Arte institucional que ilustra os equipamentos de câmeras e sensores de alarme disponíveis."
    },
    {
      id: "art-5",
      titulo: "Câmeras Infravermelho Convencionais",
      caminho: "VIDEOS E ARTES/ARTES CÂMERAS/CAMERAS INFRA VERMELHO.png",
      categoria: "Informativos e Vendas",
      descricao: "Especificações e ilustrações de câmeras com infravermelho comum para monitoramento noturno padrão."
    },
    {
      id: "art-6",
      titulo: "Itens de Venda VIGI - Parte 1",
      caminho: "VIDEOS E ARTES/ARTES CÂMERAS/ITENS VENDA VIGI 1.png",
      categoria: "Tabelas e Valores",
      descricao: "Tabela de itens adicionais, acessórios, cabos, caixas de proteção e conectores disponíveis para venda rápida."
    },
    {
      id: "art-7",
      titulo: "Itens de Venda VIGI - Parte 2",
      caminho: "VIDEOS E ARTES/ARTES CÂMERAS/ITENS VENDA VIGI 2.png",
      categoria: "Tabelas e Valores",
      descricao: "Complemento da tabela de produtos, licenças de software, suportes e serviços extras prestados no campo."
    },
    {
      id: "art-8",
      titulo: "Planos de Monitoramento de Alarme",
      caminho: "VIDEOS E ARTES/ARTES CÂMERAS/PLANOS ALARME.jpeg",
      categoria: "Informativos e Vendas",
      descricao: "Grade de planos mensais de monitoramento de alarme 24h, essencial para o técnico apresentar na residência/empresa."
    },
    {
      id: "art-9",
      titulo: "Valores de Sensores de Alarme Sem Fio",
      caminho: "VIDEOS E ARTES/ARTES CÂMERAS/VALORES SENSORES DE ALARME SEM FIO.png",
      categoria: "Tabelas e Valores",
      descricao: "Tabela de custos de sensores sem fio (magnéticos, presença, barreira) para adição rápida a projetos."
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

