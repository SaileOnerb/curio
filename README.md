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

### Camada de segurança de dados (2.7.8)
- Diagnóstico e recuperação permanente em modo somente leitura.
- Checkpoint local de integridade: detecta quando um banco antes populado aparece inesperadamente vazio sem substituir o último estado conhecido.
- Exclusão total agora exige a exportação bem-sucedida de um backup novo antes de liberar a continuação.
- Importação valida a estrutura e bloqueia backups vazios antes de qualquer gravação.
- A importação mostra a contagem de figuras, Wishlist e coleções e continua usando mesclagem por ID, sem apagar previamente os dados atuais.

### Wishlist — refinamentos 2.7.8
- Exclusão agora pede confirmação em modal do CURIÓ.
- Após excluir, há 4 segundos para desfazer e restaurar o item completo.
- O modal de edição mostra a loja detectada pelo link em tempo real.
- “Marcar como adquirida” também está disponível dentro da edição e abre o cadastro da figura com nome, preço e loja preenchidos.

- Exclusão de figuras da coleção principal agora usa confirmação do CURIÓ e oferece 4 segundos para desfazer, restaurando o registro completo.

### Refinamentos de entrada e feedback (2.7.8)
- Salvamentos de figura, Wishlist e metas financeiras usam confirmação discreta “Salvo ✓”, sem interromper o fluxo com alertas de sucesso.
- Links da Wishlist são normalizados: aceita endereço sem protocolo, padroniza HTTPS, remove fragmentos e parâmetros comuns de rastreamento e limpa barras finais desnecessárias.
- Campos monetários aceitam formatos brasileiros e internacionais comuns, incluindo `129,90`, `R$ 129,90`, `1.299,90` e `1299.90`, formatando em pt-BR ao sair do campo.

### Seleção e ações em lote (2.7.8)
- A Coleção ganhou modo Selecionar para marcar várias figuras de uma vez.
- Permite selecionar todas as figuras atualmente visíveis pelos filtros.
- Figuras selecionadas podem ser adicionadas ou removidas de uma ou mais coleções em lote.
- Exclusão em lote exige confirmação e oferece 4 segundos para desfazer, restaurando os registros completos.

- No mobile, o modo de seleção em lote é ativado com toque longo (~500 ms) sobre uma figura; o botão Selecionar fica reservado ao desktop. Arrastar para rolar cancela o toque longo para evitar seleções acidentais.

### Camada de segurança de dados — concluída (2.7.8)
- Mantém até 3 snapshots locais automáticos antes de importações, exclusão total e restaurações.
- Snapshots mostram data, versão e contagens e podem ser exportados ou restaurados; restaurar cria antes um snapshot do estado atual.
- Importação valida o arquivo, cria snapshot antes de escrever e tenta rollback para o estado anterior se houver falha.
- Backups antigos reconhecíveis podem omitir arrays e continuam compatíveis; backup totalmente vazio é rejeitado.
- Checkpoint de integridade agora detecta banco vazio e quedas superiores a 50% quando havia ao menos 10 registros, preservando o último checkpoint saudável.
- Exclusão total é marcada como intencional para não gerar falso alerta de integridade; o backup JSON externo continua obrigatório no fluxo de apagar tudo.
- Snapshots locais protegem contra erros do app, mas não substituem backup externo porque podem ser removidos junto com os dados do site pelo navegador/sistema.

### Auditoria responsiva (2.7.8)
- Revisão estrutural para larguras compactas de 320/360/390/430 px e layouts intermediários/tablet.
- Home usa estatísticas em duas colunas no mobile e cards de coleção em uma coluna, com tipografia fluida e proteção contra overflow.
- Filtros, Wishlist, Financeiro, Configurações, formulários, modais, snapshots, toasts e seleção em lote receberam limites de largura e reorganização responsiva.
- Em 360 px ou menos, ações críticas e backup passam a empilhar quando necessário; tablet recebe grade e espaçamento intermediários.
- Inputs mobile mantêm tamanho adequado para toque e prevenção de zoom automático.

### Painel Saúde dos dados (2.7.8)
- Novo painel permanente em Configurações > Dados e backup com resumo de figuras, Wishlist, coleções e snapshots.
- Exibe último backup, alterações pendentes, versão e data do checkpoint de integridade.
- Usa Storage API quando disponível para informar persistência e estimativa de uso/quota do armazenamento.
- Estado geral indica Saudável ou Atenção conforme alerta de integridade e situação do backup.
- Botão Atualizar diagnóstico refaz as leituras sem alterar os dados da coleção.
