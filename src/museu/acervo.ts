import type { Item } from './tipos'
import { lazy } from 'react'

/**
 * As peças chegam sob demanda.
 *
 * Com import direto, abrir a entrada baixava as 21 salas de uma vez — e o
 * acervo só cresce. Assim o visitante baixa a moldura, e cada peça vem
 * quando ele entra nela. O `Suspense` em App.tsx mostra a espera.
 */
const Cartao = lazy(() => import('../salas/Cartao').then((m) => ({ default: m.Cartao })))
const Telex = lazy(() => import('../salas/Telex').then((m) => ({ default: m.Telex })))
const Bbs = lazy(() => import('../salas/Bbs').then((m) => ({ default: m.Bbs })))
const Paginas = lazy(() => import('../salas/Paginas').then((m) => ({ default: m.Paginas })))
const Win95 = lazy(() => import('../salas/Win95').then((m) => ({ default: m.Win95 })))
const Mirc = lazy(() => import('../salas/Mirc').then((m) => ({ default: m.Mirc })))
const Icq = lazy(() => import('../salas/Icq').then((m) => ({ default: m.Icq })))
const Celular = lazy(() => import('../salas/Celular').then((m) => ({ default: m.Celular })))
const Winxp = lazy(() => import('../salas/Winxp').then((m) => ({ default: m.Winxp })))
const P2p = lazy(() => import('../salas/P2p').then((m) => ({ default: m.P2p })))
const Flash = lazy(() => import('../salas/Flash').then((m) => ({ default: m.Flash })))
const Lanhouse = lazy(() => import('../salas/Lanhouse').then((m) => ({ default: m.Lanhouse })))
const Blogs = lazy(() => import('../salas/Blogs').then((m) => ({ default: m.Blogs })))
const Fotolog = lazy(() => import('../salas/Fotolog').then((m) => ({ default: m.Fotolog })))
const Youtube = lazy(() => import('../salas/Youtube').then((m) => ({ default: m.Youtube })))
const Videotexto = lazy(() => import('../salas/Videotexto').then((m) => ({ default: m.Videotexto })))
const Fita = lazy(() => import('../salas/Fita').then((m) => ({ default: m.Fita })))
const Dos = lazy(() => import('../salas/Dos').then((m) => ({ default: m.Dos })))
const Discada = lazy(() => import('../salas/Discada').then((m) => ({ default: m.Discada })))
const Msn = lazy(() => import('../salas/Msn').then((m) => ({ default: m.Msn })))
const Orkut = lazy(() => import('../salas/Orkut').then((m) => ({ default: m.Orkut })))


/**
 * O acervo. Cada peça nova é um objeto a mais nesta lista — por isso o museu
 * nunca fica "pela metade": ele só tem salas a menos.
 *
 * Datas e números vêm das fontes listadas em cada peça, não de memória. Onde
 * não foi possível confirmar, a plaquinha não afirma.
 *
 * As peças em restauração são as que ainda não existem. Ficam visíveis de
 * propósito: mostram o recorte que o acervo pretende cobrir e deixam o
 * visitante ver o museu crescendo. Museu de verdade tem ala em obra.
 */
