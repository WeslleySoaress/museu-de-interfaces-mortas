import { useEffect, useRef, useState } from 'react'
import './paginas.css'

/**
 * Sala — páginas pessoais (1997).
 *
 * A PERGUNTA:
 *   como era ter um lugar seu na internet quando era preciso construí-lo
 *   à mão, sem modelo e sem quem desse palpite?
 *
 * A única sala em que o visitante não olha: ele constrói. Escolhe o fundo,
 * a cor do texto, liga o piscante, o contador e a música — e vê a página
 * ficando exatamente tão feia quanto ficava.
 *
 * O ponto da peça é que aquilo não era falta de gosto: era falta de opção e
 * excesso de entusiasmo. Não havia modelo pronto, não havia tema, não havia
 * quem desse palpite. Cada página era alguém aprendendo HTML sozinho, à noite,
 * e usando tudo que tinha descoberto naquela semana ao mesmo tempo.
 *
 * A musiquinha é sintetizada — um arpejo em onda quadrada, que é a família de
 * timbre do MIDI de placa de som barata. Nenhuma melodia de terceiros.
 */

const FUNDOS = [
  { id: 'estrelas', nome: 'estrelas' },
  { id: 'nuvens', nome: 'nuvens' },
  { id: 'tijolos', nome: 'tijolos' },
  { id: 'xadrez', nome: 'xadrez' },
  { id: 'listras', nome: 'listras' },
]

const CORES = [
  { id: '#00ff00', nome: 'verde limão' },
  { id: '#ffff00', nome: 'amarelo' },
  { id: '#ff00ff', nome: 'magenta' },
  { id: '#00ffff', nome: 'ciano' },
  { id: '#ffffff', nome: 'branco' },
]

