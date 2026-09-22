import { useCallback, useEffect, useRef, useState } from 'react'
import './msn.css'

/**
 * Sala — MSN Messenger (1999–2013). Implementação de referência do museu.
 *
 * A PERGUNTA:
 *   como era conversar quando a conversa dependia de os dois estarem online ao
 *   mesmo tempo — e a linha podia cair no meio?
 *
 * O ARCO:
 *   a conversa começa no meio, ela responde de verdade, e termina do único
 *   jeito que terminava: a mãe dela precisa do telefone, a linha cai, o
 *   contato fica cinza. Você pode reconectar, e aí recomeça.
 *
 * Tudo aqui — sons, emoticons, o tremor do zumbido — é sintetizado ou
 * desenhado. Nenhum arquivo de terceiro. Ver docs/PADRAO-DE-SALA.md.
 */

type Autor = 'eu' | 'ela' | 'sistema'
type Msg = { id: number; de: Autor; texto: string; hora: string }

const ELA = '»ĴŮĹĨÃÑÃ«'
const EU = 'ÇãŘŐĹ'

const CONTATOS = [
  { nome: '»ĴŮĹĨÃÑÃ« ♥ só quem sente sabe...', estado: 'disponivel' },
  { nome: 'R@f@ ][ estudando p prova ][', estado: 'ocupado' },
  { nome: 'ThAíS ♫ ouvindo musica ♫', estado: 'disponivel' },
  { nome: 'Bruno', estado: 'offline' },
  { nome: 'Camila (volto logo)', estado: 'ausente' },
]

const ROTULO: Record<string, string> = {
  disponivel: 'Disponível',
  ocupado: 'Ocupado',
  ausente: 'Volto logo',
  offline: 'Offline',
}

/** Emoticons desenhados em CSS. O código de texto vira carinha ao enviar. */
const EMOTICONS: { codigo: string; tipo: string; nome: string }[] = [
  { codigo: ':)', tipo: 'sorriso', nome: 'sorriso' },
  { codigo: ':(', tipo: 'triste', nome: 'triste' },
  { codigo: ';)', tipo: 'piscada', nome: 'piscada' },
  { codigo: ':D', tipo: 'risada', nome: 'risada' },
  { codigo: ':P', tipo: 'lingua', nome: 'língua' },
  { codigo: '(L)', tipo: 'coracao', nome: 'coração' },
]

/**
 * As respostas dela. Não é conversa inteligente e não precisa ser: é uma
 * pessoa de 2005 respondendo do outro lado de uma linha discada.
 */
const RESPOSTAS: { quando: RegExp; diz: string[] }[] = [
  { quando: /\b(oi|ola|olá|eae|e ai|e aí)\b/i, diz: ['oi!! td bem?', 'oieee'] },
  { quando: /\b(tudo bem|td bem|como vc|como voce|como você)\b/i, diz: ['to bem, só com sono', 'mais ou menos, prova amanha :('] },
  { quando: /\b(prova|trabalho|escola|aula|dever)\b/i, diz: ['nem me fala, nao estudei nada', 'vc fez a parte 2? me manda dps'] },
  { quando: /\b(musica|música|som|cd|mp3)\b/i, diz: ['to ouvindo aquela q vc me passou', 'me passa o link dps'] },
  { quando: /\b(foto|fotolog|orkut)\b/i, diz: ['postei foto nova no fotolog, vai la', 'vi teu orkut, deixei recado'] },
  { quando: /\b(sabado|sábado|festa|sair|role|rolê)\b/i, diz: ['vc vai?? me fala q eu vou tbm', 'minha mae ainda nao deixou :('] },
  { quando: /\?$/, diz: ['acho q sim', 'sei la kkk', 'nao sei, pq?'] },
]

const GENERICAS = [
  'kkkkk',
  'serio??',
  'nossa',
  'sei',
  'aham',
  'ta bom então',
  'nem acredito',
  'vc é muito doida',
]

/** Depois de tantas trocas, a linha cai. É o fim da sala. */
const TROCAS_ATE_CAIR = 7

