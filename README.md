# Museu de Interfaces Mortas

[![CI](https://github.com/WeslleySoaress/museu-de-interfaces-mortas/actions/workflows/ci.yml/badge.svg)](https://github.com/WeslleySoaress/museu-de-interfaces-mortas/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Um museu onde as peças funcionam. Você não olha a captura de tela — você
clica, digita, ouve. Cada sala tem uma plaquinha explicando não só o que era,
mas **por que era daquele jeito** e **o que sobrou disso hoje**.

**21 peças, de 1970 a 2006.** Do cartão perfurado e do telex, passando pelo
videotexto, pela fita cassete e pela discagem, até o Orkut, a lan house e o
primeiro YouTube.

## Rodando

```bash
npm install
npm run dev
```

## Verificação

```bash
npm run verificar
```

| Verificação | O que garante |
| --- | --- |
| `tsc -b --noEmit` | tipos |
| `smoke-salas.mjs` | acervo íntegro, nenhum link que expulse o visitante da peça, toda plaquinha com fonte |
| `smoke-hollerith.ts` | o cartão perfurado codifica e lê de volta |
| `smoke-ita2.ts` | o telex codifica e lê de volta, inclusive o defeito da troca perdida |
| `smoke-fita.ts` | o áudio da fita K7 é Kansas City Standard de verdade |
| `smoke-contraste.mjs` | todo par de cor da moldura passa em WCAG AA |

As três peças que codificam dados são verificadas do mesmo jeito: gera,
decodifica de volta e compara byte a byte. É o que separa "soa antigo" de
"está correto".

## Como uma sala é feita

[docs/PADRAO-DE-SALA.md](docs/PADRAO-DE-SALA.md) — oito itens, com lista de
conferência. A sala do MSN é a implementação de referência.

O primeiro item é o que importa: **toda sala responde a uma pergunta, e
nenhuma outra responde à mesma.** A pergunta fica escrita no topo do arquivo
da sala, antes do código.

## Decisões

- **Sem servidor, sem conta, sem senha.** A política de segurança da página
  proíbe qualquer requisição de rede depois de carregada. O que o visitante
  digita morre na aba dele.
- **Nenhuma tela de login em nenhuma sala.** Uma tela de senha recriada é, na
  forma, uma página de phishing — mesmo sendo museu.
- **Todo som é sintetizado**, nunca amostra de arquivo. Nenhum arquivo, imagem
  ou logotipo de terceiro em peça nenhuma.
- **A peça não muda, a moldura acomoda.** O Verdana 11 do Orkut é fidelidade
  histórica; quem precisa de mais usa o controle de ampliação da vitrine.
- **As salas carregam sob demanda.** O primeiro carregamento é de 91 kB
  comprimidos, e cada peça chega quando o visitante entra nela.

## Publicando

`npm run build` gera `dist/`. O `.github/workflows/deploy.yml` publica no
GitHub Pages a cada push na `main` — em Settings → Pages, escolha "GitHub
Actions" como origem.

## Licença

[MIT](LICENSE) — Copyright © 2026 Weslley Soares.

A licença cobre o código, os textos e as reconstruções, escritos do zero.
Marcas e nomes citados nas plaquinhas pertencem a seus titulares e aparecem em
caráter histórico e documental.
