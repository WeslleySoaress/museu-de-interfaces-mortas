import { useState } from 'react'
import { Barra, Janela } from '../componentes/Janela'
import './win95.css'

/**
 * Sala — Windows 95.
 *
 * A PERGUNTA:
 *   como foi aprender a usar um computador que pela primeira vez não
 *   exigia decorar comando nenhum?
 *
 * A área de trabalho que ensinou o país a usar mouse. Os três programas
 * funcionam: o Bloco de Notas edita, o Paint desenha, o Meu Computador lista.
 *
 * O leia-me.txt tem coisa escondida — procure.
 */

const LEIAME = `           BEM-VINDO AO MICROCOMPUTADOR
           =============================

Este computador foi configurado em 24/08/1995.

ANTES DE USAR, LEIA:

1. Nao desligue na tomada. Use Iniciar > Desligar
   e espere a mensagem dizendo que pode desligar.

2. O disquete so sai depois que a luz apagar.
   Se tirar antes, perde tudo. Ja aconteceu duas
   vezes nesta casa.

3. Nao mexa na pasta C:\\WINDOWS. Nada la dentro
   e util para voce.

4. Se travar, aperte Ctrl+Alt+Del UMA vez e espere.
   Duas vezes reinicia.


                    - - -

.                 (rolando ainda)










           voce chegou ate aqui.

           entao merece saber: a pasta
           C:\\JOGOS nao aparece no Meu
           Computador, mas existe.

           e o Paint aceita clique com o
           botao direito para apagar.

                    - - -

           quem escreveu isto foi o filho
           mais velho, em 1995, para o pai
           nao estragar o computador de novo.
`

type App = 'leiame' | 'paint' | 'computador'

const NOMES: Record<App, string> = {
  leiame: 'leia-me.txt — Bloco de Notas',
  paint: 'sem título — Paint',
  computador: 'Meu Computador',
}

export function Win95() {
  const [abertas, setAbertas] = useState<App[]>(['leiame'])
  const [foco, setFoco] = useState<App>('leiame')
  const [menu, setMenu] = useState(false)
  const [texto, setTexto] = useState(LEIAME)
  const [pixels, setPixels] = useState<Record<string, string>>({})
  const [cor, setCor] = useState('#000080')
  const [pintando, setPintando] = useState(false)

  function abrir(app: App) {
    if (!abertas.includes(app)) setAbertas([...abertas, app])
    setFoco(app)
    setMenu(false)
  }

  function fechar(app: App) {
    setAbertas(abertas.filter((a) => a !== app))
  }

  function pintar(x: number, y: number, apagar: boolean) {
    setPixels((p) => {
      const copia = { ...p }
      if (apagar) delete copia[`${x},${y}`]
      else copia[`${x},${y}`] = cor
      return copia
    })
  }

  return (
    <div className="w95" onClick={() => menu && setMenu(false)}>
      <div className="w95__area">
        <ul className="w95__icones">
          <li>
            <button type="button" onClick={() => abrir('computador')}>
              <span className="w95__icone w95__icone--pc" aria-hidden />
              Meu Computador
            </button>
          </li>
          <li>
            <button type="button" onClick={() => abrir('leiame')}>
              <span className="w95__icone w95__icone--txt" aria-hidden />
              leia-me.txt
            </button>
          </li>
          <li>
            <button type="button" onClick={() => abrir('paint')}>
              <span className="w95__icone w95__icone--paint" aria-hidden />
              Paint
            </button>
          </li>
        </ul>

        <div className="w95__janelas">
          {abertas.includes('leiame') && (
            <Janela
              titulo={NOMES.leiame}
              ativa={foco === 'leiame'}
              aoFocar={() => setFoco('leiame')}
              aoFechar={() => fechar('leiame')}
            >
              <textarea
                className="w95__bloco"
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                spellCheck={false}
                aria-label="Bloco de Notas"
              />
            </Janela>
          )}

          {abertas.includes('paint') && (
            <Janela
              titulo={NOMES.paint}
              ativa={foco === 'paint'}
              aoFocar={() => setFoco('paint')}
              aoFechar={() => fechar('paint')}
            >
              <div className="w95__paint">
                <div className="w95__cores">
                  {['#000000', '#000080', '#008000', '#800000', '#808000', '#800080', '#00ffff', '#ffffff'].map(
                    (c) => (
                      <button
                        key={c}
                        type="button"
                        style={{ background: c }}
                        className={cor === c ? 'is-ativa' : ''}
                        onClick={() => setCor(c)}
                        aria-label={`Cor ${c}`}
                      />
                    ),
                  )}
                </div>
                <div
                  className="w95__tela"
                  onMouseDown={() => setPintando(true)}
                  onMouseUp={() => setPintando(false)}
                  onMouseLeave={() => setPintando(false)}
                  onContextMenu={(e) => e.preventDefault()}
                >
                  {Array.from({ length: 16 }, (_, y) =>
                    Array.from({ length: 28 }, (_, x) => (
                      <span
                        key={`${x},${y}`}
                        style={{ background: pixels[`${x},${y}`] ?? '#fff' }}
                        onMouseDown={(e) => pintar(x, y, e.button === 2)}
                        onMouseEnter={(e) => pintando && pintar(x, y, e.buttons === 2)}
                      />
                    )),
                  )}
                </div>
                <p className="w95__paint-nota">clique para pintar · botão direito apaga</p>
              </div>
            </Janela>
          )}

          {abertas.includes('computador') && (
            <Janela
              titulo={NOMES.computador}
              ativa={foco === 'computador'}
              aoFocar={() => setFoco('computador')}
              aoFechar={() => fechar('computador')}
              largura={300}
            >
              <ul className="w95__unidades">
                <li>
                  <b>A:</b> Disquete de 3½ <i>(vazio)</i>
                </li>
                <li>
                  <b>C:</b> Disco local <i>420 MB — 61 MB livres</i>
                </li>
                <li>
                  <b>D:</b> CD-ROM 4x <i>(vazio)</i>
                </li>
                <li>
                  <b>—</b> Painel de Controle
                </li>
                <li>
                  <b>—</b> Impressoras
                </li>
              </ul>
              <p className="w95__nota-disco">
                420 MB era um disco grande em 1995. Hoje não caberia uma foto de celular
                dentro dele quatro vezes.
              </p>
            </Janela>
          )}
        </div>
      </div>

      <Barra
        menuAberto={menu}
        aoAlternarMenu={() => setMenu(!menu)}
        abertas={abertas.map((a) => ({ id: a, nome: NOMES[a].split(' —')[0] }))}
        aoFocar={(id) => setFoco(id as App)}
        menu={
          <ul className="w95__menu">
            <li>
              <button type="button" onClick={() => abrir('paint')}>
                Programas ▸ Paint
              </button>
            </li>
            <li>
              <button type="button" onClick={() => abrir('leiame')}>
                Documentos ▸ leia-me.txt
              </button>
            </li>
            <li>
              <button type="button" onClick={() => abrir('computador')}>
                Configurações
              </button>
            </li>
            <li className="w95__menu-sep" />
            <li>
              <button type="button" onClick={() => setMenu(false)}>
                Desligar…
              </button>
            </li>
          </ul>
        }
      />

      <p className="w95__dica">
        abra o <b>leia-me.txt</b> e role até o fim. tem coisa escondida lá embaixo.
      </p>
    </div>
  )
}
