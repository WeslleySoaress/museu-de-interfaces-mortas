import type { ComponentType } from 'react'

/**
 * A plaquinha é o que separa este projeto de um exercício de nostalgia.
 *
 * Qualquer um consegue fazer uma tela parecida com o Orkut. O que quase
 * ninguém faz é explicar POR QUE aquilo era daquele jeito — as restrições
 * técnicas, comerciais e sociais que produziram aquela forma. Sem isso vira
 * piada de "lembra disso?"; com isso vira museu.
 *
 * Os cinco campos são obrigatórios e sempre na mesma ordem. A obrigatoriedade
 * é proposital: é ela que impede uma peça de entrar no acervo só porque ficou
 * bonita.
 */
export type Placa = {
  /** Como a peça é conhecida. */
  nome: string
  /** Período em que esteve viva, como o visitante reconheceria. */
  anos: string
  /** Uma frase para quem nunca viu aquilo na vida. */
  oQueEra: string
  /** A razão da forma: limitação técnica, decisão comercial, hábito da época. */
  porQueEraAssim: string
  /** O desfecho. Quase nunca foi só "algo melhor apareceu". */
  comoTerminou: string
  /**
   * O que sobrou disso hoje. É o campo mais importante do museu: nenhuma
   * dessas tecnologias desapareceu de verdade — elas mudaram de forma. Sem
   * este campo, o acervo seria um cemitério; com ele, é uma genealogia.
   */
  legado: string
  /** Um detalhe que só quem viveu sabe, ou que ninguém sabia. */
  curiosidade: string
}

/**
 * Referência consultada. Também obrigatória, pelo mesmo motivo: uma peça sem
 * fonte é uma peça que está afirmando de memória.
 */
export type Fonte = {
  titulo: string
  url: string
}

/** As eras agrupam o acervo e dão ao visitante um mapa antes do detalhe. */
export type Era = {
  id: string
  nome: string
  periodo: string
  /** Uma frase sobre o que mudava na vida das pessoas naquele intervalo. */
  resumo: string
}

type Base = {
  id: string
  /** Cor que representa a peça na entrada e na linha do tempo. */
  cor: string
  /** O ano que posiciona a peça na linha do tempo. */
  ordem: number
  era: string
}

/** Peça pronta, visitável. */
export type SalaAberta = Base & {
  estado: 'aberta'
  placa: Placa
  fontes: Fonte[]
  /** A peça em si. Funciona — não é captura de tela. */
  Peca: ComponentType
}

/**
 * Peça planejada, ainda não construída.
 *
 * Aparecer no museu antes de existir não é enfeite: mostra o recorte que o
 * acervo pretende cobrir e deixa o visitante ver o museu crescendo. Museu de
 * verdade tem ala em restauro, e ninguém acha isso estranho.
 */
export type SalaEmRestauro = Base & {
  estado: 'restauracao'
  nome: string
  /** O que a sala vai mostrar, em uma frase. */
  promessa: string
}

export type Item = SalaAberta | SalaEmRestauro

export function estaAberta(item: Item): item is SalaAberta {
  return item.estado === 'aberta'
}

export function nomeDe(item: Item): string {
  return item.estado === 'aberta' ? item.placa.nome : item.nome
}
