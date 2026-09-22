import type { Fonte, Placa as DadosPlaca } from '../museu/tipos'

/**
 * A plaquinha de museu. Quatro campos fixos, sempre na mesma ordem — e o do
 * meio, "por que era assim", é o que impede este projeto de virar piada de
 * nostalgia.
 *
 * As fontes ficam ao pé, em tipo menor e sem destaque. Discretas, mas sempre
 * presentes: é a diferença entre um museu e um post de nostalgia.
 */
export function Placa({
  placa,
  fontes,
  cor,
}: {
  placa: DadosPlaca
  fontes: Fonte[]
  cor: string
}) {
  const campos: [string, string][] = [
    ['O que era', placa.oQueEra],
    ['Por que era assim', placa.porQueEraAssim],
    ['Como terminou', placa.comoTerminou],
    ['O que sobrou', placa.legado],
    ['Curiosidade', placa.curiosidade],
  ]

  return (
    <aside className="placa" style={{ '--cor': cor } as React.CSSProperties}>
      <header className="placa__topo">
        <h2>{placa.nome}</h2>
        <span className="placa__anos">{placa.anos}</span>
      </header>

      <dl className="placa__campos">
        {campos.map(([rotulo, texto]) => (
          <div key={rotulo}>
            <dt>{rotulo}</dt>
            <dd>{texto}</dd>
          </div>
        ))}
      </dl>

      {fontes.length > 0 && (
        <footer className="placa__fontes">
          <h3>Consultado em</h3>
          <ul>
            {fontes.map((f) => (
              <li key={f.url}>
                <a href={f.url} target="_blank" rel="noreferrer">
                  {f.titulo}
                </a>
              </li>
            ))}
          </ul>
        </footer>
      )}
    </aside>
  )
}
