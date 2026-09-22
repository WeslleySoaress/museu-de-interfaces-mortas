import type { ReactNode } from 'react'
import './janela.css'

/**
 * Chrome de janela, compartilhado pelo Windows 95, pelo XP e pela Lan House.
 *
 * A diferença entre as duas épocas é só de pele: o 95 tem barra azul chapada e
 * bordas em relevo duro; o XP tem barra arredondada com degradê e o botão de
 * fechar vermelho. A estrutura é a mesma, porque era mesmo a mesma.
 */
export function Janela({
  titulo,
  estilo = '95',
  aoFechar,
  aoFocar,
  ativa = true,
  largura,
  children,
}: {
  titulo: string
  estilo?: '95' | 'xp'
  aoFechar?: () => void
  aoFocar?: () => void
  ativa?: boolean
  largura?: number
  children: ReactNode
}) {
  return (
    <section
      className={`jan jan--${estilo} ${ativa ? 'is-ativa' : ''}`}
      style={largura ? { width: largura } : undefined}
      onMouseDown={aoFocar}
    >
      <header className="jan__barra">
        <span className="jan__titulo">{titulo}</span>
        <span className="jan__botoes">
          {/* Minimizar e maximizar são enfeite: não fazem nada, então saem da
              ordem de tabulação e do leitor de tela. Botão que não faz nada é
              pior que botão nenhum. Só o fechar é botão de verdade. */}
          <span className="jan__falso" aria-hidden="true">
            _
          </span>
          <span className="jan__falso" aria-hidden="true">
            □
          </span>
          <button
            type="button"
            className="jan__fechar"
            onClick={aoFechar}
            aria-label={`Fechar ${titulo}`}
          >
            ×
          </button>
        </span>
      </header>
      <div className="jan__corpo">{children}</div>
    </section>
  )
}

/** Barra de tarefas com botão iniciar, janelas abertas e relógio. */
export function Barra({
  estilo = '95',
  rotuloIniciar = 'Iniciar',
  menuAberto,
  aoAlternarMenu,
  abertas,
  aoFocar,
  menu,
}: {
  estilo?: '95' | 'xp'
  rotuloIniciar?: string
  menuAberto: boolean
  aoAlternarMenu: () => void
  abertas: { id: string; nome: string }[]
  aoFocar: (id: string) => void
  menu: ReactNode
}) {
  const hora = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(
    new Date(),
  )

  return (
    <div className={`barra barra--${estilo}`}>
      {menuAberto && <div className="barra__menu">{menu}</div>}

      <button
        type="button"
        className={`barra__iniciar ${menuAberto ? 'is-aberto' : ''}`}
        onClick={aoAlternarMenu}
      >
        <span className="barra__bandeira" aria-hidden />
        {rotuloIniciar}
      </button>

      <div className="barra__abertas">
        {abertas.map((j) => (
          <button key={j.id} type="button" onClick={() => aoFocar(j.id)}>
            {j.nome}
          </button>
        ))}
      </div>

      <span className="barra__relogio">{hora}</span>
    </div>
  )
}
