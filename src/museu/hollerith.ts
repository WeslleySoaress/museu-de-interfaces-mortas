/**
 * Código Hollerith — o cartão perfurado de 80 colunas da IBM, de verdade.
 *
 * Cada coluna do cartão guarda UM caractere, e o caractere é a combinação de
 * furos naquela coluna. São 12 linhas: as três de cima chamadas de zona
 * (12, 11 e 0) e as de baixo numeradas de 1 a 9.
 *
 * A lógica é de uma elegância que sobreviveu ao próprio cartão:
 *
 *   dígito 0–9 ....... um furo só, na linha do número
 *   A a I ............ furo na zona 12 + linha 1 a 9
 *   J a R ............ furo na zona 11 + linha 1 a 9
 *   S a Z ............ furo na zona  0 + linha 2 a 9
 *   espaço ........... nenhum furo
 *
 * Repare que S começa na linha 2, não na 1: sobravam só oito letras para a
 * última zona. Essa irregularidade atravessou décadas e ainda aparece na
 * ordem interna do EBCDIC, o código que a IBM usa em mainframe até hoje.
 *
 * Esta tabela é a do teclado perfurador IBM 029, o modelo mais comum.
 */

export const LINHAS = [12, 11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const
export const COLUNAS = 80

const TABELA: Record<string, number[]> = {
  ' ': [],

  '0': [0], '1': [1], '2': [2], '3': [3], '4': [4],
  '5': [5], '6': [6], '7': [7], '8': [8], '9': [9],

  A: [12, 1], B: [12, 2], C: [12, 3], D: [12, 4], E: [12, 5],
  F: [12, 6], G: [12, 7], H: [12, 8], I: [12, 9],

  J: [11, 1], K: [11, 2], L: [11, 3], M: [11, 4], N: [11, 5],
  O: [11, 6], P: [11, 7], Q: [11, 8], R: [11, 9],

  S: [0, 2], T: [0, 3], U: [0, 4], V: [0, 5],
  W: [0, 6], X: [0, 7], Y: [0, 8], Z: [0, 9],

  '&': [12], '-': [11], '/': [0, 1],

  '.': [12, 3, 8], '<': [12, 4, 8], '(': [12, 5, 8], '+': [12, 6, 8], '|': [12, 7, 8],
  '!': [11, 2, 8], $: [11, 3, 8], '*': [11, 4, 8], ')': [11, 5, 8], ';': [11, 6, 8],
  ',': [0, 3, 8], '%': [0, 4, 8], '_': [0, 5, 8], '>': [0, 6, 8], '?': [0, 7, 8],
  ':': [2, 8], '#': [3, 8], '@': [4, 8], "'": [5, 8], '=': [6, 8], '"': [7, 8],
}

/** Acentos não existiam no cartão. A perfuradora simplesmente não tinha a tecla. */
const SEM_ACENTO: Record<string, string> = {
  Á: 'A', À: 'A', Ã: 'A', Â: 'A', É: 'E', Ê: 'E', Í: 'I',
  Ó: 'O', Ô: 'O', Õ: 'O', Ú: 'U', Ü: 'U', Ç: 'C',
}

export function normalizar(texto: string): string {
  return Array.from(texto.toUpperCase())
    .map((c) => SEM_ACENTO[c] ?? c)
    .map((c) => (TABELA[c] ? c : c === '\n' ? '' : ' '))
    .join('')
    .slice(0, COLUNAS)
}

/** Os furos de um caractere, como lista de linhas perfuradas. */
export function furosDe(caractere: string): number[] {
  return TABELA[caractere] ?? []
}

/** Perfura um texto: devolve, para cada coluna, quais linhas têm furo. */
export function perfurar(texto: string): number[][] {
  const limpo = normalizar(texto)
  const colunas: number[][] = []
  for (let i = 0; i < COLUNAS; i++) {
    colunas.push(i < limpo.length ? furosDe(limpo[i]) : [])
  }
  return colunas
}

const REVERSA = new Map<string, string>(
  Object.entries(TABELA).map(([caractere, furos]) => [[...furos].sort((a, b) => a - b).join(','), caractere]),
)

/**
 * Lê o cartão de volta — era isso que a leitora fazia, passando o cartão na
 * frente de escovas ou de uma lâmpada e vendo onde a luz atravessava.
 */
export function ler(colunas: number[][]): string {
  return colunas
    .map((furos) => REVERSA.get([...furos].sort((a, b) => a - b).join(',')) ?? '?')
    .join('')
    .replace(/\s+$/, '')
}
