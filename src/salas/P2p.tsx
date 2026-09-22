import { useEffect, useRef, useState } from 'react'
import './p2p.css'

/**
 * Sala — a era do compartilhamento (2001).
 *
 * A PERGUNTA:
 *   o que muda numa rede quando ela deixa de ter um servidor no meio e
 *   cada pessoa passa a ser um pedaço dela?
 *
 * A peça é sobre ARQUITETURA, não sobre catálogo. O que mudou o mundo ali não
 * foi o que as pessoas trocavam: foi a descoberta de que uma rede podia
 * funcionar sem um servidor no meio, com cada participante servindo os outros.
 *
 * Por isso os arquivos desta simulação são todos de domínio público ou de
 * licença livre. O museu não reproduz o acervo da época, e não precisa: a
 * lição está no diagrama e no comportamento da descida, não na lista.
 */

type Arquivo = {
  nome: string
  tamanhoMb: number
  fontes: number
  origem: string
}

const BIBLIOTECA: Arquivo[] = [
  { nome: 'bach-suite-cello-01.mp3', tamanhoMb: 4.2, fontes: 7, origem: 'domínio público' },
  { nome: 'nosferatu-1922.avi', tamanhoMb: 312, fontes: 2, origem: 'domínio público' },
  { nome: 'slackware-7.1-disc1.iso', tamanhoMb: 648, fontes: 14, origem: 'software livre' },
  { nome: 'chopin-nocturne-op9.mp3', tamanhoMb: 5.1, fontes: 9, origem: 'domínio público' },
  { nome: 'chamada-de-modem.wav', tamanhoMb: 1.8, fontes: 3, origem: 'gravação própria' },
  { nome: 'o-alienista-machado.txt', tamanhoMb: 0.2, fontes: 21, origem: 'domínio público' },
]

export function P2p() {
  const [busca, setBusca] = useState('')
  const [baixando, setBaixando] = useState<Arquivo | null>(null)
  const [progresso, setProgresso] = useState(0)
  const [velocidade, setVelocidade] = useState(0)
  const [fontesVivas, setFontesVivas] = useState(0)
  const [parado, setParado] = useState(false)
  const timerRef = useRef<number | null>(null)

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current)
  }, [])

  const resultados = BIBLIOTECA.filter((a) =>
    a.nome.toLowerCase().includes(busca.trim().toLowerCase()),
  )

  function baixar(a: Arquivo) {
    if (timerRef.current) clearInterval(timerRef.current)
    setBaixando(a)
    setProgresso(0)
    setFontesVivas(a.fontes)
    setParado(false)

    const id = window.setInterval(() => {
      // As fontes entram e saem: era isso que fazia a velocidade oscilar e,
      // às vezes, a descida parar de vez na metade.
      setFontesVivas((f) => {
        const delta = Math.random() < 0.5 ? -1 : 1
        return Math.max(0, Math.min(a.fontes + 3, f + (Math.random() < 0.35 ? delta : 0)))
      })

      setFontesVivas((f) => {
        setParado(f === 0)
        setVelocidade(f === 0 ? 0 : Math.round(f * (3 + Math.random() * 5)))
        return f
      })

      setProgresso((p) => {
        if (p >= 100) {
          clearInterval(id)
          return 100
        }
        return Math.min(100, p + (Math.random() < 0.12 ? 0 : 1.6))
      })
    }, 320)
    timerRef.current = id
  }

  return (
    <div className="p2p">
      <div className="p2p__janela">
        <div className="p2p__barra">
          <span>Compartilhador — conectado a 1.284 usuários</span>
          <span className="p2p__botoes">
            <i>_</i>
            <i>□</i>
            <i>×</i>
          </span>
        </div>

        <div className="p2p__busca">
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="procurar arquivo"
            aria-label="Procurar arquivo"
          />
          <button type="button">Procurar</button>
        </div>

        <table className="p2p__tabela">
          <thead>
            <tr>
              <th>arquivo</th>
              <th>tamanho</th>
              <th>fontes</th>
              <th>origem</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {resultados.map((a) => (
              <tr key={a.nome}>
                <td className="p2p__nome">{a.nome}</td>
                <td>{a.tamanhoMb} MB</td>
                <td className={a.fontes < 4 ? 'p2p__poucas' : ''}>{a.fontes}</td>
                <td className="p2p__origem">{a.origem}</td>
                <td>
                  <button type="button" onClick={() => baixar(a)}>
                    baixar
                  </button>
                </td>
              </tr>
            ))}
            {resultados.length === 0 && (
              <tr>
                <td colSpan={5} className="p2p__vazio">
                  nenhum resultado — e você não tinha como saber se era porque não existia
                  ou porque ninguém com o arquivo estava online naquele minuto.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {baixando && (
          <div className="p2p__descida">
            <p className="p2p__descida-nome">{baixando.nome}</p>
            <div className="p2p__trilho">
              <div className="p2p__preenchido" style={{ width: `${progresso}%` }} />
            </div>
            <p className="p2p__estado">
              {progresso >= 100 ? (
                <>concluído · {baixando.tamanhoMb} MB</>
              ) : parado ? (
                <span className="p2p__alerta">
                  aguardando fontes — todo mundo que tinha este arquivo saiu do ar
                </span>
              ) : (
                <>
                  {progresso.toFixed(0)}% · {velocidade} KB/s · {fontesVivas} fontes ativas
                </>
              )}
            </p>
          </div>
        )}
      </div>

      <aside className="p2p__licao">
        <h3>o que mudou de verdade</h3>

        <div className="p2p__diagrama">
          <div className="p2p__modelo">
            <p className="p2p__modelo-titulo">antes: servidor no meio</p>
            <div className="p2p__central">
              <span className="p2p__no p2p__no--servidor">servidor</span>
              <span className="p2p__raios" aria-hidden />
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <span key={i} className={`p2p__no p2p__no--cliente p2p__no--pos${i}`} />
              ))}
            </div>
            <p className="p2p__modelo-nota">
              derruba o servidor e a rede inteira some.
            </p>
          </div>

          <div className="p2p__modelo">
            <p className="p2p__modelo-titulo">depois: todo mundo é servidor</p>
            <div className="p2p__malha">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <span key={i} className={`p2p__no p2p__no--par p2p__no--pos${i}`} />
              ))}
            </div>
            <p className="p2p__modelo-nota">
              derruba qualquer um e os outros continuam.
            </p>
          </div>
        </div>

        <p>
          Foi essa mudança que assustou uma indústria inteira — e não o formato de áudio.
          Não havia prédio para fechar nem cabo para cortar: a rede era as pessoas.
        </p>

        <p>
          A ideia não morreu, mudou de uso. É ela que distribui sistema operacional livre,
          que sustenta chamada de vídeo direta entre dois navegadores e que está embaixo de
          toda rede sem autoridade central.
        </p>

        <p className="p2p__aviso">
          Os arquivos desta simulação são de domínio público ou licença livre. O museu
          explica a arquitetura; não reproduz o catálogo da época.
        </p>
      </aside>
    </div>
  )
}
