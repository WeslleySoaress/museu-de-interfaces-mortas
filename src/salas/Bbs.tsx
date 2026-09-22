import { useEffect, useRef, useState } from 'react'
import './bbs.css'

/**
 * Sala — BBS (Bulletin Board System), por volta de 1991.
 *
 * A PERGUNTA:
 *   como era uma comunidade online quando cabia uma pessoa por vez,
 *   porque do outro lado havia um micro na casa de alguém?
 *
 * A comunidade online antes da web. O visitante navega por letras, como se
 * navegava: não havia mouse, não havia link, havia menu e tecla.
 *
 * O dado que a sala precisa ensinar é o do canto superior direito: LINHA 1 DE 1.
 * Um BBS era um micro na casa de alguém com um modem ligado na linha telefônica
 * da família. Uma linha, um visitante por vez. É isso que explica tudo o mais —
 * por que havia limite de tempo diário, por que as comunidades eram da própria
 * cidade (ligação interurbana custava caro) e por que se lia tudo de uma vez.
 */

type Tela = 'menu' | 'mensagens' | 'arquivos' | 'usuarios' | 'lista' | 'sair'

const VELOCIDADE_BPS = 14400
const BYTES_POR_SEGUNDO = (VELOCIDADE_BPS / 8) * 0.9 // 10% de perda de protocolo

function tempoDeDescida(kb: number): string {
  const s = (kb * 1024) / BYTES_POR_SEGUNDO
  if (s < 60) return `${Math.round(s)}s`
  const m = Math.floor(s / 60)
  return m < 60 ? `${m}min` : `${Math.floor(m / 60)}h${String(m % 60).padStart(2, '0')}`
}

const ARQUIVOS = [
  { nome: 'ZMODEM.ZIP', kb: 62, desc: 'protocolo de transferência, recomendado' },
  { nome: 'ANSIART.ZIP', kb: 148, desc: 'coletânea de telas em ANSI' },
  { nome: 'TETRIS.ZIP', kb: 94, desc: 'jogo, roda em CGA' },
  { nome: 'PKZ204G.EXE', kb: 201, desc: 'compactador PKZIP 2.04g' },
  { nome: 'FOTOS.ZIP', kb: 1240, desc: 'imagens GIF 320x200 (16 cores)' },
  { nome: 'DOOMDEMO.ZIP', kb: 2312, desc: 'demonstração, 3 fases' },
]

const MENSAGENS = [
  {
    de: 'SYSOP',
    assunto: 'LEIA ANTES DE POSTAR',
    data: '02/11/91',
    corpo: [
      'Bem-vindo ao BBS MATO GROSSO.',
      '',
      'Regras simples:',
      '1. Uma hora por dia por usuario. Se passar,',
      '   o sistema desconecta sozinho.',
      '2. Nao fique parado no menu. Tem gente',
      '   esperando a linha liberar.',
      '3. Quem sobe arquivo ganha tempo extra.',
      '',
      'A linha e a da minha casa. Depois das 23h',
      'minha mae atende o telefone achando que e',
      'trote. Evitem.',
    ],
  },
  {
    de: 'CARLOS_SP',
    assunto: 'Alguem consegue baixar o DOOMDEMO?',
    data: '14/11/91',
    corpo: [
      'Tentei tres vezes e caiu no meio das tres.',
      'Na terceira ja tinha 80% e a ligacao caiu.',
      'Comecei do zero de novo.',
      '',
      'Alguem sabe se o ZMODEM continua de onde',
      'parou? Ouvi dizer que sim mas nao consegui',
      'fazer funcionar.',
    ],
  },
  {
    de: 'ANA_M',
    assunto: 'RE: Alguem consegue baixar o DOOMDEMO?',
    data: '15/11/91',
    corpo: [
      'Continua sim! Tem que usar a opcao de',
      'recuperar transferencia no terminal.',
      '',
      'Mas faz o seguinte: tira o telefone do',
      'gancho dos outros aparelhos da casa antes.',
      'Aqui em casa era sempre minha irma que',
      'derrubava.',
    ],
  },
]

const USUARIOS = [
  { nome: 'SYSOP', cidade: 'Cuiaba', chamadas: 1247, ultima: 'hoje' },
  { nome: 'CARLOS_SP', cidade: 'Sao Paulo', chamadas: 89, ultima: 'ontem' },
  { nome: 'ANA_M', cidade: 'Cuiaba', chamadas: 312, ultima: 'hoje' },
  { nome: 'RENATO', cidade: 'Varzea Grande', chamadas: 44, ultima: 'ha 3 dias' },
  { nome: 'VOCE', cidade: '—', chamadas: 1, ultima: 'agora' },
]

