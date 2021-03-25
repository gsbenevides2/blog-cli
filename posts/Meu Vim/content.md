Olá meu consagrado tudo bem? Hoje vim falar sobre o tão aclamado [Vim](https://www.vim.org/), odiado por uns que nunca conseguiram sair e ficaram presos na linha de comando, e amado pelos que gostam de terminais e keybinds. Mas se você não sabe, o ele é um editor de texto, clone do VI, onde toda sua interface é através do terminal.

Eu pessoalmente uso o [NeoVim](https://neovim.io/), uma cópia melhorada do Vim, uso ele pelo fato de não eu possuir computador, então programo minhas aplicações através do celular, e rodar editores de código complexos como [Visual Studio Code](https://code.visualstudio.com/) é complicado. Além disso uso uma máquina no [Google Cloud Shell](https://cloud.google.com/shell), e me conecto a ela através de SSH no [GCloud CLI](https://cloud.google.com/sdk/gcloud), então a única interface que tenho de comunicação com a máquina é o terminal.

## Minha opinião

Não existe o melhor editor de código. Pense no editor como uma ferramenta de trabalho, a melhor ferramenta é a que lhe torna mais produtivo, então se você é mais produtivo no vim, use vim, se é melhor no VSCode use-o, só use aquilo que lhe torna melhor.

## Vantagens e Desvantagens

**Vantagens:**

- Faz tudo via teclado, isso é uma vantagem para quem é bom com atalhos de teclado e comandos.
- Muito otimizado, pelo fato de não ter UI(Interface de Usuário) complexa com botões, menus e caixas de texto.

**Desvantagens:**

- Talvez você acha ele difícil de aprender (principalmente no começo) a usa-lo, pela falta de UI, exigir comandos para opera-lo.

## Minha configuração

![Meu Vim](/assents/meu vim.png)

Tanto o NeoVim como o Vim são altamente configuraveis e tem suporte a plugins (extensões). Aliás os plugins são essenciais para o desenvolvedor em minha opinião. Deixarei a lista de alguns plugins aqui:

- [CoC:](https://github.com/neoclide/coc.nvim) Usado para inteligência de código, o InteliSense do VSCode para vim.
- [QuickUI](https://github.com/skywind3000/vim-quickui): Uma UI construída sobre o terminal, com menus, listas e popups.
- [Drácula](https://github.com/dracula/vim): Um tema perfeito para os Devs.
- [Vim-Plug](https://github.com/junegunn/vim-plug): Um gerenciador de plugins.

Minha configuração está disponível nesse [repositório](https://github.com/gsbenevides2/neovim-config), ela vem com vários plugins já configurados para desenvolvimento com Javascript, HTML, CSS, Typescript e JSON. Use e abuse-a, faça o que quiser com ela, e abra issues para me mostrar plugins e etc.

## Finalizando

Obrigado por te lido até aqui, beijos no seu coração e até mais.
