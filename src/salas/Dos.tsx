import { useEffect, useRef, useState } from 'react'
import './dos.css'

/**
 * Sala — MS-DOS (a máquina de casa, por volta de 1993).
 *
 * A PERGUNTA:
 *   como era usar o computador quando não havia nada para clicar e
 *   era preciso saber o nome exato do que você queria?
 *
 * O prompt funciona: dir, cd, type, cls, ver, mem, help e alguns outros
 * respondem de verdade sobre um sistema de arquivos falso mas coerente.
 *
 * O detalhe que a sala precisa ensinar é a memória convencional de 640 KB.
 * Era por causa dela que existia o ritual de editar CONFIG.SYS e AUTOEXEC.BAT
 * para liberar alguns quilobytes e o jogo rodar. `mem` está aqui por isso.
 */

type Arquivo = { nome: string; tamanho: number; data: string; conteudo?: string }
type Pasta = { arquivos: Arquivo[]; pastas: string[] }

const DISCO: Record<string, Pasta> = {
  'C:\\': {
    pastas: ['DOS', 'JOGOS', 'TRABALHO'],
    arquivos: [
      {
        nome: 'AUTOEXEC.BAT',
        tamanho: 312,
        data: '12-03-93',
        conteudo: `@ECHO OFF
PROMPT $P$G
PATH C:\\DOS;C:\\
SET BLASTER=A220 I7 D1
LH C:\\DOS\\MOUSE.COM
LH C:\\DOS\\SMARTDRV.EXE 1024
ECHO Bom dia!`,
      },
      {
        nome: 'CONFIG.SYS',
        tamanho: 198,
        data: '12-03-93',
        conteudo: `DEVICE=C:\\DOS\\HIMEM.SYS
DEVICE=C:\\DOS\\EMM386.EXE NOEMS
DOS=HIGH,UMB
FILES=30
BUFFERS=20`,
      },
      { nome: 'COMMAND.COM', tamanho: 52925, data: '31-05-94' },
      { nome: 'IO.SYS', tamanho: 40774, data: '31-05-94' },
    ],
  },
  'C:\\JOGOS': {
    pastas: [],
    arquivos: [
      { nome: 'PRINCE.EXE', tamanho: 108134, data: '04-11-92' },
      { nome: 'DOOM.EXE', tamanho: 715493, data: '10-12-93' },
      { nome: 'MONKEY2.EXE', tamanho: 402118, data: '22-07-92' },
      {
        nome: 'LEIAME.TXT',
        tamanho: 241,
        data: '08-01-94',
        conteudo: `Para o DOOM rodar precisa de 4MB.
Se der "out of memory", tira o SMARTDRV
do AUTOEXEC e da boot de novo.
Nao apagar nada desta pasta!!! - Marcos`,
      },
    ],
  },
  'C:\\TRABALHO': {
    pastas: [],
    arquivos: [
      { nome: 'RELATO~1.DOC', tamanho: 18432, data: '15-02-94' },
      { nome: 'PLANILHA.WK1', tamanho: 9216, data: '02-02-94' },
      { nome: 'CARTA.TXT', tamanho: 512, data: '28-01-94', conteudo: 'Prezado senhor,\n\nVenho por meio desta...' },
    ],
  },
  'C:\\DOS': {
    pastas: [],
    arquivos: [
      { nome: 'EDIT.COM', tamanho: 413, data: '31-05-94' },
      { nome: 'FORMAT.COM', tamanho: 22974, data: '31-05-94' },
      { nome: 'HIMEM.SYS', tamanho: 29136, data: '31-05-94' },
      { nome: 'SMARTDRV.EXE', tamanho: 45145, data: '31-05-94' },
    ],
  },
}

const ABERTURA = [
  'Starting MS-DOS...',
  '',
  'HIMEM is testing extended memory...done.',
  'C:\\DOS\\MOUSE.COM',
  'Driver instalado com sucesso',
  '',
  'Bom dia!',
  '',
]

