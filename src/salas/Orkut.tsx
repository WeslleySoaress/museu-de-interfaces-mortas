import { useState } from 'react'
import './orkut.css'

/**
 * Sala 1 — a rede social onde o Brasil aprendeu a ter perfil.
 *
 * A PERGUNTA:
 *   como era ter um perfil público pela primeira vez, sabendo que
 *   outras pessoas entravam nele e deixavam recado?
 *
 * Reconstrução de memória, não cópia: nenhum arquivo, logotipo ou imagem
 * original foi usado. O que está aqui é a gramática visual da época —
 * Verdana 11px, caixas de canto arredondado, cabeçalho azul, tudo empilhado
 * em coluna estreita porque a tela padrão tinha 1024 pixels de largura.
 *
 * Sem tela de login, por decisão de projeto: o visitante entra já dentro.
 */

const COMUNIDADES = [
  'Eu odeio acordar cedo',
  'Eu já dormi na aula',
  'Odeio segunda-feira',
  'Eu escrevo errado de propósito',
  'Tenho medo de barata que voa',
  'Eu fiz a lição no recreio',
  'Chocolate resolve tudo',
  'Eu finjo que tô dormindo',
  'Quem disse que homem não chora?',
]

const DEPOIMENTOS = [
  {
    de: 'Juliana',
    texto:
      'aki naum eh depoimento naum, eh só pra dizer q vc eh a pessoa mais linda q eu conheço!! te amuu miga, nunca mudaa. bjks no core',
    data: '14/03/2006',
  },
  {
    de: 'Rafael',
    texto:
      'cara, se não fosse vc eu tinha reprovado em física. valeu mesmo. qualquer coisa tamo junto',
    data: '02/09/2005',
  },
]

const AMIGOS = ['Juliana', 'Rafael', 'Thaís', 'Bruno', 'Camila', 'Diego', 'Letícia', 'Marcos', 'Paula']

type Recado = { de: string; texto: string; data: string }

const RECADOS_INICIAIS: Recado[] = [
  { de: 'Thaís', texto: 'oiee sumida!! responde meu msn depois', data: 'hoje, 14:32' },
  { de: 'Bruno', texto: 'entra no fotolog q eu postei foto nova', data: 'ontem, 21:07' },
  { de: 'Camila', texto: 'vc vai na festa sabado???', data: 'ontem, 19:44' },
]

