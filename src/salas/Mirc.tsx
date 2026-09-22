import { useEffect, useRef, useState } from 'react'
import './mirc.css'

/**
 * Sala — mIRC e as salas de bate-papo (1996).
 *
 * A PERGUNTA:
 *   como era conversar com estranhos sem cadastro, sem histórico e
 *   sem ninguém saber quem era ninguém?
 *
 * O canal continua vivo sozinho: gente entra, sai e fala enquanto você está
 * parado. Era assim — a conversa não esperava por você, e o que foi dito antes
 * de você chegar estava perdido para sempre.
 *
 * Comandos que funcionam: /nick, /join, /me, /list, /help, /quit.
 */

type Linha =
  | { tipo: 'fala'; quem: string; texto: string }
  | { tipo: 'acao'; quem: string; texto: string }
  | { tipo: 'entrou' | 'saiu'; quem: string }
  | { tipo: 'sistema'; texto: string }

const CANAIS = ['#brasil', '#saopaulo', '#flerte', '#ajuda', '#mp3']

const POVO = ['@Ricardo_SP', 'Fê_15_RJ', 'k4ru', 'AnaPaula', 'Thiago[br]', 'luana_', 'MaTeUs']

const CONVERSA: Linha[] = [
  { tipo: 'fala', quem: 'Fê_15_RJ', texto: 'oi galera, alguem de niteroi?' },
  { tipo: 'fala', quem: 'k4ru', texto: 'aqui sp' },
  { tipo: 'entrou', quem: 'Thiago[br]' },
  { tipo: 'fala', quem: '@Ricardo_SP', texto: 'bom dia. sem flood hoje por favor' },
  { tipo: 'fala', quem: 'AnaPaula', texto: 'alguem sabe onde baixa o winamp 2?' },
  { tipo: 'fala', quem: 'Thiago[br]', texto: 'tenta no #mp3' },
  { tipo: 'acao', quem: 'luana_', texto: 'ta com sono' },
  { tipo: 'fala', quem: 'k4ru', texto: 'asl?' },
  { tipo: 'fala', quem: 'Fê_15_RJ', texto: '15 f rj e vc' },
  { tipo: 'saiu', quem: 'MaTeUs' },
  { tipo: 'fala', quem: '@Ricardo_SP', texto: 'gente o canal ta lento, a linha aqui ta ruim' },
  { tipo: 'fala', quem: 'AnaPaula', texto: 'minha mae vai usar o telefone, ja volto' },
  { tipo: 'saiu', quem: 'AnaPaula' },
  { tipo: 'fala', quem: 'Thiago[br]', texto: 'kkkkk classico' },
  { tipo: 'entrou', quem: 'Pedrinho' },
  { tipo: 'fala', quem: 'Pedrinho', texto: 'oi' },
  { tipo: 'fala', quem: 'k4ru', texto: 'oi pedrinho' },
]

const CORES_NICK = ['#4ac8f0', '#f0a84a', '#8af04a', '#f04a8a', '#c88af0', '#f0e84a']

function corDoNick(nick: string): string {
  let h = 0
  for (let i = 0; i < nick.length; i++) h = (h * 31 + nick.charCodeAt(i)) >>> 0
  return CORES_NICK[h % CORES_NICK.length]
}

