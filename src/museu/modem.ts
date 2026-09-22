/**
 * O som da discagem, sintetizado.
 *
 * Nenhum arquivo de áudio: tudo é gerado na hora com osciladores, nas
 * frequências reais que o padrão define. Isso resolve o licenciamento de
 * amostras e, melhor, torna a peça *correta* — cada bipe que você ouve é o
 * bipe que era.
 *
 * O que cada trecho realmente era:
 *  - tom de linha .... 425 Hz contínuo (padrão brasileiro; nos EUA são dois
 *                      tons somados, 350 + 440 Hz — por isso o de lá soa mais
 *                      "grave e duplo" nos filmes)
 *  - discagem ....... DTMF: cada tecla é a SOMA de duas senoides, uma da
 *                      linha e outra da coluna do teclado. Duas em vez de uma
 *                      para que ruído da linha não seja confundido com dígito.
 *  - chamada ........ 425 Hz, 1 s ligado e 4 s desligado (cadência do Brasil)
 *  - atendimento .... 2100 Hz puro: o modem do outro lado dizendo "sou modem"
 *  - negociação ..... a parte "suja". Os dois modems testam a linha e decidem
 *                      a velocidade. Quem usava aprendia a ouvir: um chiado
 *                      limpo era 56k, um chiado arrastado era queda pra 24k.
 */

const DTMF: Record<string, [number, number]> = {
  '1': [697, 1209],
  '2': [697, 1336],
  '3': [697, 1477],
  '4': [770, 1209],
  '5': [770, 1336],
  '6': [770, 1477],
  '7': [852, 1209],
  '8': [852, 1336],
  '9': [852, 1477],
  '*': [941, 1209],
  '0': [941, 1336],
  '#': [941, 1477],
}

export type Etapa =
  | 'parado'
  | 'tirando-do-gancho'
  | 'tom-de-linha'
  | 'discando'
  | 'chamando'
  | 'atendeu'
  | 'negociando'
  | 'conectado'

export type Marco = { emSegundos: number; etapa: Etapa; texto: string }

/** Uma senoide com envelope suave, para não estalar no início e no fim. */
function tom(
  ctx: AudioContext,
  destino: AudioNode,
  hz: number,
  inicio: number,
  duracao: number,
  volume = 0.12,
) {
  const osc = ctx.createOscillator()
  const ganho = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.value = hz
  ganho.gain.setValueAtTime(0, inicio)
  ganho.gain.linearRampToValueAtTime(volume, inicio + 0.01)
  ganho.gain.setValueAtTime(volume, inicio + duracao - 0.01)
  ganho.gain.linearRampToValueAtTime(0, inicio + duracao)
  osc.connect(ganho).connect(destino)
  osc.start(inicio)
  osc.stop(inicio + duracao + 0.02)
}

/** Ruído branco filtrado — a matéria-prima do chiado da negociação. */
function chiado(
  ctx: AudioContext,
  destino: AudioNode,
  inicio: number,
  duracao: number,
  centro: number,
  volume = 0.05,
) {
  const amostras = Math.max(1, Math.floor(ctx.sampleRate * duracao))
  const buffer = ctx.createBuffer(1, amostras, ctx.sampleRate)
  const dados = buffer.getChannelData(0)
  for (let i = 0; i < amostras; i++) dados[i] = Math.random() * 2 - 1

  const fonte = ctx.createBufferSource()
  fonte.buffer = buffer

  const filtro = ctx.createBiquadFilter()
  filtro.type = 'bandpass'
  filtro.frequency.value = centro
  filtro.Q.value = 1.2

  const ganho = ctx.createGain()
  ganho.gain.setValueAtTime(0, inicio)
  ganho.gain.linearRampToValueAtTime(volume, inicio + 0.05)
  ganho.gain.setValueAtTime(volume, inicio + duracao - 0.05)
  ganho.gain.linearRampToValueAtTime(0, inicio + duracao)

  fonte.connect(filtro).connect(ganho).connect(destino)
  fonte.start(inicio)
  fonte.stop(inicio + duracao)
}

