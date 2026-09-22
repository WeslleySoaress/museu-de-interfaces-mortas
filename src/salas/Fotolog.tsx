import { useState } from 'react'
import './fotolog.css'

/**
 * Sala — Fotolog (2005).
 *
 * A PERGUNTA:
 *   o que acontece com uma foto quando você só pode publicar uma por
 *   dia e precisa escolher qual?
 *
 * Uma foto por dia. Não era limitação técnica: era a regra do serviço, e foi
 * ela que fez o formato. Com uma só, a escolha importava — e o comentário
 * embaixo virava moeda social.
 *
 * As "fotos" são desenhadas em CSS. Nenhuma imagem de ninguém.
 */

type Dia = {
  data: string
  legenda: string
  visual: string
  comentarios: { de: string; texto: string }[]
}

const DIAS: Dia[] = [
  {
    data: '14 de agosto de 2005',
    legenda: 'domingo na casa da vó. bolo de fubá e ninguém com pressa.',
    visual: 'cozinha',
    comentarios: [
      { de: 'lari_xD', texto: 'que fofoo!! passa no meu depois vai' },
      { de: 'Bruno_SP', texto: 'to com fome agora' },
      { de: 'ana.p', texto: '+1' },
      { de: 'thaisinha', texto: 'amei a foto, a luz ficou linda' },
    ],
  },
  {
    data: '13 de agosto de 2005',
    legenda: 'saindo do colégio. última semana antes da prova.',
    visual: 'rua',
    comentarios: [
      { de: 'Digão', texto: 'boa sorte na prova!' },
      { de: 'lari_xD', texto: 'tbm to estudando, socorro' },
    ],
  },
  {
    data: '12 de agosto de 2005',
    legenda: 'meu quarto novo. demorei 3 dias pra pintar essa parede.',
    visual: 'quarto',
    comentarios: [
      { de: 'ana.p', texto: 'ficou muito bom o roxo' },
      { de: 'Marcelo', texto: 'passa la em casa dps' },
      { de: 'thaisinha', texto: 'quero um igual' },
    ],
  },
]

export function Fotolog() {
  const [i, setI] = useState(0)
  const [novo, setNovo] = useState('')
  const [extras, setExtras] = useState<Record<number, { de: string; texto: string }[]>>({})

  const dia = DIAS[i]
  const comentarios = [...dia.comentarios, ...(extras[i] ?? [])]

  function comentar(e: React.FormEvent) {
    e.preventDefault()
    if (!novo.trim()) return
    setExtras({ ...extras, [i]: [...(extras[i] ?? []), { de: 'você', texto: novo.trim() }] })
    setNovo('')
  }

  return (
    <div className="flog">
      <header className="flog__topo">
        <h1>fotolog de carolzinha</h1>
        <p>são paulo · desde março de 2005 · 3.847 visitas</p>
      </header>

      <div className="flog__corpo">
        <div className="flog__coluna-foto">
          <div className={`flog__foto flog__foto--${dia.visual}`} role="img" aria-label={dia.legenda} />
          <p className="flog__data">{dia.data}</p>
          <p className="flog__legenda">{dia.legenda}</p>

          <nav className="flog__nav">
            <button type="button" onClick={() => setI(Math.min(DIAS.length - 1, i + 1))} disabled={i === DIAS.length - 1}>
              « dia anterior
            </button>
            <button type="button" onClick={() => setI(Math.max(0, i - 1))} disabled={i === 0}>
              próximo dia »
            </button>
          </nav>
        </div>

        <div className="flog__coluna-comentarios">
          <h2>{comentarios.length} comentários</h2>
          <ul>
            {comentarios.map((c, n) => (
              <li key={n}>
                <b>{c.de}</b>
                <span>{c.texto}</span>
              </li>
            ))}
          </ul>

          <form onSubmit={comentar}>
            <input
              value={novo}
              onChange={(e) => setNovo(e.target.value)}
              maxLength={100}
              placeholder="deixe um comentário"
              aria-label="Comentário"
            />
            <button type="submit" disabled={!novo.trim()}>
              enviar
            </button>
          </form>

          <p className="flog__regra">uma foto por dia. amanhã tem outra.</p>
        </div>
      </div>
    </div>
  )
}