export function Mirc() {
  const [canal, setCanal] = useState('#brasil')
  const [nick, setNick] = useState('visitante')
  const [linhas, setLinhas] = useState<Linha[]>([
    { tipo: 'sistema', texto: '* Conectando a irc.brasnet.org (6667)...' },
    { tipo: 'sistema', texto: '* Conectado. Procurando nome do host...' },
    { tipo: 'sistema', texto: '* Voce entrou em #brasil' },
    { tipo: 'sistema', texto: '* Topico: sem flood | sem maiusculas | respeite os ops' },
  ])
  const [entrada, setEntrada] = useState('')
  const [passo, setPasso] = useState(0)
  const fimRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // O canal não espera por você: a conversa corre sozinha.
  useEffect(() => {
    if (passo >= CONVERSA.length) return
    const id = setTimeout(() => {
      setLinhas((l) => [...l, CONVERSA[passo]])
      setPasso((p) => p + 1)
    }, 2600 + Math.random() * 2200)
    return () => clearTimeout(id)
  }, [passo])

  useEffect(() => {
    fimRef.current?.scrollIntoView({ block: 'nearest' })
  }, [linhas])

  function enviar(e: React.FormEvent) {
    e.preventDefault()
    const texto = entrada.trim()
    setEntrada('')
    if (!texto) return

    if (!texto.startsWith('/')) {
      setLinhas((l) => [...l, { tipo: 'fala', quem: nick, texto }])
      return
    }

    const [cmd, ...resto] = texto.slice(1).split(/\s+/)
    const arg = resto.join(' ')

    switch (cmd.toLowerCase()) {
      case 'nick': {
        if (!arg) return
        const novo = arg.slice(0, 16)
        setLinhas((l) => [...l, { tipo: 'sistema', texto: `* ${nick} agora e conhecido como ${novo}` }])
        setNick(novo)
        break
      }
      case 'join': {
        const alvo = arg.startsWith('#') ? arg : `#${arg}`
        setCanal(alvo)
        setLinhas((l) => [...l, { tipo: 'sistema', texto: `* Voce entrou em ${alvo}` }])
        break
      }
      case 'me':
        if (arg) setLinhas((l) => [...l, { tipo: 'acao', quem: nick, texto: arg }])
        break
      case 'list':
        setLinhas((l) => [
          ...l,
          { tipo: 'sistema', texto: '* Lista de canais:' },
          ...CANAIS.map((c) => ({
            tipo: 'sistema' as const,
            texto: `*   ${c.padEnd(12)} ${40 + ((c.length * 37) % 900)} usuarios`,
          })),
        ])
        break
      case 'quit':
        setLinhas((l) => [...l, { tipo: 'sistema', texto: '* Desconectado.' }])
        break
      case 'help':
        setLinhas((l) => [
          ...l,
          { tipo: 'sistema', texto: '* Comandos: /nick /join /me /list /quit' },
        ])
        break
      default:
        setLinhas((l) => [...l, { tipo: 'sistema', texto: `* Comando desconhecido: ${cmd}` }])
    }
  }

  return (
    <div className="mirc" onClick={() => inputRef.current?.focus()}>
      <div className="mirc__barra">
        <span>mIRC — {canal}</span>
        <span className="mirc__botoes">
          <i>_</i>
          <i>□</i>
          <i>×</i>
        </span>
      </div>

      <div className="mirc__topico">
        <b>{canal}</b> · sem flood · sem maiúsculas · respeite os ops
      </div>

      <div className="mirc__miolo">
        <ul className="mirc__canais">
          {CANAIS.map((c) => (
            <li key={c}>
              <button
                type="button"
                className={c === canal ? 'is-ativo' : ''}
                onClick={() => setCanal(c)}
              >
                {c}
              </button>
            </li>
          ))}
        </ul>

        <div className="mirc__conversa">
          {linhas.map((l, i) => (
            <p key={i} className={`mirc__linha mirc__linha--${l.tipo}`}>
              {l.tipo === 'fala' && (
                <>
                  <span style={{ color: corDoNick(l.quem) }}>&lt;{l.quem}&gt;</span> {l.texto}
                </>
              )}
              {l.tipo === 'acao' && (
                <>
                  * <span style={{ color: corDoNick(l.quem) }}>{l.quem}</span> {l.texto}
                </>
              )}
              {l.tipo === 'entrou' && `* ${l.quem} entrou em ${canal}`}
              {l.tipo === 'saiu' && `* ${l.quem} saiu (Ping timeout)`}
              {l.tipo === 'sistema' && l.texto}
            </p>
          ))}
          <div ref={fimRef} />
        </div>

        <ul className="mirc__gente">
          <li className="mirc__gente-titulo">{POVO.length + 1} usuários</li>
          {[`${nick}`, ...POVO].map((p) => (
            <li key={p} style={{ color: p.startsWith('@') ? '#f0e84a' : undefined }}>
              {p}
            </li>
          ))}
        </ul>
      </div>

      <form className="mirc__entrada" onSubmit={enviar}>
        <span className="mirc__nick">[{nick}]</span>
        <input
          ref={inputRef}
          value={entrada}
          onChange={(e) => setEntrada(e.target.value)}
          spellCheck={false}
          autoComplete="off"
          aria-label="Mensagem ou comando"
          placeholder="digite, ou /help"
        />
      </form>

      <p className="mirc__dica">
        tente <b>/nick seunome</b>, <b>/me sorri</b>, <b>/join #mp3</b> ou <b>/list</b>. a conversa
        corre sozinha — e o que foi dito antes de você chegar não existe mais.
      </p>
    </div>
  )
}
