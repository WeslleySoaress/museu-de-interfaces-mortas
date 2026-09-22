/**
 * ITA2 — o código Baudot do telex, de verdade.
 *
 * Cinco bits por caractere. Cinco bits dão 32 combinações, e só isso: não cabem
 * 26 letras mais 10 dígitos mais pontuação. A solução foi genial e incômoda —
 * duas tabelas sobre os mesmos 32 códigos, e dois códigos especiais para
 * alternar entre elas:
 *
 *   LTRS (11111) → daqui em diante, leia como letra
 *   FIGS (11011) → daqui em diante, leia como número ou sinal
 *
 * É por isso que telex era tudo em MAIÚSCULA: não sobrava espaço para
 * minúsculas. E é por isso que uma mensagem podia chegar embaralhada — se o
 * código de troca se perdesse no caminho, todo o resto vinha na tabela errada,
 * e o número do pedido chegava como uma palavra sem sentido.
 *
 * Verificado em scripts/smoke-ita2.ts: codifica e decodifica de volta.
 */

export const LTRS = 0b11111
export const FIGS = 0b11011
export const ESPACO = 0b00100
export const CR = 0b00010
export const LF = 0b01000

/** [código, letra, figura] — tabela ITA2 padrão. */
const TABELA: [number, string, string][] = [
  [0b11000, 'A', '-'],
  [0b10011, 'B', '?'],
  [0b01110, 'C', ':'],
  [0b10010, 'D', '$'],
  [0b10000, 'E', '3'],
  [0b10110, 'F', '!'],
  [0b01011, 'G', '&'],
  [0b00101, 'H', '#'],
  [0b01100, 'I', '8'],
  [0b11010, 'J', "'"],
  [0b11110, 'K', '('],
  [0b01001, 'L', ')'],
  [0b00111, 'M', '.'],
  [0b00110, 'N', ','],
  [0b00011, 'O', '9'],
  [0b01101, 'P', '0'],
  [0b11101, 'Q', '1'],
  [0b01010, 'R', '4'],
  [0b10100, 'S', "’"],
  [0b00001, 'T', '5'],
  [0b11100, 'U', '7'],
  [0b01111, 'V', '='],
  [0b11001, 'W', '2'],
  [0b10111, 'X', '/'],
  [0b10101, 'Y', '6'],
  [0b10001, 'Z', '+'],
]

const PARA_LETRA = new Map(TABELA.map(([c, l]) => [c, l]))
const PARA_FIGURA = new Map(TABELA.map(([c, , f]) => [c, f]))
const DE_LETRA = new Map(TABELA.map(([c, l]) => [l, c]))
const DE_FIGURA = new Map(TABELA.map(([c, , f]) => [f, c]))

export type Simbolo = {
  codigo: number
  /** Como aparece no papel. */
  impresso: string
  /** LTRS e FIGS não imprimem nada: são instruções, não caracteres. */
  tipo: 'caractere' | 'troca-letras' | 'troca-figuras' | 'espaco' | 'nova-linha'
}

export function bits(codigo: number): string {
  return codigo.toString(2).padStart(5, '0')
}

const SEM_ACENTO: Record<string, string> = {
  Á: 'A', À: 'A', Ã: 'A', Â: 'A', É: 'E', Ê: 'E', Í: 'I',
  Ó: 'O', Ô: 'O', Õ: 'O', Ú: 'U', Ü: 'U', Ç: 'C',
}

/**
 * Codifica um texto em símbolos ITA2, inserindo as trocas de tabela onde
 * forem necessárias. São elas que o visitante precisa ver acontecendo.
 */
export function codificar(texto: string): Simbolo[] {
  const saida: Simbolo[] = []
  let tabela: 'letras' | 'figuras' = 'letras'

  const limpo = Array.from(texto.toUpperCase()).map((c) => SEM_ACENTO[c] ?? c)

  for (const caractere of limpo) {
    if (caractere === '\n') {
      saida.push({ codigo: CR, impresso: '', tipo: 'nova-linha' })
      continue
    }
    if (caractere === ' ') {
      saida.push({ codigo: ESPACO, impresso: ' ', tipo: 'espaco' })
      continue
    }

    const comoLetra = DE_LETRA.get(caractere)
    const comoFigura = DE_FIGURA.get(caractere)

    if (comoLetra !== undefined) {
      if (tabela !== 'letras') {
        saida.push({ codigo: LTRS, impresso: '', tipo: 'troca-letras' })
        tabela = 'letras'
      }
      saida.push({ codigo: comoLetra, impresso: caractere, tipo: 'caractere' })
    } else if (comoFigura !== undefined) {
      if (tabela !== 'figuras') {
        saida.push({ codigo: FIGS, impresso: '', tipo: 'troca-figuras' })
        tabela = 'figuras'
      }
      saida.push({ codigo: comoFigura, impresso: caractere, tipo: 'caractere' })
    }
    // caractere sem equivalente no ITA2 simplesmente não existia: era ignorado
  }

  return saida
}

/**
 * Decodifica. Se `perderTroca` for verdadeiro, simula o defeito clássico:
 * um código de troca se perde na linha e todo o resto sai na tabela errada.
 */
export function decodificar(simbolos: Simbolo[], perderTroca = false): string {
  let tabela: 'letras' | 'figuras' = 'letras'
  let jaPerdeu = false
  let saida = ''

  for (const s of simbolos) {
    if (s.codigo === LTRS) {
      if (perderTroca && !jaPerdeu) {
        jaPerdeu = true
        continue // o código se perdeu no caminho
      }
      tabela = 'letras'
      continue
    }
    if (s.codigo === FIGS) {
      if (perderTroca && !jaPerdeu) {
        jaPerdeu = true
        continue
      }
      tabela = 'figuras'
      continue
    }
    if (s.codigo === ESPACO) {
      saida += ' '
      continue
    }
    if (s.codigo === CR || s.codigo === LF) {
      saida += '\n'
      continue
    }
    const mapa = tabela === 'letras' ? PARA_LETRA : PARA_FIGURA
    saida += mapa.get(s.codigo) ?? ''
  }

  return saida
}

/**
 * Resposta automática. Toda máquina de telex tinha a sua, gravada num
 * tamborzinho mecânico: ao receber WRU ("who are you"), ela se identificava
 * sozinha. Era a prova de que a mensagem chegou na máquina certa — assinatura
 * eletrônica trinta anos antes do termo existir.
 */
export const RESPOSTA_AUTOMATICA = '11234 IMPBR BR'
