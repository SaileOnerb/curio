# CURIÓ — Personal Collection

**Versão 2.6.2 — GitHub Pages**

CURIÓ é um catálogo pessoal para colecionadores de action figures, criado com foco em simplicidade, organização, controle de gastos e uma interface premium inspirada em apps da Apple.

## Como acessar o CURIÓ

A versão oficial de testes é publicada pelo GitHub Pages em HTTPS:
https://saileonerb.github.io/curio/

No celular, abra esse endereço no navegador. Quando disponível, use “Instalar app” ou “Adicionar à tela inicial” para utilizar o CURIÓ como PWA.

## Importante sobre os dados
A versão atual armazena a coleção localmente no navegador usando IndexedDB. Os dados não são sincronizados automaticamente entre PC e celular. Uma coleção cadastrada no PC não aparecerá no celular e vice-versa. A sincronização entre dispositivos está planejada para a futura versão online.

## Novidades da 2.6
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

## Changelog
### V1 — Marvel Legends Collection
- Primeira versão local.
- Dashboard, Minha Coleção, Wishlist, Build-A-Figure e Financeiro.
- CRUD de figuras, imagens, busca, filtros e backup JSON.
- Primeira linguagem visual minimalista inspirada em apps da Apple.

### V2 — Figure Collection
- O projeto deixou de ser limitado a Marvel Legends.
- Suporte a fabricantes/linhas variadas, oficiais, Third Party, customs e paralelas.
- Dark mode, categorias, waves e filtros ampliados.
- Maior importância para imagens.

### V2.1 — Cadastro inteligente
- Simplificação do cadastro.
- Perfis por fabricante/linha.
- Campos condicionais e preenchimentos automáticos.
- Experimentos com Wishlist por URL.

### V2.2–V2.5 — Reestruturação
- BAF deixou de ser seção principal e passou a ser contextual.
- Wishlist separada da coleção.
- Fluxo “Adquiri”.
- Fabricante → Linha.
- Favoritos, tags e agrupamentos.
- Página individual da figura e galeria.
- Financeiro refeito com metas mensal/anual, alertas, histórico automático, análises e valor estimado da coleção.
- Migração do armazenamento para IndexedDB.
- Backup/restauração aprimorados.

### V2.5.1 — Refinamento
- Coleções deixaram a navegação principal e passaram a funcionar como organização/filtro.
- Prevenção de coleções duplicadas.
- Gerenciamento de coleções.
- Revisão da Visão Geral e das Configurações.

### V2.5.2 — Preview externo
- Projeto passou a se chamar CURIÓ.
- Revisão dos cards e enquadramento das capas.
- Correções e refinamento do dark mode.
- Wishlist e Configurações redesenhadas.
- Primeira versão preparada para testes com amigos.

### V2.6 — Mobile Preview
- Interface mobile dedicada.
- Bottom navigation.
- Galeria fullscreen com todas as fotos, zoom e navegação.
- Estrutura PWA inicial: manifest, service worker e ícones.
- Base pronta para publicação via HTTPS e evolução para a V3 online.

## Status
Preview hospedado via GitHub Pages/HTTPS. Faça backups regularmente antes de trocar de versão. Os dados permanecem locais ao navegador/dispositivo enquanto não houver sincronização online.


### V2.6.1 — HTTPS Preview
- Preparação da distribuição pelo GitHub Pages/HTTPS.
- Correção do cadastro mobile: a barra inferior não sobrepõe mais o formulário quando um modal está aberto.
- Ações Cancelar e Salvar figura permanecem acessíveis na parte inferior do cadastro.
- Ajuste de safe area para Android/iPhone.


### V2.6.2 — Ajustes mobile
- Continuidade das atualizações diretamente pelo GitHub.
- Ações Cancelar e Salvar figura voltaram ao final natural do formulário no mobile.
- Correção da sobreposição das ações sobre “Mostrar campos avançados”.
- A barra inferior de navegação permanece visível ao fundo durante o cadastro de uma figura.
- O modal de cadastro respeita o espaço da navegação inferior.


### V2.6.3 — Financeiro mobile
- Revisão do espaçamento dos cards de resumo financeiro.
- Mais separação entre os blocos “Gastos — últimos 6 meses” e “Análise do período”.
- Padding interno e altura mínima dos cards ajustados para melhorar a leitura no celular.
- Grid financeiro mobile mantido em duas colunas, com fallback para uma coluna em telas muito estreitas.


### V2.6.4 — Financeiro responsivo
- Correção da colisão entre cards financeiros em larguras intermediárias.
- Breakpoint dedicado para o resumo financeiro: quatro colunas em telas amplas e duas em telas médias/mobile.
- Espaçamento do grid financeiro isolado das regras globais de cards para manter gaps consistentes.
