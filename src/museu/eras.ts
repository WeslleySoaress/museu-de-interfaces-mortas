import type { Era } from './tipos'

/**
 * As quatro eras do acervo.
 *
 * O corte não é por década nem por tecnologia: é pelo que mudava na vida de
 * quem usava. A pergunta que separa uma era da seguinte é sempre "onde ficava
 * o computador, e quem tinha acesso a ele".
 */
export const ERAS: Era[] = [
  {
    id: 'antes-do-micro',
    nome: 'Antes do micro',
    periodo: 'até 1979',
    resumo:
      'O computador era um lugar, não um objeto. Ficava numa sala refrigerada da empresa ou da universidade, e você não chegava perto dele: entregava seu trabalho a um operador e esperava. Comunicação à distância era coisa de empresa, em máquinas que imprimiam em papel.',
  },
  {
    id: 'micro-em-casa',
    nome: 'O computador em casa',
    periodo: '1980 – 1992',
    resumo:
      'A máquina entra na sala de estar, ligada na televisão. Ainda não conversa com ninguém — é uma ilha. O que chega de fora vem por fita cassete, por revista impressa com listagens para digitar, ou pela linha telefônica em serviços que a companhia telefônica controlava.',
  },
  {
    id: 'internet-chega',
    nome: 'A internet chega',
    periodo: '1993 – 1998',
    resumo:
      'A máquina aprende a telefonar. Estar online vira um estado com hora marcada, custo por minuto e o telefone de casa ocupado. A internet é escrita, lenta e artesanal — e quem está nela sente que chegou cedo em algum lugar.',
  },
  {
    id: 'anos-2000',
    nome: 'Os anos 2000',
    periodo: '1999 – 2009',
    resumo:
      'A internet deixa de ser sala de aula e vira praça. Perfil, foto, recado, comunidade. No Brasil isso acontece em grande parte fora de casa — na lan house da esquina, pagando por hora.',
  },
]

export function eraPorId(id: string): Era | undefined {
  return ERAS.find((e) => e.id === id)
}
