import { abertas, emOrdem } from '../museu/acervo'
import { estaAberta, nomeDe } from '../museu/tipos'

/**
 * Linha do tempo. Discreta de propósito: é orientação, não enfeite.
 *
 * As marcas ficam em posição PROPORCIONAL ao ano, não distribuídas por igual.
 * Isso não é preciosismo — é o que revela o formato real da história: um vão
 * largo entre o cartão perfurado e o videotexto, e depois um adensamento nos
 * anos 90 e 2000, quando tudo passou a mudar de um ano para o outro.
 * Distribuir por igual apagaria justamente essa aceleração.
 *
 * As peças em restauração entram como marcas pequenas e apagadas, sem rótulo:
 * dão a ver o recorte pretendido sem competir com o que já existe.
 */
export function LinhaDoTempo({ atual }: { atual?: string }) {
  const todas = emOrdem()
  const primeiro = todas[0].ordem
  const vao = todas[todas.length - 1].ordem - primeiro

  // Só as peças prontas recebem rótulo, alternando entre duas filas para não
  // se atropelarem onde os anos ficam colados.
  let filaDaProxima = 0

  // Anos com mais de uma peça (2001, 2004, 2005) empilhariam os pontos no
  // mesmo lugar. O desempate é em pixels, nunca no ano: a posição continua
  // verdadeira, só o desenho se afasta o suficiente para dar para clicar.
  const vistosNoAno = new Map<number, number>()

  return (
    <nav className="tempo" aria-label="Linha do tempo do acervo">
      <div className="tempo__trilho">
        <span className="tempo__eixo" aria-hidden />

        {todas.map((s) => {
          const posicao = ((s.ordem - primeiro) / vao) * 100
          const repetido = vistosNoAno.get(s.ordem) ?? 0
          vistosNoAno.set(s.ordem, repetido + 1)
          const estilo = {
            left: `calc(${posicao}% + ${repetido * 8}px)`,
            '--cor': s.cor,
          } as React.CSSProperties

          if (!estaAberta(s)) {
            return (
              <span
                key={s.id}
                className="tempo__marca tempo__marca--futura"
                style={estilo}
                title={`${s.nome} (${s.ordem}) — em restauração`}
              >
                <span className="tempo__ponto" aria-hidden />
              </span>
            )
          }

          const fila = filaDaProxima++ % 2 ? 'is-baixo' : 'is-cima'
          const ativo = s.id === atual

          return (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`tempo__marca ${ativo ? 'is-ativa' : ''} ${fila}`}
              style={estilo}
              aria-current={ativo ? 'page' : undefined}
            >
              <span className="tempo__ponto" aria-hidden />
              <span className="tempo__rotulo">
                <b>{s.ordem}</b>
                <i>{s.placa.nome}</i>
              </span>
            </a>
          )
        })}
      </div>

      <p className="tempo__legenda">
        {abertas().length} peças abertas · {todas.length - abertas().length} em restauração ·
        as marcas ficam na posição real do ano
      </p>
    </nav>
  )
}

/** Navegação entre peças vizinhas no tempo, no rodapé da sala. */
export function Vizinhas({ atual }: { atual: string }) {
  const visitaveis = abertas()
  const i = visitaveis.findIndex((s) => s.id === atual)
  const anterior = i > 0 ? visitaveis[i - 1] : null
  const proxima = i >= 0 && i < visitaveis.length - 1 ? visitaveis[i + 1] : null

  return (
    <nav className="vizinhas" aria-label="Peças vizinhas no tempo">
      {anterior ? (
        <a href={`#${anterior.id}`} className="vizinhas__link">
          <span className="vizinhas__direcao">← antes, em {anterior.ordem}</span>
          <span className="vizinhas__nome">{nomeDe(anterior)}</span>
        </a>
      ) : (
        <span />
      )}
      {proxima ? (
        <a href={`#${proxima.id}`} className="vizinhas__link vizinhas__link--fim">
          <span className="vizinhas__direcao">depois, em {proxima.ordem} →</span>
          <span className="vizinhas__nome">{nomeDe(proxima)}</span>
        </a>
      ) : (
        <span />
      )}
    </nav>
  )
}
