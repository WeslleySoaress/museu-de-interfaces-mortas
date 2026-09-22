import { useEffect, useRef, useState } from 'react'
import './icq.css'

/**
 * Sala — ICQ (1998).
 *
 * A PERGUNTA:
 *   como era descobrir, pela primeira vez, quem estava online neste
 *   exato momento?
 *
 * A flor verde, o número no lugar do nome e o som. O "uh-oh" é sintetizado:
 * duas notas curtas, a segunda mais grave, que é a forma do som original sem
 * usar o arquivo original.
 *
 * O ponto da peça é o UIN. Sua identidade na rede era um número sequencial,
 * distribuído por ordem de chegada — e por isso um número curto valia status.
 */

const UIN_PROPRIO = '48219073'

const CONTATOS = [
  { nome: 'Marcela', uin: '1029384', estado: 'online' },
  { nome: 'Digão', uin: '22841905', estado: 'ausente' },
  { nome: 'Pri', uin: '9182736', estado: 'online' },
  { nome: 'Léo', uin: '51092384', estado: 'ocupado' },
  { nome: 'Tati', uin: '3049182', estado: 'invisivel' },
  { nome: 'Fabio', uin: '61029384', estado: 'offline' },
]

const ROTULO: Record<string, string> = {
  online: 'Disponível',
  ausente: 'Ausente',
  ocupado: 'Ocupado (DND)',
  invisivel: 'Invisível',
  offline: 'Offline',
}

type Msg = { de: 'eu' | 'ela'; texto: string }

export function Icq() {
  const [meuEstado, setMeuEstado] = useState('online')
  const [aberto, setAberto] = useState<string | null>(null)
  const [conversa, setConversa] = useState<Msg[]>([
    { de: 'ela', texto: 'oi! q horas vc entra hj?' },
  ])
  const [texto, setTexto] = useState('')
  const [piscando, setPiscando] = useState(false)
  const ctxRef = useRef<AudioContext | null>(null)

  useEffect(
    () => () => {
      void ctxRef.current?.close()
      ctxRef.current = null
    },
    [],
  )

  /** Duas notas curtas, a segunda mais grave. É a forma do som, não o som. */
  function uhOh() {
    const ctx = ctxRef.current ?? new AudioContext()
    ctxRef.current = ctx
    void ctx.resume()
    const t = ctx.currentTime

    const nota = (hz: number, inicio: number, dur: number) => {
      const osc = ctx.createOscillator()
      const g = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(hz, t + inicio)
      g.gain.setValueAtTime(0.0001, t + inicio)
      g.gain.exponentialRampToValueAtTime(0.2, t + inicio + 0.012)
      g.gain.exponentialRampToValueAtTime(0.0001, t + inicio + dur)
      osc.connect(g).connect(ctx.destination)
      osc.start(t + inicio)
      osc.stop(t + inicio + dur + 0.02)
    }

    nota(784, 0, 0.13)
    nota(523, 0.15, 0.2)
  }

  function receber() {
    uhOh()
    setPiscando(true)
    setConversa((c) => [...c, { de: 'ela', texto: 'e ai, vai entrar ou nao? :)' }])
    window.setTimeout(() => setPiscando(false), 2600)
  }

  function enviar(e: React.FormEvent) {
    e.preventDefault()
    if (!texto.trim()) return
    setConversa((c) => [...c, { de: 'eu', texto: texto.trim() }])
    setTexto('')
  }

  return (
    <div className="icq">
      <div className="icq__janela">
        <div className="icq__barra">
          <span>ICQ</span>
          <span className="icq__botoes">
            <i>_</i>
            <i>×</i>
          </span>
        </div>

        <div className="icq__eu">
          <Flor estado={meuEstado} piscando={piscando} />
          <div>
            <p className="icq__uin">#{UIN_PROPRIO}</p>
            <select
              value={meuEstado}
              onChange={(e) => setMeuEstado(e.target.value)}
              aria-label="Seu status"
            >
              {Object.entries(ROTULO).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        </div>

        <ul className="icq__lista">
          {CONTATOS.map((c) => (
            <li key={c.uin}>
              <button
                type="button"
                className={`icq__contato is-${c.estado} ${aberto === c.uin ? 'is-aberto' : ''}`}
                onClick={() => setAberto(c.uin)}
              >
                <Flor estado={c.estado} pequena />
                <span className="icq__nome">{c.nome}</span>
                <span className="icq__numero">{c.uin}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="icq__rodape">
          <button type="button" onClick={receber} className="icq__testar">
            receber mensagem (com som)
          </button>
        </div>
      </div>

      <div className="icq__janela icq__conversa">
        <div className="icq__barra">
          <span>Marcela · #1029384</span>
          <span className="icq__botoes">
            <i>_</i>
            <i>×</i>
          </span>
        </div>

        <div className="icq__historico">
          {conversa.map((m, i) => (
            <p key={i} className={m.de === 'eu' ? 'icq__msg icq__msg--eu' : 'icq__msg'}>
              <b>{m.de === 'eu' ? 'Você' : 'Marcela'}:</b> {m.texto}
            </p>
          ))}
        </div>

        <form onSubmit={enviar} className="icq__escrever">
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            rows={3}
            maxLength={200}
            aria-label="Mensagem"
            placeholder="digite e clique em Send"
          />
          <button type="submit" disabled={!texto.trim()}>
            Send
          </button>
        </form>
      </div>

      <p className="icq__dica">
        repare nos números embaixo de cada nome: era isso que você era na rede. um UIN de
        sete dígitos valia mais que um de oito.
      </p>
    </div>
  )
}

/** A flor: verde quando disponível, vermelha quando não. Desenhada em CSS. */
function Flor({
  estado,
  pequena = false,
  piscando = false,
}: {
  estado: string
  pequena?: boolean
  piscando?: boolean
}) {
  return (
    <span
      className={`flor is-${estado} ${pequena ? 'flor--p' : ''} ${piscando ? 'is-piscando' : ''}`}
      aria-label={ROTULO[estado]}
      role="img"
    >
      <i />
      <i />
      <i />
      <i />
      <b />
    </span>
  )
}
