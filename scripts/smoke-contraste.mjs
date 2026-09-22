// Confere o contraste WCAG dos pares de cor da moldura do museu.
// AA exige 4.5:1 para texto normal e 3:1 para texto grande (>=24px ou 19px negrito).
const hex = h => [1,3,5].map(i => parseInt(h.slice(i,i+2),16)/255)
const lin = c => c <= 0.03928 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4)
const lum = h => { const [r,g,b] = hex(h).map(lin); return 0.2126*r + 0.7152*g + 0.0722*b }
const contraste = (a,b) => { const [x,y] = [lum(a), lum(b)].sort((p,q)=>q-p); return (x+0.05)/(y+0.05) }

const CORES = {
  tinta: '#f2efe9', tintaMedia: '#b5afa6', tintaFraca: '#8d877e',
  fundo: '#0b0a09', papel: '#151410', papelAlto: '#1c1a16',
}

const pares = [
  ['tinta',      'fundo',     17, 'corpo principal'],
  ['tinta',      'papel',     17, 'texto da plaquinha'],
  ['tintaMedia', 'fundo',     17, 'texto de apoio'],
  ['tintaMedia', 'papel',     15, 'resumo no cartao da sala'],
  ['tintaFraca', 'fundo',     13, 'fontes, rotulos, creditos'],
  ['tintaFraca', 'papel',     13, 'fontes dentro da plaquinha'],
  ['tintaMedia', 'papelAlto', 12, 'controle de ampliacao'],
]

console.log('par'.padEnd(26), 'px'.padStart(3), 'razao'.padStart(8), '  AA', '  uso')
console.log('-'.repeat(78))
let falhas = 0
for (const [frente, fundo, px, uso] of pares) {
  const r = contraste(CORES[frente], CORES[fundo])
  const grande = px >= 24
  const minimo = grande ? 3 : 4.5
  const passa = r >= minimo
  if (!passa) falhas++
  console.log(
    `${frente} sobre ${fundo}`.padEnd(26),
    String(px).padStart(3),
    (r.toFixed(2)+':1').padStart(8),
    passa ? '  ok ' : '  NAO',
    ' ' + uso
  )
}
console.log()
console.log('minimo exigido: 4.5:1 (texto normal)')
console.log(falhas === 0 ? 'TODOS OS PARES PASSAM EM AA' : `${falhas} PAR(ES) ABAIXO DO MINIMO`)
if (falhas) process.exitCode = 1
