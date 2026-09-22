import { useEffect, useRef, useState } from 'react'
import { codificarFita, PROGRAMA_MSX } from '../museu/fita'
import './fita.css'

/**
 * Sala — MSX e a fita cassete (1985).
 *
 * A PERGUNTA:
 *   como era carregar um programa quando os dados eram som, e você
 *   ficava ouvindo o computador ler?
 *
 * O áudio desta sala não é imitação: o programa listado na tela é codificado
 * em Kansas City Standard de verdade e tocado. O texto aparece em sincronia
 * com os bytes porque ele está literalmente sendo lido do som.
 */

type Estado = 'parado' | 'cabecalho' | 'carregando' | 'pronto' | 'rodando'

export function Fita() {
  const [estado, setEstado] = useState<Estado>('parado')
  const [bytesLidos, setBytesLidos] = useState(0)
  const ctxRef = useRef<AudioContext | null>(null)
  const fonteRef = useRef<AudioBufferSourceNode | null>(null)
  const quadroRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (quadroRef.current) cancelAnimationFrame(quadroRef.current)
      fonteRef.current?.stop()
      void ctxRef.current?.close()
    }
  }, [])

  function tocar() {
    parar()
    const ctx = new AudioContext()
    ctxRef.current = ctx

    const fita = codificarFita(ctx, PROGRAMA_MSX)
    const fonte = ctx.createBufferSource()
    fonte.buffer = fita.buffer

    // Um filtro passa-faixa deixa o som mais perto do alto-falante de um
    // gravador de fita doméstico, que não reproduzia graves nem agudos.
    const filtro = ctx.createBiquadFilter()
    filtro.type = 'bandpass'
    filtro.frequency.value = 1800
    filtro.Q.value = 0.7

    fonte.connect(filtro).connect(ctx.destination)
    fonteRef.current = fonte

    const t0 = ctx.currentTime
    fonte.start(t0)
    setEstado('cabecalho')

    const acompanhar = () => {
      const decorrido = ctx.currentTime - t0
      if (decorrido < fita.cabecalhoS) {
        setEstado('cabecalho')
      } else {
        const lidos = Math.floor((decorrido - fita.cabecalhoS) / fita.segundosPorByte)
        if (lidos >= fita.totalBytes) {
          setBytesLidos(fita.totalBytes)
          setEstado('pronto')
          return
        }
        setBytesLidos(lidos)
        setEstado('carregando')
      }
      quadroRef.current = requestAnimationFrame(acompanhar)
    }
    quadroRef.current = requestAnimationFrame(acompanhar)
  }

  function parar() {
    if (quadroRef.current) cancelAnimationFrame(quadroRef.current)
    try {
      fonteRef.current?.stop()
    } catch {
      /* já parou */
    }
    void ctxRef.current?.close()
    ctxRef.current = null
    fonteRef.current = null
    setBytesLidos(0)
    setEstado('parado')
  }

  const listagem = PROGRAMA_MSX.slice(0, bytesLidos)

  return (
    <div className="fita">
      <div className="fita__gravador">
        <div className="fita__carretel">
          <span className={`fita__roda ${estado !== 'parado' && estado !== 'pronto' ? 'is-girando' : ''}`} />
          <span className="fita__janela">
            <span className="fita__etiqueta">CIDADE PERDIDA · LADO A</span>
          </span>
          <span className={`fita__roda ${estado !== 'parado' && estado !== 'pronto' ? 'is-girando' : ''}`} />
        </div>
        <div className="fita__botoes">
          <button type="button" onClick={tocar} disabled={estado !== 'parado' && estado !== 'pronto'}>
            ▶ play
          </button>
          <button type="button" onClick={parar} disabled={estado === 'parado'}>
            ■ stop
          </button>
          <span className="fita__contador">
            {String(Math.min(999, bytesLidos)).padStart(3, '0')}
          </span>
        </div>
      </div>

      <div className="fita__msx">
        <pre className="fita__tela">
{`MSX BASIC version 1.0
Copyright 1985 by Microsoft
28815 Bytes free

Ok
bload"cas:",r
`}
          {estado === 'cabecalho' && 'Found:CIDADE\n'}
          {(estado === 'carregando' || estado === 'pronto' || estado === 'rodando') && (
            <>
              {'Found:CIDADE\n\n'}
              <span className="fita__listagem">{listagem}</span>
              {estado === 'carregando' && <span className="fita__cursor">█</span>}
            </>
          )}
          {estado === 'pronto' && '\nOk\n'}
        </pre>

        {estado === 'parado' && (
          <p className="fita__dica">aperte ▶ play. com som — o áudio É o programa.</p>
        )}
      </div>

      <div className="fita__medidor">
        <span className="fita__medidor-rotulo">sinal</span>
        <span className="fita__medidor-trilho">
          <span
            className={`fita__medidor-nivel ${estado === 'cabecalho' ? 'is-tom' : ''} ${
              estado === 'carregando' ? 'is-dados' : ''
            }`}
          />
        </span>
        <span className="fita__medidor-estado">
          {estado === 'parado' && 'fita parada'}
          {estado === 'cabecalho' && '2400 Hz contínuo — sincronizando'}
          {estado === 'carregando' && `lendo dados · ${bytesLidos} bytes`}
          {estado === 'pronto' && 'carregado'}
        </span>
      </div>

      <p className="fita__nota">
        bit 0 é um ciclo de 1200 Hz; bit 1 são dois ciclos de 2400 Hz. Os dois duram
        exatamente o mesmo tempo — foi assim que fizeram funcionar em gravador doméstico,
        que nunca girava na velocidade certa.
      </p>
    </div>
  )
}
