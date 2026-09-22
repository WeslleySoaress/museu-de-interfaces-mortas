import { useState } from 'react'
import './blogs.css'

/**
 * Sala — blogs (2005).
 *
 * A PERGUNTA:
 *   como era publicar quando o que você escrevia ficava guardado em
 *   arquivo por mês, e o mais novo empurrava o resto para baixo?
 *
 * O post mais novo em cima, o arquivo por mês na lateral, o blogroll com os
 * amigos e um tema que ninguém conseguia ler. A ordem invertida parece óbvia
 * hoje, mas foi uma decisão: ela assume que quem chega quer o agora, e que o
 * resto é arquivo.
 */

const POSTS = [
  {
    titulo: 'sobre terminar as coisas',
    data: '22 de setembro de 2005, 23h47',
    corpo: [
      'comecei quatro coisas esse ano e não terminei nenhuma. fico pensando se o problema é começar demais ou terminar de menos.',
      'hoje decidi que vou escrever aqui toda semana. sem tema, sem tamanho. só pra ter uma coisa que continua.',
      'se alguém estiver lendo isso daqui um ano, me cobra.',
    ],
    comentarios: 7,
    musica: 'Los Hermanos — Anna Júlia',
  },
  {
    titulo: 'listinha de sexta',
    data: '16 de setembro de 2005, 19h02',
    corpo: [
      'coisas boas dessa semana: o cheiro de chuva na terça, terminar o livro, aquele café que a gente tomou sem pressa.',
      'coisas ruins: prova de cálculo. só isso mesmo.',
    ],
    comentarios: 12,
    musica: 'The Strokes — Reptilia',
  },
  {
    titulo: 'testando',
    data: '11 de setembro de 2005, 15h20',
    corpo: ['primeiro post. vamos ver no que dá.'],
    comentarios: 2,
    musica: null,
  },
]

const ARQUIVO = [
  { mes: 'setembro 2005', n: 3 },
  { mes: 'agosto 2005', n: 0 },
]

const BLOGROLL = ['diário da lari', 'o buraco', 'nada a declarar', 'café com nada', 'vida de estagiário']

const TEMAS = [
  { id: 'roxo', nome: 'roxo escuro' },
  { id: 'rosa', nome: 'rosa choque' },
  { id: 'verde', nome: 'verde no preto' },
]

export function Blogs() {
  const [tema, setTema] = useState('roxo')
  const [abertos, setAbertos] = useState<number[]>([0])

  function alternar(i: number) {
    setAbertos(abertos.includes(i) ? abertos.filter((x) => x !== i) : [...abertos, i])
  }

  return (
    <div className={`blog blog--${tema}`}>
      <div className="blog__temas">
        <span>tema:</span>
        {TEMAS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={tema === t.id ? 'is-ativo' : ''}
            onClick={() => setTema(t.id)}
          >
            {t.nome}
          </button>
        ))}
      </div>

      <header className="blog__cabecalho">
        <h1>sem assunto</h1>
        <p>um blog sobre nada em especial</p>
      </header>

      <div className="blog__corpo">
        <main className="blog__posts">
          {POSTS.map((p, i) => (
            <article key={p.titulo} className="post">
              <h2>
                <button type="button" onClick={() => alternar(i)}>
                  {p.titulo}
                </button>
              </h2>
              <p className="post__data">{p.data}</p>
              {abertos.includes(i) && (
                <>
                  {p.corpo.map((par, n) => (
                    <p key={n} className="post__par">
                      {par}
                    </p>
                  ))}
                  {p.musica && <p className="post__musica">♫ ouvindo: {p.musica}</p>}
                </>
              )}
              <p className="post__rodape">
                <span>{p.comentarios} comentários</span>
                <span>·</span>
                <span>link permanente</span>
              </p>
            </article>
          ))}
        </main>

        <aside className="blog__lateral">
          <section>
            <h3>quem sou eu</h3>
            <p>
              19 anos, estudante, insone. escrevo aqui quando não consigo dormir, que é
              quase sempre.
            </p>
          </section>

          <section>
            <h3>arquivo</h3>
            <ul>
              {ARQUIVO.map((a) => (
                <li key={a.mes}>
                  {a.mes} ({a.n})
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3>blogs que eu leio</h3>
            <ul>
              {BLOGROLL.map((b) => (
                <li key={b}>» {b}</li>
              ))}
            </ul>
          </section>

          <section>
            <h3>contador</h3>
            <p className="blog__contador">00042817</p>
          </section>
        </aside>
      </div>

      <p className="blog__dica">
        troque o tema aí em cima. nenhum dos três é legível — e os três existiram.
      </p>
    </div>
  )
}