const OUTRAS_BBS = [
  { nome: 'BBS PANTANAL', tel: '(065) 322-XXXX', linhas: 1, obs: 'so depois das 22h' },
  { nome: 'MANDIC BBS', tel: '(011) 872-XXXX', linhas: 8, obs: 'pago, tem e-mail' },
  { nome: 'BBS ESTACAO', tel: '(021) 592-XXXX', linhas: 2, obs: 'area de ANSI otima' },
  { nome: 'ORIGAMI BBS', tel: '(041) 233-XXXX', linhas: 1, obs: 'fora do ar?' },
]

export function Bbs() {
  const [tela, setTela] = useState<Tela>('menu')
  const [mensagemAberta, setMensagemAberta] = useState<number | null>(null)
  const [minutosRestantes, setMinutosRestantes] = useState(58)
  const [entrada, setEntrada] = useState('')
  const [erro, setErro] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // O relógio do BBS corre de verdade: a sensação de tempo contado é parte
  // da peça. Um minuto de museu para cada minuto real.
  useEffect(() => {
    const id = setInterval(() => setMinutosRestantes((m) => Math.max(0, m - 1)), 60000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (minutosRestantes === 0) setTela('sair')
  }, [minutosRestantes])

  function comandar(e: React.FormEvent) {
    e.preventDefault()
    const c = entrada.trim().toUpperCase()
    setEntrada('')
    setErro('')

    if (tela === 'mensagens' && /^[1-9]$/.test(c)) {
      const i = Number(c) - 1
      if (i < MENSAGENS.length) {
        setMensagemAberta(i)
        return
      }
    }

    switch (c) {
      case 'M':
        setTela('mensagens')
        setMensagemAberta(null)
        break
      case 'A':
        setTela('arquivos')
        break
      case 'U':
        setTela('usuarios')
        break
      case 'L':
        setTela('lista')
        break
      case 'S':
        setTela('sair')
        break
      case 'Q':
      case '0':
        if (mensagemAberta !== null) setMensagemAberta(null)
        else setTela('menu')
        break
      default:
        setErro(`Comando desconhecido: ${c || '(vazio)'}`)
    }
  }

  return (
    <div className="bbs" onClick={() => inputRef.current?.focus()}>
      <div className="bbs__tela">
        <div className="bbs__topo">
          <span>BBS MATO GROSSO</span>
          <span className="bbs__linha-info">LINHA 1 DE 1</span>
          <span className={minutosRestantes <= 5 ? 'bbs__tempo is-baixo' : 'bbs__tempo'}>
            {minutosRestantes} MIN
          </span>
        </div>

        <div className="bbs__corpo">
          {tela === 'menu' && <Menu />}
          {tela === 'mensagens' &&
            (mensagemAberta === null ? <ListaMensagens /> : <Mensagem i={mensagemAberta} />)}
          {tela === 'arquivos' && <Arquivos />}
          {tela === 'usuarios' && <Usuarios />}
          {tela === 'lista' && <Lista />}
          {tela === 'sair' && <Despedida esgotou={minutosRestantes === 0} />}
        </div>

        {tela !== 'sair' && (
          <form className="bbs__prompt" onSubmit={comandar}>
            <span className="bbs__seta">
              {tela === 'menu' ? 'escolha:' : mensagemAberta !== null ? '[0] voltar:' : '[0] menu:'}
            </span>
            <input
              ref={inputRef}
              value={entrada}
              onChange={(e) => setEntrada(e.target.value.slice(0, 2))}
              spellCheck={false}
              autoComplete="off"
              aria-label="Comando"
            />
            <span className="bbs__cursor">█</span>
          </form>
        )}

        {erro && <p className="bbs__erro">{erro}</p>}
      </div>

      <p className="bbs__dica">
        navegue pelas letras, como se navegava: <b>M</b> mensagens · <b>A</b> arquivos ·{' '}
        <b>U</b> usuários · <b>L</b> outras BBS · <b>0</b> volta
      </p>
    </div>
  )
}

function Menu() {
  return (
    <pre className="bbs__ascii">{`
 ╔════════════════════════════════════════════════╗
 ║                                                ║
 ║         B B S   M A T O   G R O S S O          ║
 ║            "o mundo em 14.400 bps"             ║
 ║                                                ║
 ║        sysop: Marcelo · desde jun/1990         ║
 ╚════════════════════════════════════════════════╝

   conectado a 14400 bps · N,8,1 · sem paridade
   voce e o visitante numero 4.312

   ┌──────────────────────────────────────────┐
   │  [M]  base de mensagens        3 novas   │
   │  [A]  area de arquivos         6 itens   │
   │  [U]  usuarios cadastrados     5         │
   │  [L]  lista de outras BBS      4         │
   │  [S]  desconectar                        │
   └──────────────────────────────────────────┘

   sem mouse. sem link. digite a letra.
`}</pre>
  )
}

function ListaMensagens() {
  return (
    <div className="bbs__secao">
      <h3>BASE DE MENSAGENS · GERAL</h3>
      <pre className="bbs__ascii">{` N  DE           ASSUNTO                        DATA
 ─  ───────────  ─────────────────────────────  ────────`}</pre>
      {MENSAGENS.map((m, i) => (
        <pre key={m.assunto} className="bbs__ascii bbs__item">{` ${i + 1}  ${m.de.padEnd(
          11,
        )}  ${m.assunto.slice(0, 29).padEnd(29)}  ${m.data}`}</pre>
      ))}
      <p className="bbs__nota">digite o numero para ler · [0] volta ao menu</p>
    </div>
  )
}

function Mensagem({ i }: { i: number }) {
  const m = MENSAGENS[i]
  return (
    <div className="bbs__secao">
      <pre className="bbs__ascii">{` ┌────────────────────────────────────────────┐
 │ De.....: ${m.de.padEnd(34)}│
 │ Assunto: ${m.assunto.slice(0, 34).padEnd(34)}│
 │ Data...: ${m.data.padEnd(34)}│
 └────────────────────────────────────────────┘`}</pre>
      <pre className="bbs__ascii bbs__corpo-msg">{m.corpo.join('\n')}</pre>
      <p className="bbs__nota">[0] volta para a lista</p>
    </div>
  )
}

function Arquivos() {
  return (
    <div className="bbs__secao">
      <h3>AREA DE ARQUIVOS</h3>
      <pre className="bbs__ascii">{` ARQUIVO       TAMANHO   TEMPO     DESCRICAO
 ────────────  ────────  ────────  ──────────────────────`}</pre>
      {ARQUIVOS.map((a) => (
        <pre key={a.nome} className="bbs__ascii bbs__item">{` ${a.nome.padEnd(12)}  ${(
          a.kb + ' KB'
        ).padStart(8)}  ${tempoDeDescida(a.kb).padStart(8)}  ${a.desc}`}</pre>
      ))}
      <p className="bbs__nota">
        a coluna TEMPO é o que a descida realmente levava a 14.400 bps — e a ligação
        estava correndo o tempo todo. baixar o DOOMDEMO consumia metade da sua hora do dia.
      </p>
    </div>
  )
}

function Usuarios() {
  return (
    <div className="bbs__secao">
      <h3>USUARIOS CADASTRADOS</h3>
      <pre className="bbs__ascii">{` APELIDO      CIDADE          CHAMADAS  ULTIMA
 ───────────  ──────────────  ────────  ──────────`}</pre>
      {USUARIOS.map((u) => (
        <pre key={u.nome} className="bbs__ascii bbs__item">{` ${u.nome.padEnd(11)}  ${u.cidade.padEnd(
          14,
        )}  ${String(u.chamadas).padStart(8)}  ${u.ultima}`}</pre>
      ))}
      <p className="bbs__nota">
        cinco pessoas. era esse o tamanho de uma comunidade online, e quase todas da
        mesma cidade — ligação interurbana custava caro demais para conversar de graça.
      </p>
    </div>
  )
}

function Lista() {
  return (
    <div className="bbs__secao">
      <h3>OUTRAS BBS · LIGUE POR SUA CONTA E RISCO</h3>
      <pre className="bbs__ascii">{` NOME             TELEFONE          LINHAS  OBSERVACAO
 ───────────────  ────────────────  ──────  ─────────────────`}</pre>
      {OUTRAS_BBS.map((b) => (
        <pre key={b.nome} className="bbs__ascii bbs__item">{` ${b.nome.padEnd(15)}  ${b.tel.padEnd(
          16,
        )}  ${String(b.linhas).padStart(6)}  ${b.obs}`}</pre>
      ))}
      <p className="bbs__nota">
        não havia busca. você descobria uma BBS por esta lista, por revista de banca ou
        por alguém que te contou. cada nova descoberta era uma ligação para testar.
      </p>
    </div>
  )
}

function Despedida({ esgotou }: { esgotou: boolean }) {
  return (
    <pre className="bbs__ascii bbs__despedida">{`
 ${esgotou ? 'SEU TEMPO DE HOJE ACABOU.' : 'OBRIGADO PELA VISITA.'}

 ${esgotou ? 'O sistema vai desconectar agora.' : 'Volte amanha, a linha e uma so.'}

 NO CARRIER

 _`}</pre>
  )
}
