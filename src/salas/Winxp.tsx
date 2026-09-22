import { useState } from 'react'
import { Barra, Janela } from '../componentes/Janela'
import './winxp.css'

/**
 * Sala — Windows XP (2001), usada como entroncamento.
 *
 * A PERGUNTA:
 *   como era começar a usar a internet quando o começo não era uma aba,
 *   era uma área de trabalho cheia de programas instalados?
 *
 * Esta é a única peça do museu que não fala só de si: ela era o lugar de onde
 * tudo era aberto, e aqui continua sendo. Os ícones levam às outras salas —
 * o MSN, a discagem, as páginas pessoais, os blogs.
 *
 * Era assim que a internet dos anos 2000 começava: não numa aba, numa área de
 * trabalho.
 */

type App = 'ie' | 'msn' | 'discada' | 'computador'

const NOMES: Record<App, string> = {
  ie: 'Navegador — Página inicial',
  msn: 'MSN Messenger',
  discada: 'Conexão discada',
  computador: 'Meu computador',
}

const PORTAL = [
  { nome: 'Faça sua página pessoal', sala: 'paginas' },
  { nome: 'Blogs em destaque', sala: 'blogs' },
  { nome: 'Fotolog do dia', sala: 'fotolog' },
  { nome: 'Vídeos engraçados', sala: 'youtube' },
  { nome: 'Salas de bate-papo', sala: 'mirc' },
]

export function Winxp() {
  const [abertas, setAbertas] = useState<App[]>(['ie'])
  const [foco, setFoco] = useState<App>('ie')
  const [menu, setMenu] = useState(false)

  function abrir(app: App) {
    if (!abertas.includes(app)) setAbertas([...abertas, app])
    setFoco(app)
    setMenu(false)
  }

  const fechar = (app: App) => setAbertas(abertas.filter((a) => a !== app))

  return (
    <div className="wxp" onClick={() => menu && setMenu(false)}>
      <div className="wxp__area">
        <ul className="wxp__icones">
          {(
            [
              ['ie', 'Navegador', 'ie'],
              ['msn', 'MSN Messenger', 'msn'],
              ['discada', 'Conexão discada', 'modem'],
              ['computador', 'Meu computador', 'pc'],
            ] as [App, string, string][]
          ).map(([id, nome, icone]) => (
            <li key={id}>
              <button type="button" onClick={() => abrir(id)}>
                <span className={`wxp__icone wxp__icone--${icone}`} aria-hidden />
                {nome}
              </button>
            </li>
          ))}
        </ul>

        <div className="wxp__janelas">
          {abertas.includes('ie') && (
            <Janela
              estilo="xp"
              titulo={NOMES.ie}
              ativa={foco === 'ie'}
              aoFocar={() => setFoco('ie')}
              aoFechar={() => fechar('ie')}
            >
              <div className="wxp__endereco">
                <span>Endereço</span>
                <input readOnly value="http://www.portal.com.br/" aria-label="Endereço" />
                <button type="button">Ir</button>
              </div>
              <div className="wxp__pagina">
                <h2>O seu portal na internet</h2>
                <p className="wxp__pagina-sub">
                  notícias · e-mail grátis · horóscopo · previsão do tempo · classificados
                </p>
                <ul>
                  {PORTAL.map((p) => (
                    <li key={p.sala}>
                      <a href={`#${p.sala}`}>» {p.nome}</a>
                    </li>
                  ))}
                </ul>
                <p className="wxp__pagina-nota">
                  estes links saem do XP e vão para outras salas do museu — era assim que
                  se navegava: tudo começava na área de trabalho.
                </p>
              </div>
            </Janela>
          )}

          {abertas.includes('msn') && (
            <Janela
              estilo="xp"
              titulo={NOMES.msn}
              ativa={foco === 'msn'}
              aoFocar={() => setFoco('msn')}
              aoFechar={() => fechar('msn')}
              largura={280}
            >
              <div className="wxp__atalho">
                <p>
                  O Messenger abria junto com o Windows e ficava ali o dia inteiro, do lado
                  do relógio.
                </p>
                <a className="wxp__botao-sala" href="#msn">
                  abrir a sala do MSN →
                </a>
              </div>
            </Janela>
          )}

          {abertas.includes('discada') && (
            <Janela
              estilo="xp"
              titulo={NOMES.discada}
              ativa={foco === 'discada'}
              aoFocar={() => setFoco('discada')}
              aoFechar={() => fechar('discada')}
              largura={280}
            >
              <div className="wxp__atalho">
                <p>
                  Antes de qualquer coisa, era preciso discar. E avisar em casa que ninguém
                  podia usar o telefone.
                </p>
                <a className="wxp__botao-sala" href="#discada">
                  abrir a sala da discagem →
                </a>
              </div>
            </Janela>
          )}

          {abertas.includes('computador') && (
            <Janela
              estilo="xp"
              titulo={NOMES.computador}
              ativa={foco === 'computador'}
              aoFocar={() => setFoco('computador')}
              aoFechar={() => fechar('computador')}
              largura={320}
            >
              <ul className="wxp__unidades">
                <li>
                  <b>Disco local (C:)</b> <i>40 GB — 12,4 GB livres</i>
                </li>
                <li>
                  <b>Unidade de CD-RW (D:)</b> <i>(vazia)</i>
                </li>
                <li>
                  <b>Meus documentos</b> <i>trabalho escolar, fotos, mp3</i>
                </li>
                <li>
                  <b>Disquete de 3½ (A:)</b> <i>(ainda estava lá)</i>
                </li>
              </ul>
            </Janela>
          )}
        </div>
      </div>

      <Barra
        estilo="xp"
        rotuloIniciar="iniciar"
        menuAberto={menu}
        aoAlternarMenu={() => setMenu(!menu)}
        abertas={abertas.map((a) => ({ id: a, nome: NOMES[a].split(' —')[0] }))}
        aoFocar={(id) => setFoco(id as App)}
        menu={
          <ul className="wxp__menu">
            <li className="wxp__menu-topo">Usuário</li>
            {(Object.keys(NOMES) as App[]).map((a) => (
              <li key={a}>
                <button type="button" onClick={() => abrir(a)}>
                  {NOMES[a].split(' —')[0]}
                </button>
              </li>
            ))}
            <li className="wxp__menu-sep" />
            <li>
              <button type="button" onClick={() => setMenu(false)}>
                Desligar o computador
              </button>
            </li>
          </ul>
        }
      />

      <p className="wxp__dica">
        os links dentro do navegador levam a outras salas do museu — é este o papel da peça.
      </p>
    </div>
  )
}
