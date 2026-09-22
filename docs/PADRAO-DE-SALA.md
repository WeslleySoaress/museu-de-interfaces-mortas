# Padrão de sala

O que significa uma sala estar pronta. A sala do **MSN Messenger** é a
implementação de referência: qualquer dúvida sobre como fazer algo, olhe
`src/salas/Msn.tsx`.

Nenhuma sala entra no acervo sem cumprir os oito itens. Uma sala que cumpre
sete está em restauração, não aberta.

---

## 1. A pergunta

Toda sala responde a **uma** pergunta sobre como a gente vivia a tecnologia —
e nenhuma outra sala responde à mesma.

Escreva a pergunta no comentário do topo do arquivo antes de escrever qualquer
código. Se a pergunta já estiver respondida por outra sala, a sala não deve
existir: vire camada da sala que já existe.

> MSN: *como era conversar quando a conversa dependia de os dois estarem online
> ao mesmo tempo, e a linha podia cair no meio?*

Este é o item mais importante e o mais fácil de errar. O risco do museu nunca
foi ter sala demais — é ter salas que se repetem.

## 2. Arco

A sala tem começo, meio e fim. O visitante precisa poder **terminar**.

Sala sem fim vira brinquedo: mexe um pouco, cansa, sai. Sala com fim deixa uma
frase na cabeça. No MSN a conversa acaba porque a mãe atendeu o telefone e a
linha caiu — o mesmo motivo pelo qual acabava de verdade.

## 3. Texto

Plaquinha com os cinco campos obrigatórios (`src/museu/tipos.ts`), e o campo
`porQueEraAssim` explicando a **restrição** que produziu a forma — técnica,
comercial ou social. Nunca "era assim porque era a moda".

Fontes de verdade, consultadas, no mínimo uma. Número sem fonte não entra.

## 4. Interação

Pelo menos uma coisa funciona de verdade, e ela **ensina o porquê**. O critério:
se a interação pudesse ser substituída por uma captura de tela sem perda, ela
não está fazendo trabalho nenhum.

Bom: o multi-toque do celular ensina a dor de escrever assim. O eixo do telex
mostra as trocas de tabela acontecendo. O relógio da lan house apaga a tela.

## 5. Som

Sempre **sintetizado**, nunca amostra de arquivo. Isso resolve licenciamento e,
melhor, obriga a entender o som: a fita K7 e o cartão perfurado codificam dados
reais, e os testes em `scripts/` provam.

Nunca toca sozinho. Sempre atrás de um gesto explícito do visitante, com o
aviso "com som" visível antes.

## 6. Mobile

- Funciona em 360 px de largura.
- A **página** nunca rola na horizontal. A peça pode rolar dentro da própria
  moldura, se a fidelidade exigir largura fixa (o Orkut exige).
- Alvo de toque com no mínimo 44 px em qualquer coisa que se aperta.
- Nada essencial depende de passar o mouse por cima.

## 7. Acessibilidade

A regra que resolve o conflito com fidelidade histórica: **a peça não muda, a
moldura acomoda.** O Verdana 11 do Orkut fica; quem precisa de mais usa o
controle de ampliação da vitrine.

O que é obrigatório mesmo assim:

- Tudo operável por teclado, na ordem certa, com foco visível.
- Conteúdo que aparece sozinho vai em região `aria-live`.
- Enfeite de janela — os botõezinhos de minimizar e fechar que não fecham nada
  — sai da ordem de tabulação com `aria-hidden`. Botão que não faz nada é pior
  que botão nenhum.
- Todo campo com rótulo em português.
- `prefers-reduced-motion` respeitado: o tremor do zumbido e as animações somem.
- Imagem decorativa com `aria-hidden`; imagem que informa com texto alternativo.

## 8. Fidelidade e limites

- Reconstrução de memória, escrita do zero. Nenhum arquivo, logotipo, imagem
  ou som original.
- **Nenhuma tela de login em nenhuma sala.** Uma tela de senha recriada é, na
  forma, uma página de phishing — mesmo sendo museu. Toda peça abre já dentro.
- Nada sai do navegador: a política de segurança da página proíbe requisição de
  rede (veja `index.html`).

---

## Lista de conferência

```
[ ] a pergunta está escrita no topo do arquivo e não se repete no acervo
[ ] tem fim, e o fim significa alguma coisa
[ ] plaquinha com os 5 campos + fonte consultada
[ ] a interação ensina o porquê, não só imita a aparência
[ ] som sintetizado, atrás de gesto, anunciado
[ ] 360 px sem rolagem horizontal na página
[ ] teclado, foco, aria-live, enfeite fora da tabulação, reduced-motion
[ ] sem login, sem arquivo de terceiro, sem rede
```
