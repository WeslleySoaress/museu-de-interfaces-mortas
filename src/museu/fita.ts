/**
 * Kansas City Standard — o som da fita cassete, de verdade.
 *
 * Não é imitação: esta função codifica bytes reais em áudio seguindo o padrão
 * que o MSX usava para gravar programas em fita K7. O que sai pelo alto-falante
 * É o programa. O teste em scripts/smoke-fita.ts decodifica o áudio de volta e
 * confere byte a byte — é assim que sabemos que está certo, e não apenas que
 * "soa antigo".
 *
 * O padrão, em uma frase: cada bit dura sempre o mesmo tempo (1/1200 s), e a
 * diferença está na frequência —
 *
 *   bit 0 = UM ciclo de 1200 Hz
 *   bit 1 = DOIS ciclos de 2400 Hz
 *
 * Como os dois ocupam exatamente a mesma duração, o toca-fitas podia variar um
 * pouco de velocidade sem embaralhar a leitura. Era engenharia para funcionar
 * em equipamento doméstico ruim — e funcionava.
 *
 * Cada byte vai embrulhado: 1 bit de partida (0), 8 bits de dado do menos
 * significativo para o mais, e 2 bits de parada (1). Daí 11 bits por byte, ou
 * cerca de 109 bytes por segundo. Um jogo de 32 KB levava cinco minutos.
 *
 * CUIDADO COM A SÍNTESE DIGITAL: a 44100 Hz um bit ocupa 36,75 amostras — não
 * é número inteiro. Arredondar bit a bit faz o bit 0 ficar com 37 amostras e o
 * bit 1 com 36, o que quebra justamente a propriedade que define o padrão e
 * acumula erro ao longo da fita. A primeira versão desta função fazia isso e o
 * teste de ida e volta não recuperou um único byte. Por isso a posição é
 * mantida em ponto flutuante e a fase é calculada dentro da janela exata de
 * cada bit.
 */

const BAUD = 1200
const HZ_ZERO = 1200
const HZ_UM = 2400
const VOLUME = 0.3

/**
 * Escreve uma janela com exatamente `ciclos` ciclos completos, começando e
 * terminando em zero. `tInicio` e o retorno são posições fracionárias.
 */
function janela(
  dados: Float32Array,
  tInicio: number,
  duracaoAmostras: number,
  ciclos: number,
): number {
  const fim = tInicio + duracaoAmostras
  const de = Math.ceil(tInicio)
  const ate = Math.min(Math.ceil(fim), dados.length)
  for (let k = de; k < ate; k++) {
    const fracao = (k - tInicio) / duracaoAmostras
    dados[k] = Math.sin(2 * Math.PI * ciclos * fracao) * VOLUME
  }
  return fim
}

function gravarBit(dados: Float32Array, t: number, amostrasPorBit: number, bit: 0 | 1): number {
  // bit 0: 1 ciclo de 1200 Hz · bit 1: 2 ciclos de 2400 Hz · mesma duração.
  return janela(dados, t, amostrasPorBit, bit === 0 ? 1 : 2)
}

function gravarByte(dados: Float32Array, t: number, amostrasPorBit: number, byte: number): number {
  let p = gravarBit(dados, t, amostrasPorBit, 0) // partida
  for (let i = 0; i < 8; i++) {
    p = gravarBit(dados, p, amostrasPorBit, ((byte >> i) & 1) as 0 | 1) // menos significativo primeiro
  }
  p = gravarBit(dados, p, amostrasPorBit, 1) // parada
  p = gravarBit(dados, p, amostrasPorBit, 1)
  return p
}

export type FitaCodificada = {
  buffer: AudioBuffer
  cabecalhoS: number
  segundosPorByte: number
  totalBytes: number
}

/**
 * A parte pura: gera as amostras sem depender do navegador, para poder ser
 * verificada fora dele.
 */
export function gerarAmostras(texto: string, taxa: number, cabecalhoS = 1.8) {
  const bytes = Array.from(texto).map((c) => c.charCodeAt(0) & 0xff)

  const amostrasPorBit = taxa / BAUD
  const bitsPorByte = 11
  const segundosPorByte = bitsPorByte / BAUD
  const amostrasCabecalho = Math.round(cabecalhoS * taxa)
  const total = amostrasCabecalho + Math.ceil(bytes.length * bitsPorByte * amostrasPorBit) + 256

  const dados = new Float32Array(total)

  // Cabeçalho: tom contínuo de 2400 Hz. Servia para o computador perceber que
  // havia sinal e se sincronizar — é o apito longo antes do chiado começar.
  for (let k = 0; k < amostrasCabecalho; k++) {
    dados[k] = Math.sin((2 * Math.PI * HZ_UM * k) / taxa) * VOLUME
  }

  let t = amostrasCabecalho
  for (const byte of bytes) t = gravarByte(dados, t, amostrasPorBit, byte)

  return {
    dados,
    cabecalhoS,
    segundosPorByte,
    totalBytes: bytes.length,
    amostrasCabecalho,
    amostrasPorBit,
  }
}

export function codificarFita(ctx: AudioContext, texto: string, cabecalhoS = 1.8): FitaCodificada {
  const taxa = ctx.sampleRate
  const { dados, segundosPorByte, totalBytes } = gerarAmostras(texto, taxa, cabecalhoS)

  const buffer = ctx.createBuffer(1, dados.length, taxa)
  buffer.getChannelData(0).set(dados)

  return { buffer, cabecalhoS, segundosPorByte, totalBytes }
}

export const FREQUENCIAS = { zero: HZ_ZERO, um: HZ_UM, baud: BAUD }

/** O programa que vai na fita. É ele que você ouve. */
export const PROGRAMA_MSX = `10 SCREEN 1:COLOR 15,4,4
20 CLS
30 PRINT "  *** CIDADE PERDIDA ***"
40 PRINT
50 PRINT "  UMA AVENTURA BRASILEIRA"
60 PRINT "  (C) 1987 - FITA K7"
70 PRINT
80 PRINT "  APERTE UMA TECLA"
90 IF INKEY$="" THEN 90
100 GOTO 20
`