export function Paginas() {
  const [fundo, setFundo] = useState('estrelas')
  const [cor, setCor] = useState('#00ff00')
  const [titulo, setTitulo] = useState('A PÁGINA DO RODRIGO')
  const [piscante, setPiscante] = useState(true)
  const [marquee, setMarquee] = useState(true)
  const [contador, setContador] = useState(true)
  const [obras, setObras] = useState(true)
  const [musica, setMusica] = useState(false)
  const [visitas, setVisitas] = useState(1337)
  const [livro, setLivro] = useState([
    { de: 'Fernanda', texto: 'oi!!! adorei sua pagina, passa na minha depois' },
    { de: 'PedroK', texto: 'como vc fez o texto piscando? me ensina' },
  ])
  const [recado, setRecado] = useState('')

  const ctxRef = useRef<AudioContext | null>(null)
  const pararRef = useRef<(() => void) | null>(null)

  useEffect(
    () => () => {
      pararRef.current?.()
      void ctxRef.current?.close()
      ctxRef.current = null
    },
    [],
  )

  // O contador subia sozinho, e todo mundo sabia que subia sozinho.
  useEffect(() => {
    if (!contador) return
    const id = setInterval(() => setVisitas((v) => v + 1), 4000)
    return () => clearInterval(id)
  }, [contador])

  useEffect(() => {
    if (!musica) {
      pararRef.current?.()
      pararRef.current = null
      return
    }
    const ctx = ctxRef.current ?? new AudioContext()
    ctxRef.current = ctx
    void ctx.resume()

    // Arpejo simples em onda quadrada, repetindo. Sem melodia de terceiros:
    // é só uma tríade subindo e descendo, que é o que as placas de som
    // baratas faziam soar igual de qualquer jeito.
    const notas = [262, 330, 392, 523, 392, 330]
    const duracao = 0.22
    let parado = false
    let indice = 0

    const tocarProxima = () => {
      if (parado) return
      const t = ctx.currentTime
      const osc = ctx.createOscillator()
      const g = ctx.createGain()
      osc.type = 'square'
      osc.frequency.value = notas[indice % notas.length]
      g.gain.setValueAtTime(0.0001, t)
      g.gain.exponentialRampToValueAtTime(0.05, t + 0.01)
      g.gain.exponentialRampToValueAtTime(0.0001, t + duracao)
      osc.connect(g).connect(ctx.destination)
      osc.start(t)
      osc.stop(t + duracao + 0.01)
      indice++
    }

    tocarProxima()
    const id = setInterval(tocarProxima, duracao * 1000)
    pararRef.current = () => {
      parado = true
      clearInterval(id)
    }
    return () => {
      parado = true
      clearInterval(id)
    }
  }, [musica])

  function assinar(e: React.FormEvent) {
    e.preventDefault()
    if (!recado.trim()) return
    setLivro([...livro, { de: 'você', texto: recado.trim().slice(0, 120) }])
    setRecado('')
  }

  return (
    <div className="pag">
      <div className="pag__oficina">
        <h3>monte a sua</h3>

        <label className="pag__campo">
          <span>título</span>
          <input value={titulo} onChange={(e) => setTitulo(e.target.value.slice(0, 40))} />
        </label>

        <div className="pag__campo">
          <span>papel de parede</span>
          <div className="pag__opcoes">
            {FUNDOS.map((f) => (
              <button
                key={f.id}
                type="button"
                className={`pag__amostra pag__amostra--${f.id} ${fundo === f.id ? 'is-ativa' : ''}`}
                onClick={() => setFundo(f.id)}
                title={f.nome}
                aria-label={`Papel de parede: ${f.nome}`}
              />
            ))}
          </div>
        </div>

        <div className="pag__campo">
          <span>cor do texto</span>
          <div className="pag__opcoes">
            {CORES.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`pag__cor ${cor === c.id ? 'is-ativa' : ''}`}
                style={{ background: c.id }}
                onClick={() => setCor(c.id)}
                title={c.nome}
                aria-label={`Cor do texto: ${c.nome}`}
              />
            ))}
          </div>
        </div>

        <div className="pag__campo pag__campo--chaves">
          <Chave ligada={piscante} aoMudar={setPiscante} rotulo="texto piscando" />
          <Chave ligada={marquee} aoMudar={setMarquee} rotulo="letreiro correndo" />
          <Chave ligada={contador} aoMudar={setContador} rotulo="contador de visitas" />
          <Chave ligada={obras} aoMudar={setObras} rotulo="em construção" />
          <Chave ligada={musica} aoMudar={setMusica} rotulo="musiquinha (com som)" />
        </div>

        <p className="pag__aviso">
          nenhuma dessas opções é piada: todas existiam e todas eram usadas ao mesmo tempo.
        </p>
      </div>

      <div className={`pag__preview pag__preview--${fundo}`} style={{ color: cor }}>
        <h1 className={`pag__titulo ${piscante ? 'is-piscando' : ''}`}>{titulo || ' '}</h1>

        <hr className="pag__hr" />

        {marquee && (
          <div className="pag__marquee">
            <span>
              ★ BEM VINDO A MINHA HOME PAGE ★ ASSINE MEU LIVRO DE VISITAS ★ VOLTE SEMPRE ★
            </span>
          </div>
        )}

        <p className="pag__texto">
          Oi! Essa é a minha página. Aqui eu vou colocar minhas fotos, minhas músicas
          favoritas e os links dos meus amigos. Ainda tô aprendendo HTML então desculpa
          se tiver erro.
        </p>

        {obras && (
          <div className="pag__obras">
            <span className="pag__obras-placa" aria-hidden>
              ⚠
            </span>
            <span>ESTA SEÇÃO ESTÁ EM CONSTRUÇÃO — VOLTE EM BREVE!</span>
          </div>
        )}

        <ul className="pag__links">
          <li>» Minhas fotos (em breve)</li>
          <li>» Meus amigos</li>
          <li>» Piadas que eu achei</li>
          <li>» Links legais</li>
        </ul>

        <hr className="pag__hr" />

        <div className="pag__livro">
          <h2>LIVRO DE VISITAS</h2>
          {livro.map((l, i) => (
            <p key={i} className="pag__assinatura">
              <b>{l.de}</b> escreveu: {l.texto}
            </p>
          ))}
          <form onSubmit={assinar} className="pag__form">
            <input
              value={recado}
              onChange={(e) => setRecado(e.target.value)}
              placeholder="deixe seu recado..."
              maxLength={120}
              aria-label="Recado no livro de visitas"
            />
            <button type="submit" disabled={!recado.trim()}>
              ASSINAR
            </button>
          </form>
        </div>

        {contador && (
          <div className="pag__contador">
            <span>você é o visitante número</span>
            <span className="pag__digitos">
              {String(visitas).padStart(6, '0').split('').map((d, i) => (
                <b key={i}>{d}</b>
              ))}
            </span>
          </div>
        )}

        <p className="pag__rodape">
          Melhor visualizado em 800×600 · Feito com Bloco de Notas
          {musica && <span className="pag__nota-musica"> ♫ tocando MIDI</span>}
        </p>
      </div>
    </div>
  )
}

function Chave({
  ligada,
  aoMudar,
  rotulo,
}: {
  ligada: boolean
  aoMudar: (v: boolean) => void
  rotulo: string
}) {
  return (
    <label className="pag__chave">
      <input type="checkbox" checked={ligada} onChange={(e) => aoMudar(e.target.checked)} />
      <span>{rotulo}</span>
    </label>
  )
}
