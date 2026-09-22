import { useEffect, useRef, useState } from 'react'
import './celular.css'

/**
 * Sala — o celular antes do smartphone (2000).
 *
 * A PERGUNTA:
 *   como era escrever quando cada letra custava três toques e a
 *   mensagem tinha que caber em 160 caracteres?
 *
 * A digitação multi-toque funciona de verdade: aperte 2 uma vez para A, duas
 * para B, três para C. Se quiser duas letras da mesma tecla seguidas, espere
 * o cursor avançar — era exatamente essa a dança.
 *
 * Os toques são sintetizados. O monofônico toca uma nota por vez, que é a
 * definição dele; o polifônico toca três ao mesmo tempo. A diferença entre os
 * dois é audível e é a peça inteira.
 */

const TECLAS: Record<string, string> = {
  '1': '.,?!1',
  '2': 'ABC2',
  '3': 'DEF3',
  '4': 'GHI4',
  '5': 'JKL5',
  '6': 'MNO6',
  '7': 'PQRS7',
  '8': 'TUV8',
  '9': 'WXYZ9',
  '0': ' 0',
}

const LIMITE_SMS = 160
const ESPERA_MS = 900

// Melodias genéricas, escritas para esta peça: nada de terceiros.
const TOQUES = {
  monofonico: {
    nome: 'monofônico',
    notas: [523, 587, 659, 523, 659, 587, 523, 392] as number[],
    dur: 0.16,
  },
  polifonico: {
    nome: 'polifônico',
    notas: [523, 659, 784, 659, 523, 440, 523, 659] as number[],
    dur: 0.2,
  },
}

export function Celular() {
  const [texto, setTexto] = useState('')
  const [pendente, setPendente] = useState<{ tecla: string; vez: number } | null>(null)
  const [tocando, setTocando] = useState<keyof typeof TOQUES | null>(null)
  const ctxRef = useRef<AudioContext | null>(null)
  const timerRef = useRef<number | null>(null)
  const pararRef = useRef<(() => void) | null>(null)

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      pararRef.current?.()
      void ctxRef.current?.close()
      ctxRef.current = null
    },
    [],
  )

  function contexto() {
    const ctx = ctxRef.current ?? new AudioContext()
    ctxRef.current = ctx
    void ctx.resume()
    return ctx
  }

  /** O bipe curto de cada tecla. */
  function bipe() {
    const ctx = contexto()
    const t = ctx.currentTime
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    osc.type = 'square'
    osc.frequency.value = 1400
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(0.05, t + 0.005)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05)
    osc.connect(g).connect(ctx.destination)
    osc.start(t)
    osc.stop(t + 0.06)
  }

  function apertar(tecla: string) {
    if (texto.length >= LIMITE_SMS && !pendente) return
    bipe()
    const letras = TECLAS[tecla]
    if (!letras) return

    if (timerRef.current) clearTimeout(timerRef.current)

    if (pendente && pendente.tecla === tecla) {
      const vez = (pendente.vez + 1) % letras.length
      setTexto(texto.slice(0, -1) + letras[vez])
      setPendente({ tecla, vez })
    } else {
      setTexto(texto + letras[0])
      setPendente({ tecla, vez: 0 })
    }

    timerRef.current = window.setTimeout(() => setPendente(null), ESPERA_MS)
  }

  function apagar() {
    bipe()
    if (timerRef.current) clearTimeout(timerRef.current)
    setPendente(null)
    setTexto(texto.slice(0, -1))
  }

  function tocar(qual: keyof typeof TOQUES) {
    pararRef.current?.()
    if (tocando === qual) {
      setTocando(null)
      return
    }
    setTocando(qual)

    const ctx = contexto()
    const { notas, dur } = TOQUES[qual]
    const poli = qual === 'polifonico'
    let i = 0
    let parado = false

    const proxima = () => {
      if (parado) return
      const t = ctx.currentTime
      const base = notas[i % notas.length]
      const vozes = poli ? [base, base * 1.26, base * 1.5] : [base]

      for (const hz of vozes) {
        const osc = ctx.createOscillator()
        const g = ctx.createGain()
        osc.type = 'square'
        osc.frequency.value = hz
        g.gain.setValueAtTime(0.0001, t)
        g.gain.exponentialRampToValueAtTime(poli ? 0.035 : 0.07, t + 0.01)
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
        osc.connect(g).connect(ctx.destination)
        osc.start(t)
        osc.stop(t + dur + 0.02)
      }
      i++
    }

    proxima()
    const id = setInterval(proxima, dur * 1000)
    pararRef.current = () => {
      parado = true
      clearInterval(id)
    }
  }

  const restantes = LIMITE_SMS - texto.length

  return (
    <div className="cel">
      <div className="cel__aparelho">
        <div className="cel__alto-falante" aria-hidden />

        <div className="cel__tela">
          <div className="cel__status">
            <span aria-hidden>▂▄▆█</span>
            <span className="cel__operadora">OPERADORA</span>
            <span aria-hidden>▓▓▓░</span>
          </div>

          <div className="cel__mensagem">
            {texto || <span className="cel__vazio">escreva com as teclas</span>}
            <span className="cel__cursor">|</span>
          </div>

          <div className="cel__contagem">
            <span className={restantes < 20 ? 'is-pouco' : ''}>{restantes}</span>
            <span>1/1</span>
          </div>
        </div>

        <div className="cel__teclado">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((t) => (
            <button
              key={t}
              type="button"
              className={`cel__tecla ${pendente?.tecla === t ? 'is-ativa' : ''}`}
              onClick={() => (t === '*' || t === '#' ? apagar() : apertar(t))}
            >
              <b>{t === '*' ? '←' : t}</b>
              <i>{t === '*' ? 'apagar' : t === '#' ? '' : TECLAS[t]?.slice(0, -1) || ''}</i>
            </button>
          ))}
        </div>
      </div>

      <div className="cel__lado">
        <section>
          <h3>toques</h3>
          <p>
            a diferença entre os dois não é de qualidade: é de quantas notas soam ao mesmo
            tempo. uma, ou várias.
          </p>
          {(Object.keys(TOQUES) as (keyof typeof TOQUES)[]).map((k) => (
            <button
              key={k}
              type="button"
              className={`cel__toque ${tocando === k ? 'is-tocando' : ''}`}
              onClick={() => tocar(k)}
            >
              {tocando === k ? '■ parar' : '▶'} {TOQUES[k].nome}
            </button>
          ))}
        </section>

        <section>
          <h3>o limite de 160</h3>
          <p>
            não era escolha de produto. o SMS foi encaixado num campo de sinalização que já
            existia na rede de telefonia e que sobrava — cabiam 160 caracteres de 7 bits, e
            nem um a mais. A mensagem pegou carona num espaço vazio.
          </p>
        </section>

        <p className="cel__dica">
          aperte <b>2</b> três vezes seguidas para chegar no C. se quiser dois A seguidos,
          espere o cursor andar.
        </p>
      </div>
    </div>
  )
}
