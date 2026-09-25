CURIÓ — Personal Collection
Versão 2.6.1 — HTTPS Preview

CURIÓ é um catálogo pessoal para colecionadores de action figures, criado com foco em simplicidade, organização, controle de gastos e uma interface premium inspirada em apps da Apple.

COMO ACESSAR O CURIÓ

NO PC — MODO LOCAL
1. Baixe e extraia todo o conteúdo do arquivo ZIP para uma pasta.
2. Abra a pasta CURIÓ.
3. Dê dois cliques em index.html.
4. O CURIÓ abrirá no seu navegador padrão.
5. Para manter seus dados disponíveis, prefira usar sempre o mesmo navegador e não apague os dados do site/navegador.
6. Use a opção de Backup do CURIÓ regularmente, principalmente antes de trocar de versão.

Não é necessário instalar Node.js, npm ou qualquer servidor para usar o CURIÓ dessa forma.

NO CELULAR — VERSÃO ATUAL
A versão 2.6 já possui interface adaptada para celulares, mas abrir arquivos HTML locais em Android/iPhone varia conforme o navegador e o sistema. Por isso, o método recomendado para testes no celular é acessar o CURIÓ por um endereço web HTTPS quando uma versão hospedada estiver disponível.

Se você copiar esta versão local para o celular e o navegador permitir abrir index.html, a interface mobile poderá ser testada, mas recursos de PWA, Service Worker e instalação como aplicativo podem não funcionar usando file://.

NO CELULAR — QUANDO HOSPEDADO EM HTTPS
1. Abra o endereço do CURIÓ no Safari (iPhone/iPad) ou em um navegador compatível no Android.
2. Use normalmente pelo navegador ou adicione o CURIÓ à tela inicial.
3. No iPhone/iPad: abra o menu Compartilhar e escolha “Adicionar à Tela de Início”.
4. No Android: use “Instalar app” ou “Adicionar à tela inicial”, quando a opção aparecer.
5. Depois de instalado, o CURIÓ poderá abrir em uma janela própria, com aparência semelhante à de um aplicativo.

IMPORTANTE SOBRE OS DADOS
A versão atual armazena a coleção localmente no navegador usando IndexedDB. Os dados não são sincronizados automaticamente entre PC e celular. Uma coleção cadastrada no PC não aparecerá no celular e vice-versa. A sincronização entre dispositivos está planejada para a futura versão online.

NOVIDADES DA 2.6
- Navegação móvel inferior.
- Layout responsivo dedicado, sem simplesmente encolher a interface desktop.
- Cards adaptados a telas pequenas.
- Modais de cadastro/detalhes em tela cheia no celular.
- Galeria fullscreen: capa e fotos adicionais são clicáveis.
- Navegação por setas/teclado no desktop e swipe no celular.
- Zoom por roda do mouse, duplo clique/toque e gesto de pinça.
- Manifest PWA e Service Worker preparados para a futura hospedagem HTTPS.
- Ícone inicial do CURIÓ.
- Mantidos IndexedDB, backup, dark mode, Wishlist, filtros e Financeiro.

CHANGELOG
V1 — Marvel Legends Collection
- Primeira versão local.
- Dashboard, Minha Coleção, Wishlist, Build-A-Figure e Financeiro.
- CRUD de figuras, imagens, busca, filtros e backup JSON.
- Primeira linguagem visual minimalista inspirada em apps da Apple.

V2 — Figure Collection
- O projeto deixou de ser limitado a Marvel Legends.
- Suporte a fabricantes/linhas variadas, oficiais, Third Party, customs e paralelas.
- Dark mode, categorias, waves e filtros ampliados.
- Maior importância para imagens.

V2.1 — Cadastro inteligente
- Simplificação do cadastro.
- Perfis por fabricante/linha.
- Campos condicionais e preenchimentos automáticos.
- Experimentos com Wishlist por URL.

V2.2–V2.5 — Reestruturação
- BAF deixou de ser seção principal e passou a ser contextual.
- Wishlist separada da coleção.
- Fluxo “Adquiri”.
- Fabricante → Linha.
- Favoritos, tags e agrupamentos.
- Página individual da figura e galeria.
- Financeiro refeito com metas mensal/anual, alertas, histórico automático, análises e valor estimado da coleção.
- Migração do armazenamento para IndexedDB.
- Backup/restauração aprimorados.

V2.5.1 — Refinamento
- Coleções deixaram a navegação principal e passaram a funcionar como organização/filtro.
- Prevenção de coleções duplicadas.
- Gerenciamento de coleções.
- Revisão da Visão Geral e das Configurações.

V2.5.2 — Preview externo
- Projeto passou a se chamar CURIÓ.
- Revisão dos cards e enquadramento das capas.
- Correções e refinamento do dark mode.
- Wishlist e Configurações redesenhadas.
- Primeira versão preparada para testes com amigos.

V2.6 — Mobile Preview
- Interface mobile dedicada.
- Bottom navigation.
- Galeria fullscreen com todas as fotos, zoom e navegação.
- Estrutura PWA inicial: manifest, service worker e ícones.
- Base pronta para publicação via HTTPS e evolução para a V3 online.

STATUS
Preview. Faça backups regularmente antes de trocar de versão. Os dados locais dependem do navegador/origem em que o CURIÓ é executado.


V2.6.1 — HTTPS Preview
- Preparação da distribuição pelo GitHub Pages/HTTPS.
- Correção do cadastro mobile: a barra inferior não sobrepõe mais o formulário quando um modal está aberto.
- Ações Cancelar e Salvar figura permanecem acessíveis na parte inferior do cadastro.
- Ajuste de safe area para Android/iPhone.