export function Dos() {
  const [pasta, setPasta] = useState('C:\\')
  const [linhas, setLinhas] = useState<string[]>(ABERTURA)
  const [entrada, setEntrada] = useState('')
  const fimRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fimRef.current?.scrollIntoView({ block: 'nearest' })
  }, [linhas])

  function escrever(novas: string[]) {
    setLinhas((atual) => [...atual, ...novas])
  }

  function executar(cru: string) {
    const bruto = cru.trim()
    escrever([`${pasta}>${bruto}`])
    if (!bruto) return

    const [comando, ...args] = bruto.split(/\s+/)
    const cmd = comando.toUpperCase()
    const arg = args.join(' ').toUpperCase()
    const atual = DISCO[pasta]

    switch (cmd) {
      case 'DIR': {
        const linhasDir = [
          ` Volume in drive C is MICRO-PC`,
          ` Directory of ${pasta}`,
          '',
          ...(pasta !== 'C:\\' ? ['.            <DIR>        12-03-93', '..           <DIR>        12-03-93'] : []),
          ...atual.pastas.map((p) => `${p.padEnd(12)} <DIR>        12-03-93`),
          ...atual.arquivos.map(
            (a) =>
              `${a.nome.padEnd(13)}${String(a.tamanho).padStart(8)}  ${a.data}`,
          ),
          `${String(atual.arquivos.length).padStart(9)} file(s)${String(
            atual.arquivos.reduce((s, a) => s + a.tamanho, 0),
          ).padStart(12)} bytes`,
          `${' '.repeat(22)}13471232 bytes free`,
          '',
        ]
        escrever(linhasDir)
        break
      }

      case 'CD':
      case 'CHDIR': {
        if (!arg || arg === '\\') {
          setPasta('C:\\')
        } else if (arg === '..') {
          setPasta('C:\\')
        } else {
          const destino = pasta === 'C:\\' ? `C:\\${arg}` : `${pasta}\\${arg}`
          if (DISCO[destino]) setPasta(destino)
          else escrever(['Invalid directory', ''])
        }
        break
      }

      case 'TYPE': {
        const achado = atual.arquivos.find((a) => a.nome === arg)
        if (!achado) escrever(['File not found', ''])
        else if (!achado.conteudo)
          escrever(['', '(arquivo binário — a tela enche de caracteres estranhos e o alto-falante apita)', ''])
        else escrever([...achado.conteudo.split('\n'), ''])
        break
      }

      case 'CLS':
        setLinhas([])
        break

      case 'VER':
        escrever(['', 'MS-DOS Version 6.22', ''])
        break

      case 'MEM':
        escrever([
          '',
          'Memory Type        Total  =   Used  +   Free',
          '----------------  -------   -------   -------',
          'Conventional        640K      112K      528K',
          'Upper                59K       45K       14K',
          'Adapter RAM/ROM     325K      325K        0K',
          'Extended (XMS)     3,072K    1,024K    2,048K',
          '----------------  -------   -------   -------',
          'Total memory      4,096K    1,506K    2,590K',
          '',
          'Largest executable program size        528K (540,672 bytes)',
          '',
        ])
        break

      case 'DATE':
        escrever(['Current date is Tue 15-02-1994', ''])
        break

      case 'HELP':
      case '?':
        escrever([
          '',
          'Comandos disponíveis nesta peça de museu:',
          '  DIR      lista os arquivos',
          '  CD       entra numa pasta (CD JOGOS, CD ..)',
          '  TYPE     mostra um arquivo de texto',
          '  MEM      mostra a memória — leia a plaquinha depois',
          '  VER      versão do sistema',
          '  CLS      limpa a tela',
          '  DATE     data do sistema',
          '',
        ])
        break

      case 'FORMAT':
        escrever(['', 'WARNING: ALL DATA ON NON-REMOVABLE DISK', 'DRIVE C: WILL BE LOST!', 'Proceed with Format (Y/N)? N', '', '(o museu recusou por você)', ''])
        break

      default:
        escrever(['Bad command or file name', ''])
    }
  }

  return (
    <div className="dos" onClick={() => inputRef.current?.focus()}>
      <div className="dos__tela">
        {linhas.map((l, i) => (
          <div key={i} className="dos__linha">
            {l || '\u00a0'}
          </div>
        ))}
        <form
          className="dos__entrada"
          onSubmit={(e) => {
            e.preventDefault()
            executar(entrada)
            setEntrada('')
          }}
        >
          <span>{pasta}&gt;</span>
          <input
            ref={inputRef}
            value={entrada}
            onChange={(e) => setEntrada(e.target.value)}
            spellCheck={false}
            autoComplete="off"
            aria-label="Linha de comando"
          />
          <span className="dos__cursor">_</span>
        </form>
        <div ref={fimRef} />
      </div>
      <p className="dos__dica">
        digite <b>help</b> e tecle enter. tente também <b>cd jogos</b>, depois <b>type leiame.txt</b>.
      </p>
    </div>
  )
}
