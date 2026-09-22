import { abertas } from '../museu/acervo'

/**
 * Cemitério digital — a ala contemplativa.
 *
 * Não é uma reconstrução: é uma leitura do acervo inteiro de uma vez, pelo
 * campo que mais importa. Cada peça aparece com quanto tempo durou e com o
 * que deixou.
 *
 * O tom é deliberadamente sem luto. Nenhuma dessas tecnologias desapareceu de
 * verdade — todas viraram outra coisa, e é isso que a coluna da direita conta.
 * Por isso a ala se chama cemitério mas funciona como árvore genealógica.
 */
export function Cemiterio() {
  const pecas = abertas()

  return (
    <div className="museu">
      <nav className="voltar">
        <a href="#">← todas as salas</a>
        <span className="voltar__sala">Cemitério digital</span>
      </nav>

      <header className="cemiterio__topo">
        <h1>O que cada uma deixou</h1>
        <p>
          Nenhuma das peças deste museu desapareceu de verdade. Todas viraram outra coisa
          — um hábito, um formato, uma palavra que ainda usamos sem saber de onde veio.
          Esta ala lê o acervo por esse ângulo.
        </p>
      </header>

      <ol className="cemiterio__lista">
        {pecas.map((s) => (
          <li key={s.id} className="lapide" style={{ '--cor': s.cor } as React.CSSProperties}>
            <div className="lapide__cabeca">
              <a href={`#${s.id}`} className="lapide__nome">
                {s.placa.nome}
              </a>
              <span className="lapide__anos">{s.placa.anos}</span>
            </div>

            <div className="lapide__corpo">
              <div>
                <h3>Como terminou</h3>
                <p>{s.placa.comoTerminou}</p>
              </div>
              <div className="lapide__legado">
                <h3>O que sobrou</h3>
                <p>{s.placa.legado}</p>
              </div>
            </div>
          </li>
        ))}
      </ol>

      <footer className="rodape">
        <p>
          Esta ala não tem reconstrução para clicar — é leitura. Ela existe porque um museu
          de coisas mortas que não diz o que elas geraram está contando metade da história.
        </p>
      </footer>
    </div>
  )
}
