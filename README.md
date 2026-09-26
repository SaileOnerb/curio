# CURIÓ — Personal Collection

**Versão atual: 2.7.8** · Catálogo pessoal de action figures para usar no navegador ou instalar como aplicativo. Aceita figuras de diferentes fabricantes e linhas, incluindo Third Party, customs e paralelas.

## Acessar o aplicativo

1. Abra **[saileonerb.github.io/curio](https://saileonerb.github.io/curio/)** no navegador do celular ou do computador.
2. Para usar como app no celular, vá a **Mais → Aplicativo** e toque em **Instalar CURIÓ**, caso o botão esteja disponível. Você também pode usar a opção de instalação ou **Adicionar à tela inicial** oferecida pelo navegador.
3. Quando o CURIÓ avisar que há uma nova versão, toque em **Atualizar**. Em **Mais → Atualizações**, você pode verificar manualmente.

O app funciona como PWA e mantém uma cópia para uso offline após carregar. Os dados são guardados **neste navegador/dispositivo**; ainda não existe conta nem sincronização automática entre celular, tablet e computador.

## Guia das cinco abas

No celular, use a barra inferior. No computador, as mesmas áreas aparecem na navegação lateral; **Mais** corresponde a **Configurações**.

### 1. Início

Mostra o total de figuras e fabricantes, os valores da coleção e as quatro aquisições mais recentes. Toque em **Adicionar figura** para cadastrar uma peça. Se preferir, oculte os valores financeiros em **Mais → Privacidade**.

### 2. Coleção

É a estante com todas as figuras. Use a busca e os filtros por coleção, fabricante, linha e favoritos; escolha a ordem de exibição no seletor. Toque em uma figura para ver seus detalhes, fotos e dados de aquisição. Use **Adicionar** para cadastrar, **Gerenciar coleções** para organizar grupos e o coração para favoritar. No celular, pressione um card por cerca de meio segundo para iniciar a seleção múltipla e adicionar ou remover figuras de coleções; no computador, use **Selecionar**.

No cadastro, informe o nome e os dados que quiser manter. Fabricante e linha ajudam a preencher campos pertinentes. Você pode escolher uma capa, ajustar seu enquadramento e adicionar outras fotos.

### 3. Wishlist

Guarde figuras que pretende comprar sem fazer um cadastro completo: cole o link da loja e, se quiser, informe nome e preço estimado; depois toque em **Adicionar**. O CURIÓ guarda o link para você voltar à loja. Na lista, é possível editar, excluir ou usar **Adquiri**, que abre o cadastro da coleção com os dados disponíveis. O item sai da Wishlist após a figura ser salva.

A versão atual **não extrai automaticamente** foto, nome e preço da página da loja. A Wishlist inteligente está planejada para uma etapa futura.

### 4. Financeiro

Acompanhe gastos do mês e do ano, total gasto, valor estimado da coleção, gráfico dos últimos seis meses e histórico de compras. As informações vêm dos valores e datas registrados nas figuras. Para definir **meta mensal** e **meta anual**, acesse **Mais → Financeiro (em Configurações)**.

### 5. Mais / Configurações

Ajuste tema claro ou escuro, privacidade dos valores da Home, metas, fabricantes personalizados e coleções. Em **Dados e backup**, use **Exportar JSON** para guardar uma cópia da coleção e **Importar JSON** para recuperar ou mesclar registros. O painel **Saúde dos dados** mostra contagens, último backup, alterações pendentes, snapshots e estado do armazenamento. Aqui também ficam as opções de atualização e instalação.

## Seus dados e backups

- O CURIÓ salva figuras, fotos, Wishlist, coleções e preferências no **IndexedDB** do navegador usado. Abrir o site em outro navegador ou dispositivo não traz esses dados automaticamente.
- Faça backups em **Mais → Dados e backup → Exportar JSON** e confirme que o arquivo foi salvo no dispositivo. Guarde uma cópia fora do navegador, especialmente antes de trocar de aparelho ou limpar dados do site.
- A importação valida o arquivo e mescla registros por ID. Confira as contagens mostradas antes de confirmar uma restauração.
- O app pode criar até três snapshots locais antes de operações críticas. Eles ajudam em recuperações, mas ficam sujeitos à perda dos dados do navegador; **não substituem o arquivo JSON exportado**.
- Os checkpoints `checkpoint-*` no GitHub preservam versões do **código**. Eles não incluem suas figuras nem suas fotos.

## Estado do projeto

A versão publicada é um app estático em HTML, CSS e JavaScript, hospedado no GitHub Pages. A navegação seletiva e a poda de carregamento das capas foram validadas no aparelho em 26/09/2026. O foco atual é estabilidade e refinamento. Sincronização entre dispositivos, extração automática dos links da Wishlist, afiliados e Price Tracker não fazem parte da versão 2.7.8.

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

#### Camada de segurança de dados (2.7.8)
- Diagnóstico e recuperação permanente em modo somente leitura.
- Checkpoint local de integridade: detecta quando um banco antes populado aparece inesperadamente vazio sem substituir o último estado conhecido.
- Exclusão total agora exige a exportação bem-sucedida de um backup novo antes de liberar a continuação.
- Importação valida a estrutura e bloqueia backups vazios antes de qualquer gravação.
- A importação mostra a contagem de figuras, Wishlist e coleções e continua usando mesclagem por ID, sem apagar previamente os dados atuais.

#### Wishlist — refinamentos 2.7.8
- Exclusão agora pede confirmação em modal do CURIÓ.
- Após excluir, há 4 segundos para desfazer e restaurar o item completo.
- O modal de edição mostra a loja detectada pelo link em tempo real.
- “Marcar como adquirida” também está disponível dentro da edição e abre o cadastro da figura com nome, preço e loja preenchidos.

- Exclusão de figuras da coleção principal agora usa confirmação do CURIÓ e oferece 4 segundos para desfazer, restaurando o registro completo.

#### Refinamentos de entrada e feedback (2.7.8)
- Salvamentos de figura, Wishlist e metas financeiras usam confirmação discreta “Salvo ✓”, sem interromper o fluxo com alertas de sucesso.
- Links da Wishlist são normalizados: aceita endereço sem protocolo, padroniza HTTPS, remove fragmentos e parâmetros comuns de rastreamento e limpa barras finais desnecessárias.
- Campos monetários aceitam formatos brasileiros e internacionais comuns, incluindo `129,90`, `R$ 129,90`, `1.299,90` e `1299.90`, formatando em pt-BR ao sair do campo.

#### Seleção e ações em lote (2.7.8)
- A Coleção ganhou modo Selecionar para marcar várias figuras de uma vez.
- Permite selecionar todas as figuras atualmente visíveis pelos filtros.
- Figuras selecionadas podem ser adicionadas ou removidas de uma ou mais coleções em lote.
- Exclusão em lote exige confirmação e oferece 4 segundos para desfazer, restaurando os registros completos.

- No mobile, o modo de seleção em lote é ativado com toque longo (~500 ms) sobre uma figura; o botão Selecionar fica reservado ao desktop. Arrastar para rolar cancela o toque longo para evitar seleções acidentais.

#### Camada de segurança de dados — concluída (2.7.8)
- Mantém até 3 snapshots locais automáticos antes de importações, exclusão total e restaurações.
- Snapshots mostram data, versão e contagens e podem ser exportados ou restaurados; restaurar cria antes um snapshot do estado atual.
- Importação valida o arquivo, cria snapshot antes de escrever e tenta rollback para o estado anterior se houver falha.
- Backups antigos reconhecíveis podem omitir arrays e continuam compatíveis; backup totalmente vazio é rejeitado.
- Checkpoint de integridade agora detecta banco vazio e quedas superiores a 50% quando havia ao menos 10 registros, preservando o último checkpoint saudável.
- Exclusão total é marcada como intencional para não gerar falso alerta de integridade; o backup JSON externo continua obrigatório no fluxo de apagar tudo.
- Snapshots locais protegem contra erros do app, mas não substituem backup externo porque podem ser removidos junto com os dados do site pelo navegador/sistema.

#### Auditoria responsiva (2.7.8)
- Revisão estrutural para larguras compactas de 320/360/390/430 px e layouts intermediários/tablet.
- Home usa estatísticas em duas colunas no mobile e cards de coleção em uma coluna, com tipografia fluida e proteção contra overflow.
- Filtros, Wishlist, Financeiro, Configurações, formulários, modais, snapshots, toasts e seleção em lote receberam limites de largura e reorganização responsiva.
- Em 360 px ou menos, ações críticas e backup passam a empilhar quando necessário; tablet recebe grade e espaçamento intermediários.
- Inputs mobile mantêm tamanho adequado para toque e prevenção de zoom automático.

#### Painel Saúde dos dados (2.7.8)
- Novo painel permanente em Configurações > Dados e backup com resumo de figuras, Wishlist, coleções e snapshots.
- Exibe último backup, alterações pendentes, versão e data do checkpoint de integridade.
- Usa Storage API quando disponível para informar persistência e estimativa de uso/quota do armazenamento.
- Estado geral indica Saudável ou Atenção conforme alerta de integridade e situação do backup.
- Botão Atualizar diagnóstico refaz as leituras sem alterar os dados da coleção.

#### Refinamento da seleção múltipla (2.7.8)
- Barra de ações em lote redesenhada como action sheet flutuante coerente com o design do CURIÓ.
- Cabeçalho dedicado com contador e botão circular de fechar.
- Hierarquia visual: Coleções como ação principal, Selecionar todas como secundária e Excluir como ação destrutiva.
- Mobile organiza Coleções em largura total e as ações secundária/destrutiva lado a lado; telas muito estreitas empilham as ações.
- Mantidos os mesmos handlers e fluxos funcionais de seleção, coleções, exclusão e cancelamento.

#### Diagnóstico e poda da Coleção (2.7.8)
- A Poda 1A limpa foi validada e preservada em `checkpoint-pos-poda-1a-clean-2.7.8` (`fca465a`). Melhorou a navegação entre abas; a primeira abertura da Coleção continuou mais lenta.
- A segunda sonda separou filtro, ordenação, `card()`, `join`, inserção no DOM e pintura. Com 61 figuras e 61 capas (~14,29 MB), a medição de referência registrou `card()` 5,5 ms, `join` 63,9 ms, DOM 501,6 ms e pintura 77,8 ms.
- A terceira sonda (PR #1) comparou as mesmas 61 figuras: com capas, `card()` 5,6 ms, `join` 33,5 ms, DOM 447,2 ms e pintura 63,3 ms; com placeholders, `card()` 5,3 ms, `join` 0,1 ms, DOM 12,7 ms e pintura 34,7 ms. A diferença de DOM foi de 434,5 ms (~97%). O teste troca tanto a string Base64 no HTML quanto o processamento das imagens; não separa isoladamente esses custos.
- Antes da poda das capas, o estado da `main` foi preservado em `checkpoint-pre-poda-capas-2.7.8` (`100281a`). Esse é o ponto de retorno da alteração da PR #2.
- A poda da PR #2 monta os cards sem Base64 no `innerHTML` e atribui as capas em lotes de até 12 por frame após a inserção do DOM. Uma renderização nova cancela os lotes pendentes da anterior. As imagens armazenadas no IndexedDB não são modificadas.
- As métricas da sonda continuam disponíveis em Configurações > Saúde dos dados. O tempo de atribuição das capas mede o agendamento e a definição de `src`, não garante a conclusão da decodificação ou pintura de todas as imagens.
- A validação no aparelho confirmou as capas da Coleção. O estado corrigido foi preservado em `checkpoint-pos-poda-capas-2.7.8` (`4f5aacf`).
- Esses checkpoints protegem o **código**. O backup JSON da coleção permanece separado e deve ser exportado no próprio aparelho; commits e branches não contêm as fotos nem os dados locais do usuário.
- Primeiro teste da PR #2 no aparelho: as 61 capas apareceram na Coleção; DOM com capas 12 ms, pintura 73,5 ms e 61 `src` atribuídos em 255,2 ms (medição pontual). Com placeholders, DOM 20,1 ms e pintura 84,9 ms. Esses valores não medem o carregamento completo das imagens.
- Regressão observada nesse teste: os quatro cards recentes da Home mostraram o ícone no lugar das fotos. A correção mantém a atribuição posterior apenas para a grade da Coleção e entrega as capas reais diretamente aos cards da Home, que reutilizam `card()`. A falha da Home foi investigada antes de validar a poda.
- Correção complementar da Home: `renderHome()` usava `.map(card)`, que passa `(figura, índice)`; depois da nova assinatura de `card(f, withoutCovers, coverIndex)`, os índices 1–3 ativavam acidentalmente o modo sem capas. A chamada agora usa `.map(f => card(f))`, sem repassar o índice. O teste estático confirmou as quatro capas e o usuário confirmou a correção visual no aparelho.
- **Poda validada no aparelho em 26/09/2026:** o usuário confirmou que todas as capas da Coleção aparecem e que as quatro capas de Aquisições recentes voltaram após a correção da PR #5. A medição anterior à correção da Home registrou DOM de 12 ms com capas, pintura de 73,5 ms e atribuição de 61 capas em 255,2 ms. O checkpoint posterior preserva esta versão corrigida.
