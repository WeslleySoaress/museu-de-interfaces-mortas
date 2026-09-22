import { useEffect, useRef, useState } from 'react'
import './videotexto.css'

/**
 * Sala — Videotexto (Telesp, 1982).
 *
 * A PERGUNTA:
 *   como era consultar informação de casa antes da internet, por um
 *   serviço que a companhia telefônica controlava inteiro?
 *
 * A pré-internet brasileira. Reconstrução da gramática do videotexto: tela de
 * 40 colunas, paleta de 8 cores puras, navegação por número de página e
 * desenho feito com blocos, porque não havia como mandar imagem.
 *
 * O detalhe que define a experiência é a LENTIDÃO: a página chegava pelo
 * modem a 1200 bits por segundo e você via o texto sendo pintado caractere
 * por caractere. Reproduzo isso de propósito — sem essa espera, a peça mente
 * sobre o que era estar ali.
 */

type Pagina = {
  numero: string
  titulo: string
  linhas: string[]
  opcoes: { tecla: string; texto: string; vai: string }[]
}

const PAGINAS: Record<string, Pagina> = {
  '100': {
    numero: '100',
    titulo: 'VIDEOTEXTO TELESP',
    linhas: [
      '',
      '  §1BEM-VINDO AO VIDEOTEXTO',
      '',
      '  §7Servico de informacoes da Telesp',
      '  §7assinante  011-2345  conectado',
      '',
      '  §3ESCOLHA UM SERVICO:',
      '',
    ],
    opcoes: [
      { tecla: '1', texto: 'NOTICIAS DO DIA', vai: '110' },
      { tecla: '2', texto: 'PREVISAO DO TEMPO', vai: '120' },
      { tecla: '3', texto: 'SALDO BANCARIO', vai: '130' },
      { tecla: '4', texto: 'CORREIO ELETRONICO', vai: '140' },
      { tecla: '5', texto: 'CLASSIFICADOS', vai: '150' },
    ],
  },
  '110': {
    numero: '110',
    titulo: 'NOTICIAS',
    linhas: [
      '',
      '  §2NOTICIAS DO DIA',
      '  §7quinta-feira, 18 de marco',
      '',
      '  §1> Governo anuncia novo pacote',
      '    economico para conter a inflacao',
      '',
      '  §1> Selecao embarca hoje para a',
      '    Europa em preparacao para a Copa',
      '',
      '  §1> Telesp amplia rede de videotexto',
      '    para mais 3 mil assinantes',
      '',
      '  §6atualizado as 06h00',
      '',
    ],
    opcoes: [{ tecla: '0', texto: 'VOLTAR AO INDICE', vai: '100' }],
  },
  '120': {
    numero: '120',
    titulo: 'TEMPO',
    linhas: [
      '',
      '  §6PREVISAO DO TEMPO',
      '',
      '  §1SAO PAULO      §3 18 C  §7nublado',
      '  §1RIO DE JANEIRO §3 27 C  §7sol',
      '  §1BELO HORIZONTE §3 22 C  §7sol',
      '  §1PORTO ALEGRE   §3 14 C  §7chuva',
      '  §1SALVADOR       §3 29 C  §7sol',
      '  §1RECIFE         §3 30 C  §7sol',
      '',
      '  §5CHUVA PREVISTA PARA A NOITE',
      '  §5NA GRANDE SAO PAULO',
      '',
    ],
    opcoes: [{ tecla: '0', texto: 'VOLTAR AO INDICE', vai: '100' }],
  },
  '130': {
    numero: '130',
    titulo: 'BANCO',
    linhas: [
      '',
      '  §3SERVICO BANCARIO',
      '',
      '  §7conta corrente  01234-5',
      '',
      '  §1SALDO DISPONIVEL',
      '  §2Cr$ 184.320,00',
      '',
      '  §7ultimos lancamentos:',
      '  §115/03  deposito      §2+ 250.000',
      '  §114/03  cheque 000421 §5-  65.680',
      '  §112/03  tarifa        §5-     840',
      '',
      '  §6consulta sem custo de ligacao',
      '',
    ],
    opcoes: [{ tecla: '0', texto: 'VOLTAR AO INDICE', vai: '100' }],
  },
  '140': {
    numero: '140',
    titulo: 'CORREIO',
    linhas: [
      '',
      '  §4CORREIO ELETRONICO',
      '',
      '  §7voce tem 2 mensagens novas',
      '',
      '  §11. de 011-9988  18/03',
      '     §7REUNIAO CONFIRMADA SEXTA 14H',
      '',
      '  §12. de 011-4455  17/03',
      '     §7RECEBI OS DOCUMENTOS OBRIGADO',
      '',
      '  §6mensagem limitada a 20 linhas',
      '',
    ],
    opcoes: [{ tecla: '0', texto: 'VOLTAR AO INDICE', vai: '100' }],
  },
  '150': {
    numero: '150',
    titulo: 'CLASSIFICADOS',
    linhas: [
      '',
      '  §5CLASSIFICADOS',
      '',
      '  §1VENDO MONZA 84 unico dono',
      '  §7tratar 011-3344 apos as 19h',
      '',
      '  §1APARTAMENTO 2 DORM PERDIZES',
      '  §7aceito financiamento',
      '',
      '  §1MICRO MSX HOTBIT com 12 fitas',
      '  §7estado de novo, tratar a noite',
      '',
    ],
    opcoes: [{ tecla: '0', texto: 'VOLTAR AO INDICE', vai: '100' }],
  },
}

