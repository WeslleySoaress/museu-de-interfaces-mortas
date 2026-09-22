// Verifica o codigo ITA2 (Baudot) do telex: codifica, decodifica e compara.
// Tambem demonstra o defeito classico da troca de tabela perdida.
//   node --experimental-strip-types scripts/smoke-ita2.ts
import { codificar, decodificar, bits, LTRS, FIGS } from '../src/museu/ita2.ts'

let falhas = 0
const ok = (c: boolean, m: string) => { console.log((c ? '  ok   ' : '  FALHA') + '  ' + m); if (!c) falhas++ }

console.log('--- estrutura do codigo ---')
ok(bits(LTRS) === '11111', `LTRS = ${bits(LTRS)}`)
ok(bits(FIGS) === '11011', `FIGS = ${bits(FIGS)}`)
const todos = codificar('ABCDEFGHIJKLMNOPQRSTUVWXYZ')
ok(todos.every(s => s.codigo >= 0 && s.codigo <= 31), 'todo codigo cabe em 5 bits (0-31)')
ok(todos.length === 26, '26 letras = 26 simbolos, sem troca de tabela')

console.log()
console.log('--- ida e volta ---')
const casos = [
  'BOM DIA',
  'PEDIDO 4521 CONFIRMADO',
  'EMBARQUE DIA 12 AS 9 HORAS',
  'VALOR CR 45.678 URGENTE',
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789',
]
for (const caso of casos) {
  const s = codificar(caso)
  const volta = decodificar(s)
  ok(volta === caso, `"${caso}"`)
}

console.log()
console.log('--- as trocas de tabela aparecem onde devem ---')
const misto = codificar('PEDIDO 4521 OK')
const trocas = misto.filter(s => s.tipo.startsWith('troca'))
ok(trocas.length === 2, `"PEDIDO 4521 OK" precisa de ${trocas.length} trocas (FIGS antes do numero, LTRS depois)`)
console.log('        sequencia:', misto.map(s =>
  s.tipo === 'troca-figuras' ? '[FIGS]' : s.tipo === 'troca-letras' ? '[LTRS]' : s.impresso === ' ' ? '_' : s.impresso
).join(''))

console.log()
console.log('--- o defeito classico: troca perdida na linha ---')
const original = 'PEDIDO 4521 CONFIRMADO'
const corrompido = decodificar(codificar(original), true)
ok(corrompido !== original, 'perdendo uma troca, a mensagem sai errada')
console.log('        enviado :', original)
console.log('        recebido:', corrompido)

console.log()
console.log('--- custo em bits ---')
const texto = 'EMBARQUE DIA 12 AS 9 HORAS'
const simbolos = codificar(texto)
console.log(`        "${texto}"`)
console.log(`        ${texto.length} caracteres -> ${simbolos.length} simbolos -> ${simbolos.length * 5} bits`)
console.log(`        (ASCII de 8 bits gastaria ${texto.length * 8} bits)`)

console.log()
console.log(falhas === 0 ? 'TUDO CERTO' : `${falhas} FALHA(S)`)
if (falhas) process.exitCode = 1