export function Msn() {
  const [mensagens, setMensagens] = useState<Msg[]>([
    { id: 1, de: 'ela', texto: 'oi sumido!!', hora: '21:14' },
    { id: 2, de: 'eu', texto: 'oi! tava sem net, a linha caiu', hora: '21:14' },
    { id: 3, de: 'ela', texto: 'ahh sei... vc fez o trabalho de historia?', hora: '21:15' },
  ])
  const [texto, setTexto] = useState('')
  const [tremendo, setTremendo] = useState(false)
  const [digitando, setDigitando] = useState(false)
  const [meuEstado, setMeuEstado] = useState('disponivel')
  const [elaOnline, setElaOnline] = useState(true)
  const [paletaAberta, setPaletaAberta] = useState(false)

  // Conta as trocas até a linha cair. É referência e não estado porque nada
  // na tela depende deste número — ele só decide quando a sala termina.
  const trocas = useRef(0)

  const ctxRef = useRef<AudioContext | null>(null)
  const proximoId = useRef(4)
  const fimRef = useRef<HTMLDivElement>(null)
  const entradaRef = useRef<HTMLTextAreaElement>(null)
  const timersRef = useRef<number[]>([])

  useEffect(
    () => () => {
      timersRef.current.forEach(clearTimeout)
      void ctxRef.current?.close()
      ctxRef.current = null
    },
    [],
  )

  useEffect(() => {
    fimRef.current?.scrollIntoView({ block: 'nearest' })
  }, [mensagens, digitando])

  const contexto = useCallback(() => {
    const ctx = ctxRef.current ?? new AudioContext()
    ctxRef.current = ctx
    void ctx.resume()
    return ctx
  }, [])

  /** Duas notas curtas: mensagem chegando. */
  const somRecebida = useCallback(() => {
    const ctx = contexto()
    const t = ctx.currentTime
    for (const [hz, atraso] of [
      [880, 0],
      [1175, 0.09],
    ] as [number, number][]) {
      const osc = ctx.createOscillator()
      const g = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.value = hz
      g.gain.setValueAtTime(0.0001, t + atraso)
      g.gain.exponentialRampToValueAtTime(0.14, t + atraso + 0.012)
      g.gain.exponentialRampToValueAtTime(0.0001, t + atraso + 0.16)
      osc.connect(g).connect(ctx.destination)
      osc.start(t + atraso)
      osc.stop(t + atraso + 0.2)
    }
  }, [contexto])

  /** Um toque seco: mensagem saindo. */
  const somEnviada = useCallback(() => {
    const ctx = contexto()
    const t = ctx.currentTime
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(1320, t)
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(0.06, t + 0.008)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09)
    osc.connect(g).connect(ctx.destination)
    osc.start(t)
    osc.stop(t + 0.11)
  }, [contexto])

  /** Dente-de-serra descendente com tremolo: o zumbido. */
  const somZumbido = useCallback(() => {
    const ctx = contexto()
    const t = ctx.currentTime
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    const tremolo = ctx.createOscillator()
    const tremoloGanho = ctx.createGain()

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(320, t)
    osc.frequency.exponentialRampToValueAtTime(110, t + 0.55)

    tremolo.type = 'sine'
    tremolo.frequency.value = 22
    tremoloGanho.gain.value = 0.16
    tremolo.connect(tremoloGanho).connect(g.gain)

    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(0.22, t + 0.02)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.6)

    const filtro = ctx.createBiquadFilter()
    filtro.type = 'lowpass'
    filtro.frequency.value = 1400

    osc.connect(filtro).connect(g).connect(ctx.destination)
    osc.start(t)
    tremolo.start(t)
    osc.stop(t + 0.62)
    tremolo.stop(t + 0.62)
  }, [contexto])

  function agendar(fn: () => void, ms: number) {
    const id = window.setTimeout(fn, ms)
    timersRef.current.push(id)
  }

  function adicionar(de: Autor, texto: string) {
    setMensagens((m) => [...m, { id: proximoId.current++, de, texto, hora: agora() }])
  }

  function responder(aoQue: string) {
    const achada = RESPOSTAS.find((r) => r.quando.test(aoQue))
    const opcoes = achada ? achada.diz : GENERICAS
    const resposta = opcoes[Math.floor(Math.random() * opcoes.length)]

    // Ela digitava devagar, e você via "está digitando" antes de cada frase.
    agendar(() => setDigitando(true), 700)
    agendar(() => {
      setDigitando(false)
      adicionar('ela', resposta)
      somRecebida()

      trocas.current += 1
      if (trocas.current >= TROCAS_ATE_CAIR) derrubarLinha()
    }, 700 + 1200 + resposta.length * 45)
  }

  /** O fim da sala. Era sempre assim que acabava. */
  function derrubarLinha() {
    agendar(() => {
      setDigitando(true)
    }, 1800)
    agendar(() => {
      setDigitando(false)
      adicionar('ela', 'minha mae precisa do telefone, ja volto!!')
      somRecebida()
    }, 3600)
    agendar(() => {
      adicionar('sistema', `${ELA} está offline. A mensagem pode não ter sido recebida.`)
      setElaOnline(false)
    }, 5600)
  }

  function enviar() {
    const limpo = texto.trim()
    if (!limpo || !elaOnline) return
    adicionar('eu', limpo)
    somEnviada()
    setTexto('')
    setPaletaAberta(false)
    entradaRef.current?.focus()
    responder(limpo)
  }

  function zumbir() {
    if (!elaOnline) return
    somZumbido()
    setTremendo(true)
    agendar(() => setTremendo(false), 600)
    adicionar('sistema', 'Você enviou um zumbido.')
    responder('zumbido')
  }

  function reconectar() {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
    setMensagens([
      { id: proximoId.current++, de: 'sistema', texto: `${ELA} está online.`, hora: agora() },
      { id: proximoId.current++, de: 'ela', texto: 'voltei! a linha caiu de novo né', hora: agora() },
    ])
    setElaOnline(true)
    trocas.current = 0
    setDigitando(false)
    entradaRef.current?.focus()
  }

  function inserir(codigo: string) {
    setTexto((t) => `${t}${t && !t.endsWith(' ') ? ' ' : ''}${codigo} `)
    setPaletaAberta(false)
    entradaRef.current?.focus()
  }

  return (
    <div className="msn">
      {/* ---- lista de contatos ---- */}
      <section className="msn__lista janela" aria-label="Lista de contatos">
        <div className="janela__barra">
          <span>Carolina — Windows Messenger</span>
          <span className="janela__botoes" aria-hidden="true">
            <i>_</i>
            <i>□</i>
            <i>×</i>
          </span>
        </div>

        <div className="msn__eu">
          <span className="msn__avatar" aria-hidden="true">
            C
          </span>
          <div className="msn__eu-dados">
            <p className="msn__meu-nome">{EU} ♥ (nao sei o q dizer)</p>
            <label className="msn__status-rotulo" htmlFor="msn-status">
              meu status
            </label>
            <select
              id="msn-status"
              value={meuEstado}
              onChange={(e) => setMeuEstado(e.target.value)}
              className="msn__status"
            >
              {Object.entries(ROTULO).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        </div>

        <ul className="msn__contatos">
          {CONTATOS.map((c, i) => {
            const estado = i === 0 && !elaOnline ? 'offline' : c.estado
            return (
              <li key={c.nome} className={`msn__contato is-${estado}`}>
                <span className="msn__bolinha" aria-hidden="true" />
                <span className="msn__contato-nome">{c.nome}</span>
                <span className="msn__vo">{ROTULO[estado]}</span>
              </li>
            )
          })}
        </ul>
      </section>

      {/* ---- conversa ---- */}
      <section
        className={`msn__conversa janela ${tremendo ? 'is-tremendo' : ''}`}
        aria-label="Janela de conversa"
      >
        <div className="janela__barra">
          <span>{ELA} — Conversa</span>
          <span className="janela__botoes" aria-hidden="true">
            <i>_</i>
            <i>□</i>
            <i>×</i>
          </span>
        </div>

        <p className="msn__topo-conversa">
          Para: <b>{ELA}</b>
          {!elaOnline && <em className="msn__caiu"> · offline</em>}
        </p>

        <div className="msn__historico" role="log" aria-live="polite" aria-relevant="additions">
          {mensagens.map((m) =>
            m.de === 'sistema' ? (
              <p key={m.id} className="msn__sistema">
                {m.texto}
              </p>
            ) : (
              <p key={m.id} className="msn__msg">
                <span className={m.de === 'eu' ? 'msn__quem msn__quem--eu' : 'msn__quem'}>
                  {m.de === 'eu' ? EU : ELA} diz:
                </span>
                <span className="msn__hora">{m.hora}</span>
                <br />
                <Texto conteudo={m.texto} />
              </p>
            ),
          )}
          {digitando && (
            <p className="msn__digitando">{ELA} está digitando uma mensagem…</p>
          )}
          <div ref={fimRef} />
        </div>

        {elaOnline ? (
          <form
            className="msn__escrever"
            onSubmit={(e) => {
              e.preventDefault()
              enviar()
            }}
          >
            {paletaAberta && (
              <div className="msn__paleta" role="group" aria-label="Emoticons">
                {EMOTICONS.map((e) => (
                  <button
                    key={e.codigo}
                    type="button"
                    onClick={() => inserir(e.codigo)}
                    aria-label={`Inserir ${e.nome}`}
                    title={e.codigo}
                  >
                    <Carinha tipo={e.tipo} />
                  </button>
                ))}
              </div>
            )}

            <label className="msn__vo" htmlFor="msn-texto">
              Escreva sua mensagem
            </label>
            <textarea
              id="msn-texto"
              ref={entradaRef}
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  enviar()
                }
              }}
              rows={2}
              maxLength={200}
              placeholder="digite e aperte Enter"
            />

            <div className="msn__acoes">
              <button
                type="button"
                className="msn__emoticon-botao"
                onClick={() => setPaletaAberta(!paletaAberta)}
                aria-expanded={paletaAberta}
              >
                <Carinha tipo="sorriso" />
                <span className="msn__vo">emoticons</span>
              </button>
              <button type="button" className="msn__zumbir" onClick={zumbir}>
                zumbido
              </button>
              <button type="submit" disabled={!texto.trim()}>
                enviar
              </button>
            </div>
          </form>
        ) : (
          <div className="msn__caiu-aviso">
            <p>
              A linha caiu. Era assim que quase toda conversa terminava — sem despedida, no
              meio de uma frase, porque alguém em casa precisava do telefone.{' '}
              <a href="#discada">Ouça como era discar →</a>
            </p>
            <button type="button" onClick={reconectar}>
              discar de novo
            </button>
          </div>
        )}
      </section>

      <p className="msn__nota">
        escreva alguma coisa e ela responde. tem <b>zumbido</b> e tem emoticon — os dois com
        som. a conversa acaba sozinha, e o motivo faz parte da peça.
      </p>
    </div>
  )
}

/** Converte os códigos de emoticon em carinhas, preservando o resto do texto. */
function Texto({ conteudo }: { conteudo: string }) {
  const padrao = /(\(L\)|:\)|:\(|;\)|:D|:P)/g
  const partes = conteudo.split(padrao)
  return (
    <>
      {partes.map((parte, i) => {
        const achado = EMOTICONS.find((e) => e.codigo === parte)
        return achado ? (
          <Carinha key={i} tipo={achado.tipo} nome={achado.nome} />
        ) : (
          <span key={i}>{parte}</span>
        )
      })}
    </>
  )
}

function Carinha({ tipo, nome }: { tipo: string; nome?: string }) {
  return (
    <span
      className={`carinha carinha--${tipo}`}
      role={nome ? 'img' : undefined}
      aria-label={nome}
      aria-hidden={nome ? undefined : 'true'}
    />
  )
}

function agora() {
  return new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date())
}
