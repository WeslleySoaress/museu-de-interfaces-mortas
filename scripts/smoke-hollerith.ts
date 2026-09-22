// Verifica a codificacao Hollerith: perfura um texto, le o cartao de volta e
// compara. Tambem confere as regras estruturais do codigo IBM 029.
//   node --experimental-strip-types scripts/smoke-hollerith.ts
import { perfurar, ler, furosDe, normalizar, COLUNAS } from '../src/museu/hollerith.ts'

let falhas = 0
const ok = (cond: boolean, msg: string) => {
  console.log((cond ? '  ok   ' : '  FALHA') + '  ' + msg)
  if (!cond) falhas++
}

console.log('--- regras estruturais do codigo IBM 029 ---')
ok(furosDe(' ').length === 0, 'espaco nao tem furo')
for (let d = 0; d <= 9; d++) {
  const f = furosDe(String(d))
  if (f.length !== 1 || f[0] !== d) { ok(false, `digito ${d} devia ser um furo na linha ${d}`); break }
}
ok(true, 'digitos 0-9 sao um furo unico na propria linha')

const zona = (letra: string) => furosDe(letra)[0]
ok('ABCDEFGHI'.split('').every(l => zona(l) === 12), 'A-I usam a zona 12')
ok('JKLMNOPQR'.split('').every(l => zona(l) === 11), 'J-R usam a zona 11')
ok('STUVWXYZ'.split('').every(l => zona(l) === 0),  'S-Z usam a zona 0')
ok(furosDe('A')[1] === 1 && furosDe('I')[1] === 9, 'A comeca na linha 1 e I termina na 9')
ok(furosDe('S')[1] === 2 && furosDe('Z')[1] === 9, 'S comeca na linha 2 (a irregularidade historica)')

console.log()
console.log('--- ida e volta ---')
const casos = [
  'HELLO WORLD',
  'BANCO DO BRASIL SA',
  'CENSO 1970 - IBGE',
  'LOTE 00123 VALOR 45.678,90',
  'A/B (C) *D* #E @F',
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789',
]
for (const caso of casos) {
  const cartao = perfurar(caso)
  const lido = ler(cartao)
  const esperado = normalizar(caso).replace(/\s+$/, '')
  ok(lido === esperado, `"${caso}" -> "${lido}"`)
}

console.log()
console.log('--- acentos (a perfuradora nao tinha a tecla) ---')
const acentuado = 'JOSE DA SILVA - SAO PAULO'
ok(ler(perfurar('JOSÉ DA SILVA - SÃO PAULO')) === acentuado, `acentos caem: -> "${ler(perfurar('JOSÉ DA SILVA - SÃO PAULO'))}"`)

console.log()
console.log('--- formato do cartao ---')
ok(perfurar('X').length === COLUNAS, `cartao sempre com ${COLUNAS} colunas`)
const totalFuros = perfurar('ABCDEFGHIJKLMNOPQRSTUVWXYZ').reduce((s, c) => s + c.length, 0)
ok(totalFuros === 26 * 2, `26 letras = ${totalFuros} furos (2 por letra: zona + linha)`)

console.log()
console.log(falhas === 0 ? 'TUDO CERTO' : `${falhas} FALHA(S)`)
if (falhas) process.exitCode = 1
