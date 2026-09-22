import { useEffect, useRef, useState } from 'react'
import './lanhouse.css'

/**
 * Sala — Lan house (2004).
 *
 * A PERGUNTA:
 *   como era acessar a internet pagando por hora, num salão, junto com
 *   mais vinte pessoas — que foi como metade do Brasil entrou na rede?
 *
 * Um salão com oito máquinas. Sente em qualquer uma e ela leva a outra peça
 * do museu — era exatamente esse o papel da lan house: não era um lugar com
 * computador, era o lugar de onde se acessava tudo.
 *
 * O relógio de tempo contratado corre de verdade, e quando acaba a tela
 * apaga. Era assim: você pagava por hora e o balcão desligava.
 */

type Maquina = {
  n: number
  sala: string | null
  rotulo: string
  ocupada: boolean
}

const MAQUINAS: Maquina[] = [
  { n: 1, sala: 'orkut', rotulo: 'Orkut', ocupada: false },
  { n: 2, sala: 'msn', rotulo: 'MSN Messenger', ocupada: false },
  { n: 3, sala: null, rotulo: 'Counter-Strike', ocupada: true },
  { n: 4, sala: 'fotolog', rotulo: 'Fotolog', ocupada: false },
  { n: 5, sala: null, rotulo: 'Counter-Strike', ocupada: true },
  { n: 6, sala: 'flash', rotulo: 'Jogos em Flash', ocupada: false },
  { n: 7, sala: 'youtube', rotulo: 'Vídeos', ocupada: false },
  { n: 8, sala: 'blogs', rotulo: 'Blog da pessoa', ocupada: false },
]

const MINUTOS_CONTRATADOS = 60

export function Lanhouse() {
  const [sentado, setSentado] = useState<number | null>(null)
  const [segundos, setSegundos] = useState(MINUTOS_CONTRATADOS * 60)
  const [barulho, setBarulho] = useState(false)
  const ctxRef = useRef<AudioContext | null>(null)
  const pararRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    const id = setInterval(() => setSegundos((s) => Math.max(0, s - 1)), 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(
    () => () => {
      pararRef.current?.()
      void ctxRef.current?.close()
      ctxRef.current = null
    },
    [],
  )

  // O barulho: ruído rosa contínuo (ventoinha e conversa) com estalos
  // ocasionais de teclado mecânico. Sintetizado, como todo som do museu.
  useEffect(() => {
    if (!barulho) {
      pararRef.current?.()
      pararRef.current = null
      return
    }
    const ctx = ctxRef.current ?? new AudioContext()
    ctxRef.current = ctx
    void ctx.resume()

    const amostras = ctx.sampleRate * 2
    const buffer = ctx.createBuffer(1, amostras, ctx.sampleRate)
    const dados = buffer.getChannelData(0)
    let ultimo = 0
    for (let i = 0; i < amostras; i++) {
      const branco = Math.random() * 2 - 1
      ultimo = (ultimo + 0.02 * branco) / 1.02
      dados[i] = ultimo * 3.5
    }

    const fonte = ctx.createBufferSource()
    fonte.buffer = buffer
    fonte.loop = true

    const filtro = ctx.createBiquadFilter()
    filtro.type = 'lowpass'
    filtro.frequency.value = 900

    const g = ctx.createGain()
    g.gain.value = 0.08

    fonte.connect(filtro).connect(g).connect(ctx.destination)
    fonte.start()

    // Teclas ao fundo, de vez em quando.
    const teclas = setInterval(() => {
      const t = ctx.currentTime
      const n = Math.floor(ctx.sampleRate * 0.02)
      const b = ctx.createBuffer(1, n, ctx.sampleRate)
      const d = b.getChannelData(0)
      for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 9)
      const f = ctx.createBufferSource()
      f.buffer = b
      const bp = ctx.createBiquadFilter()
      bp.type = 'bandpass'
      bp.frequency.value = 2600
      const gg = ctx.createGain()
      gg.gain.value = 0.05
      f.connect(bp).connect(gg).connect(ctx.destination)
      f.start(t)
    }, 260)

    pararRef.current = () => {
      clearInterval(teclas)
      try {
        fonte.stop()
      } catch {
        /* já parou */
      }
    }
    return () => {
      clearInterval(teclas)
      try {
        fonte.stop()
      } catch {
        /* já parou */
      }
    }
  }, [barulho])

  const acabou = segundos === 0
  const mm = Math.floor(segundos / 60)
  const ss = segundos % 60
  const maquina = sentado ? MAQUINAS.find((m) => m.n === sentado) : null

  return (
    <div className="lan">
      <div className="lan__balcao">
        <div className="lan__ficha">
          <span className="lan__ficha-rotulo">tempo contratado</span>
          <span className={`lan__relogio ${segundos < 300 ? 'is-pouco' : ''}`}>
            {String(mm).padStart(2, '0')}:{String(ss).padStart(2, '0')}
          </span>
        </div>
        <div className="lan__balcao-info">
          <p>
            <b>R$ 2,00</b> a hora · máquina {sentado ?? '—'}
          </p>
          <p className="lan__balcao-nota">
            {acabou
              ? 'seu tempo acabou. o balcão desligou a máquina.'
              : 'quando o tempo acaba, a tela apaga do balcão. sem aviso.'}
          </p>
        </div>
        <button
          type="button"
          className={`lan__som ${barulho ? 'is-ligado' : ''}`}
          onClick={() => setBarulho(!barulho)}
        >
          {barulho ? '■ silenciar o salão' : '▶ ouvir o salão'}
        </button>
      </div>

      <div className={`lan__salao ${acabou ? 'is-apagado' : ''}`}>
        {MAQUINAS.map((m) => (
          <button
            key={m.n}
            type="button"
            className={`lan__pc ${sentado === m.n ? 'is-sentado' : ''} ${m.ocupada ? 'is-ocupada' : ''}`}
            onClick={() => !m.ocupada && !acabou && setSentado(m.n)}
            disabled={m.ocupada || acabou}
          >
            <span className="lan__monitor">
              <span className="lan__tela">{acabou ? '' : m.ocupada ? 'em uso' : m.rotulo}</span>
            </span>
            <span className="lan__gabinete" aria-hidden />
            <span className="lan__numero">{m.n}</span>
          </button>
        ))}
      </div>

      {maquina && !acabou && (
        <div className="lan__sentado">
          <p>
            Você sentou na <b>máquina {maquina.n}</b>. O fone está sujo, o mouse tem o fio
            enrolado e alguém deixou o Orkut aberto.
          </p>
          {maquina.sala && (
            <a className="lan__ir" href={`#${maquina.sala}`}>
              usar esta máquina → {maquina.rotulo}
            </a>
          )}
        </div>
      )}

      <p className="lan__dica">
        as máquinas 3 e 5 estão ocupadas — sempre estavam, e sempre com o mesmo jogo. as
        outras levam a outras salas do museu.
      </p>
    </div>
  )
}
