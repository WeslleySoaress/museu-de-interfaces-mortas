import { useCallback, useEffect, useRef, useState } from 'react'
import './flash.css'

/**
 * Sala — jogos em Flash (2003).
 *
 * A PERGUNTA:
 *   como era esperar uma coisa carregar quando não havia mais nada a
 *   fazer além de olhar o número subir?
 *
 * A peça de verdade aqui não é o jogo: é a tela de carregando. Ela travava
 * em qualquer número e você ficava olhando, porque não havia mais nada para
 * fazer com aquela janela aberta.
 *
 * O joguinho depois é original e tem duas regras. Era mais ou menos isso.
 */

type Fase = 'carregando' | 'menu' | 'jogando' | 'fim'
type Alvo = { id: number; x: number; y: number; nasceu: number }

const DURACAO_S = 20
const VIDA_ALVO_MS = 1500

export function Flash() {
  const [fase, setFase] = useState<Fase>('carregando')
  const [porcento, setPorcento] = useState(0)
  const [alvos, setAlvos] = useState<Alvo[]>([])
  const [pontos, setPontos] = useState(0)
  const [erros, setErros] = useState(0)
  const [restante, setRestante] = useState(DURACAO_S)
  const proximoId = useRef(1)

  // O carregamento trava em 87%, como travava. Depois destrava sozinho.
  useEffect(() => {
    if (fase !== 'carregando') return
    const id = setInterval(() => {
      setPorcento((p) => {
        if (p >= 100) return 100
        if (p === 87) return Math.random() < 0.12 ? 88 : 87
        return p + (p < 60 ? 3 : 1)
      })
    }, 90)
    return () => clearInterval(id)
  }, [fase])

  useEffect(() => {
    if (porcento >= 100 && fase === 'carregando') {
      const id = setTimeout(() => setFase('menu'), 500)
      return () => clearTimeout(id)
    }
  }, [porcento, fase])

  const comecar = useCallback(() => {
    setPontos(0)
    setErros(0)
    setRestante(DURACAO_S)
    setAlvos([])
    setFase('jogando')
  }, [])

  // Relógio da partida.
  useEffect(() => {
    if (fase !== 'jogando') return
    const id = setInterval(() => {
      setRestante((r) => {
        if (r <= 1) {
          setFase('fim')
          return 0
        }
        return r - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [fase])

  // Nascimento e morte dos alvos.
  useEffect(() => {
    if (fase !== 'jogando') return
    const nascer = setInterval(() => {
      setAlvos((a) => [
        ...a,
        {
          id: proximoId.current++,
          x: 8 + Math.random() * 78,
          y: 12 + Math.random() * 68,
          nasceu: Date.now(),
        },
      ])
    }, 620)

    const limpar = setInterval(() => {
      setAlvos((a) => a.filter((alvo) => Date.now() - alvo.nasceu < VIDA_ALVO_MS))
    }, 120)

    return () => {
      clearInterval(nascer)
      clearInterval(limpar)
    }
  }, [fase])

  function acertar(id: number, e: React.MouseEvent) {
    e.stopPropagation()
    setAlvos((a) => a.filter((alvo) => alvo.id !== id))
    setPontos((p) => p + 1)
  }

  return (
    <div className="flash">
      <div className="flash__moldura">
        <div className="flash__palco" onClick={() => fase === 'jogando' && setErros((x) => x + 1)}>
          {fase === 'carregando' && (
            <div className="flash__carregando">
              <div className="flash__barra">
                <div className="flash__preenchido" style={{ width: `${porcento}%` }} />
              </div>
              <p className="flash__porcento">carregando… {porcento}%</p>
              {porcento === 87 && <p className="flash__travado">(sempre trava aqui)</p>}
            </div>
          )}

          {fase === 'menu' && (
            <div className="flash__menu">
              <h2>CLIQUE RÁPIDO</h2>
              <p>acerte os alvos antes de sumirem. errar o clique conta contra você.</p>
              <button type="button" onClick={comecar}>
                JOGAR
              </button>
              <p className="flash__creditos">jogo original, feito para este museu</p>
            </div>
          )}

          {fase === 'jogando' && (
            <>
              <div className="flash__placar">
                <span>pontos: {pontos}</span>
                <span>erros: {erros}</span>
                <span className={restante <= 5 ? 'is-pouco' : ''}>{restante}s</span>
              </div>
              {alvos.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  className="flash__alvo"
                  style={{ left: `${a.x}%`, top: `${a.y}%` }}
                  onClick={(e) => acertar(a.id, e)}
                  aria-label="Alvo"
                />
              ))}
            </>
          )}

          {fase === 'fim' && (
            <div className="flash__menu">
              <h2>FIM DE JOGO</h2>
              <p className="flash__resultado">
                {pontos} acertos · {erros} erros
              </p>
              <p>
                {pontos >= 18
                  ? 'você era daqueles que ficavam na lan house até fechar.'
                  : pontos >= 10
                    ? 'nada mal para vinte segundos.'
                    : 'a internet era lenta, a gente tinha paciência.'}
              </p>
              <button type="button" onClick={comecar}>
                JOGAR DE NOVO
              </button>
            </div>
          )}
        </div>
      </div>

      <p className="flash__nota">
        o carregamento acima é falso e a lentidão é de propósito — mas era exatamente assim
        que se esperava, olhando o número parar.
      </p>
    </div>
  )
}
