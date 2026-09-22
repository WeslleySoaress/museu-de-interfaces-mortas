// Verificação estrutural do acervo.
//
// Existe por causa de um bug real: o menu do Orkut usava <a href="#perfil">,
// e como o museu roteia por hash, clicar ali expulsava o visitante da sala de
// volta para a entrada. Ninguém pegou porque ninguém estava olhando.
//
// ERRO  = quebra o museu. Falha a verificação.
// DÍVIDA = a sala funciona mas não cumpre docs/PADRAO-DE-SALA.md. Só reporta.
//
//   node scripts/smoke-salas.mjs

import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const ACERVO = readFileSync('src/museu/acervo.ts', 'utf8')
const DIR_SALAS = 'src/salas'
const erros = []
const dividas = []

const erro = (m) => erros.push(m)
const divida = (m) => dividas.push(m)

// ---------- 1. ler o acervo ----------

const blocos = ACERVO.split(/\n  \{\n/).slice(1)
const pecas = blocos.map((b) => ({
  id: (b.match(/id: '([^']+)'/) || [])[1],
  estado: (b.match(/estado: '([^']+)'/) || [])[1],
  peca: (b.match(/Peca: (\w+)/) || [])[1],
  ordem: Number((b.match(/ordem: (\d+)/) || [])[1]),
  bruto: b,
}))

const abertas = pecas.filter((p) => p.estado === 'aberta')
const ids = new Set(pecas.map((p) => p.id))

console.log(`acervo: ${pecas.length} peças (${abertas.length} abertas)\n`)

// ---------- 2. invariantes do acervo ----------

const vistos = new Set()
for (const p of pecas) {
  if (!p.id) erro('peça sem id no acervo')
  if (vistos.has(p.id)) erro(`id repetido: ${p.id}`)
  vistos.add(p.id)
  if (!['aberta', 'restauracao'].includes(p.estado)) erro(`${p.id}: estado inválido`)
  if (!Number.isFinite(p.ordem)) erro(`${p.id}: sem ano de ordenação`)
}

// Mínimo por campo: nome e período são curtos por natureza; os de prosa não
// podem ser preenchidos com uma linha para passar na verificação.
const CAMPOS = [
  ['nome', 2],
  ['anos', 4],
  ['oQueEra', 80],
  ['porQueEraAssim', 80],
  ['comoTerminou', 80],
  ['legado', 80],
  ['curiosidade', 80],
]
for (const p of abertas) {
  for (const [campo, minimo] of CAMPOS) {
    const m = p.bruto.match(new RegExp(campo + ":\\s*\\n?\\s*'([^']*)'"))
    if (!m) erro(`${p.id}: plaquinha sem o campo ${campo}`)
    else if (m[1].trim().length < minimo)
      erro(`${p.id}: campo ${campo} com ${m[1].trim().length} caracteres (mínimo ${minimo})`)
  }
  const fontes = (p.bruto.match(/\{ titulo: '/g) || []).length
  if (fontes === 0) erro(`${p.id}: nenhuma fonte citada`)
  if (!p.peca) erro(`${p.id}: aberta mas sem componente`)
}

// ---------- 3. cada peça tem componente e folha de estilo ----------

const arquivos = readdirSync(DIR_SALAS)
for (const p of abertas) {
  if (!p.peca) continue
  const tsx = `${p.peca}.tsx`
  if (!arquivos.includes(tsx)) {
    erro(`${p.id}: componente ${tsx} não existe`)
    continue
  }
  const fonte = readFileSync(join(DIR_SALAS, tsx), 'utf8')
  const css = (fonte.match(/import '\.\/([\w-]+\.css)'/) || [])[1]
  if (!css) divida(`${p.id}: ${tsx} não importa folha de estilo própria`)
  else if (!existsSync(join(DIR_SALAS, css))) erro(`${p.id}: ${css} não existe`)
  // O acervo carrega as salas sob demanda (`const X = lazy(...)`), mas aceita
  // também o import direto, caso alguma peça precise ser carregada de imediato.
  const declarada =
    ACERVO.includes(`const ${p.peca} = lazy(`) || ACERVO.includes(`import { ${p.peca} }`)
  if (!declarada) erro(`${p.id}: ${p.peca} não declarado no acervo`)
}

// ---------- 4. links que sequestram a rota (o bug do Orkut) ----------

for (const arq of arquivos.filter((a) => a.endsWith('.tsx'))) {
  const fonte = readFileSync(join(DIR_SALAS, arq), 'utf8')
  const linhas = fonte.split('\n')
  linhas.forEach((linha, i) => {
    if (linha.trimStart().startsWith('*') || linha.includes('{/*')) return
    const achados = [...linha.matchAll(/href="#([\w-]*)"/g)]
    for (const a of achados) {
      const alvo = a[1]
      if (alvo === '') continue // voltar para a entrada é legítimo
      if (!ids.has(alvo)) {
        erro(`${arq}:${i + 1} — href="#${alvo}" não é sala: ao clicar, o visitante é expulso da peça`)
      }
    }
  })
  // links montados com template levam a salas de verdade: conferir os literais
  for (const a of fonte.matchAll(/href=\{`#\$\{[^}]+\}`\}/g)) void a
}

// ---------- 5. dívida com o padrão ----------

const salasTsx = abertas
  .filter((p) => p.peca && arquivos.includes(`${p.peca}.tsx`))
  .map((p) => ({ id: p.id, arq: `${p.peca}.tsx` }))

let comPergunta = 0
let comAoVivo = 0
for (const { id, arq } of salasTsx) {
  const fonte = readFileSync(join(DIR_SALAS, arq), 'utf8')
  if (fonte.includes('A PERGUNTA')) comPergunta++
  else divida(`${id}: sem A PERGUNTA no topo do arquivo (padrão, item 1)`)

  if (/aria-live|role="log"/.test(fonte)) comAoVivo++
  else if (/setMensagens|setLinhas|setRecados|setComentarios|setLivro/.test(fonte))
    divida(`${id}: conteúdo aparece sozinho sem região aria-live (padrão, item 7)`)
}

// ---------- resultado ----------

if (erros.length) {
  console.log('ERROS')
  for (const e of erros) console.log('  ✗ ' + e)
  console.log()
}

if (dividas.length) {
  console.log(`DÍVIDA COM O PADRÃO (${dividas.length})`)
  for (const d of dividas.slice(0, 8)) console.log('  · ' + d)
  if (dividas.length > 8) console.log(`  · … e mais ${dividas.length - 8}`)
  console.log()
}

console.log(`peças com a pergunta declarada: ${comPergunta}/${salasTsx.length}`)
console.log(`peças com região ao vivo: ${comAoVivo}/${salasTsx.length}`)
console.log()
console.log(erros.length === 0 ? 'NENHUM ERRO' : `${erros.length} ERRO(S)`)

if (erros.length) process.exitCode = 1
