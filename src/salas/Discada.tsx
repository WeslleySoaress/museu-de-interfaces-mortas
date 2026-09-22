import { useEffect, useRef, useState } from 'react'
import { discar, type Etapa, type Marco } from '../museu/modem'
import './discada.css'

/**
 * Sala 2 — a discagem.
 *
 * A PERGUNTA:
 *   como era entrar na internet quando isso significava fazer uma
 *   ligação telefônica e ocupar a linha da casa?
 *
 * Todo o áudio é sintetizado ao vivo (ver museu/modem.ts): nenhum arquivo,
 * nenhuma amostra. As frequências são as do padrão — 425 Hz de tom de linha,
 * pares DTMF corretos, 2100 Hz de atendimento.
 *
 * O áudio só pode começar depois de um gesto do visitante, então o botão
 * DISCAR é também a autorização que o navegador exige.
 */

const BBS = '32615544'

export function Discada() {
  const [etapa, setEtapa] = useState<Etapa>('parado')
  const [log, setLog] = useState<string[]>([])
  const [numero, setNumero] = useState(BBS)
  const ctxRef = useRef<AudioContext | null>(null)
  const timersRef = useRef<number[]>([])

  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout)
      ctxRef.current?.close()
    }
  }, [])

  function iniciar() {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
    setLog([])
    setEtapa('tirando-do-gancho')

    const ctx = ctxRef.current ?? new AudioContext()
    ctxRef.current = ctx
    void ctx.resume()

    const marcos: Marco[] = discar(ctx, numero.replace(/\D/g, '') || BBS)

    for (const m of marcos) {
      const id = window.setTimeout(() => {
        setEtapa(m.etapa)
        setLog((atual) => [...atual, m.texto])
      }, m.emSegundos * 1000)
      timersRef.current.push(id)
    }
  }

  function desligar() {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
    void ctxRef.current?.close()
    ctxRef.current = null
    setEtapa('parado')
    setLog([])
  }

  const conectado = etapa === 'conectado'
  const discando = etapa !== 'parado' && !conectado

  return (
    <div className="discada">
      <div className="discada__modem">
        <div className="discada__leds">
          <Led aceso={etapa !== 'parado'} nome="PWR" />
          <Led aceso={discando || conectado} nome="OH" />
          <Led aceso={conectado} nome="CD" />
          <Led aceso={discando} piscando nome="TD" />
          <Led aceso={conectado} piscando nome="RD" />
        </div>
        <span className="discada__modelo">MODEM 14.4 Kbps · FAX/DATA</span>
      </div>

      <div className="discada__controles">
        <label htmlFor="numero">discar para</label>
        <input
          id="numero"
          value={numero}
          onChange={(e) => setNumero(e.target.value)}
          maxLength={14}
          disabled={etapa !== 'parado'}
          inputMode="numeric"
        />
        {etapa === 'parado' ? (
          <button type="button" onClick={iniciar} className="discada__botao">
            discar
          </button>
        ) : (
          <button type="button" onClick={desligar} className="discada__botao discada__botao--sair">
            desligar
          </button>
        )}
      </div>

      <p className="discada__aviso">
        com som. é a peça mais alta do museu — e a única em que o barulho é o acervo.
      </p>

      <div className="discada__tela">
        {etapa === 'parado' && log.length === 0 && (
          <pre className="discada__ocioso">{`
   ATZ
   OK
   _

   aperte DISCAR e ouça.
   cada bipe abaixo é uma frequência real,
   gerada agora — não é gravação.
`}</pre>
        )}

        {log.length > 0 && (
          <ul className="discada__log">
            {log.map((linha, i) => (
              <li key={i}>
                <span className="discada__prompt">&gt;</span> {linha}
              </li>
            ))}
          </ul>
        )}

        {conectado && (
          <pre className="discada__bbs">{`
 ╔══════════════════════════════════════════════╗
 ║                                              ║
 ║        B B S   M A T O   G R O S S O         ║
 ║          "o mundo em 14.400 bps"             ║
 ║                                              ║
 ╚══════════════════════════════════════════════╝

   conectado em 14400 bps  ·  n,8,1
   você é o usuário 3 de 4 linhas disponíveis
   tempo restante hoje: 58 minutos

   [M] mensagens         [A] arquivos
   [C] bate-papo         [J] jogos (door games)
   [L] lista de BBS      [S] sair

   escolha: _
`}</pre>
        )}

        {conectado && (
          <p className="discada__ponte">
            <a href="#bbs">entrar de verdade nesta BBS →</a>
          </p>
        )}
      </div>
    </div>
  )
}

function Led({ aceso, nome, piscando = false }: { aceso: boolean; nome: string; piscando?: boolean }) {
  return (
    <span className="discada__led-grupo">
      <span
        className={`discada__led ${aceso ? 'is-aceso' : ''} ${aceso && piscando ? 'is-piscando' : ''}`}
        aria-hidden
      />
      <span className="discada__led-nome">{nome}</span>
    </span>
  )
}
