import { Suspense, useEffect, useState } from 'react'
import { ACERVO, abertas, emOrdem, salaPorId } from './museu/acervo'
import { ERAS } from './museu/eras'
import { estaAberta, type Item } from './museu/tipos'
import { Placa } from './componentes/Placa'
import { LinhaDoTempo, Vizinhas } from './componentes/LinhaDoTempo'
import { Cemiterio } from './componentes/Cemiterio'

/**
 * O museu.
 *
 * A moldura é escura, silenciosa e moderna de propósito: o contraste com as
 * peças — azuis, beges, verdes de fósforo — é metade do efeito. Museu bom não
 * compete com o acervo.
 *
 * Navegação por hash, sem router: o museu inteiro é uma página estática e
 * cada sala tem link próprio para poder ser compartilhada.
 */
export default function App() {
  const [rota, setRota] = useState(() => window.location.hash.replace('#', ''))

  useEffect(() => {
    const aoMudar = () => {
      setRota(window.location.hash.replace('#', ''))
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', aoMudar)
    return () => window.removeEventListener('hashchange', aoMudar)
  }, [])

  if (rota === 'cemiterio') return <Cemiterio />

  const item = salaPorId(rota)
  if (item && estaAberta(item)) return <Sala id={item.id} />
  return <Entrada />
}

function Sala({ id }: { id: string }) {
  // Os hooks vêm antes de qualquer saída condicional: chamá-los depois de um
  // `return` quebra a ordem entre renderizações e é erro de React, não estilo.
  const [ampliacao, setAmpliacao] = useState(1)

  // A ampliação volta ao normal ao trocar de peça: cada uma tem sua escala.
  useEffect(() => setAmpliacao(1), [id])

  const sala = salaPorId(id)
  if (!sala || !estaAberta(sala)) return null
  const { Peca } = sala

  return (
    <div className="museu">
      <nav className="voltar">
        <a href="#">← todas as salas</a>
        <span className="voltar__sala">{sala.placa.nome}</span>
        <span className="voltar__ano">{sala.ordem}</span>
      </nav>

      <LinhaDoTempo atual={id} />

      <div className="vitrine">
        <div className="vitrine__controle">
          <span className="vitrine__rotulo">ampliar a peça</span>
          <div className="vitrine__escalas" role="group" aria-label="Ampliação da peça">
            {[1, 1.25, 1.5].map((n) => (
              <button
                key={n}
                type="button"
                className={ampliacao === n ? 'is-ativa' : ''}
                onClick={() => setAmpliacao(n)}
                aria-pressed={ampliacao === n}
              >
                {n === 1 ? 'original' : `${n * 100}%`}
              </button>
            ))}
          </div>
        </div>

        {/* A peça é ampliada, nunca redesenhada: o tipo miúdo e o contraste
            baixo são fidelidade histórica, não defeito a corrigir. */}
        <div className="vitrine__peca" style={{ zoom: ampliacao }}>
          <Suspense fallback={<p className="vitrine__abrindo">abrindo a sala…</p>}>
            <Peca />
          </Suspense>
        </div>
      </div>

      <Placa placa={sala.placa} fontes={sala.fontes} cor={sala.cor} />

      <Vizinhas atual={id} />

      <Rodape />
    </div>
  )
}

function Entrada() {
  const todas = emOrdem()
  const prontas = abertas()
  const emObra = todas.length - prontas.length
  const primeiro = todas[0]
  const ultimo = todas[todas.length - 1]

  return (
    <div className="museu">
      <header className="entrada">
        <p className="entrada__sobrescrito">Museu de</p>
        <h1 className="entrada__titulo">Interfaces Mortas</h1>
        <p className="entrada__linha">
          Um museu onde as peças funcionam. Você não olha a captura de tela — você clica,
          digita, ouve. Cada sala tem uma plaquinha explicando não só o que era, mas
          <em> por que era daquele jeito</em> e <em>o que sobrou disso hoje</em>.
        </p>
        <p className="entrada__dados">
          {prontas.length} peças · de {primeiro.ordem} a {ultimo.ordem} ·{' '}
          {emObra > 0 ? `${emObra} em restauração` : 'acervo completo'}
        </p>
        <p className="entrada__atalho">
          <a href="#cemiterio">Ver o que cada uma deixou →</a>
        </p>
      </header>

      <LinhaDoTempo />

      {ERAS.map((era) => {
        const daEra = todas.filter((s) => s.era === era.id)
        if (daEra.length === 0) return null
        return (
          <section className="era" key={era.id}>
            <header className="era__topo">
              <h2 className="era__nome">{era.nome}</h2>
              <span className="era__periodo">{era.periodo}</span>
            </header>
            <p className="era__resumo">{era.resumo}</p>
            <ul className="salas">
              {daEra.map((s) => (
                <li key={s.id}>
                  <Cartao item={s} />
                </li>
              ))}
            </ul>
          </section>
        )
      })}

      <Rodape />
    </div>
  )
}

function Cartao({ item }: { item: Item }) {
  const estilo = { '--cor': item.cor } as React.CSSProperties

  if (!estaAberta(item)) {
    return (
      <div className="sala sala--restauro" style={estilo}>
        <span className="sala__ano">{item.ordem}</span>
        <h3 className="sala__nome">{item.nome}</h3>
        <p className="sala__resumo">{item.promessa}</p>
        <span className="sala__selo">em restauração</span>
      </div>
    )
  }

  return (
    <a href={`#${item.id}`} className="sala" style={estilo}>
      <span className="sala__ano">{item.ordem}</span>
      <h3 className="sala__nome">{item.placa.nome}</h3>
      <p className="sala__anos">{item.placa.anos}</p>
      <p className="sala__resumo">{item.placa.oQueEra}</p>
      <span className="sala__entrar">entrar na sala →</span>
    </a>
  )
}

function Rodape() {
  const total = ACERVO.length
  return (
    <footer className="rodape">
      <p>
        Todas as peças são <strong>reconstruções de memória</strong>, feitas em HTML e CSS a
        partir do zero. Nenhum arquivo, imagem, logotipo ou som original foi utilizado, e
        nenhuma sala pede login ou senha — um museu não coleta credenciais.
      </p>
      <p>
        Onde há codificação — a fita cassete, o cartão perfurado, o telex — ela é a real, e
        não uma imitação. Cada uma tem teste que codifica e decodifica de volta para
        conferir.
      </p>
      <p>
        São {total} peças, de 1970 a 2006. Quando uma sala nova está sendo construída ela
        aparece aqui mesmo assim, marcada como em restauração — o crescimento também faz
        parte da visita.
      </p>
      <p className="rodape__seguranca">
        <strong>Segurança e privacidade.</strong> Não há servidor, conta, senha, cookie nem
        telemetria. A página declara uma política que proíbe o navegador de fazer{' '}
        <em>qualquer</em> requisição de rede depois de carregada, então tudo o que você
        digitar nas peças — o recado do Orkut, o comando do BBS, o texto do cartão
        perfurado — morre nesta aba e não vai a lugar nenhum.
      </p>

      <div className="creditos">
        <span className="creditos__marcas">
          Código, textos e reconstruções sob licença MIT. Marcas e nomes citados pertencem
          a seus titulares e aparecem em caráter histórico e documental.
        </span>
        <small className="creditos__autoria">
          Copyright © 2026 Weslley Soares · MIT
        </small>
      </div>
    </footer>
  )
}