export function Orkut() {
  const [recados, setRecados] = useState<Recado[]>(RECADOS_INICIAIS)
  const [novo, setNovo] = useState('')
  const [notas, setNotas] = useState({ confiavel: 2, legal: 3, sexy: 1 })
  const [comunidadeAberta, setComunidadeAberta] = useState<string | null>(null)

  function enviarRecado(e: React.FormEvent) {
    e.preventDefault()
    if (!novo.trim()) return
    setRecados([{ de: 'você', texto: novo.trim(), data: 'agora' }, ...recados])
    setNovo('')
  }

  return (
    <div className="orkut">
      <div className="orkut__topo">
        <div className="orkut__marca">
          <span className="orkut__marca-o">o</span>rkut
        </div>
        <div className="orkut__menu">
          {/* Menu decorativo. Não pode ser <a href="#perfil">: o museu roteia
              por hash, e clicar aqui jogava o visitante para fora da sala, de
              volta para a entrada. Peça de museu não navega o museu. */}
          <span className="orkut__item">início</span>
          <span className="orkut__item">perfil</span>
          <span className="orkut__item">amigos</span>
          <span className="orkut__item">comunidades</span>
          <span className="orkut__sair">sair</span>
        </div>
      </div>

      <div className="orkut__barra">
        <span>
          <strong>Carolina</strong> — <em>me encontra no msn</em>
        </span>
        <span className="orkut__visitas">seu perfil foi visto 47 vezes hoje</span>
      </div>

      <div className="orkut__corpo">
        <div className="orkut__coluna orkut__coluna--esq">
          <div className="orkut__caixa">
            <div className="orkut__foto" aria-hidden>
              <div className="orkut__foto-inicial">C</div>
            </div>
            <p className="orkut__nome">Carolina</p>
            <p className="orkut__frase">“nem tudo que se enfrenta pode ser modificado”</p>
            <ul className="orkut__contadores">
              <li>
                <b>recados</b> <span>{recados.length}</span>
              </li>
              <li>
                <b>fotos</b> <span>28</span>
              </li>
              <li>
                <b>vídeos</b> <span>2</span>
              </li>
              <li>
                <b>fãs</b> <span>13</span>
              </li>
            </ul>
          </div>

          <div className="orkut__caixa">
            <h3 className="orkut__titulo">avaliar</h3>
            <Escala
              rotulo="confiável"
              simbolo="❄"
              valor={notas.confiavel}
              aoMudar={(v) => setNotas({ ...notas, confiavel: v })}
            />
            <Escala
              rotulo="legal"
              simbolo="♥"
              valor={notas.legal}
              aoMudar={(v) => setNotas({ ...notas, legal: v })}
            />
            <Escala
              rotulo="sexy"
              simbolo="☺"
              valor={notas.sexy}
              aoMudar={(v) => setNotas({ ...notas, sexy: v })}
            />
            <p className="orkut__nota-rodape">
              cubos de gelo, corações e carinhas. era assim que se media uma pessoa.
            </p>
          </div>
        </div>

        <div className="orkut__coluna orkut__coluna--meio">
          <div className="orkut__caixa">
            <h3 className="orkut__titulo">sobre mim</h3>
            <p className="orkut__sobre">
              16 anos, escorpiana, apaixonada por música. odeio falsidade e gente que
              promete e não cumpre. quem me conhece sabe. ass.: a louca do teclado ✌
            </p>
          </div>

          <div className="orkut__caixa">
            <h3 className="orkut__titulo">depoimentos ({DEPOIMENTOS.length})</h3>
            {DEPOIMENTOS.map((d) => (
              <div key={d.de} className="orkut__depoimento">
                <p className="orkut__depoimento-texto">{d.texto}</p>
                <p className="orkut__depoimento-assina">
                  — {d.de}, {d.data}
                </p>
              </div>
            ))}
          </div>

          <div className="orkut__caixa" id="recados">
            <h3 className="orkut__titulo">recados</h3>
            <form onSubmit={enviarRecado} className="orkut__form">
              <textarea
                value={novo}
                onChange={(e) => setNovo(e.target.value)}
                placeholder="deixe um recado…"
                rows={3}
                maxLength={300}
                aria-label="Escreva um recado"
              />
              <button type="submit" disabled={!novo.trim()}>
                enviar recado
              </button>
            </form>
            {recados.map((r, i) => (
              <div key={i} className="orkut__recado">
                <p className="orkut__recado-de">
                  <b>{r.de}</b> <span>{r.data}</span>
                </p>
                <p>{r.texto}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="orkut__coluna orkut__coluna--dir">
          <div className="orkut__caixa" id="comunidades">
            <h3 className="orkut__titulo">comunidades ({COMUNIDADES.length})</h3>
            <div className="orkut__comunidades">
              {COMUNIDADES.map((c) => (
                <button
                  key={c}
                  type="button"
                  className="orkut__comunidade"
                  onClick={() => setComunidadeAberta(comunidadeAberta === c ? null : c)}
                  title={c}
                >
                  <span className="orkut__comunidade-icone" aria-hidden />
                  <span className="orkut__comunidade-nome">{c}</span>
                </button>
              ))}
            </div>
            {comunidadeAberta && (
              <p className="orkut__comunidade-aberta">
                <b>{comunidadeAberta}</b>
                <br />
                {membrosDe(comunidadeAberta).toLocaleString('pt-BR')} membros ·
                fundada em 2005 · último tópico há 11 anos
              </p>
            )}
          </div>

          <div className="orkut__caixa" id="amigos">
            <h3 className="orkut__titulo">amigos ({AMIGOS.length})</h3>
            <div className="orkut__amigos">
              {AMIGOS.map((a) => (
                <div key={a} className="orkut__amigo">
                  <div className="orkut__amigo-foto" aria-hidden>
                    {a[0]}
                  </div>
                  <span>{a}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <p className="orkut__rodape">
        reconstrução de memória · nenhum arquivo ou imagem original foi utilizado
      </p>
    </div>
  )
}

/**
 * Número de membros derivado do nome, e não sorteado: com Math.random o valor
 * mudava a cada renderização e a comunidade "crescia" enquanto você olhava.
 */
function membrosDe(nome: string): number {
  let h = 0
  for (let i = 0; i < nome.length; i++) h = (h * 31 + nome.charCodeAt(i)) >>> 0
  return 12000 + (h % 400000)
}

function Escala({
  rotulo,
  simbolo,
  valor,
  aoMudar,
}: {
  rotulo: string
  simbolo: string
  valor: number
  aoMudar: (v: number) => void
}) {
  return (
    <div className="orkut__escala">
      <span className="orkut__escala-rotulo">{rotulo}</span>
      <span className="orkut__escala-itens">
        {[1, 2, 3].map((n) => (
          <button
            key={n}
            type="button"
            className={n <= valor ? 'is-cheio' : ''}
            onClick={() => aoMudar(n === valor ? 0 : n)}
            aria-label={`${rotulo}: ${n} de 3`}
          >
            {simbolo}
          </button>
        ))}
      </span>
    </div>
  )
}
