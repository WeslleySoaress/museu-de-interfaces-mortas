// Prova de que o audio da fita e Kansas City Standard de verdade: geramos o
// som e DECODIFICAMOS de volta, contando cruzamentos de zero para medir a
// frequencia de cada bit. Se o texto voltar identico, o padrao esta correto.
//   node --experimental-strip-types scripts/smoke-fita.ts
import { gerarAmostras, PROGRAMA_MSX } from '../src/museu/fita.ts'

const TAXA = 44100

const { dados, amostrasCabecalho, totalBytes, amostrasPorBit } = gerarAmostras(PROGRAMA_MSX, TAXA)

console.log('amostras geradas:', dados.length, `(${(dados.length / TAXA).toFixed(2)} s)`)
console.log('bytes codificados:', totalBytes)
console.log('duracao dos dados:', ((dados.length - amostrasCabecalho) / TAXA).toFixed(2), 's')
console.log('taxa efetiva:', (totalBytes / ((dados.length - amostrasCabecalho) / TAXA)).toFixed(1), 'bytes/s')
console.log()

// Conta cruzamentos de zero na janela do bit: 1200 Hz da 2 cruzamentos,
// 2400 Hz da 4. A posicao e fracionaria, como na geracao.
function lerBit(t: number): 0 | 1 {
  const de = Math.ceil(t)
  const ate = Math.min(Math.ceil(t + amostrasPorBit), dados.length)
  let cruzamentos = 0
  for (let i = de + 1; i < ate; i++) {
    if ((dados[i - 1] < 0 && dados[i] >= 0) || (dados[i - 1] >= 0 && dados[i] < 0)) cruzamentos++
  }
  return cruzamentos >= 3 ? 1 : 0
}

let pos = amostrasCabecalho
const saida: string[] = []
let bytesOk = 0
let erros = 0

for (let n = 0; n < totalBytes; n++) {
  const partida = lerBit(pos)
  pos += amostrasPorBit
  let byte = 0
  for (let b = 0; b < 8; b++) {
    byte |= lerBit(pos) << b
    pos += amostrasPorBit
  }
  const p1 = lerBit(pos); pos += amostrasPorBit
  const p2 = lerBit(pos); pos += amostrasPorBit

  if (partida !== 0 || p1 !== 1 || p2 !== 1) erros++
  else bytesOk++
  saida.push(String.fromCharCode(byte))
}

const recuperado = saida.join('')
const identico = recuperado === PROGRAMA_MSX

console.log('--- DECODIFICACAO ---')
console.log('bits de partida/parada corretos em', bytesOk, 'de', totalBytes, 'bytes')
console.log('quadros malformados:', erros)
console.log('texto recuperado identico ao original:', identico ? 'SIM' : 'NAO')
console.log()
console.log('--- primeiras linhas lidas do audio ---')
console.log(recuperado.split('\n').slice(0, 4).join('\n'))

if (!identico) {
  console.log()
  console.log('ORIGINAL  :', JSON.stringify(PROGRAMA_MSX.slice(0, 60)))
  console.log('RECUPERADO:', JSON.stringify(recuperado.slice(0, 60)))
  process.exitCode = 1
}
