# CURIÓ — Personal Collection

**Versão 2.7.6 — PWA / Instalação**

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


### V2.7.0 — Estabilidade e PWA
- Aviso antes de descartar alterações não salvas no cadastro de figuras.
- Detecção preventiva de figuras potencialmente duplicadas antes de salvar.
- Confirmação visual após salvar uma figura ou edição.
- Fluxo “Adquiri” corrigido: o item só é removido da Wishlist depois que a figura é salva com sucesso.
- Ordenação da coleção por data, nome, preço e favoritos.
- Botão para limpar filtros ativos.
- Backup atualizado para o formato 2.7 e registro da data/hora do último backup nas Configurações.
- Service Worker efetivamente registrado no HTTPS.
- Estratégia de atualização do PWA revisada: navegação prioriza a versão online e usa o cache como fallback offline.
- Limpeza automática de caches antigos e ativação imediata de novas versões.

#### Em preparação para próximas revisões 2.7.x
- Gerenciamento avançado de fotos: escolher capa, reorganizar e excluir imagens individualmente.
- Refinamento da ficha de detalhes da figura.
- Revisão visual adicional de estados vazios, modais e breakpoints.


### V2.7.1 — Identidade visual
- O ícone oficial do CURIÓ passa a fazer parte da interface da plataforma.
- Marca da barra lateral redesenhada com símbolo, nome CURIÓ e assinatura Personal Collection.
- Ícone configurado como favicon e integrado aos metadados do aplicativo/PWA.
- Metadados para experiência de instalação e tela inicial adicionados.
- Cache do PWA atualizado para distribuir a nova identidade visual.


### V2.7.2 — Design System CURIÓ
- Consolidação da linguagem visual premium e minimalista da plataforma.
- Tokens próprios para superfícies, texto, bordas, raios, sombras e movimento.
- Hierarquia tipográfica refinada em títulos, subtítulos e seções.
- Cards, painéis e itens da coleção com profundidade e acabamento consistentes.
- Botões e controles com estados de interação mais claros e resposta tátil visual.
- Barra de filtros transformada em uma superfície visual coesa.
- Campos de formulário com foco e contraste padronizados.
- Modais com tratamento de profundidade e desfoque revisado.
- Tema escuro alinhado ao mesmo sistema visual do tema claro.
- Microinterações em desktop e mobile, respeitando a preferência de movimento reduzido do sistema.
- Cache do PWA atualizado para 2.7.2.


### V2.7.3 — Sistema de Atualizações
- Detecção automática de uma nova versão pelo Service Worker.
- Aviso visual dentro do CURIÓ quando uma atualização estiver pronta.
- Ações “Agora não” e “Atualizar” sem apagar os dados locais da coleção.
- Atualização aplicada pelo novo Service Worker seguida de recarregamento automático.
- Verificação periódica de atualização durante sessões longas.
- Nova área em Configurações com versão instalada, status e verificação manual.
- Interface do aviso alinhada ao Design System CURIÓ e adaptada ao mobile/dark mode.


### V2.7.4 — Visual Refresh
- Cards da coleção redesenhados com foco maior nas fotografias das figuras.
- Coleção mobile em duas colunas, com layout compacto inspirado em uma estante digital.
- Favoritos sobrepostos à fotografia com acabamento translúcido.
- Estados vazios redesenhados com a identidade visual do CURIÓ e ações contextuais.
- Ficha da figura refinada com dados de aquisição organizados em blocos visuais.
- Ajustes de navegação, profundidade, contraste e hierarquia visual.
- Base visual preparada para a nova iconografia consistente do CURIÓ.
- Cache e sistema de atualização migrados para 2.7.4.


### V2.7.5 — Editor de Capa
- Editor de enquadramento 4:5 integrado ao cadastro de figuras.
- Arrastar para reposicionar a imagem e controle de zoom.
- Suporte a gesto de arrastar no mobile e roda do mouse no desktop.
- Prévia fiel à proporção utilizada nos cards da coleção.
- Ação para redefinir o enquadramento.
- A fotografia original é preservada separadamente da capa renderizada.
- Figuras existentes podem reabrir o editor através de “Editar enquadramento”.
- Dados do recorte ficam salvos junto ao exemplar no IndexedDB.
- Cache e sistema de atualização migrados para 2.7.5.


### V2.7.6 — PWA / Instalação
- Manifesto PWA revisado com ID e escopo estáveis para o GitHub Pages.
- Start URL explícita em /curio/.
- Ícone maskable dedicado para melhor integração com launchers Android.
- Tela de Configurações agora informa o estado de instalação do aplicativo.
- Botão “Instalar CURIÓ” aparece quando o navegador disponibiliza o prompt nativo.
- Detecção de execução em modo standalone e do evento appinstalled.
- Service Worker atualizado para cache 2.7.6 e novo ícone PWA.

### V2.7.7 — Catálogo & Privacidade
- Expansão do catálogo com Blokees, Funko, Diamond Select Toys, Storm Collectibles, Jada Toys e Super7.
- Bandai Spirits, McFarlane Toys, DC Direct, DC Collectibles e Mattel receberam novas linhas relevantes.
- Hasbro ganhou a linha Marvel Universe.
- Escala automática por linha quando o padrão é confiável; linhas de escala variável permanecem livres para preenchimento manual.
- Filtro por coleção priorizado e corrigido no mobile, permitindo visualizar somente uma coleção criada pelo usuário.
- Campo de Tags removido do cadastro; dados antigos permanecem preservados para compatibilidade.
- Coleções passam a aparecer na ficha da figura no lugar das Tags legadas.
- Privacidade financeira na Home: opção para ocultar Total gasto e Valor da coleção.
- Área de backup refinada no mobile.
- Fluxo “Apagar todos os dados” com dupla confirmação e exigência de digitar APAGAR.
- Exportação de backup disponível dentro do próprio fluxo de exclusão, sem precisar sair do modal.
- Persistência do novo enquadramento da capa reforçada no IndexedDB.
- Proteção contra descarte de outras alterações do formulário preservada após salvar um novo enquadramento.
- Revisão do fluxo de atualização da PWA: a nova versão aguarda a confirmação do usuário antes de assumir o controle.
- Cache, versão instalada e sistema de atualização migrados oficialmente para 2.7.7.

### V2.7.8 — Backup inteligente
- Novo lembrete não invasivo de backup baseado em alterações relevantes.
- Primeiro aviso após 10 alterações desde o último backup; ao escolher “Agora não”, reaparece após mais 5 alterações.
- Botão “Fazer backup” diretamente no aviso.
- Configuração para ativar ou desativar os lembretes.
- Contador de alterações desde o último backup em Configurações → Dados e backup.
- Exportar um backup zera o contador e reinicia o ciclo de lembretes.
- Versão e cache PWA atualizados para 2.7.8.