/** Varredura de frequência: os "chirps" da negociação. */
function varredura(
  ctx: AudioContext,
  destino: AudioNode,
  de: number,
  para: number,
  inicio: number,
  duracao: number,
  volume = 0.09,
) {
  const osc = ctx.createOscillator()
  const ganho = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(de, inicio)
  osc.frequency.exponentialRampToValueAtTime(para, inicio + duracao)
  ganho.gain.setValueAtTime(0, inicio)
  ganho.gain.linearRampToValueAtTime(volume, inicio + 0.02)
  ganho.gain.linearRampToValueAtTime(0, inicio + duracao)
  osc.connect(ganho).connect(destino)
  osc.start(inicio)
  osc.stop(inicio + duracao + 0.02)
}

/**
 * Agenda a sequência inteira e devolve os marcos, para a tela narrar o que
 * está acontecendo em cada instante.
 */
export function discar(ctx: AudioContext, numero: string): Marco[] {
  const saida = ctx.createGain()
  saida.gain.value = 0.9
  saida.connect(ctx.destination)

  const t0 = ctx.currentTime + 0.1
  let t = t0
  const marcos: Marco[] = []
  const marcar = (etapa: Etapa, texto: string) =>
    marcos.push({ emSegundos: t - t0, etapa, texto })

  // Fora do gancho: um estalo curto.
  marcar('tirando-do-gancho', 'tirando o telefone do gancho')
  chiado(ctx, saida, t, 0.04, 1800, 0.18)
  t += 0.35

  // Tom de linha.
  marcar('tom-de-linha', 'tom de linha — 425 Hz, o som de "pode discar"')
  tom(ctx, saida, 425, t, 1.1, 0.1)
  t += 1.35

  // Discagem DTMF.
  marcar('discando', `discando ${numero}`)
  for (const caractere of numero) {
    const par = DTMF[caractere]
    if (!par) continue
    tom(ctx, saida, par[0], t, 0.1, 0.1)
    tom(ctx, saida, par[1], t, 0.1, 0.1)
    t += 0.18
  }
  t += 0.6

  // Chamando: cadência brasileira, encurtada para dois toques.
  marcar('chamando', 'chamando — 1 segundo tocando, 4 de silêncio')
  for (let i = 0; i < 2; i++) {
    tom(ctx, saida, 425, t, 1.0, 0.09)
    t += 1.0 + (i === 0 ? 1.4 : 0.5)
  }

  // Atendimento do modem remoto.
  marcar('atendeu', 'o outro lado atendeu — 2100 Hz: "eu sou um modem"')
  tom(ctx, saida, 2100, t, 1.3, 0.1)
  t += 1.5

  // Negociação: chirps sobre chiado.
  marcar('negociando', 'negociando a velocidade — é aqui que dava para ouvir a qualidade da linha')
  const inicioNegociacao = t
  chiado(ctx, saida, t, 3.4, 1400, 0.05)
  varredura(ctx, saida, 600, 1800, t + 0.1, 0.35)
  varredura(ctx, saida, 1800, 700, t + 0.5, 0.3)
  tom(ctx, saida, 1650, t + 0.95, 0.5, 0.07)
  varredura(ctx, saida, 900, 2400, t + 1.5, 0.45)
  chiado(ctx, saida, t + 2.0, 1.2, 2200, 0.06)
  varredura(ctx, saida, 2400, 1100, t + 2.4, 0.5)
  t = inicioNegociacao + 3.5

  // Conectado: o chiado some de uma vez. Esse silêncio era o prêmio.
  marcar('conectado', 'CONNECT 14400 — a linha cai em silêncio e a internet começa')

  return marcos
}

export const DURACAO_TOTAL_S = 11
