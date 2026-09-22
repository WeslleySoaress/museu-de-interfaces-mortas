import { useEffect, useRef, useState } from 'react'
import { COLUNAS, LINHAS, normalizar, perfurar } from '../museu/hollerith'
import './cartao.css'

/**
 * Sala — o cartão perfurado (IBM, 80 colunas).
 *
 * A PERGUNTA:
 *   como era programar quando o programa era um objeto físico que
 *   você entregava no balcão e buscava horas depois?
 *
 * A codificação é Hollerith de verdade, verificada em scripts/smoke-hollerith.ts:
 * perfura e lê de volta. Digite e veja os furos aparecerem — cada coluna guarda
 * um caractere, e a posição dos furos É o caractere.
 *
 * O som do soco é sintetizado: um estalo curto de ruído filtrado, que é a
 * família de timbre de uma perfuradora eletromecânica.
 */

const EXEMPLOS = [
  'BANCO DO BRASIL SA',
  'FOLHA PAGAMENTO 03/1974',
  'JOSE DA SILVA - SAO PAULO',
  'LOTE 00123 VALOR 45.678,90',
]

export function Cartao() {
  const [texto, setTexto] = useState('PROCESSAMENTO DE DADOS')
  const ctxRef = useRef<AudioContext | null>(null)

  // Fecha o contexto de áudio ao sair da sala: sem isso, cada visita deixa um
  // contexto vivo e o navegador acaba recusando novos.
  useEffect(
    () => () => {
      void ctxRef.current?.close()
      ctxRef.current = null
    },
    [],
  )

  function estalo() {
    const ctx = ctxRef.current ?? new AudioContext()
    ctxRef.current = ctx
    void ctx.resume()

    const t = ctx.currentTime
    const amostras = Math.floor(ctx.sampleRate * 0.04)
    const buffer = ctx.createBuffer(1, amostras, ctx.sampleRate)
    const dados = buffer.getChannelData(0)
    for (let i = 0; i < amostras; i++) {
      // decaimento rápido: soco mecânico, não zumbido
      dados[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / amostras, 6)
    }

    const fonte = ctx.createBufferSource()
    fonte.buffer = buffer

    const filtro = ctx.createBiquadFilter()
    filtro.type = 'bandpass'
    filtro.frequency.value = 2400
    filtro.Q.value = 0.9

    const ganho = ctx.createGain()
    ganho.gain.value = 0.25

    fonte.connect(filtro).connect(ganho).connect(ctx.destination)
    fonte.start(t)
  }

  function digitar(valor: string) {
    if (valor.length > texto.length) estalo()
    setTexto(valor.slice(0, COLUNAS))
  }

  const colunas = perfurar(texto)
  const impresso = normalizar(texto)

  return (
    <div className="cartao">
      <div className="cartao__controles">
        <label htmlFor="cartao-texto">perfurar</label>
        <input
          id="cartao-texto"
          value={texto}
          onChange={(e) => digitar(e.target.value)}
          maxLength={COLUNAS}
          spellCheck={false}
          autoComplete="off"
        />
        <span className="cartao__contador">
          {impresso.trimEnd().length}/{COLUNAS}
        </span>
      </div>

      <div className="cartao__exemplos">
        {EXEMPLOS.map((e) => (
          <button key={e} type="button" onClick={() => setTexto(e)}>
            {e}
          </button>
        ))}
      </div>

      <div className="cartao__rolagem">
        <div className="cartao__papel">
          <div className="cartao__impresso">
            {Array.from({ length: COLUNAS }, (_, i) => (
              <span key={i}>{impresso[i] ?? ' '}</span>
            ))}
          </div>

          <div className="cartao__grade">
            {LINHAS.map((linha) => (
              <div className="cartao__linha" key={linha}>
                {colunas.map((furos, i) => {
                  const perfurado = furos.includes(linha)
                  return (
                    <span
                      key={i}
                      className={`cartao__pos ${perfurado ? 'is-furo' : ''}`}
                      aria-hidden
                    >
                      {!perfurado && linha >= 0 && linha <= 9 ? linha : ''}
                    </span>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="cartao__legenda">
        as três linhas de cima são as zonas — 12, 11 e 0. letras de A a I usam a zona 12,
        de J a R a zona 11, de S a Z a zona 0. dígitos são um furo só.
      </p>
    </div>
  )
}
