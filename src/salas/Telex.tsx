import { useEffect, useRef, useState } from 'react'
import { bits, codificar, decodificar, RESPOSTA_AUTOMATICA, type Simbolo } from '../museu/ita2'
import './telex.css'

/**
 * Sala — Telex (Rede Nacional da Embratel, a partir de 1975).
 *
 * A PERGUNTA:
 *   como era mandar uma mensagem escrita à distância quando ela saía
 *   impressa em papel do outro lado, e valia como documento?
 *
 * A codificação é ITA2 de verdade, verificada em scripts/smoke-ita2.ts.
 * O visitante vê os cinco bits de cada caractere saindo na linha, e vê as
 * trocas de tabela — LTRS e FIGS — aparecendo sozinhas quando a mensagem
 * passa de letra para número.
 *
 * O botão de defeito reproduz a falha clássica: uma troca se perde na linha e
 * o número do pedido chega como palavra sem sentido.
 */

const VELOCIDADE_MS = 90 // 50 bauds dava ~6,7 caracteres por segundo

export function Telex() {
  const [rascunho, setRascunho] = useState('PEDIDO 4521 CONFIRMADO\nEMBARQUE DIA 12 AS 9 HORAS')
  const [fita, setFita] = useState<Simbolo[]>([])
  const [ate, setAte] = useState(0)
  const [comDefeito, setComDefeito] = useState(false)
  const [papel, setPapel] = useState<string[]>([
    'TELEX NACIONAL - EMBRATEL',
    'TERMINAL 11234 IMPBR BR',
    '',
  ])
  const timerRef = useRef<number | null>(null)
  const ctxRef = useRef<AudioContext | null>(null)
  const papelRef = useRef<HTMLDivElement>(null)

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current)
    void ctxRef.current?.close()
  }, [])

  useEffect(() => {
    papelRef.current?.scrollTo({ top: papelRef.current.scrollHeight })
  }, [papel, ate])

  function clack() {
    const ctx = ctxRef.current ?? new AudioContext()
    ctxRef.current = ctx
    void ctx.resume()
    const t = ctx.currentTime
    const n = Math.floor(ctx.sampleRate * 0.03)
    const buffer = ctx.createBuffer(1, n, ctx.sampleRate)
    const d = buffer.getChannelData(0)
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 8)
    const fonte = ctx.createBufferSource()
    fonte.buffer = buffer
    const filtro = ctx.createBiquadFilter()
    filtro.type = 'bandpass'
    filtro.frequency.value = 1900
    filtro.Q.value = 1.1
    const g = ctx.createGain()
    g.gain.value = 0.18
    fonte.connect(filtro).connect(g).connect(ctx.destination)
    fonte.start(t)
  }

  function transmitir(texto: string) {
    if (timerRef.current) clearInterval(timerRef.current)
    const simbolos = codificar(texto)
    setFita(simbolos)
    setAte(0)

    let i = 0
    const id = window.setInterval(() => {
      i++
      setAte(i)
      if (simbolos[i - 1]?.tipo === 'caractere') clack()
      if (i >= simbolos.length) {
        clearInterval(id)
        const recebido = decodificar(simbolos, comDefeito)
        setPapel((p) => [...p, ...recebido.split('\n'), ''])
      }
    }, VELOCIDADE_MS)
    timerRef.current = id
  }

  function perguntarQuemEh() {
    setPapel((p) => [...p, 'WRU?', RESPOSTA_AUTOMATICA, ''])
    clack()
  }

  const emTransmissao = ate > 0 && ate < fita.length

  return (
    <div className="telex">
      <div className="telex__maquina">
        <div className="telex__cabecote">
          <span className="telex__rotulo">TELEIMPRESSOR</span>
          <span className={`telex__lampada ${emTransmissao ? 'is-ativa' : ''}`} aria-hidden />
          <span className="telex__rotulo-fraco">
            {emTransmissao ? 'TRANSMITINDO' : 'PRONTO'}
          </span>
        </div>

        <div className="telex__papel" ref={papelRef}>
          {papel.map((linha, i) => (
            <div key={i} className="telex__linha-papel">
              {linha || ' '}
            </div>
          ))}
          {emTransmissao && (
            <div className="telex__linha-papel telex__linha-papel--vivo">
              {decodificar(fita.slice(0, ate), false)}
              <span className="telex__cursor">▌</span>
            </div>
          )}
        </div>
      </div>

      <div className="telex__linha-bits">
        <span className="telex__rotulo-fraco">na linha, 5 bits por caractere</span>
        <div className="telex__bits">
          {fita.slice(Math.max(0, ate - 14), ate).map((s, i) => (
            <span
              key={i}
              className={`telex__bit ${
                s.tipo === 'troca-figuras' ? 'is-figs' : s.tipo === 'troca-letras' ? 'is-ltrs' : ''
              }`}
            >
              <b>{bits(s.codigo)}</b>
              <i>
                {s.tipo === 'troca-figuras'
                  ? 'FIGS'
                  : s.tipo === 'troca-letras'
                    ? 'LTRS'
                    : s.tipo === 'espaco'
                      ? '␣'
                      : s.tipo === 'nova-linha'
                        ? 'CR'
                        : s.impresso}
              </i>
            </span>
          ))}
          {fita.length === 0 && <span className="telex__bits-vazio">aguardando mensagem</span>}
        </div>
      </div>

      <div className="telex__mesa">
        <textarea
          value={rascunho}
          onChange={(e) => setRascunho(e.target.value)}
          rows={3}
          maxLength={200}
          spellCheck={false}
          aria-label="Mensagem a transmitir"
        />
        <div className="telex__acoes">
          <button type="button" onClick={() => transmitir(rascunho)} disabled={emTransmissao}>
            transmitir
          </button>
          <button type="button" onClick={perguntarQuemEh} disabled={emTransmissao}>
            WRU — quem é você?
          </button>
          <label className="telex__defeito">
            <input
              type="checkbox"
              checked={comDefeito}
              onChange={(e) => setComDefeito(e.target.checked)}
            />
            perder uma troca de tabela na linha
          </label>
        </div>
      </div>

      <p className="telex__nota">
        marque a caixa e transmita de novo: o número do pedido chega como palavra sem
        sentido. era o defeito mais temido do telex.
      </p>
    </div>
  )
}
