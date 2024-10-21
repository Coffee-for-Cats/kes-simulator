# K&S
"Knob and Switch" é um computador teórico utilizado para o aprendizado sobre arquitetura de computadores.
O Simulador deste repositório interpreta o código (em texto) e executa as operações de maneira muito similar ao original.
Tal implementação é atualmente utilizada para o ensino da primeira linguagem ASM do curso de Engenharia de Computação, na UERGS em Guaíba/RS.

## Por que isso existe?
Já existe um simulador online, porém vários problemas de usabilidade dificultavam o ensino do K&S.
  ### Vantagens:
  - Editor Multi-linha; permitindo copy/paste e manutenção do código.
  - Funcionalidades de Execução mais rápida e instantânea.
  - Disponível em celulares móveis.
  - Problemas de input e crashes corrigidos.

  ### Desvantagens:
  - Não simula de fato todo o circuito, apenas interpreta o código.
  - Não é software oficial de nenhuma faculdade ou instituição.
      -> Sinta-se livre para copiar e modificar, apenas mantenha gratuito; agradeço se manter meu nome no readme.
  - Algumas proxys bloqueiam as URL's da Vercel.

## Processo de desenvolvimento e testagem
Quando criei esse projeto, apresentei primeiramente para o monitor da matéria (Arquitetura de Computadores I).
Após testarmos, aperfeiçoei o projeto e apresentei para a professora da matéria (Adriane Parraga), que gostou da iniciativa e resolveu utilizá-lo no ensino.
O projeto já foi utilizado no semestre de 2024/1, no ensino online.

Graças a essa professora consegui uma bolsa (SSP) e consegui me manter nos estudos.

## Projeto original
https://users.dickinson.edu/~braught/kands/KandS2/machine.html


## For devs:
I recommend Biome.js lint on save.
To build js:
`bun build ./src/main.ts --outfile=script.js --watch`
