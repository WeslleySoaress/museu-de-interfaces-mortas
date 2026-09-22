import { useEffect, useRef, useState } from 'react'
import './youtube.css'

/**
 * Sala — o primeiro YouTube (2006).
 *
 * A PERGUNTA:
 *   como era publicar vídeo pela primeira vez sem precisar de emissora,
 *   equipamento nem permissão de ninguém?
 *
 * Player pequeno, avaliação por estrelas, contador tosco e comentários sem
 * nenhuma moderação. O "vídeo" é uma animação em CSS: não há arquivo de vídeo
 * nenhum nesta peça, e não poderia haver — o museu não hospeda obra de outro.
 *
 * O que a sala ensina é o tamanho: 320 por 240 pixels. Não era escolha de
 * design. Era o que dava para transmitir por uma conexão doméstica em 2006.
 */

const COMENTARIOS = [
  { de: 'rafa_2006', texto: 'primeiro!!!' },
  { de: 'juninho', texto: 'alguem sabe o nome da musica??' },
  { de: 'anon1234', texto: 'kkkkkkkkkkkkkkkkkkkkkkkk' },
  { de: 'marcia_s', texto: 'muito bom, favoritado' },
  { de: 'pedro', texto: 'coloca mais videos assim' },
]

const RELACIONADOS = [
  { titulo: 'gato assustado com pepino', views: '1.204.883', dur: '0:31' },
  { titulo: 'skate fail compilation', views: '843.019', dur: '2:14' },
  { titulo: 'propaganda antiga da tv', views: '218.472', dur: '0:45' },
  { titulo: 'como fazer um site no bloco de notas', views: '94.108', dur: '8:02' },
]

export function Youtube() {
  const [tocando, setTocando] = useState(false)
  const [posicao, setPosicao] = useState(0)
  const [estrelas, setEstrelas] = useState(0)
  const [comentarios, setComentarios] = useState(COMENTARIOS)
  const [novo, setNovo] = useState('')
  const [bufferando, setBufferando] = useState(false)
  const timerRef = useRef<number | null>(null)

  const duracao = 47

  useEffect(() => {
    if (!tocando) return
    const id = window.setInterval(() => {
      // Ele parava para bufferizar. Sempre. No meio.
      if (Math.random() < 0.09) {
        setBufferando(true)
        window.setTimeout(() => setBufferando(false), 1400)
        return
      }
      setPosicao((p) => {
        if (p >= duracao) {
          setTocando(false)
          return duracao
        }
        return p + 1
      })
    }, 1000)
    timerRef.current = id
    return () => clearInterval(id)
  }, [tocando])

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current)
  }, [])

  function comentar(e: React.FormEvent) {
    e.preventDefault()
    if (!novo.trim()) return
    setComentarios([{ de: 'você', texto: novo.trim().slice(0, 140) }, ...comentarios])
    setNovo('')
  }

  const mmss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  return (
    <div className="yt">
      <div className="yt__topo">
        <span className="yt__marca">
          <b>Você</b>Tubo
        </span>
        <span className="yt__slogan">Transmita Você Mesmo™</span>
      </div>

      <div className="yt__corpo">
        <div className="yt__principal">
          <h1 className="yt__titulo">meu cachorro fazendo coisa engraçada</h1>

          <div className="yt__player">
            <div className={`yt__video ${tocando && !bufferando ? 'is-rodando' : ''}`} aria-hidden>
              <span className="yt__vulto" />
            </div>
            {bufferando && <div className="yt__buffer">bufferizando…</div>}
            {!tocando && posicao === 0 && (
              <button type="button" className="yt__play-grande" onClick={() => setTocando(true)}>
                ▶
              </button>
            )}
            <div className="yt__controles">
              <button type="button" onClick={() => setTocando(!tocando)}>
                {tocando ? '❚❚' : '▶'}
              </button>
              <div className="yt__trilho">
                <div className="yt__progresso" style={{ width: `${(posicao / duracao) * 100}%` }} />
              </div>
              <span className="yt__tempo">
                {mmss(posicao)} / {mmss(duracao)}
              </span>
            </div>
          </div>
          <p className="yt__resolucao">320 × 240 pixels — era o que a conexão aguentava</p>

          <div className="yt__meta">
            <div className="yt__estrelas">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  className={n <= estrelas ? 'is-cheia' : ''}
                  onClick={() => setEstrelas(n)}
                  aria-label={`${n} estrelas`}
                >
                  ★
                </button>
              ))}
              <span>{estrelas ? `${estrelas} de 5` : 'avalie este vídeo'}</span>
            </div>
            <p className="yt__views">18.294 exibições · enviado por rodrigo_br em 14 mar 2006</p>
          </div>

          <div className="yt__comentarios">
            <h2>Comentários ({comentarios.length})</h2>
            <form onSubmit={comentar}>
              <textarea
                value={novo}
                onChange={(e) => setNovo(e.target.value)}
                rows={2}
                maxLength={140}
                placeholder="Poste um comentário de texto"
                aria-label="Comentário"
              />
              <button type="submit" disabled={!novo.trim()}>
                Postar
              </button>
            </form>
            <ul>
              {comentarios.map((c, i) => (
                <li key={i}>
                  <b>{c.de}</b> <span>({Math.floor(Math.abs(i * 7 - 19))} meses atrás)</span>
                  <p>{c.texto}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="yt__lado">
          <h2>Vídeos relacionados</h2>
          <ul>
            {RELACIONADOS.map((r) => (
              <li key={r.titulo}>
                <span className="yt__miniatura" aria-hidden />
                <span className="yt__rel-info">
                  <b>{r.titulo}</b>
                  <i>
                    {r.views} exibições · {r.dur}
                  </i>
                </span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  )
}