// Paleta do videotexto: 8 cores puras, sem meio-tom. O marcador §1..§7 dentro
// do texto troca a cor a partir dali, que é o que os códigos de controle do
// videotexto faziam de verdade.
//
// A primeira versão usava os próprios caracteres de controle (0x01 a 0x07).
// Funcionava na tela e quebrou na publicação: minificados, aqueles bytes ficam
// soltos no meio do arquivo JavaScript e o servidor recusa o pacote por
// parecer binário. Um marcador legível resolve — e deixa a fonte legível.
const CORES = [
  '#000000',
  '#ffffff',
  '#ffff00',
  '#00ffff',
  '#00ff00',
  '#ff5555',
  '#888888',
  '#55aaff',
]

const VELOCIDADE_MS = 6 // aproxima os 1200 bps de pintura da tela

export function Videotexto() {
  const [paginaId, setPaginaId] = useState('100')
  const [visivel, setVisivel] = useState(0)
  const [entrada, setEntrada] = useState('')
  const timerRef = useRef<number | null>(null)

  const pagina = PAGINAS[paginaId] ?? PAGINAS['100']
  const corpo = [
    ...pagina.linhas,
    ...pagina.opcoes.map((o) => `  §2${o.tecla}§1 ${o.texto}`),
    '',
    '  §6digite o numero e tecle ENVIAR',
  ]
  const totalCaracteres = corpo.join('\n').length

  // Pintura progressiva da pagina.
  useEffect(() => {
    setVisivel(0)
    if (timerRef.current) clearInterval(timerRef.current)
    const id = window.setInterval(() => {
      setVisivel((v) => {
        if (v >= totalCaracteres) {
          clearInterval(id)
          return v
        }
        return v + 2
      })
    }, VELOCIDADE_MS)
    timerRef.current = id
    return () => clearInterval(id)
  }, [paginaId, totalCaracteres])

  const carregando = visivel < totalCaracteres

  function ir(destino: string) {
    if (PAGINAS[destino]) setPaginaId(destino)
    setEntrada('')
  }

  function enviar(e: React.FormEvent) {
    e.preventDefault()
    const alvo = pagina.opcoes.find((o) => o.tecla === entrada.trim())
    if (alvo) ir(alvo.vai)
    else if (PAGINAS[entrada.trim()]) ir(entrada.trim())
    else setEntrada('')
  }

  return (
    <div className="vtx">
      <div className="vtx__tv">
        <div className="vtx__tela">
          <div className="vtx__cabecalho">
            <span>TELESP VIDEOTEXTO</span>
            <span>
              PAG {pagina.numero} {carregando ? '· RECEBENDO…' : '· PRONTA'}
            </span>
          </div>
          <pre className="vtx__corpo">{renderizar(corpo, visivel)}</pre>
        </div>
      </div>

      <form className="vtx__teclado" onSubmit={enviar}>
        <label htmlFor="vtx-num">PAGINA</label>
        <input
          id="vtx-num"
          value={entrada}
          onChange={(e) => setEntrada(e.target.value.replace(/\D/g, '').slice(0, 3))}
          inputMode="numeric"
          placeholder="___"
        />
        <button type="submit">ENVIAR</button>
        <div className="vtx__atalhos">
          {pagina.opcoes.map((o) => (
            <button key={o.tecla} type="button" onClick={() => ir(o.vai)}>
              {o.tecla}
            </button>
          ))}
        </div>
      </form>

      <p className="vtx__nota">
        a página é pintada devagar de propósito: chegava a 1200 bits por segundo e você
        via o texto aparecendo. sem a espera, a peça mentiria.
      </p>
    </div>
  )
}

/** Aplica os códigos de cor e corta no ponto já "recebido". */
function renderizar(linhas: string[], ate: number) {
  const saida: React.ReactNode[] = []
  let contados = 0

  linhas.forEach((linha, iLinha) => {
    const partes: React.ReactNode[] = []
    let cor = CORES[1]
    let buffer = ''
    let chave = 0

    const despejar = () => {
      if (!buffer) return
      partes.push(
        <span key={chave++} style={{ color: cor }}>
          {buffer}
        </span>,
      )
      buffer = ''
    }

    for (let i = 0; i < linha.length; i++) {
      if (contados >= ate) break
      const caractere = linha[i]
      const proximo = linha[i + 1]
      if (caractere === '§' && proximo >= '1' && proximo <= '7') {
        despejar()
        cor = CORES[Number(proximo)]
        i++
        contados++
        continue
      }
      buffer += caractere
      contados++
    }
    despejar()

    saida.push(<div key={iLinha}>{partes.length ? partes : ' '}</div>)
    contados++ // a quebra de linha também "custa"
  })

  return saida
}
