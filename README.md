# CURIÓ — Personal Collection

**Versão atual do produto: 4.3.0** · Catálogo pessoal de action figures para computador e celular, com site online e aplicativo Android compartilhando a mesma conta e coleção.

**[Abrir o CURIÓ](https://curiocollection.com.br)** · [Preview da PR #9](https://deploy-preview-9--curiovault.netlify.app)

O site é hospedado no Netlify. Autenticação, banco e fotos ficam no Supabase; os e-mails de autenticação usam o Resend. O GitHub Pages preserva a fase offline anterior e não é o endereço principal da plataforma atual.

## Acesso e dados

Crie uma conta, confirme o e-mail e entre com sua senha. A mesma conta permite acessar os dados no site e no APK. A sessão é restaurada ao atualizar a página. Tema, privacidade dos valores e preferências são salvos pela plataforma.

Os registros são separados por usuário com Row Level Security (RLS). Fotos da coleção e capas personalizadas usam Storage privado. A imagem do QR Pix é um recurso público de apoio, com envio restrito à administração do projeto.

O aplicativo Android empacota a interface com Capacitor e continua usando os serviços online. Não oferece, nesta fase, funcionamento completo offline. Backup JSON continua recomendado: sincronização não substitui uma cópia externa dos seus dados.

## Recursos atuais

- **Início:** resumo da coleção, aquisições recentes, figura de destaque com recorte próprio e coleções escolhidas para destaque na parte inferior da Home.
- **Coleção:** figuras com fabricante, linha, escala, aquisição e galeria; edição, exclusão, favoritos, filtros, ordenação, seleção múltipla, grade com densidade ajustável e visualização em lista. O filtro de fabricantes mostra os que têm figuras cadastradas.
- **Coleções personalizadas:** botão Nova coleção separado de Adicionar figura; nome, fabricante descritivo, capa personalizada e destaque na Home. Gerenciar coleções permite editar, destacar, renomear e excluir agrupamentos. O fabricante da coleção não altera o fabricante de suas figuras.
- **Wishlist:** cadastro e edição de desejos com link, nome, preço e foto; abertura da loja e transferência para cadastro ao adquirir. A análise automática de links existe, mas ainda falha nas lojas testadas; preenchimento manual permanece necessário.
- **Financeiro:** valores registrados nas figuras, histórico de aquisições e metas ajustáveis em Editar metas. Privacidade dos valores da Home disponível nas configurações.
- **Configurações e perfil:** tema claro/escuro, nome e foto de perfil, fabricantes personalizados, importar/exportar backup, lembretes e Nulificador Total. Contatos e Apoie o CURIÓ ficam nesta área.
- **Interface:** tutorial de primeiro acesso dispensável, confirmações com identidade visual, seletores personalizados, login com Enter e visibilidade temporária da senha; navegação por deslize no mobile.

O seletor de arquivos, permissões do aparelho e outras superfícies do sistema podem continuar nativos. O APK e o site usam a mesma base visual, mas exigem validação em cada plataforma.

## Imagens, backups e apoio

As imagens são carregadas progressivamente; as capas personalizadas de coleções são buscadas sob demanda. Importação e exportação online foram validadas entre contas. Os backups portáveis incluem imagens, por isso ainda podem ser grandes. A exportação comprimida não elimina o custo de baixar as fotos necessárias para montar um backup completo.

No Android, a exportação usa o compartilhamento do sistema: confirme que o arquivo foi efetivamente salvo. Antes de operações de exclusão, preserve um backup externo. Commits e checkpoints do GitHub guardam código, não a coleção particular dos usuários.

O QR Pix original é administrado pelo Supabase em `curio-assets/support/pix.png`; sua leitura foi confirmada pelo responsável. Instruções em [QR Pix do apoio](docs/support-qr.md). A configuração das coleções personalizadas está em [Coleções](docs/collection-details.md).

## Android: gerar e testar no Windows

Instale Node.js 22 ou superior, Android Studio, o SDK exigido pelo projeto e um JDK compatível (JDK 21 foi usado no piloto). Extraia o projeto atualizado e abra o terminal na pasta que contém `package.json`:

```powershell
npm ci
npm run android:sync
npm run android:open
```

Se o Android Studio não abrir automaticamente, abra manualmente a pasta `android` desse mesmo projeto. Se ocorrer Invalid Gradle JDK configuration, selecione o JDK 21 instalado nas configurações do Gradle.

Após a sincronização, gere o APK pelo menu Build do Android Studio. O APK de teste fica em:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

O piloto foi compilado e usado em dispositivo: login e uso geral foram confirmados, assim como a criação de coleção com capa. Para atualizar, gere um novo APK e instale mantendo a assinatura compatível. Publicar o site não atualiza o APK instalado. Assinatura definitiva, distribuição pública e publicação em loja ainda estão pendentes. Consulte [Piloto Android](docs/android-pilot.md).

## Desenvolvimento e publicação

- Interface compartilhada: `index-online.html`.
- Integração Supabase: `online-data.js`.
- Seletores compartilhados: `platform-ui.js`.
- Deslize mobile: `mobile/swipe.js`, empacotado em `platform-swipe.js`.
- Build Android: `scripts/build-mobile.mjs`, configuração Capacitor e pasta `android`.
- Build Netlify: `netlify.toml`; análise de produto em `netlify/functions/product-preview.mjs`.
- Banco: migrações em `supabase/migrations`.

A evolução online está na branch `feat/online-foundation`, PR #9. O README exibido na página principal do repositório depende da branch selecionada; a branch `main` ainda conserva a documentação e o aplicativo da fase offline.

Publicações ocorrem a cada **três updates funcionais**, salvo antecipação autorizada. Uma mudança compartilhada deve acompanhar site e Android; o pacote do APK é gerado separadamente. Documentação e correções do mesmo update não aumentam a contagem. Veja [Política de atualizações](docs/release-policy.md).

## Versões e estado da próxima atualização

| Versão | Marco |
| --- | --- |
| 1.x–2.x | Aplicativo local e PWA, com dados no dispositivo. |
| 3.0.0 | Fase online: contas, banco e fotos sincronizados. |
| 4.0.0 | Fase multiplataforma: site e piloto Android. Coleções com capa e destaque validadas no APK. |
| 4.0.1 | Alinhamento do gerenciador de coleções: ações em colunas consistentes no desktop e grade de duas colunas no mobile. Publicação autorizada; validação visual em dispositivo ainda pendente. |

Correções e refinamentos usam `4.0.x`; novas funcionalidades relevantes usam `4.x.0`. A versão `5.0.0` fica reservada a uma transformação significativa da estrutura ou experiência, não à quantidade de updates. Os pacotes passam a usar nomes como `curio-4.0.1.zip`. A versão do pacote, o indicador da interface e o versionName Android estão alinhados em 4.0.1; o versionCode Android é 2.

## Pendências conhecidas

- Tornar confiável a análise dos links da Wishlist para obter nome, preço e foto. Testes com Amazon e AliExpress ainda não tiveram o resultado esperado.
- Implementar a integração de afiliados. Cadastros e exemplos de links foram coletados para Amazon, AliExpress, Shopee e Mercado Livre; aprovação não foi confirmada para todos. A 4.1.0 permite salvar um link de afiliado manual por item, preservando o original, com aviso de comissão. Conversão automática e validação de atribuição pelos programas permanecem pendentes.
- Continuar medindo peso e duração dos backups, importação e carregamento em coleções maiores. Não há percentual universal de redução comprovado.
- Validar a fluidez do deslize em aparelhos reais; alterações na animação não garantem desempenho uniforme.
- Validar visualmente o alinhamento de 4.0.1, inclusive nomes longos e telas estreitas.
- Completar testes Android de compartilhamento de backups, seleção de fotos, botão Voltar, teclado, rotação e janelas sobrepostas.
- Implementar retorno dos links de confirmação e recuperação ao APK (deep links); por enquanto o fluxo de e-mail usa o site.
- Consolidar assinatura e distribuição do Android e manter os indicadores técnicos de versão coerentes com o produto.

E-mails de confirmação estão funcionando. A aparência e o fluxo completo de recuperação devem ser revisados em conjunto com os templates configurados no Supabase; alterações nesses templates não são publicadas automaticamente pelo repositório.

## Histórico

Os registros abaixo documentam a fase offline. Descrições de IndexedDB, snapshots locais e versões 2.7.x pertencem àquela fase e não são promessas de equivalência com os fluxos online atuais.

## Histórico da fase offline — versões 1.x e 2.x
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
- Durante a validação, as métricas da sonda ficaram disponíveis em Configurações > Saúde dos dados. O tempo de atribuição das capas media o agendamento e a definição de `src`, sem garantir a conclusão da decodificação ou pintura de todas as imagens. A interface da sonda foi removida após a validação.
- A validação no aparelho confirmou as capas da Coleção. O estado corrigido foi preservado em `checkpoint-pos-poda-capas-2.7.8` (`4f5aacf`).
- Esses checkpoints protegem o **código**. O backup JSON da coleção permanece separado e deve ser exportado no próprio aparelho; commits e branches não contêm as fotos nem os dados locais do usuário.
- Primeiro teste da PR #2 no aparelho: as 61 capas apareceram na Coleção; DOM com capas 12 ms, pintura 73,5 ms e 61 `src` atribuídos em 255,2 ms (medição pontual). Com placeholders, DOM 20,1 ms e pintura 84,9 ms. Esses valores não medem o carregamento completo das imagens.
- Regressão observada nesse teste: os quatro cards recentes da Home mostraram o ícone no lugar das fotos. A correção mantém a atribuição posterior apenas para a grade da Coleção e entrega as capas reais diretamente aos cards da Home, que reutilizam `card()`. A falha da Home foi investigada antes de validar a poda.
- Correção complementar da Home: `renderHome()` usava `.map(card)`, que passa `(figura, índice)`; depois da nova assinatura de `card(f, withoutCovers, coverIndex)`, os índices 1–3 ativavam acidentalmente o modo sem capas. A chamada agora usa `.map(f => card(f))`, sem repassar o índice. O teste estático confirmou as quatro capas e o usuário confirmou a correção visual no aparelho.
- **Poda validada no aparelho em 26/09/2026:** o usuário confirmou que todas as capas da Coleção aparecem e que as quatro capas de Aquisições recentes voltaram após a correção da PR #5. A medição anterior à correção da Home registrou DOM de 12 ms com capas, pintura de 73,5 ms e atribuição de 61 capas em 255,2 ms. O checkpoint posterior preserva esta versão corrigida.

#### Configurações mais simples (2.7.8)
- Os números detalhados da sonda e o painel Saúde dos dados saíram da tela principal de Configurações após a validação da poda.
- A otimização de imagens existentes permanece visível. Diagnóstico, exportação de dados encontrados e snapshots continuam disponíveis em **Ferramentas de recuperação**, fechado por padrão.
- Os mecanismos automáticos de integridade, backup e snapshots permanecem ativos.

### 4.1.0
- Link de afiliado opcional no cadastro e edição da Wishlist, com prioridade no botão Abrir na loja e aviso discreto. HTTPS validado; parâmetros do link preservados.
- Filtros e visualização da coleção reunidos em janela; pesquisa e adição permanecem na aba.
- Modais acima da navegação mobile; barra inferior oculta durante janelas.
- Site e pacote Android alinhados em 4.1.0 (versionCode 3).

### 4.2.0 — em preparação
- Idioma português/inglês com escolha nas Configurações, detecção do aparelho e preferência na conta. Catálogo inicial; mensagens dinâmicas ainda em revisão. Detalhes em [Idiomas](docs/languages.md). Sem deploy neste lote (2/3).

## 4.3.0

Conversão de exibição BRL/USD/EUR com cotação diária e data de referência em Configurações. Registros e backups continuam em BRL. Inclui ajustes 4.1.1 e idioma 4.2.0. Veja docs/currency.md.