export const ACERVO: Item[] = [
  {
    id: 'cartao',
    cor: '#e8dcb8',
    ordem: 1970,
    era: 'antes-do-micro',
    estado: 'aberta',
    Peca: Cartao,
    placa: {
      nome: 'O cartão perfurado',
      anos: 'do fim do século XIX aos anos 80',
      oQueEra:
        'Antes de teclado e tela, o programa era um maço de cartões de papel. Cada cartão guardava uma linha — 80 caracteres, nem um a mais. Você levava o maço ao centro de processamento, deixava lá e voltava horas depois para buscar a listagem impressa. Se tivesse errado uma vírgula, repetia tudo.',
      porQueEraAssim:
        'Cada coluna guarda um caractere, e o caractere é a posição dos furos naquela coluna. São doze linhas: três de zona (12, 11 e 0) e nove numeradas. Letras de A a I usam a zona 12, de J a R a zona 11, de S a Z a zona 0 — e repare que o S começa na linha 2, porque sobravam só oito letras para a última zona. Não havia minúscula nem acento: a perfuradora simplesmente não tinha a tecla.',
      comoTerminou:
        'Foi substituído pela fita magnética e depois pelo disco, ao longo dos anos 70 e 80. Guardar dados em papel furado passou a ser lento, volumoso e frágil — bastava derrubar o maço para perder a ordem das linhas. Em algumas aplicações específicas resistiu até o fim do século XX.',
      legado:
        'O limite de 80 colunas, que virou a largura dos terminais e de lá foi para os guias de estilo de programação — muito projeto ainda hoje quebra a linha aos 80 caracteres. Sobreviveu também a ideia de processar em lote: você entrega o trabalho, vai embora e busca o resultado depois. É assim que funciona qualquer fila de processamento na nuvem.',
      curiosidade:
        'A ideia é de Herman Hollerith e nasceu de um problema de prazo: o censo americano de 1880 levou quase oito anos para ser apurado à mão, e o de 1890 corria o risco de não ficar pronto antes do seguinte. Com os cartões e as máquinas de tabular que ele criou, a apuração caiu para cerca de um ano. A empresa que Hollerith fundou para vendê-las viria a se chamar IBM.',
    },
    fontes: [
      { titulo: 'Cartão perfurado — Wikipédia', url: 'https://pt.wikipedia.org/wiki/Cart%C3%A3o_perfurado' },
      { titulo: 'Cartão perfurado — Museu de Tecnologia da Unoeste', url: 'https://sites.unoeste.br/museu/cartao-perfurado/' },
    ],
  },
  {
    id: 'telex',
    cor: '#f0a850',
    ordem: 1975,
    era: 'antes-do-micro',
    estado: 'aberta',
    Peca: Telex,
    placa: {
      nome: 'Telex',
      anos: 'Rede Nacional da Embratel, de 1975 ao início dos anos 90',
      oQueEra:
        'A rede que fazia o comércio funcionar antes do fax e do e-mail. Você datilografava a mensagem e ela saía impressa, na hora, numa máquina do outro lado do país. Pedido, confirmação de embarque, fechamento de câmbio: tudo passava por ali, e tinha valor de documento.',
      porQueEraAssim:
        'Cada caractere cabia em cinco bits. Cinco bits dão 32 combinações — não cabem 26 letras mais 10 dígitos mais pontuação. A saída foi manter duas tabelas sobre os mesmos códigos e alternar entre elas com dois comandos: LTRS para letras, FIGS para números. É por isso que telex era tudo em maiúscula: não sobrava espaço para minúsculas.',
      comoTerminou:
        'O fax tomou o lugar primeiro, o e-mail depois. O declínio começou entre 1988 e 1989 e no início dos anos 90 a rede foi desativada, substituída pela Renpac, também da Embratel.',
      legado:
        'A ideia de que a máquina se identifica sozinha para provar quem é — hoje chamamos isso de certificado e assinatura digital. E o número de telex foi o primeiro endereço que uma empresa teve sem ser o endereço físico dela.',
      curiosidade:
        'Toda máquina tinha uma resposta automática gravada num tamborzinho mecânico: ao receber o comando WRU, "quem é você", ela se identificava sozinha. Era a prova de que a mensagem chegou na máquina certa — assinatura eletrônica décadas antes do termo existir. A rede saltou de 4.060 terminais para 65.500 ao longo dos anos 70 e 80.',
    },
    fontes: [
      { titulo: 'Embratel, seu começo e seu fim — Mobile Time', url: 'https://www.mobiletime.com.br/museu-movel/11/04/2025/comeco-e-fim-embratel/' },
      { titulo: 'Telecomunicações Brasileiras S.A. — Wikipédia', url: 'https://pt.wikipedia.org/wiki/Telecomunica%C3%A7%C3%B5es_Brasileiras_S.A.' },
    ],
  },
  {
    id: 'videotexto',
    cor: '#ffff00',
    ordem: 1982,
    era: 'micro-em-casa',
    estado: 'aberta',
    Peca: Videotexto,
    placa: {
      nome: 'Videotexto',
      anos: '1982 – 2003',
      oQueEra:
        'A pré-internet brasileira. Você comprava um kit da Telesp com modem e teclado, ligava na televisão, e um técnico da companhia telefônica ia até sua casa instalar. Dava para ver notícias, previsão do tempo, saldo do banco, classificados e mandar mensagem — tudo em páginas numeradas.',
      porQueEraAssim:
        'A página chegava pela linha telefônica a 1200 bits por segundo, e você via o texto sendo pintado na tela caractere por caractere. Não havia como mandar imagem: os desenhos eram feitos com blocos coloridos, numa paleta de oito cores puras. A navegação era por número de página porque digitar três dígitos custava menos que transmitir um menu inteiro.',
      comoTerminou:
        'A internet comercial chegou ao Brasil em 1995 e oferecia o mesmo por menos. Ainda assim o videotexto resistiu bastante: só foi desligado pela Telefônica em novembro de 2003 — sobreviveu até a era da banda larga.',
      legado:
        'O banco na tela. Consultar saldo e pagar conta sem ir à agência começou ali, e hoje é o aplicativo mais aberto no celular do brasileiro. A navegação por número sobreviveu inteira no atendimento por telefone: digite 1 para, digite 2 para.',
      curiosidade:
        'A Telesp adaptou o sistema francês ANTIOPE, mas fez uma troca decisiva: enquanto na França o acesso era por terminais dedicados, aqui usaram microcomputadores com modem. Começou em 1982 com 1.500 usuários voluntários e 300 serviços, e virou comercial no fim de 1984.',
    },
    fontes: [
      { titulo: 'Videotexto: o serviço visionário que antecedeu a internet — Aventuras na História', url: 'https://aventurasnahistoria.com.br/noticias/reportagem/videotexto-historia-do-servico-visionario-que-antecedeu-a-internet.phtml' },
      { titulo: 'Videotexto começa no Brasil — Revista Micro Sistemas, 1982', url: 'https://museucapixaba.com.br/memoria/artigos/videotexto-comeca-no-brasil-revista-micro-sistemas-1982/' },
    ],
  },
  {
    id: 'fita',
    cor: '#7b88e0',
    ordem: 1985,
    era: 'micro-em-casa',
    estado: 'aberta',
    Peca: Fita,
    placa: {
      nome: 'A fita cassete',
      anos: 'MSX brasileiro, a partir de 1985',
      oQueEra:
        'Programas e jogos eram guardados em fita cassete comum, a mesma de música. Você apertava play no gravador, o computador escutava, e depois de alguns minutos o jogo estava na memória. Se alguém falasse alto perto do gravador, podia dar erro.',
      porQueEraAssim:
        'Disquete era caro demais para o mercado doméstico, e toda casa já tinha um gravador. A solução foi transformar dados em som audível: bit 0 é um ciclo de 1200 Hz, bit 1 são dois ciclos de 2400 Hz. Os dois duram exatamente o mesmo tempo — foi assim que fizeram funcionar em gravador doméstico, que nunca girava na velocidade certa.',
      comoTerminou:
        'Saiu por lentidão. A 1200 bauds, cerca de 109 bytes por segundo, um jogo de 32 KB levava uns cinco minutos — e podia falhar no fim. O disquete barateou, depois veio o CD-ROM, e a fita virou lembrança.',
      legado:
        'A barra de carregamento. Ficar olhando uma marca avançar nasceu quando não havia mais nada a fazer enquanto a fita rodava. E a fita era regravável: foi o primeiro objeto doméstico em que apagar era tão fácil quanto guardar.',
      curiosidade:
        'O MSX brasileiro nasceu da reserva de mercado, a Lei 7.232 de outubro de 1984. O Hotbit da Sharp e o Expert da Gradiente foram apresentados em 23 de setembro de 1985, na V Feira Internacional de Informática. Eram registrados como videogames para aproveitar os incentivos da Zona Franca de Manaus. Foram cerca de 400 mil máquinas.',
    },
    fontes: [
      { titulo: 'Os microcomputadores MSX HotBit e Expert de 1985 — Museu Capixaba do Computador', url: 'https://museucapixaba.com.br/hoje/microcomputadores-msx-hotbit-e-expert-de-1985/' },
      { titulo: 'Política Nacional de Informática — Wikipédia', url: 'https://pt.wikipedia.org/wiki/Pol%C3%ADtica_Nacional_de_Inform%C3%A1tica' },
    ],
  },
  {
    id: 'dos',
    cor: '#c8c8c8',
    ordem: 1993,
    era: 'internet-chega',
    estado: 'aberta',
    Peca: Dos,
    placa: {
      nome: 'MS-DOS',
      anos: 'o computador de casa nos anos 90',
      oQueEra:
        'Não havia ícone, mouse nem janela. Havia um traço piscando esperando você digitar. Para abrir qualquer coisa era preciso saber o nome exato do programa e onde ele estava.',
      porQueEraAssim:
        'Os nomes de arquivo eram limitados a oito caracteres mais três de extensão, herança do sistema FAT — daí "RELATO~1.DOC" e todos aqueles nomes truncados. E havia a barreira dos 640 KB: o processador em modo real só endereçava 1 MB, e a IBM reservou os 384 KB de cima para memória de vídeo, BIOS e periféricos. Sobraram 640 KB para os programas, por mais RAM que a máquina tivesse. Digite MEM nesta sala para ver.',
      comoTerminou:
        'O Windows 95 escondeu tudo isso atrás de ícones. O DOS não sumiu de vez: continuou embaixo do Windows por anos, e o prompt de comando existe até hoje.',
      legado:
        'A linha de comando, que nunca morreu e voltou ao centro do trabalho de quem programa. E o ponto separando nome e extensão, que continua sendo como o computador sabe o que é cada arquivo.',
      curiosidade:
        'A barreira dos 640 KB criou um ritual doméstico. Como os jogos eram o que mais exigia memória e simplesmente ignoravam qualquer coisa acima dos 640 KB, era preciso liberar espaço ali embaixo — carregando driver em memória alta com DEVICEHIGH e LOADHIGH. Gente que nunca programou na vida aprendeu a editar CONFIG.SYS e AUTOEXEC.BAT só para um jogo abrir. Era otimização de sistema feita por adolescente, na sala de casa.',
    },
    fontes: [
      { titulo: 'Conventional memory — Wikipedia', url: 'https://en.wikipedia.org/wiki/Conventional_memory' },
      { titulo: 'The 640 K Barrier — The Digital Antiquarian', url: 'https://www.filfre.net/2017/04/the-640-k-barrier/' },
      { titulo: '8.3 filename — Wikipedia', url: 'https://en.wikipedia.org/wiki/8.3_filename' },
    ],
  },
  {
    id: 'discada',
    cor: '#33ff66',
    ordem: 1994,
    era: 'internet-chega',
    estado: 'aberta',
    Peca: Discada,
    placa: {
      nome: 'A discagem',
      anos: 'no Brasil, do início dos anos 90 a meados dos 2000',
      oQueEra:
        'Para entrar na internet, seu computador fazia uma ligação telefônica. Enquanto você navegava, o telefone de casa ficava ocupado — e qualquer um que tirasse o fone do gancho derrubava a conexão.',
      porQueEraAssim:
        'A internet precisava atravessar uma rede construída para transportar voz humana, e só isso. O modem resolvia convertendo dados em som audível: se a linha sabia levar uma conversa, levaria aqueles chiados também. O barulho não era efeito colateral — era o dado.',
      comoTerminou:
        'A banda larga passou a usar faixas de frequência acima da voz no mesmo par de fios. Foi o que permitiu falar ao telefone e navegar ao mesmo tempo, e tirou da tomada o ritual inteiro.',
      legado:
        'O conceito de estar online como um estado, com começo e fim. Hoje é o contrário: você está conectado o tempo todo e precisa se esforçar para não estar. O que sobrou da discagem foi justamente a ideia de desconectar — que virou luxo.',
      curiosidade:
        'O silêncio ao conectar tinha nome de comando. O padrão Hayes definia M1 como "alto-falante ligado até detectar portadora": você ouvia a discagem e a negociação para diagnosticar de ouvido se deu ocupado, se discou errado ou se caiu numa secretária eletrônica — e no instante em que a conexão fechava, o alto-falante se calava sozinho. O silêncio era o sinal de sucesso.',
    },
    fontes: [
      { titulo: 'Hayes compatible modem — comandos AT', url: 'https://www.fysnet.net/modminfo.htm' },
    ],
  },
  {
    id: 'msn',
    cor: '#3c8ae8',
    ordem: 1999,
    era: 'anos-2000',
    estado: 'aberta',
    Peca: Msn,
    placa: {
      nome: 'MSN Messenger',
      anos: '22 de julho de 1999 a 27 de maio de 2013',
      oQueEra:
        'O lugar onde uma geração inteira conversou depois da aula. Lista de contatos com quem estava online naquele momento, apelido cheio de símbolo, emoticon amarelo e o zumbido: um botão que fazia a janela do outro tremer e apitar.',
      porQueEraAssim:
        'Conversar exigia os dois online ao mesmo tempo, porque a mensagem não ficava guardada esperando ninguém. Daí a lista de contatos ser a tela principal e não uma configuração: antes de falar, você precisava ver quem estava lá. E daí os apelidos cheios de símbolo — não havia campo de recado no começo, então o recado ia dentro do próprio nome.',
      comoTerminou:
        'Perdeu para o celular e para o Facebook. A Microsoft comprou o Skype em 2011 e encerrou o Messenger em 27 de maio de 2013, depois de quase catorze anos; no Brasil a migração começou em 30 de abril daquele ano. Na China ainda funcionou até outubro de 2014.',
      legado:
        'Quase tudo. O status, o aviso de digitando, a lista de quem está disponível, o som de mensagem nova, a conversa em janela própria. Todo mensageiro de hoje é um MSN com fotografia melhor — e com uma diferença enorme: a mensagem agora espera por você, e por isso ninguém mais precisa estar online ao mesmo tempo.',
      curiosidade:
        'O Brasil foi o maior mercado do MSN no mundo. Em 2007 o país liderou o ranking global com 30,5 milhões de usuários ativos, e a plataforma chegou a alcançar mais de 75% de todos os internautas brasileiros. E o recurso mais lembrado chegou tarde: o zumbido só apareceu na versão 7.0, em 7 de abril de 2005, quando o programa já tinha seis anos.',
    },
    fontes: [
      { titulo: 'Windows Live Messenger — Wikipédia', url: 'https://pt.wikipedia.org/wiki/Windows_Live_Messenger' },
      { titulo: 'A história do MSN Messenger, o favorito dos brasileiros — TecMundo', url: 'https://www.tecmundo.com.br/mercado/133163-historia-msn-messenger-favorito-brasileiros-video.htm' },
      { titulo: 'O que aconteceu com o MSN? — Canaltech', url: 'https://canaltech.com.br/apps/o-que-aconteceu-com-o-msn-entenda-o-fim-do-fenomeno-dos-anos-2000/' },
    ],
  },
  {
    id: 'orkut',
    cor: '#e0457b',
    ordem: 2004,
    era: 'anos-2000',
    estado: 'aberta',
    Peca: Orkut,
    placa: {
      nome: 'Orkut',
      anos: '24 de janeiro de 2004 – 30 de setembro de 2014',
      oQueEra:
        'A rede social onde o Brasil aprendeu a ter perfil. Recados, depoimentos, comunidades com nomes absurdos e um sistema em que amigos te davam notas de confiável, legal e sexy — em cubos de gelo, corações e carinhas.',
      porQueEraAssim:
        'Largura fixa e tudo empilhado em caixas porque a tela padrão tinha 1024 pixels e o CSS da época mal sustentava layout fluido. Verdana em 11 pixels porque era a fonte que a Microsoft desenhou para ser legível em monitores ruins — e quase todo monitor era ruim.',
      comoTerminou:
        'Perdeu para o Facebook, mas não só por isso: nasceu como projeto paralelo de um único engenheiro e nunca virou prioridade da empresa. O Google anunciou o fim em 30 de junho de 2014 e desligou tudo em 30 de setembro do mesmo ano.',
      legado:
        'O perfil como identidade pública e as comunidades, que viraram grupos. A ideia de ter uma página que é sua, que outras pessoas visitam e comentam, é dali — e é o formato de praticamente toda rede social desde então.',
      curiosidade:
        'O Brasil adotou tanto que a plataforma virou brasileira por decisão administrativa: em 2008 o Google passou a operação inteira para o escritório de Belo Horizonte — pelo tamanho da base brasileira e também pelo volume crescente de processos judiciais no país. Um projeto de 20% do tempo do engenheiro turco Orkut Büyükkökten acabou administrado de Minas Gerais.',
    },
    fontes: [
      { titulo: 'Orkut — Wikipedia', url: 'https://en.wikipedia.org/wiki/Orkut' },
      { titulo: '20 anos de Orkut — Canaltech', url: 'https://canaltech.com.br/redes-sociais/20-anos-de-orkut-rede-social-ensinou-a-uma-geracao-o-que-e-internet-131441/' },
    ],
  },
  {
    id: 'bbs',
    cor: '#ffb64a',
    ordem: 1991,
    era: 'micro-em-casa',
    estado: 'aberta',
    Peca: Bbs,
    placa: {
      nome: 'BBS',
      anos: 'no Brasil, de 1984 a meados dos anos 90',
      oQueEra:
        'Comunidade online antes da web. Do outro lado não havia empresa nem servidor: havia um micro na casa de alguém, com um modem ligado na linha telefônica da família. Você discava para o telefone daquela pessoa e entrava no computador dela.',
      porQueEraAssim:
        'Uma linha telefônica atendia um visitante por vez — é isso que explica todo o resto. Daí o limite de tempo diário, daí o aviso para não ficar parado no menu, daí ler tudo de uma vez e responder depois. E daí as comunidades serem da própria cidade: ligação interurbana custava caro demais para bater papo.',
      comoTerminou:
        'A internet comercial chegou em 1995 com provedores de centenas de linhas simultâneas, e a web trouxe busca e hipertexto — duas coisas que um BBS não tinha como oferecer. Vários sysops viraram provedores: a Mandic BBS foi precursora dos provedores brasileiros, e em 2000 seu fundador foi um dos criadores do iG.',
      legado:
        'O fórum, inteiro. Tópico, resposta, assunto, moderação — a estrutura de qualquer fórum de internet é a base de mensagens de um BBS, sem uma mudança sequer. E o papel do sysop virou o de administrador de comunidade, que é hoje uma profissão.',
      curiosidade:
        'No Brasil o maior investimento de um BBS não era o computador: era a linha telefônica. Antes da privatização havia escassez real — gente esperava anos por uma linha, e elas eram negociadas num mercado paralelo, valendo dinheiro de verdade. Por isso quase todo BBS brasileiro tinha só uma linha, e um com oito era acontecimento.',
    },
    fontes: [
      { titulo: 'BBS: como foi viver a era das grandes navegações — Meio Bit', url: 'https://meiobit.com/457991/bbs-como-foi-viver-a-era-das-grandes-navegacoes/' },
      { titulo: 'Mandic — Revista Micro Sistemas', url: 'https://revistamicrosistemas.com.br/mandic/' },
      { titulo: 'Morre Aleksandar Mandic, um dos fundadores da internet no Brasil — CNN Brasil', url: 'https://www.cnnbrasil.com.br/tecnologia/morre-aleksandar-mandic-um-dos-fundadores-da-internet-no-brasil/' },
    ],
  },
  {
    id: 'win95',
    cor: '#2a8ac8',
    ordem: 1995,
    era: 'internet-chega',
    estado: 'aberta',
    Peca: Win95,
    placa: {
      nome: 'Windows 95',
      anos: 'lançado em 24 de agosto de 1995',
      oQueEra:
        'A área de trabalho que ensinou o país a usar mouse. Trouxe o botão Iniciar, a barra de tarefas e a ideia de que cada programa mora numa janela que você move, empilha e fecha. Para muita gente foi o primeiro computador que não exigia decorar comando nenhum.',
      porQueEraAssim:
        'O botão Iniciar existe porque as pessoas ligavam o computador e não sabiam o que fazer em seguida. A solução foi pôr no canto um botão que dizia literalmente por onde começar. Parece óbvio hoje porque venceu — na época era resposta a um problema real de gente que nunca tinha visto aquilo.',
      comoTerminou:
        'Foi sucedido por versões melhores e mais estáveis, mas o desenho que ele fixou nunca saiu: canto inferior esquerdo, lista de programas, barra com as janelas abertas e relógio do outro lado. Trinta anos depois, é ainda a mesma planta baixa.',
      legado:
        'A gramática inteira da área de trabalho. Janela com barra de título e botões no canto, arrastar para a lixeira, clicar duas vezes para abrir, botão direito para ver as opções. Nada disso nasceu ali, mas foi ali que virou senso comum.',
      curiosidade:
        'O limite de oito caracteres nos nomes de arquivo acabou com ele, e foi uma libertação silenciosa. De repente dava para chamar um arquivo de "carta para a vovó" em vez de CARTAVO~1.DOC. Quase ninguém lembra disso como novidade, mas foi uma das mudanças que mais aproximou o computador da linguagem das pessoas.',
    },
    fontes: [
      { titulo: 'Windows 95 — Wikipédia', url: 'https://pt.wikipedia.org/wiki/Windows_95' },
      { titulo: 'Long filename — Wikipedia', url: 'https://en.wikipedia.org/wiki/Long_filename' },
    ],
  },
  {
    id: 'mirc',
    cor: '#c8b02a',
    ordem: 1996,
    era: 'internet-chega',
    estado: 'aberta',
    Peca: Mirc,
    placa: {
      nome: 'mIRC e as salas de bate-papo',
      anos: 'o IRC desde 1988; o mIRC, de 1995',
      oQueEra:
        'Salas públicas onde estranhos conversavam ao mesmo tempo. Você escolhia um apelido, entrava num canal como #brasil e caía no meio de uma conversa que já estava rolando. Ninguém sabia quem era ninguém, e era exatamente esse o ponto.',
      porQueEraAssim:
        'Não havia cadastro nem senha: o apelido era de quem chegasse primeiro e valia só enquanto você estivesse conectado. Daí a disputa por apelido, os comandos com barra para tudo, e o poder concentrado nos operadores do canal — marcados com arroba — que eram as únicas pessoas capazes de expulsar alguém.',
      comoTerminou:
        'Perdeu para os mensageiros, que sabiam quem era quem e guardavam a conversa. O IRC não morreu: continua funcionando, hoje sobretudo entre comunidades técnicas, que são justamente quem valoriza não ter cadastro.',
      legado:
        'A sala de bate-papo, que virou canal do Discord e do Slack. O arroba marcando quem manda. E o costume de se apresentar com três dados — idade, sexo e cidade — que continua vivo na primeira mensagem de todo aplicativo de conhecer gente.',
      curiosidade:
        'Nada era guardado. O que foi dito antes de você chegar simplesmente não existia, e o que você disse sumia ao fechar. Hoje soa como defeito, mas era o contrato: a conversa era do momento, e ninguém ia consultar o que você escreveu três anos atrás.',
    },
    fontes: [
      { titulo: 'Internet Relay Chat — Wikipédia', url: 'https://pt.wikipedia.org/wiki/Internet_Relay_Chat' },
      { titulo: 'mIRC — Wikipedia', url: 'https://en.wikipedia.org/wiki/MIRC' },
    ],
  },
  {
    id: 'paginas',
    cor: '#e85cc8',
    ordem: 1997,
    era: 'internet-chega',
    estado: 'aberta',
    Peca: Paginas,
    placa: {
      nome: 'Páginas pessoais',
      anos: 'segunda metade dos anos 90',
      oQueEra:
        'Antes de rede social existir, quem quisesse estar na internet fazia a própria página. Escrevia o HTML no Bloco de Notas, subia num serviço de hospedagem gratuita e mandava o endereço para os amigos. Cada uma era diferente da outra porque não havia modelo nenhum.',
      porQueEraAssim:
        'A feiura não era falta de gosto: era falta de opção e excesso de entusiasmo. Não existia tema pronto, não existia editor visual decente e não existia quem desse palpite. Cada página era alguém aprendendo HTML sozinho, à noite, usando de uma vez tudo que tinha descoberto naquela semana — o texto piscando, o letreiro correndo, o fundo repetido e a música tocando sozinha.',
      comoTerminou:
        'As redes sociais ofereceram o mesmo sem precisar aprender nada: perfil pronto, endereço pronto, público pronto. Os serviços de hospedagem gratuita fecharam as portas em série nos anos 2000, e com eles sumiu um pedaço grande da internet feita à mão.',
      legado:
        'O impulso continua intacto — só mudou de lugar. O contador de visitas virou número de seguidores, o livro de visitas virou caixa de comentários e o letreiro correndo virou story. O que se perdeu foi a parte trabalhosa: hoje ninguém precisa aprender a fazer para poder aparecer.',
      curiosidade:
        'O aviso de "em construção" não era descuido — era etiqueta. Assumia-se que uma página nunca ficava pronta, e sinalizar a obra era um jeito de pedir paciência a quem chegava. Havia a placa de trânsito animada, o bonequinho com a pá, e páginas que ficaram em construção até o serviço de hospedagem fechar.',
    },
    fontes: [
      { titulo: 'GeoCities — Wikipédia', url: 'https://pt.wikipedia.org/wiki/GeoCities' },
      { titulo: 'Under construction (icon) — Wikipedia', url: 'https://en.wikipedia.org/wiki/Under_construction_(icon)' },
    ],
  },
  {
    id: 'icq',
    cor: '#3ac85c',
    ordem: 1998,
    era: 'internet-chega',
    estado: 'aberta',
    Peca: Icq,
    placa: {
      nome: 'ICQ',
      anos: 'lançado em novembro de 1996',
      oQueEra:
        'O primeiro mensageiro que emplacou. Sua identidade era um número, o UIN, e a flor ao lado de cada nome dizia quem estava ali naquele momento. O som de mensagem nova era tão específico que dava para reconhecer atravessando a casa.',
      porQueEraAssim:
        'O número no lugar do nome era consequência de uma escolha simples: os UIN eram distribuídos por ordem de cadastro, um após o outro, e assim não havia risco de dois iguais. O efeito colateral virou cultura — quem entrou cedo tinha número curto, e número curto virou sinal de veterano.',
      comoTerminou:
        'Foi comprado pela AOL em 1998 e perdeu espaço para o MSN Messenger no começo dos anos 2000, sobretudo no Brasil. Continuou existindo e trocou de dono mais de uma vez, mas nunca voltou ao centro.',
      legado:
        'A lista de contatos com o estado ao lado de cada nome — a ideia de que você olha uma tela e sabe quem está disponível agora. Isso não existia antes e hoje está em tudo, do aplicativo de mensagem ao sistema do trabalho.',
      curiosidade:
        'O som de mensagem nova eram duas notas curtas, e era deliberadamente feio: precisava ser ouvido no meio do barulho e não podia se confundir com nenhum outro som do sistema. A mesma lógica governa o toque de notificação do seu celular hoje.',
    },
    fontes: [
      { titulo: 'ICQ — Wikipédia', url: 'https://pt.wikipedia.org/wiki/ICQ' },
    ],
  },
  {
    id: 'celular',
    cor: '#8ac82a',
    ordem: 2000,
    era: 'anos-2000',
    estado: 'aberta',
    Peca: Celular,
    placa: {
      nome: 'O celular antes do smartphone',
      anos: 'virada dos anos 2000',
      oQueEra:
        'Tela pequena esverdeada, doze teclas e uma bateria que durava a semana. Servia para ligar e para mandar mensagem de no máximo 160 caracteres, escrita apertando a mesma tecla várias vezes até chegar na letra certa.',
      porQueEraAssim:
        'O limite de 160 caracteres não foi decisão de produto. O SMS foi encaixado num canal de sinalização que já existia na rede de telefonia e que sobrava, e ali cabiam 160 caracteres de 7 bits — nem um a mais. A mensagem de texto pegou carona num espaço vazio, e é por isso que saía tão barata.',
      comoTerminou:
        'O smartphone juntou tudo numa tela sensível ao toque e tornou o teclado físico desnecessário. O SMS em si não morreu: virou o canal por onde chegam os códigos de verificação, justamente por ser a coisa mais universal que existe.',
      legado:
        'A escrita abreviada. "Vc", "pq", "blz" e toda a economia de letras nasceram da contagem regressiva no canto da tela e da dor de apertar cada tecla três vezes. O limite acabou; o jeito de escrever ficou.',
      curiosidade:
        'Multi-toque e T9 são coisas diferentes, e quase todo mundo chama as duas de T9. Multi-toque é apertar 2 três vezes para chegar no C, como nesta peça. O T9 de verdade era preditivo: uma tecla por letra, e o aparelho adivinhava a palavra — errando de um jeito tão característico que virou piada de uma geração inteira.',
    },
    fontes: [
      { titulo: 'SMS — Wikipédia', url: 'https://pt.wikipedia.org/wiki/SMS' },
      { titulo: 'T9 (predictive text) — Wikipedia', url: 'https://en.wikipedia.org/wiki/T9_(predictive_text)' },
    ],
  },
  {
    id: 'winxp',
    cor: '#2ac878',
    ordem: 2001,
    era: 'anos-2000',
    estado: 'aberta',
    Peca: Winxp,
    placa: {
      nome: 'Windows XP',
      anos: 'de 25 de outubro de 2001 a 8 de abril de 2014',
      oQueEra:
        'A área de trabalho dos anos 2000, e o lugar de onde tudo começava. Não se abria a internet: abria-se o computador, e de lá o navegador, o Messenger e a conexão. Esta sala funciona assim — os ícones daqui levam a outras peças do museu.',
      porQueEraAssim:
        'Cada coisa era um programa instalado, com ícone próprio na área de trabalho, e não um endereço dentro de um navegador. Por isso a área de trabalho era o centro: ela era o menu principal da sua vida digital, e a barra de baixo mostrava tudo que estava aberto ao mesmo tempo.',
      comoTerminou:
        'A Microsoft encerrou o suporte em 8 de abril de 2014, quase treze anos depois do lançamento — sobrevida rara, causada em boa parte por empresas e caixas eletrônicos que não queriam migrar. O modelo dele terminou antes: as coisas saíram da área de trabalho e foram para dentro do navegador.',
      legado:
        'A barra de tarefas com o relógio, que continua idêntica. E, por contraste, ele torna visível o que mudou: hoje o equivalente da área de trabalho é a tela inicial do celular, e o equivalente dos programas instalados são abas.',
      curiosidade:
        'O papel de parede da colina verde com o céu azul é uma fotografia real, sem montagem, feita na Califórnia. Virou provavelmente uma das imagens mais vistas da história — e quase ninguém que olhou para ela todo dia durante anos sabia que era um lugar de verdade.',
    },
    fontes: [
      { titulo: 'Windows XP — Wikipédia', url: 'https://pt.wikipedia.org/wiki/Windows_XP' },
    ],
  },
  {
    id: 'p2p',
    cor: '#c85c2a',
    ordem: 2001,
    era: 'anos-2000',
    estado: 'aberta',
    Peca: P2p,
    placa: {
      nome: 'A era do compartilhamento',
      anos: 'o Napster de 1999 a 2001; a ideia, até hoje',
      oQueEra:
        'Programas em que cada pessoa conectada era, ao mesmo tempo, quem pedia e quem servia. Você procurava um arquivo e ele vinha de outro computador doméstico qualquer, ligado naquele momento — e enquanto baixava, o seu já estava servindo alguém.',
      porQueEraAssim:
        'A arquitetura era a mensagem. Numa rede comum existe um servidor no meio: derrube-o e tudo para. Numa rede entre pares não existe meio — cada participante é um pedaço da rede, e por isso ela não tem onde ser desligada. Era isso que assustava, não o formato de arquivo.',
      comoTerminou:
        'O Napster foi processado e fechado em 2001, mas o que o sucedeu era ainda mais difícil de parar, justamente por não ter centro. A indústria acabou respondendo com produto em vez de processo: o serviço por assinatura resolveu o problema oferecendo conveniência maior que a da troca.',
      legado:
        'A ideia de que uma rede pode funcionar sem autoridade central. É ela que distribui sistema operacional livre, que sustenta chamada de vídeo direta entre dois navegadores e que está embaixo de toda rede sem dono. A tecnologia foi absolvida; o uso é que era a questão.',
      curiosidade:
        'A experiência tinha um detalhe que nenhum serviço de hoje reproduz: a descida podia parar para sempre na metade, porque a última pessoa que tinha aquele arquivo simplesmente desligou o computador e foi dormir. Você dependia de estranhos continuarem acordados.',
    },
    fontes: [
      { titulo: 'Napster — Wikipédia', url: 'https://pt.wikipedia.org/wiki/Napster' },
      { titulo: 'Peer-to-peer — Wikipédia', url: 'https://pt.wikipedia.org/wiki/Peer-to-peer' },
    ],
  },
  {
    id: 'flash',
    cor: '#e8c82a',
    ordem: 2003,
    era: 'anos-2000',
    estado: 'aberta',
    Peca: Flash,
    placa: {
      nome: 'Jogos em Flash',
      anos: 'do fim dos anos 90 até 31 de dezembro de 2020',
      oQueEra:
        'Jogos pequenos que rodavam dentro da página, sem instalar nada. Sites inteiros viviam de reunir centenas deles. A tela de carregando com a porcentagem subindo devagar era parte da experiência — e travava sempre no mesmo lugar.',
      porQueEraAssim:
        'O Flash existia porque o navegador da época não sabia desenhar nem animar quase nada sozinho. Era preciso um programa extra, instalado por fora, para conseguir movimento e som numa página. Isso deu uma liberdade enorme a uma geração de criadores e, ao mesmo tempo, deixou tudo dependendo de um único produto de uma única empresa.',
      comoTerminou:
        'A Adobe encerrou o suporte em 31 de dezembro de 2020 e o programa parou de funcionar em todos os navegadores. Décadas de jogos e animações sumiram de uma vez — o maior apagamento de patrimônio digital que já aconteceu, e ele teve data marcada com anos de antecedência.',
      legado:
        'A ideia de que uma página pode ser um programa, e não um documento. O navegador acabou aprendendo a fazer sozinho tudo que o Flash fazia, e é por isso que ele não é mais necessário — o jogo desta sala roda sem nada instalado.',
      curiosidade:
        'A tela de carregando era a única forma de dizer que algo estava acontecendo numa conexão lenta. Como ela mostrava o quanto já tinha chegado, e a chegada era irregular, o número parecia travar — e travava mesmo. Foi provavelmente a primeira vez que uma geração inteira aprendeu a esperar olhando uma barra.',
    },
    fontes: [
      { titulo: 'Adobe Flash — Wikipédia', url: 'https://pt.wikipedia.org/wiki/Adobe_Flash' },
      { titulo: 'Adobe Flash Player end of life — Adobe', url: 'https://www.adobe.com/products/flashplayer/end-of-life.html' },
    ],
  },
  {
    id: 'lanhouse',
    cor: '#5c8ae8',
    ordem: 2004,
    era: 'anos-2000',
    estado: 'aberta',
    Peca: Lanhouse,
    placa: {
      nome: 'Lan house',
      anos: 'do fim dos anos 90 ao começo dos anos 2010',
      oQueEra:
        'Um salão com computadores enfileirados, cobrado por hora. Você pagava no balcão, sentava numa máquina numerada e tinha aquele tempo. Era onde se jogava em rede, se fazia trabalho de escola, se imprimia documento e se acessava a internet — para muita gente, a única forma de acessar.',
      porQueEraAssim:
        'A lan house não existia por causa do computador: existia por causa da conexão. Um ponto de internet em casa era caro demais para a maior parte do país, mas dividido entre vinte máquinas e cobrado por hora, cabia no bolso. O modelo inteiro era um jeito de ratear o custo de estar online.',
      comoTerminou:
        'A banda larga barateou, o celular com internet chegou e o programa de computador popular financiou máquinas domésticas. A necessidade que sustentava o negócio foi embora, e a maioria fechou ou virou outra coisa — assistência técnica, papelaria, correspondente bancário.',
      legado:
        'A ideia de acesso compartilhado e pago por uso, que hoje reaparece na computação em nuvem: você não compra a máquina, aluga o tempo dela. E, socialmente, ficou o hábito de tratar o acesso à internet como serviço essencial de bairro — do mesmo jeito que farmácia e padaria.',
      curiosidade:
        'Em 2007, segundo o Comitê Gestor da Internet no Brasil, as lan houses respondiam por cerca de metade de todo o acesso à internet no país — e no Norte e no Nordeste esse número chegava perto de 70%. Não eram um detalhe pitoresco dos anos 2000: foram a principal porta de entrada do Brasil na internet.',
    },
    fontes: [
      { titulo: 'Quem usa lan houses? — NIC.br', url: 'https://www.nic.br/noticia/na-midia/quem-usa-lan-houses/' },
      { titulo: 'LAN Houses: a new wave of digital inclusion in Brazil', url: 'http://publius.cc/lan_houses_new_wave_digital_inclusion_brazil/091509' },
    ],
  },
  {
    id: 'blogs',
    cor: '#c8783a',
    ordem: 2005,
    era: 'anos-2000',
    estado: 'aberta',
    Peca: Blogs,
    placa: {
      nome: 'Blogs',
      anos: 'auge entre 2003 e 2008',
      oQueEra:
        'Páginas pessoais que se atualizavam sozinhas: você escrevia um texto, ele aparecia no topo e empurrava o anterior para baixo. Tinha arquivo por mês na lateral, lista dos blogs que você lia e uma caixa de comentários embaixo de cada post.',
      porQueEraAssim:
        'A ordem invertida parece óbvia e não é: ela decide que o visitante quer o agora, e que o resto é arquivo. Foi essa escolha que criou o formato de linha do tempo. E a lista de blogs amigos na lateral era o mecanismo de descoberta — não havia algoritmo, havia gente indicando gente.',
      comoTerminou:
        'As redes sociais absorveram a função e tiraram o trabalho: escrever ficou mais fácil, mas o endereço deixou de ser seu. Os blogs não acabaram — viraram newsletter, publicação independente e o próprio formato de qualquer site de notícia.',
      legado:
        'A ordem cronológica invertida, que hoje governa todas as telas que você rola. O comentário embaixo do texto. E a data e hora em cada publicação, que continua sendo como se mede se algo ainda vale.',
      curiosidade:
        'O post costumava trazer o que a pessoa estava ouvindo naquele momento. Não era enfeite: era contexto emocional, uma forma de dizer em que estado o texto foi escrito. A prática sumiu do formato escrito e reapareceu inteira no vídeo curto, onde a música também diz em que tom aquilo deve ser lido.',
    },
    fontes: [
      { titulo: 'Blog — Wikipédia', url: 'https://pt.wikipedia.org/wiki/Blog' },
      { titulo: 'Blogger — Wikipédia', url: 'https://pt.wikipedia.org/wiki/Blogger' },
    ],
  },
  {
    id: 'fotolog',
    cor: '#e85c78',
    ordem: 2005,
    era: 'anos-2000',
    estado: 'aberta',
    Peca: Fotolog,
    placa: {
      nome: 'Fotolog',
      anos: 'fundado em 2002; auge no Brasil entre 2005 e 2008',
      oQueEra:
        'Uma foto por dia, com uma legenda curta e os comentários ao lado. Só isso. A regra era do serviço e não da tecnologia, e foi ela que deu o ritmo: com uma escolha por dia, a escolha importava.',
      porQueEraAssim:
        'A escassez era o produto. Postar uma foto só obrigava a decidir qual, e transformava o comentário em moeda: você comentava no fotolog dos outros para que comentassem no seu, e isso virou uma economia social inteira, com pedido explícito de reciprocidade nas legendas.',
      comoTerminou:
        'Perdeu para as redes onde se podia postar tudo, o tempo todo, de graça. O serviço definhou ao longo dos anos 2010 e acabou sendo desligado. O que morreu não foi o site: foi a ideia de limite.',
      legado:
        'A foto quadrada com legenda e comentários embaixo, que é o desenho de toda rede de imagem desde então. E, por ausência, ele deixou a pergunta: o que se perdeu quando deixou de haver um limite por dia.',
      curiosidade:
        'O Fotolog foi desproporcionalmente brasileiro, argentino e chileno. Enquanto o resto do mundo migrava para outras plataformas, aqui ele virou o centro de uma cultura própria, com gírias, regras de etiqueta e disputas que nunca existiram em lugar nenhum — um fenômeno local dentro de um serviço estrangeiro.',
    },
    fontes: [
      { titulo: 'Fotolog — Wikipédia', url: 'https://pt.wikipedia.org/wiki/Fotolog' },
    ],
  },
  {
    id: 'youtube',
    cor: '#c82a3a',
    ordem: 2006,
    era: 'anos-2000',
    estado: 'aberta',
    Peca: Youtube,
    placa: {
      nome: 'O primeiro YouTube',
      anos: 'fundado em fevereiro de 2005',
      oQueEra:
        'Um site onde qualquer pessoa podia pôr um vídeo, sem precisar de servidor nem de permissão. O player tinha 320 por 240 pixels, a avaliação era por estrelas e os comentários não passavam por ninguém antes de aparecer.',
      porQueEraAssim:
        'O tamanho do player não era escolha estética: era o que uma conexão doméstica de 2006 conseguia entregar sem parar toda hora. E parava mesmo — a palavra "bufferizando" existia porque o vídeo chegava mais devagar do que era assistido.',
      comoTerminou:
        'Não terminou: virou outra coisa. Foi comprado pelo Google em 2006, trocou as estrelas por polegares em 2009 ao descobrir que quase todo mundo dava cinco ou uma, e deixou de ser um lugar onde se põe vídeo para virar um lugar onde se assiste.',
      legado:
        'A ideia de publicar vídeo sem pedir licença a ninguém. Antes disso, aparecer em movimento para um público exigia emissora, equipamento e autorização. O player cresceu e a qualidade subiu, mas a mudança que importou aconteceu no primeiro dia.',
      curiosidade:
        'A troca das cinco estrelas pelo polegar foi decidida por dados: as notas se concentravam quase inteiramente em cinco ou em uma, e quase nada no meio. Um sistema de cinco níveis que na prática tinha dois — então viraram dois de verdade.',
    },
    fontes: [
      { titulo: 'YouTube — Wikipédia', url: 'https://pt.wikipedia.org/wiki/YouTube' },
    ],
  },
]

export function salaPorId(id: string): Item | undefined {
  return ACERVO.find((s) => s.id === id)
}

/** Só as peças visitáveis, em ordem cronológica. */
export function abertas() {
  return ACERVO.filter((s) => s.estado === 'aberta').sort((a, b) => a.ordem - b.ordem)
}

export function emOrdem() {
  return [...ACERVO].sort((a, b) => a.ordem - b.ordem)
}
